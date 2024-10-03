import { LaneConfig } from "~/config/data/ccip"
import LaneTable from "../Tables/LaneTable"

interface LaneDrawerProps {
  lane: LaneConfig
  sourceChain: {
    name: string
    logo: string
  }
  destinationChain: {
    name: string
    logo: string
  }
}

function LaneDrawer({ lane, destinationChain }: LaneDrawerProps) {
  console.log("LANE ", lane)
  return (
    <div>
      <h2>Lane Drawer</h2>
      {JSON.stringify(lane)}
      {/* <LaneTable tokens={lane.supportedTokens} /> */}
    </div>
  )
}

export default LaneDrawer
