// AI AGENT NOTE: This is a temporary component used while SHOW_VERIFIERS_ACCORDION = false in TokenDrawer.tsx.
// It mirrors the row layout of NetworkLaneRow.tsx without the accordion/verifiers functionality.
// Any UI changes to the row layout (columns, styling, network name cell, rate limit cells, etc.) must also be
// applied to NetworkLaneRow.tsx to keep both variants in sync.
//
// When the Verifiers sub-table feature is fully released, this file should be deleted entirely.

import type { RateLimiterConfig } from "~/lib/ccip/types/index.ts"
import { RateLimitCell } from "~/components/CCIP/RateLimitCell.tsx"

export interface NetworkLaneRowNoVerifiersProps {
  networkDetails: { name: string; logo: string }
  tokenPaused: boolean
  mechanism: string
  allLimits: { standard: RateLimiterConfig | null; ftf: RateLimiterConfig | null }
  isLoadingRateLimits: boolean
  showWarning?: boolean
  onWarningEnter?: (target: HTMLElement) => void
  onWarningLeave?: () => void
}

export function NetworkLaneRowNoVerifiers({
  networkDetails,
  tokenPaused,
  mechanism,
  allLimits,
  isLoadingRateLimits,
  showWarning,
  onWarningEnter,
  onWarningLeave,
}: NetworkLaneRowNoVerifiersProps) {
  return (
    <tr className={tokenPaused ? "ccip-table__row--paused" : ""}>
      <td>
        <div className={`ccip-table__network-name ${tokenPaused ? "ccip-table__network-name--paused" : ""}`}>
          <img src={networkDetails.logo} alt={`${networkDetails.name} blockchain logo`} className="ccip-table__logo" />
          {networkDetails.name}
          {showWarning && (
            <span
              style={{ display: "inline-flex", alignItems: "center", marginLeft: "6px" }}
              onMouseEnter={(e) => {
                e.stopPropagation()
                onWarningEnter?.(e.currentTarget)
              }}
              onMouseLeave={(e) => {
                e.stopPropagation()
                onWarningLeave?.()
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <span
                aria-label="Rate limit warning"
                style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
              >
                ⚠️
              </span>
            </span>
          )}
          {tokenPaused && (
            <span className="ccip-table__paused-badge" title="Transfers are currently paused">
              ⏸️
            </span>
          )}
        </div>
      </td>
      <td>{mechanism}</td>
      <td>
        <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.standard} type="capacity" />
      </td>
      <td>
        <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.standard} type="rate" />
      </td>
      <td>
        <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.ftf} type="capacity" />
      </td>
      <td>
        <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.ftf} type="rate" />
      </td>
    </tr>
  )
}
