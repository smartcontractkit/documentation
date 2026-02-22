import {
  Environment,
  TokenDirectoryData,
  TokenDirectoryLane,
  TokenDirectoryServiceResponse,
  CCVConfigData,
  CCVChainConfig,
  LaneVerifiers,
  TokenRateLimits,
  TokenFees,
  NamingConvention,
  OutputKeyType,
  RateLimitsData,
  CustomFinalityConfig,
} from "~/lib/ccip/types/index.ts"
import { loadReferenceData, Version } from "@config/data/ccip/index.ts"
import type { LaneConfig, ChainConfig } from "@config/data/ccip/types.ts"
import { logger } from "@lib/logging/index.js"
import { getTokenData } from "@config/data/ccip/data.ts"
import { getChainId, getChainTypeAndFamily, directoryToSupportedChain } from "../../../features/utils/index.ts"
import { getSelectorEntry } from "@config/data/ccip/selectors.ts"
import { ChainIdentifierService } from "./chain-identifier.ts"
import { getEffectivePoolVersion, shouldEnableCCVFeatures } from "~/lib/ccip/utils/pool-version.ts"

// Import CCV config mock data
import ccvConfigMainnet from "~/__mocks__/ccv-config-mainnet.json" with { type: "json" }
import ccvConfigTestnet from "~/__mocks__/ccv-config-testnet.json" with { type: "json" }

