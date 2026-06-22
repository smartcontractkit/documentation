import { resolveFeedCategory } from "~/db/feedCategories.js"
import type { ChainNetwork } from "~/features/data/chains.ts"
import type { TradingHoursFilterValue } from "../types.ts"
import type { FeedCategoryData } from "../components/useBatchedFeedCategories.ts"
import { getFeedCategoryFromBatch, getNetworkIdentifier } from "../components/useBatchedFeedCategories.ts"
import { getStreamCategoryFromBatch } from "../components/useBatchedStreamCategories.ts"
import { StreamsNetworksData } from "../data/StreamsNetworksData.ts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeedMetadata = any

/** Normalize category keys for comparison (e.g. "very high" → "veryhigh"). */
export function normalizeCategoryKey(value?: string | null): string | undefined {
  return value?.toLowerCase().replace(/\s+/g, "")
}

/** Normalize user search input and feed fields for substring matching. */
export function normalizeSearchText(value?: string | null): string {
  return (value ?? "").toLowerCase().replaceAll(" ", "")
}

/**
 * Resolve RWA stream schema version from docs.schema or clicProductName suffix.
 * Shared by feed visibility, stream filters, and table rendering.
 */
export function getSchemaVersion(feed: FeedMetadata): string | undefined {
  if (feed.docs?.schema) return feed.docs.schema

  const clicProductName = feed.docs?.clicProductName
  if (!clicProductName) return undefined

  const match = clicProductName.match(/-0(\d{2})$/)
  if (!match) return undefined

  if (match[1] === "04" || match[1] === "08") return "v8"
  if (match[1] === "11") return "v11"

  return undefined
}

export function getFeedContractAddress(network: ChainNetwork, metadata: FeedMetadata): string | undefined {
  const isAptos = network.name.toLowerCase().includes("aptos")
  if (isAptos) return metadata.proxyAddress ?? undefined
  return metadata.contractAddress ?? metadata.proxyAddress ?? undefined
}

/** Attach Supabase/RDD-derived finalCategory used for risk icons and category filters. */
export function enrichFeedWithCategory(
  metadata: FeedMetadata,
  network: ChainNetwork,
  batchedCategoryData: Map<string, FeedCategoryData>
): FeedMetadata {
  const isStream = metadata.contractType === "verifier" && metadata.feedId

  if (isStream) {
    const batchFinal =
      batchedCategoryData?.size && metadata.feedId
        ? getStreamCategoryFromBatch(batchedCategoryData, metadata.feedId).final
        : null

    const finalCategory = resolveFeedCategory(batchFinal, metadata.docs?.shutdownDate, metadata.feedCategory)
    return { ...metadata, finalCategory }
  }

  const contractAddress = getFeedContractAddress(network, metadata)
  const networkIdentifier = getNetworkIdentifier(network)

  const batchFinal =
    contractAddress && batchedCategoryData?.size
      ? getFeedCategoryFromBatch(batchedCategoryData, contractAddress, networkIdentifier).final
      : null

  const finalCategory = resolveFeedCategory(batchFinal, metadata.docs?.shutdownDate, metadata.feedCategory)

  return { ...metadata, finalCategory }
}

function matchesTradingHours(metadata: FeedMetadata, tradingHoursFilter: TradingHoursFilterValue): boolean {
  if (tradingHoursFilter === "all") return true

  const assetSubClass = metadata.docs?.assetSubClass
  const clicProductName = metadata.docs?.clicProductName || ""

  const isRegularHours =
    assetSubClass === "Regular Hours" ||
    (clicProductName.includes("RegularHours") &&
      !clicProductName.includes("ExtendedHours") &&
      !clicProductName.includes("OvernightHours"))
  const isExtendedHours = assetSubClass === "Extended Hours" || clicProductName.includes("ExtendedHours")
  const isOvernightHours = assetSubClass === "Overnight Hours" || clicProductName.includes("OvernightHours")

  if (tradingHoursFilter === "regular") return isRegularHours
  if (tradingHoursFilter === "extended") return isExtendedHours
  if (tradingHoursFilter === "overnight") return isOvernightHours

  return true
}

/** 24/5 US Equities session feeds (Regular, Extended, Overnight). Identified by RDD session metadata. */
export function isV1124x5SessionFeed(metadata: FeedMetadata): boolean {
  const assetSubClass = metadata.docs?.assetSubClass
  if (assetSubClass === "Regular Hours" || assetSubClass === "Extended Hours" || assetSubClass === "Overnight Hours") {
    return true
  }

  const marketHours = metadata.docs?.marketHours
  if (typeof marketHours === "string" && marketHours.startsWith("US Equities")) {
    return true
  }

  const attributeType = metadata.docs?.attributeType
  if (
    typeof attributeType === "string" &&
    (attributeType.includes("RegularHours") ||
      attributeType.includes("ExtendedHours") ||
      attributeType.includes("OvernightHours"))
  ) {
    return true
  }

  const clicProductName = metadata.docs?.clicProductName || ""
  return (
    clicProductName.includes("RegularHours") ||
    clicProductName.includes("ExtendedHours") ||
    clicProductName.includes("OvernightHours")
  )
}

/** v11 streams with US 24/5 session coverage (Regular, Extended, or Overnight hours). */
export function is24x5StreamFeed(metadata: FeedMetadata): boolean {
  return getSchemaVersion(metadata) === "v11" && isV1124x5SessionFeed(metadata)
}

