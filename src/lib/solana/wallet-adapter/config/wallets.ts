import { SolflareWalletAdapter, CoinbaseWalletAdapter, TrustWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { getNetworkConfig } from "./networks.ts"

export function getWalletAdapters() {
  const adapters = [new SolflareWalletAdapter(), new CoinbaseWalletAdapter(), new TrustWalletAdapter()]

  return adapters
}

export function getEndpoint(network: WalletAdapterNetwork): string {
  const networkConfig = getNetworkConfig(network)
  return networkConfig.endpoint
}
