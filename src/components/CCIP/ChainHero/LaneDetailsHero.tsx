import { Tooltip } from "~/features/common/Tooltip"
import AddressComponent from "~/components/AddressReact"
import "./LaneDetailsHero.css"
import { getExplorerAddressUrl } from "~/features/utils"
import CopyValue from "../CopyValue/CopyValue"
import { LaneFilter } from "~/config/data/ccip"

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
  explorerUrl: string
  rmnPermeable: boolean
  inOutbound: LaneFilter
}

function LaneDetailsHero({
  sourceNetwork,
  destinationNetwork,
  onRamp,
  offRamp,
  destinationAddress,
  explorerUrl,
  rmnPermeable,
  inOutbound,
}: LaneDetailsHeroProps) {
  return (
    <div className="lane-details-hero">
      <div className="lane-details-hero__networks">
        <div className="lane-details-hero__network">
          <img src={sourceNetwork.logo} alt={sourceNetwork.name} />
          {sourceNetwork.name}
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666626 7.99673H14.6666M7.66663 15L14.6666 8L7.66663 1" stroke="#141921" />
        </svg>
        <div className="lane-details-hero__network">
          <img src={destinationNetwork.logo} alt={destinationNetwork.name} className="lane-details-hero__token-logo" />
          {destinationNetwork.name}
        </div>
      </div>
      <div className="lane-details-hero__details">
        {inOutbound === LaneFilter.Inbound ? (
          <>
            <div className="lane-details-hero__details__label">OffRamp address</div>
            <div>
              <AddressComponent
                address={offRamp}
                endLength={6}
                contractUrl={getExplorerAddressUrl(explorerUrl)(offRamp)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="lane-details-hero__details__label">OnRamp address</div>
            <div>
              <AddressComponent
                address={onRamp}
                endLength={6}
                contractUrl={getExplorerAddressUrl(explorerUrl)(onRamp)}
              />
            </div>
          </>
        )}
        <div className="lane-details-hero__details__label">Destination network selector</div>
        <div>{destinationAddress ? <CopyValue value={destinationAddress} /> : "n/a"} </div>
        <div className="lane-details-hero__details__label">RMN</div>
        <div>
          {rmnPermeable ? (
            <Tooltip
              label="Coming soon"
              tip="Risk Management Network (RMN) is NOT active for this lane at this time."
              labelStyle={{
                marginRight: "10px",
              }}
              style={{
                display: "inline-flex",
              }}
            />
          ) : (
            "Enabled"
          )}
        </div>
      </div>
    </div>
  )
}

export default LaneDetailsHero
