import { type ChainMetadata } from "~/features/data/api/index.ts"
import type { DataFeedType } from "../types.ts"
import { type FeedVisibilityOptions, isFeedVisible } from "./feedVisibility.ts"

// SVR feeds are identified by the presence of a `secondaryProxyAddress`.
export function isSvrFeed(metadata: ChainMetadata): boolean {
  return !!metadata?.secondaryProxyAddress
}

/** Fallback label used when the RDD does not provide `svrDisplayLabel`. */
export const DEFAULT_SVR_LABEL = "SVR"

/** Returns the SVR variant label for a feed, or `null` if it is not an SVR feed. */
export function getSvrType(metadata: ChainMetadata): string | null {
  if (!metadata?.secondaryProxyAddress) return null
  return metadata.svrDisplayLabel || DEFAULT_SVR_LABEL
}

/** Returns the distinct SVR variant labels present on a network, sorted. */
export function getSvrTypesOnNetwork(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  network: any
): string[] {
  const labels = new Set<string>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  network?.metadata?.forEach((feed: any) => {
    const label = getSvrType(feed)
    if (label) labels.add(label)
  })
  return [...labels].sort()
}

export function networkHasSvrFeeds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  network: any,
  dataFeedType: DataFeedType,
  ecosystem = "",
  options: FeedVisibilityOptions = {}
): boolean {
  return (
    network?.metadata?.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (feed: any) => isSvrFeed(feed) && isFeedVisible(feed, dataFeedType, ecosystem, options)
    ) ?? false
  )
}

export function chainHasSvrFeeds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain: any,
  dataFeedType: DataFeedType,
  ecosystem = "",
  options: FeedVisibilityOptions = {}
): boolean {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chain?.networks?.some((network: any) => networkHasSvrFeeds(network, dataFeedType, ecosystem, options)) ?? false
  )
}

/** Docs anchor for an SVR variant label; unknown labels fall back to the overview. */
export function getSvrTypeDocLink(label: string): string {
  switch (label) {
    case "Aave SVR":
      return "/data-feeds/svr-feeds#aave-svr-feeds"
    case "Shared SVR":
      return "/data-feeds/svr-feeds#svr-shared"
    default:
      return "/data-feeds/svr-feeds"
  }
}
