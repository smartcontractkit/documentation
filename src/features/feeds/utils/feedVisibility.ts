import { DataFeedType } from "../components/FeedList.tsx"

/**
 * Helper function to extract schema version from feed metadata
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSchemaVersion(feed: any): string | undefined {
  // First try to get from docs.schema
  if (feed.docs?.schema) {
    return feed.docs.schema
  }

  // Fallback: parse from clicProductName
  const clicProductName = feed.docs?.clicProductName
  if (clicProductName) {
    const match = clicProductName.match(/-0(\d{2})$/)
    if (match) {
      const version = match[1]
      if (version === "04" || version === "08") return "v8"
      if (version === "11") return "v11"
    }
  }

  return undefined
}

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
  tokenizedEquityProvider?: string // Filter tokenized equity feeds by provider (e.g., "ondo")
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
  // Tokenized equity feeds are allowed to bypass the hidden flag since they are
  // marked hidden in the general feed list but should show on their dedicated page
  const isTokenizedEquity = dataFeedType === "tokenizedEquity"
  if (feed.docs?.hidden && !isTokenizedEquity) return false

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
  } else if (isTokenizedEquity) {
    // Tokenized equity feeds (Ondo and other providers)
    // Filter by assetClass "Equities" for Data Feeds (not Streams verifier contracts)
    isVisible = feed.docs?.assetClass === "Equities" && feed.contractType !== "verifier"
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

    const schemaVersion = getSchemaVersion(feed)
    if (options.rwaSchemaFilter === "v8" && schemaVersion !== "v8") return false
    if (options.rwaSchemaFilter === "v11" && schemaVersion !== "v11") return false
  }

  // Filter: Show only MVR feeds (SmartData)
  if (isSmartData && options.showOnlyMVRFeeds) {
    if (feed.docs?.isMVR !== true) return false
  }

  // Filter: Tokenized equity feeds by provider
  if (isTokenizedEquity && options.tokenizedEquityProvider) {
    const provider = options.tokenizedEquityProvider.toLowerCase()

    if (provider === "ondo") {
      // Ondo tokenized equity feeds are identified by BOTH:
      //   1. "Ondo" in assetName — distinguishes from other tokenized equity providers
      //   2. productTypeCode "primaryTokenizedPrice" — distinguishes from ONDO token feeds
      // Neither signal alone is sufficient: other providers may share the productTypeCode,
      // and ONDO governance token feeds may contain "Ondo" in the asset name.
      const assetName = (feed.assetName || "").toLowerCase()
      const isOndoFeed = assetName.includes("ondo") && feed.docs?.productTypeCode === "primaryTokenizedPrice"
      if (!isOndoFeed) return false
    }
    // Add more provider patterns here as needed
  }

  return true
}
