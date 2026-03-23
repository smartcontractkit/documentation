// Chain Data API Types

import { Environment } from "@config/data/ccip/types.ts"
import type { ChainType, ChainFamily } from "@config/types.ts"

export { Environment }
export type { ChainType, ChainFamily }

export const prerender = false

// Naming convention for chain identifiers
// - 'directory': chains.json keys (e.g., "mainnet", "bsc-mainnet")
// - 'selector': selectors.yml names (e.g., "ethereum-mainnet", "binance_smart_chain-mainnet")
export type NamingConvention = "directory" | "selector"

// Search types
export type SearchType = "selector" | "chainId" | "internalId" | "displayName"

export interface SearchDetectionResult {
  type: SearchType
  normalizedQuery: string
}

/**
 * Enriched fee token information with address and metadata
 * Used when enrichFeeTokens=true query parameter is set
 */
export type FeeTokenEnriched = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export type ChainConfigError = {
  chainId: number
  networkId: string
  reason: string
  missingFields: string[]
}

export type ChainMetadata = {
  environment: Environment
  timestamp: string
  requestId: string
  ignoredChainCount: number
  validChainCount: number
  searchQuery?: string
  searchType?: SearchType
}

export interface ChainDetails {
  chainId: number | string
  displayName: string
  selector: string
  internalId: string
  feeTokens: string[] | FeeTokenEnriched[]
  router: string
  rmn: string
  chainType: ChainType
  chainFamily: ChainFamily
  supported: boolean
  registryModule?: string
  tokenAdminRegistry?: string
  tokenPoolFactory?: string
  feeQuoter?: string
  mcms?: string
}

export type ChainApiResponse = {
  metadata: ChainMetadata
  data: Record<string, Record<string, ChainDetails>>
  ignored: {
    chainId: number
    networkId: string
    reason: string
    missingFields: string[]
    chain_id?: string
  }[]
}

export type OutputKeyType = "chainId" | "selector" | "internalId"

export type ChainApiError = {
  error: string
  message: string
}

export interface FilterType {
  chainId?: string
  selector?: string
  internalId?: string
}

export type SelectorEntry = {
  selector: string
  name: string
}

export type SelectorsConfig = {
  selectors: Record<string, SelectorEntry>
}

// Token Data API Types

export type TokenConfigError = {
  symbol: string
  reason: string
  missingFields: string[]
}

export type TokenMetadata = {
  environment: Environment
  timestamp: string
  requestId: string
  ignoredTokenCount: number
  validTokenCount: number
}

export type TokenPool = {
  address: string
  rawType: string
  type: string
  version: string
  advancedPoolHooks?: string | null
}

export type TokenChainData = {
  chainId: number | string
  chainName: string
  decimals: number
  destinations: string[]
  name: string
  pool: TokenPool
  symbol: string
  tokenAddress: string
}

export type TokenDataResponse = {
  [key: string]: {
    [chainKey: string]: TokenChainData
  }
}

export type TokenServiceResponse = {
  tokens: TokenDataResponse
  errors: TokenConfigError[]
  metadata: {
    validTokenCount: number
    ignoredTokenCount: number
  }
}

export type TokenApiResponse = {
  metadata: TokenMetadata
  data: TokenDataResponse
  ignored: TokenConfigError[]
}

export interface TokenFilterType {
  token_id?: string
  chain_id?: string
}

/**
 * CCV (Cross-Chain Verifier) configuration for a pool
 * Only present for v2.0+ pools (check pool.supportsV2Features)
 * For v1.x pools, the entire ccvConfig field is null
 *
 * Values for thresholdAmount:
 * - "0": CCV not configured for this v2 pool
 * - "N" (positive number string): CCV configured with threshold N
 * - null: downstream API error fetching CCV config
 */
export interface CCVConfig {
  thresholdAmount: string | null
}

// Token Detail API Types (for /tokens/{tokenCanonicalSymbol} endpoint)

/**
 * Custom finality configuration (reused across token endpoints)
 */
export interface CustomFinalityConfig {
  /** Whether custom finality is enabled (derived from minBlockConfirmation > 0) */
  hasCustomFinality: boolean | null
  /** Minimum block confirmations required, null if unavailable */
  minBlockConfirmation: number | null
}

/**
 * Extended token chain data with custom finality and CCV information
 */
