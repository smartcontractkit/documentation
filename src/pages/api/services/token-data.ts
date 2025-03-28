import {
  Environment,
  TokenConfigError,
  TokenFilterType,
  OutputKeyType,
  TokenChainData,
  TokenDataResponse,
  TokenServiceResponse,
} from "../ccip/types/index.ts"
import { Version } from "@config/data/ccip/types.ts"
import { SupportedChain } from "@config/index.ts"
import { getAllSupportedTokens, getAllTokenLanes, getTokenData } from "@config/data/ccip/data.ts"
import { LogLevel, structuredLog, resolveChainOrThrow } from "../ccip/utils.ts"
import { getChainId, getTitle } from "../../../features/utils/index.ts"
import { SelectorsConfig } from "@config/data/ccip/selectors.ts"

/**
 * Service class for handling CCIP token data operations
 * Provides functionality to validate and filter token configurations
 */
export class TokenDataService {
  private errors: TokenConfigError[] = []
  private readonly requestId: string
  private skippedTokensCount = 0
  private selectorConfig: SelectorsConfig

  /**
   * Creates a new instance of TokenDataService
   */
  constructor(selectorConfig: SelectorsConfig) {
    this.requestId = crypto.randomUUID()
    this.selectorConfig = selectorConfig

    structuredLog(LogLevel.DEBUG, {
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
    structuredLog(LogLevel.DEBUG, {
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
        structuredLog(LogLevel.WARN, {
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
          // Only process chains where poolAddress exists
          if (!chainData.poolAddress) {
            this.skippedTokensCount++
            structuredLog(LogLevel.WARN, {
              message: "Chain missing poolAddress - skipping only this chain",
              requestId: this.requestId,
              tokenCanonicalId,
              chainId,
              totalSkippedSoFar: this.skippedTokensCount,
            })
            return // Skip this chain
          }

          const supportedChain: SupportedChain = resolveChainOrThrow(chainId)
          const numericChainId = getChainId(supportedChain)

          if (!numericChainId) {
            structuredLog(LogLevel.WARN, {
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

              if (!destNumericChainId) return destChainId

              if (outputKey === "chainId") {
                return destNumericChainId.toString()
              } else if (outputKey === "selector") {
                const selectorEntry = this.selectorConfig?.selectors[destNumericChainId]
                return selectorEntry?.selector || destChainId
              } else if (outputKey === "internalId") {
                const selectorEntry = this.selectorConfig?.selectors[destNumericChainId]
                return selectorEntry?.name || destChainId
              }
              return destChainId
            })
            .sort()

          // Get the appropriate key based on outputKey parameter
          let chainKey = chainId
          if (outputKey === "chainId") {
            chainKey = numericChainId.toString()
          } else if (outputKey === "selector") {
            const selectorEntry = this.selectorConfig?.selectors[numericChainId]
            if (selectorEntry) {
              chainKey = selectorEntry.selector
            }
          } else if (outputKey === "internalId") {
            const selectorEntry = this.selectorConfig?.selectors[numericChainId]
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
              poolAddress: chainData.poolAddress,
              poolType: chainData.poolType,
              symbol: chainData.symbol,
              tokenAddress: chainData.tokenAddress,
            },
          ])

          chainsProcessed.push(chainId)
        } catch (error) {
          structuredLog(LogLevel.WARN, {
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
        structuredLog(LogLevel.WARN, {
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

      structuredLog(LogLevel.DEBUG, {
        message: "Token data processing successful",
        requestId: this.requestId,
        tokenCanonicalId,
        chainsCount: chainsProcessed.length,
      })

      return result
    } catch (error) {
      structuredLog(LogLevel.ERROR, {
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
    outputKey: OutputKeyType = "chainId"
  ): Promise<TokenServiceResponse> {
    structuredLog(LogLevel.INFO, {
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
    structuredLog(LogLevel.INFO, {
      message: "Raw supported tokens count before filtering",
      requestId: this.requestId,
      rawTokenCount: Object.keys(supportedTokens).length,
    })

    const tokens: TokenDataResponse = {}

    // Process each token by its canonical ID
    const tokenCanonicalIds = Object.keys(supportedTokens)
    structuredLog(LogLevel.DEBUG, {
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
      const chainIds = filters.chain_id.split(",").map((id) => parseInt(id.trim()))
      filteredTokens = Object.entries(filteredTokens)
        .filter(([, tokenData]) => {
          return Object.values(tokenData).some((chainInfo: TokenChainData) => {
            return chainIds.includes(chainInfo.chainId)
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

    structuredLog(LogLevel.INFO, {
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
}
