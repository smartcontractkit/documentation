import Address from "../Address/Address"
import "./Table.css"
import { drawerContentStore } from "../Drawer/drawerStore"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero"
import Table from "~/components/CCIP/Tables/ChainTable"
import { Environment, getAllNetworkLanes, Version } from "~/config/data/ccip"
import Tabs from "./Tabs"
import TableSearchInput from "./TableSearchInput"

interface TableProps {
  networks: {
    name: string
    key: string
    logo: string
    token: string
    tokenLogo: string
    symbol: string
    decimals: number
    tokenAddress: string
    tokenPoolType: string
    tokenPoolAddress: string
  }[]
}

function TokenChainsTable({ networks }: TableProps) {
  const lanes = getAllNetworkLanes({
    environment: Environment.Mainnet,
    version: Version.V1_2_0,
    chain: "mainnet",
  })
  return (
    <table className="ccip-table">
      <thead>
        <tr>
          <th>Network</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Decimals</th>
          <th>Token address</th>
          <th>Token pool type</th>
          <th>Token pool address</th>
        </tr>
      </thead>
      <tbody>
        {networks?.map((network, index) => (
          <tr key={index}>
            <td>
              <div
                className="ccip-table__network-name"
                role="button"
                onClick={() => {
                  drawerContentStore.set(() => (
                    <div>
                      <h2 className="ccip-table__drawer-heading">Token details</h2>
                      <TokenDetailsHero
                        token={{
                          name: network.name,
                          logo: network.logo,
                          decimals: network.decimals,
                          address: network.tokenAddress,
                          poolType: network.tokenPoolType,
                          poolAddress: network.tokenPoolAddress,
                        }}
                      />
                      <div className="ccip-table__filters">
                        <Tabs
                          tabs={[
                            {
                              name: "Outbound lanes",
                              key: "outbound",
                            },
                            {
                              name: "Inbound lanes",
                              key: "inbound",
                            },
                          ]}
                          onChange={(key) => console.log(key)}
                        />
                        <TableSearchInput />
                      </div>
                      <table
                        className="ccip-table"
                        style={{
                          margin: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th>Destination network</th>
                            <th>Rate limit capacity</th>
                            <th>Rate limit refil rate</th>
                            <th>Mechanism</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lanes?.map((network, index) => (
                            <tr key={index}>
                              <td>
                                <div className="ccip-table__network-name">
                                  <img src={network.logo} alt={network.name} className="ccip-table__logo" />
                                  {network.name}
                                </div>
                              </td>
                              <td>1,000,000 USD</td>
                              <td>277 USD/second</td>
                              <td>Lock & Mint</td>
                              <td>
                                <span className="ccip-table__status">
                                  <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.83329 8.49996L7.16663 10.8333L11.1666 5.83329M0.666626 8.49996C0.666626 10.4449 1.43925 12.3102 2.81451 13.6854C4.18978 15.0607 6.05504 15.8333 7.99996 15.8333C9.94489 15.8333 11.8102 15.0607 13.1854 13.6854C14.5607 12.3102 15.3333 10.4449 15.3333 8.49996C15.3333 6.55504 14.5607 4.68978 13.1854 3.31451C11.8102 1.93925 9.94489 1.16663 7.99996 1.16663C6.05504 1.16663 4.18978 1.93925 2.81451 3.31451C1.43925 4.68978 0.666626 6.55504 0.666626 8.49996Z"
                                      stroke="#267E46"
                                    />
                                  </svg>
                                  Operational
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                }}
              >
                <span className="ccip-table__logoContainer">
                  <img src={network.logo} alt={network.name} className="ccip-table__logo" />
                  <img src={network.tokenLogo} alt={network.token} className="ccip-table__smallLogo" />
                </span>
                {network.name}
              </div>
            </td>
            <td>{network.token}</td>
            <td>{network.symbol}</td>
            <td>{network.decimals}</td>
            <td>
              <Address contractUrl={network.tokenAddress} address={network.tokenAddress} endLength={6} />
            </td>
            <td>{network.tokenPoolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}</td>
            <td>
              <Address contractUrl={network.tokenPoolAddress} address={network.tokenPoolAddress} endLength={6} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TokenChainsTable
