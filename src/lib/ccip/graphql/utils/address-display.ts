/**
 * Address display normalization for API responses.
 *
 * Ensures addresses are returned in the canonical display format
 * for each chain family. This is the counterpart to address-utils.ts
 * which normalizes addresses for GraphQL queries (input).
 *
 * Strategy by chain family:
 * - EVM: EIP-55 checksummed (mixed-case encoding of the address)
 * - Solana: Base58 — case-sensitive, returned as-is
 * - Aptos: 0x + lowercase hex (64 chars) — canonical format
 * - SUI: 0x + lowercase hex (64 chars) — canonical format
 * - TON: raw format, returned as-is
 * - Starknet: 0x + lowercase hex, returned as-is
 *
 * To add a new chain family:
 * 1. Add a case to normalizeAddressForDisplay
 * 2. Implement the normalization function if needed
 * 3. Update this JSDoc
 */

import { getAddress } from "ethers"

export type ChainFamily = "evm" | "solana" | "aptos" | "sui" | "ton" | "starknet" | "tron" | "canton" | "stellar"

/**
 * Normalizes an address for display in API responses.
 *
 * @param address - Raw address from GraphQL or reference data
 * @param chainFamily - Chain family determining the normalization strategy
 * @returns Display-normalized address
 */
export function normalizeAddressForDisplay(address: string, chainFamily: ChainFamily | null): string {
  if (!address || !chainFamily) return address

  switch (chainFamily) {
    case "evm":
      return checksumEVMAddress(address)
    case "solana":
    case "aptos":
    case "sui":
    case "ton":
    case "starknet":
    case "tron":
    case "canton":
    case "stellar":
      // These chain families use their native format as canonical — no transformation needed
      return address
    default:
      return address
  }
}

/**
 * Applies EIP-55 checksumming to an EVM address.
 * Falls back to the original address if checksumming fails (e.g., invalid address).
 */
function checksumEVMAddress(address: string): string {
  try {
    return getAddress(address)
  } catch {
    // If checksumming fails, return as-is rather than breaking the response
    return address
  }
}
