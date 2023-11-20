import chains from "../../../scripts/reference/chains.json"
import { utils } from "ethers"
import { ChainsConfig, LanesConfig, TokensConfig } from "./types"

// For mainnet
import chainsMainnet from "@config/data/ccip/mainnet/chains.json"
import lanesMainnet from "@config/data/ccip/mainnet/lanes.json"
import tokensMainnet from "@config/data/ccip/mainnet//tokens.json"

// For testnet

import chainsTestnet from "@config/data/ccip/testnet/chains.json"
import lanesTestnet from "@config/data/ccip/testnet/lanes.json"
import tokensTestnet from "@config/data/ccip/testnet/tokens.json"

export enum Environment {
  Mainnet = "mainnet",
  Testnet = "testnet",
}
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

interface CCIPTokenParams {
  type: string
  options: {
    address: string
    symbol: string
    decimals: number
    image: string
  }
}

interface CCIPToken {
  params: CCIPTokenParams
}

export interface CCIPNetworkOptions {
  name: string
  chainId: string
  icon: string
  BnM?: CCIPToken
  LnM?: CCIPToken
}

const CCIPTokenImage =
  "https://images.prismic.io/data-chain-link/86d5bc29-7511-49f5-bbd8-18a8ebc008b0_ccip-icon-white.png?auto=compress,format"

export const getchainByChainId = (chainId: string) => {
  return chains.find((chain) => utils.hexValue(chain.chainId) === chainId)
}

export const supportedNetworks: CCIPNetworkOptions[] = [
  {
    name: "Ethereum Mainnet",
    chainId: "0x1",
    icon: "/assets/chains/ethereum.svg",
  },
  {
    name: "Ethereum Sepolia",
    chainId: "0xaa36a7",
    icon: "/assets/chains/ethereum.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
    LnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
          symbol: "CCIP-LnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Optimism Mainnet",
    chainId: "0xa",
    icon: "/assets/chains/optimism.svg",
  },
  {
    name: "Optimism Goerli",
    chainId: "0x1a4",
    icon: "/assets/chains/optimism.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Avalanche Mainnet",
    chainId: "0xa86a",
    icon: "/assets/chains/avalanche.svg",
  },
  {
    name: "Avalanche Fuji",
    chainId: "0xa869",
    icon: "/assets/chains/avalanche.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Polygon Mainnet",
    chainId: "0x89",
    icon: "/assets/chains/polygon.svg",
  },
  {
    name: "Polygon Mumbai",
    chainId: "0x13881",
    icon: "/assets/chains/polygon.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "BNB Chain testnet",
    chainId: "0x61",
    icon: "/assets/chains/bnb-chain.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xbfa2acd33ed6eec0ed3cc06bf1ac38d22b36b9e9",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
]
