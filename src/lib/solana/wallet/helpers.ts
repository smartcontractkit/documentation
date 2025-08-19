/**
 * Wallet Helper Utilities
 *
 * Feature-gated helpers and capability requirements for different use cases.
 * These help pages determine what they can do and provide helpful error messages.
 */

import type { SolanaCapabilities, WalletHandle } from "./core.ts"
import { getCapabilities } from "./core.ts"

/**
 * Common capability requirement profiles for different use cases
 */
export const CAPABILITY_PROFILES = {
  // For SIWS authentication and message signing
  MESSAGE_SIGNING: {
    connect: true,
    signMessage: true,
  } as const,

  // For transaction tutorials (sign only)
  TRANSACTION_SIGNING: {
    connect: true,
    signTransaction: true,
  } as const,

  // For full dApp integration (sign and send)
  FULL_INTEGRATION: {
    connect: true,
    signMessage: true,
    signTransaction: true,
    signAndSend: true,
  } as const,

  // For simple connection demos
  BASIC_CONNECTION: {
    connect: true,
  } as const,
} as const

/**
 * Error types for normalized error handling
 */
export enum WalletErrorType {
  WALLET_NOT_FOUND = "WALLET_NOT_FOUND",
  CAPABILITY_MISSING = "CAPABILITY_MISSING",
  USER_REJECTED = "USER_REJECTED",
  CONNECTION_FAILED = "CONNECTION_FAILED",
  SIGNING_FAILED = "SIGNING_FAILED",
  RPC_FAILED = "RPC_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Normalized wallet error with helpful messages
 */
export class WalletError extends Error {
  constructor(
    public type: WalletErrorType,
    message: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = "WalletError"
  }
}

/**
 * Normalize thrown errors into structured WalletError
 */
export function normalizeWalletError(error: unknown): WalletError {
  if (error instanceof WalletError) {
    return error
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes("user rejected") || message.includes("user denied")) {
      return new WalletError(WalletErrorType.USER_REJECTED, "Transaction was rejected by the user", error)
    }

    if (message.includes("wallet not found") || message.includes("no wallet")) {
      return new WalletError(
        WalletErrorType.WALLET_NOT_FOUND,
        "No compatible wallet found. Please install Phantom, Solflare, or another Solana wallet.",
        error
      )
    }

    if (message.includes("does not support") || message.includes("missing")) {
      return new WalletError(
        WalletErrorType.CAPABILITY_MISSING,
        "The selected wallet does not support this feature. Please choose a different wallet.",
        error
      )
    }

    if (message.includes("connection") || message.includes("connect")) {
      return new WalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Failed to connect to wallet. Please try again or refresh the page.",
        error
      )
    }

    if (message.includes("sign") || message.includes("signature")) {
      return new WalletError(WalletErrorType.SIGNING_FAILED, "Failed to sign transaction. Please try again.", error)
    }

    if (message.includes("rpc") || message.includes("network")) {
      return new WalletError(
        WalletErrorType.RPC_FAILED,
        "Network error. Please check your connection and try again.",
        error
      )
    }

    return new WalletError(WalletErrorType.UNKNOWN_ERROR, error.message, error)
  }

  return new WalletError(WalletErrorType.UNKNOWN_ERROR, "An unknown error occurred", error)
}

/**
 * Get user-friendly error messages for different error types
 */
export function getErrorMessage(errorType: WalletErrorType): string {
  switch (errorType) {
    case WalletErrorType.WALLET_NOT_FOUND:
      return "No compatible wallet found. Please install Phantom, Solflare, or Backpack wallet."

    case WalletErrorType.CAPABILITY_MISSING:
      return "Your wallet doesn't support this feature. Try Phantom or Solflare for full compatibility."

    case WalletErrorType.USER_REJECTED:
      return "Transaction was cancelled. Please try again if you want to proceed."

    case WalletErrorType.CONNECTION_FAILED:
      return "Failed to connect to your wallet. Please refresh and try again."

    case WalletErrorType.SIGNING_FAILED:
      return "Failed to sign the transaction. Please check your wallet and try again."

    case WalletErrorType.RPC_FAILED:
      return "Network connection issue. Please check your internet and try again."

    default:
      return "Something went wrong. Please refresh the page and try again."
  }
}

/**
 * Analytics event helpers for tracking wallet interactions
 */
