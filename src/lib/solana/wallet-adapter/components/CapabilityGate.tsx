/** @jsxImportSource react */
import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"

interface CapabilityGateProps {
  children: React.ReactNode
  fallback: React.ReactNode
  className?: string
  requirements?: {
    connect?: boolean
    signMessage?: boolean
    signTransaction?: boolean
    signAndSend?: boolean
  }
}

export function CapabilityGate({
  children,
  fallback,
  className,
  requirements = { connect: true, signMessage: true },
}: CapabilityGateProps) {
  const { wallets } = useWallet()

  // Check if any INSTALLED wallet meets the requirements
  const hasCompatibleWallet = wallets.some((w) => {
    // First, check if wallet is actually installed (not just an adapter)
    const isInstalled = w.adapter.readyState === "Installed"
    if (!isInstalled) return false

    if (!requirements) return true

    // For installed wallets, be more lenient with capability detection
    // Many wallets show signMessage: false when disconnected but support it when connected
    const isStandardWalletAdapter = w.adapter.readyState === "Installed"

    // Check each requirement, but be lenient for Standard Wallet adapters
    if (requirements.connect && !w.adapter.connect) return false
    if (requirements.signMessage && !w.adapter.signMessage && !isStandardWalletAdapter) return false
    if (requirements.signTransaction && !w.adapter.signTransaction && !isStandardWalletAdapter) return false
    if (requirements.signAndSend && !w.adapter.sendTransaction) return false

    return true
  })

  // If no compatible wallets are available, show fallback
  if (!hasCompatibleWallet) {
    return <div className={className}>{fallback}</div>
  }

  // Compatible wallets found, render children
  return <div className={className}>{children}</div>
}

// Capability profile constants for common use cases
export const CAPABILITY_PROFILES = {
  MESSAGE_SIGNING: {
    connect: true,
    signMessage: true,
  },
  TRANSACTION_SIGNING: {
    connect: true,
    signMessage: true,
    signTransaction: true,
  },
  FULL_WALLET: {
    connect: true,
    signMessage: true,
    signTransaction: true,
    signAndSend: true,
  },
} as const
