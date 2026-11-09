import type { TwentyFourSevenCategory, TwentyFourSevenFilterValue } from "../types.ts"

/** RDD metadata fields used to classify the 24/7 stream family. */
interface TwentyFourSevenMetadata {
  docs?: { attributeType?: string; feedType?: string }
  feedType?: string
}

/**
 * Map a 24/7 stream to its product line using the RDD `docs.attributeType`.
 * The attribute types are the stable identifier; names and sub asset classes vary.
 *
 * - `247` / `247-TWAP` → 24/7 TWAP (Polymarket-style continuous TWAP)
 * - `247Perps`        → 24/7 for Perpetual Markets
 * - `247CustomPrice` / `247Smoothed` → 24/7 Smoothed
 */
export function get247Category(metadata: TwentyFourSevenMetadata): TwentyFourSevenCategory | undefined {
  const attributeType = metadata.docs?.attributeType
  if (typeof attributeType !== "string") return undefined

  if (/^247(customprice|smoothed)/i.test(attributeType)) return "smoothed"
  if (/^247perps/i.test(attributeType)) return "perps"
  if (/^247/i.test(attributeType)) return "twap"

  return undefined
}

/**
 * 24/7 streams price continuously instead of following traditional market hours.
 * The family spans multiple report schemas (v2, v11, ...), so identify it by the
 * RDD `docs.attributeType` (`247`, `247Perps`, ...) or the `247Price` feed type
 * rather than a schema version.
 *
 * 24/7 Smoothed (`247CustomPrice` / `247Smoothed`) is a Data Feeds product, so it
 * is deliberately excluded from the streams family and does not appear on the RWA
 * streams page.
 */
export function is247Stream(metadata: TwentyFourSevenMetadata): boolean {
  const category = get247Category(metadata)
  if (category) return category !== "smoothed"

  const feedType = metadata.feedType || metadata.docs?.feedType
  return typeof feedType === "string" && /^247/i.test(feedType)
}

/** 24/7 category filter used by FeedList and feed tables. */
export function matches247StreamFilter(
  metadata: TwentyFourSevenMetadata,
  show247Streams: boolean | undefined,
  category: TwentyFourSevenFilterValue | undefined
): boolean {
  if (!show247Streams) return true
  if (!is247Stream(metadata)) return false
  if (!category || category === "all") return true

  return get247Category(metadata) === category
}
