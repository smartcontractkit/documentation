import Fuse, { type IFuseOptions } from "fuse.js"
import type { ChainDetails, ChainFamily, SearchType } from "~/lib/ccip/types/index.ts"
import { CCIPError } from "~/lib/ccip/utils.ts"
import { logger } from "@lib/logging/index.js"

export const prerender = false

// Fuse.js configuration for fuzzy search
const FUSE_OPTIONS: IFuseOptions<ChainDetails> = {
  keys: [
    { name: "displayName", weight: 0.4 },
    { name: "internalId", weight: 0.25 },
    { name: "chainFamily", weight: 0.2 },
    { name: "chainId", weight: 0.15 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
}

// Cache for search indexes to avoid O(n) operations on every search
// Includes Fuse.js instance and Map-based lookups for O(1) exact matches
interface SearchCache {
  key: string
  fuse: Fuse<ChainDetails>
  selectorMap: Map<string, ChainDetails>
  internalIdMap: Map<string, ChainDetails>
  chainIdMap: Map<string, ChainDetails[]> // chainId can have duplicates across chains
}

let searchCache: SearchCache | null = null

/**
 * Generates a cache key based on chain data.
 * Uses chain count, first/middle/last selectors, and a checksum to detect when data changes.
 */
function generateCacheKey(chains: ChainDetails[]): string {
  if (chains.length === 0) return "empty"
  const firstSelector = chains[0]?.selector ?? ""
  const lastSelector = chains[chains.length - 1]?.selector ?? ""
  const midIndex = Math.floor(chains.length / 2)
  const midSelector = chains[midIndex]?.selector ?? ""

  // Create a simple checksum of all selectors to detect middle changes
  let checksum = 0
  for (const chain of chains) {
    const selector = chain.selector || ""
    for (let i = 0; i < selector.length; i++) {
      checksum = (checksum + selector.charCodeAt(i)) % 1000000
    }
  }

  return `${chains.length}:${firstSelector}:${midSelector}:${lastSelector}:${checksum}`
}

/**
 * Builds search indexes for the given chains.
 * Creates Fuse.js instance and Map-based lookups.
 */
function buildSearchIndexes(chains: ChainDetails[]): SearchCache {
  const selectorMap = new Map<string, ChainDetails>()
  const internalIdMap = new Map<string, ChainDetails>()
  const chainIdMap = new Map<string, ChainDetails[]>()

  for (const chain of chains) {
    if (chain.selector) {
      selectorMap.set(chain.selector, chain)
    }
    if (chain.internalId) {
      internalIdMap.set(chain.internalId.toLowerCase(), chain)
    }
    // chainId can have duplicates, so store as array
    const chainIdStr = String(chain.chainId)
    const existing = chainIdMap.get(chainIdStr) || []
    existing.push(chain)
    chainIdMap.set(chainIdStr, existing)
  }

  return {
    key: generateCacheKey(chains),
    fuse: new Fuse(chains, FUSE_OPTIONS),
    selectorMap,
    internalIdMap,
    chainIdMap,
  }
}

/**
 * Gets or creates cached search indexes for the given chains.
 * Reuses existing cache if the chain data hasn't changed.
 */
function getSearchIndexes(chains: ChainDetails[]): SearchCache {
  const cacheKey = generateCacheKey(chains)

  if (searchCache && searchCache.key === cacheKey) {
    logger.debug({
      message: "Using cached search indexes",
      cacheKey,
    })
    return searchCache
  }

  logger.debug({
    message: "Building new search indexes",
    cacheKey,
    chainCount: chains.length,
  })

  searchCache = buildSearchIndexes(chains)
  return searchCache
}

/**
 * Checks if a query looks like a selector (18-20 digit number).
 * Selectors are always large numeric strings.
 */
function isLikelySelector(query: string): boolean {
  const candidate = query.replace(/n$/, "") // Remove trailing 'n' for BigInt literals
  return /^\d+$/.test(candidate) && candidate.length > 17
}

/**
 * Executes search on chains with automatic query type detection.
 *
 * Detection strategy (in order):
 * 1. Check if query matches a selector in the map
 * 2. Check if query matches a chainId in the map (handles all formats: numeric, negative, hex, strings)
 * 3. Check if query matches an internalId in the map
 * 4. Fall back to fuzzy search on displayName
 *
 * This approach is simpler and automatically handles all chainId formats across chain families.
 *
 * @param query - Search query string
 * @param chains - Array of chain details to search
 * @param familyFilter - Optional chain family filter
 * @returns Search results and detected search type
 * @throws CCIPError if query is too short for fuzzy search
 */
export function searchChains(
  query: string,
  chains: ChainDetails[],
  familyFilter?: ChainFamily | null
): { results: ChainDetails[]; searchType: SearchType } {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    throw new CCIPError(400, "Search query must be at least 2 characters.")
  }

  const indexes = getSearchIndexes(chains)
  let results: ChainDetails[]
  let searchType: SearchType

  // 1. Check if it's a selector (large numeric string > 17 digits)
  const selectorCandidate = trimmed.replace(/n$/, "")
  if (isLikelySelector(trimmed) && indexes.selectorMap.has(selectorCandidate)) {
    const chain = indexes.selectorMap.get(selectorCandidate)!
    results = [chain]
    searchType = "selector"
    logger.debug({
      message: "Search matched selector",
      query: trimmed,
      type: "selector",
    })
  }
  // 2. Check if query exists as a chainId (handles all formats automatically)
  else if (indexes.chainIdMap.has(trimmed)) {
    results = indexes.chainIdMap.get(trimmed) || []
    searchType = "chainId"
    logger.debug({
      message: "Search matched chainId",
      query: trimmed,
      type: "chainId",
    })
  }
  // 3. Check if query exists as an internalId (case-insensitive)
  else if (indexes.internalIdMap.has(trimmed.toLowerCase())) {
    const chain = indexes.internalIdMap.get(trimmed.toLowerCase())!
    results = [chain]
    searchType = "internalId"
    logger.debug({
      message: "Search matched internalId",
      query: trimmed,
      type: "internalId",
    })
  }
  // 4. Fall back to fuzzy search
  else {
    results = indexes.fuse.search(trimmed).map((r) => r.item)
    searchType = "displayName"
    logger.debug({
      message: "Search using fuzzy match",
      query: trimmed,
      type: "displayName",
      resultCount: results.length,
    })
  }

  // Apply family filter if specified
  if (familyFilter) {
    results = results.filter((c) => c.chainFamily === familyFilter)
    logger.debug({
      message: "Applied family filter",
      family: familyFilter,
      filteredCount: results.length,
    })
  }

  return { results, searchType }
}

/**
 * Clears the search cache. Call this if chain data changes.
 */
export function clearSearchCache(): void {
  searchCache = null
  logger.debug({
    message: "Search cache cleared",
  })
}
