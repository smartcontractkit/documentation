import { useEffect, useState } from "preact/hooks"
import { getFeedRiskTiersBatch } from "~/db/feedCategories.js"
import { ChainNetwork } from "~/features/data/chains.ts"

// Prefer the slug, but patch Ethereum until Supabase data is normalized (it still stores "mainnet").
export const getNetworkIdentifier = (network?: ChainNetwork | null): string => {
  if (!network) return "unknown"
  if (network.queryString === "ethereum-mainnet") {
    return "mainnet"
  }
  return network.queryString ?? "unknown"
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
