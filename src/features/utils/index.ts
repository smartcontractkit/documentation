import {
  chains,
  chainToTechnology,
  ExplorerInfo,
  SupportedChain,
  SupportedTechnology,
  web3Providers,
  ChainType,
  ChainFamily,
} from "@config/index.ts"
import { CCIP_TOKEN_ICON_MAPPINGS } from "@config/data/ccip/tokenIconMappings.ts"
import { toQuantity } from "ethers"
import referenceChains from "~/scripts/reference/chains.json" with { type: "json" }

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
  const chain = referenceChains.find((c: any) => toQuantity(c.chainId) === chainId)
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

export const getExplorerAddressUrl =
  (explorer: ExplorerInfo, chainType: ChainType = "evm") =>
  (contractAddress: string) => {
    // Use appropriate path segment based on chain type
    const pathSegment = chainType === "aptos" ? "object" : "address"
    const url = `${explorer.baseUrl}/${pathSegment}/${contractAddress}`
    if (!explorer.queryParameters) return url

    const queryString = Object.entries(explorer.queryParameters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&")

    return queryString ? `${url}?${queryString}` : url
  }

export const getExplorerTransactionUrl = (explorer: ExplorerInfo) => (transactionSignature: string) => {
  const url = `${explorer.baseUrl}/tx/${transactionSignature}`
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

export type ChainTypeAndFamily = {
  chainType: ChainType
  chainFamily: ChainFamily
}

export const getChainTypeAndFamily = (supportedChain: SupportedChain): ChainTypeAndFamily => {
  const technology = chainToTechnology[supportedChain]
  if (!technology) {
    throw new Error(`Technology not found for chain: ${supportedChain}`)
  }

  const chainType = chains[technology]?.chainType
  if (!chainType) {
    throw new Error(`Chain type not found for technology: ${technology}`)
  }

  let chainFamily: ChainFamily
  switch (chainType) {
    case "evm":
      chainFamily = "evm"
      break
    case "aptos":
      chainFamily = "aptos"
      break
    case "sui":
      chainFamily = "sui"
      break
    case "solana":
      chainFamily = "solana"
      break
    case "tron":
      chainFamily = "tron"
      break
    case "canton":
      chainFamily = "canton"
      break
    case "ton":
      chainFamily = "ton"
      break
    case "stellar":
      chainFamily = "stellar"
      break
    case "starknet":
      chainFamily = "starknet"
      break
    default:
      throw new Error(`Unknown chain type: ${chainType}`)
  }

  return { chainType, chainFamily }
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
    .replace(/\$/g, "") // Step 3: Remove all dollar signs
    .replace(/\+/g, "%2B") // Step 3: Replace plus signs with %2B
}

export const getTokenIconUrl = (token: string, size = 40) => {
  if (!token) return ""

  // Resolve icon identifier, fallback to original token name
  const iconIdentifier = CCIP_TOKEN_ICON_MAPPINGS[token] ?? token

  // Request appropriately sized images from CloudFront
  // For 40x40 display, request 80x80 for retina displays (2x)
  return `https://d2f70xi62kby8n.cloudfront.net/tokens/${transformTokenName(iconIdentifier)}.webp?auto=compress%2Cformat&q=60&w=${size}&h=${size}&fit=cover`
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
    if (normalizedConfig[technology]) {
      normalizedConfig[technology].chains[chain] = config[chain]
    }
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
    case "ethereum-testnet-hoodi":
      return "ETHEREUM_HOODI"
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
    case "sonic-testnet":
      return "SONIC_TESTNET"
    case "sonic-testnet-blaze":
      return "SONIC_TESTNET_BLAZE"
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
    case "monad-testnet":
      return "MONAD_TESTNET"
    case "core-testnet":
      return "CORE_TESTNET"
    case "core-mainnet":
      return "CORE_MAINNET"
    case "treasure-mainnet":
      return "TREASURE_MAINNET"
    case "treasure-testnet-topaz":
      return "TREASURE_TOPAZ"
    case "ethereum-testnet-sepolia-lens-1":
      return "LENS_SEPOLIA"
    case "lens-mainnet":
      return "LENS_MAINNET"
    case "berachain-mainnet":
      return "BERACHAIN_MAINNET"
    case "berachain-testnet-bartio":
      return "BERACHAIN_BARTIO"
    case "hyperliquid-mainnet":
      return "HYPEREVM_MAINNET"
    case "hyperliquid-testnet":
      return "HYPEREVM_TESTNET"
    case "bitcoin-testnet-merlin":
      return "MERLIN_TESTNET"
    case "bitcoin-merlin-mainnet":
      return "MERLIN_MAINNET"
    case "ethereum-testnet-holesky-fraxtal-1":
      return "FRAXTAL_TESTNET"
    case "fraxtal-mainnet":
      return "FRAXTAL_MAINNET"
    case "hedera-testnet":
      return "HEDERA_TESTNET"
    case "hedera-mainnet":
      return "HEDERA_MAINNET"
    case "ethereum-testnet-sepolia-unichain-1":
      return "UNICHAIN_SEPOLIA"
    case "ethereum-mainnet-unichain-1":
      return "UNICHAIN_MAINNET"
    case "apechain-testnet-curtis":
      return "APECHAIN_CURTIS"
    case "apechain-mainnet":
      return "APECHAIN_MAINNET"
    case "hemi-testnet-sepolia":
      return "HEMI_SEPOLIA"
    case "hemi-mainnet":
      return "HEMI_MAINNET"
    case "cronos-testnet":
      return "CRONOS_TESTNET"
    case "cronos-mainnet":
      return "CRONOS_MAINNET"
    case "cronos-zkevm-testnet-sepolia":
      return "CRONOS_ZKEVM_TESTNET"
    case "cronos-zkevm-mainnet":
      return "CRONOS_ZKEVM_MAINNET"
    case "0g-testnet-galileo":
      return "0G_GALILEO_TESTNET"
    case "0g-mainnet":
      return "0G_MAINNET"
    case "megaeth-testnet":
      return "MEGAETH_TESTNET"
    case "megaeth-mainnet":
      return "MEGAETH_MAINNET"
    case "mind-testnet":
      return "MIND_NETWORK_TESTNET"
    case "mind-mainnet":
      return "MIND_NETWORK_MAINNET"
    case "ethereum-mainnet-taiko-1":
      return "TAIKO_MAINNET"
    case "ethereum-testnet-holesky-taiko-1":
      return "TAIKO_HEKLA"
    case "plume-testnet-sepolia":
      return "PLUME_SEPOLIA"
    case "plume-mainnet":
      return "PLUME_MAINNET"
    case "solana-devnet":
      return "SOLANA_DEVNET"
    case "solana-mainnet":
      return "SOLANA_MAINNET"
    case "tron-mainnetTRON_MAINNET":
      return "TRON_MAINNET"
    case "tron-testnet-shasta-evm":
      return "TRON_SHASTA"
    case "abstract-mainnet":
      return "ABSTRACT_MAINNET"
    case "abstract-testnet":
      return "ABSTRACT_TESTNET"
    case "lisk-mainnet":
      return "LISK_MAINNET"
    case "lisk-testnet":
      return "LISK_TESTNET"
    case "zora-mainnet":
      return "ZORA_MAINNET"
    case "zora-testnet":
      return "ZORA_TESTNET"
    case "mint-mainnet":
      return "MINT_MAINNET"
    case "mint-testnet":
      return "MINT_TESTNET"
    case "superseed-mainnet":
      return "SUPERSEED_MAINNET"
    case "superseed-testnet":
      return "SUPERSEED_TESTNET"
    case "metal-mainnet":
      return "METAL_MAINNET"
    case "metal-testnet":
      return "METAL_TESTNET"
    case "ethereum-testnet-sepolia-lisk-1":
      return "LISK_TESTNET"
    case "rootstock-mainnet":
      return "ROOTSTOCK_MAINNET"
    case "bitcoin-testnet-rootstock":
      return "ROOTSTOCK_TESTNET"
    case "gravity-mainnet":
      return "GRAVITY_MAINNET"
    case "gravity-testnet":
      return "GRAVITY_TESTNET"
    case "etherlink-mainnet":
      return "ETHERLINK_MAINNET"
    case "etherlink-testnet":
      return "ETHERLINK_TESTNET"
    case "binance-smart-chain-mainnet-opbnb-1":
      return "OPBNB_MAINNET"
    case "binance-smart-chain-testnet-opbnb-1":
      return "OPBNB_TESTNET"
    case "janction-mainnet":
      return "JANCTION_MAINNET"
    case "janction-testnet-sepolia":
      return "JANCTION_TESTNET"
    case "neox-mainnet":
      return "NEO_X_MAINNET"
    case "neox-testnet-t4":
      return "NEO_X_TESTNET"
    case "polygon-mainnet-katana":
      return "KATANA_MAINNET"
    case "polygon-testnet-tatara":
      return "KATANA_TATARA"
    case "bitcoin-mainnet-botanix":
      return "BOTANIX_MAINNET"
    case "aptos-mainnet":
      return "APTOS_MAINNET"
    case "aptos-testnet":
      return "APTOS_TESTNET"
    case "kaia-mainnet":
      return "KAIA_MAINNET"
    case "kaia-testnet-kairos":
      return "KAIA_TESTNET_KAIROS"
    case "tac-mainnet":
      return "TAC_MAINNET"
    case "tac-testnet":
      return "TAC_TESTNET"
    case "plasma-mainnet":
      return "PLASMA_MAINNET"
    case "plasma-testnet":
      return "PLASMA_TESTNET"
    case "memento-mainnet":
      return "MEMENTO_MAINNET"
    case "memento-testnet":
      return "MEMENTO_TESTNET"
    case "xdc-mainnet":
      return "XDC_MAINNET"
    case "xdc-testnet":
      return "XDC_TESTNET"
    case "bittensor-mainnet":
      return "BITTENSOR_MAINNET"
    case "everclear-mainnet":
      return "EVERCLEAR_MAINNET"
    case "ab-mainnet":
      return "AB_CHAIN_MAINNET"
    case "monad-mainnet":
      return "MONAD_MAINNET"
    case "nexon-mainnet-henesys":
      return "NEXON_HENESYS_MAINNET"
    case "pharos-atlantic-testnet":
      return "PHAROS_ATLANTIC_TESTNET"
    case "pharos-mainnet":
      return "PHAROS_MAINNET"
    case "morph-mainnet":
      return "MORPH_MAINNET"
    case "ethereum-testnet-hoodi-morph":
      return "MORPH_HOODI_TESTNET"
    case "jovay-mainnet":
      return "JOVAY_MAINNET"
    case "jovay-testnet":
      return "JOVAY_TESTNET"
    case "stable-mainnet":
      return "STABLE_MAINNET"
    case "tempo-testnet":
      return "TEMPO_TESTNET"
    case "arc-testnet":
      return "ARC_NETWORK_TESTNET"
    case "doge-os-chikyu-testnet":
    case "dogeos-testnet-chikyu":
      return "DOGE_OS_CHIKYU_TESTNET"
    case "adi-testnet":
      return "ADI_NETWORK_AB_TESTNET"
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
    case "ETHEREUM_HOODI":
      return "ethereum-testnet-hoodi"
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
    case "SONIC_TESTNET":
      return "sonic-testnet"
    case "SONIC_TESTNET_BLAZE":
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
    case "CORE_TESTNET":
      return "core-testnet"
    case "CORE_MAINNET":
      return "core-mainnet"
    case "MONAD_TESTNET":
      return "monad-testnet"
    case "TREASURE_MAINNET":
      return "treasure-mainnet"
    case "TREASURE_TOPAZ":
      return "treasure-testnet-topaz"
    case "LENS_SEPOLIA":
      return "ethereum-testnet-sepolia-lens-1"
    case "LENS_MAINNET":
      return "lens-mainnet"
    case "BERACHAIN_MAINNET":
      return "berachain-mainnet"
    case "BERACHAIN_BARTIO":
      return "berachain-testnet-bartio"
    case "HYPEREVM_MAINNET":
      return "hyperliquid-mainnet"
    case "HYPEREVM_TESTNET":
      return "hyperliquid-testnet"
    case "MERLIN_TESTNET":
      return "bitcoin-testnet-merlin"
    case "MERLIN_MAINNET":
      return "bitcoin-mainnet-merlin"
    case "FRAXTAL_TESTNET":
      return "ethereum-testnet-holesky-fraxtal-1"
    case "FRAXTAL_MAINNET":
      return "fraxtal-mainnet"
    case "HEDERA_TESTNET":
      return "hedera-testnet"
    case "HEDERA_MAINNET":
      return "hedera-mainnet"
    case "UNICHAIN_SEPOLIA":
      return "ethereum-testnet-sepolia-unichain-1"
    case "UNICHAIN_MAINNET":
      return "ethereum-mainnet-unichain-1"
    case "APECHAIN_CURTIS":
      return "apechain-testnet-curtis"
    case "APECHAIN_MAINNET":
      return "apechain-mainnet"
    case "HEMI_SEPOLIA":
      return "hemi-testnet-sepolia"
    case "HEMI_MAINNET":
      return "hemi-mainnet"
    case "CRONOS_TESTNET":
      return "cronos-testnet"
    case "CRONOS_MAINNET":
      return "cronos-mainnet"
    case "CRONOS_ZKEVM_TESTNET":
      return "cronos-zkevm-testnet-sepolia"
    case "CRONOS_ZKEVM_MAINNET":
      return "cronos-zkevm-mainnet"
    case "0G_GALILEO_TESTNET":
      return "0g-testnet-galileo"
    case "0G_MAINNET":
      return "0g-mainnet"
    case "MEGAETH_TESTNET":
      return "megaeth-testnet"
    case "MEGAETH_MAINNET":
      return "megaeth-mainnet"
    case "MIND_NETWORK_TESTNET":
      return "mind-testnet"
    case "MIND_NETWORK_MAINNET":
      return "mind-mainnet"
    case "TAIKO_MAINNET":
      return "ethereum-mainnet-taiko-1"
    case "TAIKO_HEKLA":
      return "ethereum-testnet-holesky-taiko-1"
    case "PLUME_SEPOLIA":
      return "plume-testnet-sepolia"
    case "PLUME_MAINNET":
      return "plume-mainnet"
    case "SOLANA_DEVNET":
      return "solana-devnet"
    case "SOLANA_MAINNET":
      return "solana-mainnet"
    case "TRON_MAINNET":
      return "tron-mainnet"
    case "TRON_SHASTA":
      return "tron-testnet-shasta-evm"
    case "ABSTRACT_MAINNET":
      return "abstract-mainnet"
    case "ABSTRACT_TESTNET":
      return "abstract-testnet"
    case "LISK_MAINNET":
      return "lisk-mainnet"
    case "LISK_TESTNET":
      return "ethereum-testnet-sepolia-lisk-1"
    case "ZORA_MAINNET":
      return "zora-mainnet"
    case "ZORA_TESTNET":
      return "zora-testnet"
    case "MINT_MAINNET":
      return "mint-mainnet"
    case "MINT_TESTNET":
      return "mint-testnet"
    case "SUPERSEED_MAINNET":
      return "superseed-mainnet"
    case "SUPERSEED_TESTNET":
      return "superseed-testnet"
    case "METAL_MAINNET":
      return "metal-mainnet"
    case "METAL_TESTNET":
      return "metal-testnet"
    case "ROOTSTOCK_MAINNET":
      return "rootstock-mainnet"
    case "ROOTSTOCK_TESTNET":
      return "bitcoin-testnet-rootstock"
    case "GRAVITY_MAINNET":
      return "gravity-mainnet"
    case "GRAVITY_TESTNET":
      return "gravity-testnet"
    case "ETHERLINK_MAINNET":
      return "etherlink-mainnet"
    case "ETHERLINK_TESTNET":
      return "etherlink-testnet"
    case "OPBNB_MAINNET":
      return "binance-smart-chain-mainnet-opbnb-1"
    case "OPBNB_TESTNET":
      return "binance-smart-chain-testnet-opbnb-1"
    case "JANCTION_MAINNET":
      return "janction-mainnet"
    case "JANCTION_TESTNET":
      return "janction-testnet-sepolia"
    case "NEO_X_MAINNET":
      return "neox-mainnet"
    case "NEO_X_TESTNET":
      return "neox-testnet-t4"
    case "KATANA_MAINNET":
      return "polygon-mainnet-katana"
    case "KATANA_TATARA":
      return "polygon-testnet-tatara"
    case "BOTANIX_MAINNET":
      return "bitcoin-mainnet-botanix"
    case "APTOS_MAINNET":
      return "aptos-mainnet"
    case "APTOS_TESTNET":
      return "aptos-testnet"
    case "KAIA_MAINNET":
      return "kaia-mainnet"
    case "KAIA_TESTNET_KAIROS":
      return "kaia-testnet-kairos"
    case "TAC_MAINNET":
      return "tac-mainnet"
    case "TAC_TESTNET":
      return "tac-testnet"
    case "PLASMA_MAINNET":
      return "plasma-mainnet"
    case "PLASMA_TESTNET":
      return "plasma-testnet"
    case "MEMENTO_MAINNET":
      return "memento-mainnet"
    case "MEMENTO_TESTNET":
      return "memento-testnet"
    case "XDC_MAINNET":
      return "xdc-mainnet"
    case "XDC_TESTNET":
      return "xdc-testnet"
    case "BITTENSOR_MAINNET":
      return "bittensor-mainnet"
    case "EVERCLEAR_MAINNET":
      return "everclear-mainnet"
    case "AB_CHAIN_MAINNET":
      return "ab-mainnet"
    case "MONAD_MAINNET":
      return "monad-mainnet"
    case "NEXON_HENESYS_MAINNET":
      return "nexon-mainnet-henesys"
    case "PHAROS_ATLANTIC_TESTNET":
      return "pharos-atlantic-testnet"
    case "PHAROS_MAINNET":
      return "pharos-mainnet"
    case "MORPH_MAINNET":
      return "morph-mainnet"
    case "MORPH_HOODI_TESTNET":
      return "ethereum-testnet-hoodi-morph"
    case "JOVAY_MAINNET":
      return "jovay-mainnet"
    case "JOVAY_TESTNET":
      return "jovay-testnet"
    case "STABLE_MAINNET":
      return "stable-mainnet"
    case "TEMPO_TESTNET":
      return "tempo-testnet"
    case "ARC_NETWORK_TESTNET":
      return "arc-testnet"
    case "DOGE_OS_CHIKYU_TESTNET":
      return "dogeos-testnet-chikyu"
    case "ADI_NETWORK_AB_TESTNET":
      return "adi-testnet"
    default:
      throw Error(`Chain not found ${supportedChain}`)
  }
}

export * from "./networkIcons.ts"
