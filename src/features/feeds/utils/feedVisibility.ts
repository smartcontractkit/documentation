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
  "0x7cf132bd0456af4ecfceaae684fd7967df931141",
  "0xbb65fa58bdb7d33e4a3d1a40a7a9bd99e746367b",
])

/**
 * Proxy addresses (lowercase) for 24/7 extended-hours feeds, grouped by asset
 * class. Add new feeds to the relevant category to include them on the
 * 24/7 Extended-Hours page and in the badge.
 */
export type ExtendedHoursCategory = "preciousMetals" | "forex"

export const EXTENDED_HOURS_FEED_CATEGORIES: Record<ExtendedHoursCategory, Set<string>> = {
  preciousMetals: new Set(["0x369c67e8b026cc4ef98350f332d7dd52b85b7674"]),
  forex: new Set(["0x9eb8a54d0590798880c665c7a6d51b95f4078ad7"]),
}

/** Union of all extended-hours proxy addresses, used for the badge and unfiltered visibility. */
export const ALL_EXTENDED_HOURS_PROXY_ADDRESSES = new Set<string>(
  Object.values(EXTENDED_HOURS_FEED_CATEGORIES).flatMap((addresses) => [...addresses])
)

/**
 * Returns true when a feed is a Coinbase (B20) tokenized equity feed on Base.
 * These feeds are identified by their asset name, feed name, or ENS prefix.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCoinbaseTokenizedEquityFeed(feed: any): boolean {
  if (feed.docs?.productTypeCode !== "primaryTokenizedPrice") return false
  // Only include feeds from the Coinbase chain/feedwatchers on Base. This
  // excludes Robinhood feeds whose underlying stock happens to be Coinbase
  // (e.g. "Coinbase (Robinhood Tokenized Equity)" for the COIN ticker).
  if (feed.docs?.blockchainName !== "Base") return false

  const assetName = (feed.assetName || "").toLowerCase()
  const feedName = (feed.name || "").toLowerCase()
  const ens = (feed.ens || "").toLowerCase()

  return assetName.includes("coinbase") || feedName.startsWith("coinbase ") || ens.startsWith("coinbase-")
}

/**
 * Returns true when the feed's contract address should be hidden and replaced
 * with the data-feeds contact email in the UI.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shouldHideAddress(feed: any, riskTier?: string | null): boolean {
  // Robinhood tokenized equity feeds display their proxy address directly.
  if (feed.docs?.blockchainName === "Robinhood" && feed.docs?.productTypeCode === "primaryTokenizedPrice") {
    return false
  }

  // Coinbase (B20) tokenized equity feeds on Base display their proxy address directly.
  if (isCoinbaseTokenizedEquityFeed(feed)) {
    return false
  }

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
  cryptoSchemaFilter?: string
  showOnlyMVRFeeds?: boolean
  tokenizedEquityProvider?: string
  /** When set, only show extended-hours feeds in this category (e.g. "preciousMetals"). */
  extendedHoursCategory?: ExtendedHoursCategory
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
  const isExtendedHours = dataFeedType === "extendedHours"
  const isSvr = dataFeedType === "svr" || dataFeedType === "svrAtlas"
  if (feed.docs?.hidden && !isTokenizedEquity && !isExtendedHours && !isSvr) return false

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
        const schemaVersion = getSchemaVersion(feed)
        const feedType = feed.docs?.feedType
        // Only show streams whose schema is explicitly v2 or v3 on the crypto page.
        // Avoid falling back to feedType heuristics when the schema is missing or ambiguous.
        // v2 streams are TWAP streams: only show them when attributeType is TWAP.
        if (schemaVersion === "v2" && feedType === "Crypto" && feed.docs?.attributeType === "TWAP") {
          isVisible = true
        } else if (schemaVersion === "v3" && (feedType === "Crypto" || feedType === "Crypto-DEX")) {
          isVisible = true
        } else {
          isVisible = false
        }
      } else if (dataFeedType === "streamsRwa") {
        isVisible = ["Equities", "Forex"].includes(feed.docs?.feedType)
      } else if (dataFeedType === "streamsNav") {
        isVisible = getSchemaVersion(feed) === "v9"
      } else if (dataFeedType === "streamsExRate") {
        isVisible = feed.docs?.productTypeCode === "ExRate"
      } else if (dataFeedType === "streamsBacked") {
        const schemaVersion = getSchemaVersion(feed)
        const feedType = feed.docs?.feedType
        // Only show streams whose schema is explicitly v10 on the tokenized asset page.
        if (schemaVersion === "v10" && feedType === "Tokenized Equities") {
          isVisible = true
        } else {
          isVisible = false
        }
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
    const assetClass = feed.docs?.assetClass
    isVisible =
      (assetClass === "Equity" || assetClass === "Equities") &&
      feed.contractType !== "verifier" &&
      feed.docs?.productTypeCode === "primaryTokenizedPrice"
  } else if (isExtendedHours) {
    const proxy = feed.proxyAddress?.toLowerCase()
    isVisible = ALL_EXTENDED_HOURS_PROXY_ADDRESSES.has(proxy)
    if (isVisible && options.extendedHoursCategory) {
      isVisible = EXTENDED_HOURS_FEED_CATEGORIES[options.extendedHoursCategory].has(proxy)
    }
  } else if (isSvr) {
    // SVR feeds are identified by having a secondaryProxyAddress
    isVisible = !!feed.secondaryProxyAddress
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

  if (dataFeedType === "streamsCrypto" && options.cryptoSchemaFilter && options.cryptoSchemaFilter !== "all") {
    const schemaVersion = getSchemaVersion(feed)
    const feedType = feed.docs?.feedType
    if (options.cryptoSchemaFilter === "v2" && (schemaVersion !== "v2" || feedType !== "Crypto")) return false
    if (options.cryptoSchemaFilter === "v3" && (schemaVersion !== "v3" || feedType !== "Crypto")) return false
    if (options.cryptoSchemaFilter === "v3-dex" && (schemaVersion !== "v3" || feedType !== "Crypto-DEX")) return false
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

    if (provider === "robinhood") {
      if (feed.docs?.productTypeCode !== "primaryTokenizedPrice") return false

      const assetName = (feed.assetName || "").toLowerCase()
      const baseAsset = (feed.docs?.baseAsset || "").toUpperCase()
      const isRobinhoodFeed =
        feed.docs?.blockchainName === "Robinhood" ||
        baseAsset.startsWith("RH") ||
        assetName.includes("robinhood") ||
        (feed.name || "").toLowerCase().startsWith("robinhood ")

      if (!isRobinhoodFeed) return false
    }

    if (provider === "coinbase") {
      if (!isCoinbaseTokenizedEquityFeed(feed)) return false
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
