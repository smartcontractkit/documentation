import { useState, useEffect } from "react"
import type { TokenRateLimits, Environment } from "~/lib/ccip/types/index.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"

interface LaneConfig {
  source: string
  destination: string
}

interface UseMultiLaneRateLimitsResult {
  rateLimitsMap: Record<string, Record<string, TokenRateLimits>>
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook to fetch rate limits for multiple lanes
 * Useful for components that need to display rate limits across multiple lanes
 * @param lanes - Array of lane configurations with source and destination
 * @param environment - Network environment (mainnet/testnet)
 * @returns Map of rate limits keyed by lane (source-destination), loading state, and error state
 */
export function useMultiLaneRateLimits(lanes: LaneConfig[], environment: Environment): UseMultiLaneRateLimitsResult {
  const [rateLimitsMap, setRateLimitsMap] = useState<Record<string, Record<string, TokenRateLimits>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchAllRateLimits = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const newRateLimits: Record<string, Record<string, TokenRateLimits>> = {}

        // Fetch all lanes in parallel
        const promises = lanes.map(async ({ source, destination }) => {
          const laneKey = `${source}-${destination}`
          const response = await realtimeDataService.getLaneSupportedTokens(source, destination, environment)

          if (response?.data) {
            newRateLimits[laneKey] = response.data
          }
        })

        await Promise.all(promises)

        if (isMounted) {
          setRateLimitsMap(newRateLimits)
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching multi-lane rate limits:", err)
          setError(err instanceof Error ? err : new Error("Failed to fetch rate limits"))
          setRateLimitsMap({})
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (lanes.length > 0) {
      fetchAllRateLimits()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [lanes, environment])

  return { rateLimitsMap, isLoading, error }
}
