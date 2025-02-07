import { Environment, ChainDetails, FilterType, ChainConfigError } from "../ccip/types"
import { ChainsConfig } from "@config/data/ccip"
import { SelectorsConfig } from "@config/data/ccip/selectors"
import { resolveChainOrThrow } from "../ccip/utils"
import { getChainId, getNativeCurrency, getTitle } from "../../../features/utils"
import { SupportedChain } from "~/config"

export const prerender = false

export class ChainDataService {
  private chainConfig: ChainsConfig
  private selectorConfig: SelectorsConfig
  private errors: ChainConfigError[] = []

  constructor(chainConfig: ChainsConfig, selectorConfig: SelectorsConfig) {
    this.chainConfig = chainConfig
    this.selectorConfig = selectorConfig
  }

  private validateChainData(
    chainId: number | undefined,
    networkId: string,
    chainConfig: ChainsConfig[string],
    selectorEntry?: { selector: string; name: string },
    supportedChain?: SupportedChain
  ): {
    isValid: boolean
    missingFields: string[]
    validatedData?: {
      chainId: number
      displayName: string
      selector: string
      name: string
      feeTokens: string[]
      router: { address: string }
      rmn: { address: string }
      registryModule: { address: string }
      tokenAdminRegistry: { address: string }
    }
  } {
    const missingFields: string[] = []

    // Early returns for undefined data
    if (!selectorEntry || !chainConfig || !supportedChain) {
      return {
        isValid: false,
        missingFields: ["Missing selector entry, chain configuration, or supported chain"],
      }
    }

    // Validate chainId and selectorEntry
    if (!chainId || !selectorEntry) {
      return {
        isValid: false,
        missingFields: ["selector", "chainId"],
      }
    }

    // Validate displayName
    const displayName = getTitle(supportedChain)
    if (!displayName) {
      return {
        isValid: false,
        missingFields: ["displayName"],
      }
    }

    const nativeTokenSymbol = getNativeCurrency(supportedChain)
    if (!nativeTokenSymbol) {
      return {
        isValid: false,
        missingFields: ["nativeTokenSymbol"],
      }
    }

    // Validate all required fields exist
    if (!selectorEntry.selector) missingFields.push("selector")
    if (!selectorEntry.name) missingFields.push("internalId")
    if (!chainConfig.feeTokens) missingFields.push("feeTokens")
    if (!chainConfig.router?.address) missingFields.push("router")
    if (!chainConfig.armProxy?.address) missingFields.push("rmn")
    if (!chainConfig.registryModule?.address) missingFields.push("registryModule")
    if (!chainConfig.tokenAdminRegistry?.address) missingFields.push("tokenAdminRegistry")

    if (missingFields.length > 0) {
      return {
        isValid: false,
        missingFields,
      }
    }

    // Type guard to ensure all optional fields are defined
    if (
      !chainConfig.router ||
      !chainConfig.armProxy ||
      !chainConfig.registryModule ||
      !chainConfig.tokenAdminRegistry
    ) {
      return {
        isValid: false,
        missingFields: ["Unexpected undefined fields after validation"],
      }
    }

    // If we get here, TypeScript knows all fields exist and are defined
    const feeTokens = [...chainConfig.feeTokens]
    if (!feeTokens.includes(nativeTokenSymbol.symbol)) {
      feeTokens.push(nativeTokenSymbol.symbol)
    }

    return {
      isValid: true,
      missingFields: [],
      validatedData: {
        chainId,
        displayName,
        selector: selectorEntry.selector,
        name: selectorEntry.name,
        feeTokens,
        router: { address: chainConfig.router.address },
        rmn: { address: chainConfig.armProxy.address },
        registryModule: { address: chainConfig.registryModule.address },
        tokenAdminRegistry: { address: chainConfig.tokenAdminRegistry.address },
      },
    }
  }

  private async getChainDetails(chainConfig: ChainsConfig[string], chainKey: string): Promise<ChainDetails | null> {
    const networkId = chainKey

    let supportedChain: SupportedChain
    try {
      supportedChain = resolveChainOrThrow(networkId)
    } catch (error) {
      this.errors.push({
        chainId: 0,
        networkId,
        reason: `Invalid network ID: ${networkId}`,
        missingFields: ["networkId"],
      })
      return null
    }

    const chainId = getChainId(supportedChain)
    const selectorEntry = chainId ? this.selectorConfig.selectors[chainId] : undefined

    const validation = this.validateChainData(chainId, networkId, chainConfig, selectorEntry, supportedChain)

    if (!validation.isValid || !validation.validatedData) {
      this.errors.push({
        chainId: chainId || 0,
        networkId,
        reason: "Missing required chain configuration data",
        missingFields: validation.missingFields,
      })
      return null
    }

    // At this point, we know all required data exists and is validated
    const { validatedData } = validation
    return {
      chainId: validatedData.chainId,
      displayName: validatedData.displayName,
      selector: validatedData.selector,
      internalId: validatedData.name,
      feeTokens: validatedData.feeTokens,
      router: validatedData.router.address,
      rmn: validatedData.rmn.address,
      registryModule: validatedData.registryModule.address,
      tokenAdminRegistry: validatedData.tokenAdminRegistry.address,
    }
  }

  public async getFilteredChains(
    environment: Environment,
    filters: FilterType
  ): Promise<{
    chains: ChainDetails[]
    errors: ChainConfigError[]
    metadata: { validChainCount: number; ignoredChainCount: number }
  }> {
    const chains: ChainDetails[] = []
    this.errors = [] // Reset errors for new request

    // Process each chain family
    for (const [familyKey, familyConfig] of Object.entries(this.chainConfig)) {
      const chainDetails = await this.getChainDetails(familyConfig, familyKey)
      if (chainDetails) chains.push(chainDetails)
    }

    let filteredChains = chains
    // Apply filters
    if (filters.chainId || filters.selector || filters.internalId) {
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
    }

    return {
      chains: filteredChains,
      errors: this.errors,
      metadata: {
        validChainCount: filteredChains.length,
        ignoredChainCount: this.errors.length,
      },
    }
  }
}
