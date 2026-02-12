import type { RateLimiterConfig } from "~/lib/ccip/types/index.ts"

/**
 * Formats a rate limit value from wei to tokens
 * @param value - Rate limit value in wei (as string)
 * @returns Formatted string with proper number formatting
 */
export function formatRateLimit(value: string | null | undefined): string {
  if (!value || value === "0") return "0"

  try {
    // Convert from wei to tokens (divide by 1e18)
    const numValue = BigInt(value)
    const formatted = Number(numValue) / 1e18
    return formatted.toLocaleString(undefined, { maximumFractionDigits: 2 })
  } catch (error) {
    console.error("Error formatting rate limit:", error)
    return "0"
  }
}

/**
 * Checks if a token is paused based on rate limit configuration
 * A token is considered paused if the capacity is "0"
 * @param rateLimit - Rate limiter configuration
 * @returns True if token is paused
 */
export function isTokenPaused(rateLimit: RateLimiterConfig | null | undefined): boolean {
  return rateLimit?.capacity === "0"
}

/**
 * Gets display value for a rate limit
 * @param rateLimit - Rate limiter configuration
 * @param isLoading - Whether data is still loading
 * @returns Display string for the rate limit
 */
export function getRateLimitDisplay(rateLimit: RateLimiterConfig | null | undefined, isLoading: boolean): string {
  if (isLoading) return "Loading..."
  if (!rateLimit) return "N/A"
  if (!rateLimit.isEnabled) return "Disabled"
  return formatRateLimit(rateLimit.capacity)
}

/**
 * Gets display value for a rate limit capacity
 * @param rateLimit - Rate limiter configuration
 * @param isLoading - Whether data is still loading
 * @returns Display string for capacity
 */
export function getRateLimitCapacityDisplay(
  rateLimit: RateLimiterConfig | null | undefined,
  isLoading: boolean
): string {
  if (isLoading) return "Loading..."
  if (!rateLimit) return "Unavailable"
  if (!rateLimit.isEnabled) return "Disabled"
  return formatRateLimit(rateLimit.capacity)
}

/**
 * Gets display value for a rate limit refill rate
 * @param rateLimit - Rate limiter configuration
 * @param isLoading - Whether data is still loading
 * @returns Display string for refill rate
 */
export function getRateLimitRateDisplay(rateLimit: RateLimiterConfig | null | undefined, isLoading: boolean): string {
  if (isLoading) return "Loading..."
  if (!rateLimit) return "N/A"
  if (!rateLimit.isEnabled) return "Disabled"
  return formatRateLimit(rateLimit.rate)
}
