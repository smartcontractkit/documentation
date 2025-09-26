/**
 * Solana address validation utilities
 */

import { address as parseAddress, type Address } from "@solana/kit"
import type { AddressValidationResult } from "../types.ts"

/**
 * Validate and normalize a Solana address
 */
function validateAndNormalize(addressString: string): AddressValidationResult {
  if (typeof addressString !== "string") {
    return { isValid: false, error: "Address must be a string" }
  }
  const s = addressString.trim()
  if (!s) {
    return { isValid: false, error: "Address must be a non-empty string" }
  }

  try {
    // Parses and brands the string as Address (base58, 32 bytes)
    const normalized = parseAddress(s)
    return { isValid: true, normalized }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid address format",
    }
  }
}

/**
 * Ensure address is valid, throw if not
 */
export function ensureSolAddress(addressString: string): Address {
  const result = validateAndNormalize(addressString)
  if (!result.isValid || !result.normalized) {
    throw new Error(`Invalid Solana address${result.error ? `: ${result.error}` : ""}`)
  }
  return result.normalized
}
