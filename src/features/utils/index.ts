import { chains, chainToTechnology, ExplorerInfo, SupportedChain, SupportedTechnology, web3Providers } from "@config"
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

export const getExplorerAddressUrl = (explorer: ExplorerInfo) => (contractAddress: string) => {
  const url = `${explorer.baseUrl}/address/${contractAddress}`
  if (!explorer.queryParameters) return url

  const queryString = Object.entries(explorer.queryParameters)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")

  return queryString ? `${url}?${queryString}` : url
}

export const getTitle = (supportedChain: SupportedChain) => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) return
  return chains[technology]?.chains[supportedChain]?.title
}

/**
 * Transforms a token name according to the following rules:
 * 1. Convert to lowercase
 * 2. Remove all dots (.)
 * 3. Replace plus signs (+) with %2B
 * @example
 * BTC.b → btcb
 * COMP+USDC → comp%2Busdc
 * TOKEN.A+B → tokena%2Bb
 */
const transformTokenName = (token: string): string => {
  if (!token) return ""
  return token
    .toLowerCase() // Step 1: Convert to lowercase
    .replace(/\./g, "") // Step 2: Remove all dots
    .replace(/\+/g, "%2B") // Step 3: Replace plus signs with %2B
}

export const getTokenIconUrl = (token: string) => {
  if (!token) return
  return `https://d2f70xi62kby8n.cloudfront.net/tokens/${transformTokenName(token)}.webp?auto=compress%2Cformat`
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
    case "soneium-mainnet":
      return "SONEIUM_MAINNET"
    case "ethereum-testnet-sepolia-soneium-1":
      return "SONEIUM_MINATO"
    case "ethereum-testnet-holesky":
      return "ETHEREUM_HOLESKY"
    case "polkadot-mainnet-astar":
      return "ASTAR_MAINNET"
    case "polkadot-testnet-astar-shibuya":
      return "ASTAR_SHIBUYA"
    case "ethereum-testnet-sepolia-zircuit-1":
      return "ZIRCUIT_TESTNET"
    case "ethereum-mainnet-zircuit-1":
      return "ZIRCUIT_MAINNET"
    case "ethereum-mainnet-mantle-1":
      return "MANTLE_MAINNET"
    case "ethereum-testnet-sepolia-mantle-1":
      return "MANTLE_SEPOLIA"
    case "ronin-mainnet":
      return "RONIN_MAINNET"
    case "ronin-testnet-saigon":
      return "RONIN_SAIGON"
    case "bitcoin-mainnet-bsquared-1":
      return "BSQUARED_MAINNET"
    case "bitcoin-testnet-bsquared-1":
      return "BSQUARED_TESTNET"
    case "shibarium-mainnet":
      return "SHIBARIUM_MAINNET"
    case "shibarium-testnet-puppynet":
      return "SHIBARIUM_PUPPYNET"
    case "sonic-mainnet":
      return "SONIC_MAINNET"
    case "sonic-testnet-blaze":
      return "SONIC_BLAZE"
    case "bitcoin-mainnet-bob-1":
      return "BOB_MAINNET"
    case "bitcoin-testnet-sepolia-bob-1":
      return "BOB_SEPOLIA"
    case "ethereum-mainnet-worldchain-1":
      return "WORLD_MAINNET"
    case "ethereum-testnet-sepolia-worldchain-1":
      return "WORLD_SEPOLIA"
    case "ethereum-mainnet-xlayer-1":
      return "XLAYER_MAINNET"
    case "ethereum-testnet-sepolia-xlayer-1":
      return "XLAYER_TESTNET"
    case "bitcoin-mainnet-bitlayer-1":
      return "BITLAYER_MAINNET"
    case "bitcoin-testnet-bitlayer-1":
      return "BITLAYER_TESTNET"
    case "ethereum-mainnet-ink-1":
      return "INK_MAINNET"
    case "ink-testnet-sepolia":
      return "INK_SEPOLIA"
    case "ethereum-mainnet-hashkey-1":
      return "HASHKEY_MAINNET"
    case "ethereum-testnet-sepolia-hashkey-1":
      return "HASHKEY_TESTNET"
    case "corn-mainnet":
      return "CORN_MAINNET"
    case "ethereum-testnet-sepolia-corn-1":
      return "CORN_TESTNET"
    case "ethereum-mainnet-polygon-zkevm-1":
      return "POLYGON_ZKEVM_MAINNET"
    case "ethereum-testnet-sepolia-polygon-zkevm-1":
      return "POLYGON_ZKEVM_CARDONA"
    case "bitcoin-testnet-botanix":
      return "BOTANIX_TESTNET"
    case "sei-mainnet":
      return "SEI_MAINNET"
    case "sei-testnet-atlantic":
      return "SEI_TESTNET"
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
    case "SONEIUM_MAINNET":
      return "soneium-mainnet"
    case "SONEIUM_MINATO":
      return "ethereum-testnet-sepolia-soneium-1"
    case "ETHEREUM_HOLESKY":
      return "ethereum-testnet-holesky"
    case "ASTAR_MAINNET":
      return "polkadot-mainnet-astar"
    case "ASTAR_SHIBUYA":
      return "polkadot-testnet-astar-shibuya"
    case "ZIRCUIT_TESTNET":
      return "ethereum-testnet-sepolia-zircuit-1"
    case "ZIRCUIT_MAINNET":
      return "ethereum-mainnet-zircuit-1"
    case "MANTLE_MAINNET":
      return "ethereum-mainnet-mantle-1"
    case "MANTLE_SEPOLIA":
      return "ethereum-testnet-sepolia-mantle-1"
    case "RONIN_MAINNET":
      return "ronin-mainnet"
    case "RONIN_SAIGON":
      return "ronin-testnet-saigon"
    case "BSQUARED_MAINNET":
      return "bitcoin-mainnet-bsquared-1"
    case "BSQUARED_TESTNET":
      return "bitcoin-testnet-bsquared-1"
    case "SHIBARIUM_MAINNET":
      return "shibarium-mainnet"
    case "SHIBARIUM_PUPPYNET":
      return "shibarium-testnet-puppynet"
    case "SONIC_MAINNET":
      return "sonic-mainnet"
    case "SONIC_BLAZE":
      return "sonic-testnet-blaze"
    case "BOB_MAINNET":
      return "bitcoin-mainnet-bob-1"
    case "BOB_SEPOLIA":
      return "bitcoin-testnet-sepolia-bob-1"
    case "WORLD_MAINNET":
      return "ethereum-mainnet-worldchain-1"
    case "WORLD_SEPOLIA":
      return "ethereum-testnet-sepolia-worldchain-1"
    case "XLAYER_MAINNET":
      return "ethereum-mainnet-xlayer-1"
    case "XLAYER_TESTNET":
      return "ethereum-testnet-sepolia-xlayer-1"
    case "BITLAYER_MAINNET":
      return "bitcoin-mainnet-bitlayer-1"
    case "BITLAYER_TESTNET":
      return "bitcoin-testnet-bitlayer-1"
    case "INK_MAINNET":
      return "ethereum-mainnet-ink-1"
    case "INK_SEPOLIA":
      return "ink-testnet-sepolia"
    case "HASHKEY_MAINNET":
      return "ethereum-mainnet-hashkey-1"
    case "HASHKEY_TESTNET":
      return "ethereum-testnet-sepolia-hashkey-1"
    case "CORN_MAINNET":
      return "corn-mainnet"
    case "CORN_TESTNET":
      return "ethereum-testnet-sepolia-corn-1"
    case "POLYGON_ZKEVM_MAINNET":
      return "ethereum-mainnet-polygon-zkevm-1"
    case "POLYGON_ZKEVM_CARDONA":
      return "ethereum-testnet-sepolia-polygon-zkevm-1"
    case "BOTANIX_TESTNET":
      return "bitcoin-testnet-botanix"
    case "SEI_MAINNET":
      return "sei-mainnet"
    case "SEI_TESTNET":
      return "sei-testnet-atlantic"
    default:
      throw Error(`Chain not found ${supportedChain}`)
  }
}
