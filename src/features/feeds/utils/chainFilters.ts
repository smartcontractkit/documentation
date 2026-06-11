import type { Chain, ChainNetwork } from "~/features/data/chains.ts"
import type { DataFeedType } from "../types.ts"

type Taggable = { tags?: string[] }

/** Map feed page type → chain/network tag used in chains.ts. */
const FEED_TYPE_TAG: Partial<Record<DataFeedType, string>> = {
  smartdata: "smartData",
  rates: "rates",
  usGovernmentMacroeconomicData: "usGovernmentMacroeconomicData",
  tokenizedEquity: "tokenizedEquity",
}

export function chainMatchesFeedTypeTag(chain: Taggable, dataFeedType: DataFeedType): boolean {
  if (dataFeedType.includes("streams")) return chain.tags?.includes("streams") ?? false

  const tag = FEED_TYPE_TAG[dataFeedType]
  if (tag) return chain.tags?.includes(tag) ?? false

  return chain.tags?.includes("default") ?? false
}

export function filterChainsByFeedTypeTag(chains: Chain[], dataFeedType: DataFeedType): Chain[] {
  return chains.filter((chain) => chainMatchesFeedTypeTag(chain, dataFeedType))
}

export function networkMatchesFeedTypeTag(network: Taggable, dataFeedType: DataFeedType): boolean {
  if (dataFeedType.includes("streams")) return network.tags?.includes("streams") ?? false

  const tag = FEED_TYPE_TAG[dataFeedType]
  if (tag) return network.tags?.includes(tag) ?? false

  return true
}

/** Whether a network section should render for the current page + mainnet/testnet selection. */
export function shouldRenderNetworkSection(
  network: ChainNetwork,
  dataFeedType: DataFeedType,
  selectedNetworkType: "mainnet" | "testnet",
  isDeprecating: boolean,
  hasVisibleFeeds: boolean
): boolean {
  if (network.networkType !== selectedNetworkType) return false
  if (isDeprecating) return hasVisibleFeeds

  if (dataFeedType.includes("streams")) return network.tags?.includes("streams") ?? false
  if (dataFeedType === "smartdata") return network.tags?.includes("smartData") ?? false
  if (dataFeedType === "rates") return network.tags?.includes("rates") ?? false
  if (dataFeedType === "usGovernmentMacroeconomicData") {
    return network.tags?.includes("usGovernmentMacroeconomicData") ?? false
  }

  return true
}

export function shouldFilterSelectableChainsByVisibleFeeds(dataFeedType: DataFeedType, ecosystem: string): boolean {
  return (
    ecosystem === "deprecating" ||
    dataFeedType === "smartdata" ||
    dataFeedType === "rates" ||
    dataFeedType === "usGovernmentMacroeconomicData" ||
    dataFeedType === "tokenizedEquity"
  )
}
