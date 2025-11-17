import { DataFeedType } from "../components/FeedList.tsx"

/**
 * Determines if a feed should be visible based on:
 * - Hidden flags (feedCategory === "hidden" or docs.hidden)
 * - Data feed type filtering (streams, smartdata, rates, etc.)
 * - Ecosystem filtering (deprecating)
 *
 * This logic is shared between table filtering and network availability checks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFeedVisible(feed: any, dataFeedType: DataFeedType, ecosystem = ""): boolean {
  // Universal hidden exclusions
  if (feed.feedCategory === "hidden" || feed.docs?.hidden) return false

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

  // Deprecating ecosystem: only show feeds with deprecating category
  if (isDeprecating && feed.feedCategory !== "deprecating") return false

  // Streams filtering by sub-type
  if (isStreams) {
    if (dataFeedType === "streamsCrypto")
      return feed.contractType === "verifier" && ["Crypto", "Crypto-DEX"].includes(feed.docs?.feedType)
    if (dataFeedType === "streamsRwa")
      return feed.contractType === "verifier" && ["Equities", "Forex"].includes(feed.docs?.feedType)
    if (dataFeedType === "streamsNav")
      return feed.contractType === "verifier" && feed.docs?.feedType === "Net Asset Value"
    if (dataFeedType === "streamsExRate")
      return feed.contractType === "verifier" && feed.docs?.productTypeCode === "ExRate"
    if (dataFeedType === "streamsBacked")
      return feed.contractType === "verifier" && feed.docs?.feedType === "Tokenized Equities"
    return false
  }

  // SmartData filtering
  if (isSmartData) {
    if (feed.docs?.deliveryChannelCode === "DS") return false
    return (
      feed.docs?.isMVR === true ||
      feed.docs?.productType === "Proof of Reserve" ||
      feed.docs?.productType === "NAVLink" ||
      feed.docs?.productType === "SmartAUM"
    )
  }

  // US Government Macroeconomic Data
  if (isUSGovernmentMacroeconomicData) return feed.docs?.productTypeCode === "RefMacro"

  // Rates
  if (isRates) return feed.docs?.productType === "Rates"

  // Default data feeds: exclude MVR, verifier, and SmartData product types
  return (
    !feed.docs?.porType &&
    feed.contractType !== "verifier" &&
    feed.docs?.productType !== "Proof of Reserve" &&
    feed.docs?.productType !== "NAVLink" &&
    feed.docs?.productType !== "SmartAUM" &&
    feed.docs?.productTypeCode !== "RefMacro" &&
    !feed.docs?.isMVR
  )
}
