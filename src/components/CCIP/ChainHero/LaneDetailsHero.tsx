import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import AddressComponent from "~/components/AddressReact.tsx"
import "./LaneDetailsHero.css"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import CopyValue from "../CopyValue/CopyValue.tsx"
import { LaneFilter } from "~/config/data/ccip/types.ts"
import { ChainType, ExplorerInfo } from "@config/types.ts"

interface LaneDetailsHeroProps {
  sourceNetwork: {
    logo: string
    name: string
    chainType?: ChainType
  }
  destinationNetwork: {
    logo: string
    name: string
    chainType?: ChainType
  }
  onRamp: string
  offRamp: string
  destinationAddress: string
  enforceOutOfOrder?: boolean
  explorer: ExplorerInfo
  inOutbound: LaneFilter
}

// Arrow component to avoid duplication
const DirectionalArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.666626 7.99673H14.6666M7.66663 15L14.6666 8L7.66663 1" stroke="var(--gray-900)" />
  </svg>
)

// Network display component to standardize rendering
const NetworkDisplay = ({ logo, name }: { logo: string; name: string }) => (
  <div className="lane-details-hero__network">
    <img src={logo} alt={name} className="lane-details-hero__network-logo" />
    {name}
  </div>
)

// Reusable tooltip component with consistent styling
const StyledTooltip = ({ tip, label = "" }: { tip: string; label?: string }) => (
  <Tooltip
    label={label}
    tip={tip}
    style={{
      display: "inline-flex",
      marginLeft: "8px",
      alignItems: "center",
      verticalAlign: "middle",
    }}
    labelStyle={{
      marginRight: "8px",
    }}
  />
)

// Detail item component for consistent label-value pairs
const DetailItem = ({
  label,
  children,
  clipboardType,
  tooltip,
}: {
  label: string
  children: React.ReactNode
  clipboardType?: string
  tooltip?: React.ReactNode
}) => (
  <>
    <div className="lane-details-hero__details__label">
      {label}
      {tooltip}
    </div>
    <div data-clipboard-type={clipboardType}>{children}</div>
  </>
)

function LaneDetailsHero({
  sourceNetwork,
  destinationNetwork,
  onRamp,
  offRamp,
  destinationAddress,
  enforceOutOfOrder,
  explorer,
  inOutbound,
}: LaneDetailsHeroProps) {
  // Map Out-of-Order flag to display text
  const getOutOfOrderText = (value?: boolean) => {
    if (value === true) return "Required"
    if (value === false) return "Optional"
    return "N/A"
  }

  return (
    <div className="lane-details-hero">
      {/* Display networks with direction based on lane type */}
      <div className="lane-details-hero__networks">
        {inOutbound === LaneFilter.Inbound ? (
          <>
            <NetworkDisplay logo={destinationNetwork.logo} name={destinationNetwork.name} />
            <DirectionalArrow />
            <NetworkDisplay logo={sourceNetwork.logo} name={sourceNetwork.name} />
          </>
        ) : (
          <>
            <NetworkDisplay logo={sourceNetwork.logo} name={sourceNetwork.name} />
            <DirectionalArrow />
            <NetworkDisplay logo={destinationNetwork.logo} name={destinationNetwork.name} />
          </>
        )}
      </div>

      <div className="lane-details-hero__details">
        {/* Display address information based on lane type */}
        {inOutbound === LaneFilter.Inbound ? (
          <DetailItem label="OffRamp address" clipboardType="offramp">
            <AddressComponent
              address={offRamp}
              endLength={6}
              contractUrl={getExplorerAddressUrl(explorer, destinationNetwork.chainType)(offRamp)}
            />
          </DetailItem>
        ) : (
          <DetailItem
            label="OnRamp address"
            clipboardType="onramp"
            tooltip={sourceNetwork.chainType === "solana" ? <StyledTooltip tip="Same as Router." /> : undefined}
          >
            <AddressComponent
              address={onRamp}
              endLength={6}
              contractUrl={getExplorerAddressUrl(explorer, sourceNetwork.chainType)(onRamp)}
            />
          </DetailItem>
        )}

        <DetailItem label="Destination chain selector" clipboardType="destination-chain-selector">
          {destinationAddress ? <CopyValue value={destinationAddress} /> : "n/a"}{" "}
        </DetailItem>

        {inOutbound === LaneFilter.Outbound && (
          <DetailItem
            label="Out of Order Execution"
            clipboardType="out-of-order-execution"
            tooltip={
              <StyledTooltip tip="Currently controls the execution order of your messages on the destination blockchain. Required = Must be set for all messages, and to True. Optional = Can be set, and if set to True, enables Out-of-Order messaging. Note: Being deprecated in early 2026; OOO becomes default and only option." />
            }
          >
            {getOutOfOrderText(enforceOutOfOrder)}
          </DetailItem>
        )}
      </div>
    </div>
  )
}

export default LaneDetailsHero
