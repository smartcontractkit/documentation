/**
 * Transaction domain models
 */

import type { Address, Instruction, Transaction } from "@solana/kit"
import type { CommitmentLevel } from "../../../core/types.ts"
import type { ComputeBudgetConfig } from "./compute-budget.ts"

/**
 * Transaction signer interface - simplified for our domain
 */
export interface TransactionSigner {
  address: Address
  signMessage?(message: Uint8Array): Promise<Uint8Array>
  signTransaction?(transaction: Transaction): Promise<Transaction>
}

/**
 * Transaction builder configuration
 */
export interface TransactionConfig {
  feePayer: TransactionSigner
  instructions: readonly Instruction[]
  requestId?: string
  computeBudget?: ComputeBudgetConfig
  commitment?: CommitmentLevel
}

/**
 * Account information for simulation results matching RPC spec
 * Data is returned as [data_content, encoding] tuple from RPC
 */
export interface SimulationAccountInfo {
  executable: boolean
  owner: string
  lamports: number
  data: [string, string] // [data, encoding] - matches Solana RPC spec
  /** @deprecated Removed in @solana/kit v4.0.0 (SIMD-215). No longer returned by RPC. */
  rentEpoch?: number
}

/**
 * Account inspection request for simulation
 */
export interface AccountInspectionRequest {
  /** Specific accounts to inspect during simulation */
  addresses: Address[]
  /** Include account data in response */
  includeData?: boolean
  /** Encoding for account data */
  encoding?: "base64" | "base64+zstd" | "jsonParsed"
}

/**
 * Simulation options for enhanced transaction simulation
 */
export interface SimulationOptions {
  /** Request ID for tracking */
  requestId?: string
  /** Compute budget configuration */
  computeBudget?: ComputeBudgetConfig
  /** Accounts to inspect during simulation */
  accountInspection?: AccountInspectionRequest
  /** Include all account changes in response */
  includeAllAccounts?: boolean
  /** Replace recent blockhash (recommended for simulation) */
  replaceRecentBlockhash?: boolean
  /** Skip signature verification */
  skipSigVerify?: boolean
}

/**
 * Enhanced transaction simulation result
 */
export interface SimulationResult {
  computeUnitsConsumed: number
  logs?: string[]
  accounts?: Array<{ address: Address; account: SimulationAccountInfo | null }>
  returnData?: {
    programId: string
    data: string
  }
  err?: string | { [key: string]: unknown }
  /** Preflight errors categorized for debugging */
  preflightErrors?: string[]
  /** Account access patterns during execution */
  accountAccesses?: {
    reads: Address[]
    writes: Address[]
  }
}

/**
 * Transaction fee estimation result
 */
export interface FeeEstimationResult {
  /** Base transaction fee in lamports */
  baseFee: number
  /** Priority fee in lamports */
  priorityFee: number
  /** Total estimated fee in lamports */
  totalFee: number
  /** Compute units required */
  computeUnits: number
  /** Current compute unit price */
  computeUnitPrice: bigint
}

/**
 * Account change during transaction execution
 */
export interface AccountChange {
  address: Address
  before: SimulationAccountInfo | null
  after: SimulationAccountInfo | null
  lamportChange: number
  dataChanged: boolean
}

/**
 * Validation result for transaction preflight checks
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  accountChecks?: {
    missingAccounts: Address[]
    invalidAccounts: Address[]
  }
  computeBudgetChecks?: {
    estimatedUnits: number
    providedLimit?: number
    sufficient: boolean
  }
}