export interface TokenDetailChainData extends Omit<TokenChainData, "pool"> {
  /** Custom finality configuration for the token on this chain
   * - null: v1 pool (feature not supported)
   * - {hasCustomFinality: null, minBlockConfirmation: null}: v2 pool, downstream API error
   * - {hasCustomFinality: false, minBlockConfirmation: 0}: v2 pool, feature not used
   * - {hasCustomFinality: true, minBlockConfirmation: N}: v2 pool, feature enabled
   */
  customFinality: CustomFinalityConfig | null
  /** CCV (Cross-Chain Verifier) configuration for the pool
   * - null: v1 pool (feature not supported, check pool.supportsV2Features)
   * - {thresholdAmount: "0"}: v2 pool, CCV not configured
   * - {thresholdAmount: null}: v2 pool, downstream API error
   * - {thresholdAmount: "N"}: v2 pool, CCV configured with threshold N
   */
  ccvConfig: CCVConfig | null
  /** Pool information including version, hooks, and v2 feature support flag */
  pool: {
    address: string
    rawType: string
    type: string
    version: string
    advancedPoolHooks: string | null
    /** Whether this pool supports v2 features (customFinality, ccvConfig).
     * When true and customFinality/ccvConfig fields have null values inside,
     * it indicates a downstream API error rather than feature not supported. */
    supportsV2Features: boolean
  } | null
}

/**
 * Token detail response data structure
 */
export type TokenDetailDataResponse = {
  [chainKey: string]: TokenDetailChainData
}

/**
 * Metadata for token detail API responses
 */
export interface TokenDetailMetadata {
  environment: Environment
  timestamp: string
  requestId: string
  tokenSymbol: string
  chainCount: number
}

/**
 * Token detail API response format
 */
export interface TokenDetailApiResponse {
  metadata: TokenDetailMetadata
  data: TokenDetailDataResponse
}

/**
 * Token detail service response (internal)
 */
export interface TokenDetailServiceResponse {
  data: TokenDetailDataResponse
  metadata: {
    chainCount: number
  }
}

// Lane Data API Types

export type LaneConfigError = {
  sourceChain: string
  destinationChain: string
  reason: string
  missingFields: string[]
}

export type LaneMetadata = {
  environment: Environment
  timestamp: string
  requestId: string
  ignoredLaneCount: number
  validLaneCount: number
}

// Internal interface with chainType and chainFamily for processing
export interface ChainInfoInternal {
  chainId: number | string
  displayName: string
  selector: string
  internalId: string
  chainType: ChainType
  chainFamily: ChainFamily
}

// Public interface for API responses without chainType and chainFamily
export interface ChainInfo {
  chainId: number | string
  displayName: string
  selector: string
  internalId: string
}

export interface LaneDetails {
  sourceChain: ChainInfo
  destinationChain: ChainInfo
  onRamp: {
    address: string
    version: string
    enforceOutOfOrder?: boolean
  }
  offRamp: {
    address: string
    version: string
  }
  supportedTokens: string[]
}

export type LaneDataResponse = Record<string, LaneDetails>

export type LaneServiceResponse = {
  data: LaneDataResponse
  errors: LaneConfigError[]
  metadata: {
    validLaneCount: number
    ignoredLaneCount: number
  }
}

export type LaneApiResponse = {
  metadata: LaneMetadata
  data: LaneDataResponse
  ignored: LaneConfigError[]
}

export interface LaneFilterType {
  sourceChainId?: string
  destinationChainId?: string
  sourceSelector?: string
  destinationSelector?: string
  sourceInternalId?: string
  destinationInternalId?: string
  version?: string
}

// Lane Detail API Types (for /lanes/by-{type}/{source}/{destination} endpoints)

/**
 * Input key type for lane path parameters
 */
export type LaneInputKeyType = "chainId" | "selector" | "internalId"

/**
 * Metadata for single lane detail API responses
 */
export interface LaneDetailMetadata {
  environment: Environment
  timestamp: string
  requestId: string
  sourceChain: string
  destinationChain: string
}

// Rate Limits API Types

/**
 * Rate limiter configuration for a single direction (in or out)
 */
export interface RateLimiterConfig {
  capacity: string
  isEnabled: boolean
  rate: string
}

/**
 * Rate limiter directions (in and/or out)
 * - { in: {...}, out: {...} } = rate limits configured and available
 * - { in: null, out: null } = downstream API error (v1 or v2 pool)
 */
export interface RateLimiterDirections {
  in?: RateLimiterConfig | null
  out?: RateLimiterConfig | null
}

