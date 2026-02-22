import { ExplorerInfo, ChainType } from "~/config/types.ts"

export type RateLimiterConfig = {
  capacity: string
  isEnabled: boolean
  rate: string
}

export type SupportedTokenConfig = {
  rateLimiterConfig?: {
    in?: RateLimiterConfig
    out?: RateLimiterConfig
  }
}
export type SupportedTokensConfig = {
  [token: string]: SupportedTokenConfig
}

export type LaneConfig = {
  supportedTokens?: string[]
  rateLimiterConfig?: RateLimiterConfig
  onRamp: {
    address: string
    version: string
    enforceOutOfOrder?: boolean
  }
  offRamp: {
    address: string
    version: string
  }
}

export type DestinationsLaneConfig = {
  [destinationChain: string]: LaneConfig
}

/** Normalized pool type (semantic). Used for logic, display, token mechanism. */
export type PoolType = "lockRelease" | "burnMint" | "usdc" | "feeTokenOnly"

/** Raw pool type from downstream data; displayed as-is in the directory. */
export type PoolRawType = string

type Pool = {
  address?: string
  rawType: string
  type: PoolType
  version: string
  advancedPoolHooks?: string
}

type PoolInfo = {
  tokenAddress: string
  allowListEnabled: boolean
  pool: Pool
  name?: string
  symbol: string
  decimals: number
}

export type ChainConfig = {
  feeTokens: string[]
  chainSelector: string
  router: {
    address: string
    version: string
  }
  armProxy: {
    address: string
    version: string
  }
  registryModule?: {
    address: string
    version: string
  }
  tokenAdminRegistry?: {
    address: string
    version: string
  }
  tokenPoolFactory?: {
    address: string
    version: string
  }
  feeQuoter?: string
  nativeToken?: {
    name: string
    symbol: string
    logo: string
  }
  mcms?: {
    address: string
  }
  poolPrograms?: {
    BurnMintTokenPool?: string
    LockReleaseTokenPool?: string
    CCTPTokenPool?: string
  }
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

export enum TokenMechanism {
  LockAndMint = "Lock & Mint",
  BurnAndUnlock = "Burn & Unlock",
  LockAndUnlock = "Lock & Unlock",
  BurnAndMint = "Burn & Mint",
  NoPoolSourceChain = "No pool on source blockchain",
  NoPoolDestinationChain = "No pool on destination blockchain",
  NoPoolsOnBothChains = "No pools on both blockchains",
  Unsupported = "Unsupported pool mechanism",
}

export type NetworkFeeStructure = {
  gasTokenFee: string
  linkFee: string
}

export type LaneSpecificFees = {
  fromToEthereum?: NetworkFeeStructure
  fromEthereum?: NetworkFeeStructure
  toEthereum?: NetworkFeeStructure
  nonEthereum?: NetworkFeeStructure
  allLanes?: NetworkFeeStructure
}

export type LaneSpecificFeeKey = keyof LaneSpecificFees

export type TokenTransfersNetworkFees = {
  [key in TokenMechanism]: LaneSpecificFees
}

export type MessagingNetworkFees = LaneSpecificFees

export type NetworkFees = {
  tokenTransfers: TokenTransfersNetworkFees
  messaging: MessagingNetworkFees
}

export enum Environment {
  // Standard environments for all VM types
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum LaneFilter {
  Inbound = "inbound",
  Outbound = "outbound",
}

export enum Version {
  V1_2_0 = "1.2.0",
}

export interface CCIPSendErrorEntry {
  error: string
  parameters?: Array<{
    type: string
    name: string
  }>
  errorSelector?: string
  description: string
}

export interface CCIPEventEntry {
  event: string
  parameters?: Array<{
    type: string
    name: string
    indexed: boolean
    typeLink?: string
  }>
  description: string
}

export enum LaneStatus {
  OPERATIONAL = "OPERATIONAL",
  MAINTENANCE = "MAINTENANCE",
  DEGRADED = "DEGRADED",
  CURSED = "CURSED",
}

export interface Network {
  name: string
  chain: string
  chainSelector: string
  logo: string
  totalLanes: number
  totalTokens: number
  key: string
  chainType: ChainType
  tokenAdminRegistry?: string
  explorer: ExplorerInfo
  registryModule?: string
  router?: {
    address: string
    version: string
  }
  feeTokens?: {
    name: string
    logo: string
  }[]
  nativeToken?: {
    name: string
    symbol: string
    logo: string
  }
  armProxy: {
    address: string
    version: string
  }
  routerExplorerUrl: string
  feeQuoter?: string
  mcms?: string
  poolPrograms?: {
    BurnMintTokenPool?: string
    LockReleaseTokenPool?: string
    CCTPTokenPool?: string
  }
}

export type DecomConfig = {
  [chainName: string]: {
    chainSelector: string
  }
}

export interface DecommissionedNetwork {
  name: string
  chain: string
  chainSelector: string
  logo: string
  explorer: ExplorerInfo
  chainType: ChainType
}

// Verifier types
export type VerifierType = "committee" | "api"

export interface VerifierMetadata {
  id: string
  name: string
  type: VerifierType
}

export interface VerifiersConfig {
  [networkId: string]: {
    [address: string]: VerifierMetadata
  }
}

export interface Verifier extends VerifierMetadata {
  network: string
  address: string
  logo: string
}
