/**
 * Address normalization utilities for GraphQL queries against the Atlas database.
 *
 * Atlas stores addresses in chain-family-specific formats:
 * - EVM (Ethereum, Arbitrum, Base, etc.): 0x-prefixed, all lowercase hex
 * - Aptos: 0x-prefixed, all lowercase hex (64 chars)
 * - Solana: Base58-encoded, case-sensitive (no 0x prefix)
 * - SUI: 0x-prefixed, all lowercase hex (64 chars)
 *
 * Our reference data (tokens.json) may store addresses with mixed casing
 * (e.g., EIP-55 checksummed EVM addresses). Before querying GraphQL,
 * addresses must be normalized to match the Atlas format.
 */

/**
 * Normalizes a token/pool address for use in GraphQL queries.
 *
 * - 0x-prefixed addresses (EVM, Aptos, SUI): lowercased to match Atlas format
 * - Base58 addresses (Solana): kept as-is since Base58 is case-sensitive
 *
 * @param address - Token or pool address from reference data
 * @returns Normalized address safe for GraphQL condition/filter values
 */
export function normalizeAddressForQuery(address: string): string {
  if (!address) return address
  return address.startsWith("0x") ? address.toLowerCase() : address
}
