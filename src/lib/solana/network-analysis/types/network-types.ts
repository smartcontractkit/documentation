/**
 * Comprehensive type definitions for Solana network analysis
 * Provides strongly-typed interfaces for network condition assessment,
 * fee market analysis, and transaction cost optimization
 */

/**
 * Network congestion classification based on transaction throughput and slot production
 */
export enum NetworkCongestionLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Fee market trend analysis indicating price direction
 */
export enum FeeMarketTrend {
  RISING = "rising",
  FALLING = "falling",
  STABLE = "stable",
}

/**
 * Fee market volatility classification
 */
export enum FeeMarketVolatility {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

/**
 * User risk tolerance for transaction cost optimization
 */
export enum RiskTolerance {
  CONSERVATIVE = "conservative",
  NORMAL = "normal",
  AGGRESSIVE = "aggressive",
}

/**
 * Network throughput metrics derived from performance samples
 */
export interface NetworkThroughputMetrics {
  /** Average transactions processed per slot */
  averageTransactionsPerSlot: number
  /** Non-vote transactions per second (real user activity) */
  nonVoteTransactionRate: number
  /** Slot production rate (healthy network: 2.4-2.6 slots/second) */
  slotProductionRate: number
  /** Ratio of vote to total transactions (network overhead indicator) */
  voteTransactionRatio: number
  /** Duration of analysis window in seconds */
  timeWindowSeconds: number
  /** Number of samples analyzed */
  samplesCount: number
}

/**
 * Fee market analysis with percentile distribution and trend detection
 */
export interface FeeMarketMetrics {
  /** Priority fee percentiles in microlamports per compute unit */
  percentiles: {
    p25: number // Conservative priority level
    p50: number // Normal confirmation speed
    p75: number // Fast confirmation preference
    p90: number // Urgent transactions
    p95: number // Critical/emergency transactions
  }
  /** Market direction trend analysis */
  trend: FeeMarketTrend
  /** Market price volatility assessment */
  volatility: FeeMarketVolatility
  /** Number of recent blocks analyzed */
  samplesAnalyzed: number
  /** Average priority fee across all samples */
  averagePriorityFee: number
}

/**
 * Detailed transaction cost breakdown for precise budgeting
 */
export interface TransactionCostBreakdown {
  /** Base transaction fee in lamports (rent + message processing) */
  baseFee: number
  /** Compute unit cost in lamports (compute units × priority fee rate) */
  computeUnitCost: number
  /** Total transaction cost in lamports */
  totalCost: number
  /** Priority fee rate in microlamports per compute unit */
  priorityFeePerCU: number
  /** Estimated compute units required for transaction */
  estimatedComputeUnits: number
}

/**
 * User preferences for transaction optimization
 */
export interface TransactionPreferences {
  /** Maximum acceptable cost in lamports (optional budget constraint) */
  maxCostLamports?: number
  /** Target confirmation time in seconds (speed preference) */
  targetConfirmationTime?: number
  /** Risk tolerance for cost vs confirmation trade-offs */
  riskTolerance: RiskTolerance
  /** Whether to prioritize cost savings over speed */
  prioritizeCostOptimization?: boolean
}

/**
 * Network condition recommendation for optimal transaction parameters
 */
export interface NetworkRecommendation {
  /** Recommended priority fee in microlamports per compute unit */
  priorityFee: number
  /** Additional compute unit buffer percentage for reliability */
  computeBuffer: number
  /** Expected confirmation time in seconds */
  expectedConfirmationSeconds: number
  /** Confidence level of the recommendation (0.0-1.0) */
  confidence: number
  /** Reasoning for the recommendation */
  rationale: string
}

/**
 * Comprehensive network conditions assessment
 * Aggregates throughput, fee market, and cost analysis for decision making
 */
export interface NetworkConditions {
  /** Overall network congestion classification */
  congestionLevel: NetworkCongestionLevel
  /** Network throughput and slot production metrics */
  throughput: NetworkThroughputMetrics
  /** Fee market analysis and pricing trends */
  feeMarket: FeeMarketMetrics
  /** Actionable recommendations for transaction optimization */
  recommendation: NetworkRecommendation
  /** Timestamp when analysis was performed */
  analyzedAt: Date
  /** Duration of analysis in milliseconds */
  analysisTimeMs: number
}

/**
 * Configuration parameters for network analysis
 */
export interface NetworkAnalysisConfig {
  /** Number of performance samples to analyze */
  performanceSamples: number
  /** Number of prioritization fee samples to analyze */
  prioritizationFeeSamples: number
  /** Minimum slot production rate considered healthy (slots/second) */
  healthySlotProductionRate: number
  /** Congestion thresholds for non-vote transaction rates */
  congestionThresholds: {
    low: number // transactions/second
    medium: number
    high: number
    critical: number
  }
  /** Fee trend detection sensitivity */
  feeMarketSensitivity: {
    trendDetectionWindow: number // number of samples
    volatilityThreshold: number // coefficient of variation
    stableFeeThreshold: number // microlamports/CU change threshold
  }
}

/**
 * Raw performance sample data from Solana RPC
 */
export interface PerformanceSample {
  numNonVoteTransactions: number
  numSlots: number
  numTransactions: number
  samplePeriodSecs: number
  slot: number
}

/**
 * Raw prioritization fee data from Solana RPC
 */
export interface PrioritizationFeeSample {
  prioritizationFee: number // microlamports per compute unit
  slot: number
}

/**
 * Result from network throughput analysis
 */
export interface ThroughputAnalysisResult {
  metrics: NetworkThroughputMetrics
  congestionLevel: NetworkCongestionLevel
  healthScore: number // 0.0-1.0 network health indicator
  anomaliesDetected: string[] // List of unusual conditions
}

/**
 * Result from fee market analysis
 */
export interface FeeMarketAnalysisResult {
  metrics: FeeMarketMetrics
  recommendedFees: {
    conservative: number // microlamports/CU
    normal: number
    fast: number
    urgent: number
  }
  marketInsights: string[] // Human-readable market observations
}

/**
 * Cache entry for network analysis to avoid excessive RPC calls
 */
