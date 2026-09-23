/**
 * CCIP Enrichment Data Service
 *
 * Fetches dynamic pool data, rate limits, and verifier (CCV) data from the
 * CCIP GraphQL API.
 *
 * All token address resolution (from tokens.json) and chain name mapping
 * (directory key → selector name) are handled by the reference-data-resolver.
 * Address normalization for GraphQL is handled by address-utils.
 *
 * Caching: LRU cache with 60s TTL — deduplicates concurrent requests and
 * avoids repeated GraphQL calls within a Vercel serverless invocation.
 */

import { LRUCache } from "lru-cache"
import { executeGraphQLQuery } from "~/lib/ccip/graphql/client.ts"
import { TOKEN_POOL_LANES_WITH_POOLS_QUERY } from "~/lib/ccip/graphql/queries/token-pool-lanes.ts"
import { TOKEN_POOLS_QUERY } from "~/lib/ccip/graphql/queries/token-pools.ts"
import { normalizeAddressForQuery } from "~/lib/ccip/graphql/utils/address-utils.ts"
import {
  resolveTokenAddress,
  resolveAllTokenAddresses,
  resolveCanonicalSymbolByAddress,
  resolveOnChainSymbol,
  resolvePoolType,
  toSelectorName,
  getAllTokenSymbols,
  getChainFamilyForDirectoryKey,
} from "~/lib/ccip/graphql/utils/reference-data-resolver.ts"
import {
  extractVersion,
  extractRawType,
  normalizePoolType,
  isKnownPoolType,
} from "~/lib/ccip/graphql/utils/type-version-parser.ts"
import { normalizeAddressForDisplay } from "~/lib/ccip/graphql/utils/address-display.ts"
import { getVerifiersByNetwork, getVerifier } from "~/config/data/ccip/data.ts"
import type { Environment } from "~/config/data/ccip/types.ts"
import type {
  RawTokenRateLimits,
  RateLimiterConfig,
  RateLimiterDirections,
  LaneVerifierInfo,
} from "~/lib/ccip/types/index.ts"
import type {
  GetTokenPoolLanesWithPoolsQuery,
  GetTokenPoolLanesWithPoolsQueryVariables,
  GetTokenPoolsQuery,
  GetTokenPoolsQueryVariables,
} from "~/lib/ccip/graphql/__generated__/graphql.ts"

// ---------- Exported types ----------

export interface PoolInfo {
  address: string
  rawType: string
  type: string
  version: string
  thresholdAmount: string | null
}

export type PoolData = Record<string, PoolInfo> // directoryKey → PoolInfo

// ---------- Pool type resolution ----------

/**
 * Resolves the token transfer mechanism pool type for a token on a chain.
 *
 * The live Atlas `typeAndVersion` string is parsed first (via `normalizePoolType`).
 * New/unrecognized pool contract classes (e.g. XERC20, CCTP, Lombard, Managed
 * variants) parse to a verbatim string that is NOT a valid `POOL_MECHANISM_MAP` key
 * and would surface as "Unsupported pool mechanism". In that case we fall back to the
 * curated `poolType` from tokens.json — the authoritative, human-maintained
 * classification — so the mechanism still resolves correctly.
 *
 * This keeps live data authoritative when it is understood, while making the curated
 * reference data the safety net, so a newly-shipped pool class never regresses the UI.
 */
function resolveMechanismPoolType(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string,
  rawType: string
): string {
  const normalized = normalizePoolType(rawType)
  if (isKnownPoolType(normalized)) return normalized

  const curated = resolvePoolType(environment, tokenSymbol, directoryKey)
  if (curated) {
    console.warn(
      `[CCIP GraphQL] Unrecognized pool class "${rawType}" for ${tokenSymbol}@${directoryKey}; ` +
        `using curated poolType "${curated}"`
    )
    return curated
  }

  console.warn(
    `[CCIP GraphQL] Unrecognized pool class "${rawType}" for ${tokenSymbol}@${directoryKey}; ` +
      `no curated poolType fallback available`
  )
  return normalized
}

