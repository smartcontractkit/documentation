/**
 * Display name utilities for CCIP chains
 */

/**
 * Derives display name from internalId by converting kebab-case or snake_case to Title Case.
 * @param internalId - The internal chain identifier (e.g., "ethereum-mainnet", "binance_smart_chain-testnet")
 * @returns Human-readable display name (e.g., "Ethereum Mainnet", "Binance Smart Chain Testnet")
 * @example
 * deriveDisplayName("ethereum-mainnet") // "Ethereum Mainnet"
 * deriveDisplayName("binance_smart_chain-testnet") // "Binance Smart Chain Testnet"
 */
export function deriveDisplayName(internalId: string): string {
  if (!internalId) {
    return "Unknown"
  }
  return internalId
    .split(/[-_]/)
    .filter((word) => word.length > 0) // Filter empty strings to prevent double spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
