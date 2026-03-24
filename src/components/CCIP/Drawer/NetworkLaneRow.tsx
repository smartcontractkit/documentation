// AI AGENT NOTE: This component is the accordion variant of the network lane row (used when SHOW_VERIFIERS_ACCORDION = true).
// Any UI changes to the row layout (columns, styling, network name cell, rate limit cells, etc.) must also be
// applied to NetworkLaneRowNoVerifiers.tsx to keep both variants in sync.
//
// When the Verifiers sub-table feature is fully released, we will:
//   1. Remove the SHOW_VERIFIERS_ACCORDION feature flag from TokenDrawer.tsx
//   2. Delete NetworkLaneRowNoVerifiers.tsx
//   3. Use this component (NetworkLaneRow) unconditionally

import { Fragment } from "react"
import type { RateLimiterConfig } from "~/lib/ccip/types/index.ts"
import type { Verifier } from "~/config/data/ccip/index.ts"
import type { ChainType, ExplorerInfo } from "~/config/index.ts"
import { RateLimitCell } from "~/components/CCIP/RateLimitCell.tsx"
import { VerifiersAccordionRow } from "./VerifiersAccordionRow.tsx"

export interface NetworkLaneRowProps {
  networkDetails: { name: string; logo: string }
  tokenPaused: boolean
  isExpanded: boolean
  onToggle: () => void
  mechanism: string
  allLimits: { standard: RateLimiterConfig | null; ftf: RateLimiterConfig | null }
  isLoadingRateLimits: boolean
  destinationVerifiers: Verifier[]
  explorer: ExplorerInfo
  chainType: ChainType
}

export function NetworkLaneRow({
  networkDetails,
  tokenPaused,
  isExpanded,
  onToggle,
  mechanism,
  allLimits,
  isLoadingRateLimits,
  destinationVerifiers,
  explorer,
  chainType,
}: NetworkLaneRowProps) {
  return (
    <Fragment>
      <tr
        className={`ccip-table__accordion-row ${tokenPaused ? "ccip-table__row--paused" : ""} ${isExpanded ? "ccip-table__accordion-row--expanded" : ""}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Hide" : "Show"} verifiers for ${networkDetails.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <td>
          <div className={`ccip-table__network-name ${tokenPaused ? "ccip-table__network-name--paused" : ""}`}>
            <img
              src={networkDetails.logo}
              alt={`${networkDetails.name} blockchain logo`}
              className="ccip-table__logo"
            />
            {networkDetails.name}
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
        <td>
          <div className="ccip-table__verifier-toggle">
            <svg
              className={`ccip-table__expand-icon ${isExpanded ? "ccip-table__expand-icon--expanded" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <VerifiersAccordionRow destinationVerifiers={destinationVerifiers} explorer={explorer} chainType={chainType} />
      )}
    </Fragment>
  )
}
