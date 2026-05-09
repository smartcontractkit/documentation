/**
 * Network condition aggregator for unified Solana network analysis
 * Combines throughput analysis, fee market assessment, and cost estimation
 * into a single comprehensive network conditions report for transaction optimization
 */

import type { Logger } from "@lib/logging/index.js"
import type { IRpcContext } from "../../infrastructure/rpc/types.ts"
import type { FullySignedTransaction, Transaction } from "@solana/kit"
import { NetworkThroughputAnalyzer } from "./throughput-analyzer.ts"
import { FeeMarketAnalyzer } from "./fee-market-analyzer.ts"
import { TransactionCostEstimator } from "./cost-estimator.ts"
import {
  type NetworkConditions,
  type NetworkRecommendation,
  type NetworkAnalysisConfig,
  type TransactionPreferences,
  RiskTolerance,
  type ThroughputAnalysisResult,
  type FeeMarketAnalysisResult,
  type FeeMarketMetrics,
} from "../types/network-types.ts"

/**
 * Default configuration for comprehensive network analysis
 */
const DEFAULT_NETWORK_CONFIG: NetworkAnalysisConfig = {
  performanceSamples: 10,
  prioritizationFeeSamples: 150,
  healthySlotProductionRate: 2.3,
  congestionThresholds: {
    low: 800,
    medium: 1500,
    high: 2500,
    critical: 4000,
  },
  feeMarketSensitivity: {
    trendDetectionWindow: 50,
    volatilityThreshold: 0.3,
    stableFeeThreshold: 100,
  },
}

/**
 * Aggregates all network analysis components to provide comprehensive network conditions
 * Combines throughput metrics, fee market analysis, and cost recommendations
 */
export class NetworkConditionAggregator {
  private readonly throughputAnalyzer: NetworkThroughputAnalyzer
  private readonly feeMarketAnalyzer: FeeMarketAnalyzer
  private readonly costEstimator: TransactionCostEstimator

  constructor(
    private readonly rpcContext: IRpcContext,
    private readonly config: Partial<NetworkAnalysisConfig> = {},
    private readonly logger?: Logger
  ) {
    const mergedConfig = { ...DEFAULT_NETWORK_CONFIG, ...config }

    this.throughputAnalyzer = new NetworkThroughputAnalyzer(rpcContext, mergedConfig, logger)
    this.feeMarketAnalyzer = new FeeMarketAnalyzer(rpcContext, mergedConfig, logger)
    this.costEstimator = new TransactionCostEstimator(rpcContext, logger)
  }

  /**
   * Performs comprehensive network analysis and generates unified conditions report
   * Combines all analysis components to provide actionable network intelligence
   *
   * @param requestId - Request identifier for logging correlation
   * @returns Complete network conditions with recommendations
   * @throws Error when analysis components fail or data is insufficient
   */
  async analyzeNetworkConditions(requestId?: string): Promise<NetworkConditions> {
    const startTime = Date.now()

    try {
      this.logger?.debug({
        message: "Starting comprehensive network conditions analysis",
        requestId,
        step: "network_conditions_analysis_start",
      })

      // Run all analysis components in parallel for efficiency
      const [throughputResult, feeMarketResult] = await Promise.all([
        this.throughputAnalyzer.analyzeNetworkThroughput(requestId),
        this.feeMarketAnalyzer.analyzeFeeMarket(requestId),
      ])

      this.logger?.debug({
        message: "Core analysis components completed successfully",
        requestId,
        congestionLevel: throughputResult.congestionLevel,
        feeMarketTrend: feeMarketResult.metrics.trend,
        healthScore: throughputResult.healthScore.toFixed(3),
        step: "core_analysis_complete",
      })

      // Generate comprehensive recommendation based on all analysis results
      const recommendation = this.generateNetworkRecommendation(throughputResult, feeMarketResult, requestId)

      const analysisTimeMs = Date.now() - startTime

      this.logger?.info({
        message: "Network conditions analysis completed successfully",
        requestId,
        congestionLevel: throughputResult.congestionLevel,
        healthScore: throughputResult.healthScore.toFixed(3),
        recommendedPriorityFee: recommendation.priorityFee,
        confidence: recommendation.confidence.toFixed(3),
        analysisTimeMs,
        step: "network_conditions_analysis_complete",
      })

      return {
        congestionLevel: throughputResult.congestionLevel,
        throughput: throughputResult.metrics,
        feeMarket: feeMarketResult.metrics,
        recommendation,
        analyzedAt: new Date(),
        analysisTimeMs,
      }
    } catch (error) {
      const analysisTimeMs = Date.now() - startTime

      this.logger?.error({
        message: "Network conditions analysis failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        analysisTimeMs,
        step: "network_conditions_analysis_error",
      })

      throw error
    }
  }

  /**
   * Estimates transaction cost with current network conditions
   * Provides precise cost calculation using real-time network analysis
   *
   * @param transaction - Fully signed transaction for cost estimation
   * @param preferences - User preferences for cost vs speed optimization
   * @param requestId - Request identifier for logging
   * @returns Transaction cost breakdown with network-aware recommendations
   */
  async estimateTransactionCostWithConditions(
    transaction: FullySignedTransaction & Transaction,
    preferences: TransactionPreferences = { riskTolerance: RiskTolerance.NORMAL },
    requestId?: string
  ) {
    try {
      // Get current fee market conditions
      const feeMarketAnalysis = await this.feeMarketAnalyzer.analyzeFeeMarket(requestId)

      // Estimate transaction cost with current market conditions
      const costBreakdown = await this.costEstimator.estimateTransactionCost(
        transaction,
        feeMarketAnalysis,
        preferences,
        requestId
      )

      return {
        costBreakdown,
        marketConditions: {
          trend: feeMarketAnalysis.metrics.trend,
          volatility: feeMarketAnalysis.metrics.volatility,
          averageFee: feeMarketAnalysis.metrics.averagePriorityFee,
          insights: feeMarketAnalysis.marketInsights,
        },
      }
    } catch (error) {
      this.logger?.error({
        message: "Network-aware cost estimation failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        step: "cost_estimation_with_conditions_error",
      })

      throw error
    }
  }

