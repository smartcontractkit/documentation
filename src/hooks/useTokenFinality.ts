import { useState, useEffect } from "react"
import type { PoolFinalityConfig, ChainPoolDetails, Environment, OutputKeyType } from "~/lib/ccip/types/index.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"

interface UseTokenFinalityResult {
  finalityData: Record<string, PoolFinalityConfig>
  poolDetails: Record<string, ChainPoolDetails>
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook to fetch token finality data across all chains
 * @param tokenCanonicalSymbol - Token canonical symbol (e.g., "BETS", "LINK")
 * @param environment - Network environment (mainnet/testnet)
 * @param outputKey - Format to use for displaying chain keys (optional)
 * @returns Finality data, pool details, loading state, and error state
 */
export function useTokenFinality(
  tokenCanonicalSymbol: string,
  environment: Environment,
  outputKey?: OutputKeyType
): UseTokenFinalityResult {
  const [finalityData, setFinalityData] = useState<Record<string, PoolFinalityConfig>>({})
  const [poolDetails, setPoolDetails] = useState<Record<string, ChainPoolDetails>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchFinalityData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await realtimeDataService.getTokenFinality(tokenCanonicalSymbol, environment, outputKey)

        if (isMounted) {
          if (result) {
            setFinalityData(result.finality)
            setPoolDetails(result.poolDetails)
          } else {
            console.warn("[useTokenFinality] No data received")
            setFinalityData({})
            setPoolDetails({})
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch token finality data:", err)
          setError(err instanceof Error ? err : new Error("Failed to fetch token finality"))
          setFinalityData({})
          setPoolDetails({})
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFinalityData()

    return () => {
      isMounted = false
    }
  }, [tokenCanonicalSymbol, environment, outputKey])

  return { finalityData, poolDetails, isLoading, error }
}
