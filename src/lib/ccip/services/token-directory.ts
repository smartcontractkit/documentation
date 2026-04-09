import {
  Environment,
  TokenDirectoryData,
  TokenDirectoryLane,
  TokenDirectoryServiceResponse,
  CCVConfigData,
  CCVChainConfig,
  LaneVerifiers,
  TokenRateLimits,
  NamingConvention,
  OutputKeyType,
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

import pLimit from "p-limit"
import {
  fetchPoolDataForToken,
  fetchLaneRateLimits,
  fetchMinBlockConfirmations,
  stubCCVConfigData,
} from "~/lib/ccip/graphql/services/enrichment-data-service.ts"

const GRAPHQL_CONCURRENCY = 10

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

      // Get selector name for later use
      const selectorName = resolved.selectorName

      // Get chain info
      const chainInfo = this.resolveChainInfo(directoryKey, chainConfig)
      if (!chainInfo) {
        return { data: null }
      }

      // Check if this pool supports CCV features (v2.0+ only)
      const actualPoolVersion = poolInfo.version || ""
      const isCCVEnabled = await shouldEnableCCVFeatures(environment, tokenSymbol, directoryKey, actualPoolVersion)

      // Load CCV config (only used for v2.0+ pools)
      const ccvConfigData = this.loadCCVConfigData()
      const ccvConfig = isCCVEnabled ? ccvConfigData[tokenSymbol]?.[directoryKey] || null : null

      // Get outbound lanes (from this chain to others)
      const outboundLanes = await this.getOutboundLanes(
        environment,
        directoryKey,
        selectorName,
        tokenSymbol,
        lanesReferenceData,
        chainsReferenceData as Record<string, ChainConfig>,
        ccvConfig,
        outputKey,
        internalIdFormat,
        chainIdService,
        isCCVEnabled
      )

      // Get inbound lanes (from others to this chain)
      const inboundLanes = await this.getInboundLanes(
        environment,
        directoryKey,
        selectorName,
        tokenSymbol,
        lanesReferenceData,
        chainsReferenceData as Record<string, ChainConfig>,
        ccvConfig,
        outputKey,
        internalIdFormat,
        chainIdService,
        isCCVEnabled
      )

      // Format output based on outputKey and internalIdFormat
      const formattedInternalId = chainIdService.format(directoryKey, internalIdFormat)

      // Build custom finality config (v2.0+ pools only)
      let customFinality: CustomFinalityConfig | null = null
      if (isCCVEnabled) {
        const minBlockConfirmation = await fetchMinBlockConfirmations(environment, tokenSymbol, directoryKey)
        customFinality = this.buildCustomFinalityConfig(minBlockConfirmation)
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
          address: poolInfo.address,
          rawType: poolInfo.rawType,
          type: poolInfo.type,
          version: await getEffectivePoolVersion(environment, tokenSymbol, directoryKey, poolInfo.version || ""),
          advancedPoolHooks: null,
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
  private async getOutboundLanes(
    environment: Environment,
    sourceDirectoryKey: string,
    sourceSelectorName: string,
    tokenSymbol: string,
    lanesReferenceData: Record<string, Record<string, LaneConfig>>,
    chainsReferenceData: Record<string, ChainConfig>,
    ccvConfig: CCVChainConfig | null,
    outputKey: OutputKeyType,
    internalIdFormat: NamingConvention,
    chainIdService: ChainIdentifierService,
    isCCVEnabled: boolean
  ): Promise<Record<string, TokenDirectoryLane>> {
    const result: Record<string, TokenDirectoryLane> = {}

    // Get lanes from this source chain
    const sourceLanes = lanesReferenceData[sourceDirectoryKey]
    if (!sourceLanes) {
      return result
    }

    // Collect lanes to process, then fetch rate limits concurrently
    const lanesToProcess: Array<{
      destDirectoryKey: string
      destChainInfo: { chainId: string | number; selector: string }
      laneKey: string
      verifiers: LaneVerifiers | null
      outputLaneKey: string
      formattedInternalId: string
    }> = []

    for (const [destDirectoryKey, laneConfig] of Object.entries(sourceLanes)) {
      if (!laneConfig.supportedTokens?.includes(tokenSymbol)) continue

      const destChainConfig = chainsReferenceData[destDirectoryKey]
      if (!destChainConfig) continue

      const destChainInfo = this.resolveChainInfo(destDirectoryKey, destChainConfig)
      if (!destChainInfo) continue

      const destResolved = chainIdService.resolve(destDirectoryKey)
      const destSelectorName = destResolved?.selectorName || destDirectoryKey
      const laneKey = this.buildLaneSelectorKey(sourceSelectorName, destSelectorName)
      const verifiers = this.getVerifiersForLane(ccvConfig, laneKey, "outbound", isCCVEnabled)
      const outputLaneKey = this.formatLaneKey(destDirectoryKey, outputKey, internalIdFormat, chainIdService)
      const formattedInternalId = chainIdService.format(destDirectoryKey, internalIdFormat)

      lanesToProcess.push({ destDirectoryKey, destChainInfo, laneKey, verifiers, outputLaneKey, formattedInternalId })
    }

    // Fetch rate limits concurrently with concurrency limit
    const limit = pLimit(GRAPHQL_CONCURRENCY)
    const laneResults = await Promise.allSettled(
      lanesToProcess.map((lane) =>
        limit(async () => ({
          ...lane,
          rateLimits: await fetchLaneRateLimits(environment, tokenSymbol, sourceDirectoryKey, lane.destDirectoryKey),
        }))
      )
    )

    for (const settled of laneResults) {
      if (settled.status !== "fulfilled") continue
      const lane = settled.value
      result[lane.outputLaneKey] = {
        internalId: lane.formattedInternalId,
        chainId: lane.destChainInfo.chainId,
        selector: lane.destChainInfo.selector,
        rateLimits: {
          standard: lane.rateLimits?.standard ?? null,
          custom: lane.rateLimits?.custom ?? null,
        },
        fees: null,
        verifiers: lane.verifiers,
      }
    }

    return result
  }

  /**
   * Gets inbound lanes for the token to this chain
   */
  private async getInboundLanes(
    environment: Environment,
    destDirectoryKey: string,
    destSelectorName: string,
    tokenSymbol: string,
    lanesReferenceData: Record<string, Record<string, LaneConfig>>,
    chainsReferenceData: Record<string, ChainConfig>,
    ccvConfig: CCVChainConfig | null,
    outputKey: OutputKeyType,
    internalIdFormat: NamingConvention,
    chainIdService: ChainIdentifierService,
    isCCVEnabled: boolean
  ): Promise<Record<string, TokenDirectoryLane>> {
    const result: Record<string, TokenDirectoryLane> = {}

    // Collect inbound lanes to process
    const lanesToProcess: Array<{
      sourceDirectoryKey: string
      sourceChainInfo: { chainId: string | number; selector: string }
      laneKey: string
      verifiers: LaneVerifiers | null
      outputLaneKey: string
      formattedInternalId: string
    }> = []

    for (const [sourceDirectoryKey, sourceLanes] of Object.entries(lanesReferenceData)) {
      const laneConfig = sourceLanes[destDirectoryKey]
      if (!laneConfig) continue
      if (!laneConfig.supportedTokens?.includes(tokenSymbol)) continue

      const sourceChainConfig = chainsReferenceData[sourceDirectoryKey]
      if (!sourceChainConfig) continue

      const sourceChainInfo = this.resolveChainInfo(sourceDirectoryKey, sourceChainConfig)
      if (!sourceChainInfo) continue

      const sourceResolved = chainIdService.resolve(sourceDirectoryKey)
      const sourceSelectorName = sourceResolved?.selectorName || sourceDirectoryKey
      const laneKey = this.buildLaneSelectorKey(sourceSelectorName, destSelectorName)
      const verifiers = this.getVerifiersForLane(ccvConfig, laneKey, "inbound", isCCVEnabled)
      const outputLaneKey = this.formatLaneKey(sourceDirectoryKey, outputKey, internalIdFormat, chainIdService)
      const formattedInternalId = chainIdService.format(sourceDirectoryKey, internalIdFormat)

      lanesToProcess.push({
        sourceDirectoryKey,
        sourceChainInfo,
        laneKey,
        verifiers,
        outputLaneKey,
        formattedInternalId,
      })
    }

    // Fetch rate limits concurrently with concurrency limit
    const limit = pLimit(GRAPHQL_CONCURRENCY)
    const laneResults = await Promise.allSettled(
      lanesToProcess.map((lane) =>
        limit(async () => ({
          ...lane,
          rateLimits: await fetchLaneRateLimits(environment, tokenSymbol, lane.sourceDirectoryKey, destDirectoryKey),
        }))
      )
    )

    for (const settled of laneResults) {
      if (settled.status !== "fulfilled") continue
      const lane = settled.value
      result[lane.outputLaneKey] = {
        internalId: lane.formattedInternalId,
        chainId: lane.sourceChainInfo.chainId,
        selector: lane.sourceChainInfo.selector,
        rateLimits: {
          standard: lane.rateLimits?.standard ?? null,
          custom: lane.rateLimits?.custom ?? null,
        },
        fees: null,
        verifiers: lane.verifiers,
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
   * Loads CCV config data (stubbed — not yet available in GraphQL)
   */

  private loadCCVConfigData(): CCVConfigData {
    return stubCCVConfigData()
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
