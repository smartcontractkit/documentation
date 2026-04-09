import {
  Environment,
  TokenDirectoryData,
  TokenDirectoryServiceResponse,
  NamingConvention,
} from "~/lib/ccip/types/index.ts"
import { loadReferenceData, Version } from "@config/data/ccip/index.ts"
import type { ChainConfig } from "@config/data/ccip/types.ts"
import { logger } from "@lib/logging/index.js"
import { getTokenData } from "@config/data/ccip/data.ts"
import { getChainId, directoryToSupportedChain } from "../../../features/utils/index.ts"
import { ChainIdentifierService } from "./chain-identifier.ts"
import { getEffectivePoolVersion, shouldEnableCCVFeatures } from "~/lib/ccip/utils/pool-version.ts"
import { fetchPoolDataForToken } from "~/lib/ccip/graphql/services/enrichment-data-service.ts"

export const prerender = false

/**
 * Service class for handling token directory data operations
 * Provides detailed token information including CCV configuration for a specific chain
 */
export class TokenDirectoryService {
  private readonly requestId: string

  constructor(requestId?: string) {
    this.requestId = requestId ?? crypto.randomUUID()

    logger.debug({
      message: "TokenDirectoryService initialized",
      requestId: this.requestId,
    })
  }

  /**
   * Retrieves detailed token directory data for a specific token and chain
   *
   * @param environment - Network environment (mainnet/testnet)
   * @param tokenSymbol - Token canonical symbol
   * @param chainIdentifier - Chain identifier (can be directory key or selector name)
   * @param internalIdFormat - Format for internalId values (selector or directory)
   * @returns Token directory data or null if not found
   */
  async getTokenDirectory(
    environment: Environment,
    tokenSymbol: string,
    chainIdentifier: string,
    internalIdFormat: NamingConvention
  ): Promise<TokenDirectoryServiceResponse> {
    logger.info({
      message: "Getting token directory data",
      requestId: this.requestId,
      environment,
      tokenSymbol,
      chainIdentifier,
      internalIdFormat,
    })

    try {
      // Load reference data
      const { chainsReferenceData } = loadReferenceData({
        environment,
        version: Version.V1_2_0,
      })

      // Use ChainIdentifierService to resolve the chain identifier
      const chainIdService = new ChainIdentifierService(environment, internalIdFormat)
      const resolved = chainIdService.resolve(chainIdentifier)

      if (!resolved) {
        logger.warn({
          message: "Could not resolve chain identifier",
          requestId: this.requestId,
          chainIdentifier,
        })
        return { data: null }
      }

      const directoryKey = resolved.directoryKey

      // Check if chain exists in reference data
      const chainConfig = chainsReferenceData[directoryKey] as ChainConfig | undefined
      if (!chainConfig) {
        logger.warn({
          message: "Chain not found in reference data",
          requestId: this.requestId,
          directoryKey,
        })
        return { data: null }
      }

      // Get token data for this chain
      const tokenData = getTokenData({
        environment,
        version: Version.V1_2_0,
        tokenId: tokenSymbol,
      })

      if (!tokenData) {
        logger.warn({
          message: "Token not found",
          requestId: this.requestId,
          tokenSymbol,
        })
        return { data: null }
      }

      // Find token data for the specific chain
      // tokenData keys are directory keys (e.g., "mainnet", "arbitrum-mainnet")
      const chainTokenData = tokenData[directoryKey]

      if (!chainTokenData) {
        logger.warn({
          message: "Token not found on specified chain",
          requestId: this.requestId,
          tokenSymbol,
          chainIdentifier: directoryKey,
        })
        return { data: null }
      }

      // Fetch pool data from GraphQL
      const poolInfo = await fetchPoolDataForToken(environment, tokenSymbol, directoryKey)

      if (!poolInfo?.address) {
        logger.warn({
          message: "Pool data not found for token on chain",
          requestId: this.requestId,
          tokenSymbol,
          chainIdentifier: directoryKey,
        })
        return { data: null }
      }

      // Get chain info
      const chainInfo = this.resolveChainInfo(directoryKey, chainConfig)
      if (!chainInfo) {
        return { data: null }
      }

      // Check if this pool supports CCV features (v2.0+ only)
      const actualPoolVersion = poolInfo.version || ""
      const isCCVEnabled = await shouldEnableCCVFeatures(environment, tokenSymbol, directoryKey, actualPoolVersion)

      const formattedInternalId = chainIdService.format(directoryKey, internalIdFormat)

      const data: TokenDirectoryData = {
        internalId: formattedInternalId,
        chainId: chainInfo.chainId,
        selector: chainInfo.selector,
        token: {
          address: chainTokenData.tokenAddress,
          decimals: chainTokenData.decimals,
        },
        pool: {
          address: poolInfo.address,
          rawType: poolInfo.rawType,
          type: poolInfo.type,
          version: await getEffectivePoolVersion(environment, tokenSymbol, directoryKey, poolInfo.version || ""),
          hook: poolInfo.hook,
          capabilities: {
            supportsV2Features: isCCVEnabled,
          },
          finality: {
            finalityDepth: poolInfo.finalityDepth,
            finalitySafe: poolInfo.finalitySafe,
          },
          ccv: {
            thresholdAmount: poolInfo.thresholdAmount ?? "0",
          },
        },
      }

      logger.info({
        message: "Token directory data retrieved",
        requestId: this.requestId,
        tokenSymbol,
        chainIdentifier: directoryKey,
      })

      return { data }
    } catch (error) {
      logger.error({
        message: "Failed to get token directory data",
        requestId: this.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return { data: null }
    }
  }

  /**
   * Resolves chain information from chain key and config
   */
  private resolveChainInfo(
    chainKey: string,
    chainConfig: ChainConfig
  ): { chainId: number | string; selector: string } | null {
    try {
      let chainId: number | string = chainKey

      try {
        const supportedChain = directoryToSupportedChain(chainKey)
        const resolvedChainId = getChainId(supportedChain)
        if (resolvedChainId) chainId = resolvedChainId
      } catch {
        // Use chainKey as fallback
      }

      const selector = chainConfig.chainSelector
      if (!selector) {
        return null
      }

      return { chainId, selector }
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
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
