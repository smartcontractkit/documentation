import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import type { RateLimiterConfig } from "~/lib/ccip/types/index.ts"
import { formatRateLimit } from "~/lib/ccip/utils/rate-limit-formatter.ts"

interface RateLimitCellProps {
  isLoading: boolean
  rateLimit: RateLimiterConfig | null | undefined
  type: "capacity" | "rate"
  showUnavailableTooltip?: boolean
}

/**
 * Component for displaying rate limit values in table cells
 * Handles loading, disabled, unavailable, and value states
 */
export function RateLimitCell({ isLoading, rateLimit, type, showUnavailableTooltip = false }: RateLimitCellProps) {
  if (isLoading) {
    return <>Loading...</>
  }

  if (!rateLimit) {
    if (showUnavailableTooltip) {
      return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          Unavailable
          <Tooltip
            label=""
            tip="Rate limit data is currently unavailable. You can find the Token Pool rate limit by reading the Token Pool contract directly on the relevant blockchain."
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        </span>
      )
    }
    return <>N/A</>
  }

  if (!rateLimit.isEnabled) {
    return <>Disabled</>
  }

  const value = type === "capacity" ? rateLimit.capacity : rateLimit.rate
  return <>{formatRateLimit(value)}</>
}
