import { atom } from "nanostores"
import type { ChainType } from "~/config/types.js"
import { DEFAULT_CHAIN_TYPE, CHAIN_TYPE_STORAGE_KEY, CHAIN_TYPE_CONFIGS, GA_EVENTS } from "~/config/chainTypes.js"

/**
 * Global state for selected chain type
 * Reactive store that drives sidebar filtering and UI updates
 */
export const selectedChainType = atom<ChainType>(DEFAULT_CHAIN_TYPE)

/**
 * Smart initialization: Auto-detect from URL path, then localStorage, then default
 * Priority order:
 * 1. URL path detection (explicit chain segment, e.g. /ccip/canton/... → canton, persisted to localStorage)
 * 2. LocalStorage (previous selection or last detected chain)
 * 3. Default (EVM)
 *
 * Note: URL detection updates localStorage to maintain context on generic pages
 */
export function initializeChainType(): void {
  if (typeof window === "undefined") return

  // Priority 1: Detect from current URL path
  const pathname = window.location.pathname
  const detectedChain = detectChainFromPath(pathname)

  if (detectedChain) {
    // Persist BEFORE notifying subscribers. selectedChainType.set() runs nanostores
    // subscribers synchronously, and some of them (the sidebar filter in
    // RecursiveSidebar.astro) read this key back from localStorage — so setting the
    // store first lets them observe the previous navigation's value.
    localStorage.setItem(CHAIN_TYPE_STORAGE_KEY, detectedChain)
    selectedChainType.set(detectedChain)
    trackEvent(GA_EVENTS.CHAIN_AUTO_DETECTED, detectedChain)
    return
  }

  // Priority 2: LocalStorage
  const stored = localStorage.getItem(CHAIN_TYPE_STORAGE_KEY) as ChainType | null
  if (stored && CHAIN_TYPE_CONFIGS[stored]) {
    selectedChainType.set(stored)
    return
  }

  // Priority 3: Default to EVM
  selectedChainType.set(DEFAULT_CHAIN_TYPE)
}

/**
 * Update chain type selection and persist to storage
 * @param chainType - The chain type to select
 */
export function setChainType(chainType: ChainType): void {
  selectedChainType.set(chainType)

  if (typeof window !== "undefined") {
    localStorage.setItem(CHAIN_TYPE_STORAGE_KEY, chainType)
    trackEvent(GA_EVENTS.CHAIN_SELECTOR_CLICK, chainType)
  }
}

/**
 * Detect chain type from URL path
 * Matches explicit chain identifiers with or without trailing slashes. Paths without a chain
 * segment (e.g. /ccip, /ccip/concepts/fees-and-billing) return null so the stored selection
 * is preserved. This is the same rule production uses.
 * Examples:
 *   /ccip/evm/tutorials/application-developers → 'evm'
 *   /ccip/v1/svm/tutorials → 'solana'
 *   /ccip/v1/aptos/api-reference/v1.6.0 → 'aptos'
 *   /ccip/v1/ton/tutorials/receivers → 'ton'
 *   /ccip/canton/getting-started → 'canton'
 *   /ccip/concepts/fees-and-billing → null
 *
 * Exported so navigation code can tell chainless URLs from chain-specific ones.
 *
 * @param pathname - URL pathname to analyze
 * @returns Detected chain type or null if the path has no explicit chain segment
 */
export function detectChainFromPath(pathname: string): ChainType | null {
  const path = pathname.replace(/\/+$/, "") || "/"

  if (/\/(evm|ethereum)(\/|$)/i.test(path)) return "evm"
  if (/\/(svm|solana)(\/|$)/i.test(path)) return "solana"
  if (/\/aptos(\/|$)/i.test(path)) return "aptos"
  if (/\/ton(\/|$)/i.test(path)) return "ton"
  if (/\/canton(\/|$)/i.test(path)) return "canton"

  return null
}

/**
 * Google Analytics tracking helper via Google Tag Manager dataLayer
 * Sends events when chain type changes
 *
 * @param eventName - GA event name
 * @param chainType - Selected chain type
 */
function trackEvent(eventName: string, chainType: ChainType): void {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      chain_type: chainType,
      section: "ccip",
    })
  }
}
