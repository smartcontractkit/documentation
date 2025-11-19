import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

export interface NetworkConfig {
  name: WalletAdapterNetwork
  endpoint: string
  chainId: string
  displayName: string
}

const SUPPORTED_NETWORKS: NetworkConfig[] = [
  {
    name: WalletAdapterNetwork.Devnet,
    endpoint: "https://api.devnet.solana.com",
    chainId: "solana:devnet",
    displayName: "Solana Devnet",
  },
  {
    name: WalletAdapterNetwork.Testnet,
    endpoint: "https://api.testnet.solana.com",
    chainId: "solana:testnet",
    displayName: "Solana Testnet",
  },
  {
    name: WalletAdapterNetwork.Mainnet,
    endpoint: "https://api.mainnet-beta.solana.com",
    chainId: "solana:mainnet-beta",
    displayName: "Solana Mainnet",
  },
]

export function getNetworkConfig(network: WalletAdapterNetwork): NetworkConfig {
  const config = SUPPORTED_NETWORKS.find((n) => n.name === network)
  if (!config) {
    throw new Error(`Unsupported network: ${network}`)
  }
  return config
}

export function getDefaultNetwork(): WalletAdapterNetwork {
  return WalletAdapterNetwork.Devnet
}
