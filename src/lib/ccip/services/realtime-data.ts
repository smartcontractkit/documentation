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
  data: Record<string, TokenRateLimits>
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

  /**
   * Extracts FTF (custom) rate limit data for a specific token and direction
   *
   * @param tokenRateLimits - Token rate limits containing standard and custom entries
   * @param direction - Direction ("in" for inbound, "out" for outbound)
   * @returns FTF rate limiter config or null if unavailable
   */
  getFTFRateLimit(tokenRateLimits: TokenRateLimits, direction: "in" | "out"): RateLimiterConfig | null {
    if (!tokenRateLimits.custom || this.isRateLimiterUnavailable(tokenRateLimits.custom)) {
      return null
    }

    const customEntry = tokenRateLimits.custom
    return customEntry[direction] || null
  }

  /**
   * Gets FTF capacity for a specific token and direction
   *
   * @param tokenRateLimits - Token rate limits containing standard and custom entries
   * @param direction - Direction ("in" for inbound, "out" for outbound)
   * @returns FTF capacity value or null if unavailable
   */
  getFTFCapacity(tokenRateLimits: TokenRateLimits, direction: "in" | "out"): string | null {
    const ftfLimit = this.getFTFRateLimit(tokenRateLimits, direction)
    return ftfLimit?.capacity || null
  }

  /**
   * Gets FTF refill rate for a specific token and direction
   *
   * @param tokenRateLimits - Token rate limits containing standard and custom entries
   * @param direction - Direction ("in" for inbound, "out" for outbound)
   * @returns FTF refill rate value or null if unavailable
   */
  getFTFRefillRate(tokenRateLimits: TokenRateLimits, direction: "in" | "out"): string | null {
    const ftfLimit = this.getFTFRateLimit(tokenRateLimits, direction)
    return ftfLimit?.rate || null
  }

  /**
   * Checks if FTF rate limiting is enabled for a specific token and direction
   *
   * @param tokenRateLimits - Token rate limits containing standard and custom entries
   * @param direction - Direction ("in" for inbound, "out" for outbound)
   * @returns True if FTF is enabled, false otherwise
   */
  isFTFEnabled(tokenRateLimits: TokenRateLimits, direction: "in" | "out"): boolean {
    const ftfLimit = this.getFTFRateLimit(tokenRateLimits, direction)
    return ftfLimit?.isEnabled || false
  }

  /**
   * Gets both standard and FTF rate limits for a specific token and direction
   *
   * @param tokenRateLimits - Token rate limits containing standard and custom entries (can be null/undefined)
   * @param direction - Direction ("in" for inbound, "out" for outbound)
   * @returns Object containing both standard and FTF rate limits
   */
  getAllRateLimitsForDirection(
    tokenRateLimits: TokenRateLimits | null | undefined,
    direction: "in" | "out"
  ): {
    standard: RateLimiterConfig | null
    ftf: RateLimiterConfig | null
  } {
    if (!tokenRateLimits) {
      return { standard: null, ftf: null }
    }

    const standardLimit =
      tokenRateLimits.standard && !this.isRateLimiterUnavailable(tokenRateLimits.standard)
        ? tokenRateLimits.standard[direction] || null
        : null

    const ftfLimit = this.getFTFRateLimit(tokenRateLimits, direction)

    return {
      standard: standardLimit,
      ftf: ftfLimit,
    }
  }

  /**
   * Checks if a token has FTF rate limiting available
   *
   * @param tokenRateLimits - Token rate limits to check
   * @returns True if FTF data is available (not null/unavailable)
   */
  hasFTFRateLimits(tokenRateLimits: TokenRateLimits): boolean {
    return tokenRateLimits.custom !== null && !this.isRateLimiterUnavailable(tokenRateLimits.custom)
  }
}
