import type { ChainType } from "./types.js"

/**
 * Metadata for each supported chain type
 * Used for UI rendering, theming, and filtering
 */
export interface ChainTypeConfig {
  id: ChainType
  displayName: string
  icon: string
  color: string
  description: string
}

/**
 * Configuration for all chain types in CCIP
 * Reuses existing ChainType from src/config/types.ts
 */
export const CHAIN_TYPE_CONFIGS: Record<ChainType, ChainTypeConfig> = {
  evm: {
    id: "evm",
    displayName: "EVM",
    icon: "/assets/chains/ethereum.svg",
    color: "#627EEA", // Ethereum blue
    description: "Ethereum Virtual Machine compatible chains",
  },
  solana: {
    id: "solana",
    displayName: "Solana",
    icon: "/assets/chains/solana.svg",
    color: "#14F195", // Solana green
    description: "Solana blockchain",
  },
  aptos: {
    id: "aptos",
    displayName: "Aptos",
    icon: "/assets/chains/aptos.svg",
    color: "#00D4AA", // Aptos teal
    description: "Aptos Move blockchain",
  },
  sui: {
    id: "sui",
    displayName: "Sui",
    icon: "/assets/chains/sui.svg",
    color: "#6FBCF0", // Sui blue
    description: "Sui Move blockchain",
  },
  canton: {
    id: "canton",
    displayName: "Canton",
    icon: "/assets/chains/canton.svg",
    color: "#1E1E1E", // Canton dark
    description: "Canton Network blockchain",
  },
  ton: {
    id: "ton",
    displayName: "TON",
    icon: "/assets/chains/ton.svg",
    color: "#0088CC", // TON blue
    description: "The Open Network blockchain",
  },
  tron: {
    id: "tron",
    displayName: "TRON",
    icon: "/assets/chains/tron.svg",
    color: "#FF0013", // TRON red
    description: "TRON blockchain",
  },
  stellar: {
    id: "stellar",
    displayName: "Stellar",
    icon: "/assets/chains/stellar.svg",
    color: "#000000", // Stellar black
    description: "Stellar blockchain",
  },
  starknet: {
    id: "starknet",
    displayName: "Starknet",
    icon: "/assets/chains/starknet.svg",
    color: "#EC796B", // Starknet coral
    description: "Starknet blockchain",
  },
}

/**
 * Chain types supported in CCIP
 * Currently: EVM, Solana, Aptos
 */
export const CCIP_SUPPORTED_CHAINS: ChainType[] = ["evm", "solana", "aptos"]

/**
 * Sections that support chain type filtering (OPT-IN)
 * Add new products here when they support multiple chains
 */
const CHAIN_AWARE_SECTIONS = new Set<string>(["ccip"])

/**
 * Check if a section supports chain filtering
 * @param section - Section identifier (e.g., 'ccip', 'cre')
 * @returns true if section has chain-aware navigation
 */
export function isChainAwareSection(section?: string): boolean {
  return section ? CHAIN_AWARE_SECTIONS.has(section) : false
}

/**
 * Default chain type for new users
 */
export const DEFAULT_CHAIN_TYPE: ChainType = "evm"

/**
 * LocalStorage key for persisting user selection
 */
export const CHAIN_TYPE_STORAGE_KEY = "chainlink-docs-chain-type"

/**
 * Google Analytics event names for tracking
 */
export const GA_EVENTS = {
  CHAIN_SELECTOR_CLICK: "chain_selector_click",
  CHAIN_AUTO_DETECTED: "chain_auto_detected",
} as const
