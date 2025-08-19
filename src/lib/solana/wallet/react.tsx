/** @jsxImportSource react */
import { createContext, useContext, useMemo, useEffect, useState, useCallback, type ReactNode } from "react"
import { useWallets } from "@wallet-standard/react"
import { StandardEvents } from "@wallet-standard/features"
import type { UiWalletAccount } from "@wallet-standard/react"
import * as Core from "./core.ts"

/**
 * Wallet context state
 */
interface WalletContextState {
  // Wallet discovery and selection
  wallets: Core.WalletHandle[]
  compatibleWallets: Core.WalletHandle[]
  chosen?: Core.WalletHandle
  account?: UiWalletAccount

  // Connection state
  isConnected: boolean
  isConnecting: boolean

  // Actions
  setChosenId: (id: string | null) => void
  connectChosen: () => Promise<void>
  disconnect: () => void

  // Capabilities
  capabilities?: Core.SolanaCapabilities

  // Signing methods
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  signTransaction: (transaction: Uint8Array) => Promise<Uint8Array>
  signAndSend: (transaction: Uint8Array) => Promise<{ signature: string }>
}

const WalletContext = createContext<WalletContextState | null>(null)

const STORAGE_KEY = "solana.wallet.selectedId"

/**
 * Solana Wallet Provider
 * Manages wallet discovery, selection, connection, and capabilities
 */
