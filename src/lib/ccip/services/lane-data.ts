import {
  Environment,
  LaneDetails,
  LaneFilterType,
  LaneConfigError,
  LaneServiceResponse,
  ChainInfo,
  ChainInfoInternal,
  OutputKeyType,
  ChainType,
  ChainFamily,
} from "~/lib/ccip/types/index.ts"
import { loadReferenceData, Version } from "@config/data/ccip/index.ts"
import type { LaneConfig, ChainConfig } from "@config/data/ccip/types.ts"
import { generateChainKey, normalizeVersion } from "~/lib/ccip/utils.ts"
import { logger } from "@lib/logging/index.js"
import {
  getChainId,
  getTitle,
  getChainTypeAndFamily,
  directoryToSupportedChain,
} from "../../../features/utils/index.ts"
import { getSelectorEntry } from "@config/data/ccip/selectors.ts"

export const prerender = false

/**
 * Service class for handling CCIP lane data operations
 * Provides functionality to validate and filter lane configurations
 */
export class LaneDataService {
  private errors: LaneConfigError[] = []
  private readonly requestId: string
  private skippedLanesCount = 0

  /**
   * Creates a new instance of LaneDataService
   */
  constructor() {
    this.requestId = crypto.randomUUID()

    logger.debug({
      message: "LaneDataService initialized",
      requestId: this.requestId,
    })
  }

