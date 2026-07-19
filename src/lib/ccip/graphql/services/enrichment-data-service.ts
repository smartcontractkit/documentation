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
  toSelectorName,
  getAllTokenSymbols,
  getChainFamilyForDirectoryKey,
} from "~/lib/ccip/graphql/utils/reference-data-resolver.ts"
import { extractVersion, extractRawType, normalizePoolType } from "~/lib/ccip/graphql/utils/type-version-parser.ts"
import { normalizeAddressForDisplay } from "~/lib/ccip/graphql/utils/address-display.ts"
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
}

function normalizeThresholdAmount(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }
  if (typeof value === "string") {
    return value
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
 * Parses the lane `info` blob into verifier sets, pairing it with the
 * threshold amount parsed from the lane `poolInfo` blob.
 */
function parseLaneInfo(laneInfo: unknown, thresholdAmount: string | null): LaneVerifierInfo | null {
  if (!laneInfo || typeof laneInfo !== "object") {
    return null
  }

  const payload = laneInfo as RawLaneInfoPayload
  return {
    inboundCCVs: parseAddressList(payload.inboundCCVs),
    outboundCCVs: parseAddressList(payload.outboundCCVs),
    thresholdInboundCCVs: parseAddressList(payload.thresholdInboundCCVs),
    thresholdOutboundCCVs: parseAddressList(payload.thresholdOutboundCCVs),
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
        type: normalizePoolType(rawType),
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
          type: normalizePoolType(rawType),
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
          type: normalizePoolType(rawType),
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

export async function fetchLaneData(
  environment: Environment,
  tokenSymbol: string,
  sourceDirectoryKey: string,
  destDirectoryKey: string
): Promise<LaneData | null> {
  const srcNetwork = toSelectorName(environment, sourceDirectoryKey)
  const dstNetwork = toSelectorName(environment, destDirectoryKey)

  const cacheKey = `lane|${environment}|${srcNetwork}|${tokenSymbol}|${dstNetwork}`

  try {
    return await cached(cacheKey, async () => {
      const result = await executeGraphQLQuery<
        GetTokenPoolLanesWithPoolsQuery,
        GetTokenPoolLanesWithPoolsQueryVariables
      >(TOKEN_POOL_LANES_WITH_POOLS_QUERY, {
        first: 1,
        condition: {
          tokenSymbol,
          network: srcNetwork,
          remoteNetworkName: dstNetwork,
        },
        filter: { removed: { notEqualTo: true } },
      })

      const node = result.allCcipTokenPoolLanesWithPools?.nodes?.[0]
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
        verifierInfo: parseLaneInfo(node.info, parseThresholdAmount(node.poolInfo)),
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
        destPoolTypeBySymbol.set(canonical, normalizePoolType(extractRawType(node.typeAndVersion)))
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
          sourcePoolType: normalizePoolType(rawType),
          destPoolType: destPoolTypeBySymbol.get(canonicalSymbol) ?? "",
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