// ---------- Cache ----------

const queryCache = new LRUCache<string, Promise<unknown>>({
  max: 500,
  ttl: 60_000,
})

function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = queryCache.get(key)
  if (hit) return hit as Promise<T>

  const promise = fetcher().catch((error) => {
    queryCache.delete(key)
    throw error
  })

  queryCache.set(key, promise)
  return promise
}

// ---------- Rate limit helpers ----------

function toRateLimiterConfig(capacity: unknown, rate: unknown, isEnabled: unknown): RateLimiterConfig {
  return {
    capacity: String(capacity ?? "0"),
    rate: String(rate ?? "0"),
    isEnabled: Boolean(isEnabled),
  }
}

function toRateLimiterDirections(
  inCap: unknown,
  inRate: unknown,
  inEnabled: unknown,
  outCap: unknown,
  outRate: unknown,
  outEnabled: unknown
): RateLimiterDirections | null {
  if (inCap == null && outCap == null) return null
  return {
    in: toRateLimiterConfig(inCap, inRate, inEnabled),
    out: toRateLimiterConfig(outCap, outRate, outEnabled),
  }
}

// ---------- Verifier / threshold parsing ----------

type RawLaneInfoPayload = {
  inboundCCVs?: unknown
  outboundCCVs?: unknown
  thresholdInboundCCVs?: unknown
  thresholdOutboundCCVs?: unknown
  // USDC proxy-specific fields (from PoolAddressesUpdated / LockOrBurnMechanismUpdated events)
  mechanism?: unknown
  pools?: unknown
}

/**
 * Normalizes a threshold amount value to a string.
 *
 * The `info` / `poolInfo` GraphQL fields are typed as `JSON` scalars, so
 * `graphql-request` parses them into JS objects via `JSON.parse`. Large
 * integer `thresholdAmount` values (e.g. `1e24`) become JS floats and
 * `String(float)` renders them in scientific notation (e.g. `"1e+24"`),
 * which breaks downstream `formatUnits` parsing.
 *
 * This function converts numbers to full integer strings without scientific
 * notation. For values above `Number.MAX_SAFE_INTEGER` (2^53), some precision
 * may already be lost — this is a limitation of the `JSON` scalar type and
 * can only be fully fixed by the API exposing a raw string field.
 */
function normalizeThresholdAmount(value: unknown): string | null {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    // Convert to a full integer string, avoiding scientific notation.
    // BigInt handles arbitrarily large integers, but the input number may
    // have already lost precision above 2^53.
    try {
      return BigInt(Math.trunc(value)).toString()
    } catch {
      return String(value)
    }
  }
  return null
}

/**
 * Extracts the threshold amount from a pool `info`/`poolInfo` JSON blob.
 */
function parseThresholdAmount(poolInfo: unknown): string | null {
  if (!poolInfo || typeof poolInfo !== "object") {
    return null
  }
  return normalizeThresholdAmount((poolInfo as { thresholdAmount?: unknown }).thresholdAmount)
}

/**
 * Parses a JSON array of verifier addresses.
 * Returns null when the payload is missing or malformed (downstream API error),
 * distinguishing it from an empty [] (configured with no verifiers).
 */
function parseAddressList(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null
  }
  const addresses = value.filter((entry): entry is string => typeof entry === "string")
  return addresses.length === value.length ? addresses : null
}

/**
 * The mechanism value in the USDC proxy's `info` blob that indicates CCTP v2
 * with CCV. When this mechanism is active, the proxy's `getRequiredCCVs()`
 * returns the CCTP verifier (wired as an immutable), but since it's never
 * emitted in an event, Atlas doesn't populate the standard `outboundCCVs` /
 * `inboundCCVs` arrays. We synthesize them from `verifiers.json` instead.
 */
const CCTP_CCV_MECHANISM = "cctpV2PoolWithCCV"

