import {
  Environment,
  TokenConfigError,
  TokenFilterType,
  OutputKeyType,
  TokenChainData,
  TokenDataResponse,
  TokenServiceResponse,
  TokenDetailChainData,
  TokenDetailDataResponse,
  TokenDetailServiceResponse,
  TokenFinalityData,
  TokenFinalityDataResponse,
  TokenFinalityServiceResponse,
  RateLimitsData,
} from "~/lib/ccip/types/index.ts"
import { Version } from "@config/data/ccip/types.ts"
import { SupportedChain } from "@config/index.ts"
import { getAllSupportedTokens, getAllTokenLanes, getTokenData } from "@config/data/ccip/data.ts"
import { resolveChainOrThrow, generateChainKey } from "~/lib/ccip/utils.ts"
import { logger } from "@lib/logging/index.js"
import { getChainId, getChainTypeAndFamily, getTitle } from "../../../features/utils/index.ts"
import { getSelectorEntry } from "@config/data/ccip/selectors.ts"

// Import rate limits mock data for custom finality info
import rateLimitsMainnet from "~/__mocks__/rate-limits-mainnet.json" with { type: "json" }
import rateLimitsTestnet from "~/__mocks__/rate-limits-testnet.json" with { type: "json" }

export const prerender = false

/**
 * Service class for handling CCIP token data operations
 * Provides functionality to validate and filter token configurations
 */
export class TokenDataService {
  private errors: TokenConfigError[] = []
  private readonly requestId: string
  private skippedTokensCount = 0

  /**
   * Creates a new instance of TokenDataService
   */
  constructor() {
    this.requestId = crypto.randomUUID()

    logger.debug({
      message: "TokenDataService initialized",
      requestId: this.requestId,
    })
  }

