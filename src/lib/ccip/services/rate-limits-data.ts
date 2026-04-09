import {
  Environment,
  RateLimitsFilterType,
  RateLimitsServiceResponse,
  TokenLaneData,
  RawTokenRateLimits,
  RateLimiterConfig,
  RateLimiterEntry,
  RateLimiterDirections,
  isRateLimiterUnavailable,
  LaneRateLimitsFilterType,
  LaneInputKeyType,
} from "~/lib/ccip/types/index.ts"
import { LaneDataService } from "./lane-data.ts"
import { loadReferenceData, Version } from "@config/data/ccip/index.ts"
import type { ChainConfig } from "@config/data/ccip/types.ts"
import { logger } from "@lib/logging/index.js"

import { fetchLaneRateLimits } from "~/lib/ccip/graphql/services/enrichment-data-service.ts"

export const prerender = false

/**
 * Service class for handling CCIP rate limits data operations
 * Provides functionality to filter and retrieve rate limiter configurations
 */
export class RateLimitsDataService {
  private readonly requestId: string

  /**
   * Creates a new instance of RateLimitsDataService
   */
  constructor() {
    this.requestId = crypto.randomUUID()

    logger.debug({
      message: "RateLimitsDataService initialized",
      requestId: this.requestId,
    })
  }

