import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase"
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust"
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
