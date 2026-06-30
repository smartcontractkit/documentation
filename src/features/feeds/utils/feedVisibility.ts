import type { DataFeedType } from "../types.ts"
import { getSchemaVersion, isApacEquitiesStreamFeed, normalizeCategoryKey } from "./feedMetadata.ts"

/**
 * Proxy addresses (lowercase) for feeds that should display the contact email
 * instead of a clickable contract address.
 *
 * Add an entry here whenever a feed needs to be "hidden" on the front end
 * regardless of its productSubType. The address-hiding behaviour already
 * applies automatically to any feed with productSubType === "calculatedPrice";
 * this list covers one-off exceptions (e.g. a specific DAI feed on a chain
 * that does not carry that productSubType).
 */
export const CONTACT_EMAIL_PROXY_ADDRESSES = new Set<string>([
  "0x0101166b3b000332000000000000000000000000000000000000000000000000",
])

/**
 * Returns true when the feed's contract address should be hidden and replaced
 * with the data-feeds contact email in the UI.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shouldHideAddress(feed: any, riskTier?: string | null): boolean {
  if (feed.docs?.productSubType === "calculatedPrice") return true
  const proxy: string | null | undefined = feed.proxyAddress
  if (proxy != null && CONTACT_EMAIL_PROXY_ADDRESSES.has(proxy.toLowerCase())) return true
  return normalizeCategoryKey(riskTier) === "veryhigh"
}

/**
 * Returns true when a stream's feedId should be hidden and replaced with a
 * contact link. Add new feed-type checks here to extend the behaviour; remove
 * them when the stream goes live.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shouldHideStreamFeedId(feed: any): boolean {
  return isApacEquitiesStreamFeed(feed)
}

/**
 * Determines whether a Datalink feed belongs on a given stream page.
 *
 * streamsRwa is the catch-all for ALL Datalink feeds (used by the dedicated
 * Datalink streams page). Every other stream type opts in via this map.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DATALINK_STREAM_MATCH: Partial<Record<string, (feed: any) => boolean>> = {
  streamsCrypto: (feed) => feed.docs?.assetClass === "Crypto",
  streamsNav: (feed) => getSchemaVersion(feed) === "v9",
  streamsExRate: (feed) => feed.docs?.productTypeCode === "ExRate",
  streamsBacked: (feed) => feed.docs?.assetClass === "Tokenized Equities",
}

export interface FeedVisibilityOptions {
  showOnlyDEXFeeds?: boolean
  showOnlyDatalinkFeeds?: boolean
  streamCategoryFilter?: string
  rwaSchemaFilter?: string
  showOnlyMVRFeeds?: boolean
  tokenizedEquityProvider?: string
}

/**
 * Determines if a feed should be visible based on hidden flags, feed page type,
 * ecosystem (deprecating), and optional UI filters.
 *
 * Shared between table filtering and network availability checks.
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
  if (isDeprecating && !feed.docs?.shutdownDate) return false

  let isVisible = false

  // ===========================================================================
  // 3. Data Feed Type Logic (Base Visibility)
  // ===========================================================================
  if (isStreams) {
    if (feed.contractType !== "verifier") return false

    const isDatalink = feed.docs?.feedType === "Datalink"

    if (isDatalink) {
      isVisible = dataFeedType === "streamsRwa" || (DATALINK_STREAM_MATCH[dataFeedType]?.(feed) ?? false)
    } else {
      if (dataFeedType === "streamsCrypto") {
        isVisible = ["Crypto", "Crypto-DEX"].includes(feed.docs?.feedType)
      } else if (dataFeedType === "streamsRwa") {
        isVisible = ["Equities", "Forex"].includes(feed.docs?.feedType)
      } else if (dataFeedType === "streamsNav") {
        isVisible = getSchemaVersion(feed) === "v9"
      } else if (dataFeedType === "streamsExRate") {
        isVisible = feed.docs?.productTypeCode === "ExRate"
      } else if (dataFeedType === "streamsBacked") {
        isVisible = feed.docs?.feedType === "Tokenized Equities"
      }
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
    isVisible =
      feed.docs?.assetClass === "Equity" &&
      feed.contractType !== "verifier" &&
      feed.docs?.productTypeCode === "primaryTokenizedPrice"
  } else {
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
  if (dataFeedType === "streamsCrypto" && options.showOnlyDEXFeeds) {
    if (feed.docs?.feedType !== "Crypto-DEX") return false
  }

  if (isStreams && options.showOnlyDatalinkFeeds) {
    if (feed.docs?.feedType !== "Datalink") return false
  }

  if (dataFeedType === "streamsRwa") {
    if (options.streamCategoryFilter === "datalink" && feed.docs.feedType !== "Datalink") return false
    if (options.streamCategoryFilter === "equities" && feed.docs.feedType !== "Equities") return false
    if (options.streamCategoryFilter === "forex" && feed.docs.feedType !== "Forex") return false

    const schemaVersion = getSchemaVersion(feed)
    if (options.rwaSchemaFilter === "v8" && schemaVersion !== "v8") return false
    if (options.rwaSchemaFilter === "v11" && schemaVersion !== "v11") return false
  }

  if (isSmartData && options.showOnlyMVRFeeds) {
    if (feed.docs?.isMVR !== true) return false
  }

  if (isTokenizedEquity && options.tokenizedEquityProvider) {
    const provider = options.tokenizedEquityProvider.toLowerCase()

    if (provider === "ondo") {
      const assetName = (feed.assetName || "").toLowerCase()
      const isOndoFeed = assetName.includes("ondo") && feed.docs?.productTypeCode === "primaryTokenizedPrice"
      if (!isOndoFeed) return false
    }
  }

  return true
}

export function networkHasVisibleFeeds(
  network: any,
  dataFeedType: DataFeedType,
  ecosystem = "",
  options: FeedVisibilityOptions = {}
): boolean {
  return network?.metadata?.some((feed: any) => isFeedVisible(feed, dataFeedType, ecosystem, options)) ?? false
}

export function chainHasVisibleFeeds(
  chain: any,
  dataFeedType: DataFeedType,
  ecosystem = "",
  options: FeedVisibilityOptions = {}
): boolean {
  return (
    chain?.networks?.some((network: any) => networkHasVisibleFeeds(network, dataFeedType, ecosystem, options)) ?? false
  )
}
