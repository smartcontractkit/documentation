import { assertIsAddress } from "@solana/kit"

/**
 * Validates if a string is a valid Solana address using @solana/kit
 * @param addr - Address string to validate
 * @returns true if valid, false otherwise
 */
export function isValidSolAddress(addr: string): boolean {
  try {
    assertIsAddress(addr)
    return true
  } catch {
    return false
  }
}

/**
 * Ensures a string is a valid Solana address, throws if invalid
 * @param addr - Address string to validate
 * @returns the address if valid
 * @throws Error if address is invalid
 */
export function ensureSolAddress(addr: string): string {
  assertIsAddress(addr) // throws if invalid
  return addr
}

/**
 * Validates multiple Solana addresses
 * @param addresses - Array of address strings to validate
 * @returns Array of validation results
 */
export function validateSolAddresses(addresses: string[]): Array<{
  address: string
  isValid: boolean
  error?: string
}> {
  return addresses.map((address) => {
    try {
      assertIsAddress(address)
      return { address, isValid: true }
    } catch (error) {
      return {
        address,
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid address",
      }
    }
  })
}
