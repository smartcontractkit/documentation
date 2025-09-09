import { type ChainMetadata } from "~/features/data/api/index.ts"

// This file contains *temporary* functions to detect SVR feeds based on their metadata
// These functions are used to identify specific types of SVR feeds based on their metadata properties

/**
 * Determines if a feed is a Shared SVR feed based on its path
 * @param metadata - The feed metadata object
 * @returns true if the feed is a shared SVR feed
 */
export const isSharedSVR = (metadata: ChainMetadata): boolean => {
  // Check the path field for feeds ending with "-shared-svr"
  return typeof metadata.path === "string" && /-shared-svr$/.test(metadata.path)
}

/**
 * Determines if a feed is an Aave dedicated SVR feed
 * @param metadata - The feed metadata object
 * @returns true if the feed has a secondary proxy address but is not a shared SVR feed
 */
export const isAaveSVR = (metadata: ChainMetadata): boolean => {
  return !!metadata?.secondaryProxyAddress && !isSharedSVR(metadata)
}
