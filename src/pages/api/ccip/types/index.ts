// Chain Data API Types

import { Environment } from "@config/data/ccip/types.ts"

export { Environment }

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

export type ChainDetails = {
  chainId: number
  selector: string
  internalId: string
  displayName: string
  feeTokens: string[]
  router: string
  rmn: string
  registryModule: string
  tokenAdminRegistry: string
  tokenPoolFactory?: string
}

export type ChainFamily = {
  evm: Record<string, ChainDetails>
  // Future families: svm, mvm, etc.
}

export type ChainApiResponse = {
  metadata: ChainMetadata
  data: {
    evm: Record<string, ChainDetails>
  }
  ignored: ChainConfigError[]
}

export type OutputKeyType = "chainId" | "selector" | "internalId"

export type ChainApiError = {
  error: string
  message: string
}

export type FilterType = {
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

export type TokenChainInfo = {
  chainId: number
  chainName: string
  tokenAddress: string
  decimals: number
  poolType: string
  poolAddress: string
}

export type TokenDetails = {
  symbol: string
  lanes: Record<string, string[]> // sourceChain -> [destinationChains]
  chains: TokenChainInfo[]
}

export type TokenApiResponse = {
  metadata: TokenMetadata
  data: Record<string, TokenDetails>
  ignored: TokenConfigError[]
}

export interface TokenFilterType {
  token_id?: string
  chain_id?: string
}
