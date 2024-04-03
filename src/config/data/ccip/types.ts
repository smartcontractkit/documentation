type RateLimiterConfig = {
  capacity: string
  isEnabled: boolean
  rate: string
}

type SupportedTokenConfig = {
  [token: string]: {
    rateLimiterConfig: RateLimiterConfig
  }
}

export type LaneConfig = {
  supportedTokens?: SupportedTokenConfig
  rateLimiterConfig: RateLimiterConfig
  onRamp: string
}

export type DestinationsLaneConfig = {
  [destinationChain: string]: LaneConfig
}

export type PoolType = "lockRelease" | "burnMint" | "usdc"

type PoolInfo = {
  tokenAddress: string
  allowListEnabled: boolean
  poolAddress?: string
  poolType?: PoolType
  name?: string
  symbol: string
  decimals: number
}

export type ChainConfig = {
  feeTokens: string[]
  chainSelector: string
  router: string
}

export type ChainsConfig = {
  [chain: string]: ChainConfig
}

export type LanesConfig = {
  [sourceChain: string]: DestinationsLaneConfig
}

export type TokensConfig = {
  [token: string]: {
    [chain: string]: PoolInfo
  }
}

export enum Environment {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum Version {
  V1_2_0 = "1.2.0",
}
