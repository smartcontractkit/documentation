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
 * 1. URL path detection (/ccip/tutorials/svm/... → solana, persisted to localStorage)
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
    selectedChainType.set(detectedChain)
    localStorage.setItem(CHAIN_TYPE_STORAGE_KEY, detectedChain)
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
 * Matches chain identifiers with or without trailing slashes
 * Examples:
 *   /ccip/tutorials/evm/transfer-tokens → 'evm'
 *   /ccip/service-limits/svm → 'solana'
 *   /ccip/api-reference/aptos/v1.6.0 → 'aptos'
 *
 * @param pathname - URL pathname to analyze
 * @returns Detected chain type or null if not found
 */
function detectChainFromPath(pathname: string): ChainType | null {
  if (/\/(evm|ethereum)(\/|$)/i.test(pathname)) return "evm"
  if (/\/(svm|solana)(\/|$)/i.test(pathname)) return "solana"
  if (/\/aptos(\/|$)/i.test(pathname)) return "aptos"
  return null
}

/**
 * Google Analytics tracking helper
 * Sends events when chain type changes
 *
 * @param eventName - GA event name
 * @param chainType - Selected chain type
 */
function trackEvent(eventName: string, chainType: ChainType): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", eventName, {
      chain_type: chainType,
      section: "ccip",
    })
  }
}
