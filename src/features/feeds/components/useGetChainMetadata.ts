import { useEffect, useState } from "preact/hooks"
import { getChainMetadata } from "../api"
import { Chain } from "../data/chains"

export function useGetChainMetadata(chainId: Chain["page"], { initialCache }) {
  const [cache, setCache] = useState(initialCache)
  const [error, setError] = useState({ [chainId]: false })
  const [loading, setLoading] = useState({ [chainId]: false })
  const chainData = cache[chainId]

  useEffect(() => {
    async function refetch() {
      if (!chainId) return
      // store the current value into a cache
      setLoading((curr) => ({ ...curr, [chainId]: true }))
      setError((curr) => ({ ...curr, [chainId]: false }))

      try {
        const metadata = await getChainMetadata(cache[chainId])

        setCache((currentCache) => ({
          ...currentCache,
          [metadata.page]: metadata,
        }))
      } catch (e) {
        setError((curr) => ({ ...curr, [chainId]: true }))
      } finally {
        setLoading((curr) => ({ ...curr, [chainId]: false }))
      }
    }
    refetch()
  }, [chainId])

  return {
    data: chainData,
    error: error[chainId],
    loading: loading[chainId] && !cache[chainId],
  }
}
