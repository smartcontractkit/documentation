// Chain Data API Types

import { Environment } from "@config/data/ccip/types.ts"
import type { ChainType, ChainFamily } from "@config/types.ts"

export { Environment }
export type { ChainType, ChainFamily }

export const prerender = false

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

export type TokenChainData = {
  chainId: number | string
  chainName: string
  decimals: number
  destinations: string[]
  name: string
  poolAddress: string
  poolType: string
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
