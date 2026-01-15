import { DataFeedType } from "../components/FeedList.tsx"

/**
 * Determines if a feed should be visible based on:
 * - Hidden flags (feedCategory === "hidden" or docs.hidden)
 * - Data feed type filtering (streams, smartdata, rates, etc.)
 * - Ecosystem filtering (deprecating)
 *
 * This logic is shared between table filtering and network availability checks.
 */
export interface FeedVisibilityOptions {
  showOnlyDEXFeeds?: boolean
  streamCategoryFilter?: string
  rwaSchemaFilter?: string
  showOnlyMVRFeeds?: boolean
}

/**
 * Determines if a feed should be visible based on:
 * - Hidden flags (feedCategory === "hidden" or docs.hidden)
 * - Data feed type filtering (streams, smartdata, rates, etc.)
 * - Ecosystem filtering (deprecating)
 * - Optional filters (DEX only, MVR only, schema version, etc.)
 *
 * This logic is shared between table filtering and network availability checks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFeedVisible(
  feed: any,
  dataFeedType: DataFeedType,
  ecosystem = "",
  options: FeedVisibilityOptions = {}
): boolean {
  // ===========================================================================
  // 1. Universal Exclusions
  // ===========================================================================
  if (feed.docs?.hidden) return false

  const isDeprecating = ecosystem === "deprecating"
  const isStreams =
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  const isSmartData = dataFeedType === "smartdata"
  const isRates = dataFeedType === "rates"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"

  // ===========================================================================
  // 2. Ecosystem-Specific Logic
  // ===========================================================================
  // If we are in the "deprecating" ecosystem view, ONLY show deprecating feeds.
  if (isDeprecating && feed.feedCategory !== "deprecating") return false

  let isVisible = false

  // ===========================================================================
  // 3. Data Feed Type Logic (Base Visibility)
  // ===========================================================================
  // Determine if the feed belongs to the requested category (Streams, SmartData, etc.)

  if (isStreams) {
    // Streams feeds must be verified contracts
    if (feed.contractType !== "verifier") return false

    if (dataFeedType === "streamsCrypto") {
      isVisible = ["Crypto", "Crypto-DEX"].includes(feed.docs?.feedType)
    } else if (dataFeedType === "streamsRwa") {
      isVisible = ["Equities", "Forex", "Datalink"].includes(feed.docs?.feedType)
    } else if (dataFeedType === "streamsNav") {
      isVisible = feed.docs?.feedType === "Net Asset Value"
    } else if (dataFeedType === "streamsExRate") {
      isVisible = feed.docs?.productTypeCode === "ExRate"
    } else if (dataFeedType === "streamsBacked") {
      isVisible = feed.docs?.feedType === "Tokenized Equities"
    }
  } else if (isSmartData) {
    // SmartData feeds (excluding DS delivery channel)
    if (feed.docs?.deliveryChannelCode === "DS") isVisible = false
    else
      isVisible =
        feed.docs?.isMVR === true ||
        feed.docs?.productType === "Proof of Reserve" ||
        feed.docs?.productType === "NAVLink" ||
        feed.docs?.productType === "SmartAUM"
  } else if (isUSGovernmentMacroeconomicData) {
    isVisible = feed.docs?.productTypeCode === "RefMacro"
  } else if (isRates) {
    isVisible = feed.docs?.productType === "Rates" || feed.docs?.productSubType === "Realized Volatility"
  } else {
    // Default data feeds (Standard Price Feeds)
    // Exclude all special types to leave only the standard feeds
    isVisible =
      !feed.docs?.porType &&
      feed.contractType !== "verifier" &&
      feed.docs?.productType !== "Proof of Reserve" &&
      feed.docs?.productType !== "NAVLink" &&
      feed.docs?.productType !== "SmartAUM" &&
      feed.docs?.productType !== "Rates" &&
      feed.docs?.productTypeCode !== "RefMacro" &&
      !feed.docs?.isMVR
  }

  if (!isVisible) return false

  // ===========================================================================
  // 4. Optional Filters (User Selection)
  // ===========================================================================
  // Apply additional filters selected by the user in the UI

  // Filter: Show only DEX feeds (Streams Crypto)
  if (dataFeedType === "streamsCrypto" && options.showOnlyDEXFeeds) {
    if (feed.docs?.feedType !== "Crypto-DEX") return false
  }

  // Filter: RWA Category & Schema (Streams RWA)
  if (dataFeedType === "streamsRwa") {
    if (options.streamCategoryFilter === "datalink" && feed.docs.feedType !== "Datalink") return false
    if (options.streamCategoryFilter === "equities" && feed.docs.feedType !== "Equities") return false
    if (options.streamCategoryFilter === "forex" && feed.docs.feedType !== "Forex") return false

    if (options.rwaSchemaFilter === "v8" && feed.docs?.schema === "v11") return false
    if (options.rwaSchemaFilter === "v11" && feed.docs?.schema !== "v11") return false
  }

  // Filter: Show only MVR feeds (SmartData)
  if (isSmartData && options.showOnlyMVRFeeds) {
    if (feed.docs?.isMVR !== true) return false
  }

  return true
}