/**
 * Rate limiter entry can be directions data or null (not configured)
 * - null = rate limits not configured for this type (standard/custom)
 * - { in: null, out: null } = downstream API error
 * - { in: {...}, out: {...} } = rate limits available
 */
export type RateLimiterEntry = RateLimiterDirections | null

/**
 * Transfer fees for a token on a lane in basis points
 */
export interface TokenFees {
  standardTransferFeeBps: number
  customTransferFeeBps: number
}

/**
 * Raw rate limits from mock data (fees may not be present)
 */
export interface RawTokenRateLimits {
  standard: RateLimiterEntry
  custom: RateLimiterEntry
  fees?: TokenFees
}

/**
 * Rate limits for a single token on a lane with both standard and custom limits
 * Each entry contains directional (in/out) rate limit configurations
 */
export interface TokenRateLimits {
  standard: RateLimiterEntry
  custom: RateLimiterEntry
}

/**
 * Combined rate limits and fees for a token on a lane
 * Used in API responses that return both rate limits and transfer fees
 */
export interface TokenLaneData {
  rateLimits: TokenRateLimits
  fees: TokenFees | null
}

/**
 * Lane details with rate limits included in supportedTokens
 * Used for single lane detail endpoints that merge rate limits
 */
export interface LaneDetailWithRateLimits {
  sourceChain: ChainInfo
  destinationChain: ChainInfo
  onRamp: {
    address: string
    version: string
    enforceOutOfOrder?: boolean
  }
  offRamp: {
    address: string
    version: string
  }
  supportedTokens: Record<string, TokenLaneData>
}

/**
 * Single lane detail API response format (with rate limits)
 */
export interface LaneDetailApiResponse {
  metadata: LaneDetailMetadata
  data: LaneDetailWithRateLimits
}

/**
 * Lane detail service response (internal)
 */
export interface LaneDetailServiceResponse {
  data: LaneDetailWithRateLimits | null
}

// Supported Tokens API Types (for /lanes/by-{type}/{source}/{destination}/supported-tokens endpoints)

/**
 * Metadata for supported tokens API responses
 */
export interface SupportedTokensMetadata {
  environment: Environment
  timestamp: string
  requestId: string
  sourceChain: string
  destinationChain: string
  tokenCount: number
}

/**
 * Supported tokens API response format
 */
export interface SupportedTokensApiResponse {
  metadata: SupportedTokensMetadata
  data: Record<string, TokenLaneData>
}

/**
 * Supported tokens service response (internal)
 */
export interface SupportedTokensServiceResponse {
  data: Record<string, TokenLaneData> | null
  tokenCount: number
}

/**
 * Type guard to check if a RateLimiterEntry is unavailable (null)
 */
export function isRateLimiterUnavailable(entry: RateLimiterEntry): entry is null {
  return entry === null
}

/**
 * Metadata for rate limits API responses
 */
export interface RateLimitsMetadata {
  environment: Environment
  timestamp: string
  requestId: string
  sourceChain: string
  destinationChain: string
  tokenCount: number
}

/**
 * Filter parameters for rate limits queries (query-based - deprecated)
 */
export interface RateLimitsFilterType {
  sourceInternalId: string
  destinationInternalId: string
  tokens?: string
  direction?: "in" | "out"
  rateType?: "standard" | "custom"
}

/**
 * Filter parameters for lane rate limits queries (path-based)
 * Source and destination come from URL path parameters
 */
export interface LaneRateLimitsFilterType {
  tokens?: string
  direction?: "in" | "out"
  rateType?: "standard" | "custom"
}

/**
 * Direction type for rate limits
 */
export type RateLimitsDirection = "in" | "out"

/**
 * Rate type for rate limits (standard or custom)
 */
export type RateLimitsType = "standard" | "custom"

/**
 * Source chain rate limits data with minBlockConfirmation and remote destinations
 * Uses RawTokenRateLimits since fees may not be present in mock data
 */
export interface SourceChainRateLimitsData {
  minBlockConfirmation: number | null
  remote: Record<string, RawTokenRateLimits>
}

/**
 * Rate limits data structure in the mock JSON files
 * Token -> SourceChain -> { minBlockConfirmation?, remote: { DestChain -> { standard, custom } } }
 */
export type RateLimitsData = Record<string, Record<string, SourceChainRateLimitsData>>

/**
 * Rate limits API response format
 */
