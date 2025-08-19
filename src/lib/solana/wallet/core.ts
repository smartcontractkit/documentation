import type { UiWalletAccount, UiWallet } from "@wallet-standard/react"
import { StandardConnect } from "@wallet-standard/features"
import {
  SolanaSignMessage,
  SolanaSignTransaction,
  SolanaSignAndSendTransaction,
} from "@solana/wallet-standard-features"

/**
 * Solana wallet capabilities
 */
export interface SolanaCapabilities {
  connect: boolean
  signMessage: boolean
  signTransaction: boolean
  signAndSend: boolean
}

/**
 * Wallet Standard feature interface
 */
export interface WalletStandardFeature {
  connect?: (options?: { silent?: boolean }) => Promise<{ accounts: UiWalletAccount[] }>
  signMessage?: (input: {
    account: UiWalletAccount
    message: Uint8Array
    display?: "utf8" | "hex"
  }) => Promise<[{ signature: Uint8Array }]>
  signTransaction?: (input: {
    account: UiWalletAccount
    transaction: Uint8Array
  }) => Promise<[{ signedTransaction: Uint8Array }]>
  signAndSendTransaction?: (input: {
    account: UiWalletAccount
    transaction: Uint8Array
  }) => Promise<[{ signature: string }]>
  on?: (event: string, callback: (data: unknown) => void) => () => void
  [key: string]: unknown // Allow other wallet-specific features
}

/**
 * Unified wallet handle with stable ID
 */
export interface WalletHandle {
  id: string // Stable ID for localStorage/React keys
  name: string
  icon?: string
  accounts: UiWalletAccount[]
  features: UiWallet["features"]
  _original: UiWallet & { features: Record<string, WalletStandardFeature | undefined> }
}

/**
 * Creates a stable wallet ID to avoid duplicate keys
 */
export function createWalletId(wallet: {
  name?: string
  icon?: string
  url?: string
  accounts?: readonly UiWalletAccount[]
}): string {
  const name = wallet.name || "unknown"
  const icon = wallet.icon || ""
  const url = wallet.url || ""
  const accountCount = wallet.accounts?.length || 0
  const firstAccount = wallet.accounts?.[0]?.address?.slice(0, 8) || "no-account"
  return (name + "::" + icon + "::" + url + "::" + accountCount + "::" + firstAccount).toLowerCase()
}

/**
 * Converts discovered wallets to WalletHandles with stable IDs
 * Works directly with UiWallet from @wallet-standard/react
 */
export function createWalletHandles(discoveredWallets: readonly UiWallet[]): WalletHandle[] {
  const handles = discoveredWallets.map((w, index) => {
    const baseId = createWalletId(w)
    const uniqueId = `${baseId}::${index}`

    return {
      id: uniqueId,
      name: w.name || "Unknown Wallet",
      icon: w.icon,
      features: w.features,
      accounts: w.accounts ? [...w.accounts] : [],
      _original: w as UiWallet & { features: Record<string, WalletStandardFeature | undefined> },
    }
  })

  // Deduplicate wallets by name, keeping the best one
  return deduplicateWalletsByName(handles)
}

/**
 * Deduplicate wallets by name, keeping the one with the best capabilities
 */
function deduplicateWalletsByName(wallets: WalletHandle[]): WalletHandle[] {
  const walletGroups = new Map<string, WalletHandle[]>()

  // Group wallets by name
  wallets.forEach((wallet) => {
    const name = wallet.name.toLowerCase()
    const existingGroup = walletGroups.get(name)
    if (existingGroup) {
      existingGroup.push(wallet)
    } else {
      walletGroups.set(name, [wallet])
    }
  })

  // For each group, pick the best wallet
  const result: WalletHandle[] = []
  walletGroups.forEach((group) => {
    if (group.length === 1) {
      result.push(group[0])
    } else {
      // Pick the wallet with the most capabilities and accounts
      const best = group.reduce((best, current) => {
        const bestCaps = getCapabilities(best)
        const currentCaps = getCapabilities(current)

        const bestScore = scoreWallet(best, bestCaps)
        const currentScore = scoreWallet(current, currentCaps)

        return currentScore > bestScore ? current : best
      })
      result.push(best)
    }
  })

  return result
}

/**
 * Score a wallet based on capabilities and accounts (higher is better)
 */
function scoreWallet(wallet: WalletHandle, caps: SolanaCapabilities): number {
  let score = 0
  score += caps.connect ? 10 : 0
  score += caps.signMessage ? 20 : 0
  score += caps.signTransaction ? 15 : 0
  score += caps.signAndSend ? 15 : 0
  score += wallet.accounts.length * 5 // Bonus for having accounts
  return score
}

/**
 * Get wallet capabilities for feature detection
 */
export function getCapabilities(wallet: WalletHandle): SolanaCapabilities {
  return {
    connect: wallet.features.includes(StandardConnect),
    signMessage: wallet.features.includes(SolanaSignMessage),
    signTransaction: wallet.features.includes(SolanaSignTransaction),
    signAndSend: wallet.features.includes(SolanaSignAndSendTransaction),
  }
}

/**
 * Filter wallets that support Solana and minimum capabilities
 */
