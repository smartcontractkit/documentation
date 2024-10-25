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

export type SupportedChain =
  | "ETHEREUM_MAINNET"
  | "ETHEREUM_SEPOLIA"
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
  | "POLYGON_ZKEVM_TESTNET"
  | "WEMIX_MAINNET"
  | "WEMIX_TESTNET"
  | "KROMA_MAINNET"
  | "KROMA_SEPOLIA"
  | "MODE_MAINNET"
  | "MODE_SEPOLIA"
  | "SONEIUM_MINATO"

export type Chains = Record<
  SupportedTechnology,
  {
    title: string
    icon: string
    chains: Partial<
      Record<
        SupportedChain,
        {
          chainId: number
          title: string
          explorer: string
          nativeCurrency: {
            name: string
            symbol: string
            decimals: number
          }
        }
      >
    >
  }
>
