import type { Instruction } from "@solana/instructions"
import { getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction } from "@solana-program/compute-budget"
import { logger } from "@api/ccip/logger.ts"

export const prerender = false

/**
 * Compute budget configuration for Solana transactions
 */
export interface ComputeBudgetConfig {
  computeUnitLimit?: number
  computeUnitPrice?: bigint // microlamports per compute unit
}

/**
 * Default compute budget settings for faucet operations
 * Conservative limits to ensure transaction success
 */
export const DEFAULT_COMPUTE_BUDGET: ComputeBudgetConfig = {
  computeUnitLimit: 200_000, // Conservative limit for faucet drip
  computeUnitPrice: 1n, // 1 microlamport per CU (very low priority)
}

/**
 * Build compute budget instructions for transaction optimization
 * Returns instructions to prepend to the transaction
 * Using official SDK helpers from @solana-program/compute-budget
 */
export function buildComputeBudgetInstructions(config: ComputeBudgetConfig, requestId?: string): Instruction[] {
  const instructions: Instruction[] = []

  logger.debug({
    message: "Building compute budget instructions",
    requestId,
    computeUnitLimit: config.computeUnitLimit,
    computeUnitPrice: config.computeUnitPrice?.toString(),
    step: "compute_budget_build",
  })

  // Set compute unit limit if specified
  if (config.computeUnitLimit !== undefined) {
    const computeUnitLimitInstruction = getSetComputeUnitLimitInstruction({
      units: config.computeUnitLimit,
    })
    instructions.push(computeUnitLimitInstruction)

    logger.debug({
      message: "Added compute unit limit instruction",
      requestId,
      units: config.computeUnitLimit,
      step: "compute_limit_added",
    })
  }

  // Set compute unit price if specified
  if (config.computeUnitPrice !== undefined) {
    const computeUnitPriceInstruction = getSetComputeUnitPriceInstruction({
      microLamports: config.computeUnitPrice,
    })
    instructions.push(computeUnitPriceInstruction)

    logger.debug({
      message: "Added compute unit price instruction",
      requestId,
      microLamports: config.computeUnitPrice.toString(),
      step: "compute_price_added",
    })
  }

  logger.debug({
    message: "Compute budget instructions built",
    requestId,
    instructionCount: instructions.length,
    step: "compute_budget_complete",
  })

  return instructions
}

/**
 * Calculate priority fee based on compute units and desired priority level
 * Returns microlamports per compute unit
 */
export function calculatePriorityFee(computeUnits: number, priorityLevel: "low" | "medium" | "high" = "low"): bigint {
  const basePricePerCU = {
    low: 1n, // 1 microlamport per CU
    medium: 5n, // 5 microlamports per CU
    high: 10n, // 10 microlamports per CU
  }

  return basePricePerCU[priorityLevel]
}

/**
 * Estimate total transaction cost including priority fees
 */
export function estimateTransactionCost(
  computeUnits: number,
  computeUnitPrice: bigint,
  baseFee = 5000 // lamports
): bigint {
  const priorityFee = BigInt(computeUnits) * computeUnitPrice
  const totalCost = BigInt(baseFee) + priorityFee
  return totalCost
}
