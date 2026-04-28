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
  displayCapacity,
  determineTokenMechanism,
  PoolType,
  getTokenData,
  LaneConfig,
} from "~/config/data/ccip/index.ts"
import { isTokenPaused } from "~/config/data/ccip/utils.ts"
import { useState } from "react"
import { ChainType, ExplorerInfo, SupportedChain } from "~/config/index.ts"
import LaneDrawer from "../Drawer/LaneDrawer.tsx"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import Tabs from "../Tables/Tabs.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import RateTooltip from "../Tooltip/RateTooltip.tsx"

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
    tokenPoolAddress: string
    tokenPoolVersion: string
    explorer: ExplorerInfo
  }
  destinationLanes: {
    [sourceChain: string]: SupportedTokenConfig
  }
  environment: Environment
}) {
  const [search, setSearch] = useState("")
  const [inOutbound, setInOutbound] = useState<LaneFilter>(LaneFilter.Outbound)
  const [openWarning, setOpenWarning] = useState<string | null>(null)

  type LaneRow = {
    networkDetails: {
      name: string
      logo: string
    }
    laneData: LaneConfig
    destinationChain: string
    destinationPoolType: PoolType
    destinationDecimals: number
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

      const destinationPoolType = destinationTokenData.poolType
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
      if (!laneData.supportedTokens) {
        console.error(`No supported tokens found for ${token.id} on ${network.key} -> ${destinationChain}`)
        return null
      }
      if (!(token.id in laneData.supportedTokens)) {
        console.error(`${token.id} not found in supported tokens for ${network.key} -> ${destinationChain}`)
        return null
      }

      return {
        networkDetails,
        laneData,
        destinationChain,
        destinationPoolType,
        destinationDecimals: destinationTokenData.decimals,
      }
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
          poolType: network.tokenPoolType,
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
              </tr>
            </thead>
            <tbody>
              {laneRows
                .filter(
                  ({ networkDetails }) =>
                    networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(({ networkDetails, laneData, destinationChain, destinationPoolType, destinationDecimals }) => {
                  if (!laneData || !networkDetails) return null

                  const tokenPaused = isTokenPaused(
                    network.tokenDecimals,
                    destinationLanes[destinationChain].rateLimiterConfig?.[
                      inOutbound === LaneFilter.Inbound ? "in" : "out"
                    ]
                  )

                  const hasDecimalMismatch = network.tokenDecimals !== destinationDecimals
                  const isV151 = network.tokenPoolVersion?.includes("1.5.1")
                  const isInboundLane = inOutbound === LaneFilter.Inbound
                  const isEvmNetwork = String(network.chainType).toLowerCase() === "evm"
                  const shouldWarn = isV151 && hasDecimalMismatch && isInboundLane && isEvmNetwork

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
                                  name: networkDetails.name || "",
                                  logo: networkDetails.logo || "",
                                  key: destinationChain,
                                }}
                                inOutbound={inOutbound}
                                explorer={network.explorer}
                              />
                            ))
                          }}
                          aria-label={`View lane details for ${networkDetails.name}`}
                        >
                          <img
                            src={networkDetails.logo}
                            alt={`${networkDetails.name} blockchain logo`}
                            className="ccip-table__logo"
                          />

                          <span style={{ display: "inline-flex", alignItems: "center" }}>
                            {networkDetails.name}

                            {shouldWarn && (
                              <span
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  marginLeft: "6px",
                                }}
                                onMouseEnter={(e) => {
                                  e.stopPropagation()
                                  setOpenWarning(destinationChain)
                                }}
                                onMouseLeave={(e) => {
                                  e.stopPropagation()
                                  setOpenWarning((current) => (current === destinationChain ? null : current))
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <span
                                  aria-label="Rate limit warning"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  ⚠️
                                </span>

                                {openWarning === destinationChain && (
                                  <span
                                    style={{
                                      position: "absolute",
                                      bottom: "100%",
                                      left: "0",
                                      zIndex: 999,
                                      minWidth: "260px",
                                      maxWidth: "320px",
                                      padding: "8px 10px",
                                      borderRadius: "6px",
                                      background: "var(--gray-900)",
                                      color: "white",
                                      fontSize: "12px",
                                      lineHeight: "1.4",
                                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                      whiteSpace: "normal",
                                      pointerEvents: "auto",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.stopPropagation()
                                      setOpenWarning(destinationChain)
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation()
                                      setOpenWarning((current) => (current === destinationChain ? null : current))
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    <>
                                      For v1.5.1 token pools on EVM chains, rate limit enforcement may differ from
                                      configured values when token decimals vary across chains. It is recommended to
                                      upgrade to the latest version of Token Pools.{" "}
                                      <a
                                        href="/ccip/concepts/cross-chain-token/evm/token-pools#token-decimal-handling"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "underline", color: "white" }}
                                      >
                                        Learn more
                                      </a>
                                      .
                                    </>
                                  </span>
                                )}
                              </span>
                            )}
                          </span>

                          {tokenPaused && (
                            <span className="ccip-table__paused-badge" title="Transfers are currently paused">
                              ⏸️
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        {displayCapacity(
                          network.tokenDecimals,
                          network.tokenSymbol,
                          destinationLanes[destinationChain].rateLimiterConfig?.[
                            inOutbound === LaneFilter.Inbound ? "in" : "out"
                          ]
                        )}
                      </td>
                      <td>
                        <RateTooltip
                          destinationLane={destinationLanes[destinationChain]}
                          inOutbound={inOutbound}
                          symbol={network.tokenSymbol}
                          decimals={network.tokenDecimals}
                        />
                      </td>
                      <td>
                        {inOutbound === LaneFilter.Outbound
                          ? determineTokenMechanism(network.tokenPoolType, destinationPoolType)
                          : determineTokenMechanism(destinationPoolType, network.tokenPoolType)}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className="ccip-table__notFound">
          {laneRows.filter(
            ({ networkDetails }) => networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
          ).length === 0 && <>No lanes found</>}
        </div>
      </div>
    </div>
  )
}

export default TokenDrawer
