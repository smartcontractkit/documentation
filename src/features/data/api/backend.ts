import EleventyFetch from "@11ty/eleventy-fetch"
import { ChainMetadata, mergeWithMVRFeeds } from "./index.ts"
import { Chain, POR_MVR_FEEDS_URL } from "../chains.ts"

export const getServerSideChainMetadata = async (
  chains: Chain[],
  skipCache = false
): Promise<Record<string, ChainMetadata>> => {
  // Fetch all chains in parallel instead of sequentially. Each chain's networks
  // are already fetched in parallel via Promise.all below.
  const cache: Record<string, any> = {}
  await Promise.all(
    chains.map(async (chain) => {
      const requests = chain.networks.map((nw) =>
        nw?.rddUrl
          ? EleventyFetch(nw?.rddUrl, {
              duration: skipCache ? "0s" : "1d",
              type: "json",
            })
              .then((metadata) => ({
                ...nw,
                metadata: metadata.filter(
                  (meta) =>
                    meta.docs?.hidden !== true && (meta.proxyAddress || meta.transmissionsAccount || meta.feedId)
                ),
              }))
              .catch((error) => {
                console.warn(`[getServerSideChainMetadata] Failed to fetch ${nw.rddUrl}: ${error?.message ?? error}`)
                return { ...nw, metadata: [] }
              })
          : undefined
      )
      const networks = await Promise.all(requests)

      cache[chain.page] = { ...chain, networks }
    })
  )

  try {
    const mvrFeeds = await EleventyFetch(POR_MVR_FEEDS_URL, {
      duration: skipCache ? "0s" : "1d",
      type: "json",
    })

    if (mvrFeeds && Array.isArray(mvrFeeds)) {
      return await mergeWithMVRFeeds(cache, POR_MVR_FEEDS_URL)
    }
  } catch (error) {
    console.error("Error fetching MVR feeds during server-side rendering:", error)
  }

  return cache
}
