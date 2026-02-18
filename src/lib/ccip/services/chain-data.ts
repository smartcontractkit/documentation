import {
  Environment,
  ChainDetails,
  FilterType,
  ChainConfigError,
  FeeTokenEnriched,
  ChainFamily,
} from "~/lib/ccip/types/index.ts"
import { ChainsConfig } from "@config/data/ccip/index.ts"
import { getSelectorEntry, getAllSelectors } from "@config/data/ccip/selectors.ts"
import { resolveChainOrThrow } from "~/lib/ccip/utils.ts"
import { logger } from "@lib/logging/index.js"
import { getChainId, getNativeCurrency, getTitle, getChainTypeAndFamily } from "@features/utils/index.ts"
import { SupportedChain, ChainType } from "~/config/index.ts"
import { getTokenData } from "@config/data/ccip/data.ts"
import { Version } from "@config/data/ccip/types.ts"
import { deriveDisplayName } from "~/lib/ccip/utils/display-name.ts"

export const prerender = false

// Strategy interface for chain processing
interface IChainProcessingStrategy {
  validateChainData(
    chainId: number | string | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: ChainDetails
  }
}

// Base strategy with common validation logic
abstract class BaseChainStrategy implements IChainProcessingStrategy {
  protected requestId: string

  constructor(requestId: string) {
    this.requestId = requestId
  }

  protected validateBaseFields(
    chainId: number | string | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    baseData?: Partial<ChainDetails>
  } {
    const missingFields: string[] = []

    // Early validation for required dependencies
    if (!selectorEntry || !chainConfig || !supportedChain) {
      logger.warn({
        message: "Missing required dependencies for chain validation",
        requestId: this.requestId,
        networkId,
        missing: {
          selectorEntry: !selectorEntry,
          chainConfig: !chainConfig,
          supportedChain: !supportedChain,
        },
      })

      return {
        isValid: false,
        missingFields: ["Missing selector entry, chain configuration, or supported chain"],
      }
    }

    // Validate chainId and selectorEntry (use explicit null/undefined check to allow chainId 0)
    if (chainId === undefined || chainId === null || !selectorEntry) {
      logger.warn({
        message: "Missing chain ID or selector entry",
        requestId: this.requestId,
        networkId,
        hasChainId: chainId !== undefined && chainId !== null,
        hasSelectorEntry: !!selectorEntry,
      })

      return {
        isValid: false,
        missingFields: ["selector", "chainId"],
      }
    }

    // Validate display name
    const displayName = getTitle(supportedChain)
    if (!displayName) {
      logger.warn({
        message: "Missing display name for chain",
        requestId: this.requestId,
        networkId,
        supportedChain,
      })

      return {
        isValid: false,
        missingFields: ["displayName"],
      }
    }

    // Validate native token
    const nativeTokenSymbol = getNativeCurrency(supportedChain)
    if (!nativeTokenSymbol) {
      logger.warn({
        message: "Missing native token symbol",
        requestId: this.requestId,
        networkId,
        supportedChain,
      })

      return {
        isValid: false,
        missingFields: ["nativeTokenSymbol"],
      }
    }

    // Common required fields
    const requiredFields = {
      selector: !selectorEntry.selector,
      internalId: !selectorEntry.name,
      feeTokens: !chainConfig.feeTokens,
      router: !chainConfig.router?.address,
      rmn: !chainConfig.armProxy?.address,
    }

    Object.entries(requiredFields).forEach(([field, isMissing]) => {
      if (isMissing) missingFields.push(field)
    })

    if (missingFields.length > 0) {
      logger.warn({
        message: "Missing required fields in chain configuration",
        requestId: this.requestId,
        networkId,
        missingFields,
      })

      return {
        isValid: false,
        missingFields,
      }
    }

    // Prepare fee tokens array with native token
    const feeTokens = [...chainConfig.feeTokens]
    if (!feeTokens.includes(nativeTokenSymbol.symbol)) {
      feeTokens.push(nativeTokenSymbol.symbol)
    }

    // Get chain type and family
    const { chainType, chainFamily } = getChainTypeAndFamily(supportedChain)

    return {
      isValid: true,
      missingFields: [],
      baseData: {
        chainId,
        displayName,
        selector: selectorEntry.selector,
        internalId: selectorEntry.name,
        feeTokens,
        router: chainConfig.router.address,
        rmn: chainConfig.armProxy.address,
        chainType,
        chainFamily,
      },
    }
  }

