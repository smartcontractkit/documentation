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
  | "CELO"
  | "POLYGON_ZKEVM"
  | "LINEA"
  | "SCROLL"

export type SupportedChain =
  | "ETHEREUM_MAINNET"
  | "ETHEREUM_SEPOLIA"
  | "ETHEREUM_GOERLI"
  | "BNB_MAINNET"
  | "BNB_TESTNET"
  | "POLYGON_MAINNET"
  | "POLYGON_MUMBAI"
  | "GNOSIS_MAINNET"
  | "AVALANCHE_MAINNET"
  | "AVALANCHE_FUJI"
  | "FANTOM_MAINNET"
  | "FANTOM_TESTNET"
  | "ARBITRUM_MAINNET"
  | "ARBITRUM_SEPOLIA"
  | "ARBITRUM_GOERLI"
  | "OPTIMISM_MAINNET"
  | "OPTIMISM_GOERLI"
  | "MOONRIVER_MAINNET"
  | "MOONBEAM_MAINNET"
  | "METIS_MAINNET"
  | "BASE_MAINNET"
  | "BASE_GOERLI"
  | "CELO_MAINNET"
  | "CELO_ALFAJORES"
  | "SCROLL_MAINNET"
  | "SCROLL_SEPOLIA"
  | "LINEA_MAINNET"
  | "LINEA_GOERLI"
  | "ZKSYNC_MAINNET"
  | "ZKSYNC_GOERLI"
  | "POLYGON_ZKEVM_MAINNET"
  | "POLYGON_ZKEVM_TESTNET"

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
