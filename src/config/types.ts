export type SupportedTechnology =
  | "ETHEREUM"
  | "BNB"
  | "POLYGON"
  | "GNOSIS"
  | "AVALANCHE"
  | "FANTOM"
  | "ARBITRUM"
  | "OPTIMISM"
  | "MOONRIVER"
  | "MOONBEAM"
  | "METIS"
  | "BASE"
  | "BLAST"
  | "CELO"
  | "POLYGON_ZKEVM"
  | "LINEA"
  | "SCROLL"
  | "WEMIX"
  | "KROMA"
  | "MODE"
  | "ZKSYNC"
  | "SONEIUM"
  | "ASTAR"
  | "ZIRCUIT"
  | "MANTLE"
  | "RONIN"
  | "SONIC"
  | "BOB"
  | "WORLD"
  | "XLAYER"
  | "BITLAYER"
  | "INK"
  | "HASHKEY"
  | "CORN"
  | "BOTANIX"
  | "SEI"

export type SupportedChain =
  | "ETHEREUM_MAINNET"
  | "ETHEREUM_SEPOLIA"
  | "ETHEREUM_HOLESKY"
  | "BNB_MAINNET"
  | "BNB_TESTNET"
  | "POLYGON_MAINNET"
  | "POLYGON_AMOY"
  | "GNOSIS_MAINNET"
  | "GNOSIS_CHIADO"
  | "AVALANCHE_MAINNET"
  | "AVALANCHE_FUJI"
  | "FANTOM_MAINNET"
  | "FANTOM_TESTNET"
  | "ARBITRUM_MAINNET"
  | "ARBITRUM_SEPOLIA"
  | "OPTIMISM_MAINNET"
  | "OPTIMISM_SEPOLIA"
  | "MOONRIVER_MAINNET"
  | "MOONBEAM_MAINNET"
  | "METIS_MAINNET"
  | "METIS_SEPOLIA"
  | "BASE_MAINNET"
  | "BASE_SEPOLIA"
  | "BLAST_MAINNET"
  | "BLAST_SEPOLIA"
  | "CELO_MAINNET"
  | "CELO_ALFAJORES"
  | "SCROLL_MAINNET"
  | "SCROLL_SEPOLIA"
  | "LINEA_MAINNET"
  | "LINEA_SEPOLIA"
  | "ZKSYNC_MAINNET"
  | "ZKSYNC_SEPOLIA"
  | "POLYGON_ZKEVM_MAINNET"
  | "POLYGON_ZKEVM_CARDONA"
  | "WEMIX_MAINNET"
  | "WEMIX_TESTNET"
  | "KROMA_MAINNET"
  | "KROMA_SEPOLIA"
  | "MODE_MAINNET"
  | "MODE_SEPOLIA"
  | "SONEIUM_MAINNET"
  | "SONEIUM_MINATO"
  | "ASTAR_MAINNET"
  | "ASTAR_SHIBUYA"
  | "ZIRCUIT_MAINNET"
  | "ZIRCUIT_TESTNET"
  | "MANTLE_MAINNET"
  | "MANTLE_SEPOLIA"
  | "RONIN_MAINNET"
  | "RONIN_SAIGON"
  | "BSQUARED_MAINNET"
  | "BSQUARED_TESTNET"
  | "SHIBARIUM_MAINNET"
  | "SHIBARIUM_PUPPYNET"
  | "SONIC_MAINNET"
  | "SONIC_BLAZE"
  | "BOB_MAINNET"
  | "BOB_SEPOLIA"
  | "WORLD_MAINNET"
  | "WORLD_SEPOLIA"
  | "XLAYER_MAINNET"
  | "XLAYER_TESTNET"
  | "BITLAYER_MAINNET"
  | "BITLAYER_TESTNET"
  | "INK_MAINNET"
  | "INK_SEPOLIA"
  | "HASHKEY_MAINNET"
  | "HASHKEY_TESTNET"
  | "CORN_MAINNET"
  | "CORN_TESTNET"
  | "BOTANIX_TESTNET"
  | "SEI_MAINNET"
  | "SEI_TESTNET"

export type ExplorerInfo = {
  baseUrl: string
  queryParameters?: {
    [key: string]: string
  }
}

export type ChainInfo = {
  chainId: number
  title: string
  explorer: ExplorerInfo
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export type Chains = Record<
  SupportedTechnology,
  {
    title: string
    icon: string
    chains: Partial<Record<SupportedChain, ChainInfo>>
  }
>