  /**
   * Generates actionable network recommendations based on comprehensive analysis
   * Combines throughput conditions and fee market insights for optimal transaction parameters
   *
   * @param throughputResult - Network throughput analysis results
   * @param feeMarketResult - Fee market analysis results
   * @param requestId - Request identifier for logging
   * @returns Comprehensive network recommendation
   */
  private generateNetworkRecommendation(
    throughputResult: ThroughputAnalysisResult,
    feeMarketResult: FeeMarketAnalysisResult,
    requestId?: string
  ): NetworkRecommendation {
    const { congestionLevel, healthScore, anomaliesDetected } = throughputResult
    const { metrics, recommendedFees, marketInsights } = feeMarketResult

    // Base priority fee selection based on congestion level
    let priorityFee: number
    let computeBuffer: number
    let expectedConfirmationSeconds: number
    let confidence = 0.9

    switch (congestionLevel) {
      case "critical":
        priorityFee = recommendedFees.urgent
        computeBuffer = 30 // 30% buffer for critical congestion
        expectedConfirmationSeconds = 8
        confidence = 0.7 // Lower confidence in critical conditions
        break

      case "high":
        priorityFee = recommendedFees.fast
        computeBuffer = 20 // 20% buffer for high congestion
        expectedConfirmationSeconds = 12
        confidence = 0.8
        break

      case "medium":
        priorityFee = recommendedFees.normal
        computeBuffer = 15 // 15% buffer for medium congestion
        expectedConfirmationSeconds = 18
        confidence = 0.85
        break

      case "low":
      default:
        priorityFee = recommendedFees.conservative
        computeBuffer = 10 // 10% buffer for low congestion
        expectedConfirmationSeconds = 30
        confidence = 0.9
        break
    }

    // Adjust confidence based on network health and anomalies
    if (healthScore < 0.7) {
      confidence -= 0.1 // Reduce confidence for unhealthy network
    }

    if (anomaliesDetected.length > 2) {
      confidence -= 0.05 // Reduce confidence when many anomalies detected
      computeBuffer += 5 // Add extra buffer for anomalous conditions
    }

    // Adjust for fee market volatility
    if (metrics.volatility === "high") {
      priorityFee = Math.floor(priorityFee * 1.15) // 15% increase for volatile markets
      confidence -= 0.05
    }

    // Generate contextual rationale
    const rationale = this.buildRecommendationRationale(
      congestionLevel,
      metrics,
      healthScore,
      anomaliesDetected,
      marketInsights
    )

    this.logger?.debug({
      message: "Network recommendation generated",
      requestId,
      priorityFee,
      computeBuffer,
      expectedConfirmationSeconds,
      confidence: confidence.toFixed(3),
      step: "network_recommendation_generated",
    })

    return {
      priorityFee,
      computeBuffer,
      expectedConfirmationSeconds,
      confidence: Math.max(0.5, Math.min(1.0, confidence)),
      rationale,
    }
  }

  /**
   * Builds human-readable rationale for network recommendations
   * Explains the reasoning behind priority fee and timing recommendations
   *
   * @param congestionLevel - Current network congestion classification
   * @param feeMetrics - Fee market metrics and trends
   * @param healthScore - Overall network health score
   * @param anomalies - Detected network anomalies
   * @param marketInsights - Fee market insights
   * @returns Detailed explanation of recommendation reasoning
   */
  private buildRecommendationRationale(
    congestionLevel: string,
    feeMetrics: FeeMarketMetrics,
    healthScore: number,
    anomalies: string[],
    marketInsights: string[]
  ): string {
    const rationale: string[] = []

    // Base congestion explanation
    switch (congestionLevel) {
      case "critical":
        rationale.push("Network is critically congested with high transaction competition")
        break
      case "high":
        rationale.push("Network experiencing high congestion with elevated transaction volumes")
        break
      case "medium":
        rationale.push("Network has moderate congestion with normal transaction processing")
        break
      case "low":
        rationale.push("Network is operating with low congestion and efficient processing")
        break
    }

    // Fee market trend context
    if (feeMetrics.trend === "rising") {
      rationale.push("Priority fees are trending upward, recommending higher fee for reliability")
    } else if (feeMetrics.trend === "falling") {
      rationale.push("Declining fee market allows for more cost-effective transaction submission")
    }

    // Network health context
    if (healthScore < 0.8) {
      rationale.push(`Network health score is ${(healthScore * 100).toFixed(0)}%, adding safety buffer`)
    }

    // Anomaly context
    if (anomalies.length > 0) {
      rationale.push(`${anomalies.length} network anomalies detected, increasing confirmation buffer`)
    }

    // Market volatility context
    if (feeMetrics.volatility === "high") {
      rationale.push("High fee volatility detected, recommending premium for consistent inclusion")
    }

    // Include key market insights if available
    if (marketInsights.length > 0) {
      rationale.push(...marketInsights.slice(0, 2)) // Include up to 2 key insights
    }

    return rationale.join(". ") + "."
  }
}