export interface RateLimitsApiResponse {
  metadata: RateLimitsMetadata
  data: Record<string, TokenLaneData>
}

/**
 * Rate limits service response (internal)
 */
export interface RateLimitsServiceResponse {
  data: Record<string, TokenLaneData>
  metadata: {
    tokenCount: number
  }
}

// Token Directory API Types (for /tokens/{symbol}/chains/{chain} endpoint)

/**
 * Verifiers configuration for a lane with pre-computed sets for different transfer amounts
 * Only present for v2.0+ pools (check pool.supportsV2Features)
 * For v1.x pools, the entire verifiers field is null
 *
 * Values for belowThreshold/aboveThreshold:
 * - []: No verifiers configured for this lane
 * - [addr1, addr2, ...]: Verifiers configured
 * - null: Downstream API error fetching verifiers
 *
 * Usage:
 * - belowThreshold: Verifiers used when transfer amount is below the threshold
 * - aboveThreshold: Verifiers used when transfer amount is at or above the threshold
 *   (includes all belowThreshold verifiers plus additional threshold verifiers)
 */
export interface LaneVerifiers {
  belowThreshold: string[] | null
  aboveThreshold: string[] | null
}

/**
 * Lane data in token directory response
 *
 * Use pool.supportsV2Features to interpret verifiers:
 * - pool.supportsV2Features=false + verifiers=null → v1.x pool, feature not supported
 * - pool.supportsV2Features=true + verifiers={belowThreshold: null, aboveThreshold: null} → downstream API error
 * - pool.supportsV2Features=true + verifiers={belowThreshold: [], aboveThreshold: []} → not configured
 * - pool.supportsV2Features=true + verifiers={belowThreshold: [...], aboveThreshold: [...]} → configured
 */
export interface TokenDirectoryLane {
  internalId: string
  chainId: number | string
  selector: string
  rateLimits: TokenRateLimits
  fees: TokenFees | null
  verifiers: LaneVerifiers | null
}

/**
 * Token info in directory response
 */
export interface TokenDirectoryTokenInfo {
  address: string
  decimals: number
}

/**
 * Pool info in directory response
 */
export interface TokenDirectoryPoolInfo {
  address: string
  rawType: string
  type: string
  version: string
  advancedPoolHooks: string | null
  /** Whether this pool supports v2 features (customFinality, ccvConfig).
   * When true and customFinality/ccvConfig fields have null values inside,
   * it indicates a downstream API error rather than feature not supported. */
  supportsV2Features: boolean
}

/**
 * Token directory data for a specific chain
 */
export interface TokenDirectoryData {
  internalId: string
  chainId: number | string
  selector: string
  token: TokenDirectoryTokenInfo
  pool: TokenDirectoryPoolInfo
  ccvConfig: CCVConfig | null
  customFinality: CustomFinalityConfig | null
  outboundLanes: Record<string, TokenDirectoryLane>
  inboundLanes: Record<string, TokenDirectoryLane>
}

/**
 * Metadata for token directory API responses
 */
export interface TokenDirectoryMetadata {
  environment: Environment
  timestamp: string
  requestId: string
  symbol: string
  sourceChain: string
}

/**
 * Token directory API response format
 */
export interface TokenDirectoryApiResponse {
  metadata: TokenDirectoryMetadata
  data: TokenDirectoryData
}

/**
 * Token directory service response (internal)
 */
export interface TokenDirectoryServiceResponse {
  data: TokenDirectoryData | null
}

/**
 * CCV config data structure in mock JSON files
 * Token -> SourceChain (directory key) -> { thresholdAmount, outboundCCVs, inboundCCVs }
 *
 * Values for base/threshold arrays:
 * - []: No verifiers configured
 * - [addr1, ...]: Verifiers configured
 * - null: Downstream API error fetching verifiers
 */
export interface CCVLaneConfig {
  base: string[] | null
  threshold: string[] | null
}

export interface CCVChainConfig {
  thresholdAmount: string
  outboundCCVs: Record<string, CCVLaneConfig>
  inboundCCVs: Record<string, CCVLaneConfig>
}

export type CCVConfigData = Record<string, Record<string, CCVChainConfig>>

// Faucet API Types
export type {
  FaucetChainConfig,
  ChallengeParams,
  ChallengeResponse,
  VerifyRequest,
  VerifyResponse,
  VerifySignatureArgs,
  FamilyAdapter,
  FaucetApiResponse,
  FaucetError,
} from "./faucet.ts"
