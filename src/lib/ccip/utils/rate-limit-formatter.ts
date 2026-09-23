import { formatUnits } from "ethers"
import type { RateLimiterConfig } from "~/lib/ccip/types/index.ts"

/**
 * Formats a rate limit value from smallest-unit to tokens
 * @param value - Rate limit value in smallest units (as string)
 * @param decimals - Token decimals (e.g. 6 for USDC, 18 for LINK). Defaults to 18.
 * @returns Formatted string with proper number formatting
 */
export function formatRateLimit(value: string | null | undefined, decimals = 18): string {
  if (!value || value === "0") return "0"

  try {
    // Convert from smallest units to tokens using the token's decimals
    const formatted = formatUnits(BigInt(value), decimals)
    const num = parseFloat(formatted)
    if (num === 0) return "0"
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  } catch (error) {
    console.error("Error formatting rate limit:", error)
    return "0"
  }
}

/**
 * Gets display value for a rate limit
 * @param rateLimit - Rate limiter configuration
 * @param isLoading - Whether data is still loading
 * @returns Display string for the rate limit
 */
export function getRateLimitDisplay(
  rateLimit: RateLimiterConfig | null | undefined,
  isLoading: boolean,
  decimals = 18
): string {
  if (isLoading) return "Loading..."
  if (!rateLimit) return "N/A"
  if (!rateLimit.isEnabled) return "Disabled"
  return formatRateLimit(rateLimit.capacity, decimals)
}

/**
 * Gets display value for a rate limit capacity
 * @param rateLimit - Rate limiter configuration
 * @param isLoading - Whether data is still loading
 * @returns Display string for capacity
 */
export function getRateLimitCapacityDisplay(
  rateLimit: RateLimiterConfig | null | undefined,
  isLoading: boolean,
  decimals = 18
): string {
  if (isLoading) return "Loading..."
  if (!rateLimit) return "Unavailable"
  if (!rateLimit.isEnabled) return "Disabled"
  return formatRateLimit(rateLimit.capacity, decimals)
}

/**
 * Gets display value for a rate limit refill rate
 * @param rateLimit - Rate limiter configuration
 * @param isLoading - Whether data is still loading
 * @returns Display string for refill rate
 */
export function getRateLimitRateDisplay(
  rateLimit: RateLimiterConfig | null | undefined,
  isLoading: boolean,
  decimals = 18
): string {
  if (isLoading) return "Loading..."
  if (!rateLimit) return "N/A"
  if (!rateLimit.isEnabled) return "Disabled"
  return formatRateLimit(rateLimit.rate, decimals)
}
