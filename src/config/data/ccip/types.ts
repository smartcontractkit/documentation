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
}

export type DestinationsLaneConfig = {
  [destinationChain: string]: LaneConfig
}

enum PoolType {
  LockRelease = "lockRelease",
  BurnMint = "burnMint",
}

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
  [token: string]: PoolInfo
}

export enum Environment {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum Version {
  V1_0_0 = "1.0.0",
  V1_2_0 = "1.2.0",
}
