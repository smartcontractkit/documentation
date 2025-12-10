// Chain Data API Types

import { Environment } from "@config/data/ccip/types.ts"

export { Environment }

// Chain type and family declarations
export type ChainType = "evm" | "solana" | "aptos" | "sui"
export type ChainFamily = "evm" | "mvm" | "svm"

export const prerender = false

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

export type OutputKeyType = "chain_id" | "selector" | "internal_id"

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

// Token Detail API Types (for /tokens/{tokenCanonicalSymbol} endpoint)

/**
 * Extended token chain data with custom finality information
 */
export interface TokenDetailChainData extends TokenChainData {
  /** Whether custom finality is enabled (derived from minBlockConfirmation > 0) */
  hasCustomFinality: boolean | null
  /** Minimum block confirmations required, null if unavailable */
  minBlockConfirmation: number | null
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

// Token Finality API Types (for /tokens/{tokenCanonicalSymbol}/finality endpoint)

/**
 * Finality data for a token on a specific chain
 */
export interface TokenFinalityData {
  /** Whether custom finality is enabled (derived from minBlockConfirmation > 0) */
  hasCustomFinality: boolean | null
  /** Minimum block confirmations required, null if unavailable */
  minBlockConfirmation: number | null
}

/**
 * Token finality response data structure
 */
export type TokenFinalityDataResponse = {
  [chainKey: string]: TokenFinalityData
}

/**
 * Token finality API response format
 */
export interface TokenFinalityApiResponse {
  metadata: TokenDetailMetadata
  data: TokenFinalityDataResponse
}

/**
 * Token finality service response (internal)
 */
export interface TokenFinalityServiceResponse {
  data: TokenFinalityDataResponse
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
export type LaneInputKeyType = "chain_id" | "selector" | "internal_id"

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
 */
export interface RateLimiterDirections {
  in?: RateLimiterConfig
  out?: RateLimiterConfig
}

/**
 * Rate limiter entry can be directions data or null (unavailable)
 */
export type RateLimiterEntry = RateLimiterDirections | null

/**
 * Rate limits for a single token on a lane with both standard and custom (FTF) limits
 */
export interface TokenRateLimits {
  standard: RateLimiterEntry
  custom: RateLimiterEntry
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
  supportedTokens: Record<string, TokenRateLimits>
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
  data: Record<string, TokenRateLimits>
}

/**
 * Supported tokens service response (internal)
 */
export interface SupportedTokensServiceResponse {
  data: Record<string, TokenRateLimits> | null
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
 * Rate type for rate limits (standard or custom/FTF)
 */
export type RateLimitsType = "standard" | "custom"

/**
 * Source chain rate limits data with minBlockConfirmation and remote destinations
 */
export interface SourceChainRateLimitsData {
  minBlockConfirmation: number | null
  remote: Record<string, TokenRateLimits>
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
  data: Record<string, TokenRateLimits>
}

/**
 * Rate limits service response (internal)
 */
export interface RateLimitsServiceResponse {
  data: Record<string, TokenRateLimits>
  metadata: {
    tokenCount: number
  }
}

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