export function SolanaWalletProvider({
  children,
  requirements = { connect: true },
}: {
  children: ReactNode
  requirements?: Partial<Core.SolanaCapabilities>
}) {
  const discoveredWallets = useWallets()

  // Convert to stable wallet handles
  const wallets = useMemo<Core.WalletHandle[]>(() => {
    return Core.createWalletHandles(discoveredWallets)
  }, [discoveredWallets])

  // Filter compatible wallets based on requirements
  const compatibleWallets = useMemo(() => {
    return Core.getCompatibleWallets(wallets, requirements)
  }, [wallets, requirements])

  // Wallet selection state
  const [chosenId, setChosenId] = useState<string | null>(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(STORAGE_KEY)
    }
    return null
  })

  const chosen = useMemo(() => {
    return wallets.find((wallet) => wallet.id === chosenId)
  }, [wallets, chosenId])

  // Account state
  const [account, setAccount] = useState<UiWalletAccount | undefined>()
  const [isConnecting, setIsConnecting] = useState(false)

  // Capabilities
  const capabilities = useMemo(() => {
    return chosen ? Core.getCapabilities(chosen) : undefined
  }, [chosen])

  const isConnected = Boolean(chosen && account)

  // Persist wallet selection
  const setChosenIdPersisted = useCallback((id: string | null) => {
    setChosenId(id)
    if (typeof localStorage !== "undefined") {
      if (id) {
        localStorage.setItem(STORAGE_KEY, id)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Listen for wallet events (account changes, disconnection)
  useEffect(() => {
    if (!chosen) return

    const events = chosen.features[StandardEvents]
    if (!events?.on) return

    const handleChange = ({ accounts }: { accounts?: UiWalletAccount[] }) => {
      const solanaAccount = accounts?.find((acc) => acc.chains.some((chain) => chain.startsWith("solana:")))
      setAccount(solanaAccount)

      // If no accounts, consider disconnected
      if (!accounts || accounts.length === 0) {
        setAccount(undefined)
      }
    }

    const unsubscribe = events.on("change", handleChange)
    return () => unsubscribe?.()
  }, [chosen])

  // Set initial account when wallet is chosen
  useEffect(() => {
    if (!chosen) {
      setAccount(undefined)
      return
    }

    const solanaAccount = Core.getFirstSolanaAccount(chosen)
    setAccount(solanaAccount)
  }, [chosen])

  // Connect to chosen wallet
  const connectChosen = useCallback(async () => {
    if (!chosen) {
      throw new Error("No wallet selected. Please choose a wallet first.")
    }

    setIsConnecting(true)

    try {
      const { accounts } = await Core.connect(chosen)
      const solanaAccount = accounts.find((acc) => acc.chains.some((chain) => chain.startsWith("solana:")))

      if (!solanaAccount) {
        throw new Error("No Solana account found in wallet")
      }

      setAccount(solanaAccount)
    } catch (error) {
      console.error("Connection failed:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [chosen])

  // Disconnect
  const disconnect = useCallback(() => {
    setAccount(undefined)
    setChosenIdPersisted(null)
  }, [setChosenIdPersisted])

  // Signing methods with proper error handling
  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      if (!chosen || !account) {
        throw new Error("No wallet connected. Please connect a wallet first.")
      }

      if (!capabilities?.signMessage) {
        throw new Error(`${chosen.name} does not support message signing`)
      }

      return Core.signMessage(chosen, account, message)
    },
    [chosen, account, capabilities]
  )

  const signTransaction = useCallback(
    async (transaction: Uint8Array): Promise<Uint8Array> => {
      if (!chosen || !account) {
        throw new Error("No wallet connected. Please connect a wallet first.")
      }

      if (!capabilities?.signTransaction) {
        throw new Error(`${chosen.name} does not support transaction signing`)
      }

      return Core.signTransaction(chosen, account, transaction)
    },
    [chosen, account, capabilities]
  )

  const signAndSend = useCallback(
    async (transaction: Uint8Array): Promise<{ signature: string }> => {
      if (!chosen || !account) {
        throw new Error("No wallet connected. Please connect a wallet first.")
      }

      if (!capabilities?.signAndSend) {
        throw new Error(`${chosen.name} does not support sign and send`)
      }

      return Core.signAndSendTransaction(chosen, account, transaction)
    },
    [chosen, account, capabilities]
  )

  const contextValue: WalletContextState = {
    wallets,
    compatibleWallets,
    chosen,
    account,
    isConnected,
    isConnecting,
    setChosenId: setChosenIdPersisted,
    connectChosen,
    disconnect,
    capabilities,
    signMessage,
    signTransaction,
    signAndSend,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

/**
 * Hook to access wallet context
 */
export function useSolanaWallet(): WalletContextState {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useSolanaWallet must be used within a SolanaWalletProvider")
  }
  return context
}

/**
 * Hook for capability requirements with helpful error messages
 */
export function useCapabilityCheck(requirements: Partial<Core.SolanaCapabilities>) {
  const { chosen, capabilities } = useSolanaWallet()

  return useMemo(() => {
    if (!chosen) {
      return {
        canProceed: false,
        missing: ["wallet_selection"],
        message: "Please select and connect a wallet to continue.",
      }
    }

    if (!capabilities) {
      return {
        canProceed: false,
        missing: ["capabilities_unknown"],
        message: "Unable to determine wallet capabilities.",
      }
    }

    const missing: string[] = []
    const missingFeatures: string[] = []

    Object.entries(requirements).forEach(([capability, required]) => {
      if (required && !capabilities[capability as keyof Core.SolanaCapabilities]) {
        missing.push(capability)
        missingFeatures.push(
          capability === "signMessage"
            ? "message signing"
            : capability === "signTransaction"
              ? "transaction signing"
              : capability === "signAndSend"
                ? "sign and send"
                : capability
        )
      }
    })

    const canProceed = missing.length === 0
    const message = canProceed
      ? "Wallet supports all required features."
      : `${chosen.name} does not support: ${missingFeatures.join(", ")}. Please choose a different wallet.`

    return { canProceed, missing, message }
  }, [chosen, capabilities, requirements])
}

/**
 * Hook for wallet connection status
 */
export function useWalletConnection() {
  const { chosen, account, isConnected, isConnecting, connectChosen, disconnect } = useSolanaWallet()

  return {
    wallet: chosen,
    account,
    isConnected,
    isConnecting,
    connect: connectChosen,
    disconnect,
    // Helper for displaying connection status
    status: isConnecting ? "connecting" : isConnected ? "connected" : chosen ? "selected" : "none",
  }
}
