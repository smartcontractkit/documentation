import "../Tables/Table.css"
import { drawerContentStore } from "../Drawer/drawerStore"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero"
import {
  Environment,
  getLane,
  getNetwork,
  SupportedTokenConfig,
  Version,
  LaneFilter,
  displayCapacity,
} from "~/config/data/ccip"
import { useState } from "react"
import { SupportedChain } from "~/config"
import LaneDrawer from "../Drawer/LaneDrawer"
import TableSearchInput from "../Tables/TableSearchInput"
import Tabs from "../Tables/Tabs"
import { Tooltip } from "~/features/common/Tooltip"
import RateTooltip from "../Tooltip/RateTooltip"

function TokenDrawer({
  token,
  network,
  destinationLanes,
  environment,
}: {
  token: {
    name: string
    logo: string
    symbol: string
  }
  network: {
    name: string
    logo: string
    tokenAddress: string
    tokenPoolType: string
    tokenPoolAddress: string
    decimals: number
    key: string
    explorerUrl: string
  }
  destinationLanes: {
    [sourceChain: string]: SupportedTokenConfig
  }
  environment: Environment
}) {
  const [search, setSearch] = useState("")
  const [inOutbound, setInOutbound] = useState<LaneFilter>(LaneFilter.Outbound)

  const laneRows = Object.keys(destinationLanes).map((lane) => {
    const networkDetails = getNetwork({
      filter: environment,
      chain: lane,
    })
    const laneData = getLane({
      sourceChain: network?.key as SupportedChain,
      destinationChain: lane as SupportedChain,
      environment,
      version: Version.V1_2_0,
    })
    return { networkDetails, laneData, lane }
  })
  return (
    <div>
      <h2 className="ccip-table__drawer-heading">Token details</h2>
      <TokenDetailsHero
        token={{
          name: token.name,
          symbol: token.symbol,
          logo: token.logo,
          decimals: network.decimals,
          address: network.tokenAddress,
          poolType: network.tokenPoolType,
          poolAddress: network.tokenPoolAddress,
        }}
        network={{
          name: network.name,
          logo: network.logo,
          explorerUrl: network.explorerUrl,
        }}
      />
      <div className="ccip-table__drawer-container">
        <div className="ccip-table__filters">
          <div>
            <Tabs
              tabs={[
                {
                  name: "Outbound lanes",
                  key: LaneFilter.Outbound,
                },
                {
                  name: "Inbound lanes",
                  key: LaneFilter.Inbound,
                },
              ]}
              onChange={(key) => setInOutbound(key as LaneFilter)}
            />
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
        <div className="ccip-table__wrapper">
          {" "}
          <table className="ccip-table">
            <thead>
              <tr>
                <th>{inOutbound === LaneFilter.Inbound ? "Source" : "Destination"} network</th>
                <th>
                  Rate limit capacity
                  <Tooltip
                    label=""
                    tip="Maximum amount per transaction"
                    labelStyle={{
                      marginRight: "5px",
                    }}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginBottom: "2px",
                    }}
                  />
                </th>
                <th>
                  Rate limit refil rate
                  <Tooltip
                    label=""
                    tip="Rate at which available capacity is replenished"
                    labelStyle={{
                      marginRight: "5px",
                    }}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginBottom: "2px",
                    }}
                  />
                </th>
                <th>
                  Mechanism
                  <Tooltip
                    label=""
                    tip="Token pool mechanism: Lock & Mint, Burn & Mint, Lock & Unlock, Burn & Unlock."
                    labelStyle={{
                      marginRight: "5px",
                    }}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginBottom: "2px",
                    }}
                  />
                </th>
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {laneRows
                ?.filter(
                  ({ networkDetails }) =>
                    networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(({ networkDetails, laneData, lane }) => {
                  if (!laneData || !networkDetails) return null

                  return (
                    <tr key={networkDetails.name}>
                      <td>
                        <div
                          className="ccip-table__network-name"
                          role="button"
                          onClick={() => {
                            drawerContentStore.set(() => (
                              <LaneDrawer
                                environment={environment}
                                lane={laneData}
                                sourceNetwork={network}
                                destinationNetwork={{
                                  name: networkDetails?.name || "",
                                  logo: networkDetails?.logo || "",
                                  key: lane,
                                }}
                                inOutbound={inOutbound}
                                explorerUrl={network.explorerUrl}
                              />
                            ))
                          }}
                        >
                          <img src={networkDetails?.logo} alt={networkDetails?.name} className="ccip-table__logo" />
                          {networkDetails?.name}
                        </div>
                      </td>
                      <td>
                        {displayCapacity(
                          String(
                            destinationLanes[lane].rateLimiterConfig?.[inOutbound === LaneFilter.Inbound ? "in" : "out"]
                              ?.capacity || 0
                          ),
                          network.decimals
                        )}{" "}
                        {token.name}
                      </td>
                      <td>
                        <RateTooltip
                          destinationLane={destinationLanes[lane]}
                          inOutbound={inOutbound}
                          symbol={token.symbol}
                          decimals={network.decimals}
                        />
                      </td>
                      <td>{network.tokenPoolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}</td>
                      {/* <td>
                      <span className="ccip-table__status">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4.83329 8.49996L7.16663 10.8333L11.1666 5.83329M0.666626 8.49996C0.666626 10.4449 1.43925 12.3102 2.81451 13.6854C4.18978 15.0607 6.05504 15.8333 7.99996 15.8333C9.94489 15.8333 11.8102 15.0607 13.1854 13.6854C14.5607 12.3102 15.3333 10.4449 15.3333 8.49996C15.3333 6.55504 14.5607 4.68978 13.1854 3.31451C11.8102 1.93925 9.94489 1.16663 7.99996 1.16663C6.05504 1.16663 4.18978 1.93925 2.81451 3.31451C1.43925 4.68978 0.666626 6.55504 0.666626 8.49996Z"
                            stroke="#267E46"
                          />
                        </svg>
                        Operational
                      </span>
                    </td> */}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className="ccip-table__notFound">
          {laneRows?.filter(
            ({ networkDetails }) => networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
          ).length === 0 && <>No lanes found</>}
        </div>
      </div>
    </div>
  )
}

export default TokenDrawer
