import Address from "~/components/AddressReact.tsx"
import "../Tables/Table.css"
import { Environment, LaneConfig, LaneFilter, Version } from "~/config/data/ccip/types.ts"
import { getNetwork, getTokenData } from "~/config/data/ccip/data.ts"
import { determineTokenMechanism } from "~/config/data/ccip/utils.ts"
import { useState } from "react"
import LaneDetailsHero from "../ChainHero/LaneDetailsHero.tsx"
import { getExplorerAddressUrl, getTokenIconUrl, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { ChainType, ExplorerInfo } from "@config/types.ts"

function LaneDrawer({
  lane,
  sourceNetwork,
  destinationNetwork,
  environment,
  inOutbound,
  explorer,
}: {
  lane: LaneConfig
  sourceNetwork: { name: string; logo: string; key: string; chainType: ChainType }
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

  const sourceNetworkDetails = getNetwork({
    filter: environment,
    chain: sourceNetwork.key,
  })

  return (
    <>
      <h2 className="ccip-table__drawer-heading">Lane details</h2>
      <LaneDetailsHero
        sourceNetwork={{
          logo: sourceNetwork.logo,
          name: sourceNetwork.name,
          chainType: sourceNetwork.chainType,
        }}
        destinationNetwork={{
          logo: destinationNetwork.logo,
          name: destinationNetwork.name,
          chainType: destinationNetworkDetails?.chainType,
        }}
        onRamp={lane.onRamp.address}
        offRamp={lane.offRamp.address}
        enforceOutOfOrder={lane.onRamp.enforceOutOfOrder}
        explorer={explorer}
        destinationAddress={destinationNetworkDetails?.chainSelector || ""}
        inOutbound={inOutbound}
      />

      <div className="ccip-table__drawer-container">
        <div className="ccip-table__filters">
          <div>
            <div className="ccip-table__filters-title">
              Tokens <span>({lane?.supportedTokens ? lane.supportedTokens.length : 0})</span>
            </div>
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
        <div className="ccip-table__wrapper">
          <table className="ccip-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Ticker</th>
                <th style={{ width: "150px" }}>Token address (Source)</th>
                <th style={{ width: "80px" }}>Decimals</th>
                <th style={{ width: "100px" }}>
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
                <th style={{ width: "150px" }}>
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
                <th style={{ width: "180px" }}>
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
                lane.supportedTokens
                  .filter((token) => token.toLowerCase().includes(search.toLowerCase()))
                  .map((token, index) => {
                    const data = getTokenData({
                      environment,
                      version: Version.V1_2_0,
                      tokenId: token || "",
                    })
                    if (!Object.keys(data).length) return null
                    const logo = getTokenIconUrl(token)

                    // TODO: Fetch rate limits from API for both inbound and outbound
                    // Token pause detection requires rate limiter data from API
                    // A token is paused when rate limit capacity is 0
                    const tokenPaused = false

                    return (
                      <tr key={index} className={tokenPaused ? "ccip-table__row--paused" : ""}>
                        <td>
                          <a href={`/ccip/directory/${environment}/token/${token}`}>
                            <div
                              className={`ccip-table__network-name ${tokenPaused ? "ccip-table__network-name--paused" : ""}`}
                            >
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
                              {tokenPaused && (
                                <span className="ccip-table__paused-badge" title="Transfers are currently paused">
                                  ⏸️
                                </span>
                              )}
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
                                data[sourceNetwork.key].pool.type,
                                data[destinationNetwork.key].pool.type
                              )
                            : determineTokenMechanism(
                                data[destinationNetwork.key].pool.type,
                                data[sourceNetwork.key].pool.type
                              )}
                        </td>

                        <td>
                          {/* TODO: Fetch rate limits from API for both inbound and outbound
                              GET /api/ccip/v1/lanes/by-internal-id/{source}/{destination}/supported-tokens?environment={environment}
                              Response will contain both standard and custom rate limits per token */}
                          Disabled
                        </td>
                        <td className="rate-tooltip-cell">
                          {/* TODO: Fetch rate limits from API for both inbound and outbound
                              Display refill rate from standard.in/out or custom.in/out based on inOutbound filter */}
                          Disabled
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
        <div className="ccip-table__notFound">
          {lane.supportedTokens &&
            lane.supportedTokens.filter((token) => token.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <>No tokens found</>
            )}
        </div>
      </div>
    </>
  )
}

export default LaneDrawer
