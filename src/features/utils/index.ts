import { chains, chainToTechnology, SupportedChain, SupportedTechnology, web3Providers } from "@config"
import { utils } from "ethers"
import referenceChains from "src/scripts/reference/chains.json"

interface AddEthereumChainParameter {
  chainId: string
  blockExplorerUrls?: string[]
  chainName?: string
  iconUrls?: string[]
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls?: string[]
}

export const getEthereumChainParameter = (chainId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain = referenceChains.find((c: any) => utils.hexValue(c.chainId) === chainId)
  if (!chain || !chain.chainId) {
    throw new Error(`Chain with chainId '${chainId}' not found in reference data`)
  }

  const params: AddEthereumChainParameter = {
    chainId,
    chainName: chain.name,
    nativeCurrency: chain?.nativeCurrency,
    blockExplorerUrls:
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chain.explorers.map((explorer: any) => explorer.url)
        : [chain.infoURL],
    rpcUrls: chain.rpc,
  }
  return params
}
export const getWeb3Provider = (supportedChain: SupportedChain) => {
  const provider = web3Providers.chainToProvider[supportedChain]()
  if (!provider) return
  return provider
}

export const getExplorer = (supportedChain: SupportedChain) => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) return
  return chains[technology]?.chains[supportedChain]?.explorer
}

export const getNativeCurrency = (supportedChain: SupportedChain) => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) return
  return chains[technology]?.chains[supportedChain]?.nativeCurrency
}

export const getExplorerAddressUrl = (explorerUrl: string) => (contractAddress: string) => {
  return `${explorerUrl}/address/${contractAddress}`
}

export const getTitle = (supportedChain: SupportedChain) => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) return
  return chains[technology]?.chains[supportedChain]?.title
}

export const getChainId = (supportedChain: SupportedChain) => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) return
  return chains[technology]?.chains[supportedChain]?.chainId
}

export const getChainIcon = (supportedChain: SupportedChain) => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) return
  return chains[technology].icon
}

type NormalizedConfig<T> = Partial<
  Record<
    SupportedTechnology,
    {
      title: string
      chains: Partial<Record<SupportedChain, T>>
    }
  >
>

export const normalizeConfig = <T>(config: Partial<Record<SupportedChain, T>>) => {
  const normalizedConfig: NormalizedConfig<T> = {}
  const supportedChains = Object.keys(config) as SupportedChain[]
  for (const chain of supportedChains) {
    const technology = chainToTechnology[chain]
    if (!normalizedConfig[technology])
      normalizedConfig[technology] = {
        title: chains[technology].title,
        chains: {},
      }
    normalizedConfig[technology]!.chains[chain] = config[chain]
  }
  return normalizedConfig
}

export const directoryToSupportedChain = (chainInRdd: string): SupportedChain => {
  switch (chainInRdd) {
    case "mainnet":
      return "ETHEREUM_MAINNET"
    case "ethereum-testnet-sepolia":
      return "ETHEREUM_SEPOLIA"
    case "ethereum-mainnet-optimism-1":
      return "OPTIMISM_MAINNET"
    case "ethereum-testnet-goerli-optimism-1":
      return "OPTIMISM_GOERLI"
    case "ethereum-mainnet-arbitrum-1":
      return "ARBITRUM_MAINNET"
    case "ethereum-testnet-goerli-arbitrum-1":
      return "ARBITRUM_GOERLI"
    case "ethereum-testnet-sepolia-arbitrum-1":
      return "ARBITRUM_SEPOLIA"
    case "matic-mainnet":
      return "POLYGON_MAINNET"
    case "matic-testnet":
      return "POLYGON_MUMBAI"
    case "avalanche-mainnet":
      return "AVALANCHE_MAINNET"
    case "avalanche-fuji-testnet":
      return "AVALANCHE_FUJI"
    case "bsc-mainnet":
      return "BNB_MAINNET"
    case "bsc-testnet":
      return "BNB_TESTNET"
    case "ethereum-mainnet-base-1":
      return "BASE_MAINNET"
    case "ethereum-testnet-goerli-base-1":
      return "BASE_GOERLI"
    default:
      throw Error(`Chain not found ${chainInRdd}`)
  }
}

export const supportedChainToChainInRdd = (supportedChain: SupportedChain): string => {
  switch (supportedChain) {
    case "ETHEREUM_MAINNET":
      return "mainnet"
    case "ETHEREUM_SEPOLIA":
      return "ethereum-testnet-sepolia"
    case "OPTIMISM_MAINNET":
      return "ethereum-mainnet-optimism-1"
    case "OPTIMISM_GOERLI":
      return "ethereum-testnet-goerli-optimism-1"
    case "ARBITRUM_MAINNET":
      return "ethereum-mainnet-arbitrum-1"
    case "ARBITRUM_SEPOLIA":
      return "ethereum-testnet-sepolia-arbitrum-1"
    case "ARBITRUM_GOERLI":
      return "ethereum-testnet-goerli-arbitrum-1"
    case "POLYGON_MAINNET":
      return "matic-mainnet"
    case "POLYGON_MUMBAI":
      return "matic-testnet"
    case "AVALANCHE_MAINNET":
      return "avalanche-mainnet"
    case "AVALANCHE_FUJI":
      return "avalanche-fuji-testnet"
    case "BNB_MAINNET":
      return "bsc-mainnet"
    case "BNB_TESTNET":
      return "bsc-testnet"
    case "BASE_MAINNET":
      return "ethereum-mainnet-base-1"
    case "BASE_GOERLI":
      return "ethereum-testnet-goerli-base-1"
    default:
      throw Error(`Chain not found ${supportedChain}`)
  }
}
