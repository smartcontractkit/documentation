import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import AddressComponent from "~/components/AddressReact.tsx"
import "./LaneDetailsHero.css"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import CopyValue from "../CopyValue/CopyValue.tsx"
import { LaneFilter } from "~/config/data/ccip/types.ts"
import { ExplorerInfo } from "~/config/types.ts"

interface LaneDetailsHeroProps {
  sourceNetwork: {
    logo: string
    name: string
  }
  destinationNetwork: {
    logo: string
    name: string
  }
  onRamp: string
  offRamp: string
  destinationAddress: string
  enforceOutOfOrder?: boolean
  explorer: ExplorerInfo
  rmnPermeable: boolean
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

function LaneDetailsHero({
  sourceNetwork,
  destinationNetwork,
  onRamp,
  offRamp,
  destinationAddress,
  enforceOutOfOrder,
  explorer,
  rmnPermeable,
  inOutbound,
}: LaneDetailsHeroProps) {
  let enforceOutOfOrderString = "N/A"
  if (enforceOutOfOrder === true) {
    enforceOutOfOrderString = "Required"
  } else if (enforceOutOfOrder === false) {
    enforceOutOfOrderString = "Optional"
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
        {inOutbound === LaneFilter.Inbound ? (
          <>
            <div className="lane-details-hero__details__label">OffRamp address</div>
            <div data-clipboard-type="offramp">
              <AddressComponent
                address={offRamp}
                endLength={6}
                contractUrl={getExplorerAddressUrl(explorer)(offRamp)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="lane-details-hero__details__label">OnRamp address</div>
            <div data-clipboard-type="onramp">
              <AddressComponent address={onRamp} endLength={6} contractUrl={getExplorerAddressUrl(explorer)(onRamp)} />
            </div>
          </>
        )}
        <div className="lane-details-hero__details__label">Destination chain selector</div>
        <div data-clipboard-type="destination-chain-selector">
          {destinationAddress ? <CopyValue value={destinationAddress} /> : "n/a"}{" "}
        </div>
        <div className="lane-details-hero__details__label">RMN</div>
        <div>
          {rmnPermeable ? (
            <a href="https://docs.chain.link/ccip/concepts#risk-management-network" target="_blank" rel="noreferrer">
              <Tooltip
                label="Coming soon"
                tip="Risk Management Network (RMN) is NOT enabled for this lane at this time."
                labelStyle={{
                  marginRight: "10px",
                }}
                style={{
                  display: "inline-flex",
                }}
              />
            </a>
          ) : (
            <Tooltip
              label="Enabled"
              tip="This field shows the status of the Risk Management Network (RMN) for this lane."
              labelStyle={{
                marginRight: "10px",
              }}
              style={{
                display: "inline-flex",
              }}
            />
          )}
        </div>
        {inOutbound === LaneFilter.Outbound && (
          <>
            <div className="lane-details-hero__details__label">Out of Order Execution</div>
            <div data-clipboard-type="destination-chain-selector">
              <Tooltip
                label={enforceOutOfOrderString}
                tip="Controls the execution order of your messages on the destination blockchain. Setting this to true allows messages to be executed in any order. Setting it to false ensures messages are executed in sequence, so a message will only be executed if the preceding one has been executed. On lanes where 'Out of Order Execution' is required, you must set this to true; otherwise, the transaction will revert."
                labelStyle={{
                  marginRight: "10px",
                }}
                style={{
                  display: "inline-flex",
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LaneDetailsHero
