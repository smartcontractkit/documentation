import { ChainsConfig, LanesConfig, TokensConfig, Environment } from "./types"

// For mainnet
import chainsMainnet from "@config/data/ccip/mainnet/chains.json"
import lanesMainnet from "@config/data/ccip/mainnet/lanes.json"
import tokensMainnet from "@config/data/ccip/mainnet//tokens.json"

// For testnet

import chainsTestnet from "@config/data/ccip/testnet/chains.json"
import lanesTestnet from "@config/data/ccip/testnet/lanes.json"
import tokensTestnet from "@config/data/ccip/testnet/tokens.json"
import { SupportedChain } from "@config/types"
import { supportedChainToChainInRdd } from "@features/utils"

export const loadReferenceData = (environment: Environment) => {
  let chainsReferenceData: ChainsConfig, lanesReferenceData: LanesConfig, tokensReferenceData: TokensConfig
  switch (
    environment // Make sure to use the parameter 'environment', not the type 'Environment'
  ) {
    case Environment.Mainnet:
      chainsReferenceData = chainsMainnet as unknown as ChainsConfig
      lanesReferenceData = lanesMainnet as unknown as LanesConfig
      tokensReferenceData = tokensMainnet as unknown as TokensConfig
      break
    case Environment.Testnet:
      chainsReferenceData = chainsTestnet as unknown as ChainsConfig
      lanesReferenceData = lanesTestnet as unknown as LanesConfig
      tokensReferenceData = tokensTestnet as unknown as TokensConfig
      break
    default:
      throw Error(`Wrong environment ${environment}`)
  }

  return { chainsReferenceData, lanesReferenceData, tokensReferenceData }
}

export const allChains = [...Object.keys(chainsMainnet), ...Object.keys(chainsTestnet)]

const CCIPTokenImage =
  "https://images.prismic.io/data-chain-link/86d5bc29-7511-49f5-bbd8-18a8ebc008b0_ccip-icon-white.png?auto=compress,format"

export const isBnMRdd = (chainRdd: string) => {
  return tokensTestnet["CCIP-BnM"][chainRdd]
}

export const isBnM = (chain: SupportedChain) => {
  const chainRdd = supportedChainToChainInRdd(chain)
  return isBnMRdd(chainRdd)
}

export const isLnMRdd = (chainRdd: string) => {
  const supportedChainForLock: SupportedChain = "ETHEREUM_SEPOLIA"
  return {
    supported: tokensTestnet["CCIP-LnM"][chainRdd],
    supportedChainForLock,
  } // LnM only for Sepolia
}

export const isLnM = (chain: SupportedChain) => {
  const chainRdd = supportedChainToChainInRdd(chain)
  return isLnMRdd(chainRdd)
}

export const isBnMOrLnMRdd = (chainRdd: string) => {
  return isBnMRdd(chainRdd) || isLnMRdd(chainRdd).supported
}

export const isBnMOrLnM = (chain: SupportedChain) => {
  return isBnM(chain) || isLnM(chain)
}

export const getBnMParams = (supportedChain: SupportedChain) => {
  const supportedChainRdd = supportedChainToChainInRdd(supportedChain)
  if (!(supportedChainRdd in chainsTestnet)) return undefined // No BnM for mainnets
  const token = tokensTestnet["CCIP-BnM"][supportedChainRdd]
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

export const getLnMParams = (supportedChain: SupportedChain) => {
  const supportedChainRdd = supportedChainToChainInRdd(supportedChain)
  if (!isLnMRdd(supportedChainRdd).supported) return undefined
  const token = tokensTestnet["CCIP-LnM"][supportedChainRdd]
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
