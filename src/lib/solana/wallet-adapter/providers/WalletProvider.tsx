/** @jsxImportSource react */
import { useMemo, type ReactNode } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { getWalletAdapters, getEndpoint } from "../config/wallets.ts"
import { getDefaultNetwork } from "../config/networks.ts"
import "@solana/wallet-adapter-react-ui/styles.css"

export interface EnhancedWalletProviderProps {
  children: ReactNode
  network?: WalletAdapterNetwork
  autoConnect?: boolean
}

export function EnhancedWalletProvider({
  children,
  network = getDefaultNetwork(),
  autoConnect = true,
}: EnhancedWalletProviderProps) {
  const endpoint = useMemo(() => getEndpoint(network), [network])
  const wallets = useMemo(() => {
    const adapters = getWalletAdapters()

    return adapters
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
