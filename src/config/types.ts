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
  | "POLYGON_ZKEVM"
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
  | "POLYGON_ZKEVM_TESTNET"
  | "SCROLL_SEPOLIA"

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
        }
      >
    >
  }
>
