/**
 * Time constants for Solana faucet operations
 * Centralized timing values to eliminate hardcoding
 */

/**
 * Common time intervals in seconds
 */
export const TIME_INTERVALS = {
  /** One minute in seconds */
  MINUTE: 60,
  /** One hour in seconds */
  HOUR: 60 * 60,
  /** Six hours in seconds */
  SIX_HOURS: 6 * 60 * 60,
  /** One day in seconds */
  DAY: 24 * 60 * 60,
  /** Thirty days in seconds */
  THIRTY_DAYS: 30 * 24 * 60 * 60,
} as const

/**
 * Validation constants for timestamps and intervals
 */
export const VALIDATION_LIMITS = {
  /** Ten years in seconds - for validating timestamp sanity */
  TEN_YEARS_AGO_OFFSET: 10 * 365 * 24 * 60 * 60,
  /** Future timestamp tolerance (1 hour) */
  FUTURE_TOLERANCE: TIME_INTERVALS.HOUR,
  /** Minimum valid drip interval (1 minute) */
  MIN_DRIP_INTERVAL: TIME_INTERVALS.MINUTE,
  /** Maximum valid drip interval (30 days) */
  MAX_DRIP_INTERVAL: TIME_INTERVALS.THIRTY_DAYS,
  /** Default drip interval when validation fails (6 hours) */
  DEFAULT_DRIP_INTERVAL: TIME_INTERVALS.SIX_HOURS,
} as const
