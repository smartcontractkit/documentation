/**
 * Transaction cost estimator for precise Solana transaction fee calculation
 * Uses getFeeForMessage RPC method to calculate exact base fees and combines
 * with priority fee analysis for comprehensive cost optimization
 */

import type { Logger } from "@lib/logging/index.js"
import type { IRpcContext } from "../../infrastructure/rpc/types.ts"
import { getCompiledTransactionMessageDecoder, getCompiledTransactionMessageEncoder } from "@solana/kit"
import type { FullySignedTransaction, Transaction, TransactionMessageBytesBase64 } from "@solana/kit"
import {
  type TransactionCostBreakdown,
  type TransactionPreferences,
  RiskTolerance,
  FeeMarketAnalysisResult,
} from "../types/network-types.ts"

/**
 * Default transaction preferences for cost estimation
 */
const DEFAULT_TRANSACTION_PREFERENCES: TransactionPreferences = {
  riskTolerance: RiskTolerance.NORMAL,
  targetConfirmationTime: 15, // seconds
  prioritizeCostOptimization: false,
}

/**
 * Estimates precise transaction costs using Solana RPC methods
 * Combines base fee calculation with priority fee optimization for accurate budgeting
 */
export class TransactionCostEstimator {
  constructor(
    private readonly rpcContext: IRpcContext,
    private readonly logger?: Logger
  ) {
    // Constructor initializes required dependencies
    this.rpcContext = rpcContext
    this.logger = logger
  }

  /**
   * Calculates exact transaction cost breakdown using getFeeForMessage
   * Combines base transaction fees with optimized priority fees for comprehensive costing
   *
   * @param transaction - Fully signed transaction for cost calculation
   * @param feeMarketAnalysis - Current fee market conditions and recommendations
   * @param preferences - User preferences for cost vs speed optimization
   * @param requestId - Request identifier for logging correlation
   * @returns Detailed transaction cost breakdown with optimization recommendations
   * @throws Error when RPC methods fail or transaction is invalid
   */
  async estimateTransactionCost(
    transaction: FullySignedTransaction & Transaction,
    feeMarketAnalysis: FeeMarketAnalysisResult,
    preferences: TransactionPreferences = DEFAULT_TRANSACTION_PREFERENCES,
    requestId?: string
  ): Promise<TransactionCostBreakdown> {
    const startTime = Date.now()

    try {
      this.logger?.debug({
        message: "Starting transaction cost estimation",
        requestId,
        riskTolerance: preferences.riskTolerance,
        targetConfirmationTime: preferences.targetConfirmationTime,
        step: "cost_estimation_start",
      })

      // Extract the message bytes (without signatures) - this is what getFeeForMessage expects
      const messageBytes = transaction.messageBytes

      // Use proper SDK approach: decode the message bytes to CompiledTransactionMessage
      const messageDecoder = getCompiledTransactionMessageDecoder()
      const compiledMessage = messageDecoder.decode(messageBytes)

      // Re-encode to clean bytes using the message encoder
      const messageEncoder = getCompiledTransactionMessageEncoder()
      const cleanMessageBytes = messageEncoder.encode(compiledMessage)

      // Convert bytes to base64 string using built-in btoa (base64 encoder expects strings for decoding, not encoding)
      // For encoding bytes to base64, we use the standard approach
      const messageBase64String = Buffer.from(cleanMessageBytes).toString("base64")

      // Apply proper branded type casting - this is now safe because we used SDK encoders
      const transactionMessage = messageBase64String as TransactionMessageBytesBase64

      // Get exact base fee for this specific transaction
      const feeResponse = await this.rpcContext.rpc
        .getFeeForMessage(transactionMessage, {
          commitment: this.rpcContext.commitment,
        })
        .send()

      if (!feeResponse.value) {
        throw new Error(`RPC_METHOD_FAILED: getFeeForMessage returned null - transaction may be invalid`)
      }

      const baseFee = feeResponse.value

      this.logger?.debug({
        message: "Base fee calculated successfully",
        requestId,
        baseFeeAmount: baseFee,
        transactionSize: cleanMessageBytes.length,
        step: "base_fee_calculated",
      })

      // Select optimal priority fee based on user preferences and market conditions
      const priorityFeePerCU = this.selectOptimalPriorityFee(feeMarketAnalysis, preferences)

      // Estimate compute units required (will be refined with simulation)
      const estimatedComputeUnits = this.estimateComputeUnitsRequired(transaction, preferences)

      // Calculate total costs
      const computeUnitCost = Math.ceil((estimatedComputeUnits * priorityFeePerCU) / 1_000_000) // Convert microlamports to lamports
      const baseFeeNumber = Number(baseFee) // Convert Lamports to number
      const totalCost = baseFeeNumber + computeUnitCost

      // Validate against user budget constraints
      if (preferences.maxCostLamports && totalCost > preferences.maxCostLamports) {
        this.logger?.warn({
          message: "Estimated cost exceeds user budget constraint",
          requestId,
          estimatedCost: totalCost,
          maxBudget: preferences.maxCostLamports,
          step: "budget_constraint_warning",
        })
      }

      const estimationTimeMs = Date.now() - startTime

      this.logger?.info({
        message: "Transaction cost estimation completed",
        requestId,
        baseFee: baseFeeNumber,
        computeUnitCost,
        totalCost,
        priorityFeePerCU,
        estimatedComputeUnits,
        estimationTimeMs,
        step: "cost_estimation_complete",
      })

      return {
        baseFee: baseFeeNumber,
        computeUnitCost,
        totalCost,
        priorityFeePerCU,
        estimatedComputeUnits,
      }
    } catch (error) {
      const estimationTimeMs = Date.now() - startTime

      this.logger?.error({
        message: "Transaction cost estimation failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        estimationTimeMs,
        step: "cost_estimation_error",
      })

      throw error
    }
  }

