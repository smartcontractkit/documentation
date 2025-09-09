/**
 * Network throughput analyzer for Solana blockchain conditions
 * Processes getRecentPerformanceSamples data to assess network congestion,
 * slot production health, and transaction density patterns
 */

import type { Logger } from "@lib/logging/index.js"
import type { IRpcContext } from "../../infrastructure/rpc/types.ts"
import {
  NetworkCongestionLevel,
  type NetworkThroughputMetrics,
  type ThroughputAnalysisResult,
  type PerformanceSample,
  type NetworkAnalysisConfig,
} from "../types/network-types.ts"

/**
 * Default configuration for throughput analysis
 */
const DEFAULT_THROUGHPUT_CONFIG = {
  performanceSamples: 10,
  healthySlotProductionRate: 2.3, // slots/second (conservative threshold)
  congestionThresholds: {
    low: 800, // non-vote transactions/second
    medium: 1500,
    high: 2500,
    critical: 4000,
  },
}

/**
 * Analyzes Solana network throughput using performance samples
 * Provides accurate congestion assessment and network health indicators
 */
export class NetworkThroughputAnalyzer {
  constructor(
    private readonly rpcContext: IRpcContext,
    private readonly config: Partial<NetworkAnalysisConfig> = {},
    private readonly logger?: Logger
  ) {
    // Merge user config with defaults
    this.config = { ...DEFAULT_THROUGHPUT_CONFIG, ...config }
  }

  /**
   * Analyzes current network throughput conditions using recent performance data
   * Correctly processes getRecentPerformanceSamples RPC response structure
   *
   * @param requestId - Request identifier for logging correlation
   * @returns Comprehensive throughput analysis with congestion classification
   * @throws Error when RPC methods fail or insufficient data available
   */
  async analyzeNetworkThroughput(requestId?: string): Promise<ThroughputAnalysisResult> {
    const startTime = Date.now()

    try {
      this.logger?.debug({
        message: "Starting network throughput analysis",
        requestId,
        samplesRequested: this.config.performanceSamples,
        step: "throughput_analysis_start",
      })

      // Fetch recent performance samples using correct RPC method
      const samples = await this.rpcContext.rpc.getRecentPerformanceSamples(this.config.performanceSamples ?? 10).send()

      if (!samples || samples.length === 0) {
        throw new Error(`INSUFFICIENT_DATA: No performance samples available from RPC`)
      }

      this.logger?.debug({
        message: "Performance samples retrieved successfully",
        requestId,
        samplesReceived: samples.length,
        latestSlot: samples[0]?.slot,
        oldestSlot: samples[samples.length - 1]?.slot,
        step: "samples_retrieved",
      })

      // Convert readonly array to mutable array and convert bigint fields to numbers
      const samplesArray = samples.map((sample) => ({
        slot: Number(sample.slot),
        numTransactions: Number(sample.numTransactions),
        numNonVoteTransactions: Number(sample.numNonVoteTransactions),
        numSlots: Number(sample.numSlots),
        samplePeriodSecs: sample.samplePeriodSecs,
      }))

      // Process samples to extract meaningful metrics
      const metrics = this.calculateThroughputMetrics(samplesArray)

      // Determine congestion level based on multiple indicators
      const congestionLevel = this.assessCongestionLevel(metrics)

      // Calculate overall network health score
      const healthScore = this.calculateNetworkHealthScore(metrics)

      // Detect network anomalies
      const anomaliesDetected = this.detectNetworkAnomalies(samplesArray, metrics)

      const analysisTimeMs = Date.now() - startTime

      this.logger?.info({
        message: "Network throughput analysis completed",
        requestId,
        congestionLevel,
        healthScore: healthScore.toFixed(3),
        nonVoteTransactionRate: metrics.nonVoteTransactionRate.toFixed(1),
        slotProductionRate: metrics.slotProductionRate.toFixed(2),
        analysisTimeMs,
        step: "throughput_analysis_complete",
      })

      return {
        metrics,
        congestionLevel,
        healthScore,
        anomaliesDetected,
      }
    } catch (error) {
      const analysisTimeMs = Date.now() - startTime

      this.logger?.error({
        message: "Network throughput analysis failed",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        analysisTimeMs,
        step: "throughput_analysis_error",
      })

      throw error
    }
  }

  /**
   * Calculates comprehensive throughput metrics from performance samples
   * Properly handles the 60-second sampling period and derives meaningful rates
   *
   * @param samples - Raw performance samples from RPC
   * @returns Calculated throughput metrics
   */
  private calculateThroughputMetrics(samples: PerformanceSample[]): NetworkThroughputMetrics {
    // Calculate aggregated metrics across all samples
    const totalTransactions = samples.reduce((sum, sample) => sum + sample.numTransactions, 0)
    const totalNonVoteTransactions = samples.reduce((sum, sample) => sum + sample.numNonVoteTransactions, 0)
    const totalSlots = samples.reduce((sum, sample) => sum + sample.numSlots, 0)
    const totalTimeSeconds = samples.reduce((sum, sample) => sum + sample.samplePeriodSecs, 0)

    // Calculate average rates (all samples are 60-second windows)
    const averageTransactionsPerSlot = totalSlots > 0 ? totalTransactions / totalSlots : 0
    const nonVoteTransactionRate = totalTimeSeconds > 0 ? totalNonVoteTransactions / totalTimeSeconds : 0
    const slotProductionRate = totalTimeSeconds > 0 ? totalSlots / totalTimeSeconds : 0
    const voteTransactionRatio =
      totalTransactions > 0 ? (totalTransactions - totalNonVoteTransactions) / totalTransactions : 0

    return {
      averageTransactionsPerSlot,
      nonVoteTransactionRate,
      slotProductionRate,
      voteTransactionRatio,
      timeWindowSeconds: totalTimeSeconds,
      samplesCount: samples.length,
    }
  }

