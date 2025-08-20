import { address, type Address } from "@solana/addresses"

/**
 * Validates if a string is a valid Solana address using Kit's address() function
 * @param addr - Address string to validate
 * @returns true if valid, false otherwise
 */
export function isValidSolAddress(addr: string): boolean {
  try {
    address(addr.trim())
    return true
  } catch {
    return false
  }
}

/**
 * Ensures a string is a valid Solana address, throws if invalid
 * Uses Kit's address() function for proper validation
 * @param addr - Address string to validate
 * @returns the validated Address
 * @throws Error if address is invalid
 */
export function ensureSolAddress(addr: string): Address {
  return address(addr.trim()) // throws if invalid, returns branded Address type
}

/**
 * Validates multiple Solana addresses using Kit's address() function
 * @param addresses - Array of address strings to validate
 * @returns Array of validation results
 */
export function validateSolAddresses(addresses: string[]): Array<{
  address: string
  isValid: boolean
  error?: string
  validatedAddress?: Address
}> {
  return addresses.map((addressStr) => {
    try {
      const validatedAddress = address(addressStr.trim())
      return {
        address: addressStr,
        isValid: true,
        validatedAddress,
      }
    } catch (error) {
      return {
        address: addressStr,
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid address",
      }
    }
  })
}
