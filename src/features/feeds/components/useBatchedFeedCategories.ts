import { useEffect, useState } from "preact/hooks"
import { getFeedRiskTiersBatch } from "~/db/feedCategories.js"
import { ChainNetwork } from "~/features/data/chains.ts"

// Type definition for the comparison data
export type FeedCategoryData = {
  final: string | null
  original: string | null
  supabase: string | null
  changed: boolean
  devMode: boolean
}

// Type for the batched feed category hook
type BatchedFeedCategoriesState = {
  data: Map<string, FeedCategoryData>
  isLoading: boolean
  error: string | null
}

/**
 * Custom hook to batch-load feed category data for all feeds in a network
 * This replaces individual API calls with a single batched request per network
 */
export function useBatchedFeedCategories(network: ChainNetwork | null): BatchedFeedCategoriesState {
  const [state, setState] = useState<BatchedFeedCategoriesState>({
    data: new Map(),
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!network || !network.metadata) {
      setState({
        data: new Map(),
        isLoading: false,
        error: null,
      })
      return
    }

    // Only load batch data for mainnet networks - testnet doesn't have risk categories
    if (network.networkType !== "mainnet") {
      setState({
        data: new Map(),
        isLoading: false,
        error: null,
      })
      return
    }

    const loadBatchedCategories = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }))

      try {
        // Collect all feed requests for this network
        const feedRequests: Array<{
          contractAddress: string
          network: string
          fallbackCategory?: string
        }> = []

        if (network.metadata) {
          network.metadata.forEach((metadata) => {
            // Only process feeds that have proxy addresses
            const contractAddress = metadata.contractAddress || metadata.proxyAddress
            if (contractAddress) {
              feedRequests.push({
                contractAddress,
                network: network.networkType || "unknown",
                fallbackCategory: metadata.feedCategory,
              })
            }
          })
        }

        // Skip batch request if no feeds with addresses
        if (feedRequests.length === 0) {
          setState({
            data: new Map(),
            isLoading: false,
            error: null,
          })
          return
        }

        // Make the batched API call
        const batchResults = await getFeedRiskTiersBatch(feedRequests)

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
 * Helper function to get feed category data from batched results
 */
export function getFeedCategoryFromBatch(
  batchData: Map<string, FeedCategoryData>,
  contractAddress: string,
  network: string,
  fallbackCategory?: string
): FeedCategoryData {
  // If no batch data (e.g., testnet), return fallback immediately
  if (!batchData || batchData.size === 0) {
    return {
      final: fallbackCategory || null,
      original: fallbackCategory || null,
      supabase: null,
      changed: false,
      devMode: false,
    }
  }

  const key = `${contractAddress}-${network}`
  const batchResult = batchData.get(key)

  if (batchResult) {
    return batchResult
  }

  // Return fallback if not found in batch
  return {
    final: fallbackCategory || null,
    original: fallbackCategory || null,
    supabase: null,
    changed: false,
    devMode: false,
  }
}