  /**
   * Retrieves and filters lane data based on environment and filters
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param filters - Filter parameters for lanes
   * @param outputKey - Format to use for displaying lane keys
   * @returns Filtered lane data with metadata
   */
  async getFilteredLanes(
    environment: Environment,
    filters: LaneFilterType,
    outputKey: OutputKeyType
  ): Promise<LaneServiceResponse> {
    logger.debug({
      message: "Processing lane data",
      requestId: this.requestId,
      environment,
      filters,
      outputKey,
    })

    try {
      // Load reference data
      const { lanesReferenceData, chainsReferenceData } = loadReferenceData({
        environment,
        version: Version.V1_2_0,
      })

      const result: Record<string, LaneDetails> = {}
      this.errors = []
      this.skippedLanesCount = 0

      // Process all lanes
      for (const [sourceChainKey, destinations] of Object.entries(lanesReferenceData)) {
        for (const [destChainKey, laneConfig] of Object.entries(destinations)) {
          try {
            // Get chain information
            const sourceChain = this.resolveChainInfo(sourceChainKey, chainsReferenceData)
            const destChain = this.resolveChainInfo(destChainKey, chainsReferenceData)

            if (!sourceChain || !destChain) {
              this.addError(sourceChainKey, destChainKey, "Failed to resolve chain information", [
                "sourceChain",
                "destinationChain",
              ])
              continue
            }

            // Apply filters
            if (!this.passesFilters(sourceChain, destChain, filters)) {
              this.skippedLanesCount++
              continue
            }

            // Generate lane key
            const laneKey = this.generateLaneKey(sourceChain, destChain, outputKey)

            // Build lane details
            const laneDetails = this.buildLaneDetails(sourceChain, destChain, laneConfig)

            // Check for version mismatch
            if (laneDetails.onRamp.version !== laneDetails.offRamp.version) {
              this.addError(
                sourceChainKey,
                destChainKey,
                `Version mismatch: onRamp v${laneDetails.onRamp.version} != offRamp v${laneDetails.offRamp.version}`,
                ["version"]
              )
              continue
            }

            // Apply version filter if provided
            if (filters.version) {
              // Both onRamp and offRamp must match the specified version
              if (laneDetails.onRamp.version !== filters.version || laneDetails.offRamp.version !== filters.version) {
                this.skippedLanesCount++
                continue
              }
            }

            result[laneKey] = laneDetails

            logger.debug({
              message: "Lane processed successfully",
              requestId: this.requestId,
              laneKey,
              sourceChain: sourceChainKey,
              destinationChain: destChainKey,
            })
          } catch (error) {
            this.addError(
              sourceChainKey,
              destChainKey,
              `Lane processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              ["laneConfig"]
            )
          }
        }
      }

      const validLaneCount = Object.keys(result).length
      const ignoredLaneCount = this.errors.length

      logger.info({
        message: "Lane data processing completed",
        requestId: this.requestId,
        validLaneCount,
        ignoredLaneCount,
        skippedLanesCount: this.skippedLanesCount,
      })

      return {
        data: result,
        errors: this.errors,
        metadata: {
          validLaneCount,
          ignoredLaneCount,
        },
      }
    } catch (error) {
      logger.error({
        message: "Failed to process lane data",
        requestId: this.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      throw error
    }
  }

  /**
   * Resolves chain information from chain key
   */
  private resolveChainInfo(chainKey: string, chainsReferenceData: Record<string, unknown>): ChainInfoInternal | null {
    try {
      const chainConfig = chainsReferenceData[chainKey]

      if (!chainConfig) {
        return null
      }

      // Try to get supported chain for additional info, but don't fail if not found
      let chainId: string | number = chainKey // fallback to chainKey
      let displayName: string = chainKey // fallback to chainKey
      let chainType: ChainType = "evm" // default to evm
      let chainFamily: ChainFamily = "evm" // default to evm

      try {
        const supportedChain = directoryToSupportedChain(chainKey)
        const resolvedChainId = getChainId(supportedChain)
        const resolvedDisplayName = getTitle(supportedChain)
        const { chainType: resolvedChainType, chainFamily: resolvedChainFamily } = getChainTypeAndFamily(supportedChain)

        if (resolvedChainId) chainId = resolvedChainId
        if (resolvedDisplayName) displayName = resolvedDisplayName
        chainType = resolvedChainType
        chainFamily = resolvedChainFamily
      } catch {
        // If directoryToSupportedChain fails, continue with fallback values
        // This allows processing of chains not yet in the mapping
      }

      // Get selector from chain configuration
      const configData = chainConfig as ChainConfig
      const selector = configData.chainSelector

      if (!selector) {
        return null
      }

      // Resolve internalId from the selector YAML name (consistent with chains and tokens endpoints)
      // Falls back to the RDD directory key if the selector entry is not found
      const selectorEntry = getSelectorEntry(chainId, chainType)
      const internalId = selectorEntry?.name ?? chainKey

      return {
        chainId,
        displayName,
        selector,
        internalId,
        chainType,
        chainFamily,
      }
    } catch (error) {
      logger.warn({
        message: "Failed to resolve chain info",
        requestId: this.requestId,
        chainKey,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return null
    }
  }

  /**
   * Checks if a lane passes the given filters
   */
  private passesFilters(
    sourceChain: ChainInfoInternal,
    destChain: ChainInfoInternal,
    filters: LaneFilterType
  ): boolean {
    // Check source chain filters
    if (filters.sourceChainId && !this.matchesChainFilter(sourceChain, filters.sourceChainId, "chainId")) {
      return false
    }
    if (filters.sourceSelector && !this.matchesChainFilter(sourceChain, filters.sourceSelector, "selector")) {
      return false
    }
    if (filters.sourceInternalId && !this.matchesChainFilter(sourceChain, filters.sourceInternalId, "internalId")) {
      return false
    }

    // Check destination chain filters
    if (filters.destinationChainId && !this.matchesChainFilter(destChain, filters.destinationChainId, "chainId")) {
      return false
    }
    if (filters.destinationSelector && !this.matchesChainFilter(destChain, filters.destinationSelector, "selector")) {
      return false
    }
    if (
      filters.destinationInternalId &&
      !this.matchesChainFilter(destChain, filters.destinationInternalId, "internalId")
    ) {
      return false
    }

    return true
  }

  /**
   * Checks if a chain matches a specific filter value
   */
  private matchesChainFilter(
    chain: ChainInfoInternal,
    filterValue: string,
    filterType: "chainId" | "selector" | "internalId"
  ): boolean {
    const filterValues = filterValue.split(",").map((v) => v.trim())
    const chainValue = chain[filterType].toString()

    // For chainId, also check generated chain key format
    if (filterType === "chainId") {
      const generatedKey = generateChainKey(chain.chainId, chain.chainType, "chainId")
      return filterValues.includes(chainValue) || filterValues.includes(generatedKey)
    }

    return filterValues.includes(chainValue)
  }

  /**
   * Generates a lane key based on source and destination chains
   */
  private generateLaneKey(
    sourceChain: ChainInfoInternal,
    destChain: ChainInfoInternal,
    outputKey: OutputKeyType
  ): string {
    const sourceKey =
      outputKey === "chainId"
        ? generateChainKey(sourceChain.chainId, sourceChain.chainType, outputKey)
        : sourceChain[outputKey].toString()

    const destKey =
      outputKey === "chainId"
        ? generateChainKey(destChain.chainId, destChain.chainType, outputKey)
        : destChain[outputKey].toString()

    return `${sourceKey}_to_${destKey}`
  }

  /**
   * Builds lane details from chain info and lane config
   */
  private buildLaneDetails(
    sourceChain: ChainInfoInternal,
    destChain: ChainInfoInternal,
    laneConfig: LaneConfig
  ): LaneDetails {
    // Convert internal chain info to public interface (remove chainType and chainFamily)
    const publicSourceChain: ChainInfo = {
      chainId: sourceChain.chainId,
      displayName: sourceChain.displayName,
      selector: sourceChain.selector,
      internalId: sourceChain.internalId,
    }

    const publicDestChain: ChainInfo = {
      chainId: destChain.chainId,
      displayName: destChain.displayName,
      selector: destChain.selector,
      internalId: destChain.internalId,
    }

    return {
      sourceChain: publicSourceChain,
      destinationChain: publicDestChain,
      onRamp: {
        address: laneConfig.onRamp.address,
        version: normalizeVersion(laneConfig.onRamp.version),
        enforceOutOfOrder: laneConfig.onRamp.enforceOutOfOrder,
      },
      offRamp: {
        address: laneConfig.offRamp.address,
        version: normalizeVersion(laneConfig.offRamp.version),
      },
      supportedTokens: this.extractSupportedTokens(laneConfig),
    }
  }

  /**
   * Extracts supported token keys from lane configuration
   */
  private extractSupportedTokens(laneConfig: LaneConfig): string[] {
    if (!laneConfig.supportedTokens) {
      return []
    }

    // Extract token keys from supportedTokens object
    // lanes.json structure: "supportedTokens": { "LINK": {...}, "CCIP-BnM": {...} }
    return Object.keys(laneConfig.supportedTokens)
  }

  /**
   * Adds an error to the error collection
   */
  private addError(sourceChain: string, destinationChain: string, reason: string, missingFields: string[]): void {
    this.errors.push({
      sourceChain,
      destinationChain,
      reason,
      missingFields,
    })

    logger.warn({
      message: "Lane validation error",
      requestId: this.requestId,
      sourceChain,
      destinationChain,
      reason,
      missingFields,
    })
  }

  /**
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