/**
 * Looks up the CCTP verifier address for a given network from `verifiers.json`.
 * The CCTP verifier is stored as the resolver address (the front-door contract
 * that `USDCTokenPoolProxy.getRequiredCCVs()` returns).
 *
 * Different networks may have different CCTP verifier addresses, so this is
 * always resolved per-network.
 */
function getCCTPVerifierAddress(networkId: string, environment: Environment): string | null {
  const verifiers = getVerifiersByNetwork({ networkId, environment })
  const cctpVerifier = verifiers.find((v) => v.id === "cctp")
  return cctpVerifier?.address ?? null
}

/**
 * For USDC proxy pools, the `info` blob has a different schema than
 * `AdvancedPoolHooks` — it contains `mechanism` and `pools` instead of the
 * standard CCV address arrays. When the mechanism is `cctpV2PoolWithCCV`,
 * the CCTP verifier is required but not present in the blob.
 *
 * This function synthesizes the standard `LaneVerifierInfo` shape by looking
 * up the CCTP verifier address from `verifiers.json` for the given network.
 * It only runs when the standard CCV arrays are absent (null), so normal
 * `AdvancedPoolHooks` pools are unaffected.
 *
 * @param networkId The directory key of the chain this lane blob belongs to
 *   (source network for outbound, dest network for inbound). Must match the
 *   keys in verifiers.json (e.g. "avalanche-fuji-testnet", not the selector
 *   name "avalanche-testnet-fuji").
 * @param environment The CCIP environment (mainnet/testnet)
 */
function synthesizeCCTPVerifierInfo(
  laneInfo: unknown,
  networkId: string,
  environment: Environment,
  thresholdAmount: string | null
): LaneVerifierInfo | null {
  if (!laneInfo || typeof laneInfo !== "object") {
    return null
  }

  const payload = laneInfo as RawLaneInfoPayload

  // Only synthesize for the CCTP-via-CCV mechanism
  if (typeof payload.mechanism !== "string" || payload.mechanism !== CCTP_CCV_MECHANISM) {
    return null
  }

  const cctpAddress = getCCTPVerifierAddress(networkId, environment)
  if (!cctpAddress) {
    return null
  }

  // The CCTP verifier is a required (base) CCV — not threshold-based
  return {
    inboundCCVs: [cctpAddress],
    outboundCCVs: [cctpAddress],
    thresholdInboundCCVs: [],
    thresholdOutboundCCVs: [],
    thresholdAmount,
  }
}

/**
 * Parses the lane `info` blob into verifier sets, pairing it with the
 * threshold amount parsed from the lane `poolInfo` blob.
 *
 * For standard pools (burnMint, lockRelease, etc.) with `AdvancedPoolHooks`,
 * the `info` blob contains the CCV address arrays directly.
 *
 * For USDC proxy pools, the `info` blob has a different schema (mechanism +
 * pools) and the CCTP verifier address is not present. When the mechanism is
 * `cctpV2PoolWithCCV`, we synthesize the CCV arrays from `verifiers.json`.
 *
 * @param networkId The directory key of the chain this lane blob belongs to
 *   (used for CCTP verifier lookup from verifiers.json). Must be a directory
 *   key (e.g. "avalanche-fuji-testnet"), not a selector name.
 * @param environment The CCIP environment (mainnet/testnet)
 */
