import Address from "~/components/AddressReact.tsx"
import "../Tables/Table.css"
import { Environment, LaneConfig, LaneFilter, PoolType } from "~/config/data/ccip/types.ts"
import { getNetwork } from "~/config/data/ccip/data.ts"
import { determineTokenMechanism } from "~/config/data/ccip/utils.ts"
import { useState } from "react"
import LaneDetailsHero from "../ChainHero/LaneDetailsHero.tsx"
import { getExplorerAddressUrl, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { ChainType, ExplorerInfo } from "@config/types.ts"
import { useTokenRateLimits } from "~/hooks/useTokenRateLimits.ts"
import { RateLimitCell } from "~/components/CCIP/RateLimitCell.tsx"
import { useLaneTokens } from "~/hooks/useLaneTokens.ts"

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

  // Determine source and destination based on inOutbound filter
  const source = inOutbound === LaneFilter.Outbound ? sourceNetwork.key : destinationNetwork.key
  const destination = inOutbound === LaneFilter.Outbound ? destinationNetwork.key : sourceNetwork.key

  // Fetch rate limits data using custom hook
  const { rateLimits, isLoading: isLoadingRateLimits } = useTokenRateLimits(source, destination, environment)

  // Process tokens with hook
  const { tokens: processedTokens, count: tokenCount } = useLaneTokens({
    tokens: lane.supportedTokens,
    environment,
    rateLimitsData: rateLimits,
    inOutbound,
    searchQuery: search,
  })

  return (
    <>
      <h2 className="ccip-table__drawer-heading">Lane Details</h2>
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
        explorer={explorer}
        sourceAddress={sourceNetworkDetails?.chainSelector || ""}
        destinationAddress={destinationNetworkDetails?.chainSelector || ""}
        inOutbound={inOutbound}
      />

      <div className="ccip-table__drawer-container">
        <div className="ccip-table__filters">
          <div>
            <div className="ccip-table__filters-title">
              Tokens <span>({tokenCount})</span>
            </div>
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
        <div className="ccip-table__wrapper">
          <table className="ccip-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Ticker</th>
                <th style={{ width: "150px" }}>Source token address</th>
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
                  <div>
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
                  </div>
                  <div style={{ color: "var(--muted-more-foreground)", fontSize: "0.875rem", fontWeight: "normal" }}>
                    (Tokens)
                  </div>
                </th>
                <th style={{ width: "180px" }}>
                  <div>
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
                  </div>
                  <div style={{ color: "var(--muted-more-foreground)", fontSize: "0.875rem", fontWeight: "normal" }}>
                    (Tokens/sec)
                  </div>
                </th>
                <th style={{ width: "150px" }}>
                  <div>
                    FTF Rate limit capacity
                    <Tooltip
                      label=""
                      tip="Maximum amount per transaction for Fast Token Finality"
                      labelStyle={{
                        marginRight: "5px",
                      }}
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginBottom: "2px",
                      }}
                    />
                  </div>
                  <div style={{ color: "var(--muted-more-foreground)", fontSize: "0.875rem", fontWeight: "normal" }}>
                    (Tokens)
                  </div>
                </th>
                <th style={{ width: "180px" }}>
                  <div>
                    FTF Rate limit refill rate
                    <Tooltip
                      label=""
                      tip="Rate at which available capacity is replenished for Fast Token Finality"
                      labelStyle={{
                        marginRight: "5px",
                      }}
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginBottom: "2px",
                      }}
                    />
                  </div>
                  <div style={{ color: "var(--muted-more-foreground)", fontSize: "0.875rem", fontWeight: "normal" }}>
                    (Tokens/sec)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {processedTokens.map((token, index) => (
                <tr key={index} className={token.isPaused ? "ccip-table__row--paused" : ""}>
                  <td>
                    <a href={`/ccip/directory/${environment}/token/${token.id}`}>
                      <div
                        className={`ccip-table__network-name ${token.isPaused ? "ccip-table__network-name--paused" : ""}`}
                      >
                        <img
                          src={token.logo}
                          alt={`${token.id} logo`}
                          className="ccip-table__logo"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null // prevents looping
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                        {token.id}
                        {token.isPaused && (
                          <span className="ccip-table__paused-badge" title="Transfers are currently paused">
                            ⏸️
                          </span>
                        )}
                      </div>
                    </a>
                  </td>
                  <td data-clipboard-type="token">
                    <Address
                      address={token.data[sourceNetwork.key].tokenAddress}
                      endLength={4}
                      contractUrl={getExplorerAddressUrl(explorer)(token.data[sourceNetwork.key].tokenAddress)}
                    />
                  </td>
                  <td>{token.data[sourceNetwork.key].decimals}</td>
                  <td>
                    {inOutbound === LaneFilter.Outbound
                      ? determineTokenMechanism(
                          (token.data[sourceNetwork.key].pool?.type ||
                            token.data[sourceNetwork.key].poolType) as PoolType,
                          (token.data[destinationNetwork.key].pool?.type ||
                            token.data[destinationNetwork.key].poolType) as PoolType
                        )
                      : determineTokenMechanism(
                          (token.data[destinationNetwork.key].pool?.type ||
                            token.data[destinationNetwork.key].poolType) as PoolType,
                          (token.data[sourceNetwork.key].pool?.type ||
                            token.data[sourceNetwork.key].poolType) as PoolType
                        )}
                  </td>

                  <td>
                    <RateLimitCell
                      isLoading={isLoadingRateLimits}
                      rateLimit={token.rateLimits.standard}
                      type="capacity"
                      showUnavailableTooltip
                    />
                  </td>
                  <td className="rate-tooltip-cell">
                    <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={token.rateLimits.standard} type="rate" />
                  </td>
                  <td>
                    <RateLimitCell
                      isLoading={isLoadingRateLimits}
                      rateLimit={token.rateLimits.ftf}
                      type="capacity"
                      showUnavailableTooltip
                    />
                  </td>
                  <td>
                    <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={token.rateLimits.ftf} type="rate" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ccip-table__notFound">{processedTokens.length === 0 && <>No tokens found</>}</div>
      </div>
    </>
  )
}

export default LaneDrawer
