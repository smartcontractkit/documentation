import { resolveFeedCategory } from "~/db/feedCategories.js"
import type { ChainNetwork } from "~/features/data/chains.ts"
import type { TradingHoursFilterValue } from "../types.ts"
import type { FeedCategoryData } from "../components/useBatchedFeedCategories.ts"
import { getFeedCategoryFromBatch, getNetworkIdentifier } from "../components/useBatchedFeedCategories.ts"
import { getStreamCategoryFromBatch } from "../components/useBatchedStreamCategories.ts"

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

/** 24/5 stream filter used by FeedList and feed tables. */
export function matches24x5StreamFilter(
  metadata: FeedMetadata,
  show24x5Feeds: boolean | undefined,
  tradingHoursFilter: TradingHoursFilterValue | undefined
): boolean {
  if (!show24x5Feeds) return true

  const schemaVersion = getSchemaVersion(metadata)
  const feedType = metadata.feedType || metadata.docs?.feedType
  const is24x5Feed = (feedType === "Equities" || feedType === "Forex") && schemaVersion === "v11"

  if (!is24x5Feed) return false

  return matchesTradingHours(metadata, tradingHoursFilter ?? "all")
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
