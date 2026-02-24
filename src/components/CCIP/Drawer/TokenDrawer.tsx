import "../Tables/Table.css"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero.tsx"
import {
  Environment,
  getLane,
  getNetwork,
  SupportedTokenConfig,
  Version,
  determineTokenMechanism,
  PoolType,
  getTokenData,
  LaneConfig,
  getVerifiersByNetwork,
  getVerifierTypeDisplay,
} from "~/config/data/ccip/index.ts"
import { useState, useMemo } from "react"
import { ChainType, ExplorerInfo, SupportedChain } from "~/config/index.ts"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import Address from "~/components/AddressReact.tsx"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import Tabs from "../Tables/Tabs.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { useMultiLaneRateLimits } from "~/hooks/useMultiLaneRateLimits.ts"
import { RateLimitCell } from "~/components/CCIP/RateLimitCell.tsx"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"
import { Typography } from "@chainlink/blocks"

enum TokenTab {
  Outbound = "outbound",
  Inbound = "inbound",
  Verifiers = "verifiers",
}

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
    explorer: ExplorerInfo
  }
  destinationLanes: {
    [sourceChain: string]: SupportedTokenConfig
  }
  environment: Environment
}) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<TokenTab>(TokenTab.Outbound)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRowExpansion = (networkName: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(networkName)) {
      newExpandedRows.delete(networkName)
    } else {
      newExpandedRows.add(networkName)
    }
    setExpandedRows(newExpandedRows)
  }

  // Get verifiers for the current network
  const verifiers = getVerifiersByNetwork({
    networkId: network.key,
    environment,
    version: Version.V1_2_0,
  })

  // Filter verifiers based on search
  const filteredVerifiers = useMemo(() => {
    if (!search) return verifiers
    const searchLower = search.toLowerCase()
    return verifiers.filter(
      (verifier) =>
        verifier.name.toLowerCase().includes(searchLower) ||
        verifier.address.toLowerCase().includes(searchLower) ||
        verifier.type.toLowerCase().includes(searchLower)
    )
  }, [verifiers, search])

  type LaneRow = {
    networkDetails: {
      name: string
      logo: string
    }
    laneData: LaneConfig
    destinationChain: string
    destinationPoolType: PoolType
  }

  // Build lane configurations for fetching rate limits
  const laneConfigs = useMemo(() => {
    return Object.keys(destinationLanes).map((destinationChain) => ({
      source: activeTab === TokenTab.Outbound ? network.key : destinationChain,
      destination: activeTab === TokenTab.Outbound ? destinationChain : network.key,
    }))
  }, [destinationLanes, network.key, activeTab])

  // Fetch rate limits for all lanes using custom hook
  const { rateLimitsMap, isLoading: isLoadingRateLimits } = useMultiLaneRateLimits(laneConfigs, environment)

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
      const destinationPoolType = destinationTokenData.pool?.type || destinationTokenData.poolType
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
          poolType: network.tokenPoolType,
          poolAddress: network.tokenPoolAddress,
        }}
        network={{
          name: network.name,
          logo: network.logo,
          explorer: network.explorer,
          chainType: network.chainType,
        }}
        inDrawer={true}
      />
      <div className="ccip-table__drawer-container ccip-table__drawer-container--token">
        <div className="ccip-table__filters">
          <div>
            <Tabs
              tabs={[
                {
                  name: "Outbound lanes",
                  key: TokenTab.Outbound,
                },
                {
                  name: "Inbound lanes",
                  key: TokenTab.Inbound,
                },
                {
                  name: "Verifiers",
                  key: TokenTab.Verifiers,
                },
              ]}
              onChange={(key) => setActiveTab(key as TokenTab)}
            />
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
        {activeTab === TokenTab.Verifiers ? (
          <div className="ccip-table__wrapper">
            <table className="ccip-table">
              <thead>
                <tr>
                  <th className="ccip-table__verifier-name-header">
                    <Typography variant="body-semi-s">Verifier name</Typography>
                  </th>
                  <th>
                    <Typography variant="body-semi-s">Verifier address</Typography>
                  </th>
                  <th>
                    <Typography variant="body-semi-s">Verifier type</Typography>
                  </th>
                  <th>
                    <Typography variant="body-semi-s">Threshold amount</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {verifiers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px", verticalAlign: "middle" }}>
                      No verifiers found for this network.
                    </td>
                  </tr>
                ) : (
                  filteredVerifiers.map((verifier) => (
                    <tr key={verifier.address}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={verifier.logo}
                            alt={`${verifier.name} logo`}
                            className="ccip-table__logo"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <Typography variant="body">{verifier.name}</Typography>
                        </div>
                      </td>
                      <td>
                        <Address
                          contractUrl={getExplorerAddressUrl(network.explorer, network.chainType)(verifier.address)}
                          address={verifier.address}
                          endLength={4}
                        />
                      </td>
                      <td>
                        <Typography variant="body">{getVerifierTypeDisplay(verifier.type)}</Typography>
                      </td>
                      <td>
                        <Typography variant="body">N/A</Typography>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ccip-table__wrapper">
            <table className="ccip-table">
              <thead>
                <tr>
                  <th>{activeTab === TokenTab.Inbound ? "Source" : "Destination"} network</th>
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
                    <span className="ccip-table__header-sublabel">(Tokens)</span>
                  </th>
                  <th>
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
                    <span className="ccip-table__header-sublabel">(Tokens/sec)</span>
                  </th>
                  <th>
                    <div>
                      FTF Rate limit capacity
                      <Tooltip
                        label=""
                        tip="Maximum amount per transaction for fast transfers"
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
                    <span className="ccip-table__header-sublabel">(Tokens)</span>
                  </th>
                  <th>
                    <div>
                      FTF Rate limit refill rate
                      <Tooltip
                        label=""
                        tip="Rate at which available capacity is replenished for fast transfers"
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
                    <span className="ccip-table__header-sublabel">(Tokens/sec)</span>
                  </th>
                  <th>Verifiers</th>
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

                    // Get rate limit data for this lane
                    const source = activeTab === TokenTab.Outbound ? network.key : destinationChain
                    const destination = activeTab === TokenTab.Outbound ? destinationChain : network.key
                    const laneKey = `${source}-${destination}`
                    const laneRateLimits = rateLimitsMap[laneKey]
                    const tokenRateLimits = laneRateLimits?.[token.id]

                    const direction = activeTab === TokenTab.Outbound ? "out" : "in"

                    // Get standard and FTF rate limits
                    const allLimits = realtimeDataService.getAllRateLimitsForDirection(tokenRateLimits, direction)

                    // Token is paused if standard rate limit capacity is 0
                    const tokenPaused = allLimits.standard?.capacity === "0"

                    // Get verifiers for the destination network
                    const destinationVerifiers = getVerifiersByNetwork({
                      networkId: destinationChain,
                      environment,
                      version: Version.V1_2_0,
                    })

                    const isExpanded = expandedRows.has(networkDetails.name)

                    return (
                      <>
                        <tr
                          key={networkDetails.name}
                          className={`ccip-table__accordion-row ${tokenPaused ? "ccip-table__row--paused" : ""} ${isExpanded ? "ccip-table__accordion-row--expanded" : ""}`}
                          onClick={() => toggleRowExpansion(networkDetails.name)}
                          role="button"
                          tabIndex={0}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? "Hide" : "Show"} verifiers for ${networkDetails?.name}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              toggleRowExpansion(networkDetails.name)
                            }
                          }}
                        >
                          <td>
                            <div
                              className={`ccip-table__network-name ${tokenPaused ? "ccip-table__network-name--paused" : ""}`}
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
                            </div>
                          </td>
                          <td>
                            {activeTab === TokenTab.Outbound
                              ? determineTokenMechanism(network.tokenPoolType, destinationPoolType)
                              : determineTokenMechanism(destinationPoolType, network.tokenPoolType)}
                          </td>
                          <td>
                            <RateLimitCell
                              isLoading={isLoadingRateLimits}
                              rateLimit={allLimits.standard}
                              type="capacity"
                            />
                          </td>
                          <td>
                            <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.standard} type="rate" />
                          </td>
                          <td>
                            <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.ftf} type="capacity" />
                          </td>
                          <td>
                            <RateLimitCell isLoading={isLoadingRateLimits} rateLimit={allLimits.ftf} type="rate" />
                          </td>
                          <td>
                            <div className="ccip-table__verifier-toggle">
                              <svg
                                className={`ccip-table__expand-icon ${isExpanded ? "ccip-table__expand-icon--expanded" : ""}`}
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 6L8 10L12 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="ccip-table__verifier-row">
                            <td colSpan={7} style={{ padding: 0 }}>
                              <div className="ccip-table__verifier-content">
                                {destinationVerifiers.length === 0 ? (
                                  <div
                                    style={{
                                      textAlign: "center",
                                      padding: "20px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      minHeight: "60px",
                                    }}
                                  >
                                    <Typography variant="body">No verifiers found for this network.</Typography>
                                  </div>
                                ) : (
                                  <table className="ccip-table ccip-table--verifiers">
                                    <thead>
                                      <tr>
                                        <th>Verifier</th>
                                        <th>Source verifier address</th>
                                        <th>Destination verifier address</th>
                                        <th>Threshold amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {destinationVerifiers.map((verifier) => (
                                        <tr key={verifier.address}>
                                          <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                              <img
                                                src={verifier.logo}
                                                alt={`${verifier.name} logo`}
                                                className="ccip-table__logo"
                                                style={{ width: "24px", height: "24px" }}
                                              />
                                              <Typography variant="body">{verifier.name}</Typography>
                                            </div>
                                          </td>
                                          <td>
                                            <Address
                                              contractUrl={getExplorerAddressUrl(
                                                network.explorer,
                                                network.chainType
                                              )(verifier.address)}
                                              address={verifier.address}
                                              endLength={4}
                                            />
                                          </td>
                                          <td>
                                            <Address
                                              contractUrl={getExplorerAddressUrl(
                                                network.explorer,
                                                network.chainType
                                              )(verifier.address)}
                                              address={verifier.address}
                                              endLength={4}
                                            />
                                          </td>
                                          <td>
                                            <Typography variant="body">150,000</Typography>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab !== TokenTab.Verifiers && (
          <div className="ccip-table__notFound">
            {laneRows?.filter(
              ({ networkDetails }) => networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && <>No lanes found</>}
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenDrawer
