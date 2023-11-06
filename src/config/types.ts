export type SupportedTechnology =
  | "ETHEREUM"
  | "BNB"
  | "POLYGON"
  | "GNOSIS"
  | "AVALANCHE"
  | "FANTOM"
  | "ARBITRUM"
  | "OPTIMISM"
  | "HARMONY"
  | "MOONRIVER"
  | "MOONBEAM"
  | "METIS"
  | "BASE"
  | "CELO"
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
  | "ARBITRUM_GOERLI"
  | "OPTIMISM_MAINNET"
  | "OPTIMISM_GOERLI"
  | "HARMONY_MAINNET"
  | "MOONRIVER_MAINNET"
  | "MOONBEAM_MAINNET"
  | "METIS_MAINNET"
  | "BASE_MAINNET"
  | "BASE_GOERLI"
  | "CELO_MAINNET"
  | "CELO_ALFAJORES"
  | "SCROLL_SEPOLIA"
  | "LINEA_MAINNET"
  | "LINEA_GOERLI"

export type Chains = Record<
  SupportedTechnology,
  {
    title: string
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
