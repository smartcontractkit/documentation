import "../Tables/Table.css"
import { drawerContentStore } from "../Drawer/drawerStore.ts"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero.tsx"
import {
  Environment,
  getLane,
  getNetwork,
  SupportedTokenConfig,
  Version,
  LaneFilter,
  determineTokenMechanism,
  PoolType,
  getTokenData,
  LaneConfig,
} from "~/config/data/ccip/index.ts"
import { useState } from "react"
import { ChainType, ExplorerInfo, SupportedChain } from "~/config/index.ts"
import LaneDrawer from "../Drawer/LaneDrawer.tsx"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import Tabs from "../Tables/Tabs.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"

function TokenDrawer({
  token,
  network,
  destinationLanes,
  environment,
}: {
  token: {
    id: string
    name: string
    logo: string
    symbol: string
  }
  network: {
    name: string
    key: string
    logo: string
    chainType: ChainType
    tokenId: string
    tokenLogo: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    tokenAddress: string
    tokenPoolType: PoolType
    tokenPoolRawType: string
    tokenPoolAddress: string
    explorer: ExplorerInfo
  }
  destinationLanes: {
    [sourceChain: string]: SupportedTokenConfig
  }
  environment: Environment
}) {
  const [search, setSearch] = useState("")
  const [inOutbound, setInOutbound] = useState<LaneFilter>(LaneFilter.Outbound)

  type LaneRow = {
    networkDetails: {
      name: string
      logo: string
    }
    laneData: LaneConfig
    destinationChain: string
    destinationPoolType: PoolType
  }

  const laneRows: LaneRow[] = Object.keys(destinationLanes)
    .map((destinationChain) => {
      const networkDetails = getNetwork({
        filter: environment,
        chain: destinationChain,
      })

      const destinationTokenData = getTokenData({
        environment,
        version: Version.V1_2_0,
        tokenId: token.id,
      })[destinationChain]
      if (!destinationTokenData) {
        console.error(`No token data found for ${token.id} on ${network.key} -> ${destinationChain}`)
        return null
      }
      const destinationPoolType = destinationTokenData.pool.type
      if (!destinationPoolType) {
        console.error(`No pool type found for ${token.id} on ${network.key} -> ${destinationChain}`)
        return null
      }
      const laneData = getLane({
        sourceChain: network.key as SupportedChain,
        destinationChain: destinationChain as SupportedChain,
        environment,
        version: Version.V1_2_0,
      })

      if (!laneData) {
        console.error(`No lane data found for ${token.id} on ${network.key} -> ${destinationChain}`)
        return null
      }
      if (!laneData.supportedTokens || !Array.isArray(laneData.supportedTokens)) {
        console.error(`No supported tokens found for ${token.id} on ${network.key} -> ${destinationChain}`)
        return null
      }
      if (!laneData.supportedTokens.includes(token.id)) {
        console.error(`${token.id} not found in supported tokens for ${network.key} -> ${destinationChain}`)
        return null
      }

      return { networkDetails, laneData, destinationChain, destinationPoolType }
    })
    .filter(Boolean) as LaneRow[]

  return (
    <div>
      <h2 className="ccip-table__drawer-heading">Token details</h2>
      <TokenDetailsHero
        token={{
          id: token.id,
          name: network.tokenName,
          symbol: network.tokenSymbol,
          logo: network.tokenLogo,
          decimals: network.tokenDecimals,
          address: network.tokenAddress,
          poolRawType: network.tokenPoolRawType,
          poolAddress: network.tokenPoolAddress,
        }}
        network={{
          name: network.name,
          logo: network.logo,
          explorer: network.explorer,
          chainType: network.chainType,
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
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {laneRows
                ?.filter(
                  ({ networkDetails }) =>
                    networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(({ networkDetails, laneData, destinationChain, destinationPoolType }) => {
                  if (!laneData || !networkDetails) return null

                  // TODO: Fetch rate limits from API for both inbound and outbound
                  // Token pause detection requires rate limiter data from API
                  // A token is paused when rate limit capacity is 0
                  const tokenPaused = false

                  return (
                    <tr key={networkDetails.name} className={tokenPaused ? "ccip-table__row--paused" : ""}>
                      <td>
                        <button
                          type="button"
                          className={`ccip-table__network-name ${tokenPaused ? "ccip-table__network-name--paused" : ""}`}
                          onClick={() => {
                            drawerContentStore.set(() => (
                              <LaneDrawer
                                environment={environment}
                                lane={laneData}
                                sourceNetwork={network}
                                destinationNetwork={{
                                  name: networkDetails?.name || "",
                                  logo: networkDetails?.logo || "",
                                  key: destinationChain,
                                }}
                                inOutbound={inOutbound}
                                explorer={network.explorer}
                              />
                            ))
                          }}
                          aria-label={`View lane details for ${networkDetails?.name}`}
                        >
                          <img
                            src={networkDetails?.logo}
                            alt={`${networkDetails?.name} blockchain logo`}
                            className="ccip-table__logo"
                          />
                          {networkDetails?.name}
                          {tokenPaused && (
                            <span className="ccip-table__paused-badge" title="Transfers are currently paused">
                              ⏸️
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        {/* TODO: Fetch rate limits from API for both inbound and outbound
                            GET /api/ccip/v1/lanes/by-internal-id/{source}/{destination}/supported-tokens?environment={environment}
                            Response will contain both standard and custom rate limits per token */}
                        Disabled
                      </td>
                      <td>
                        {/* TODO: Fetch rate limits from API for both inbound and outbound
                            Display refill rate from standard.in/out or custom.in/out based on inOutbound filter */}
                        Disabled
                      </td>
                      <td>
                        {inOutbound === LaneFilter.Outbound
                          ? determineTokenMechanism(network.tokenPoolType, destinationPoolType)
                          : determineTokenMechanism(destinationPoolType, network.tokenPoolType)}
                      </td>
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
