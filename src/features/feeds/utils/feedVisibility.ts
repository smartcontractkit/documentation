import { DataFeedType } from "../components/FeedList.tsx"

/**
 * Extracts the report schema version from a feed's metadata.
 * Checks feed.docs.schema first, then falls back to parsing the numeric
 * suffix from clicProductName (e.g. "-011" → "v11", "-008" → "v8").
 * Used for schema-based filtering in the UI and API.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSchemaVersion(feed: any): string | undefined {
  if (feed.docs?.schema) return feed.docs.schema

  const clic = feed.docs?.clicProductName
  if (clic) {
    const match = clic.match(/-0(\d{2})$/)
    if (match) {
      const v = match[1]
      if (v === "04" || v === "08") return "v8"
      if (v === "11") return "v11"
    }
  }

  return undefined
}

export interface FeedVisibilityOptions {
  showOnlyDEXFeeds?: boolean
  streamCategoryFilter?: string
  /** Schema version filter, e.g. "v8" or "v11". Pass "all" to disable. */
  schemaFilter?: string
  /** @deprecated Use schemaFilter */
  rwaSchemaFilter?: string
  showOnlyMVRFeeds?: boolean
  tokenizedEquityProvider?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFeedVisible(
  feed: any,
  dataFeedType: DataFeedType,
  ecosystem = "",
  options: FeedVisibilityOptions = {}
): boolean {
  // Tokenized equity feeds are marked hidden in the general list but shown on their own page
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

  if (isDeprecating && feed.feedCategory !== "deprecating") return false

  let isVisible = false

  if (isStreams) {
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
    // Only show true tokenized equity feeds (primaryTokenizedPrice).
    // Generic equity price feeds (e.g. RefPrice) are excluded — they are not
    // tokenized equity instruments and should not appear here.
    isVisible =
      feed.docs?.assetClass === "Equity" &&
      feed.contractType !== "verifier" &&
      feed.docs?.productTypeCode === "primaryTokenizedPrice"
  } else {
    // Default: Standard Price Feeds — exclude all special-typed feeds
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

  if (dataFeedType === "streamsCrypto" && options.showOnlyDEXFeeds) {
    if (feed.docs?.feedType !== "Crypto-DEX") return false
  }

  if (dataFeedType === "streamsRwa") {
    if (options.streamCategoryFilter === "datalink" && feed.docs.feedType !== "Datalink") return false
    if (options.streamCategoryFilter === "equities" && feed.docs.feedType !== "Equities") return false
    if (options.streamCategoryFilter === "forex" && feed.docs.feedType !== "Forex") return false
  }

  const activeSchemaFilter = options.schemaFilter ?? options.rwaSchemaFilter
  if (activeSchemaFilter && activeSchemaFilter !== "all") {
    if (getSchemaVersion(feed) !== activeSchemaFilter) return false
  }

  if (isSmartData && options.showOnlyMVRFeeds) {
    if (feed.docs?.isMVR !== true) return false
  }

  if (isTokenizedEquity && options.tokenizedEquityProvider) {
    const provider = options.tokenizedEquityProvider.toLowerCase()
    if (provider === "ondo") {
      // Ondo feeds are identified by "Ondo" in assetName AND primaryTokenizedPrice productTypeCode.
      // Neither signal alone is sufficient — other providers share the productTypeCode, and the
      // ONDO governance token feed also contains "Ondo" in its name.
      const isOndoFeed =
        (feed.assetName || "").toLowerCase().includes("ondo") && feed.docs?.productTypeCode === "primaryTokenizedPrice"
      if (!isOndoFeed) return false
    }
  }

  return true
}
