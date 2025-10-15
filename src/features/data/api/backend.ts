import EleventyFetch from "@11ty/eleventy-fetch"
import { ChainMetadata, mergeWithMVRFeeds } from "./index.ts"
import { Chain, POR_MVR_FEEDS_URL } from "../chains.ts"

export const getServerSideChainMetadata = async (chains: Chain[]): Promise<Record<string, ChainMetadata>> => {
  const cache = {}

  for (const chain of chains) {
    const requests = chain.networks.map((nw) =>
      nw?.rddUrl
        ? EleventyFetch(nw?.rddUrl, {
            duration: "5m",
            type: "json", // we'll parse JSON for you
          }).then((metadata) => ({
            ...nw,
            metadata: metadata.filter(
              (meta) => meta.docs?.hidden !== true && (meta.proxyAddress || meta.transmissionsAccount || meta.feedId)
            ),
          }))
        : undefined
    )
    const networks = await Promise.all(requests)

    cache[chain.page] = { ...chain, networks }
  }

  try {
    const mvrFeeds = await EleventyFetch(POR_MVR_FEEDS_URL, {
      duration: "5m",
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
