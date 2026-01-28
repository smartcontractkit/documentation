/**
 * Compute budget models and utilities
 * Pure domain logic with no external dependencies
 */

import { PROGRAM_IDS } from "@lib/solana/core/constants/index.ts"
import type { Instruction } from "@solana/kit"

/**
 * Compute budget configuration (internal use with BigInt)
 */
export interface ComputeBudgetConfig {
  computeUnitLimit?: number
  computeUnitPrice?: bigint
}

/**
 * Serializable compute budget configuration (for transaction building and RPC calls)
 */
export interface SerializableComputeBudgetConfig {
  computeUnitLimit?: number
  computeUnitPrice?: string
}

/**
 * Convert ComputeBudgetConfig to serializable format
 */
export function serializeComputeBudgetConfig(config: ComputeBudgetConfig): SerializableComputeBudgetConfig {
  return {
    computeUnitLimit: config.computeUnitLimit,
    computeUnitPrice: config.computeUnitPrice?.toString(),
  }
}

/**
 * Create compute unit limit instruction
 */
function createComputeUnitLimitInstruction(units: number): Instruction {
  // Serialize units as little-endian 4-byte integer
  const data = new Uint8Array(5)
  data[0] = 2 // SetComputeUnitLimit instruction discriminator

  // Write units as little-endian u32
  const unitsBuffer = new ArrayBuffer(4)
  const unitsView = new DataView(unitsBuffer)
  unitsView.setUint32(0, units, true) // true = little endian
  data.set(new Uint8Array(unitsBuffer), 1)

  return {
    programAddress: PROGRAM_IDS.COMPUTE_BUDGET,
    accounts: [],
    data,
  }
}

/**
 * Create compute unit price instruction
 */
function createComputeUnitPriceInstruction(microLamports: bigint): Instruction {
  // Serialize microLamports as little-endian 8-byte integer
  const data = new Uint8Array(9)
  data[0] = 3 // SetComputeUnitPrice instruction discriminator

  // Write microLamports as little-endian u64
  const priceBuffer = new ArrayBuffer(8)
  const priceView = new DataView(priceBuffer)
  priceView.setBigUint64(0, microLamports, true) // true = little endian
  data.set(new Uint8Array(priceBuffer), 1)

  return {
    programAddress: PROGRAM_IDS.COMPUTE_BUDGET,
    accounts: [],
    data,
  }
}

/**
 * Build compute budget instructions from config
 */
export function buildComputeBudgetInstructions(config: ComputeBudgetConfig): Instruction[] {
  const instructions: Instruction[] = []

  // Add compute unit limit if specified
  if (config.computeUnitLimit && config.computeUnitLimit > 0) {
    instructions.push(createComputeUnitLimitInstruction(config.computeUnitLimit))
  }

  // Add compute unit price if specified and greater than 0
  if (config.computeUnitPrice && config.computeUnitPrice > 0n) {
    instructions.push(createComputeUnitPriceInstruction(config.computeUnitPrice))
  }

  return instructions
}

/**
 * Validate compute budget configuration
 */
export function validateComputeBudgetConfig(config: ComputeBudgetConfig): void {
  if (config.computeUnitLimit !== undefined) {
    if (config.computeUnitLimit < 0 || config.computeUnitLimit > 1_400_000) {
      throw new Error("Compute unit limit must be between 0 and 1,400,000")
    }
  }

  if (config.computeUnitPrice !== undefined) {
    if (config.computeUnitPrice < 0n) {
      throw new Error("Compute unit price cannot be negative")
    }
  }
}