function parseLaneInfo(
  laneInfo: unknown,
  thresholdAmount: string | null,
  networkId: string,
  environment: Environment
): LaneVerifierInfo | null {
  if (!laneInfo || typeof laneInfo !== "object") {
    return null
  }

  const payload = laneInfo as RawLaneInfoPayload
  const outboundCCVs = parseAddressList(payload.outboundCCVs)
  const inboundCCVs = parseAddressList(payload.inboundCCVs)
  const thresholdOutboundCCVs = parseAddressList(payload.thresholdOutboundCCVs)
  const thresholdInboundCCVs = parseAddressList(payload.thresholdInboundCCVs)

  // Standard AdvancedPoolHooks path: CCV arrays are present (even if empty [])
  if (outboundCCVs !== null || inboundCCVs !== null) {
    return {
      inboundCCVs,
      outboundCCVs,
      // Atlas may not include threshold arrays for USDC proxy lanes (they
      // don't use threshold-based CCV). Default to [] instead of null so
      // buildVerifiersResponse doesn't treat it as a downstream error.
      thresholdInboundCCVs: thresholdInboundCCVs ?? [],
      thresholdOutboundCCVs: thresholdOutboundCCVs ?? [],
      thresholdAmount,
    }
  }

  // USDC proxy fallback: synthesize CCTP verifier from verifiers.json
  const synthesized = synthesizeCCTPVerifierInfo(laneInfo, networkId, environment, thresholdAmount)
  if (synthesized) {
    return synthesized
  }

  // Neither standard CCV arrays nor a recognizable USDC mechanism — return
  // the raw parsed values (all nulls) so downstream treats it as unconfigured
  return {
    inboundCCVs,
    outboundCCVs,
    thresholdInboundCCVs,
    thresholdOutboundCCVs,
    thresholdAmount,
  }
}

// ---------- Pool data ----------

export async function fetchPoolDataForToken(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string
): Promise<PoolInfo | null> {
  const tokenAddress = resolveTokenAddress(environment, tokenSymbol, directoryKey)
  if (!tokenAddress) return null

  const network = toSelectorName(environment, directoryKey)
  const addr = normalizeAddressForQuery(tokenAddress)

  try {
    return await cached(`pool|${environment}|${addr}|${network}`, async () => {
      const result = await executeGraphQLQuery<GetTokenPoolsQuery, GetTokenPoolsQueryVariables>(TOKEN_POOLS_QUERY, {
        first: 10,
        condition: { token: addr, network },
      })

      const node = result.allCcipTokenPools?.nodes?.find((n) => n.tokenPool)
      if (!node?.tokenPool) return null

      const chainFamily = getChainFamilyForDirectoryKey(directoryKey)
      const rawType = extractRawType(node.typeAndVersion)
      return {
        address: normalizeAddressForDisplay(node.tokenPool, chainFamily),
        rawType,
        type: resolveMechanismPoolType(environment, tokenSymbol, directoryKey, rawType),
        version: extractVersion(node.typeAndVersion) || "",
        thresholdAmount: parseThresholdAmount(node.info),
      }
    })
  } catch (error) {
    console.error(`[CCIP GraphQL] fetchPoolDataForToken failed: ${tokenSymbol}@${directoryKey}`, error)
    return null
  }
}

export async function fetchPoolDataForTokenAllChains(environment: Environment, tokenSymbol: string): Promise<PoolData> {
  const addressMap = resolveAllTokenAddresses(environment, tokenSymbol)
  if (Object.keys(addressMap).length === 0) return {}

  try {
    return await cached(`pool-all|${environment}|${tokenSymbol}`, async () => {
      const normalizedAddresses = [...new Set(Object.values(addressMap).map(normalizeAddressForQuery))]

      const result = await executeGraphQLQuery<GetTokenPoolsQuery, GetTokenPoolsQueryVariables>(TOKEN_POOLS_QUERY, {
        first: 2000,
        filter: { token: { in: normalizedAddresses } },
      })

      // Reverse lookup: "normalizedAddress|network" → directoryKey
      // Uses both address AND network to handle chains sharing the same token address
      const addrNetworkToDir = new Map<string, string>()
      for (const [dirKey, addr] of Object.entries(addressMap)) {
        const network = toSelectorName(environment, dirKey)
        const key = `${normalizeAddressForQuery(addr)}|${network}`
        addrNetworkToDir.set(key, dirKey)
      }

      const poolData: PoolData = {}
      for (const node of result.allCcipTokenPools?.nodes ?? []) {
        if (!node.token || !node.tokenPool || !node.network) continue
        const key = `${normalizeAddressForQuery(node.token)}|${node.network}`
        const dirKey = addrNetworkToDir.get(key)
        if (!dirKey) continue

        const chainFamily = getChainFamilyForDirectoryKey(dirKey)
        const rawType = extractRawType(node.typeAndVersion)
        poolData[dirKey] = {
          address: normalizeAddressForDisplay(node.tokenPool, chainFamily),
          rawType,
          type: resolveMechanismPoolType(environment, tokenSymbol, dirKey, rawType),
          version: extractVersion(node.typeAndVersion) || "",
          thresholdAmount: parseThresholdAmount(node.info),
        }
      }

      return poolData
    })
  } catch (error) {
    console.error(`[CCIP GraphQL] fetchPoolDataForTokenAllChains failed: ${tokenSymbol}`, error)
    return {}
  }
}