  /**
   * Retrieves rate limits data for a specific lane, optionally filtered by tokens, direction, and rate type
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param filters - Filter parameters including source/destination chains, tokens, direction, and rate type
   * @returns Filtered rate limits data with metadata
   */
  async getFilteredRateLimits(
    environment: Environment,
    filters: RateLimitsFilterType
  ): Promise<RateLimitsServiceResponse> {
    logger.debug({
      message: "Processing rate limits request",
      requestId: this.requestId,
      environment,
      filters,
    })

    try {
      // Load reference data to resolve chain identifiers
      const { chainsReferenceData } = loadReferenceData({
        environment,
        version: Version.V1_2_0,
      })

      // Resolve chain identifiers to chains.json keys (handles both short names and selector names)
      const laneDataService = new LaneDataService()
      const resolvedSourceId =
        laneDataService.resolveToInternalId(
          filters.sourceInternalId,
          "internalId",
          chainsReferenceData as Record<string, ChainConfig>
        ) || filters.sourceInternalId
      const resolvedDestId =
        laneDataService.resolveToInternalId(
          filters.destinationInternalId,
          "internalId",
          chainsReferenceData as Record<string, ChainConfig>
        ) || filters.destinationInternalId

      // Create resolved filters
      const resolvedFilters: RateLimitsFilterType = {
        ...filters,
        sourceInternalId: resolvedSourceId,
        destinationInternalId: resolvedDestId,
      }

      // Get token list: from filter or from all tokens in reference data
      const { tokensReferenceData } = loadReferenceData({ environment, version: Version.V1_2_0 })
      const tokenFilter = resolvedFilters.tokens
        ? resolvedFilters.tokens
            .split(",")
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0)
        : Object.keys(tokensReferenceData)

      // Fetch rate limits per token from GraphQL
      const result: Record<string, TokenLaneData> = {}
      for (const tokenSymbol of tokenFilter) {
        const laneRateLimits = await fetchLaneRateLimits(
          environment,
          tokenSymbol,
          resolvedFilters.sourceInternalId,
          resolvedFilters.destinationInternalId
        )
        if (laneRateLimits) {
          const filteredLimits = this.applyFilters(laneRateLimits, resolvedFilters.direction, resolvedFilters.rateType)
          if (filteredLimits) {
            result[tokenSymbol] = filteredLimits
          }
        }
      }

      const tokenCount = Object.keys(result).length

      logger.info({
        message: "Rate limits data retrieved successfully",
        requestId: this.requestId,
        tokenCount,
        sourceChain: filters.sourceInternalId,
        destinationChain: filters.destinationInternalId,
      })

      return {
        data: result,
        metadata: {
          tokenCount,
        },
      }
    } catch (error) {
      logger.error({
        message: "Failed to process rate limits data",
        requestId: this.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      throw error
    }
  }

  /**
   * Applies direction and rate type filters to rate limits
   *
   * @param rateLimits - Original rate limits with standard and custom entries
   * @param direction - Optional direction filter ("in" or "out")
   * @param rateType - Optional rate type filter ("standard" or "custom")
   * @returns Filtered rate limits or null if no data matches
   */
  private applyFilters(
    rateLimits: RawTokenRateLimits,
    direction?: "in" | "out",
    rateType?: "standard" | "custom"
  ): TokenLaneData | null {
    const filteredStandard = this.applyDirectionFilter(rateLimits.standard, direction)
    const filteredCustom = this.applyDirectionFilter(rateLimits.custom, direction)
    const fees = rateLimits.fees ?? null

    if (rateType === "standard") {
      if (!filteredStandard) {
        return null
      }
      return {
        rateLimits: { standard: filteredStandard, custom: null },
        fees,
      }
    }

    if (rateType === "custom") {
      if (!filteredCustom) {
        return null
      }
      return {
        rateLimits: { standard: null, custom: filteredCustom },
        fees,
      }
    }

    if (!filteredStandard && !filteredCustom) {
      return null
    }

    return {
      rateLimits: {
        standard: filteredStandard ?? null,
        custom: filteredCustom ?? null,
      },
      fees,
    }
  }

  /**
   * Applies direction filter to a rate limiter entry
   *
   * @param entry - Rate limiter entry (directions or unavailable)
   * @param direction - Optional direction filter ("in" or "out")
   * @returns Filtered entry or null if no data matches
   */
  private applyDirectionFilter(entry: RateLimiterEntry, direction?: "in" | "out"): RateLimiterEntry | null {
    // If entry is unavailable, return it as-is
    if (isRateLimiterUnavailable(entry)) {
      return entry
    }

    // If no direction filter, return the full entry
    if (!direction) {
      return entry
    }

    // Filter to specific direction
    const directionsEntry = entry as RateLimiterDirections
    const filteredConfig = directionsEntry[direction]
    if (!filteredConfig) {
      return null
    }

    // Return only the requested direction
    return {
      [direction]: filteredConfig,
    } as RateLimiterDirections
  }

  /**
   * Validates that a rate limiter config exists and has valid structure
   */
  private isValidRateLimiterConfig(config: unknown): config is RateLimiterConfig {
    if (!config || typeof config !== "object") {
      return false
    }

    const c = config as Record<string, unknown>
    return typeof c.capacity === "string" && typeof c.isEnabled === "boolean" && typeof c.rate === "string"
  }

  /**
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }

  /**
   * Retrieves rate limits for a specific lane using path parameters
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param sourceIdentifier - Source chain identifier
   * @param destinationIdentifier - Destination chain identifier
   * @param inputKeyType - Type of chain identifier (chainId, selector, internalId)
   * @param filters - Optional filters for tokens, direction, rate type
   * @returns Rate limits data with metadata
   */
  async getLaneRateLimits(
    environment: Environment,
    sourceIdentifier: string,
    destinationIdentifier: string,
    inputKeyType: LaneInputKeyType,
    filters: LaneRateLimitsFilterType = {}
  ): Promise<RateLimitsServiceResponse> {
    logger.info({
      message: "Processing lane rate limits request",
      requestId: this.requestId,
      environment,
      sourceIdentifier,
      destinationIdentifier,
      inputKeyType,
      filters,
    })

    try {
      // Resolve chain identifiers to internal IDs
      const { chainsReferenceData } = loadReferenceData({
        environment,
        version: Version.V1_2_0,
      })

      const laneDataService = new LaneDataService()
      const sourceInternalId = laneDataService.resolveToInternalId(
        sourceIdentifier,
        inputKeyType,
        chainsReferenceData as Record<string, ChainConfig>
      )
      const destinationInternalId = laneDataService.resolveToInternalId(
        destinationIdentifier,
        inputKeyType,
        chainsReferenceData as Record<string, ChainConfig>
      )

      if (!sourceInternalId || !destinationInternalId) {
        logger.warn({
          message: "Could not resolve chain identifiers for rate limits",
          requestId: this.requestId,
          sourceIdentifier,
          destinationIdentifier,
        })
        return {
          data: {},
          metadata: { tokenCount: 0 },
        }
      }

      // Use existing filter-based method with resolved internal IDs
      const fullFilters: RateLimitsFilterType = {
        sourceInternalId,
        destinationInternalId,
        tokens: filters.tokens,
        direction: filters.direction,
        rateType: filters.rateType,
      }

      return this.getFilteredRateLimits(environment, fullFilters)
    } catch (error) {
      logger.error({
        message: "Failed to get lane rate limits",
        requestId: this.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}
