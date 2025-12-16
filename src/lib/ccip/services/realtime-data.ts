import { Environment } from "~/lib/ccip/types/index.ts"
import type {
  TokenRateLimits,
  RateLimiterEntry,
  RateLimiterConfig,
  TokenFinalityData,
  OutputKeyType,
} from "~/lib/ccip/types/index.ts"

export const prerender = false

/**
 * Base URL for CCIP realtime API
 * For client-side calls, use relative URLs to hit the local API endpoints
 */
const getApiBaseUrl = () => {
  // In browser context, use relative URLs
  if (typeof window !== "undefined") {
    return ""
  }
  // In server context, use environment variable or default
  return process.env.CCIP_REALTIME_API_BASE_URL || "https://api.ccip.chainlink.com"
}

/**
 * Response structure for lane supported tokens endpoint
 */
export interface LaneSupportedTokensResponse {
  metadata: {
    environment: Environment
    timestamp: string
    requestId: string
    sourceChain: string
    destinationChain: string
    tokenCount: number
  }
  supportedTokens: Record<string, TokenRateLimits>
}

/**
 * Response structure for token finality endpoint
 */
export interface TokenFinalityResponse {
  metadata: {
    environment: Environment
    timestamp: string
    requestId: string
    tokenSymbol: string
    chainCount: number
  }
  data: Record<string, TokenFinalityData>
}

/**
 * Service class for handling CCIP realtime data operations
 * Provides functionality to fetch live data from the CCIP API
 */
export class RealtimeDataService {
  private readonly requestId: string

  /**
   * Creates a new instance of RealtimeDataService
   */
  constructor() {
    // Generate UUID - handle both browser and server environments
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      this.requestId = crypto.randomUUID()
    } else {
      this.requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    }
  }

  /**
   * Fetches supported tokens with rate limits for a specific lane
   *
   * @param sourceInternalId - Source chain internal ID
   * @param destinationInternalId - Destination chain internal ID
   * @param environment - Network environment (mainnet/testnet)
   * @returns Supported tokens with rate limits
   */
  async getLaneSupportedTokens(
    sourceInternalId: string,
    destinationInternalId: string,
    environment: Environment
  ): Promise<LaneSupportedTokensResponse | null> {
    try {
      const baseUrl = getApiBaseUrl()
      const url = `${baseUrl}/api/ccip/v1/lanes/by-internal-id/${sourceInternalId}/${destinationInternalId}/supported-tokens?environment=${environment}`

      const response = await fetch(url)

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching lane supported tokens:", error)
      return null
    }
  }

  /**
   * Fetches token finality details across all chains
   *
   * @param tokenCanonicalSymbol - Token canonical symbol (e.g., "BETS", "LINK")
   * @param environment - Network environment (mainnet/testnet)
   * @param outputKey - Format to use for displaying chain keys (optional)
   * @returns Token finality data for all chains
   */
  async getTokenFinality(
    tokenCanonicalSymbol: string,
    environment: Environment,
    outputKey?: OutputKeyType
  ): Promise<TokenFinalityResponse | null> {
    try {
      const baseUrl = getApiBaseUrl()
      let url = `${baseUrl}/api/ccip/v1/tokens/${tokenCanonicalSymbol}/finality?environment=${environment}`

      if (outputKey) {
        url += `&output_key=${outputKey}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        console.error("Failed to fetch token finality:", response.status)
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching token finality:", error)
      return null
    }
  }

  /**
   * Checks if rate limiter data is unavailable (null)
   *
   * @param entry - Rate limiter entry to check
   * @returns True if unavailable (null)
   */
  isRateLimiterUnavailable(entry: RateLimiterEntry): entry is null {
    return entry === null
  }

  /**
   * Checks if rate limiter is enabled
   *
   * @param config - Rate limiter configuration
   * @returns True if enabled
   */
  isRateLimiterEnabled(config: RateLimiterConfig): boolean {
    return config.isEnabled
  }

  /**
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