// ---------- All pool data (batch for list endpoints) ----------

/**
 * Fetch pool data for ALL tokens in one paginated query.
 * Used by /tokens list endpoint to avoid N+1 queries.
 * Returns: tokenSymbol → directoryKey → PoolInfo
 */
export type AllPoolData = Record<string, PoolData>

export async function fetchAllPoolData(environment: Environment): Promise<AllPoolData> {
  try {
    return await cached(`all-pools|${environment}`, async () => {
      // Build reverse lookup: normalizedAddress|network → { tokenSymbol, directoryKey }
      const addressIndex = buildAddressIndex(environment)

      // Paginated fetch of ALL pools
      const allNodes = await fetchAllPoolNodes()

      // Map GraphQL results back to tokenSymbol → directoryKey → PoolInfo
      const allPoolData: AllPoolData = {}
      for (const node of allNodes) {
        if (!node.token || !node.network || !node.tokenPool) continue
        const key = `${normalizeAddressForQuery(node.token)}|${node.network}`
        const mapping = addressIndex.get(key)
        if (!mapping) continue

        const { tokenSymbol, directoryKey } = mapping
        const chainFamily = getChainFamilyForDirectoryKey(directoryKey)
        const rawType = extractRawType(node.typeAndVersion)

        if (!allPoolData[tokenSymbol]) allPoolData[tokenSymbol] = {}
        allPoolData[tokenSymbol][directoryKey] = {
          address: normalizeAddressForDisplay(node.tokenPool, chainFamily),
          rawType,
          type: resolveMechanismPoolType(environment, tokenSymbol, directoryKey, rawType),
          version: extractVersion(node.typeAndVersion) || "",
          thresholdAmount: parseThresholdAmount(node.info),
        }
      }

      return allPoolData
    })
  } catch (error) {
    console.error("[CCIP GraphQL] fetchAllPoolData failed:", error)
    return {}
  }
}

/**
 * Builds a reverse lookup index from tokens.json:
 * normalizedAddress|selectorName → { tokenSymbol, directoryKey }
 */
function buildAddressIndex(environment: Environment): Map<string, { tokenSymbol: string; directoryKey: string }> {
  const allSymbols = getAllTokenSymbols(environment)
  const index = new Map<string, { tokenSymbol: string; directoryKey: string }>()

  for (const tokenSymbol of allSymbols) {
    const addressMap = resolveAllTokenAddresses(environment, tokenSymbol)
    for (const [directoryKey, tokenAddress] of Object.entries(addressMap)) {
      const network = toSelectorName(environment, directoryKey)
      const key = `${normalizeAddressForQuery(tokenAddress)}|${network}`
      index.set(key, { tokenSymbol, directoryKey })
    }
  }

  return index
}

type PoolNode = NonNullable<NonNullable<GetTokenPoolsQuery["allCcipTokenPools"]>["nodes"]>[number]

/**
 * Fetches all token pool nodes with offset-based pagination.
 */
