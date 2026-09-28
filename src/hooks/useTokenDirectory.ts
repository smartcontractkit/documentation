import { useState, useEffect } from "react"
import type { TokenDirectoryData, Environment } from "~/lib/ccip/types/index.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"

interface UseTokenDirectoryResult {
  data: TokenDirectoryData | null
  isLoading: boolean
  error: Error | null
}

/**
 * Fetches full token directory data for a specific token/chain combination.
 * A single call returns outboundLanes + inboundLanes with rate limits, verifiers,
 * pool info, and custom finality — replacing N separate rate-limit requests.
 *
 * @param tokenCanonicalSymbol - Token canonical symbol (e.g., "LINK")
 * @param chain - Source chain directory key (e.g., "mainnet", "bsc-mainnet")
 * @param environment - Network environment (mainnet/testnet)
 */
export function useTokenDirectory(
  tokenCanonicalSymbol: string,
  chain: string,
  environment: Environment
): UseTokenDirectoryResult {
  const [data, setData] = useState<TokenDirectoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await realtimeDataService.getTokenDirectoryData(tokenCanonicalSymbol, chain, environment)

        if (isMounted) {
          setData(response?.data ?? null)
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching token directory data:", err)
          setError(err instanceof Error ? err : new Error("Failed to fetch token directory data"))
          setData(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [tokenCanonicalSymbol, chain, environment])

  return { data, isLoading, error }
}
