import { useEffect, useState } from "preact/hooks"
import { getStreamRiskTiersBatch } from "~/db/streamCategories.js"
import type { FeedTierResult } from "~/db/feedCategories.js"
import type { ChainNetwork } from "~/features/data/chains.ts"

export type StreamCategoryData = FeedTierResult

type BatchedStreamCategoriesState = {
  data: Map<string, StreamCategoryData>
  isLoading: boolean
  isReady: boolean
  error: string | null
}

/** Batch-load stream risk tiers for verifier streams on a network. */
export function useBatchedStreamCategories(network: ChainNetwork | null): BatchedStreamCategoriesState {
  const [state, setState] = useState<BatchedStreamCategoriesState>({
    data: new Map(),
    isLoading: false,
    isReady: false,
    error: null,
  })

  useEffect(() => {
    if (!network?.metadata?.length) {
      setState({ data: new Map(), isLoading: false, isReady: true, error: null })
      return
    }

    const loadBatchedCategories = async () => {
      setState((prev) => ({ ...prev, isLoading: true, isReady: false, error: null }))

      const streamRequests = network.metadata
        ?.filter((metadata) => metadata.contractType === "verifier" && metadata.feedId)
        .map((metadata) => ({
          streamProxyAddress: metadata.feedId as string,
          shutdownDate: metadata.docs?.shutdownDate,
        }))

      if (!streamRequests?.length) {
        setState({ data: new Map(), isLoading: false, isReady: true, error: null })
        return
      }

      try {
        const batchResults = await getStreamRiskTiersBatch(streamRequests)
        setState({ data: batchResults, isLoading: false, isReady: true, error: null })
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isReady: true,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }))
      }
    }

    loadBatchedCategories()
  }, [network?.name, network?.networkType, network?.queryString, network?.metadata?.length])

  return state
}

export function getStreamCategoryFromBatch(
  batchData: Map<string, StreamCategoryData>,
  streamProxyAddress: string
): StreamCategoryData {
  if (!batchData?.size) return { final: null }

  const key = streamProxyAddress.toLowerCase()
  return batchData.get(key) ?? { final: null }
}
