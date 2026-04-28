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

      if (!destinationTokenData) return null

      const destinationPoolType = destinationTokenData.poolType
      if (!destinationPoolType) return null

      const laneData = getLane({
        sourceChain: network.key as SupportedChain,
        destinationChain: destinationChain as SupportedChain,
        environment,
        version: Version.V1_2_0,
      })

      if (!laneData || !laneData.supportedTokens || !(token.id in laneData.supportedTokens)) {
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
          <Tabs
            tabs={[
              { name: "Outbound lanes", key: LaneFilter.Outbound },
              { name: "Inbound lanes", key: LaneFilter.Inbound },
            ]}
            onChange={(key) => setInOutbound(key as LaneFilter)}
          />
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
                    labelStyle={{ marginRight: "5px" }}
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  />
                </th>
                <th>
                  Rate limit refill rate
                  <Tooltip
                    label=""
                    tip="Rate at which available capacity is replenished"
                    labelStyle={{ marginRight: "5px" }}
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  />
                </th>
                <th>
                  Mechanism
                  <Tooltip
                    label=""
                    tip="Token handling mechanism: Lock & Mint, Burn & Mint, Lock & Unlock, Burn & Unlock."
                    labelStyle={{ marginRight: "5px" }}
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {laneRows
                .filter(({ networkDetails }) => networkDetails.name.toLowerCase().includes(search.toLowerCase()))
                .map(({ networkDetails, laneData, destinationChain, destinationPoolType, destinationDecimals }) => {
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
                  const warningContent = (
                    <>
                      For v1.5.1 token pools on EVM chains, rate limit enforcement may differ from configured values
                      when token decimals vary across chains. It is recommended to upgrade to the latest version of
                      Token Pools.{" "}
                      <a
                        href="https://docs.chain.link/ccip/concepts/cross-chain-token/evm/token-pools"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline", color: "white" }}
                      >
                        Learn more
                      </a>
                      .
                    </>
                  )

                  return (
                    <tr key={networkDetails.name} className={tokenPaused ? "ccip-table__row--paused" : ""}>
                      <td>
                        <button
                          type="button"
                          className={`ccip-table__network-name ${
                            tokenPaused ? "ccip-table__network-name--paused" : ""
                          }`}
                          onClick={() => {
                            drawerContentStore.set(() => (
                              <LaneDrawer
                                environment={environment}
                                lane={laneData}
                                sourceNetwork={network}
                                destinationNetwork={{
                                  name: networkDetails.name,
                                  logo: networkDetails.logo,
                                  key: destinationChain,
                                }}
                                inOutbound={inOutbound}
                                explorer={network.explorer}
                              />
                            ))
                          }}
                        >
                          <img src={networkDetails.logo} alt={networkDetails.name} className="ccip-table__logo" />

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
                                  const tooltip = e.currentTarget.querySelector(
                                    ".ccip-table__warning-tooltip"
                                  ) as HTMLElement | null
                                  if (tooltip) tooltip.style.display = "block"
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = e.currentTarget.querySelector(
                                    ".ccip-table__warning-tooltip"
                                  ) as HTMLElement | null
                                  if (tooltip) tooltip.style.display = "none"
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

                                <span
                                  className="ccip-table__warning-tooltip"
                                  style={{
                                    display: "none",
                                    position: "absolute",
                                    bottom: "calc(100% + 8px)",
                                    left: "0",
                                    zIndex: 20,
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
                                >
                                  <>
                                    For v1.5.1 token pools on EVM chains, rate limit enforcement may differ from
                                    configured values when token decimals vary across chains. It is recommended to
                                    upgrade to the latest version of Token Pools.{" "}
                                    <a
                                      href="https://docs.chain.link/ccip/concepts/cross-chain-token/evm/token-pools"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: "underline", color: "white" }}
                                    >
                                      Learn more
                                    </a>
                                    .
                                  </>
                                </span>
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
      </div>
    </div>
  )
}

export default TokenDrawer
