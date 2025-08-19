/**
 * Solana Wallet Layer
 *
 * A reusable, battle-tested wallet abstraction for Solana dApps.
 * Provides unified wallet discovery, connection, and signing capabilities
 * with proper fallbacks and error handling.
 *
 * Architecture:
 * - Core: Pure TypeScript wallet client with capability detection
 * - React: Provider and hooks for state management
 * - Components: Headless UI components for common wallet interactions
 *
 * Usage:
 * 1. Wrap your app with SolanaWalletProvider
 * 2. Use hooks like useSolanaWallet() in components
 * 3. Gate features with useCapabilityCheck()
 */

// Core wallet client (pure TypeScript)
export * from "./core.ts"

// React provider and hooks
export * from "./react.tsx"

// Headless UI components
export * from "./components.tsx"

// Helper utilities and capability gates
export * from "./helpers.ts"

// Re-export commonly used types
export type { UiWalletAccount } from "@wallet-standard/react"