/** 24/5 stream filter used by FeedList and feed tables. */
export function matches24x5StreamFilter(
  metadata: FeedMetadata,
  show24x5Feeds: boolean | undefined,
  tradingHoursFilter: TradingHoursFilterValue | undefined
): boolean {
  if (!show24x5Feeds) return true

  if (!is24x5StreamFeed(metadata)) return false

  return matchesTradingHours(metadata, tradingHoursFilter ?? "all")
}

/** APAC exchange market-hours tags as they appear in the RDD `docs.marketHours` field. */
const APAC_MARKET_HOURS_TAGS = new Set(["Tokyo", "Seoul", "Taiwan", "Taipei", "Shanghai", "Shenzhen"])

export function isApacEquitiesStreamFeed(metadata: FeedMetadata): boolean {
  const feedType = metadata.feedType || metadata.docs?.feedType
  if (feedType !== "Equities") return false

  const marketHours = metadata.docs?.marketHours
  return typeof marketHours === "string" && APAC_MARKET_HOURS_TAGS.has(marketHours)
}

/** APAC equities stream filter used by FeedList and feed tables. */
export function matchesApacEquitiesStreamFilter(
  metadata: FeedMetadata,
  showApacEquitiesFeeds: boolean | undefined
): boolean {
  if (!showApacEquitiesFeeds) return true
  return isApacEquitiesStreamFeed(metadata)
}

/** Doc links for marketStatus and trading hours, resolved per feed in the stream table schema expander. */
export function getMarketStatusDocLink(
  metadata: FeedMetadata,
  schemaKey: string
): { label: string; href: string } | undefined {
  if (schemaKey === "v8") {
    return { label: "Status values", href: "/data-streams/reference/report-schema-v8#market-status-values" }
  }

  if (schemaKey === "v10") {
    return { label: "Market hours", href: "/data-streams/market-hours" }
  }

  if (schemaKey === "v11") {
    if (isApacEquitiesStreamFeed(metadata)) {
      return { label: "Status values", href: "/data-streams/reference/report-schema-v11#standard-hours-feeds" }
    }
    if (isV1124x5SessionFeed(metadata)) {
      return { label: "Status values", href: "/data-streams/reference/report-schema-v11#24-5-us-equities-feeds" }
    }
    return { label: "Status values", href: "/data-streams/reference/report-schema-v11#market-status-values" }
  }

  return undefined
}

export function getTradingHoursDocLink(
  metadata: FeedMetadata,
  schemaKey: string
): { label: string; href: string } | undefined {
  if (schemaKey !== "v8" && schemaKey !== "v11" && schemaKey !== "v10") return undefined

  if (isApacEquitiesStreamFeed(metadata)) {
    return { label: "Trading hours", href: "/data-streams/market-hours#apac-equities" }
  }

  if (schemaKey === "v11" && isV1124x5SessionFeed(metadata)) {
    return { label: "Trading hours", href: "/data-streams/market-hours#rwa-market-hours" }
  }

  return { label: "Trading hours", href: "/data-streams/market-hours" }
}

/** Canonical asset type label for filtering (matches the "Asset type" column in tables). */
export function getFeedAssetType(metadata: FeedMetadata): string | undefined {
  const raw = metadata.feedType || metadata.docs?.feedType || metadata.docs?.assetClass
  if (!raw || typeof raw !== "string") return undefined

  if (raw.toLowerCase() === "crypto") return "Crypto"

  return raw.trim()
}

/** Category chip filter for SmartData product types vs asset-type feeds. */
export function matchesSelectedFeedCategories(
  metadata: FeedMetadata,
  selectedFeedCategories: string[],
  isSmartData: boolean
): boolean {
  if (isSmartData) {
    if (selectedFeedCategories.includes("MVR") && metadata.docs?.isMVR) return true

    return (
      selectedFeedCategories.length === 0 ||
      (metadata.docs?.productType && selectedFeedCategories.includes(metadata.docs.productType)) ||
      (metadata.docs?.assetClass && selectedFeedCategories.includes(metadata.docs.assetClass))
    )
  }

  if (selectedFeedCategories.length === 0) return true

  const assetType = getFeedAssetType(metadata)
  return assetType !== undefined && selectedFeedCategories.includes(assetType)
}

export type FeedSearchVariant = "mainnet" | "testnet"

/** Search box filter shared by mainnet and testnet tables. */
export function matchesFeedSearch(metadata: FeedMetadata, searchValue: string, variant: FeedSearchVariant): boolean {
  if (!searchValue) return true

  const query = normalizeSearchText(searchValue)
  const fields = [metadata.name, metadata.proxyAddress, metadata.assetName, metadata.feedType, metadata.feedId]

  if (variant === "mainnet") {
    fields.push(
      metadata.secondaryProxyAddress,
      metadata.docs?.porType,
      metadata.docs?.porAuditor,
      metadata.docs?.porSource
    )
  }

  return fields.some((field) => normalizeSearchText(field).includes(query))
}

/** Whether streams verifier address data exists for each environment. */
export function getStreamsVerifierEnvironmentAvailability(): { mainnet: boolean; testnet: boolean } {
  return {
    mainnet: StreamsNetworksData.some((network) => Boolean(network.mainnet)),
    testnet: StreamsNetworksData.some((network) => Boolean(network.testnet)),
  }
}

export function mergeStreamEnvironmentAvailability(feedAvailability: { mainnet: boolean; testnet: boolean }): {
  mainnet: boolean
  testnet: boolean
} {
  const verifierAvailability = getStreamsVerifierEnvironmentAvailability()

  return {
    mainnet: feedAvailability.mainnet || verifierAvailability.mainnet,
    testnet: feedAvailability.testnet || verifierAvailability.testnet,
  }
}