  abstract validateChainData(
    chainId: number | string | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: ChainDetails
  }
}

// EVM Chain Strategy
class EvmChainStrategy extends BaseChainStrategy {
  validateChainData(
    chainId: number | string | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: ChainDetails
  } {
    // Validate base fields first
    const baseValidation = this.validateBaseFields(chainId, networkId, chainConfig, selectorEntry, supportedChain)

    if (!baseValidation.isValid || !baseValidation.baseData) {
      return {
        isValid: false,
        missingFields: baseValidation.missingFields,
      }
    }

    // EVM-specific validation
    const evmRequiredFields = {
      registryModule: !chainConfig.registryModule?.address,
      tokenAdminRegistry: !chainConfig.tokenAdminRegistry?.address,
    }

    const missingFields: string[] = []

    Object.entries(evmRequiredFields).forEach(([field, isMissing]) => {
      if (isMissing) missingFields.push(field)
    })

    if (missingFields.length > 0) {
      logger.warn({
        message: "Missing EVM-specific fields in chain configuration",
        requestId: this.requestId,
        networkId,
        missingFields,
      })

      return {
        isValid: false,
        missingFields,
      }
    }

    // Construct the complete EVM chain details with explicit field assignment
    const { baseData } = baseValidation
    const validatedData: ChainDetails = {
      chainId: baseData.chainId!,
      displayName: baseData.displayName!,
      selector: baseData.selector!,
      internalId: baseData.internalId!,
      feeTokens: baseData.feeTokens!,
      router: baseData.router!,
      rmn: baseData.rmn!,
      chainType: baseData.chainType!,
      chainFamily: baseData.chainFamily!,
      supported: true,
      registryModule: chainConfig.registryModule?.address,
      tokenAdminRegistry: chainConfig.tokenAdminRegistry?.address,
      tokenPoolFactory: chainConfig.tokenPoolFactory?.address,
    }

    return {
      isValid: true,
      missingFields: [],
      validatedData,
    }
  }
}

// Solana Chain Strategy
class SolanaChainStrategy extends BaseChainStrategy {
  validateChainData(
    chainId: number | string | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: ChainDetails
  } {
    // Validate base fields first
    const baseValidation = this.validateBaseFields(chainId, networkId, chainConfig, selectorEntry, supportedChain)

    if (!baseValidation.isValid || !baseValidation.baseData) {
      return {
        isValid: false,
        missingFields: baseValidation.missingFields,
      }
    }

    // Solana-specific validation
    const solanaRequiredFields = {
      feeQuoter: !chainConfig.feeQuoter,
    }

    const missingFields: string[] = []

    Object.entries(solanaRequiredFields).forEach(([field, isMissing]) => {
      if (isMissing) missingFields.push(field)
    })

    if (missingFields.length > 0) {
      logger.warn({
        message: "Missing Solana-specific fields in chain configuration",
        requestId: this.requestId,
        networkId,
        missingFields,
      })

      return {
        isValid: false,
        missingFields,
      }
    }

    // Construct the complete Solana chain details with explicit field assignment
    const { baseData } = baseValidation
    const validatedData: ChainDetails = {
      chainId: baseData.chainId!,
      displayName: baseData.displayName!,
      selector: baseData.selector!,
      internalId: baseData.internalId!,
      feeTokens: baseData.feeTokens!,
      router: baseData.router!,
      rmn: baseData.rmn!,
      chainType: baseData.chainType!,
      chainFamily: baseData.chainFamily!,
      supported: true,
      feeQuoter: chainConfig.feeQuoter,
    }

    return {
      isValid: true,
      missingFields: [],
      validatedData,
    }
  }
}

