/**
 * CCIP Enrichment Data Service
 *
 * Fetches dynamic pool data and rate limits from the Atlas GraphQL API.
 * Replaces the static mock JSON files that were previously used for enrichment.
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
  CCVConfigData,
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

export async function fetchLaneRateLimits(
  environment: Environment,
  tokenSymbol: string,
  sourceDirectoryKey: string,
  destDirectoryKey: string
): Promise<RawTokenRateLimits | null> {
  const srcAddr = resolveTokenAddress(environment, tokenSymbol, sourceDirectoryKey)
  const dstAddr = resolveTokenAddress(environment, tokenSymbol, destDirectoryKey)
  if (!srcAddr || !dstAddr) return null

  const srcNetwork = toSelectorName(environment, sourceDirectoryKey)
  const dstNetwork = toSelectorName(environment, destDirectoryKey)
  const srcToken = normalizeAddressForQuery(srcAddr)
  const dstToken = normalizeAddressForQuery(dstAddr)

  const cacheKey = `lane|${environment}|${srcNetwork}|${srcToken}|${dstNetwork}|${dstToken}`

  try {
    return await cached(cacheKey, async () => {
      const result = await executeGraphQLQuery<
        GetTokenPoolLanesWithPoolsQuery,
        GetTokenPoolLanesWithPoolsQueryVariables
      >(TOKEN_POOL_LANES_WITH_POOLS_QUERY, {
        first: 1,
        condition: {
          token: srcToken,
          network: srcNetwork,
          remoteToken: dstToken,
          remoteNetworkName: dstNetwork,
        },
        filter: { removed: { notEqualTo: true } },
      })

      const node = result.allCcipTokenPoolLanesWithPools?.nodes?.[0]
      if (!node) return null

      return {
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
      }
    })
  } catch (error) {
    console.error(
      `[CCIP GraphQL] fetchLaneRateLimits failed: ${tokenSymbol} ${sourceDirectoryKey}->${destDirectoryKey}`,
      error
    )
    return null
  }
}

// ---------- Stubs ----------

// TODO: CCV verifier data is not yet available in the GraphQL schema.
export function stubCCVConfigData(): CCVConfigData {
  return {}
}