  /**
   * Estimates transaction cost without requiring a fully signed transaction
   * Uses transaction structure analysis and market conditions for approximate costing
   *
   * @param instructionCount - Number of instructions in the transaction
   * @param accountCount - Number of accounts involved in the transaction
   * @param dataSize - Estimated transaction data size in bytes
   * @param feeMarketAnalysis - Current fee market conditions
   * @param preferences - User preferences for optimization
   * @param requestId - Request identifier for logging
   * @returns Approximate transaction cost breakdown
   */
  async estimateTransactionCostApproximate(
    instructionCount: number,
    accountCount: number,
    dataSize: number,
    feeMarketAnalysis: FeeMarketAnalysisResult,
    preferences: TransactionPreferences = DEFAULT_TRANSACTION_PREFERENCES,
    requestId?: string
  ): Promise<TransactionCostBreakdown> {
    const startTime = Date.now()

    try {
      this.logger?.debug({
        message: "Starting approximate transaction cost estimation",
        requestId,
        instructionCount,
        accountCount,
        dataSize,
        step: "approximate_cost_estimation_start",
      })

      // Estimate base fee based on transaction complexity
      const baseFee = this.estimateBaseFee(instructionCount, accountCount, dataSize)

      // Select optimal priority fee
      const priorityFeePerCU = this.selectOptimalPriorityFee(feeMarketAnalysis, preferences)

      // Estimate compute units based on transaction complexity
      const estimatedComputeUnits = this.estimateComputeUnitsFromComplexity(instructionCount, accountCount, preferences)

      // Calculate costs
      const computeUnitCost = Math.ceil((estimatedComputeUnits * priorityFeePerCU) / 1_000_000)
      const totalCost = baseFee + computeUnitCost

      const estimationTimeMs = Date.now() - startTime

      this.logger?.info({
        message: "Approximate transaction cost estimation completed",
        requestId,
        baseFee,
        computeUnitCost,
        totalCost,
        estimatedComputeUnits,
        estimationTimeMs,
        step: "approximate_cost_estimation_complete",
      })

      return {
        baseFee,
        computeUnitCost,
        totalCost,
        priorityFeePerCU,
        estimatedComputeUnits,
      }
    } catch (error) {
      const estimationTimeMs = Date.now() - startTime

      this.logger?.error({
        message: "Approximate transaction cost estimation failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        estimationTimeMs,
        step: "approximate_cost_estimation_error",
      })

      throw error
    }
  }

