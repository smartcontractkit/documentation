/** @jsxImportSource react */
import React from "react"
import { useWallet, type Wallet } from "@solana/wallet-adapter-react"
import type { WalletReadyState } from "@solana/wallet-adapter-base"
import styles from "./WalletPicker.module.css"

// Default wallet icon - consistent with Chainlink design system
const DEFAULT_WALLET_ICON = "https://smartcontract.imgix.net/icons/wallet_filled.svg?auto=compress%2Cformat"

interface WalletPickerProps {
  className?: string
  onSelect?: (walletId: string) => void
  showCapabilities?: boolean
  requirements?: {
    connect?: boolean
    signMessage?: boolean
    signTransaction?: boolean
    signAndSend?: boolean
  }
}

export function WalletPicker({ className = "", onSelect, showCapabilities = false, requirements }: WalletPickerProps) {
  const { wallets, wallet: selectedWallet, select } = useWallet()

  // Remove duplicates and filter based on availability AND requirements
  const uniqueWallets = wallets.reduce<Wallet[]>((acc, wallet) => {
    const existingIndex = acc.findIndex((w) => w.adapter.name === wallet.adapter.name)
    if (existingIndex === -1) {
      acc.push(wallet)
    } else {
      // Keep the one with better readyState (Installed > Loadable > NotDetected)
      const existing = acc[existingIndex]
      const priority: Record<WalletReadyState, number> = {
        Installed: 3,
        Loadable: 2,
        NotDetected: 1,
        Unsupported: 0,
      }
      if ((priority[wallet.adapter.readyState] || 0) > (priority[existing.adapter.readyState] || 0)) {
        acc[existingIndex] = wallet
      }
    }
    return acc
  }, [])

  const compatibleWallets = uniqueWallets.filter((w) => {
    // Only show wallets that are actually installed (browser extensions)
    const isInstalled = w.adapter.readyState === "Installed"
    if (!isInstalled) return false

    if (!requirements) return true

    // For Standard Wallet adapters (readyState: 'Installed'), they often show signMessage: false
    // when disconnected but DO support signing once connected. Be less strict for these.
    const isStandardWalletAdapter = w.adapter.readyState === "Installed"

    // Check if wallet supports required capabilities
    const hasSignMessage = requirements.signMessage && !w.adapter.signMessage && !isStandardWalletAdapter
    const hasSignTransaction = requirements.signTransaction && !w.adapter.signTransaction && !isStandardWalletAdapter
    const hasSignAndSend = requirements.signAndSend && !w.adapter.sendTransaction

    const passes = !hasSignMessage && !hasSignTransaction && !hasSignAndSend

    return passes
  })

  if (compatibleWallets.length === 0) {
    return (
      <div className={`${styles.noWallets} ${className}`}>
        <p className={styles.noWalletsText}>No compatible wallets detected.</p>
        <p className={styles.noWalletsHelp}>Install Phantom, Solflare, or Backpack and refresh the page.</p>
      </div>
    )
  }

  return (
    <div className={`${styles.walletPicker} ${className}`} role="listbox" aria-label="Choose a wallet">
      {compatibleWallets.map((w) => {
        const isSelected = selectedWallet?.adapter.name === w.adapter.name
        const walletName = w.adapter.name
        const walletIcon = w.adapter.icon || DEFAULT_WALLET_ICON

        return (
          <button
            key={w.adapter.name}
            role="option"
            aria-selected={isSelected}
            onClick={() => {
              select(w.adapter.name)
              onSelect?.(walletName)
            }}
            className={`${styles.walletButton} ${isSelected ? styles.selected : ""}`}
          >
            <img src={walletIcon} alt={`${walletName} wallet icon`} className={styles.walletIcon} />
            <span className={styles.walletName}>{walletName}</span>
            {showCapabilities && w.adapter.signMessage && <div className={styles.capabilityIndicator}>✓</div>}
          </button>
        )
      })}
    </div>
  )
}
