import type { ChainNetwork } from "~/features/data/chains.ts"
import { getFeedTypeFlags } from "../types.ts"
import { useBatchedFeedCategories } from "../components/useBatchedFeedCategories.ts"
import { filterFeedTableRows, type FeedTableFilterParams } from "../utils/tableFilters.ts"

type UseFilteredFeedMetadataParams = Omit<FeedTableFilterParams, "batchedCategoryData"> & {
  network: ChainNetwork
}

/** Loads batched risk categories and returns filtered, sorted feed rows for a table. */
export function useFilteredFeedMetadata(params: UseFilteredFeedMetadataParams) {
  const { network, dataFeedType, searchVariant, ...rest } = params
  const { data: batchedCategoryData, isLoading } = useBatchedFeedCategories(network)
  const { isStreams } = getFeedTypeFlags(dataFeedType, searchVariant)

  const filteredMetadata = filterFeedTableRows({
    network,
    batchedCategoryData,
    dataFeedType,
    searchVariant,
    ...rest,
  })

  return {
    batchedCategoryData,
    filteredMetadata,
    isBatchLoading: !isStreams && isLoading,
  }
}