async function fetchAllPoolNodes(): Promise<PoolNode[]> {
  const PAGE_SIZE = 2000
  const allNodes: PoolNode[] = []
  let offset = 0
  let fetched: number

  do {
    const result = await executeGraphQLQuery<GetTokenPoolsQuery, GetTokenPoolsQueryVariables>(TOKEN_POOLS_QUERY, {
      first: PAGE_SIZE,
      offset,
    })
    const nodes = result.allCcipTokenPools?.nodes ?? []
    allNodes.push(...nodes)
    fetched = nodes.length
    offset += PAGE_SIZE
  } while (fetched >= PAGE_SIZE)

  return allNodes
}

// ---------- Pool version ----------

export async function fetchPoolVersion(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string
): Promise<string | null> {
  const pool = await fetchPoolDataForToken(environment, tokenSymbol, directoryKey)
  return pool?.version ?? null
}

// ---------- minBlockConfirmations ----------

export async function fetchMinBlockConfirmations(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string
): Promise<number | null> {
  const tokenAddress = resolveTokenAddress(environment, tokenSymbol, directoryKey)
  if (!tokenAddress) return null

  const network = toSelectorName(environment, directoryKey)
  const addr = normalizeAddressForQuery(tokenAddress)

  try {
    return await cached(`minblock|${environment}|${addr}|${network}`, async () => {
      const result = await executeGraphQLQuery<GetTokenPoolsQuery, GetTokenPoolsQueryVariables>(TOKEN_POOLS_QUERY, {
        first: 10,
        condition: { token: addr, network },
      })

      const node = result.allCcipTokenPools?.nodes?.find((n) => n.tokenPool)
      return node?.minBlockConfirmations ?? null
    })
  } catch (error) {
    console.error(`[CCIP GraphQL] fetchMinBlockConfirmations failed: ${tokenSymbol}@${directoryKey}`, error)
    return null
  }
}

// ---------- Lane rate limits ----------

/**
 * Per-lane on-chain data, keeping the two distinct contract sources separate:
 * - rateLimits: from the TokenPool contract (standard + fast/custom buckets)
 * - verifierInfo: from the AdvancedPoolHooks contract (CCVs + threshold)
 */
export interface LaneData {
  rateLimits: RawTokenRateLimits
  verifierInfo: LaneVerifierInfo | null
}

/**
 * Selects the best lane node from multiple entries for the same lane.
 *
 * A lane can have multiple entries in Atlas due to migration (e.g. a v1.x pool
 * and a v2.0 proxy, or multiple v2.0 proxies with different mechanisms). Atlas
 * indexes everything on-chain including staging deployments, so we may also see
 * staging entries with different verifier addresses that aren't in our reference
 * data (verifiers.json). Staging entries should never be shown in the UI, so
 * we skip any CCTP-with-CCV node whose CCV addresses are not in verifiers.json.
 * Priority:
 *   1. mechanism === "cctpV2PoolWithCCV" AND CCV addresses are known in verifiers.json
 *      (production CCTP-with-CCV lane — has verifiers we can resolve)
 *   2. any node with a mechanism string (v2.0 proxy, non-CCV)
 *   3. first node (v1.x fallback)
 *
 * @param networkId The directory key of the chain this lane belongs to (used to
 *   check if CCV addresses are known in verifiers.json)
 * @param environment The CCIP environment (mainnet/testnet)
 */
