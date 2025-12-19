import { useState, useEffect } from "react"
import type { TokenRateLimits, Environment } from "~/lib/ccip/types/index.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"

interface UseTokenRateLimitsResult {
  rateLimits: Record<string, TokenRateLimits>
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook to fetch token rate limits for a specific lane
 * @param source - Source chain internal ID
 * @param destination - Destination chain internal ID
 * @param environment - Network environment (mainnet/testnet)
 * @returns Rate limits data, loading state, and error state
 */
export function useTokenRateLimits(
  source: string,
  destination: string,
  environment: Environment
): UseTokenRateLimitsResult {
  const [rateLimits, setRateLimits] = useState<Record<string, TokenRateLimits>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchRateLimits = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await realtimeDataService.getLaneSupportedTokens(source, destination, environment)

        if (isMounted) {
          if (response?.data) {
            setRateLimits(response.data)
          } else {
            setRateLimits({})
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching rate limits:", err)
          setError(err instanceof Error ? err : new Error("Failed to fetch rate limits"))
          setRateLimits({})
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchRateLimits()

    return () => {
      isMounted = false
    }
  }, [source, destination, environment])

  return { rateLimits, isLoading, error }
}
