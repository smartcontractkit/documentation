import Address from "~/components/AddressReact.tsx"
import "../Tables/Table.css"
import { Environment, LaneConfig, LaneFilter, Version } from "~/config/data/ccip/types.ts"
import { getNetwork, getTokenData } from "~/config/data/ccip/data.ts"
import { displayCapacity, determineTokenMechanism } from "~/config/data/ccip/utils.ts"
import { useState } from "react"
import LaneDetailsHero from "../ChainHero/LaneDetailsHero.tsx"
import { getExplorerAddressUrl, getTokenIconUrl, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import RateTooltip from "../Tooltip/RateTooltip.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { ExplorerInfo } from "~/config/types.ts"

function LaneDrawer({
  lane,
  sourceNetwork,
  destinationNetwork,
  environment,
  inOutbound,
  explorer,
}: {
  lane: LaneConfig
  sourceNetwork: { name: string; logo: string; key: string }
  destinationNetwork: { name: string; logo: string; key: string }
  explorer: ExplorerInfo
  environment: Environment
  inOutbound: LaneFilter
}) {
  const [search, setSearch] = useState("")
  const destinationNetworkDetails = getNetwork({
    filter: environment,
    chain: destinationNetwork.key,
  })

  return (
    <>
      <h2 className="ccip-table__drawer-heading">Lane details</h2>
      <LaneDetailsHero
        sourceNetwork={{
          logo: sourceNetwork.logo,
          name: sourceNetwork.name,
        }}
        destinationNetwork={{
          logo: destinationNetwork.logo,
          name: destinationNetwork.name,
        }}
        onRamp={lane.onRamp.address}
        offRamp={lane.offRamp.address}
        enforceOutOfOrder={lane.onRamp.enforceOutOfOrder}
        explorer={explorer}
        destinationAddress={destinationNetworkDetails?.chainSelector || ""}
        rmnPermeable={lane.rmnPermeable}
        inOutbound={inOutbound}
      />

      <div className="ccip-table__drawer-container">
        <div className="ccip-table__filters">
          <div>
            <div className="ccip-table__filters-title">
              Tokens <span>({lane?.supportedTokens ? Object.keys(lane.supportedTokens).length : 0})</span>
            </div>
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
        <div className="ccip-table__wrapper">
          <table className="ccip-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Token address (Source)</th>
                <th>Decimals</th>
                <th>
                  Mechanism
                  <Tooltip
                    label=""
                    tip="Token handling mechanism: Lock & Mint, Burn & Mint, Lock & Unlock, Burn & Unlock."
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
                  Rate limit capacity
                  <Tooltip
                    label=""
                    tip="Rate limit data is currently unavailable. You can find this Token Pool rate limit by reading the Token Pool contract directly on the relevant blockchain."
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
                  Rate limit refill rate
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
              </tr>
            </thead>
            <tbody>
              {lane.supportedTokens &&
                Object.keys(lane.supportedTokens)
                  ?.filter((token) => token.toLowerCase().includes(search.toLowerCase()))
                  .map((token, index) => {
                    const data = getTokenData({
                      environment,
                      version: Version.V1_2_0,
                      tokenId: token || "",
                    })
                    if (!Object.keys(data).length) return null
                    const logo = getTokenIconUrl(token)
                    return (
                      <tr key={index}>
                        <td>
                          <a href={`/ccip/directory/${environment}/token/${token}`}>
                            <div className="ccip-table__network-name">
                              <img
                                src={logo}
                                alt={`${token} logo`}
                                className="ccip-table__logo"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null // prevents looping
                                  currentTarget.src = fallbackTokenIconUrl
                                }}
                              />
                              {token}
                            </div>
                          </a>
                        </td>
                        <td data-clipboard-type="token">
                          <Address
                            address={data[sourceNetwork.key].tokenAddress}
                            endLength={6}
                            contractUrl={getExplorerAddressUrl(explorer)(data[sourceNetwork.key].tokenAddress)}
                          />
                        </td>
                        <td>{data[sourceNetwork.key].decimals}</td>
                        <td>
                          {inOutbound === LaneFilter.Outbound
                            ? determineTokenMechanism(
                                data[sourceNetwork.key].poolType,
                                data[destinationNetwork.key].poolType
                              )
                            : determineTokenMechanism(
                                data[destinationNetwork.key].poolType,
                                data[sourceNetwork.key].poolType
                              )}
                        </td>

                        <td>
                          {lane.supportedTokens &&
                            displayCapacity(
                              data[sourceNetwork.key].decimals,
                              token,
                              lane.supportedTokens[token]?.rateLimiterConfig?.[
                                inOutbound === LaneFilter.Inbound ? "in" : "out"
                              ]
                            )}
                        </td>
                        <td>
                          {lane.supportedTokens && (
                            <RateTooltip
                              destinationLane={lane.supportedTokens[token]}
                              inOutbound={inOutbound}
                              symbol={token}
                              decimals={data[sourceNetwork.key].decimals}
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
        <div className="ccip-table__notFound">
          {lane.supportedTokens &&
            Object.keys(lane.supportedTokens)?.filter((lane) => lane.toLowerCase().includes(search.toLowerCase()))
              .length === 0 && <>No tokens found</>}
        </div>
      </div>
    </>
  )
}

export default LaneDrawer