class AptosChainStrategy extends BaseChainStrategy {
  private static readonly REQUIRED_FIELDS = {
    tokenAdminRegistry: (config: ChainsConfig[string]) => !config.tokenAdminRegistry?.address,
    mcms: (config: ChainsConfig[string]) => !config.mcms?.address,
  } as const

  validateChainData(
    chainId: number | string | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: ChainDetails
  } {
    const baseValidation = this.validateBaseFields(chainId, networkId, chainConfig, selectorEntry, supportedChain)

    if (!baseValidation.isValid || !baseValidation.baseData) {
      return {
        isValid: false,
        missingFields: baseValidation.missingFields,
      }
    }

    const missingFields = this.validateAptosRequirements(chainConfig)

    if (missingFields.length > 0) {
      logger.warn({
        message: "Aptos chain configuration incomplete",
        requestId: this.requestId,
        networkId,
        missingFields,
      })

      return {
        isValid: false,
        missingFields,
      }
    }

    // Construct the complete Aptos chain details with explicit field assignment
    const { baseData } = baseValidation
    const validatedData: ChainDetails = {
      chainId: baseData.chainId!,
      displayName: baseData.displayName!,
      selector: baseData.selector!,
      internalId: baseData.internalId!,
      feeTokens: baseData.feeTokens!,
      router: baseData.router!,
      rmn: baseData.rmn!,
      chainType: baseData.chainType!,
      chainFamily: baseData.chainFamily!,
      supported: true,
      tokenAdminRegistry: chainConfig.tokenAdminRegistry?.address ?? "",
      mcms: chainConfig.mcms?.address ?? "",
    }

    return {
      isValid: true,
      missingFields: [],
      validatedData,
    }
  }

  private validateAptosRequirements(chainConfig: ChainsConfig[string]): string[] {
    return Object.entries(AptosChainStrategy.REQUIRED_FIELDS)
      .filter(([, validator]) => validator(chainConfig))
      .map(([field]) => field)
  }
}

class ChainStrategyFactory {
  private static readonly strategies = new Map<ChainType, new (requestId: string) => IChainProcessingStrategy>([
    ["evm", EvmChainStrategy],
    ["solana", SolanaChainStrategy],
    ["aptos", AptosChainStrategy],
    ["sui", AptosChainStrategy], // Sui uses Move VM like Aptos
    // New chain types use EVM strategy as fallback until specific strategies are implemented
    ["tron", EvmChainStrategy],
    ["canton", EvmChainStrategy],
    ["ton", EvmChainStrategy],
    ["stellar", EvmChainStrategy],
    ["starknet", EvmChainStrategy],
  ])

  static getStrategy(chainType: ChainType, requestId: string): IChainProcessingStrategy {
    const StrategyClass = this.strategies.get(chainType)

    if (!StrategyClass) {
      const supportedTypes = Array.from(this.strategies.keys()).join(", ")
      throw new Error(`Chain type "${chainType}" not supported. Available strategies: ${supportedTypes}`)
    }

    return new StrategyClass(requestId)
  }
}

/**
 * Service class for handling CCIP chain data operations
 * Provides functionality to validate and filter chain configurations
 */
export class ChainDataService {
  private chainConfig: ChainsConfig
  private errors: ChainConfigError[] = []
  private readonly requestId: string

  /**
   * Creates a new instance of ChainDataService
   * @param chainConfig - Configuration for supported chains
   * @param requestId - Optional request ID for log correlation (generates new UUID if not provided)
   */
  constructor(chainConfig: ChainsConfig, requestId?: string) {
    this.chainConfig = chainConfig
    this.requestId = requestId ?? crypto.randomUUID()

    logger.debug({
      message: "ChainDataService initialized",
      requestId: this.requestId,
      chainCount: Object.keys(chainConfig).length,
    })
  }

