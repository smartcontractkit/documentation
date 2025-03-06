import { Environment, ChainDetails, FilterType, ChainConfigError } from "../ccip/types/index.ts"
import { ChainsConfig } from "@config/data/ccip/index.ts"
import { SelectorsConfig } from "@config/data/ccip/selectors.ts"
import { resolveChainOrThrow, LogLevel, structuredLog } from "../ccip/utils.ts"
import { getChainId, getNativeCurrency, getTitle } from "../../../features/utils/index.ts"
import { SupportedChain } from "~/config/index.ts"

export const prerender = false

/**
 * Service class for handling CCIP chain data operations
 * Provides functionality to validate and filter chain configurations
 */
export class ChainDataService {
  private chainConfig: ChainsConfig
  private selectorConfig: SelectorsConfig
  private errors: ChainConfigError[] = []
  private readonly requestId: string

  /**
   * Creates a new instance of ChainDataService
   * @param chainConfig - Configuration for supported chains
   * @param selectorConfig - Configuration for chain selectors
   */
  constructor(chainConfig: ChainsConfig, selectorConfig: SelectorsConfig) {
    this.chainConfig = chainConfig
    this.selectorConfig = selectorConfig
    this.requestId = crypto.randomUUID()

    structuredLog(LogLevel.DEBUG, {
      message: "ChainDataService initialized",
      requestId: this.requestId,
      chainCount: Object.keys(chainConfig).length,
      selectorCount: Object.keys(selectorConfig.selectors).length,
    })
  }