  /**
   * Assesses network congestion level using multiple indicators
   * Combines transaction rate, slot production health, and transaction density
   *
   * @param metrics - Calculated throughput metrics
   * @returns Network congestion classification
   */
  private assessCongestionLevel(metrics: NetworkThroughputMetrics): NetworkCongestionLevel {
    const { nonVoteTransactionRate, slotProductionRate } = metrics
    const { congestionThresholds, healthySlotProductionRate } = this.config

    // Check for critical slot production issues first
    const healthyRate = healthySlotProductionRate ?? 2.3
    if (slotProductionRate < healthyRate * 0.85) {
      // >15% slower than healthy
      return NetworkCongestionLevel.CRITICAL
    }

    // Classify based on non-vote transaction rate (real user activity)
    const thresholds = congestionThresholds ?? { low: 800, medium: 1500, high: 2500, critical: 4000 }
    if (nonVoteTransactionRate >= thresholds.critical) {
      return NetworkCongestionLevel.CRITICAL
    } else if (nonVoteTransactionRate >= thresholds.high) {
      return NetworkCongestionLevel.HIGH
    } else if (nonVoteTransactionRate >= thresholds.medium) {
      return NetworkCongestionLevel.MEDIUM
    } else {
      // Additional check for medium congestion based on slot production
      if (slotProductionRate < healthyRate * 0.95) {
        // >5% slower
        return NetworkCongestionLevel.MEDIUM
      }
      return NetworkCongestionLevel.LOW
    }
  }

  /**
   * Calculates overall network health score (0.0 = unhealthy, 1.0 = perfect health)
   * Considers slot production rate, transaction processing efficiency, and consistency
   *
   * @param metrics - Calculated throughput metrics
   * @returns Health score between 0.0 and 1.0
   */
  private calculateNetworkHealthScore(metrics: NetworkThroughputMetrics): number {
    const { slotProductionRate, nonVoteTransactionRate, averageTransactionsPerSlot } = metrics
    const { healthySlotProductionRate, congestionThresholds } = this.config

    // Slot production health (0.0-0.4 weight)
    const healthyRate = healthySlotProductionRate ?? 2.3
    const slotHealthScore = Math.min(1.0, slotProductionRate / healthyRate)

    // Transaction processing efficiency (0.0-0.3 weight)
    const thresholds = congestionThresholds ?? { low: 800, medium: 1500, high: 2500, critical: 4000 }
    const maxHealthyTxRate = thresholds.medium
    const txEfficiencyScore = Math.max(0.0, 1.0 - nonVoteTransactionRate / maxHealthyTxRate)

    // Transaction density reasonableness (0.0-0.3 weight)
    const idealTxPerSlot = 1500 // Reasonable transaction density
    const maxTxPerSlot = 3000 // High but manageable density
    const txDensityScore =
      averageTransactionsPerSlot <= idealTxPerSlot
        ? 1.0
        : Math.max(0.0, 1.0 - (averageTransactionsPerSlot - idealTxPerSlot) / (maxTxPerSlot - idealTxPerSlot))

    // Weighted health score calculation
    const overallScore = slotHealthScore * 0.4 + txEfficiencyScore * 0.3 + txDensityScore * 0.3

    return Math.max(0.0, Math.min(1.0, overallScore))
  }

  /**
   * Detects unusual network conditions that may affect transaction processing
   * Identifies anomalies in slot production patterns and transaction distributions
   *
   * @param samples - Raw performance samples for pattern analysis
   * @param metrics - Calculated metrics for threshold comparisons
   * @returns Array of detected anomaly descriptions
   */
  private detectNetworkAnomalies(samples: PerformanceSample[], metrics: NetworkThroughputMetrics): string[] {
    const anomalies: string[] = []

    // Check for irregular slot production
    const slotVariations = samples.map((sample) => sample.numSlots / sample.samplePeriodSecs)
    const slotVariance = this.calculateVariance(slotVariations)
    if (slotVariance > 0.5) {
      // High variance in slot production
      anomalies.push("Irregular slot production detected - network may be experiencing validator issues")
    }

    // Check for unusual vote transaction ratios
    if (metrics.voteTransactionRatio > 0.9) {
      anomalies.push("Extremely high vote transaction ratio - potential network consensus issues")
    } else if (metrics.voteTransactionRatio < 0.5) {
      anomalies.push("Unusually low vote transaction ratio - may indicate measurement errors")
    }

    // Check for transaction processing outliers
    const txRates = samples.map((sample) => sample.numNonVoteTransactions / sample.samplePeriodSecs)
    const maxTxRate = Math.max(...txRates)
    const minTxRate = Math.min(...txRates)
    if (maxTxRate > minTxRate * 3) {
      // 3x variation in transaction rates
      anomalies.push("High variation in transaction processing rates detected")
    }

    // Check for stalled slot production
    const stalledSlots = samples.filter((sample) => sample.numSlots < 120) // < 2 slots/sec
    if (stalledSlots.length > samples.length * 0.2) {
      // >20% of samples show stalled slots
      anomalies.push("Frequent slot production delays detected - network may be under stress")
    }

    return anomalies
  }

  /**
   * Calculates variance for anomaly detection
   *
   * @param values - Numeric values to analyze
   * @returns Variance of the dataset
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length
    const squaredDifferences = values.map((value) => Math.pow(value - mean, 2))

    return squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length
  }
}
