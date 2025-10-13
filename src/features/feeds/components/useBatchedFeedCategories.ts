import { useEffect, useState } from "preact/hooks"
import { getFeedRiskTiersBatch } from "~/db/feedCategories.js"
import { ChainNetwork } from "~/features/data/chains.ts"

// Patch mismatches
const SUPABASE_NETWORK_SLUG_OVERRIDES: Record<string, string> = {
  // Ethereum
  "ethereum-mainnet": "mainnet",

  // L2s / EVM networks that db stores as ethereum-*-<chain>-1
  "arbitrum-mainnet": "ethereum-mainnet-arbitrum-1",
  "base-mainnet": "ethereum-mainnet-base-1",
  "optimism-mainnet": "ethereum-mainnet-optimism-1",
  "scroll-mainnet": "ethereum-mainnet-scroll-1",
  "linea-mainnet": "ethereum-mainnet-linea-1",
  "mantle-mainnet": "ethereum-mainnet-mantle-1",
  "metis-mainnet": "ethereum-mainnet-andromeda-1",
  "xlayer-mainnet": "ethereum-mainnet-xlayer-1",
  "starknet-mainnet": "ethereum-mainnet-starknet-1",
  "zksync-mainnet": "ethereum-mainnet-zksync-1",
  "polygon-zkevm-mainnet": "ethereum-mainnet-polygon-zkevm-1",

  // Legacy/alt naming in Supabase
  "bnb-mainnet": "bsc-mainnet",
  "polygon-mainnet": "matic-mainnet",
  "moonbeam-mainnet": "polkadot-mainnet-moonbeam",
  "moonriver-mainnet": "kusama-mainnet-moonriver",
  "bob-mainnet": "bitcoin-mainnet-bob-1",
  "botanix-mainnet": "bitcoin-mainnet-botanix",

  // typo in chains.ts (queryString is "katara-mainnet")
  "katara-mainnet": "polygon-mainnet-katana",
}

export const getNetworkIdentifier = (network?: ChainNetwork | null): string => {
  if (!network) return "unknown"
  const slug = network.queryString ?? "unknown"
  return SUPABASE_NETWORK_SLUG_OVERRIDES[slug] ?? slug
}

// Final category only
export type FeedCategoryData = {
  final: string | null
}

// Batched feed category hook state
type BatchedFeedCategoriesState = {
  data: Map<string, FeedCategoryData>
  isLoading: boolean
  error: string | null
}

/**
 * Batch-load feed category data for all feeds in a network.
 * Uses DB values when available; falls back to per-item defaults otherwise.
 */
export function useBatchedFeedCategories(network: ChainNetwork | null): BatchedFeedCategoriesState {
  const [state, setState] = useState<BatchedFeedCategoriesState>({
    data: new Map(),
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!network || !network.metadata) {
      setState({ data: new Map(), isLoading: false, error: null })
      return
    }

    // Only load batch data for mainnet networks
    if (network.networkType !== "mainnet") {
      setState({ data: new Map(), isLoading: false, error: null })
      return
    }

    const loadBatchedCategories = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const networkKey = getNetworkIdentifier(network)

      try {
        // Collect requests for this network
        const feedRequests: Array<{
          contractAddress: string
          network: string
          fallbackCategory?: string
        }> = []

        network.metadata?.forEach((metadata) => {
          // Use proxyAddress for Aptos, contractAddress/proxyAddress for others
          let feedKey: string | undefined
          if (network.name.toLowerCase().includes("aptos")) {
            feedKey = metadata.proxyAddress ?? undefined
          } else {
            feedKey = metadata.contractAddress ?? metadata.proxyAddress ?? undefined
          }
          if (feedKey) {
            feedRequests.push({
              contractAddress: feedKey,
              network: networkKey,
              fallbackCategory: metadata.feedCategory,
            })
          }
        })

        if (feedRequests.length === 0) {
          setState({ data: new Map(), isLoading: false, error: null })
          return
        }
        // Batched DB lookup (returns Map<key, { final }>)
        const batchResults = await getFeedRiskTiersBatch(feedRequests)

        setState({
          data: batchResults,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }))
      }
    }

    loadBatchedCategories()
  }, [network?.name, network?.networkType, network?.queryString, network?.metadata?.length])

  return state
}

/**
 * Get final category from batched results with fallback.
 */
export function getFeedCategoryFromBatch(
  batchData: Map<string, FeedCategoryData>,
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): FeedCategoryData {
  if (!batchData || batchData.size === 0) {
    return { final: fallbackCategory ?? null }
  }

  const key = `${contractAddress}-${network}`
  const found = batchData.get(key)
  if (found) return found

  return { final: fallbackCategory ?? null }
}
