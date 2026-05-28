import type { ChainNetwork } from "~/features/data/chains.ts"
import { getFeedTypeFlags } from "../types.ts"
import { useBatchedFeedCategories } from "../components/useBatchedFeedCategories.ts"
import { useBatchedStreamCategories } from "../components/useBatchedStreamCategories.ts"
import { filterFeedTableRows, type FeedTableFilterParams } from "../utils/tableFilters.ts"

type UseFilteredFeedMetadataParams = Omit<FeedTableFilterParams, "batchedCategoryData"> & {
  network: ChainNetwork
}

/** Loads batched risk categories and returns filtered, sorted feed rows for a table. */
export function useFilteredFeedMetadata(params: UseFilteredFeedMetadataParams) {
  const { network, dataFeedType, searchVariant, ...rest } = params
  const { isStreams } = getFeedTypeFlags(dataFeedType, searchVariant)
  const feedCategories = useBatchedFeedCategories(isStreams ? null : network)
  const streamCategories = useBatchedStreamCategories(isStreams ? network : null)
  const batchedCategoryData = isStreams ? streamCategories.data : feedCategories.data
  const isLoading = isStreams ? streamCategories.isLoading : feedCategories.isLoading

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
    isBatchLoading: isLoading,
  }
}
