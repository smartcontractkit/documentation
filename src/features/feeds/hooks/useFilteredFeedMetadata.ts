import type { ChainNetwork } from "~/features/data/chains.ts"
import { getFeedTypeFlags } from "../types.ts"
import { useBatchedFeedCategories } from "../components/useBatchedFeedCategories.ts"
import { useBatchedStreamCategories } from "../components/useBatchedStreamCategories.ts"
import { getFeedContractAddress } from "../utils/feedMetadata.ts"
import { filterFeedTableRows, type FeedTableFilterParams } from "../utils/tableFilters.ts"

type UseFilteredFeedMetadataParams = Omit<FeedTableFilterParams, "batchedCategoryData"> & {
  network: ChainNetwork
}

function networkNeedsRiskBatch(network: ChainNetwork, isStreams: boolean): boolean {
  if (!network.metadata?.length) return false

  if (isStreams) {
    return network.metadata.some((metadata) => metadata.contractType === "verifier" && metadata.feedId)
  }

  if (network.networkType !== "mainnet") return false

  return network.metadata.some((metadata) => !!getFeedContractAddress(network, metadata))
}

/** Loads batched risk categories and returns filtered, sorted feed rows for a table. */
export function useFilteredFeedMetadata(params: UseFilteredFeedMetadataParams) {
  const { network, dataFeedType, searchVariant, ...rest } = params
  const { isStreams } = getFeedTypeFlags(dataFeedType, searchVariant)
  const feedCategories = useBatchedFeedCategories(isStreams ? null : network)
  const streamCategories = useBatchedStreamCategories(isStreams ? network : null)
  const batchState = isStreams ? streamCategories : feedCategories
  const batchedCategoryData = batchState.data
  const needsRiskBatch = networkNeedsRiskBatch(network, isStreams)
  const isBatchLoading = needsRiskBatch && !batchState.isReady

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
    isBatchLoading,
  }
}
