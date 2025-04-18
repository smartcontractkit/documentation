import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import AddressComponent from "~/components/AddressReact.tsx"
import "./LaneDetailsHero.css"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import CopyValue from "../CopyValue/CopyValue.tsx"
import { LaneFilter, ChainType } from "~/config/data/ccip/types.ts"
import { ExplorerInfo } from "~/config/types.ts"

interface LaneDetailsHeroProps {
  sourceNetwork: {
    logo: string
    name: string
    chainType?: ChainType
    rmnPermeable?: boolean
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
  laneRmnPermeable?: boolean
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
  laneRmnPermeable,
}: LaneDetailsHeroProps) {
  // Map boolean values to display strings
  const getOutOfOrderText = (value?: boolean) => {
    if (value === true) return "Required"
    if (value === false) return "Optional"
    return "N/A"
  }

  /**
   * Determines if RMN verification is enabled for this lane. Logic:
   * 1. If the destination chain is Solana (SVM), RMN verification is always disabled
   * 2. If a lane-specific rmnPermeable value exists, it takes precedence
   * 3. Otherwise, fallback to the source network's rmnPermeable setting
   */
  const isRmnVerificationEnabled = () => {
    if (destinationNetwork.chainType === ChainType.SVM) {
      return false
    }

    if (laneRmnPermeable !== undefined) {
      return laneRmnPermeable === false
    }

    return sourceNetwork.rmnPermeable === false
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
            <AddressComponent address={offRamp} endLength={6} contractUrl={getExplorerAddressUrl(explorer)(offRamp)} />
          </DetailItem>
        ) : (
          <DetailItem
            label="OnRamp address"
            clipboardType="onramp"
            tooltip={sourceNetwork.chainType === ChainType.SVM ? <StyledTooltip tip="Same as Router." /> : undefined}
          >
            <AddressComponent address={onRamp} endLength={6} contractUrl={getExplorerAddressUrl(explorer)(onRamp)} />
          </DetailItem>
        )}

        <DetailItem label="Destination chain selector" clipboardType="destination-chain-selector">
          {destinationAddress ? <CopyValue value={destinationAddress} /> : "n/a"}{" "}
        </DetailItem>

        <DetailItem
          label="RMN Verification"
          tooltip={<StyledTooltip tip={"Indicates if RMN blessings are verified on the destination chain."} />}
        >
          {isRmnVerificationEnabled() ? "Enabled" : "Disabled"}
        </DetailItem>

        {inOutbound === LaneFilter.Outbound && (
          <DetailItem
            label="Out of Order Execution"
            clipboardType="out-of-order-execution"
            tooltip={
              <StyledTooltip tip="Controls the execution order of your messages on the destination blockchain. Setting this to true allows messages to be executed in any order. Setting it to false ensures messages are executed in sequence, so a message will only be executed if the preceding one has been executed. On lanes where 'Out of Order Execution' is required, you must set this to true; otherwise, the transaction will revert." />
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
