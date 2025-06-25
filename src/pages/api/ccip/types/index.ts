// Chain Data API Types

import { Environment } from "@config/data/ccip/types.ts"

export { Environment }

// Chain type and family declarations
export type ChainType = "evm" | "solana" | "aptos" | "sui"
export type ChainFamily = "evm" | "mvm" | "svm"

export const prerender = false

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
  feeTokens: string[]
  router: string
  rmn: string
  chainType: ChainType
  chainFamily: ChainFamily
  registryModule?: string
  tokenAdminRegistry?: string
  tokenPoolFactory?: string
  feeQuoter?: string
  rmnPermeable?: boolean
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
