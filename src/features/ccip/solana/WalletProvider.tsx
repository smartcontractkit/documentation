/** @jsxImportSource react */
import { FC, PropsWithChildren, useMemo } from "react"
import { WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"

/**
 * Simplified Solana Wallet Provider for signature-only operations
 * No RPC connection needed - only handles wallet connection and message signing
 */
export const SolanaWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallets = useMemo(() => {
    // Empty array - Wallet Standard automatically discovers all compatible wallets
    // Phantom, Solflare, Backpack, etc. will appear in the wallet selection modal
    return []
  }, [])

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  )
}