function selectLaneNode(
  nodes: NonNullable<NonNullable<GetTokenPoolLanesWithPoolsQuery["allCcipTokenPoolLanesWithPools"]>["nodes"]>,
  networkId: string,
  environment: Environment
): NonNullable<NonNullable<GetTokenPoolLanesWithPoolsQuery["allCcipTokenPoolLanesWithPools"]>["nodes"]>[number] | null {
  if (nodes.length === 0) return null

  // Helper: check if a node's CCV addresses are all known in verifiers.json
  const hasKnownCCVs = (n: (typeof nodes)[number]): boolean => {
    const info = n.info as { outboundCCVs?: unknown; inboundCCVs?: unknown } | null
    if (!info) return false
    const outbound = Array.isArray(info.outboundCCVs) ? (info.outboundCCVs as string[]) : []
    const inbound = Array.isArray(info.inboundCCVs) ? (info.inboundCCVs as string[]) : []
    const allAddrs = [...outbound, ...inbound]
    if (allAddrs.length === 0) return false
    return allAddrs.every((addr) => getVerifier({ networkId, address: addr, environment }) !== undefined)
  }

  return (
    // 1. Production CCTP-with-CCV: mechanism matches AND all CCV addresses are known
    nodes.find((n) => {
      const info = n.info as { mechanism?: unknown } | null
      return info?.mechanism === CCTP_CCV_MECHANISM && hasKnownCCVs(n)
    }) ??
    // 2. Any v2.0 proxy with a mechanism string (non-CCV, e.g. cctpV2Pool, siloedLockReleasePool)
    nodes.find((n) => {
      const info = n.info as { mechanism?: unknown } | null
      return info && typeof info.mechanism === "string"
    }) ??
    // 3. Fallback: first node (v1.x)
    nodes[0]
  )
}

export async function fetchLaneData(
  environment: Environment,
  tokenSymbol: string,
  sourceDirectoryKey: string,
  destDirectoryKey: string
): Promise<LaneData | null> {
  const srcNetwork = toSelectorName(environment, sourceDirectoryKey)
  const dstNetwork = toSelectorName(environment, destDirectoryKey)

  // Atlas indexes lanes by the on-chain token symbol (e.g. "USDC.e"), which can
  // differ from the canonical symbol in tokens.json (e.g. "USDC"). Resolve the
  // on-chain symbol for the source chain so the GraphQL query matches.
  const onChainSymbol = resolveOnChainSymbol(environment, tokenSymbol, sourceDirectoryKey)

  const cacheKey = `lane|${environment}|${srcNetwork}|${tokenSymbol}|${dstNetwork}`

  try {
    return await cached(cacheKey, async () => {
      const result = await executeGraphQLQuery<
        GetTokenPoolLanesWithPoolsQuery,
        GetTokenPoolLanesWithPoolsQueryVariables
      >(TOKEN_POOL_LANES_WITH_POOLS_QUERY, {
        first: 10,
        condition: {
          tokenSymbol: onChainSymbol,
          network: srcNetwork,
          remoteNetworkName: dstNetwork,
        },
        filter: { removed: { notEqualTo: true } },
      })

      const nodes = result.allCcipTokenPoolLanesWithPools?.nodes ?? []
      const node = selectLaneNode(nodes, sourceDirectoryKey, environment)
      if (!node) return null

      return {
        rateLimits: {
          standard: toRateLimiterDirections(
            node.inboundCapacity,
            node.inboundRate,
            node.inboundEnabled,
            node.outboundCapacity,
            node.outboundRate,
            node.outboundEnabled
          ),
          custom: toRateLimiterDirections(
            node.customInboundCapacity,
            node.customInboundRate,
            node.customInboundEnabled,
            node.customOutboundCapacity,
            node.customOutboundRate,
            node.customOutboundEnabled
          ),
        },
        verifierInfo: parseLaneInfo(node.info, parseThresholdAmount(node.poolInfo), sourceDirectoryKey, environment),
      }
    })
  } catch (error) {
    console.error(
      `[CCIP GraphQL] fetchLaneData failed: ${tokenSymbol} ${sourceDirectoryKey}->${destDirectoryKey}`,
      error
    )
    return null
  }
}

// ---------- Batch lane tokens ----------

export interface LaneTokenData {
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: number
  sourcePoolType: string
  destPoolType: string
  rateLimits: RawTokenRateLimits | null
}

/**
 * Fetches all tokens for a lane in two parallel batch queries (outbound + inbound).
 * Replaces the previous N+1 approach of fetching each token's lane data separately.
 *
 * Outbound query (network=src, remoteNetworkName=dest):
 *   → source token address, decimals, source pool type, rate limits
 * Inbound query (network=dest, remoteNetworkName=src):
 *   → destination pool type per token symbol
 */
