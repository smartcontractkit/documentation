/**
 * Network-aware compute budget calculation service
 * Dynamically adjusts compute unit limits and pricing based on comprehensive network analysis,
 * transaction complexity, and real-time market conditions using proper Solana RPC methods
 */

import type { IRpcContext } from "../../infrastructure/rpc/types.ts"
import type { Logger } from "@lib/logging/index.js"
import { calculatePriorityFee, estimateTransactionCost } from "./compute-budget.ts"
import type { ComputeBudgetConfig } from "../../domain/transaction/models/compute-budget.ts"
import { NetworkConditionAggregator } from "../../network-analysis/core/network-aggregator.ts"
import {
  type NetworkConditions,
  type TransactionPreferences,
  type NetworkAnalysisConfig,
} from "../../network-analysis/types/network-types.ts"

/**
 * Transaction complexity categories for compute unit estimation
 */
export enum TransactionComplexity {
  SIMPLE = "simple", // Basic token transfer
  STANDARD = "standard", // Faucet drip with ATA creation
  COMPLEX = "complex", // Multi-instruction transactions
}

/**
 * Compute budget calculation parameters
 */
interface ComputeBudgetParams {
  baseComputeUnits: number
  transactionComplexity: TransactionComplexity
  networkConditions?: NetworkConditions
  requiresFastConfirmation?: boolean
  userPreferences?: TransactionPreferences
  requestId?: string
}

/**
 * Network-aware compute budget service
 * Provides dynamic compute unit and priority fee calculation using comprehensive network analysis
 */
export class NetworkComputeBudgetService {
  private static readonly COMPLEXITY_MULTIPLIERS = {
    [TransactionComplexity.SIMPLE]: 1.0,
    [TransactionComplexity.STANDARD]: 1.2,
    [TransactionComplexity.COMPLEX]: 1.5,
  }

  private static readonly FALLBACK_COMPUTE_UNITS = {
    [TransactionComplexity.SIMPLE]: 150_000,
    [TransactionComplexity.STANDARD]: 200_000,
    [TransactionComplexity.COMPLEX]: 300_000,
  }

  private readonly networkAggregator: NetworkConditionAggregator

  constructor(
    private readonly rpcContext: IRpcContext,
    private readonly logger?: Logger,
    private readonly analysisConfig?: Partial<NetworkAnalysisConfig>
  ) {
    this.networkAggregator = new NetworkConditionAggregator(rpcContext, analysisConfig, logger)
  }

  /**
   * Calculate optimal compute budget using comprehensive network analysis
   * Primary method for determining compute unit limits and priority fees with real-time data
   *
   * @param params - Compute budget calculation parameters
   * @returns Optimized compute budget configuration based on network conditions
   */
  async calculateOptimalBudget(params: ComputeBudgetParams): Promise<ComputeBudgetConfig> {
    const startTime = Date.now()

    try {
      this.logger?.debug({
        message: "Computing network-aware compute budget with comprehensive analysis",
        requestId: params.requestId,
        baseComputeUnits: params.baseComputeUnits,
        complexity: params.transactionComplexity,
        step: "compute_budget_start",
      })

      // Get comprehensive network conditions if not provided
      const networkConditions =
        params.networkConditions || (await this.networkAggregator.analyzeNetworkConditions(params.requestId))

      // Calculate required compute units with complexity adjustments
      const complexityMultiplier = NetworkComputeBudgetService.COMPLEXITY_MULTIPLIERS[params.transactionComplexity]
      const baseAdjustedUnits = Math.ceil(params.baseComputeUnits * complexityMultiplier)

      // Apply network recommendation buffer for reliability
      const recommendedBuffer = networkConditions.recommendation.computeBuffer / 100
      const networkAdjustedUnits = Math.ceil(baseAdjustedUnits * (1 + recommendedBuffer))

      // Ensure compute units stay within Solana limits
      const finalComputeUnits = Math.min(networkAdjustedUnits, 1_400_000)

      // Use network-recommended priority fee (already in microlamports per CU)
      const computeUnitPrice = BigInt(networkConditions.recommendation.priorityFee)

      const calculationTime = Date.now() - startTime

      this.logger?.info({
        message: "Network-aware compute budget calculation completed",
        requestId: params.requestId,
        baseComputeUnits: params.baseComputeUnits,
        finalComputeUnits,
        computeUnitPrice: computeUnitPrice.toString(),
        congestionLevel: networkConditions.congestionLevel,
        networkBufferApplied: `${networkConditions.recommendation.computeBuffer}%`,
        expectedConfirmationSeconds: networkConditions.recommendation.expectedConfirmationSeconds,
        recommendationConfidence: networkConditions.recommendation.confidence.toFixed(3),
        calculationTimeMs: calculationTime,
        step: "compute_budget_complete",
      })

      return {
        computeUnitLimit: finalComputeUnits,
        computeUnitPrice,
      }
    } catch (error) {
      this.logger?.warn({
        message: "Network-aware compute budget calculation failed, using fallback values",
        requestId: params.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "compute_budget_fallback",
      })

      // Return conservative fallback budget
      return this.getFallbackBudget(params.transactionComplexity)
    }
  }

  /**
   * Provide conservative fallback compute budget when calculations fail
   */
  private getFallbackBudget(complexity: TransactionComplexity): ComputeBudgetConfig {
    return {
      computeUnitLimit: NetworkComputeBudgetService.FALLBACK_COMPUTE_UNITS[complexity],
      computeUnitPrice: calculatePriorityFee(200_000, "low"),
    }
  }

  /**
   * Calculate estimated total transaction cost including all fees
   * Uses enhanced cost estimation when possible
   *
   * @param computeBudget - Compute budget configuration
   * @returns Estimated total cost in lamports
   */
  estimateTotalTransactionCost(computeBudget: ComputeBudgetConfig): bigint {
    const computeUnits = computeBudget.computeUnitLimit || 200_000
    const computePrice = computeBudget.computeUnitPrice || 1n

    return estimateTransactionCost(computeUnits, computePrice, 5000)
  }
}
