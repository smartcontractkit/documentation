import { ChainsConfig, LanesConfig, TokensConfig, Environment, Version } from "./types"

// For mainnet
import chainsMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/chains.json"
import lanesMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/lanes.json"
import tokensMainnetv120 from "@config/data/ccip/v1_2_0/mainnet/tokens.json"

import chainsMainnetv100 from "@config/data/ccip/v1_0_0/mainnet/chains.json"
import lanesMainnetv100 from "@config/data/ccip/v1_0_0/mainnet/lanes.json"
import tokensMainnetv100 from "@config/data/ccip/v1_0_0/mainnet/tokens.json"

// For testnet

import chainsTestnetv120 from "@config/data/ccip/v1_2_0/testnet/chains.json"
import lanesTestnetv120 from "@config/data/ccip/v1_2_0/testnet/lanes.json"
import tokensTestnetv120 from "@config/data/ccip/v1_2_0/testnet/tokens.json"

import chainsTestnetv100 from "@config/data/ccip/v1_0_0/testnet/chains.json"
import lanesTestnetv100 from "@config/data/ccip/v1_0_0/testnet/lanes.json"
import tokensTestnetv100 from "@config/data/ccip/v1_0_0/testnet/tokens.json"
import { SupportedChain } from "@config/types"
import { supportedChainToChainInRdd } from "@features/utils"

export const loadReferenceData = ({ environment, version }: { environment: Environment; version: Version }) => {
  let chainsReferenceData: ChainsConfig
  let lanesReferenceData: LanesConfig
  let tokensReferenceData: TokensConfig

  if (environment === Environment.Mainnet && version === Version.V1_2_0) {
    chainsReferenceData = chainsMainnetv120 as unknown as ChainsConfig
    lanesReferenceData = lanesMainnetv120 as unknown as LanesConfig
    tokensReferenceData = tokensMainnetv120 as unknown as TokensConfig
  } else if (environment === Environment.Mainnet && version === Version.V1_0_0) {
    chainsReferenceData = chainsMainnetv100 as unknown as ChainsConfig
    lanesReferenceData = lanesMainnetv100 as unknown as LanesConfig
    tokensReferenceData = tokensMainnetv100 as unknown as TokensConfig
  } else if (environment === Environment.Testnet && version === Version.V1_2_0) {
    chainsReferenceData = chainsTestnetv120 as unknown as ChainsConfig
    lanesReferenceData = lanesTestnetv120 as unknown as LanesConfig
    tokensReferenceData = tokensTestnetv120 as unknown as TokensConfig
  } else if (environment === Environment.Testnet && version === Version.V1_0_0) {
    chainsReferenceData = chainsTestnetv100 as unknown as ChainsConfig
    lanesReferenceData = lanesTestnetv100 as unknown as LanesConfig
    tokensReferenceData = tokensTestnetv100 as unknown as TokensConfig
  } else {
    throw new Error(`Invalid environment/version combination: ${environment}/${version}`)
  }

  return { chainsReferenceData, lanesReferenceData, tokensReferenceData }
}

export const getAllChains = ({
  mainnetVersion,
  testnetVersion,
}: {
  mainnetVersion: Version
  testnetVersion: Version
}) => {
  let chainsMainnetKeys: string[] = []
  let chainsTestnetKeys: string[] = []

  switch (mainnetVersion) {
    case Version.V1_2_0:
      chainsMainnetKeys = Object.keys(chainsMainnetv120)
      break
    case Version.V1_0_0:
      chainsMainnetKeys = Object.keys(chainsMainnetv100)
      break
    default:
      throw new Error(`Invalid mainnet version: ${mainnetVersion}`)
  }

  switch (testnetVersion) {
    case Version.V1_0_0:
      chainsTestnetKeys = Object.keys(chainsTestnetv100)
      break
    case Version.V1_2_0:
      chainsTestnetKeys = Object.keys(chainsTestnetv120)
      break
    default:
      throw new Error(`Invalid testnet version: ${testnetVersion}`)
  }

  return [...chainsMainnetKeys, ...chainsTestnetKeys]
}

const CCIPTokenImage =
  "https://images.prismic.io/data-chain-link/86d5bc29-7511-49f5-bbd8-18a8ebc008b0_ccip-icon-white.png?auto=compress,format"

