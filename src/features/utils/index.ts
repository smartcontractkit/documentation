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

export const getTokenIconUrl = (token: string) => {
  if (!token) return
  return `https://d2f70xi62kby8n.cloudfront.net/tokens/${token.toLowerCase()}.webp?auto=compress%2Cformat`
}

export const fallbackTokenIconUrl = "/assets/icons/generic-token.svg"

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
    case "ethereum-testnet-sepolia-optimism-1":
      return "OPTIMISM_SEPOLIA"
    case "ethereum-mainnet-arbitrum-1":
      return "ARBITRUM_MAINNET"
    case "ethereum-testnet-sepolia-arbitrum-1":
      return "ARBITRUM_SEPOLIA"
    case "matic-mainnet":
      return "POLYGON_MAINNET"
    case "polygon-testnet-amoy":
      return "POLYGON_AMOY"
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
    case "ethereum-testnet-sepolia-base-1":
      return "BASE_SEPOLIA"
    case "wemix-mainnet":
      return "WEMIX_MAINNET"
    case "wemix-testnet":
      return "WEMIX_TESTNET"
    case "ethereum-mainnet-kroma-1":
      return "KROMA_MAINNET"
    case "ethereum-testnet-sepolia-kroma-1":
      return "KROMA_SEPOLIA"
    case "xdai-mainnet":
      return "GNOSIS_MAINNET"
    case "xdai-testnet-chiado":
      return "GNOSIS_CHIADO"
    case "celo-mainnet":
      return "CELO_MAINNET"
    case "celo-testnet-alfajores":
      return "CELO_ALFAJORES"
    case "ethereum-testnet-sepolia-mode-1":
      return "MODE_SEPOLIA"
    case "ethereum-mainnet-mode-1":
      return "MODE_MAINNET"
    case "ethereum-mainnet-blast-1":
      return "BLAST_MAINNET"
    case "ethereum-testnet-sepolia-blast-1":
      return "BLAST_SEPOLIA"
    case "ethereum-mainnet-andromeda-1":
      return "METIS_MAINNET"
    case "ethereum-testnet-sepolia-andromeda-1":
      return "METIS_SEPOLIA"
    case "ethereum-mainnet-zksync-1":
      return "ZKSYNC_MAINNET"
    case "ethereum-testnet-sepolia-zksync-1":
      return "ZKSYNC_SEPOLIA"
    case "ethereum-mainnet-linea-1":
      return "LINEA_MAINNET"
    case "ethereum-testnet-sepolia-linea-1":
      return "LINEA_SEPOLIA"
    case "ethereum-mainnet-scroll-1":
      return "SCROLL_MAINNET"
    case "ethereum-testnet-sepolia-scroll-1":
      return "SCROLL_SEPOLIA"
    case "ethereum-testnet-sepolia-soneium-1":
      return "SONEIUM_MINATO"
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
    case "OPTIMISM_SEPOLIA":
      return "ethereum-testnet-sepolia-optimism-1"
    case "ARBITRUM_MAINNET":
      return "ethereum-mainnet-arbitrum-1"
    case "ARBITRUM_SEPOLIA":
      return "ethereum-testnet-sepolia-arbitrum-1"
    case "POLYGON_MAINNET":
      return "matic-mainnet"
    case "POLYGON_AMOY":
      return "polygon-testnet-amoy"
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
    case "BASE_SEPOLIA":
      return "ethereum-testnet-sepolia-base-1"
    case "WEMIX_MAINNET":
      return "wemix-mainnet"
    case "WEMIX_TESTNET":
      return "wemix-testnet"
    case "KROMA_MAINNET":
      return "ethereum-mainnet-kroma-1"
    case "KROMA_SEPOLIA":
      return "ethereum-testnet-sepolia-kroma-1"
    case "GNOSIS_MAINNET":
      return "xdai-mainnet"
    case "GNOSIS_CHIADO":
      return "xdai-testnet-chiado"
    case "CELO_MAINNET":
      return "celo-mainnet"
    case "CELO_ALFAJORES":
      return "celo-testnet-alfajores"
    case "MODE_SEPOLIA":
      return "ethereum-testnet-sepolia-mode-1"
    case "MODE_MAINNET":
      return "ethereum-mainnet-mode-1"
    case "BLAST_MAINNET":
      return "ethereum-mainnet-blast-1"
    case "BLAST_SEPOLIA":
      return "ethereum-testnet-sepolia-blast-1"
    case "METIS_MAINNET":
      return "ethereum-mainnet-andromeda-1"
    case "METIS_SEPOLIA":
      return "ethereum-testnet-sepolia-andromeda-1"
    case "ZKSYNC_MAINNET":
      return "ethereum-mainnet-zksync-1"
    case "ZKSYNC_SEPOLIA":
      return "ethereum-testnet-sepolia-zksync-1"
    case "LINEA_MAINNET":
      return "ethereum-mainnet-linea-1"
    case "LINEA_SEPOLIA":
      return "ethereum-testnet-sepolia-linea-1"
    case "SCROLL_MAINNET":
      return "ethereum-mainnet-scroll-1"
    case "SCROLL_SEPOLIA":
      return "ethereum-testnet-sepolia-scroll-1"
    case "SONEIUM_MINATO":
      return "ethereum-testnet-sepolia-soneium-1"
    default:
      throw Error(`Chain not found ${supportedChain}`)
  }
}
