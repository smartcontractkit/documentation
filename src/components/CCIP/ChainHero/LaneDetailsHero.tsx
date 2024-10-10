import { Tooltip } from "~/features/common/Tooltip"
import AddressComponent from "../Address/Address"
import "./LaneDetailsHero.css"
import { getExplorerAddressUrl } from "~/features/utils"

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
  destinationAddress: string
  explorerUrl: string
}

function LaneDetailsHero({
  sourceNetwork,
  destinationNetwork,
  onRamp,
  destinationAddress,
  explorerUrl,
}: LaneDetailsHeroProps) {
  return (
    <div className="laneDetailsHero">
      <h2>Lane details</h2>

      <div className="laneDetailsHero__networks">
        <div className="laneDetailsHero__network">
          <img src={sourceNetwork.logo} alt={sourceNetwork.name} />
          {sourceNetwork.name}
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666626 7.99673H14.6666M7.66663 15L14.6666 8L7.66663 1" stroke="#141921" />
        </svg>
        <div className="laneDetailsHero__network">
          <img src={destinationNetwork.logo} alt={destinationNetwork.name} className="laneDetailsHero__token-logo" />
          {destinationNetwork.name}
        </div>
      </div>
      <div className="laneDetailsHero__details">
        <div className="laneDetailsHero__details__label">OnRamp address</div>
        <div>
          <AddressComponent address={onRamp} endLength={6} contractUrl={getExplorerAddressUrl(explorerUrl)(onRamp)} />
        </div>
        <div className="laneDetailsHero__details__label">Destination network selector</div>
        <div>{destinationAddress}</div>
        <div className="laneDetailsHero__details__label">RMN</div>
        <div>
          <span>
            <Tooltip
              label="Coming soon"
              tip="Risk Management Network (RMN) is NOT active for this lane at this time."
              style={{
                display: "inline-flex",
              }}
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export default LaneDetailsHero
