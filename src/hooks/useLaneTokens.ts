import { useMemo } from "react"
import { LaneFilter } from "~/config/data/ccip/types.ts"
import { getTokenIconUrl } from "~/features/utils/index.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"
import type { TokenLaneData } from "~/lib/ccip/types/index.ts"

export interface ProcessedToken {
  id: string
  tokenAddress: string
  decimals: number
  sourcePoolType: string
  destPoolType: string
  logo: string
  rateLimits: {
    standard: { capacity: string; rate: string; isEnabled: boolean } | null
    ftf: { capacity: string; rate: string; isEnabled: boolean } | null
  }
  isPaused: boolean
}

interface UseLaneTokensParams {
  tokens: string[] | undefined
  rateLimitsData: Record<string, TokenLaneData>
  inOutbound: LaneFilter
  searchQuery: string
}

export function useLaneTokens({ tokens, rateLimitsData, inOutbound, searchQuery }: UseLaneTokensParams) {
  const processedTokens = useMemo(() => {
    if (!tokens) return []

    const direction = inOutbound === LaneFilter.Outbound ? "out" : "in"

    return tokens
      .filter((token) => token.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((token) => {
        const tokenLaneData = rateLimitsData[token]
        if (!tokenLaneData) return null

        const logo = getTokenIconUrl(token)
        const allLimits = realtimeDataService.getAllRateLimitsForDirection(tokenLaneData.rateLimits, direction)
        const isPaused = allLimits.standard?.capacity === "0"

        return {
          id: token,
          tokenAddress: tokenLaneData.tokenAddress ?? "",
          decimals: tokenLaneData.tokenDecimals ?? 0,
          sourcePoolType: tokenLaneData.sourcePoolType ?? "",
          destPoolType: tokenLaneData.destPoolType ?? "",
          logo,
          rateLimits: allLimits,
          isPaused,
        }
      })
      .filter((token): token is ProcessedToken => token !== null)
  }, [tokens, rateLimitsData, inOutbound, searchQuery])

  return {
    tokens: processedTokens,
    count: tokens?.length ?? 0,
  }
}
