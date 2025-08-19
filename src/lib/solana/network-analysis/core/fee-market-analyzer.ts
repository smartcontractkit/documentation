/**
 * Fee market analyzer for Solana priority fee optimization
 * Processes getRecentPrioritizationFees data to assess market conditions,
 * price trends, and optimal fee recommendations for different confirmation speeds
 */

import type { Logger } from "@lib/logging/index.js"
import type { IRpcContext } from "../../infrastructure/rpc/types.ts"
import {
  FeeMarketTrend,
  FeeMarketVolatility,
  type FeeMarketMetrics,
  type FeeMarketAnalysisResult,
  type PrioritizationFeeSample,
  type NetworkAnalysisConfig,
} from "../types/network-types.ts"

/**
 * Default configuration for fee market analysis
 */
const DEFAULT_FEE_MARKET_CONFIG = {
  prioritizationFeeSamples: 150, // ~10 minutes of recent blocks
  feeMarketSensitivity: {
    trendDetectionWindow: 50, // samples to analyze for trend
    volatilityThreshold: 0.3, // coefficient of variation threshold
    stableFeeThreshold: 100, // microlamports/CU change for "stable"
  },
}

/**
 * Analyzes Solana priority fee market using recent prioritization fee data
 * Provides market trend analysis, volatility assessment, and fee recommendations
 */
export class FeeMarketAnalyzer {
  constructor(
    private readonly rpcContext: IRpcContext,
    private readonly config: Partial<NetworkAnalysisConfig> = {},
    private readonly logger?: Logger
  ) {
    // Merge user config with defaults
    this.config = { ...DEFAULT_FEE_MARKET_CONFIG, ...config }
  }

  /**
   * Analyzes current fee market conditions using recent prioritization fee data
   * Provides comprehensive market assessment with trend analysis and recommendations
   *
   * @param requestId - Request identifier for logging correlation
   * @returns Complete fee market analysis with actionable recommendations
   * @throws Error when RPC methods fail or insufficient data available
   */
  async analyzeFeeMarket(requestId?: string): Promise<FeeMarketAnalysisResult> {
    const startTime = Date.now()

    try {
      this.logger?.debug({
        message: "Starting fee market analysis",
        requestId,
        samplesRequested: this.config.prioritizationFeeSamples,
        step: "fee_market_analysis_start",
      })

      // Fetch recent prioritization fees from network
      const feeData = await this.rpcContext.rpc.getRecentPrioritizationFees([]).send() // Empty array gets fees for all accounts

      if (!feeData || feeData.length === 0) {
        throw new Error(`INSUFFICIENT_DATA: No prioritization fee data available from RPC`)
      }

      // Limit to requested sample size (most recent fees first)
      const samples = [...feeData]
        .sort((a, b) => Number(b.slot - a.slot)) // Sort by slot descending (newest first)
        .slice(0, this.config.prioritizationFeeSamples ?? 150)

      this.logger?.debug({
        message: "Prioritization fee samples retrieved successfully",
        requestId,
        samplesReceived: samples.length,
        latestSlot: samples[0]?.slot,
        oldestSlot: samples[samples.length - 1]?.slot,
        feeRange: {
          min: Math.min(...samples.map((s) => Number(s.prioritizationFee))),
          max: Math.max(...samples.map((s) => Number(s.prioritizationFee))),
        },
        step: "fee_samples_retrieved",
      })

      // Convert samples to the expected format with number types
      const convertedSamples = samples.map((sample) => ({
        slot: Number(sample.slot),
        prioritizationFee: Number(sample.prioritizationFee),
      }))

      // Calculate comprehensive fee market metrics
      const metrics = this.calculateFeeMarketMetrics(convertedSamples)

      // Generate actionable fee recommendations
      const recommendedFees = this.generateFeeRecommendations(metrics)

      // Provide market insights and observations
      const marketInsights = this.generateMarketInsights(metrics, convertedSamples)

      const analysisTimeMs = Date.now() - startTime

      this.logger?.info({
        message: "Fee market analysis completed",
        requestId,
        trend: metrics.trend,
        volatility: metrics.volatility,
        averageFee: metrics.averagePriorityFee.toFixed(0),
        p50Fee: metrics.percentiles.p50,
        p90Fee: metrics.percentiles.p90,
        analysisTimeMs,
        step: "fee_market_analysis_complete",
      })

      return {
        metrics,
        recommendedFees,
        marketInsights,
      }
    } catch (error) {
      const analysisTimeMs = Date.now() - startTime

      this.logger?.error({
        message: "Fee market analysis failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        analysisTimeMs,
        step: "fee_market_analysis_error",
      })

      throw error
    }
  }

