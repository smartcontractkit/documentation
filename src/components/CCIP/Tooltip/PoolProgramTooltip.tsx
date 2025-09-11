import React from "react"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"

export const PoolProgramTooltip: React.FC = () => (
  <Tooltip
    label=""
    tip={
      <div>
        Official Chainlink self-service pool programs for initializing token pools on Solana.
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>
            <strong>BurnMint:</strong> Burns tokens on outbound transfers, mints tokens on inbound transfers
          </li>
          <li>
            <strong>LockRelease:</strong> Locks tokens on outbound transfers, releases tokens on inbound transfers
          </li>
        </ul>
        For hands-on tutorial, see{" "}
        <a href="/ccip/tutorials/svm/cross-chain-tokens" style={{ color: "var(--blue-500)" }}>
          Cross-Chain Tokens on Solana
        </a>
        .
      </div>
    }
    labelStyle={{
      marginRight: "8px",
    }}
    style={{
      display: "inline-block",
      verticalAlign: "middle",
      marginBottom: "2px",
      marginLeft: "4px",
    }}
    hoverable={true}
    hideDelay={300}
  />
)
