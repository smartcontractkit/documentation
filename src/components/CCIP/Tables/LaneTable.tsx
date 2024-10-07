import Address from "../Address/Address"
import "./Table.css"
import { drawerContentStore } from "../Drawer/drawerStore"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero"
import Table from "~/components/CCIP/Tables/ChainTable"
import { SupportedTokensConfig } from "~/config/data/ccip"
import Tabs from "./Tabs"
import TableSearchInput from "./TableSearchInput"
import LaneDrawer from "../LaneDrawers/LaneDrawer"
import { SupportedChain } from "~/config"
import { getTokenIconUrl } from "~/features/utils"

interface TableProps {
  tokens?: SupportedTokensConfig
}

function LaneTable({ tokens }: TableProps) {
  return (
    <div className="ccip-table__container">
      <table className="ccip-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Token address (Source)</th>
            <th>Decimals</th>
            <th>Mechanism</th>
            <th>Rate limit capacity</th>
            <th>Rate limit refil rate</th>
          </tr>
        </thead>
        {tokens && (
          <tbody>
            {Object.keys(tokens)?.map((token, index) => {
              // const logo = getTokenIconUrl(token)
              const logo = "https://via.placeholder.com/150"
              return (
                <tr key={index}>
                  {/* <td>
                  <div className="ccip-table__network-name">
                    <span className="ccip-table__logoContainer">
                      <img src={logo} alt={token} className="ccip-table__logo" />
                    </span>
                    {token}
                  </div>
                </td> */}
                  <td>Burn & Mint</td>
                  <td>Burn & Mint</td>
                  <td>Burn & Mint</td>
                  <td>Burn & Mint</td>
                  <td>Burn & Mint</td>
                  <td>Burn & Mint</td>
                </tr>
              )
            })}
          </tbody>
        )}
      </table>
    </div>
  )
}

export default LaneTable
