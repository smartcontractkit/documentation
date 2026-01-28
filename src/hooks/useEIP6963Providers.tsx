/** @jsxImportSource react */
import { useState, useEffect, useMemo } from "react"
import { EIP1193Provider } from "../features/utils/EIP1193Interface.ts"

/**
 * EIP-6963 Provider Discovery Hook
 * Discovers all injected wallet providers and provides reliable MetaMask selection
 * Solves multi-wallet injection conflicts (Phantom vs MetaMask)
 */

/**
 * EIP-6963 Provider Info
 * Metadata about the wallet provider
 */
export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns?: string
}

/**
 * EIP-6963 Provider Detail
 * Complete provider information including the actual provider instance
 */
export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: EIP1193Provider
}

/**
 * EIP-6963 Announce Event
 * Custom event structure for provider announcements
 */
interface EIP6963AnnounceEvent extends CustomEvent {
  type: "eip6963:announceProvider"
  detail: EIP6963ProviderDetail
}

/**
 * Extended Window interface with Ethereum provider
 * Safely types the global window.ethereum property
 */
interface WindowWithEthereum extends Window {
  ethereum?: EIP1193Provider
}

/**
 * Hook to discover all EIP-6963 compliant wallet providers
 */
export function useInjectedProviders(): EIP6963ProviderDetail[] {
  const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([])

  useEffect(() => {
    // ✅ SSR Guard: Only run in browser
    if (typeof window === "undefined") return

    const onAnnounce = (event: EIP6963AnnounceEvent) => {
      const detail = event.detail
      setProviders((prev) => {
        // Avoid duplicates based on UUID
        const exists = prev.some((p) => p.info.uuid === detail.info.uuid)
        return exists ? prev : [...prev, detail]
      })
    }

    // Listen for provider announcements
    window.addEventListener("eip6963:announceProvider", onAnnounce as EventListener)

    // Request all providers to announce themselves
    window.dispatchEvent(new Event("eip6963:requestProvider"))

    return () => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce as EventListener)
    }
  }, [])

  return providers
}

/**
 * Hook to get MetaMask provider specifically using EIP-6963 with legacy fallback
 * This prevents Phantom from hijacking MetaMask calls
 */
export function useMetaMaskProvider() {
  const providers = useInjectedProviders()

  return useMemo(() => {
    // ✅ SSR Guard: Return null during server-side rendering
    if (typeof window === "undefined") return null

    // ✅ PREFERRED: EIP-6963 strict match on rdns
    const metaMaskFromEIP6963 = providers.find((p) => p.info?.rdns === "io.metamask")?.provider

    if (metaMaskFromEIP6963) {
      return metaMaskFromEIP6963
    }

    // ✅ FALLBACK: Legacy detection for older MetaMask versions
    const ethereum = (window as WindowWithEthereum).ethereum
    if (!ethereum) return null

    // Check for multiple providers array
    if (Array.isArray(ethereum.providers)) {
      const metaMask = ethereum.providers.find((p) => p?.isMetaMask)
      if (metaMask) {
        return metaMask
      }
    }

    // Direct MetaMask check (least reliable due to Phantom injection)
    if (ethereum?.isMetaMask) {
      return ethereum
    }
    return null
  }, [providers])
}

/**
 * Hook to get available wallet providers for user selection
 */
export function useWalletSelector() {
  const providers = useInjectedProviders()

  const walletOptions = useMemo(() => {
    return providers.map((provider) => ({
      uuid: provider.info.uuid,
      name: provider.info.name,
      icon: provider.info.icon,
      rdns: provider.info.rdns,
      provider: provider.provider,
      isMetaMask: provider.info.rdns === "io.metamask",
      isPhantom: provider.info.rdns === "app.phantom",
    }))
  }, [providers])

  return {
    walletOptions,
    metaMask: walletOptions.find((w) => w.isMetaMask)?.provider || null,
    phantom: walletOptions.find((w) => w.isPhantom)?.provider || null,
  }
}
