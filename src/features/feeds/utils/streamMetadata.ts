/**
 * Utilities for resolving display metadata from Data Streams feed entries.
 *
 * Stream source data is inconsistent in some fields (schema, decimals, pair names).
 * The functions here centralize inference logic so it stays easy to update when
 * the upstream data improves.
 *
 * Schema mapping (see /data-streams/reference/report-schema-overview):
 *   crypto         → v3 (Crypto Advanced) or v3-dex (DEX State Price)
 *   rwa            → v8 (RWA Standard) or v11 (RWA Advanced)
 *   exchangeRate   → v7 (Redemption Rates)
 *   smartdata      → v9 (SmartData)
 *   tokenizedAsset → v10 (Tokenized Asset)
 */

import type { DataFeedType } from "../components/FeedList.tsx"

/**
 * Maps stable public API type names to internal DataFeedType values.
 * Update right-hand values here if internal names change.
 * Do not change public keys without a deprecation period.
 */
export const STREAM_CATEGORY_MAP: Record<string, DataFeedType> = {
  crypto: "streamsCrypto",
  rwa: "streamsRwa",
  smartdata: "streamsNav",
  exchangeRate: "streamsExRate",
  tokenizedAsset: "streamsBacked",
}

/**
 * Escapes backslashes and pipe characters for safe rendering in markdown tables.
 * Backslashes are escaped first to prevent them from interfering with pipe escaping.
 */
export function escapePipes(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|")
}

/**
 * Returns the display pair name ("BTC/USD") from a stream feed.
 * Returns null for incomplete entries that should be skipped.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveStreamPair(feed: any): string | null {
  const base = Array.isArray(feed.pair) && feed.pair.length >= 2 ? feed.pair[0] : ""
  const quote = Array.isArray(feed.pair) && feed.pair.length >= 2 ? feed.pair[1] : ""
  if (base && quote) return `${base}/${quote}`
  const fromName = escapePipes((feed.name || "").replace(/-Streams-.*$/, ""))
  return fromName || null
}

// Normalize raw assetClass values from source data to human-readable display strings.
// Some values are internal camelCase identifiers that need to be mapped.
// TODO: remove once source data exposes clean display names.
const ASSET_CLASS_DISPLAY: Record<string, string> = {
  TokenizedEquities: "Tokenized Equities",
}

/**
 * Returns the asset class display string.
 * Suppresses redundant subclass when it equals the main class
 * (e.g. assetClass="Crypto", assetSubClass="Crypto" → "Crypto").
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAssetClass(feed: any): string {
  const rawMain = feed.docs?.assetClass || ""
  const rawSub = feed.docs?.assetSubClass || ""
  const main = ASSET_CLASS_DISPLAY[rawMain] ?? rawMain
  const sub = ASSET_CLASS_DISPLAY[rawSub] ?? rawSub
  // Compare raw values to catch cases where main and sub are the same internal identifier
  if (main && sub && rawSub !== rawMain) return escapePipes(`${main} — ${sub}`)
  return escapePipes(main || sub || "—")
}

/**
 * Returns the trading hours label for a stream feed.
 * Derived from assetSubClass when present, falling back to clicProductName parsing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveTradingHours(feed: any): string {
  const sub = feed.docs?.assetSubClass || ""
  const clic = feed.docs?.clicProductName || ""
  if (
    sub === "Regular Hours" ||
    (clic.includes("RegularHours") && !clic.includes("ExtendedHours") && !clic.includes("OvernightHours"))
  ) {
    return "Regular Hours (9:30am–4:00pm Mon–Fri ET)"
  }
  if (sub === "Extended Hours" || clic.includes("ExtendedHours")) {
    return "Extended Hours (4:00am–9:30am & 4:00pm–8:00pm Mon–Fri ET)"
  }
  if (sub === "Overnight Hours" || clic.includes("OvernightHours")) {
    return "Overnight Hours (8:00pm–4:00am Sun evening–Fri morning ET)"
  }
  return "—"
}

/**
 * Returns the report schema version for a stream feed.
 *
 * Most categories have a fixed schema. RWA is the exception — v8 (Standard)
 * and v11 (Advanced) are inferred from the clicProductName suffix until the
 * source data exposes a clean schema field on every feed.
 *
 * TODO: simplify the RWA case once feed.docs.schema is reliable upstream.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveStreamSchema(type: DataFeedType, feed: any): string {
  switch (type) {
    case "streamsCrypto":
      return feed.docs?.feedType === "Crypto-DEX" ? "v3-dex" : "v3"
    case "streamsExRate":
      return "v7"
    case "streamsNav":
      return "v9"
    case "streamsBacked":
      return "v10"
    case "streamsRwa": {
      // Infer v8 vs v11 from the numeric suffix on clicProductName (e.g. "-011" → v11)
      const match = (feed.docs?.clicProductName || "").match(/-0(\d{2})$/)
      if (match) {
        if (match[1] === "11") return "v11"
        if (match[1] === "04" || match[1] === "08") return "v8"
      }
      return "—"
    }
    default:
      return "—"
  }
}
