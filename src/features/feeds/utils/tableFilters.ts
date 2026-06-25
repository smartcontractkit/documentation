import type { ChainNetwork } from "~/features/data/chains.ts"
import type { SchemaFilterValue, StreamsRwaFeedTypeValue, TradingHoursFilterValue } from "../types.ts"
import { getFeedTypeFlags } from "../types.ts"
import {
  enrichFeedWithCategory,
  matches24x5StreamFilter,
  matchesApacEquitiesStreamFilter,
  matchesFeedSearch,
  matchesSelectedFeedCategories,
  type FeedSearchVariant,
} from "./feedMetadata.ts"
import { isFeedVisible, type FeedVisibilityOptions } from "./feedVisibility.ts"
import type { FeedCategoryData } from "../components/useBatchedFeedCategories.ts"

export interface FeedTableFilterParams {
  network: ChainNetwork
  batchedCategoryData: Map<string, FeedCategoryData>
  dataFeedType: string
  ecosystem: string
  selectedFeedCategories: string[]
  searchValue: string
  searchVariant: FeedSearchVariant
  showOnlySVR?: boolean
  visibilityOptions?: FeedVisibilityOptions
  show24x5Feeds?: boolean
  showApacEquitiesFeeds?: boolean
  tradingHoursFilter?: TradingHoursFilterValue
  streamCategoryFilter?: StreamsRwaFeedTypeValue
  rwaSchemaFilter?: SchemaFilterValue
}

/** Shared mainnet/testnet row pipeline: enrich → visibility → UI filters → search. */
export function filterFeedTableRows({
  network,
  batchedCategoryData,
  dataFeedType,
  ecosystem,
  selectedFeedCategories,
  searchValue,
  searchVariant,
  showOnlySVR = false,
  visibilityOptions = {},
  show24x5Feeds,
  showApacEquitiesFeeds,
  tradingHoursFilter,
}: FeedTableFilterParams) {
  const { isSmartData } = getFeedTypeFlags(dataFeedType, searchVariant)

  const enrichedMetadata = (network.metadata ?? []).map((metadata) =>
    enrichFeedWithCategory(metadata, network, batchedCategoryData)
  )

  return enrichedMetadata
    .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1))
    .filter((metadata) => {
      if (showOnlySVR && !metadata.secondaryProxyAddress) return false
      return isFeedVisible(metadata, dataFeedType as never, ecosystem, visibilityOptions)
    })
    .filter((metadata) => matches24x5StreamFilter(metadata, show24x5Feeds, tradingHoursFilter))
    .filter((metadata) => matchesApacEquitiesStreamFilter(metadata, showApacEquitiesFeeds))
    .filter((metadata) => matchesSelectedFeedCategories(metadata, selectedFeedCategories, isSmartData))
    .filter((metadata) => matchesFeedSearch(metadata, searchValue, searchVariant))
}