const isBnMRdd = ({ chainRdd, version }: { chainRdd: string; version: Version }) => {
  let tokensTestData

  switch (version) {
    case Version.V1_0_0:
      tokensTestData = tokensTestnetv100["CCIP-BnM"]
      break
    case Version.V1_2_0:
      tokensTestData = tokensTestnetv120["CCIP-BnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  return tokensTestData[chainRdd]
}

export const isBnM = ({ chain, version }: { chain: SupportedChain; version: Version }) => {
  const chainRdd = supportedChainToChainInRdd(chain)
  return isBnMRdd({ chainRdd, version })
}

export const isLnMRdd = ({ chainRdd, version }: { chainRdd: string; version: Version }) => {
  let tokensTestData
  const supportedChainForLock: SupportedChain = "ETHEREUM_SEPOLIA"
  switch (version) {
    case Version.V1_0_0:
      tokensTestData = tokensTestnetv100["CCIP-LnM"]
      break
    case Version.V1_2_0:
      tokensTestData = tokensTestnetv120["CCIP-LnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  return {
    supported: tokensTestData[chainRdd],
    supportedChainForLock,
  }
}

export const isLnM = ({ chain, version }: { chain: SupportedChain; version: Version }) => {
  const chainRdd = supportedChainToChainInRdd(chain)
  return isLnMRdd({ chainRdd, version })
}

export const isBnMOrLnMRdd = ({ chainRdd, version }: { chainRdd: string; version: Version }) => {
  return isBnMRdd({ chainRdd, version }) || isLnMRdd({ chainRdd, version }).supported
}

export const isBnMOrLnM = ({ chain, version }: { chain: SupportedChain; version: Version }) => {
  return isBnM({ chain, version }) || isLnM({ chain, version })
}

export const getBnMParams = ({ supportedChain, version }: { supportedChain: SupportedChain; version: Version }) => {
  const supportedChainRdd = supportedChainToChainInRdd(supportedChain)

  let chainsTestData
  let tokensTestData
  switch (version) {
    case Version.V1_0_0:
      chainsTestData = chainsTestnetv100
      tokensTestData = tokensTestnetv100["CCIP-BnM"]
      break
    case Version.V1_2_0:
      chainsTestData = chainsTestnetv120
      tokensTestData = tokensTestnetv120["CCIP-BnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  if (!(supportedChainRdd in chainsTestData)) return undefined // No BnM for mainnets
  const token = tokensTestData[supportedChainRdd]
  if (!token || Object.keys(token).length === 0) {
    console.warn(`No BnM found for testnet ${supportedChain}`)
    return undefined
  }

  const {
    tokenAddress: address,
    symbol,
    decimals,
  } = token as { tokenAddress: string; symbol: string; decimals: number }
  if (!address || !symbol || !decimals) {
    console.error(`Token data not correct for BnM token on ${supportedChain}`)
    return undefined
  }
  return {
    type: "ERC20",
    options: {
      address,
      symbol,
      decimals,
      image: CCIPTokenImage,
    },
  }
}

export const getLnMParams = ({ supportedChain, version }: { supportedChain: SupportedChain; version: Version }) => {
  const supportedChainRdd = supportedChainToChainInRdd(supportedChain)

  if (!isLnMRdd({ chainRdd: supportedChainRdd, version }).supported) return undefined

  let tokensTestData
  switch (version) {
    case Version.V1_0_0:
      tokensTestData = tokensTestnetv100["CCIP-LnM"]
      break
    case Version.V1_2_0:
      tokensTestData = tokensTestnetv120["CCIP-LnM"]
      break
    default:
      throw new Error(`Invalid testnet version: ${version}`)
  }

  const token = tokensTestData[supportedChainRdd]
  if (!token || Object.keys(token).length === 0) {
    console.warn(`No LnM found for testnet ${supportedChain}`)
    return undefined
  }

  const {
    tokenAddress: address,
    symbol,
    decimals,
  } = token as { tokenAddress: string; symbol: string; decimals: number }

  if (!address || !symbol || !decimals) {
    console.error(`Token data not correct for LnM token on ${supportedChain}`)
    return undefined
  }

  return {
    type: "ERC20",
    options: {
      address,
      symbol,
      decimals,
      image: CCIPTokenImage,
    },
  }
}
