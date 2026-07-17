/**
 * Shared feed page types and helpers.
 *
 * Import from here instead of FeedList.tsx to avoid circular dependencies
 * between UI components and visibility/filter utilities.
 */

export type DataFeedType =
  | "default"
  | "smartdata"
  | "rates"
  | "usGovernmentMacroeconomicData"
  | "tokenizedEquity"
  | "blendedPreciousMetals"
  | "streamsCrypto"
  | "streamsRwa"
  | "streamsNav"
  | "streamsExRate"
  | "streamsBacked"

export type SchemaFilterValue = "all" | "v8" | "v11"
export type StreamsRwaFeedTypeValue = "all" | "datalink" | "equities" | "forex"
export type TradingHoursFilterValue = "all" | "regular" | "extended" | "overnight"

/** Flags derived from the active feed page type. Used by tables and FeedList. */
export interface FeedTypeFlags {
  isStreams: boolean
  isSmartData: boolean
  isRates: boolean
  isUSGovernmentMacroeconomicData: boolean
  /** Standard price feeds table (excludes streams/smartdata/macro; testnet also excludes rates). */
  isDefaultTable: boolean
}

export function getFeedTypeFlags(dataFeedType: string, environment: "mainnet" | "testnet" = "mainnet"): FeedTypeFlags {
  const isStreams =
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  const isSmartData = dataFeedType === "smartdata"
  const isRates = dataFeedType === "rates"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"

  const isDefaultTable =
    environment === "testnet"
      ? !isSmartData && !isRates && !isStreams && !isUSGovernmentMacroeconomicData
      : !isStreams && !isSmartData && !isUSGovernmentMacroeconomicData

  return { isStreams, isSmartData, isRates, isUSGovernmentMacroeconomicData, isDefaultTable }
}
