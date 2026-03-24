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
} from "~/config/data/ccip/index.ts"
import { useState, useMemo, Fragment } from "react"
import { ChainType, ExplorerInfo, SupportedChain } from "~/config/index.ts"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import Tabs from "../Tables/Tabs.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { useMultiLaneRateLimits } from "~/hooks/useMultiLaneRateLimits.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"
import { NetworkLaneRow } from "./NetworkLaneRow.tsx"
import { NetworkLaneRowNoVerifiers } from "./NetworkLaneRowNoVerifiers.tsx"

// Feature flag: set to `true` once the backend is ready to re-enable the Verifiers accordion.
const SHOW_VERIFIERS_ACCORDION = false

enum TokenTab {
  Outbound = "outbound",
  Inbound = "inbound",
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
          poolRawType: network.tokenPoolRawType,
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
              ]}
              onChange={(key) => setActiveTab(key as TokenTab)}
            />
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
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
                  <div>FTF Rate limit capacity</div>
                  <span className="ccip-table__header-sublabel">(Tokens)</span>
                </th>
                <th>
                  <div>FTF Rate limit refill rate</div>
                  <span className="ccip-table__header-sublabel">(Tokens/sec)</span>
                </th>
                {SHOW_VERIFIERS_ACCORDION && <th>Verifiers</th>}
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

                  // Get verifiers for the destination network (safe fallback to empty array)
                  const destinationVerifiers = SHOW_VERIFIERS_ACCORDION
                    ? getVerifiersByNetwork({
                        networkId: destinationChain,
                        environment,
                        version: Version.V1_2_0,
                      })
                    : []

                  const isExpanded = SHOW_VERIFIERS_ACCORDION && expandedRows.has(networkDetails.name)

                  const mechanism =
                    activeTab === TokenTab.Outbound
                      ? determineTokenMechanism(network.tokenPoolType, destinationPoolType)
                      : determineTokenMechanism(destinationPoolType, network.tokenPoolType)

                  return SHOW_VERIFIERS_ACCORDION ? (
                    <NetworkLaneRow
                      key={networkDetails.name}
                      networkDetails={networkDetails}
                      tokenPaused={tokenPaused}
                      isExpanded={isExpanded}
                      onToggle={() => toggleRowExpansion(networkDetails.name)}
                      mechanism={mechanism}
                      allLimits={allLimits}
                      isLoadingRateLimits={isLoadingRateLimits}
                      destinationVerifiers={destinationVerifiers}
                      explorer={network.explorer}
                      chainType={network.chainType}
                    />
                  ) : (
                    <NetworkLaneRowNoVerifiers
                      networkDetails={networkDetails}
                      tokenPaused={tokenPaused}
                      mechanism={mechanism}
                      allLimits={allLimits}
                      isLoadingRateLimits={isLoadingRateLimits}
                    />
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
