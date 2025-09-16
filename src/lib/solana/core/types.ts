/**
 * Core type definitions for Solana operations
 */

import type { Address } from "@solana/kit"
import type { TokenProgramId } from "./constants/program-ids.ts"

// Re-export TokenProgramId for service use
export type { TokenProgramId }

/**
 * Commitment levels for Solana transactions
 */
export type CommitmentLevel = "processed" | "confirmed" | "finalized"

/**
 * Base error context interface
 */
export interface ErrorContext {
  requestId?: string
  operation?: string
  chainName?: string
  [key: string]: string | number | boolean | null | undefined | string[]
}

/**
 * Address validation result
 */
export interface AddressValidationResult {
  isValid: boolean
  error?: string
  normalized?: Address
}