  /**
   * Enriches fee token symbols with addresses and additional metadata
   *
   * @param feeTokenSymbols - Array of fee token symbols
   * @param chainKey - Chain identifier
   * @param environment - Network environment
   * @returns Enriched fee token objects with addresses
   *
   * @remarks
   * This method looks up each fee token in the token data to retrieve
   * its address, name, and decimals on the specified chain.
   * Tokens not found are logged and filtered out.
   */
  private enrichFeeTokens(feeTokenSymbols: string[], chainKey: string, environment: Environment): FeeTokenEnriched[] {
    return feeTokenSymbols
      .map((tokenSymbol) => {
        try {
          // Fetch token data for this token across all chains
          const tokenData = getTokenData({
            environment,
            version: Version.V1_2_0,
            tokenId: tokenSymbol,
          })

          // Get token info for this specific chain
          const chainTokenData = tokenData[chainKey]

          if (!chainTokenData) {
            logger.warn({
              message: "Fee token not found on chain",
              requestId: this.requestId,
              tokenSymbol,
              chainKey,
            })
            return null
          }

          return {
            symbol: chainTokenData.symbol,
            name: chainTokenData.name || tokenSymbol,
            address: chainTokenData.tokenAddress,
            decimals: chainTokenData.decimals,
          }
        } catch (error) {
          logger.error({
            message: "Failed to enrich fee token",
            requestId: this.requestId,
            tokenSymbol,
            chainKey,
            error: error instanceof Error ? error.message : "Unknown error",
          })
          return null
        }
      })
      .filter((token): token is FeeTokenEnriched => token !== null)
  }

