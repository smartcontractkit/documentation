import { useEffect, useState } from "preact/hooks"
import { ChainMetadata, getChainMetadata, mergeWithMVRFeeds } from "../../data/api/index.ts"
import { Chain, CHAINS, POR_MVR_FEEDS_URL } from "~/features/data/chains.ts"

export function useGetChainMetadata(chain: Chain, initialCache?: ChainMetadata) {
  const [cache, setCache] = useState(initialCache ?? { [chain.page]: chain })
  const [error, setError] = useState({ [chain.page]: false })
  const [loading, setLoading] = useState({ [chain.page]: false })
  const processedData = cache[chain.page]

  // Add a key to track when the chain changes
  const chainKey = chain?.page || "unknown"

  useEffect(() => {
    async function refetch() {
      if (!chain) return
      // store the current value into a cache
      setLoading((curr) => ({ ...curr, [chain.page]: true }))
      setError((curr) => ({ ...curr, [chain.page]: false }))

      try {
        // Create a temporary cache with metadata for all chains
        const tempCache = { ...cache }

        // Fetch metadata for all chains
        const fetchResults = await Promise.all(
          CHAINS.map(async (chainItem) => {
            try {
              const metadata = await getChainMetadata(chainItem)
              return { page: chainItem.page, metadata }
            } catch (e) {
              console.error(`Error fetching metadata for ${chainItem.page}:`, e)
              return { page: chainItem.page, metadata: chainItem }
            }
          })
        )

        // Update tempCache with all fetched metadata
        fetchResults.forEach(({ page, metadata }) => {
          tempCache[page] = metadata
        })

        // Try to merge MVR feeds with all chain metadata
        try {
          const mergedCache = await mergeWithMVRFeeds(tempCache, POR_MVR_FEEDS_URL)
          setCache(mergedCache)
        } catch (e) {
          console.error("Error merging MVR feeds:", e)
          setCache(tempCache)
        }
      } catch (e) {
        console.error("Error in metadata fetch process:", e)
        setError((curr) => ({ ...curr, [chain.page]: true }))
      } finally {
        setLoading((curr) => ({ ...curr, [chain.page]: false }))
      }
    }
    refetch()
  }, [chainKey]) // Use chainKey instead of chain to ensure the effect reruns when the chain changes

  return {
    processedData,
    error: error[chain.page],
    loading: loading[chain.page],
  }
}