  /**
   * Calculates comprehensive fee market metrics including percentiles and trend analysis
   * Provides statistical analysis of priority fee distribution and market behavior
   *
   * @param samples - Recent prioritization fee samples from RPC
   * @returns Complete fee market metrics
   */
  private calculateFeeMarketMetrics(samples: PrioritizationFeeSample[]): FeeMarketMetrics {
    // Extract fee values and sort for percentile calculation
    const feeValues = samples.map((sample) => sample.prioritizationFee).sort((a, b) => a - b)

    // Calculate percentile distribution
    const percentiles = this.calculatePercentiles(feeValues)

    // Analyze market trend direction
    const trend = this.analyzeFeeMarketTrend(samples)

    // Assess market volatility
    const volatility = this.assessFeeMarketVolatility(feeValues)

    // Calculate average priority fee
    const averagePriorityFee = feeValues.reduce((sum, fee) => sum + fee, 0) / feeValues.length

    return {
      percentiles,
      trend,
      volatility,
      samplesAnalyzed: samples.length,
      averagePriorityFee,
    }
  }

  /**
   * Calculates fee percentiles for different confirmation priority levels
   * Provides fee thresholds for conservative, normal, fast, and urgent transactions
   *
   * @param sortedFees - Fee values sorted in ascending order
   * @returns Percentile distribution for fee recommendations
   */
  private calculatePercentiles(sortedFees: number[]): FeeMarketMetrics["percentiles"] {
    const getPercentile = (percentile: number): number => {
      const index = Math.ceil((percentile / 100) * sortedFees.length) - 1
      return sortedFees[Math.max(0, Math.min(index, sortedFees.length - 1))]
    }

    return {
      p25: getPercentile(25), // Conservative - 25% of transactions pay more
      p50: getPercentile(50), // Normal - median fee level
      p75: getPercentile(75), // Fast - 25% of transactions pay more
      p90: getPercentile(90), // Urgent - 10% of transactions pay more
      p95: getPercentile(95), // Critical - 5% of transactions pay more
    }
  }

  /**
   * Analyzes fee market trend direction using recent price movements
   * Detects whether priority fees are generally rising, falling, or stable
   *
   * @param samples - Prioritization fee samples sorted by slot (newest first)
   * @returns Market trend classification
   */
  private analyzeFeeMarketTrend(samples: PrioritizationFeeSample[]): FeeMarketTrend {
    const trendWindow = Math.min(this.config.feeMarketSensitivity?.trendDetectionWindow ?? 50, samples.length)
    const recentSamples = samples.slice(0, trendWindow)

    if (recentSamples.length < 10) {
      return FeeMarketTrend.STABLE // Insufficient data for trend analysis
    }

    // Split samples into recent and older halves for comparison
    const halfPoint = Math.floor(recentSamples.length / 2)
    const recentHalf = recentSamples.slice(0, halfPoint)
    const olderHalf = recentSamples.slice(halfPoint)

    const recentAverage = recentHalf.reduce((sum, sample) => sum + sample.prioritizationFee, 0) / recentHalf.length
    const olderAverage = olderHalf.reduce((sum, sample) => sum + sample.prioritizationFee, 0) / olderHalf.length

    const feeChange = recentAverage - olderAverage
    const changeThreshold = this.config.feeMarketSensitivity?.stableFeeThreshold ?? 100

    if (feeChange > changeThreshold) {
      return FeeMarketTrend.RISING
    } else if (feeChange < -changeThreshold) {
      return FeeMarketTrend.FALLING
    } else {
      return FeeMarketTrend.STABLE
    }
  }

  /**
   * Assesses fee market volatility using coefficient of variation
   * Determines whether priority fees are stable, moderate, or highly volatile
   *
   * @param feeValues - Priority fee values for volatility calculation
   * @returns Volatility classification
   */
  private assessFeeMarketVolatility(feeValues: number[]): FeeMarketVolatility {
    if (feeValues.length < 5) {
      return FeeMarketVolatility.LOW // Insufficient data
    }

    const mean = feeValues.reduce((sum, fee) => sum + fee, 0) / feeValues.length
    const variance = feeValues.reduce((sum, fee) => sum + Math.pow(fee - mean, 2), 0) / feeValues.length
    const standardDeviation = Math.sqrt(variance)

    // Coefficient of variation (CV) = standard deviation / mean
    const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0

    const volatilityThreshold = this.config.feeMarketSensitivity?.volatilityThreshold ?? 0.3

    if (coefficientOfVariation > volatilityThreshold * 1.5) {
      return FeeMarketVolatility.HIGH
    } else if (coefficientOfVariation > volatilityThreshold) {
      return FeeMarketVolatility.MEDIUM
    } else {
      return FeeMarketVolatility.LOW
    }
  }