  /**
   * Selects optimal priority fee based on market conditions and user preferences
   * Balances cost efficiency with confirmation speed requirements
   *
   * @param feeMarketAnalysis - Current fee market analysis results
   * @param preferences - User preferences for cost vs speed trade-offs
   * @returns Optimal priority fee in microlamports per compute unit
   */
  private selectOptimalPriorityFee(
    feeMarketAnalysis: FeeMarketAnalysisResult,
    preferences: TransactionPreferences
  ): number {
    const { recommendedFees, metrics } = feeMarketAnalysis
    const { riskTolerance, targetConfirmationTime, prioritizeCostOptimization } = preferences

    // Start with base recommendation based on risk tolerance
    let selectedFee: number

    switch (riskTolerance) {
      case RiskTolerance.CONSERVATIVE:
        selectedFee = recommendedFees.conservative
        break
      case RiskTolerance.AGGRESSIVE:
        selectedFee = recommendedFees.urgent
        break
      case RiskTolerance.NORMAL:
      default:
        selectedFee = recommendedFees.normal
        break
    }

    // Adjust based on target confirmation time
    if (targetConfirmationTime && targetConfirmationTime < 10) {
      // Fast confirmation required
      selectedFee = Math.max(selectedFee, recommendedFees.fast)
    } else if (targetConfirmationTime && targetConfirmationTime > 30) {
      // Longer confirmation time acceptable - can use lower fees
      selectedFee = Math.min(selectedFee, recommendedFees.conservative)
    }

    // Adjust based on cost optimization preference
    if (prioritizeCostOptimization) {
      // Prioritize cost savings - use lower percentile unless market is rising
      if (metrics.trend !== "rising") {
        selectedFee = Math.min(selectedFee, recommendedFees.conservative)
      }
    }

    // Ensure minimum viable fee
    selectedFee = Math.max(selectedFee, 1)

    return selectedFee
  }

  /**
   * Estimates compute units required for a transaction based on its structure
   * Uses heuristics based on instruction complexity and account usage
   *
   * @param transaction - Fully signed transaction for analysis
   * @param preferences - User preferences affecting computation estimation
   * @returns Estimated compute units required
   */
  private estimateComputeUnitsRequired(
    transaction: FullySignedTransaction & Transaction,
    preferences: TransactionPreferences
  ): number {
    // Base estimation - will be refined with actual simulation
    const baseComputeUnits = 200_000 // Conservative baseline

    // Add buffer based on risk tolerance
    let buffer = 1.1 // 10% default buffer

    switch (preferences.riskTolerance) {
      case RiskTolerance.CONSERVATIVE:
        buffer = 1.25 // 25% buffer for reliability
        break
      case RiskTolerance.AGGRESSIVE:
        buffer = 1.05 // 5% buffer for efficiency
        break
      case RiskTolerance.NORMAL:
      default:
        buffer = 1.15 // 15% buffer for balance
        break
    }

    return Math.ceil(baseComputeUnits * buffer)
  }

  /**
   * Estimates base transaction fee based on transaction complexity
   * Approximates getFeeForMessage results using transaction characteristics
   *
   * @param instructionCount - Number of instructions in transaction
   * @param accountCount - Number of accounts involved
   * @param dataSize - Transaction data size in bytes
   * @returns Estimated base fee in lamports
   */
  private estimateBaseFee(instructionCount: number, accountCount: number, dataSize: number): number {
    // Base Solana transaction fee
    let baseFee = 5000 // 5000 lamports base fee

    // Additional costs for complexity
    baseFee += instructionCount * 1000 // ~1000 lamports per instruction
    baseFee += Math.floor(dataSize / 100) * 500 // Size-based fee component

    // Account creation fees (if new accounts are being created)
    // This is estimated - actual fees depend on rent exemption requirements
    if (accountCount > 5) {
      baseFee += (accountCount - 5) * 2000 // Additional account handling
    }

    return baseFee
  }

  /**
   * Estimates compute units based on transaction complexity indicators
   * Uses heuristics for different transaction types and patterns
   *
   * @param instructionCount - Number of instructions
   * @param accountCount - Number of accounts involved
   * @param preferences - User preferences for estimation
   * @returns Estimated compute units required
   */
  private estimateComputeUnitsFromComplexity(
    instructionCount: number,
    accountCount: number,
    preferences: TransactionPreferences
  ): number {
    // Base compute requirements
    let estimatedCU = 150_000 // Conservative baseline

    // Instruction-based scaling
    estimatedCU += instructionCount * 25_000 // ~25k CU per instruction

    // Account-based scaling (more accounts = more verification)
    estimatedCU += accountCount * 2_000 // ~2k CU per account

    // Apply safety margin based on risk tolerance
    let safetyMargin = 1.2 // 20% default margin

    switch (preferences.riskTolerance) {
      case RiskTolerance.CONSERVATIVE:
        safetyMargin = 1.4 // 40% margin for reliability
        break
      case RiskTolerance.AGGRESSIVE:
        safetyMargin = 1.1 // 10% margin for efficiency
        break
      case RiskTolerance.NORMAL:
      default:
        safetyMargin = 1.25 // 25% margin for balance
        break
    }

    const finalEstimate = Math.ceil(estimatedCU * safetyMargin)

    // Ensure within Solana limits
    return Math.min(finalEstimate, 1_400_000)
  }
}