export async function fetchAllTokensForLane(
  environment: Environment,
  sourceDirectoryKey: string,
  destDirectoryKey: string
): Promise<LaneTokenData[]> {
  const srcNetwork = toSelectorName(environment, sourceDirectoryKey)
  const dstNetwork = toSelectorName(environment, destDirectoryKey)

  const cacheKey = `lane-batch|${environment}|${srcNetwork}|${dstNetwork}`

  try {
    return await cached(cacheKey, async () => {
      const [outboundResult, inboundResult] = await Promise.all([
        executeGraphQLQuery<GetTokenPoolLanesWithPoolsQuery, GetTokenPoolLanesWithPoolsQueryVariables>(
          TOKEN_POOL_LANES_WITH_POOLS_QUERY,
          {
            first: 500,
            condition: { network: srcNetwork, remoteNetworkName: dstNetwork },
            filter: { removed: { notEqualTo: true } },
          }
        ),
        executeGraphQLQuery<GetTokenPoolLanesWithPoolsQuery, GetTokenPoolLanesWithPoolsQueryVariables>(
          TOKEN_POOL_LANES_WITH_POOLS_QUERY,
          {
            first: 500,
            condition: { network: dstNetwork, remoteNetworkName: srcNetwork },
            filter: { removed: { notEqualTo: true } },
          }
        ),
      ])

      // Build destination pool type map keyed by canonical token symbol.
      // GraphQL returns the on-chain symbol (e.g. "Bridged mswETH"), which can
      // differ from the canonical key in tokens.json (e.g. "mswETH"). Normalizing
      // here keeps the inbound/outbound join correct when the symbols differ
      // between source and destination chains.
      const destPoolTypeBySymbol = new Map<string, string>()
      for (const node of inboundResult.allCcipTokenPoolLanesWithPools?.nodes ?? []) {
        if (!node.tokenSymbol || !node.token) continue
        const canonical = resolveCanonicalSymbolByAddress(environment, node.token, destDirectoryKey) ?? node.tokenSymbol
        destPoolTypeBySymbol.set(
          canonical,
          resolveMechanismPoolType(environment, canonical, destDirectoryKey, extractRawType(node.typeAndVersion))
        )
      }

      const results: LaneTokenData[] = []
      for (const node of outboundResult.allCcipTokenPoolLanesWithPools?.nodes ?? []) {
        if (!node.tokenSymbol || !node.token) continue

        const rawType = extractRawType(node.typeAndVersion)
        const canonicalSymbol =
          resolveCanonicalSymbolByAddress(environment, node.token, sourceDirectoryKey) ?? node.tokenSymbol
        results.push({
          tokenSymbol: canonicalSymbol,
          tokenAddress: node.token,
          tokenDecimals: node.tokenDecimals ?? 18,
          sourcePoolType: resolveMechanismPoolType(environment, canonicalSymbol, sourceDirectoryKey, rawType),
          destPoolType:
            destPoolTypeBySymbol.get(canonicalSymbol) ??
            resolvePoolType(environment, canonicalSymbol, destDirectoryKey) ??
            "",
          rateLimits: {
            standard: toRateLimiterDirections(
              node.inboundCapacity,
              node.inboundRate,
              node.inboundEnabled,
              node.outboundCapacity,
              node.outboundRate,
              node.outboundEnabled
            ),
            custom: toRateLimiterDirections(
              node.customInboundCapacity,
              node.customInboundRate,
              node.customInboundEnabled,
              node.customOutboundCapacity,
              node.customOutboundRate,
              node.customOutboundEnabled
            ),
          },
        })
      }

      return results
    })
  } catch (error) {
    console.error(`[CCIP GraphQL] fetchAllTokensForLane failed: ${sourceDirectoryKey}->${destDirectoryKey}`, error)
    return []
  }
}
