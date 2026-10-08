import { formatUnits } from "ethers"

/**
 * Formats a CCV (Cross-Chain Verification) threshold amount from the token's
 * smallest unit (e.g. wei) into a human-readable token amount.
 *
 * CCV threshold values returned by the data layer are raw integer strings in
 * the token's smallest denomination (matching how `thresholdAmount` is stored
 * on-chain and in the pool info blob). Rendering them raw (e.g. `1000000000`
 * for 1 USDC) is unreadable, so this converts using the token's decimals.
 *
 * Uses ethers v6 `formatUnits` (string-based, no floating-point loss) for the
 * conversion, then caps display at 2 decimal places — matching the convention
 * used by `formatRateLimit` in `rate-limit-formatter.ts` (via
 * `maximumFractionDigits: 2`). This keeps dust values readable (e.g. 10 wei
 * with 18 decimals shows as `0` instead of `0.00000000000000001`).
 *
 * @param thresholdAmount - Raw threshold value as a string (smallest unit),
 *   e.g. `"1000000000000000000"` for 1 token with 18 decimals.
 * @param decimals - Token decimals (e.g. 18 for most ERC-20s, 6 for USDC/USDT,
 *   8 for BTC variants). Falls back to 18 if not provided.
 * @returns Formatted string with thousand separators and at most 2 decimal
 *   places (e.g. `"1,000"` or `"1.5"`), or `"0"` for a zero/empty input, or
 *   the raw value if formatting fails (e.g. non-integer input).
 */
export function formatCcvThreshold(thresholdAmount: string | null | undefined, decimals = 18): string {
  if (!thresholdAmount || thresholdAmount === "0") return "0"

  try {
    const formatted = formatUnits(thresholdAmount, decimals)
    // Cap at 2 decimal places to match the rate-limit display convention
    // (formatRateLimit uses maximumFractionDigits: 2). parseFloat drops
    // trailing zeros; toLocaleString adds thousand separators.
    const num = parseFloat(formatted)
    if (num === 0) return "0"
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
  } catch {
    // If the value isn't a valid integer string, fall back to showing it raw
    // rather than crashing the render.
    return thresholdAmount
  }
}