  /**
   * Generates actionable fee recommendations for different confirmation speeds
   * Provides specific fee levels optimized for various transaction priorities
   *
   * @param metrics - Calculated fee market metrics
   * @param samples - Raw fee samples for additional context
   * @returns Fee recommendations for different confirmation speeds
   */
  private generateFeeRecommendations(metrics: FeeMarketMetrics): FeeMarketAnalysisResult["recommendedFees"] {
    const { percentiles, trend, volatility } = metrics

    // Base recommendations on percentiles with adjustments for market conditions
    let conservative = percentiles.p25
    let normal = percentiles.p50
    let fast = percentiles.p75
    let urgent = percentiles.p90

    // Adjust recommendations based on market trend
    if (trend === FeeMarketTrend.RISING) {
      // In rising market, increase recommendations to avoid being outbid
      normal = Math.max(normal, percentiles.p50 * 1.2)
      fast = Math.max(fast, percentiles.p75 * 1.15)
      urgent = Math.max(urgent, percentiles.p95)
    } else if (trend === FeeMarketTrend.FALLING) {
      // In falling market, can be more conservative with fees
      conservative = Math.max(1, percentiles.p25 * 0.8)
      normal = Math.max(normal * 0.9, percentiles.p50 * 0.9)
    }

    // Adjust for market volatility
    if (volatility === FeeMarketVolatility.HIGH) {
      // In volatile markets, add buffer to avoid failed transactions
      const volatilityBuffer = 1.2
      conservative = Math.floor(conservative * volatilityBuffer)
      normal = Math.floor(normal * volatilityBuffer)
      fast = Math.floor(fast * volatilityBuffer)
      urgent = Math.floor(urgent * volatilityBuffer)
    }

    // Ensure minimum fee levels and logical ordering
    conservative = Math.max(1, conservative)
    normal = Math.max(conservative, normal)
    fast = Math.max(normal, fast)
    urgent = Math.max(fast, urgent)

    return {
      conservative,
      normal,
      fast,
      urgent,
    }
  }

  /**
   * Generates human-readable market insights and observations
   * Provides contextual information about current fee market conditions
   *
   * @param metrics - Calculated fee market metrics
   * @param samples - Raw fee samples for additional analysis
   * @returns Array of market insight descriptions
   */
  private generateMarketInsights(metrics: FeeMarketMetrics, samples: PrioritizationFeeSample[]): string[] {
    const insights: string[] = []
    const { percentiles, trend, volatility, averagePriorityFee } = metrics

    // Market trend insights
    if (trend === FeeMarketTrend.RISING) {
      insights.push("Priority fees are trending upward - consider faster confirmation to avoid being outbid")
    } else if (trend === FeeMarketTrend.FALLING) {
      insights.push("Priority fees are declining - good opportunity for cost-effective transactions")
    } else {
      insights.push("Priority fee market is stable - standard fee levels should provide reliable confirmation")
    }

    // Volatility insights
    if (volatility === FeeMarketVolatility.HIGH) {
      insights.push("High fee volatility detected - consider adding buffer to avoid confirmation delays")
    } else if (volatility === FeeMarketVolatility.LOW) {
      insights.push("Fee market is stable with low volatility - predictable confirmation costs")
    }

    // Fee level insights
    if (percentiles.p90 > percentiles.p50 * 5) {
      insights.push("Significant fee spread detected - urgent transactions require substantially higher fees")
    }

    if (averagePriorityFee < 100) {
      insights.push("Very low priority fee environment - minimal competition for block inclusion")
    } else if (averagePriorityFee > 5000) {
      insights.push("High priority fee environment - strong competition for fast confirmation")
    }

    // Zero fee analysis
    const zeroFeeCount = samples.filter((sample) => sample.prioritizationFee === 0).length
    const zeroFeePercentage = (zeroFeeCount / samples.length) * 100

    if (zeroFeePercentage > 50) {
      insights.push(
        `${zeroFeePercentage.toFixed(1)}% of recent transactions used zero priority fees - minimal fee required`
      )
    } else if (zeroFeePercentage < 10) {
      insights.push("Most transactions are using priority fees - zero fee transactions may experience delays")
    }

    return insights
  }
}
