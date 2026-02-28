import {
  Environment,
  LaneDetails,
  LaneFilterType,
  LaneConfigError,
  LaneServiceResponse,
  LaneDetailServiceResponse,
  LaneDetailWithRateLimits,
  SupportedTokensServiceResponse,
  ChainInfo,
  ChainInfoInternal,
  OutputKeyType,
  ChainType,
  ChainFamily,
  LaneInputKeyType,
  TokenLaneData,
  RateLimitsData,
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

// Import rate limits mock data
import rateLimitsMainnet from "~/__mocks__/rate-limits-mainnet.json" with { type: "json" }
import rateLimitsTestnet from "~/__mocks__/rate-limits-testnet.json" with { type: "json" }

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
    // Map snake_case filter types to camelCase property names
    const propertyMap: Record<string, keyof ChainInfoInternal> = {
      chain_id: "chainId",
      selector: "selector",
      internal_id: "internalId",
    }
    const propertyName = propertyMap[filterType]
    const chainValue = chain[propertyName].toString()

    // For chain_id, also check generated chain key format
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
    // Map snake_case output keys to camelCase property names
    const propertyMap: Record<string, keyof ChainInfoInternal> = {
      chain_id: "chainId",
      selector: "selector",
      internal_id: "internalId",
    }
    const propertyName = propertyMap[outputKey]

    const sourceKey =
      outputKey === "chainId"
        ? generateChainKey(sourceChain.chainId, sourceChain.chainType, outputKey)
        : sourceChain[propertyName].toString()

    const destKey =
      outputKey === "chainId"
        ? generateChainKey(destChain.chainId, destChain.chainType, outputKey)
        : destChain[propertyName].toString()

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
    if (!laneConfig.supportedTokens || !Array.isArray(laneConfig.supportedTokens)) {
      return []
    }

    // lanes.json structure: "supportedTokens": ["LINK", "CCIP-BnM", ...]
    return laneConfig.supportedTokens
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

  /**
   * Retrieves details for a specific lane by source and destination chain identifiers
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param sourceIdentifier - Source chain identifier (chainId, selector, or internalId)
   * @param destinationIdentifier - Destination chain identifier
   * @param inputKeyType - Type of identifier used (chainId, selector, internalId)
   * @returns Lane details or null if not found
   */
  async getLaneDetails(
    environment: Environment,
    sourceIdentifier: string,
    destinationIdentifier: string,
    inputKeyType: LaneInputKeyType
  ): Promise<LaneDetailServiceResponse> {
    logger.info({
      message: "Getting lane details",
      requestId: this.requestId,
      environment,
      sourceIdentifier,
      destinationIdentifier,
      inputKeyType,
    })

    try {
      // Load reference data
      const { lanesReferenceData, chainsReferenceData } = loadReferenceData({
        environment,
        version: Version.V1_2_0,
      })

      // Resolve identifiers to internal IDs
      const sourceInternalId = this.resolveToInternalId(
        sourceIdentifier,
        inputKeyType,
        chainsReferenceData as Record<string, ChainConfig>
      )
      const destinationInternalId = this.resolveToInternalId(
        destinationIdentifier,
        inputKeyType,
        chainsReferenceData as Record<string, ChainConfig>
      )

      if (!sourceInternalId || !destinationInternalId) {
        logger.warn({
          message: "Could not resolve chain identifiers",
          requestId: this.requestId,
          sourceIdentifier,
          destinationIdentifier,
          sourceInternalId,
          destinationInternalId,
        })
        return { data: null }
      }

      // Get lane data
      const sourceLanes = lanesReferenceData[sourceInternalId] as Record<string, LaneConfig> | undefined
      if (!sourceLanes) {
        return { data: null }
      }

      const laneConfig = sourceLanes[destinationInternalId]
      if (!laneConfig) {
        return { data: null }
      }

      // Resolve chain info
      const sourceChain = this.resolveChainInfo(sourceInternalId, chainsReferenceData)
      const destChain = this.resolveChainInfo(destinationInternalId, chainsReferenceData)

      if (!sourceChain || !destChain) {
        return { data: null }
      }

      // Build lane details with rate limits
      const laneDetails = this.buildLaneDetailsWithRateLimits(
        sourceChain,
        destChain,
        laneConfig,
        sourceInternalId,
        destinationInternalId,
        environment
      )

      logger.info({
        message: "Lane details with rate limits retrieved",
        requestId: this.requestId,
        sourceInternalId,
        destinationInternalId,
        tokenCount: Object.keys(laneDetails.supportedTokens).length,
      })

      return { data: laneDetails }
    } catch (error) {
      logger.error({
        message: "Failed to get lane details",
        requestId: this.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return { data: null }
    }
  }

  /**
   * Builds a mapping from selector names (e.g., "ethereum-mainnet") to chains.json keys (e.g., "mainnet")
   * This enables the API to accept both naming conventions.
   *
   * @param chainsReferenceData - Chain configuration data
   * @returns Map of selector name → chains.json key
   */
  private buildSelectorNameToChainKeyMap(chainsReferenceData: Record<string, ChainConfig>): Map<string, string> {
    const map = new Map<string, string>()

    for (const [chainKey] of Object.entries(chainsReferenceData)) {
      try {
        // Get the chain ID and type to look up the selector entry
        const supportedChain = directoryToSupportedChain(chainKey)
        const chainId = getChainId(supportedChain)
        const { chainType } = getChainTypeAndFamily(supportedChain)

        if (chainId) {
          const selectorEntry = getSelectorEntry(chainId, chainType)
          if (selectorEntry?.name && selectorEntry.name !== chainKey) {
            // Map selector name to chains.json key
            map.set(selectorEntry.name, chainKey)
          }
        }
      } catch {
        // Skip chains that can't be resolved
      }
    }

    return map
  }

  /**
   * Resolves a chain identifier to its internal ID (chains.json key)
   *
   * Accepts both:
   * - chains.json keys (e.g., "mainnet", "bsc-mainnet")
   * - selector names (e.g., "ethereum-mainnet", "binance_smart_chain-mainnet")
   *
   * @param identifier - Chain identifier (chainId, selector, or internalId)
   * @param inputKeyType - Type of identifier
   * @param chainsReferenceData - Chain configuration data
   * @returns Internal ID (chains.json key) or null if not found
   */
  resolveToInternalId(
    identifier: string,
    inputKeyType: LaneInputKeyType,
    chainsReferenceData: Record<string, ChainConfig>
  ): string | null {
    // If already an internal_id, check both chains.json key and selector name
    if (inputKeyType === "internalId") {
      // First, try direct lookup in chains.json keys
      if (chainsReferenceData[identifier]) {
        return identifier
      }

      // If not found, check if identifier is a selector name and map to chains.json key
      const selectorNameMap = this.buildSelectorNameToChainKeyMap(chainsReferenceData)
      const chainKey = selectorNameMap.get(identifier)
      if (chainKey && chainsReferenceData[chainKey]) {
        return chainKey
      }

      return null
    }

    // Search through chains to find matching chain_id or selector
    if (inputKeyType === "chainId") {
      // Collect all matching chains (chainId can have collisions across chain families)
      const matches: Array<{ internalId: string; chainType: ChainType; chainFamily: ChainFamily }> = []

      for (const [internalId] of Object.entries(chainsReferenceData)) {
        try {
          const supportedChain = directoryToSupportedChain(internalId)
          const chainId = getChainId(supportedChain)
          if (chainId && chainId.toString() === identifier) {
            const { chainType, chainFamily } = getChainTypeAndFamily(supportedChain)
            matches.push({ internalId, chainType, chainFamily })
          }
        } catch {
          // Skip chains that can't be resolved
        }
      }

      if (matches.length === 0) {
        return null
      }

      // Prioritize EVM chains since by-chain-id is typically used for EVM chain IDs
      const evmMatch = matches.find((m) => m.chainFamily === "evm")
      if (evmMatch) {
        return evmMatch.internalId
      }

      // Fall back to first match if no EVM chain found
      return matches[0].internalId
    }

    // For selector, there should be no collisions
    for (const [internalId, chainConfig] of Object.entries(chainsReferenceData)) {
      if (inputKeyType === "selector") {
        if (chainConfig.chainSelector === identifier) {
          return internalId
        }
      }
    }

    return null
  }

  /**
   * Loads rate limits data for the specified environment
   */
  private loadRateLimitsData(environment: Environment): RateLimitsData {
    return environment === "mainnet"
      ? (rateLimitsMainnet as unknown as RateLimitsData)
      : (rateLimitsTestnet as unknown as RateLimitsData)
  }

  /**
   * Builds lane details with rate limits included in supportedTokens
   */
  private buildLaneDetailsWithRateLimits(
    sourceChain: ChainInfoInternal,
    destChain: ChainInfoInternal,
    laneConfig: LaneConfig,
    sourceInternalId: string,
    destinationInternalId: string,
    environment: Environment
  ): LaneDetailWithRateLimits {
    // Convert internal chain info to public interface
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

    // Extract supported token symbols
    const tokenSymbols = this.extractSupportedTokens(laneConfig)

    // Load rate limits data
    const rateLimitsData = this.loadRateLimitsData(environment)

    // Build supportedTokens with rate limits and fees
    const supportedTokensWithRateLimits: Record<string, TokenLaneData> = {}

    for (const tokenSymbol of tokenSymbols) {
      const tokenData = rateLimitsData[tokenSymbol]
      if (tokenData) {
        const sourceData = tokenData[sourceInternalId]
        if (sourceData?.remote) {
          const destData = sourceData.remote[destinationInternalId]
          if (destData) {
            supportedTokensWithRateLimits[tokenSymbol] = {
              rateLimits: {
                standard: destData.standard,
                custom: destData.custom,
              },
              fees: destData.fees || null,
            }
          } else {
            supportedTokensWithRateLimits[tokenSymbol] = {
              rateLimits: { standard: null, custom: null },
              fees: null,
            }
          }
        } else {
          supportedTokensWithRateLimits[tokenSymbol] = {
            rateLimits: { standard: null, custom: null },
            fees: null,
          }
        }
      } else {
        supportedTokensWithRateLimits[tokenSymbol] = {
          rateLimits: { standard: null, custom: null },
          fees: null,
        }
      }
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
      supportedTokens: supportedTokensWithRateLimits,
    }
  }

  /**
   * Retrieves only supported tokens with rate limits for a specific lane
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param sourceIdentifier - Source chain identifier (chainId, selector, or internalId)
   * @param destinationIdentifier - Destination chain identifier
   * @param inputKeyType - Type of identifier used (chainId, selector, internalId)
   * @returns Supported tokens with rate limits or null if lane not found
   */
  async getSupportedTokensWithRateLimits(
    environment: Environment,
    sourceIdentifier: string,
    destinationIdentifier: string,
    inputKeyType: LaneInputKeyType
  ): Promise<SupportedTokensServiceResponse> {
    logger.info({
      message: "Getting supported tokens with rate limits",
      requestId: this.requestId,
      environment,
      sourceIdentifier,
      destinationIdentifier,
      inputKeyType,
    })

    try {
      // Load reference data
      const { lanesReferenceData, chainsReferenceData } = loadReferenceData({
        environment,
        version: Version.V1_2_0,
      })

      // Resolve identifiers to internal IDs
      const sourceInternalId = this.resolveToInternalId(
        sourceIdentifier,
        inputKeyType,
        chainsReferenceData as Record<string, ChainConfig>
      )
      const destinationInternalId = this.resolveToInternalId(
        destinationIdentifier,
        inputKeyType,
        chainsReferenceData as Record<string, ChainConfig>
      )

      if (!sourceInternalId || !destinationInternalId) {
        logger.warn({
          message: "Could not resolve chain identifiers",
          requestId: this.requestId,
          sourceIdentifier,
          destinationIdentifier,
        })
        return { data: null, tokenCount: 0 }
      }

      // Get lane data
      const sourceLanes = lanesReferenceData[sourceInternalId] as Record<string, LaneConfig> | undefined
      if (!sourceLanes) {
        return { data: null, tokenCount: 0 }
      }

      const laneConfig = sourceLanes[destinationInternalId]
      if (!laneConfig) {
        return { data: null, tokenCount: 0 }
      }

      // Extract supported token symbols
      const tokenSymbols = this.extractSupportedTokens(laneConfig)

      // Load rate limits data
      const rateLimitsData = this.loadRateLimitsData(environment)

      // Build supportedTokens with rate limits and fees
      const supportedTokensWithRateLimits: Record<string, TokenLaneData> = {}

      for (const tokenSymbol of tokenSymbols) {
        const tokenData = rateLimitsData[tokenSymbol]
        if (tokenData) {
          const sourceData = tokenData[sourceInternalId]
          if (sourceData?.remote) {
            const destData = sourceData.remote[destinationInternalId]
            if (destData) {
              supportedTokensWithRateLimits[tokenSymbol] = {
                rateLimits: {
                  standard: destData.standard,
                  custom: destData.custom,
                },
                fees: destData.fees || null,
              }
            } else {
              supportedTokensWithRateLimits[tokenSymbol] = {
                rateLimits: { standard: null, custom: null },
                fees: null,
              }
            }
          } else {
            supportedTokensWithRateLimits[tokenSymbol] = {
              rateLimits: { standard: null, custom: null },
              fees: null,
            }
          }
        } else {
          supportedTokensWithRateLimits[tokenSymbol] = {
            rateLimits: { standard: null, custom: null },
            fees: null,
          }
        }
      }

      const tokenCount = Object.keys(supportedTokensWithRateLimits).length

      logger.info({
        message: "Supported tokens with rate limits retrieved",
        requestId: this.requestId,
        sourceInternalId,
        destinationInternalId,
        tokenCount,
      })

      return { data: supportedTokensWithRateLimits, tokenCount }
    } catch (error) {
      logger.error({
        message: "Failed to get supported tokens with rate limits",
        requestId: this.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return { data: null, tokenCount: 0 }
    }
  }
}