// Import rate limits mock data
import rateLimitsMainnet from "~/__mocks__/rate-limits-mainnet.json" with { type: "json" }
import rateLimitsTestnet from "~/__mocks__/rate-limits-testnet.json" with { type: "json" }

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
   * @param outputKey - Format to use for displaying chain keys
   * @param internalIdFormat - Format for internalId values (selector or directory)
   * @returns Token directory data or null if not found
   */
  async getTokenDirectory(
    environment: Environment,
    tokenSymbol: string,
    chainIdentifier: string,
    outputKey: OutputKeyType,
    internalIdFormat: NamingConvention
  ): Promise<TokenDirectoryServiceResponse> {
    logger.info({
      message: "Getting token directory data",
      requestId: this.requestId,
      environment,
      tokenSymbol,
      chainIdentifier,
      outputKey,
      internalIdFormat,
    })

    try {
      // Load reference data
      const { lanesReferenceData, chainsReferenceData } = loadReferenceData({
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

      if (!chainTokenData || !chainTokenData.pool?.address) {
        logger.warn({
          message: "Token not found on specified chain",
          requestId: this.requestId,
          tokenSymbol,
          chainIdentifier: directoryKey,
        })
        return { data: null }
      }

      // Get selector name for later use
      const selectorName = resolved.selectorName

      // Get chain info
      const chainInfo = this.resolveChainInfo(directoryKey, chainConfig)
      if (!chainInfo) {
        return { data: null }
      }

      // Check if this pool supports CCV features (v2.0+ only)
      const actualPoolVersion = chainTokenData.pool.version || "1.0.0"
      const isCCVEnabled = shouldEnableCCVFeatures(environment, tokenSymbol, directoryKey, actualPoolVersion)

      // Load CCV config (only used for v2.0+ pools)
      const ccvConfigData = this.loadCCVConfigData(environment)
      const ccvConfig = isCCVEnabled ? ccvConfigData[tokenSymbol]?.[directoryKey] || null : null

      // Load rate limits data
      const rateLimitsData = this.loadRateLimitsData(environment)
      const tokenRateLimits = rateLimitsData[tokenSymbol]?.[directoryKey]

      // Get outbound lanes (from this chain to others)
      const outboundLanes = this.getOutboundLanes(
        directoryKey,
        selectorName,
        tokenSymbol,
        lanesReferenceData,
        chainsReferenceData as Record<string, ChainConfig>,
        ccvConfig,
        tokenRateLimits,
        outputKey,
        internalIdFormat,
        chainIdService,
        isCCVEnabled
      )

      // Get inbound lanes (from others to this chain)
      const inboundLanes = this.getInboundLanes(
        directoryKey,
        selectorName,
        tokenSymbol,
        lanesReferenceData,
        chainsReferenceData as Record<string, ChainConfig>,
        ccvConfig,
        rateLimitsData,
        outputKey,
        internalIdFormat,
        chainIdService,
        isCCVEnabled
      )

      // Format output based on outputKey and internalIdFormat
      const formattedInternalId = chainIdService.format(directoryKey, internalIdFormat)

      // Build custom finality config from rate limits data (v2.0+ pools only)
      // For v2 pools without data in mock, return { hasCustomFinality: null, minBlockConfirmation: null } to indicate downstream error
      let customFinality: CustomFinalityConfig | null = null
      if (isCCVEnabled) {
        if (tokenRateLimits !== undefined) {
          // Data entry exists in mock - use actual values (may still have null if downstream error for that specific chain)
          customFinality = this.buildCustomFinalityConfig(tokenRateLimits.minBlockConfirmation)
        } else {
          // v2 pool but no data entry in mock - downstream API error
          customFinality = { hasCustomFinality: null, minBlockConfirmation: null }
        }
      }

      const data: TokenDirectoryData = {
        internalId: formattedInternalId,
        chainId: chainInfo.chainId,
        selector: chainInfo.selector,
        token: {
          address: chainTokenData.tokenAddress,
          decimals: chainTokenData.decimals,
        },
        pool: {
          address: chainTokenData.pool.address,
          rawType: chainTokenData.pool.rawType,
          type: chainTokenData.pool.type,
          version: getEffectivePoolVersion(
            environment,
            tokenSymbol,
            directoryKey,
            chainTokenData.pool.version || "1.0.0"
          ),
          advancedPoolHooks: chainTokenData.pool.advancedPoolHooks || null,
          supportsV2Features: isCCVEnabled,
        },
        // ccvConfig handling:
        // - v1.x pool (isCCVEnabled=false): null (feature not supported)
        // - v2.x pool with config entry: {thresholdAmount: value} (could be null for downstream error)
        // - v2.x pool without config entry: {thresholdAmount: "0"} (not configured)
        ccvConfig: isCCVEnabled
          ? ccvConfig
            ? { thresholdAmount: ccvConfig.thresholdAmount }
            : { thresholdAmount: "0" }
          : null,
        customFinality,
        outboundLanes,
        inboundLanes,
      }

      logger.info({
        message: "Token directory data retrieved",
        requestId: this.requestId,
        tokenSymbol,
        chainIdentifier: directoryKey,
        outboundLaneCount: Object.keys(outboundLanes).length,
        inboundLaneCount: Object.keys(inboundLanes).length,
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
   * Gets outbound lanes for the token from this chain
   */
  private getOutboundLanes(
    sourceDirectoryKey: string,
    sourceSelectorName: string,
    tokenSymbol: string,
    lanesReferenceData: Record<string, Record<string, LaneConfig>>,
    chainsReferenceData: Record<string, ChainConfig>,
    ccvConfig: CCVChainConfig | null,
    tokenRateLimits: { minBlockConfirmation: number | null; remote: Record<string, unknown> } | undefined,
    outputKey: OutputKeyType,
    internalIdFormat: NamingConvention,
    chainIdService: ChainIdentifierService,
    isCCVEnabled: boolean
  ): Record<string, TokenDirectoryLane> {
    const result: Record<string, TokenDirectoryLane> = {}

    // Get lanes from this source chain
    const sourceLanes = lanesReferenceData[sourceDirectoryKey]
    if (!sourceLanes) {
      return result
    }

    for (const [destDirectoryKey, laneConfig] of Object.entries(sourceLanes)) {
      // Check if this lane supports the token
      if (!laneConfig.supportedTokens?.includes(tokenSymbol)) {
        continue
      }

      // Get destination chain info
      const destChainConfig = chainsReferenceData[destDirectoryKey]
      if (!destChainConfig) {
        continue
      }

      const destChainInfo = this.resolveChainInfo(destDirectoryKey, destChainConfig)
      if (!destChainInfo) {
        continue
      }

      // Get lane identifier (used in CCV and rate limits data)
      // CCV uses selector names for lane keys
      const destResolved = chainIdService.resolve(destDirectoryKey)
      const destSelectorName = destResolved?.selectorName || destDirectoryKey

      // Build lane key: "sourceSelector-to-destSelector" (deterministic, scales to any chain)
      const laneKey = this.buildLaneSelectorKey(sourceSelectorName, destSelectorName)

      // Get verifiers from CCV config (threshold verifiers only for v2.0+ pools)
      const verifiers = this.getVerifiersForLane(ccvConfig, laneKey, "outbound", isCCVEnabled)

      // Get rate limits (both standard and custom, both directions)
      const rateLimits = this.getRateLimitsForLane(tokenRateLimits, laneKey, destDirectoryKey, destSelectorName)

      // Get fees
      const fees = this.getFeesForLane(tokenRateLimits, laneKey, destDirectoryKey, destSelectorName)

      // Format the output key
      const outputLaneKey = this.formatLaneKey(destDirectoryKey, outputKey, internalIdFormat, chainIdService)
      const formattedInternalId = chainIdService.format(destDirectoryKey, internalIdFormat)

      result[outputLaneKey] = {
        internalId: formattedInternalId,
        chainId: destChainInfo.chainId,
        selector: destChainInfo.selector,
        rateLimits,
        fees,
        verifiers,
      }
    }

    return result
  }

  /**
   * Gets inbound lanes for the token to this chain
   */
  private getInboundLanes(
    destDirectoryKey: string,
    destSelectorName: string,
    tokenSymbol: string,
    lanesReferenceData: Record<string, Record<string, LaneConfig>>,
    chainsReferenceData: Record<string, ChainConfig>,
    ccvConfig: CCVChainConfig | null,
    rateLimitsData: RateLimitsData,
    outputKey: OutputKeyType,
    internalIdFormat: NamingConvention,
    chainIdService: ChainIdentifierService,
    isCCVEnabled: boolean
  ): Record<string, TokenDirectoryLane> {
    const result: Record<string, TokenDirectoryLane> = {}

    // Search all source chains for lanes to this destination
    for (const [sourceDirectoryKey, sourceLanes] of Object.entries(lanesReferenceData)) {
      const laneConfig = sourceLanes[destDirectoryKey]
      if (!laneConfig) {
        continue
      }

      // Check if this lane supports the token
      if (!laneConfig.supportedTokens?.includes(tokenSymbol)) {
        continue
      }

      // Get source chain info
      const sourceChainConfig = chainsReferenceData[sourceDirectoryKey]
      if (!sourceChainConfig) {
        continue
      }

      const sourceChainInfo = this.resolveChainInfo(sourceDirectoryKey, sourceChainConfig)
      if (!sourceChainInfo) {
        continue
      }

      // Get lane identifier
      const sourceResolved = chainIdService.resolve(sourceDirectoryKey)
      const sourceSelectorName = sourceResolved?.selectorName || sourceDirectoryKey

      // Build lane key: "sourceSelector-to-destSelector" (deterministic, scales to any chain)
      const laneKey = this.buildLaneSelectorKey(sourceSelectorName, destSelectorName)

      // Get verifiers from CCV config (threshold verifiers only for v2.0+ pools)
      const verifiers = this.getVerifiersForLane(ccvConfig, laneKey, "inbound", isCCVEnabled)

      // Get rate limits from source chain's perspective (both directions)
      // Remote keys are destinations; we look up by dest (chain we're viewing)
      const sourceTokenRateLimits = rateLimitsData[tokenSymbol]?.[sourceDirectoryKey]
      const rateLimits = this.getRateLimitsForLane(sourceTokenRateLimits, laneKey, destDirectoryKey, destSelectorName)

      // Get fees
      const fees = this.getFeesForLane(sourceTokenRateLimits, laneKey, destDirectoryKey, destSelectorName)

      // Format the output key
      const outputLaneKey = this.formatLaneKey(sourceDirectoryKey, outputKey, internalIdFormat, chainIdService)
      const formattedInternalId = chainIdService.format(sourceDirectoryKey, internalIdFormat)

      result[outputLaneKey] = {
        internalId: formattedInternalId,
        chainId: sourceChainInfo.chainId,
        selector: sourceChainInfo.selector,
        rateLimits,
        fees,
        verifiers,
      }
    }

    return result
  }

  /**
   * Builds a lane key using deterministic format: sourceSelector-to-destSelector.
   * Scales to any chain without hardcoded mappings.
   * e.g., "ethereum-mainnet-to-arbitrum-mainnet", "ethereum-mainnet-to-base-mainnet"
   */
  private buildLaneSelectorKey(sourceSelectorName: string, destSelectorName: string): string {
    return `${sourceSelectorName}-to-${destSelectorName}`
  }

  /**
   * Gets verifiers for a specific lane from CCV config.
   * Returns pre-computed verifier sets:
   * - belowThreshold: Verifiers used when transfer amount is below the threshold
   * - aboveThreshold: All verifiers used when transfer amount is at or above the threshold
   *                   (belowThreshold + additional threshold verifiers)
   * Threshold verifiers are only included for v2.0+ pools (when isCCVEnabled is true).
   *
   * Return value semantics:
   * - null: v1.x pool (feature not supported)
   * - {belowThreshold: [], aboveThreshold: []}: v2.x pool, no verifiers configured for this lane
   * - {belowThreshold: [...], aboveThreshold: [...]}: v2.x pool, verifiers configured
   * - {belowThreshold: null, aboveThreshold: null}: v2.x pool, downstream API error
   */
  private getVerifiersForLane(
    ccvConfig: CCVChainConfig | null,
    laneKey: string,
    direction: "outbound" | "inbound",
    isCCVEnabled: boolean
  ): LaneVerifiers | null {
    // For v1.x pools (CCV not enabled), verifiers don't exist - return null
    if (!isCCVEnabled) {
      return null
    }

    // For v2.x pools, CCV config should exist
    if (!ccvConfig) {
      return { belowThreshold: [], aboveThreshold: [] }
    }

    const ccvs = direction === "outbound" ? ccvConfig.outboundCCVs : ccvConfig.inboundCCVs
    if (!ccvs) {
      return { belowThreshold: [], aboveThreshold: [] }
    }

    const thresholdAmount = ccvConfig.thresholdAmount ?? "0"

    // Exact lookup only (no fuzzy matching)
    const laneVerifiers = ccvs[laneKey]
    if (laneVerifiers) {
      return this.buildVerifiersResponse(laneVerifiers.base, laneVerifiers.threshold, thresholdAmount)
    }

    return { belowThreshold: [], aboveThreshold: [] }
  }

  /**
   * Builds the verifiers response from base and threshold arrays.
   * Handles downstream API error case when arrays are null.
   * When thresholdAmount is "0" (threshold disabled pool-wide), aboveThreshold equals belowThreshold
   * because the contract never adds threshold verifiers (AdvancedPoolHooks._resolveRequiredCCVs).
   */
  private buildVerifiersResponse(
    baseVerifiers: string[] | null,
    thresholdVerifiers: string[] | null,
    thresholdAmount: string
  ): LaneVerifiers {
    // If either base or threshold is null, it indicates a downstream API error
    if (baseVerifiers === null || thresholdVerifiers === null) {
      return { belowThreshold: null, aboveThreshold: null }
    }

    const belowThreshold = baseVerifiers
    const aboveThreshold = thresholdAmount === "0" ? baseVerifiers : [...baseVerifiers, ...thresholdVerifiers]

    return { belowThreshold, aboveThreshold }
  }

  /**
   * Gets rate limits (both standard and custom) for a specific lane.
   * Returns both in and out directions for each rate limit type.
   * Tries exact lookup by destDirectoryKey, destSelectorName, then laneKey (handles mixed formats in upstream data).
   */
  private getRateLimitsForLane(
    tokenRateLimits: { minBlockConfirmation: number | null; remote: Record<string, unknown> } | undefined,
    laneKey: string,
    destDirectoryKey: string,
    destSelectorName: string
  ): TokenRateLimits {
    const defaultRateLimits: TokenRateLimits = { standard: null, custom: null }

    if (!tokenRateLimits?.remote) {
      return defaultRateLimits
    }

    const remote = tokenRateLimits.remote
    const lookupKeys = [destSelectorName, destDirectoryKey, laneKey]

    for (const key of lookupKeys) {
      const rateLimits = remote[key] as
        | {
            standard?: { in?: Record<string, unknown>; out?: Record<string, unknown> } | null
            custom?: { in?: Record<string, unknown>; out?: Record<string, unknown> } | null
          }
        | undefined
      if (rateLimits) {
        return {
          standard: (rateLimits.standard as TokenRateLimits["standard"]) ?? null,
          custom: (rateLimits.custom as TokenRateLimits["custom"]) ?? null,
        }
      }
    }

    return defaultRateLimits
  }

  /**
   * Gets transfer fees for a specific lane.
   * Tries exact lookup by destDirectoryKey, destSelectorName, then laneKey (handles mixed formats in upstream data).
   */
  private getFeesForLane(
    tokenRateLimits: { minBlockConfirmation: number | null; remote: Record<string, unknown> } | undefined,
    laneKey: string,
    destDirectoryKey: string,
    destSelectorName: string
  ): TokenFees | null {
    if (!tokenRateLimits?.remote) {
      return null
    }

    const remote = tokenRateLimits.remote
    const lookupKeys = [destSelectorName, destDirectoryKey, laneKey]

    for (const key of lookupKeys) {
      const limits = remote[key] as
        | {
            fees?: {
              standardTransferFeeBps?: number
              customTransferFeeBps?: number
            }
          }
        | undefined
      if (limits?.fees) {
        return {
          standardTransferFeeBps: limits.fees.standardTransferFeeBps ?? 0,
          customTransferFeeBps: limits.fees.customTransferFeeBps ?? 0,
        }
      }
    }

    return null
  }

  /**
   * Formats a lane key based on output format
   */
  private formatLaneKey(
    directoryKey: string,
    outputKey: OutputKeyType,
    internalIdFormat: NamingConvention,
    chainIdService: ChainIdentifierService
  ): string {
    if (outputKey === "chainId") {
      try {
        const supportedChain = directoryToSupportedChain(directoryKey)
        const chainId = getChainId(supportedChain)
        const { chainType } = getChainTypeAndFamily(supportedChain)
        if (chainId) {
          return chainType === "evm" ? chainId.toString() : `${chainType}:${chainId}`
        }
      } catch {
        // Fall through to default
      }
      return directoryKey
    }

    if (outputKey === "selector") {
      const resolved = chainIdService.resolve(directoryKey)
      if (resolved) {
        try {
          const supportedChain = directoryToSupportedChain(directoryKey)
          const chainId = getChainId(supportedChain)
          const { chainType } = getChainTypeAndFamily(supportedChain)
          if (chainId) {
            const selectorEntry = getSelectorEntry(chainId, chainType)
            if (selectorEntry) {
              return selectorEntry.selector
            }
          }
        } catch {
          // Fall through
        }
      }
      return directoryKey
    }

    // outputKey === "internalId"
    return chainIdService.format(directoryKey, internalIdFormat)
  }

  /**
   * Loads CCV config data for the specified environment
   */
  private loadCCVConfigData(environment: Environment): CCVConfigData {
    if (environment === Environment.Mainnet) {
      return ccvConfigMainnet as CCVConfigData
    }
    return ccvConfigTestnet as CCVConfigData
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
   * Builds custom finality configuration from minBlockConfirmation value
   *
   * @param minBlockConfirmation - The minimum block confirmation value, or null/undefined if unavailable
   * @returns CustomFinalityConfig object with hasCustomFinality and minBlockConfirmation
   */
  private buildCustomFinalityConfig(minBlockConfirmation: number | null | undefined): CustomFinalityConfig | null {
    // If minBlockConfirmation is undefined, we don't have rate limits data for this token/chain
    if (minBlockConfirmation === undefined) {
      return null
    }

    // If minBlockConfirmation is null, there was an issue with downstream API
    if (minBlockConfirmation === null) {
      return {
        hasCustomFinality: null,
        minBlockConfirmation: null,
      }
    }

    // hasCustomFinality is true if minBlockConfirmation > 0
    return {
      hasCustomFinality: minBlockConfirmation > 0,
      minBlockConfirmation,
    }
  }

  /**
   * Gets the request ID for this service instance
   */
  getRequestId(): string {
    return this.requestId
  }
}