export interface WalletAnalyticsMetadata {
  walletId?: string
  timestamp?: string
  capability?: string
  chainId?: string
  accountAddress?: string
  transactionHash?: string
  errorCode?: string
  duration?: number
  userAgent?: string
  [key: string]: string | number | boolean | undefined
}

export interface WalletAnalyticsEvent {
  action: string
  wallet?: string
  capability?: string
  success: boolean
  error?: string
  metadata?: WalletAnalyticsMetadata
}

/**
 * Create analytics events for wallet interactions
 */
export function createWalletAnalyticsEvent(
  action: string,
  wallet?: WalletHandle,
  success = true,
  error?: unknown,
  metadata?: WalletAnalyticsMetadata
): WalletAnalyticsEvent {
  return {
    action,
    wallet: wallet?.name,
    success,
    error: error instanceof Error ? error.message : undefined,
    metadata: {
      walletId: wallet?.id,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  }
}

/**
 * Capability requirement checker with detailed feedback
 */
export function checkCapabilityRequirements(
  wallet: WalletHandle | undefined,
  requirements: Partial<SolanaCapabilities>
): {
  canProceed: boolean
  missing: string[]
  recommendations: string[]
  severity: "info" | "warning" | "error"
} {
  if (!wallet) {
    return {
      canProceed: false,
      missing: ["wallet_selection"],
      recommendations: ["Please select a wallet to continue"],
      severity: "warning",
    }
  }

  const capabilities = getCapabilities(wallet)
  const missing: string[] = []
  const recommendations: string[] = []

  Object.entries(requirements).forEach(([capability, required]) => {
    if (required && !capabilities[capability as keyof SolanaCapabilities]) {
      missing.push(capability)

      switch (capability) {
        case "signMessage":
          recommendations.push("Try Phantom or Solflare for message signing support")
          break
        case "signTransaction":
          recommendations.push("Use Phantom, Solflare, or Backpack for transaction signing")
          break
        case "signAndSend":
          recommendations.push("Phantom and Backpack support sign & send transactions")
          break
      }
    }
  })

  const canProceed = missing.length === 0
  const severity = missing.length > 0 ? "error" : "info"

  if (canProceed) {
    recommendations.push(`${wallet.name} supports all required features!`)
  }

  return { canProceed, missing, recommendations, severity }
}

/**
 * Wallet recommendation engine
 */
export function getWalletRecommendations(requirements: Partial<SolanaCapabilities>): {
  recommended: string[]
  description: string
} {
  const { signMessage, signTransaction, signAndSend } = requirements

  if (signAndSend) {
    return {
      recommended: ["Phantom", "Backpack"],
      description: "For full transaction capabilities including sign & send",
    }
  }

  if (signTransaction) {
    return {
      recommended: ["Phantom", "Solflare", "Backpack"],
      description: "For transaction signing and dApp interactions",
    }
  }

  if (signMessage) {
    return {
      recommended: ["Phantom", "Solflare"],
      description: "For message signing and authentication",
    }
  }

  return {
    recommended: ["Phantom", "Solflare", "Backpack"],
    description: "Popular Solana wallets with broad feature support",
  }
}

/**
 * Utility to format capability names for display
 */
export function formatCapabilityName(capability: keyof SolanaCapabilities): string {
  switch (capability) {
    case "connect":
      return "Wallet Connection"
    case "signMessage":
      return "Message Signing"
    case "signTransaction":
      return "Transaction Signing"
    case "signAndSend":
      return "Sign & Send Transactions"
    default:
      return capability
  }
}

/**
 * Check if wallet is likely to support a feature based on name/type
 */
export function predictWalletCapabilities(walletName: string): Partial<SolanaCapabilities> {
  const name = walletName.toLowerCase()

  // Known wallet capabilities
  if (name.includes("phantom")) {
    return { connect: true, signMessage: true, signTransaction: true, signAndSend: true }
  }

  if (name.includes("solflare")) {
    return { connect: true, signMessage: true, signTransaction: true, signAndSend: false }
  }

  if (name.includes("backpack")) {
    return { connect: true, signMessage: true, signTransaction: true, signAndSend: true }
  }

  // Default assumption for unknown wallets
  return { connect: true, signMessage: false, signTransaction: false, signAndSend: false }
}
