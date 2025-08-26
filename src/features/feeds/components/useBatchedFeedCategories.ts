import { useEffect, useState } from "preact/hooks"
import { getFeedRiskTiersBatch } from "~/db/feedCategories.js"
import { ChainNetwork } from "~/features/data/chains.ts"

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
              network: network.networkType || "unknown",
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

        // Debug logging for each feed
        feedRequests.forEach(({ contractAddress, network, fallbackCategory }) => {
          const key = `${contractAddress}-${network}`
          const result = batchResults.get(key)
          console.log(`[FeedCategoryDebug] key: ${key}, fallback: ${fallbackCategory}, final: ${result?.final}`)
        })

        setState({
          data: batchResults,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Failed to load batched feed categories:", error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }))
      }
    }

    loadBatchedCategories()
  }, [network?.name, network?.networkType, network?.metadata?.length])

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