  /**
   * Processes and formats raw token data from data layer
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param tokenCanonicalId - Canonical identifier for the token across chains
   * @param outputKey - Format to use for displaying chain information
   * @returns Formatted token details with chains as keys
   */
  private async processTokenData(
    environment: Environment,
    tokenCanonicalId: string,
    outputKey: OutputKeyType
  ): Promise<{ [chainKey: string]: TokenChainData } | null> {
    logger.debug({
      message: "Processing token data",
      requestId: this.requestId,
      environment,
      tokenCanonicalId,
      outputKey,
    })

    try {
      // Get token lanes data
      const tokenLanes = getAllTokenLanes({
        token: tokenCanonicalId,
        environment,
        version: Version.V1_2_0,
      })

      // Get token data for each chain where it exists
      const tokenData = getTokenData({
        environment,
        version: Version.V1_2_0,
        tokenId: tokenCanonicalId,
      })

      if (!tokenData || Object.keys(tokenData).length === 0) {
        logger.warn({
          message: "No token data found - skipping token",
          requestId: this.requestId,
          tokenCanonicalId,
        })

        this.errors.push({
          symbol: tokenCanonicalId,
          reason: "Missing token data",
          missingFields: ["tokenData"],
        })

        return null
      }

      // Create the new structure with chains as keys
      const result: { [chainKey: string]: TokenChainData } = {}

      // Process each chain the token exists on
      const chainsProcessed: string[] = []
      const chainEntries: [string, TokenChainData][] = []

      Object.entries(tokenData).forEach(([chainId, chainData]) => {
        try {
          // Only process chains where pool.address exists
          if (!chainData.pool?.address) {
            this.skippedTokensCount++
            logger.warn({
              message: "Chain missing pool.address - skipping only this chain",
              requestId: this.requestId,
              tokenCanonicalId,
              chainId,
              totalSkippedSoFar: this.skippedTokensCount,
            })
            return // Skip this chain
          }

          const supportedChain: SupportedChain = resolveChainOrThrow(chainId)
          const numericChainId = getChainId(supportedChain)
          const { chainType } = getChainTypeAndFamily(supportedChain)

          if (!numericChainId) {
            logger.warn({
              message: "Failed to get chainId - skipping chain",
              requestId: this.requestId,
              tokenCanonicalId,
              chainId,
            })
            return // Skip this chain
          }

          // Get destinations for this chain
          const rawDestinations = tokenLanes[chainId] ? Object.keys(tokenLanes[chainId]) : []

          // Transform destinations based on outputKey
          const destinations = rawDestinations
            .map((destChainId) => {
              const destSupportedChain = resolveChainOrThrow(destChainId)
              const destNumericChainId = getChainId(destSupportedChain)
              const { chainType: destChainType } = getChainTypeAndFamily(destSupportedChain)

              if (!destNumericChainId) return destChainId

              if (outputKey === "chain_id") {
                return generateChainKey(destNumericChainId, destChainType, outputKey)
              } else if (outputKey === "selector") {
                const selectorEntry = getSelectorEntry(destNumericChainId, destChainType)
                return selectorEntry?.selector || destChainId
              } else if (outputKey === "internal_id") {
                const selectorEntry = getSelectorEntry(destNumericChainId, destChainType)
                return selectorEntry?.name || destChainId
              }
              return destChainId
            })
            .sort()

          // Get the appropriate key based on outputKey parameter
          let chainKey = chainId
          if (outputKey === "chain_id") {
            chainKey = generateChainKey(numericChainId, chainType, outputKey)
          } else if (outputKey === "selector") {
            const selectorEntry = getSelectorEntry(numericChainId, chainType)
            if (selectorEntry) {
              chainKey = selectorEntry.selector
            }
          } else if (outputKey === "internal_id") {
            const selectorEntry = getSelectorEntry(numericChainId, chainType)
            if (selectorEntry) {
              chainKey = selectorEntry.name
            }
          }

          // Store chain entry for later sorting
          chainEntries.push([
            chainKey,
            {
              chainId: numericChainId,
              chainName: getTitle(supportedChain) || chainId,
              decimals: chainData.decimals,
              destinations,
              name: chainData.name || "",
              pool: {
                address: chainData.pool.address || "",
                rawType: chainData.pool.rawType,
                type: chainData.pool.type,
                version: chainData.pool.version,
              },
              symbol: chainData.symbol,
              tokenAddress: chainData.tokenAddress,
            },
          ])

          chainsProcessed.push(chainId)
        } catch (error) {
          logger.warn({
            message: "Error processing chain data for token",
            requestId: this.requestId,
            tokenCanonicalId,
            chainId,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      })

      // If no chains could be processed for this token, skip the whole token
      if (chainsProcessed.length === 0) {
        logger.warn({
          message: "No valid chains could be processed for token - skipping token",
          requestId: this.requestId,
          tokenCanonicalId,
        })

        this.errors.push({
          symbol: tokenCanonicalId,
          reason: "Missing required token configuration data",
          missingFields: ["chains"],
        })

        return null
      }

      // Sort chains alphabetically and add to result
      chainEntries.sort((a, b) => a[0].localeCompare(b[0]))
      chainEntries.forEach(([chainId, chainData]) => {
        result[chainId] = chainData
      })

      logger.debug({
        message: "Token data processing successful",
        requestId: this.requestId,
        tokenCanonicalId,
        chainsCount: chainsProcessed.length,
      })

      return result
    } catch (error) {
      logger.error({
        message: "Error processing token data",
        requestId: this.requestId,
        tokenCanonicalId,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      this.errors.push({
        symbol: tokenCanonicalId,
        reason: "Failed to process token data",
        missingFields: ["processError"],
      })

      return null
    }
  }

  /**
   * Retrieves and filters token information based on environment and filters
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param filters - Token filters (symbol, chainId)
   * @param outputKey - Format to use for displaying chain information
   * @returns Filtered token information with metadata
   *
   * @example
   * ```typescript
   * const service = new TokenDataService();
   * const result = await service.getFilteredTokens("mainnet", { symbol: "LINK" });
   * ```
   */
  public async getFilteredTokens(
    environment: Environment,
    filters: TokenFilterType,
    outputKey: OutputKeyType = "chain_id"
  ): Promise<TokenServiceResponse> {
    logger.info({
      message: "Starting token filtering process",
      requestId: this.requestId,
      environment,
      filters,
      outputKey,
    })

    this.errors = [] // Reset errors for new request
    this.skippedTokensCount = 0 // Reset skipped count

    // Get all supported tokens
    const supportedTokens = getAllSupportedTokens({
      environment,
      version: Version.V1_2_0,
    })

    // Log the total number of tokens from getAllSupportedTokens
    logger.info({
      message: "Raw supported tokens count before filtering",
      requestId: this.requestId,
      rawTokenCount: Object.keys(supportedTokens).length,
    })

    const tokens: TokenDataResponse = {}

    // Process each token by its canonical ID
    const tokenCanonicalIds = Object.keys(supportedTokens)
    logger.debug({
      message: "Retrieved supported tokens",
      requestId: this.requestId,
      totalTokens: tokenCanonicalIds.length,
    })

    // Add debug tracking for processed tokens
    let processedTokensCount = 0
    let validTokensCount = 0

    // Process each token
    for (const tokenCanonicalId of tokenCanonicalIds) {
      const tokenDetails = await this.processTokenData(environment, tokenCanonicalId, outputKey)
      if (tokenDetails) {
        tokens[tokenCanonicalId] = tokenDetails
        validTokensCount++
      }
      processedTokensCount++
    }

    // Apply filters
    let filteredTokens = { ...tokens }

    // Filter by token_id
    if (filters.token_id) {
      const tokenIdentifiers = filters.token_id.split(",").map((id) => id.trim())

      filteredTokens = Object.entries(tokens)
        .filter(([key]) => tokenIdentifiers.includes(key))
        .reduce<TokenDataResponse>((acc, [key, token]) => {
          acc[key] = token
          return acc
        }, {})
    }

    if (filters.chain_id) {
      const chainIds = filters.chain_id.split(",").map((id) => id.trim())
      filteredTokens = Object.entries(filteredTokens)
        .filter(([, tokenData]) => {
          return Object.values(tokenData).some((chainInfo: TokenChainData) => {
            return chainIds.includes(chainInfo.chainId.toString())
          })
        })
        .reduce<TokenDataResponse>((acc, [key, token]) => {
          acc[key] = token
          return acc
        }, {})
    }

    const metadata = {
      validTokenCount: Object.keys(filteredTokens).length,
      ignoredTokenCount: this.errors.length,
    }

    logger.info({
      message: "Token filtering completed",
      requestId: this.requestId,
      metadata,
      errorCount: this.errors.length,
      totalTokensProcessed: processedTokensCount,
      validTokensBeforeFilters: validTokensCount,
      skippedDueToMissingPoolAddress: this.skippedTokensCount,
    })

    return {
      tokens: filteredTokens,
      errors: this.errors,
      metadata,
    }
  }

  /**
   * Retrieves detailed token information for a specific token, including custom finality data
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param tokenCanonicalSymbol - Canonical symbol for the token
   * @param outputKey - Format to use for displaying chain information
   * @returns Token details with custom finality information for each chain
   */
  public async getTokenWithFinality(
    environment: Environment,
    tokenCanonicalSymbol: string,
    outputKey: OutputKeyType = "chain_id"
  ): Promise<TokenDetailServiceResponse | null> {
    logger.info({
      message: "Getting token with finality data",
      requestId: this.requestId,
      environment,
      tokenCanonicalSymbol,
      outputKey,
    })

    // Get base token data using existing method
    const tokenData = await this.processTokenData(environment, tokenCanonicalSymbol, outputKey)

    if (!tokenData) {
      logger.warn({
        message: "Token not found",
        requestId: this.requestId,
        tokenCanonicalSymbol,
      })
      return null
    }

    // Load rate limits data for finality info
    const rateLimitsData = this.loadRateLimitsData(environment)

    // Get token's rate limits by internal ID
    const tokenRateLimits = rateLimitsData[tokenCanonicalSymbol]

    // Merge token data with custom finality information
    const result: TokenDetailDataResponse = {}

    for (const [chainKey, chainData] of Object.entries(tokenData)) {
      // Look up minBlockConfirmation using internal ID
      // We need to map the chainKey back to internal ID for rate limits lookup
      const internalId = this.getInternalIdFromChainKey(chainData.chainId, chainData.chainName, outputKey)

      let minBlockConfirmation: number | null = null
      let hasCustomFinality: boolean | null = null

      if (tokenRateLimits && internalId && tokenRateLimits[internalId]) {
        minBlockConfirmation = tokenRateLimits[internalId].minBlockConfirmation

        // Derive hasCustomFinality from minBlockConfirmation
        if (minBlockConfirmation === null) {
          hasCustomFinality = null // Unavailable
        } else if (minBlockConfirmation > 0) {
          hasCustomFinality = true
        } else {
          hasCustomFinality = false
        }
      }

      const detailChainData: TokenDetailChainData = {
        ...chainData,
        hasCustomFinality,
        minBlockConfirmation,
      }

      result[chainKey] = detailChainData
    }

    logger.info({
      message: "Token with finality data retrieved",
      requestId: this.requestId,
      tokenCanonicalSymbol,
      chainCount: Object.keys(result).length,
    })

    return {
      data: result,
      metadata: {
        chainCount: Object.keys(result).length,
      },
    }
  }

  /**
   * Loads rate limits data for the specified environment
   */
  private loadRateLimitsData(environment: Environment): RateLimitsData {
    if (environment === Environment.Mainnet) {
      return rateLimitsMainnet as RateLimitsData
    }
    return rateLimitsTestnet as RateLimitsData
  }

  /**
   * Gets the internal ID for a chain based on chainId/chainName
   * This is needed to look up rate limits data which uses internal IDs as keys
   */
  private getInternalIdFromChainKey(
    chainId: number | string,
    chainName: string,
    outputKey: OutputKeyType
  ): string | null {
    try {
      // If outputKey is internalId, the chainName might already be the internal ID
      // We need to look up the selector entry by chainId
      const numericChainId = typeof chainId === "string" ? parseInt(chainId, 10) : chainId

      if (isNaN(numericChainId)) {
        // chainId is not numeric, might be a non-EVM chain identifier
        // Try to find by name pattern
        return null
      }

      // Get selector entry which has the internal name
      const selectorEntry = getSelectorEntry(numericChainId, "evm")
      if (selectorEntry) {
        return selectorEntry.name
      }

      return null
    } catch {
      logger.debug({
        message: "Could not resolve internal ID for chain",
        requestId: this.requestId,
        chainId,
        chainName,
      })
      return null
    }
  }

  /**
   * Retrieves only finality data for a specific token (lightweight endpoint)
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param tokenCanonicalSymbol - Canonical symbol for the token
   * @param outputKey - Format to use for displaying chain information
   * @returns Finality information (hasCustomFinality, minBlockConfirmation) for each chain
   */
  public async getTokenFinality(
    environment: Environment,
    tokenCanonicalSymbol: string,
    outputKey: OutputKeyType = "chain_id"
  ): Promise<TokenFinalityServiceResponse | null> {
    logger.info({
      message: "Getting token finality data",
      requestId: this.requestId,
      environment,
      tokenCanonicalSymbol,
      outputKey,
    })

    // Get base token data to know which chains the token exists on
    const tokenData = await this.processTokenData(environment, tokenCanonicalSymbol, outputKey)

    if (!tokenData) {
      logger.warn({
        message: "Token not found",
        requestId: this.requestId,
        tokenCanonicalSymbol,
      })
      return null
    }

    // Load rate limits data for finality info
    const rateLimitsData = this.loadRateLimitsData(environment)

    // Get token's rate limits by internal ID
    const tokenRateLimits = rateLimitsData[tokenCanonicalSymbol]

    // Extract only finality data for each chain
    const result: TokenFinalityDataResponse = {}

    for (const [chainKey, chainData] of Object.entries(tokenData)) {
      // Look up minBlockConfirmation using internal ID
      const internalId = this.getInternalIdFromChainKey(chainData.chainId, chainData.chainName, outputKey)

      let minBlockConfirmation: number | null = null
      let hasCustomFinality: boolean | null = null

      if (tokenRateLimits && internalId && tokenRateLimits[internalId]) {
        minBlockConfirmation = tokenRateLimits[internalId].minBlockConfirmation

        // Derive hasCustomFinality from minBlockConfirmation
        if (minBlockConfirmation === null) {
          hasCustomFinality = null // Unavailable
        } else if (minBlockConfirmation > 0) {
          hasCustomFinality = true
        } else {
          hasCustomFinality = false
        }
      }

      const finalityData: TokenFinalityData = {
        hasCustomFinality,
        minBlockConfirmation,
      }

      result[chainKey] = finalityData
    }

    logger.info({
      message: "Token finality data retrieved",
      requestId: this.requestId,
      tokenCanonicalSymbol,
      chainCount: Object.keys(result).length,
    })

    return {
      data: result,
      metadata: {
        chainCount: Object.keys(result).length,
      },
    }
  }
}
