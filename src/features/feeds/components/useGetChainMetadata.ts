import { useEffect, useState } from "preact/hooks"
import { ChainMetadata, getChainMetadata } from "../../data/api"
import { Chain } from "~/features/data/chains"

export function useGetChainMetadata(chain: Chain, initialCache?: ChainMetadata) {
  const [cache, setCache] = useState(initialCache ?? { [chain.page]: chain })
  const [error, setError] = useState({ [chain.page]: false })
  const [loading, setLoading] = useState({ [chain.page]: false })
  const processedData = cache[chain.page]

  useEffect(() => {
    async function refetch() {
      if (!chain) return
      // store the current value into a cache
      setLoading((curr) => ({ ...curr, [chain.page]: true }))
      setError((curr) => ({ ...curr, [chain.page]: false }))

      if (processedData) {
        setCache((currentCache) => ({
          ...currentCache,
          [processedData.page]: processedData,
        }))
      } else {
        setCache((currentCache) => ({
          ...currentCache,
          [chain.page]: chain,
        }))
      }

      try {
        const metadata = await getChainMetadata(chain)

        setCache((currentCache) => ({
          ...currentCache,
          [metadata.page]: metadata,
        }))
      } catch (e) {
        setError((curr) => ({ ...curr, [chain.page]: true }))
      } finally {
        setLoading((curr) => ({ ...curr, [chain.page]: false }))
      }
    }
    refetch()
  }, [chain])

  return {
    processedData,
    error: error[chain.page],
    loading: loading[chain.page],
  }
}