  /**
   * Retrieves chain details for a specific chain configuration
   *
   * @param chainConfig - Chain configuration object
   * @param chainKey - Chain identifier key
   * @param environment - Network environment
   * @param enrichFeeTokens - Whether to enrich fee tokens with addresses
   * @returns Chain details or null if validation fails
   *
   * @remarks
   * This method:
   * 1. Resolves the chain identifier
   * 2. Gets the chain ID and selector
   * 3. Validates the chain configuration using appropriate strategy
   * 4. Optionally enriches fee tokens with additional metadata
   * 5. Returns formatted chain details
   */
  private async getChainDetails(
    chainConfig: ChainsConfig[string],
    chainKey: string,
    environment: Environment,
    enrichFeeTokensFlag: boolean
  ): Promise<ChainDetails | null> {
    const networkId = chainKey

    logger.debug({
      message: "Getting chain details",
      requestId: this.requestId,
      networkId,
    })

    // Resolve chain identifier
    let supportedChain: SupportedChain
    try {
      supportedChain = resolveChainOrThrow(networkId)
    } catch (error) {
      logger.error({
        message: "Failed to resolve chain identifier",
        requestId: this.requestId,
        networkId,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      this.errors.push({
        chainId: 0,
        networkId,
        reason: `Invalid network ID: ${networkId}`,
        missingFields: ["networkId"],
      })
      return null
    }

    // Get chain ID and selector
    const chainId = getChainId(supportedChain)
    const { chainType } = getChainTypeAndFamily(supportedChain)
    const selectorEntry = chainId ? getSelectorEntry(chainId, chainType) : undefined

    // Get appropriate strategy based on chain type
    const strategy = ChainStrategyFactory.getStrategy(chainType, this.requestId)

    // Validate using the strategy
    const validation = strategy.validateChainData(chainId, networkId, chainConfig, selectorEntry, supportedChain)

    if (!validation.isValid || !validation.validatedData) {
      logger.warn({
        message: "Chain validation failed",
        requestId: this.requestId,
        networkId,
        chainId,
        missingFields: validation.missingFields,
      })

      this.errors.push({
        chainId: typeof chainId === "number" ? chainId : 0,
        networkId,
        reason: "Missing required chain configuration data",
        missingFields: validation.missingFields,
      })
      return null
    }

    // Enrich fee tokens if requested
    if (enrichFeeTokensFlag && Array.isArray(validation.validatedData.feeTokens)) {
      const feeTokenSymbols = validation.validatedData.feeTokens as string[]
      validation.validatedData.feeTokens = this.enrichFeeTokens(feeTokenSymbols, chainKey, environment)

      logger.debug({
        message: "Fee tokens enriched",
        requestId: this.requestId,
        networkId,
        originalCount: feeTokenSymbols.length,
        enrichedCount: validation.validatedData.feeTokens.length,
      })
    }

    logger.debug({
      message: "Chain details retrieved successfully",
      requestId: this.requestId,
      networkId,
      chainId: validation.validatedData.chainId,
      selector: validation.validatedData.selector,
    })

    return validation.validatedData
  }

  /**
   * Retrieves filtered chain information based on environment and filters
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param filters - Chain filters (chainId, selector, internalId)
   * @param enrichFeeTokens - Whether to enrich fee tokens with addresses and metadata
   * @returns Filtered chain information grouped by chain family with metadata
   *
   * @remarks
   * This method:
   * 1. Processes all chain configurations
   * 2. Applies specified filters
   * 3. Groups results by chain family
   * 4. Optionally enriches fee tokens with additional data
   * 5. Returns filtered results with metadata
   * 6. Tracks any errors encountered during processing
   */
  public async getFilteredChains(
    environment: Environment,
    filters: FilterType,
    enrichFeeTokens = false
  ): Promise<{
    data: Record<ChainFamily, ChainDetails[]>
    errors: ChainConfigError[]
    metadata: { validChainCount: number; ignoredChainCount: number }
  }> {
    logger.info({
      message: "Starting chain filtering process",
      requestId: this.requestId,
      environment,
      filters,
      enrichFeeTokens,
      totalChains: Object.keys(this.chainConfig).length,
    })

    const chains: ChainDetails[] = []
    this.errors = [] // Reset errors for new request

    // Process each chain configuration
    for (const [familyKey, familyConfig] of Object.entries(this.chainConfig)) {
      const chainDetails = await this.getChainDetails(familyConfig, familyKey, environment, enrichFeeTokens)
      if (chainDetails) chains.push(chainDetails)
    }

    // Apply filters
    let filteredChains = chains
    if (filters.chainId || filters.selector || filters.internalId) {
      const originalCount = filteredChains.length

      if (filters.chainId) {
        const chainIds = filters.chainId.split(",").map((id) => id.trim())
        filteredChains = filteredChains.filter((chain) => chainIds.includes(String(chain.chainId)))
      }

      if (filters.selector) {
        const selectors = filters.selector.split(",").map((s) => s.trim())
        filteredChains = filteredChains.filter((chain) => selectors.includes(chain.selector))
      }

      if (filters.internalId) {
        const internalIds = filters.internalId.split(",").map((id) => id.trim())
        filteredChains = filteredChains.filter((chain) => internalIds.includes(chain.internalId))
      }

      logger.debug({
        message: "Applied chain filters",
        requestId: this.requestId,
        originalCount,
        filteredCount: filteredChains.length,
        appliedFilters: {
          chainId: !!filters.chainId,
          selector: !!filters.selector,
          internalId: !!filters.internalId,
        },
      })
    }

    // Group by chain family
    const groupedChains: Record<ChainFamily, ChainDetails[]> = {
      evm: [],
      aptos: [],
      sui: [],
      solana: [],
      tron: [],
      canton: [],
      ton: [],
      stellar: [],
      starknet: [],
    }

    for (const chain of filteredChains) {
      groupedChains[chain.chainFamily].push(chain)
    }

    const metadata = {
      validChainCount: filteredChains.length,
      ignoredChainCount: this.errors.length,
    }

    logger.info({
      message: "Chain filtering completed",
      requestId: this.requestId,
      metadata,
      errorCount: this.errors.length,
    })

    return {
      data: groupedChains,
      errors: this.errors,
      metadata,
    }
  }
}

/**
 * Maps a chain type to its corresponding chain family.
 *
 * Each chain type maps directly to its own family:
 * - evm: Ethereum Virtual Machine chains
 * - solana: Solana chains
 * - aptos: Aptos chains
 * - sui: Sui chains
 * - tron, canton, ton, stellar, starknet: Each has its own family
 *
 * @param chainType - The specific chain type
 * @returns The chain family (same as chain type)
 * @example
 * getChainFamilyFromType('solana') // returns 'solana'
 * getChainFamilyFromType('aptos')  // returns 'aptos'
 */
function getChainFamilyFromType(chainType: ChainType): ChainFamily {
  switch (chainType) {
    case "evm":
      return "evm"
    case "solana":
      return "solana"
    case "aptos":
      return "aptos"
    case "sui":
      return "sui"
    case "tron":
      return "tron"
    case "canton":
      return "canton"
    case "ton":
      return "ton"
    case "stellar":
      return "stellar"
    case "starknet":
      return "starknet"
    default:
      return "evm"
  }
}

/**
 * Gets all chains for search including both supported and unsupported chains.
 *
 * Supported chains have full details from the chain configuration, while
 * unsupported chains have minimal details derived from selector YAML files.
 * The displayName for unsupported chains is derived from their internalId.
 *
 * @param environment - Network environment (mainnet/testnet)
 * @param supportedChains - Array of fully supported chain details with complete configuration
 * @returns Array of all chain details with supported flag indicating if chain is fully configured
 *
 * @example
 * const allChains = getAllChainsForSearch(Environment.Mainnet, supportedChains)
 * // Returns both supported chains (with full details) and unsupported chains (minimal details)
 */
export function getAllChainsForSearch(environment: Environment, supportedChains: ChainDetails[]): ChainDetails[] {
  // Use Map for O(1) lookup instead of find() which is O(n)
  const supportedChainsBySelector = new Map<string, ChainDetails>(
    supportedChains.map((chain) => [chain.selector, chain])
  )
  const networkType = environment === Environment.Mainnet ? "mainnet" : "testnet"

  // Get all selectors from YAML files for all chain types
  const allSelectors = [
    ...getAllSelectors("evm", networkType),
    ...getAllSelectors("solana", networkType),
    ...getAllSelectors("aptos", networkType),
    ...getAllSelectors("sui", networkType),
    ...getAllSelectors("canton", networkType),
    ...getAllSelectors("ton", networkType),
    ...getAllSelectors("tron", networkType),
    ...getAllSelectors("stellar", networkType),
    ...getAllSelectors("starknet", networkType),
  ]

  const result: ChainDetails[] = []

  for (const entry of allSelectors) {
    // Skip entries with missing required data
    if (!entry.selector || !entry.chainType) {
      continue
    }

    const supportedChain = supportedChainsBySelector.get(entry.selector)

    if (supportedChain) {
      // Supported chain - use full details with supported: true
      result.push({ ...supportedChain, supported: true })
    } else {
      // Unsupported chain - minimal details from selector data
      // Use explicit chainId check to allow 0 as valid value
      const chainFamily = getChainFamilyFromType(entry.chainType)
      const internalId = entry.name || `chain-${entry.chainId ?? "unknown"}`
      result.push({
        chainId: entry.chainId ?? "",
        selector: entry.selector,
        internalId,
        displayName: deriveDisplayName(internalId),
        chainType: entry.chainType,
        chainFamily,
        supported: false,
        feeTokens: [],
        router: "",
        rmn: "",
      })
    }
  }

  return result
}
