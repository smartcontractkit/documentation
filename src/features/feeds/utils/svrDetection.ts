import { type ChainMetadata } from "~/features/data/api/index.ts"
import type { DataFeedType } from "../types.ts"
import { type FeedVisibilityOptions, isFeedVisible } from "./feedVisibility.ts"

// This file contains functions to detect and classify SVR feeds based on their metadata.
// SVR feeds are identified by the presence of a secondaryProxyAddress.
//
// Classification (based on path suffix):
//   *-svr (no "shared")        → Aave-SVR    (dedicated to Aave)
//   *-shared-svr-2             → SVR         (new shared, canonical)
//   *-shared-svr (no "-2")     → SVR-Backup  (legacy shared)

export type SvrFeedType = "Aave-SVR" | "SVR" | "SVR-Backup"

export function isSvrFeed(metadata: ChainMetadata): boolean {
  return !!metadata?.secondaryProxyAddress
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
  return chain?.networks?.some((network: any) => networkHasSvrFeeds(network, dataFeedType, ecosystem, options)) ?? false
}

/**
 * Determines if a feed is a legacy shared SVR feed (SVR-Backup).
 * Path ends with "-shared-svr" but NOT "-shared-svr-2".
 */
export const isSharedSVR = (metadata: ChainMetadata): boolean => {
  return typeof metadata.path === "string" && /-shared-svr$/.test(metadata.path)
}

/**
 * Determines if a feed is a new shared SVR feed (canonical SVR).
 * Path ends with "-shared-svr-2".
 */
export const isNewSharedSVR = (metadata: ChainMetadata): boolean => {
  return typeof metadata.path === "string" && /-shared-svr-2$/.test(metadata.path)
}

/**
 * Determines if a feed is an Aave dedicated SVR feed.
 * Has a secondary proxy address but is neither a shared nor new-shared SVR feed.
 */
export const isAaveSVR = (metadata: ChainMetadata): boolean => {
  return !!metadata?.secondaryProxyAddress && !isSharedSVR(metadata) && !isNewSharedSVR(metadata)
}

/**
 * Returns the SVR feed type label for a given feed metadata.
 */
export const getSvrType = (metadata: ChainMetadata): SvrFeedType | null => {
  if (!metadata?.secondaryProxyAddress) return null
  if (isNewSharedSVR(metadata)) return "SVR"
  if (isSharedSVR(metadata)) return "SVR-Backup"
  return "Aave-SVR"
}
