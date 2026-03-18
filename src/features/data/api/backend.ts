import EleventyFetch from "@11ty/eleventy-fetch"
import { readFileSync } from "fs"
import { ChainMetadata, mergeWithMVRFeeds } from "./index.ts"
import { Chain, POR_MVR_FEEDS_URL } from "../chains.ts"

/**
 * Fetches JSON from a URL or, for local dev overrides, reads directly from disk.
 * A leading "/" is treated as a public-directory-relative path (e.g. "/files/json/feeds-mainnet.json"
 * → <cwd>/public/files/json/feeds-mainnet.json). Relative paths (./  ../) are read as-is.
 * TODO: revert before merging — local file support only needed for stablecoin-bound testing.
 */
const fetchJson = async (url: string, skipCache: boolean): Promise<any> => {
  if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
    const filePath = url.startsWith("/") ? `${process.cwd()}/public${url}` : url
    return JSON.parse(readFileSync(filePath, "utf8"))
  }
  return EleventyFetch(url, {
    duration: skipCache ? "0s" : "1d",
    type: "json",
  })
}

export const getServerSideChainMetadata = async (
  chains: Chain[],
  skipCache = false
): Promise<Record<string, ChainMetadata>> => {
  const cache = {}

  for (const chain of chains) {
    const requests = chain.networks.map((nw) =>
      nw?.rddUrl
        ? fetchJson(nw.rddUrl, skipCache).then((metadata) => ({
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
