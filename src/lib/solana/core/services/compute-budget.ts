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
