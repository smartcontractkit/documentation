/** Contact email shown when a feed address is intentionally hidden. */
export const TOKENIZED_EQUITY_CONTACT_EMAIL = "chainlink_data_feeds@smartcontract.com"

/** Static SmartData category filters shown in the UI. */
export const SMART_DATA_CATEGORY_OPTIONS = [
  { key: "Proof of Reserve", name: "Proof of Reserve" },
  { key: "NAVLink", name: "NAVLink" },
  { key: "SmartAUM", name: "SmartAUM" },
  { key: "Stablecoin Stability Assessment", name: "Stablecoin Stability Assessment" },
] as const

/** Default risk categories before Supabase categories load. */
export const DEFAULT_FEED_CATEGORY_OPTIONS = [
  { key: "low", name: "Low Market Risk" },
  { key: "medium", name: "Medium Market Risk" },
  { key: "high", name: "High Market Risk" },
  { key: "veryhigh", name: "Very High Market Risk" },
  { key: "custom", name: "Custom" },
  { key: "new", name: "New Token" },
  { key: "deprecating", name: "Deprecating" },
] as const

export function getAddrPerPage(ecosystem: string, isStreams: boolean): number {
  if (ecosystem === "deprecating" && isStreams) return 10
  if (ecosystem === "deprecating") return 10000
  return 8
}