export function getCompatibleWallets(
  wallets: WalletHandle[],
  requirements: Partial<SolanaCapabilities> = { connect: true }
): WalletHandle[] {
  return wallets.filter((wallet) => {
    const caps = getCapabilities(wallet)

    // Must have at least one Solana account or be able to connect
    const hasSolanaSupport =
      wallet.accounts.some((account) => account.chains.some((chain) => chain.startsWith("solana:"))) || caps.connect

    if (!hasSolanaSupport) return false

    // Check requirements (with special handling for message signing)
    return Object.entries(requirements).every(([capability, required]) => {
      if (!required) return true

      if (capability === "signMessage") {
        // Accept if: has Wallet Standard signing OR is Phantom (native API)
        const hasWalletStandardSigning = caps.signMessage
        const isPhantom = wallet.name.toLowerCase().includes("phantom")
        return hasWalletStandardSigning || isPhantom
      }

      return caps[capability as keyof SolanaCapabilities]
    })
  })
}

/**
 * Connect to a wallet using Wallet Standard
 */
export async function connect(wallet: WalletHandle): Promise<{ accounts: UiWalletAccount[] }> {
  if (!wallet.features.includes(StandardConnect)) {
    throw new Error(`${wallet.name} missing standard:connect feature`)
  }

  const connectFeature = wallet._original.features[StandardConnect]
  if (!connectFeature?.connect) {
    throw new Error(`${wallet.name} connect feature not properly implemented`)
  }

  try {
    const result = await connectFeature.connect({ silent: false })
    return result as { accounts: UiWalletAccount[] }
  } catch (error) {
    throw new Error(`Failed to connect to ${wallet.name}: ${error}`)
  }
}

/**
 * Sign a message with unified fallbacks
 */
export async function signMessage(
  wallet: WalletHandle,
  account: UiWalletAccount,
  message: Uint8Array
): Promise<Uint8Array> {
  // Try Wallet Standard solana:signMessage feature first
  const signMessageFeature = wallet._original.features[SolanaSignMessage]
  if (signMessageFeature?.signMessage) {
    try {
      const [result] = await signMessageFeature.signMessage({
        account,
        message,
        display: "utf8",
      })
      return result.signature as Uint8Array
    } catch (error) {
      // Fall through to Phantom fallback
    }
  }

  // Phantom native API fallback
  interface PhantomSolana {
    signMessage: (message: Uint8Array, display: "utf8" | "hex") => Promise<{ signature: Uint8Array }>
  }

  const phantom = (globalThis as { phantom?: { solana?: PhantomSolana } })?.phantom?.solana
  if (phantom?.signMessage && wallet.name.toLowerCase().includes("phantom")) {
    try {
      const result = await phantom.signMessage(message, "utf8")
      return result.signature as Uint8Array
    } catch (error) {
      throw new Error(`Phantom signing failed: ${error}`)
    }
  }

  throw new Error(`${wallet.name} does not support message signing`)
}

/**
 * Sign a transaction
 */
export async function signTransaction(
  wallet: WalletHandle,
  account: UiWalletAccount,
  transaction: Uint8Array
): Promise<Uint8Array> {
  const signTxFeature = wallet._original.features[SolanaSignTransaction]
  if (!signTxFeature?.signTransaction) {
    throw new Error(`${wallet.name} does not support transaction signing`)
  }

  try {
    const [result] = await signTxFeature.signTransaction({
      account,
      transaction,
    })
    return result.signedTransaction as Uint8Array
  } catch (error) {
    throw new Error(`Transaction signing failed: ${error}`)
  }
}

/**
 * Sign and send a transaction
 */
export async function signAndSendTransaction(
  wallet: WalletHandle,
  account: UiWalletAccount,
  transaction: Uint8Array
): Promise<{ signature: string }> {
  const signAndSendFeature = wallet._original.features[SolanaSignAndSendTransaction]
  if (!signAndSendFeature?.signAndSendTransaction) {
    throw new Error(`${wallet.name} does not support sign and send`)
  }

  try {
    const [result] = await signAndSendFeature.signAndSendTransaction({
      account,
      transaction,
    })
    return { signature: result.signature as string }
  } catch (error) {
    throw new Error(`Sign and send failed: ${error}`)
  }
}

/**
 * Get the first Solana account from a wallet
 */
export function getFirstSolanaAccount(wallet: WalletHandle): UiWalletAccount | undefined {
  return wallet.accounts.find((account) => account.chains.some((chain) => chain.startsWith("solana:")))
}

/**
 * Capability requirement helpers
 */
export function requireCapabilities(
  wallet: WalletHandle | undefined,
  requirements: Partial<SolanaCapabilities>
): { missing: string[]; canProceed: boolean } {
  if (!wallet) {
    return { missing: ["wallet_selection"], canProceed: false }
  }

  const caps = getCapabilities(wallet)
  const missing: string[] = []

  Object.entries(requirements).forEach(([capability, required]) => {
    if (required && !caps[capability as keyof SolanaCapabilities]) {
      missing.push(capability)
    }
  })

  return { missing, canProceed: missing.length === 0 }
}
