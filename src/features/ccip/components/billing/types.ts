import { SupportedChain } from "@config"
import { Environment, NetworkFeeStructure, SupportedTokenConfig, TokenMechanism, Version } from "@config/data/ccip"

export interface EnvironmentData {
  environments: Environment[]
}

export interface TokenDetails {
  [sourceChain: string]: Record<SupportedChain, Record<SupportedChain, SupportedTokenConfig>> | never[]
}

export interface TokenData {
  tokens: TokenDetails
}

export interface BlockchainData {
  blockchains: SupportedChain[]
}

export interface FeeDetails {
  token: string
  mechanism: TokenMechanism
  fee: NetworkFeeStructure
}

export interface FeeData {
  fees: FeeDetails
}

export type FetchDataReturn = EnvironmentData | TokenData | BlockchainData | FeeData | Record<string, never>

export interface FetchParams {
  environment: Environment
  version: Version
  token: string
  tokens: TokenDetails
  sourceBlockchain: SupportedChain
  destinationBlockchain: SupportedChain
}

export interface BlockchainTitle {
  title: string
  key: SupportedChain
}