  /**
   * Validates chain data and ensures all required fields are present
   *
   * @param chainId - Numeric identifier for the chain
   * @param networkId - Network identifier string
   * @param chainConfig - Chain configuration object
   * @param selectorEntry - Chain selector configuration
   * @param supportedChain - Supported chain identifier
   *
   * @returns Validation result containing:
   * - isValid: boolean indicating if validation passed
   * - missingFields: array of missing required fields
   * - validatedData: validated chain data if validation passed
   *
   * @remarks
   * This method performs comprehensive validation of chain data including:
   * - Presence of required fields (chainId, selector, etc.)
   * - Validation of contract addresses
   * - Verification of fee tokens
   * - Addition of native token to fee tokens if not present
   */
  private validateChainData(
    chainId: number | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: ChainDetails
  } {
    structuredLog(LogLevel.DEBUG, {
      message: "Starting chain data validation",
      requestId: this.requestId,
      chainId,
      networkId,
      hasSelectorEntry: !!selectorEntry,
      hasSupportedChain: !!supportedChain,
    })

    const missingFields: string[] = []

    // Early validation for required dependencies
    if (!selectorEntry || !chainConfig || !supportedChain) {
      const missing = {
        selectorEntry: !selectorEntry,
        chainConfig: !chainConfig,
        supportedChain: !supportedChain,
      }

      structuredLog(LogLevel.WARN, {
        message: "Missing required dependencies for chain validation",
        requestId: this.requestId,
        networkId,
        missing,
      })

      return {
        isValid: false,
        missingFields: ["Missing selector entry, chain configuration, or supported chain"],
      }
    }

    // Validate chainId and selectorEntry
    if (!chainId || !selectorEntry) {
      structuredLog(LogLevel.WARN, {
        message: "Missing chain ID or selector entry",
        requestId: this.requestId,
        networkId,
        hasChainId: !!chainId,
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
      structuredLog(LogLevel.WARN, {
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
      structuredLog(LogLevel.WARN, {
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

    // Validate required contract addresses and configuration
    const requiredFields = {
      selector: !selectorEntry.selector,
      internalId: !selectorEntry.name,
      feeTokens: !chainConfig.feeTokens,
      router: !chainConfig.router?.address,
      rmn: !chainConfig.armProxy?.address,
      registryModule: !chainConfig.registryModule?.address,
      tokenAdminRegistry: !chainConfig.tokenAdminRegistry?.address,
    }

    Object.entries(requiredFields).forEach(([field, isMissing]) => {
      if (isMissing) missingFields.push(field)
    })

    if (missingFields.length > 0) {
      structuredLog(LogLevel.WARN, {
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

    // Type guard for optional fields
    if (
      !chainConfig.router ||
      !chainConfig.armProxy ||
      !chainConfig.registryModule ||
      !chainConfig.tokenAdminRegistry
    ) {
      structuredLog(LogLevel.ERROR, {
        message: "Unexpected undefined fields after validation",
        requestId: this.requestId,
        networkId,
        chainConfig: {
          hasRouter: !!chainConfig.router,
          hasArmProxy: !!chainConfig.armProxy,
          hasRegistryModule: !!chainConfig.registryModule,
          hasTokenAdminRegistry: !!chainConfig.tokenAdminRegistry,
        },
      })

      return {
        isValid: false,
        missingFields: ["Unexpected undefined fields after validation"],
      }
    }

    // Prepare fee tokens array with native token
    const feeTokens = [...chainConfig.feeTokens]
    if (!feeTokens.includes(nativeTokenSymbol.symbol)) {
      feeTokens.push(nativeTokenSymbol.symbol)
    }

    const validatedData: ChainDetails = {
      chainId,
      displayName,
      selector: selectorEntry.selector,
      internalId: selectorEntry.name,
      feeTokens,
      router: chainConfig.router.address,
      rmn: chainConfig.armProxy.address,
      registryModule: chainConfig.registryModule.address,
      tokenAdminRegistry: chainConfig.tokenAdminRegistry.address,
      tokenPoolFactory: chainConfig.tokenPoolFactory?.address,
    }

    structuredLog(LogLevel.DEBUG, {
      message: "Chain data validation successful",
      requestId: this.requestId,
      networkId,
      chainId,
      selector: selectorEntry.selector,
      feeTokenCount: feeTokens.length,
    })

    return {
      isValid: true,
      missingFields: [],
      validatedData,
    }
  }

  /**
   * Retrieves chain details for a specific chain configuration
   *
   * @param chainConfig - Chain configuration object
   * @param chainKey - Chain identifier key
   * @returns Chain details or null if validation fails
   *
   * @remarks
   * This method:
   * 1. Resolves the chain identifier
   * 2. Gets the chain ID and selector
   * 3. Validates the chain configuration
   * 4. Returns formatted chain details
   */
  private async getChainDetails(chainConfig: ChainsConfig[string], chainKey: string): Promise<ChainDetails | null> {
    const networkId = chainKey

    structuredLog(LogLevel.DEBUG, {
      message: "Getting chain details",
      requestId: this.requestId,
      networkId,
    })

    // Resolve chain identifier
    let supportedChain: SupportedChain
    try {
      supportedChain = resolveChainOrThrow(networkId)
    } catch (error) {
      structuredLog(LogLevel.ERROR, {
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
    const selectorEntry = chainId ? this.selectorConfig.selectors[chainId] : undefined

    // Validate chain data
    const validation = this.validateChainData(chainId, networkId, chainConfig, selectorEntry, supportedChain)

    if (!validation.isValid || !validation.validatedData) {
      structuredLog(LogLevel.WARN, {
        message: "Chain validation failed",
        requestId: this.requestId,
        networkId,
        chainId,
        missingFields: validation.missingFields,
      })

      this.errors.push({
        chainId: chainId || 0,
        networkId,
        reason: "Missing required chain configuration data",
        missingFields: validation.missingFields,
      })
      return null
    }

    structuredLog(LogLevel.DEBUG, {
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
   * @returns Filtered chain information with metadata
   *
   * @remarks
   * This method:
   * 1. Processes all chain configurations
   * 2. Applies specified filters
   * 3. Returns filtered results with metadata
   * 4. Tracks any errors encountered during processing
   *
   * @example
   * ```typescript
   * const service = new ChainDataService(chainConfig, selectorConfig);
   * const result = await service.getFilteredChains("mainnet", { chainId: "1" });
   * ```
   */
  public async getFilteredChains(
    environment: Environment,
    filters: FilterType
  ): Promise<{
    chains: ChainDetails[]
    errors: ChainConfigError[]
    metadata: { validChainCount: number; ignoredChainCount: number }
  }> {
    structuredLog(LogLevel.INFO, {
      message: "Starting chain filtering process",
      requestId: this.requestId,
      environment,
      filters,
      totalChains: Object.keys(this.chainConfig).length,
    })

    const chains: ChainDetails[] = []
    this.errors = [] // Reset errors for new request

    // Process each chain configuration
    for (const [familyKey, familyConfig] of Object.entries(this.chainConfig)) {
      const chainDetails = await this.getChainDetails(familyConfig, familyKey)
      if (chainDetails) chains.push(chainDetails)
    }

    // Apply filters
    let filteredChains = chains
    if (filters.chainId || filters.selector || filters.internalId) {
      const originalCount = filteredChains.length

      if (filters.chainId) {
        const chainIds = filters.chainId.split(",").map((id) => parseInt(id.trim()))
        filteredChains = chains.filter((chain) => chainIds.includes(chain.chainId))
      }

      if (filters.selector) {
        const selectors = filters.selector.split(",").map((s) => s.trim())
        filteredChains = chains.filter((chain) => selectors.includes(chain.selector))
      }

      if (filters.internalId) {
        const internalIds = filters.internalId.split(",").map((id) => id.trim())
        filteredChains = chains.filter((chain) => internalIds.includes(chain.internalId))
      }

      structuredLog(LogLevel.DEBUG, {
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

    const metadata = {
      validChainCount: filteredChains.length,
      ignoredChainCount: this.errors.length,
    }

    structuredLog(LogLevel.INFO, {
      message: "Chain filtering completed",
      requestId: this.requestId,
      metadata,
      errorCount: this.errors.length,
    })

    return {
      chains: filteredChains,
      errors: this.errors,
      metadata,
    }
  }
}
