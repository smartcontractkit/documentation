import { useMemo } from "react"
import { Environment, LaneFilter, Version } from "~/config/data/ccip/types.ts"
import { getTokenData } from "~/config/data/ccip/data.ts"
import { getTokenIconUrl } from "~/features/utils/index.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"

export interface ProcessedToken {
  id: string
  data: ReturnType<typeof getTokenData>
  logo: string
  rateLimits: {
    standard: { capacity: string; rate: string; isEnabled: boolean } | null
    ftf: { capacity: string; rate: string; isEnabled: boolean } | null
  }
  isPaused: boolean
}

interface UseLaneTokensParams {
  tokens: string[] | undefined
  environment: Environment
  rateLimitsData: Record<string, any>
  inOutbound: LaneFilter
  searchQuery: string
}

export function useLaneTokens({ tokens, environment, rateLimitsData, inOutbound, searchQuery }: UseLaneTokensParams) {
  const processedTokens = useMemo(() => {
    if (!tokens) return []

    const direction = inOutbound === LaneFilter.Outbound ? "out" : "in"

    return tokens
      .filter((token) => token.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((token) => {
        const data = getTokenData({
          environment,
          version: Version.V1_2_0,
          tokenId: token || "",
        })

        // Skip tokens with no data
        if (!Object.keys(data).length) return null

        const logo = getTokenIconUrl(token)
        const tokenRateLimits = rateLimitsData[token]
        const allLimits = realtimeDataService.getAllRateLimitsForDirection(tokenRateLimits, direction)
        const isPaused = allLimits.standard?.capacity === "0"

        return {
          id: token,
          data,
          logo,
          rateLimits: allLimits,
          isPaused,
        }
      })
      .filter((token): token is ProcessedToken => token !== null)
  }, [tokens, environment, rateLimitsData, inOutbound, searchQuery])

  return {
    tokens: processedTokens,
    count: tokens?.length ?? 0,
  }
}
