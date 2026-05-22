import "../Tables/Table.css"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero.tsx"
import { Environment, getNetwork, determineTokenMechanism, PoolType } from "~/config/data/ccip/index.ts"
import { useState } from "react"
import { ChainType, ExplorerInfo } from "~/config/index.ts"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import Tabs from "../Tables/Tabs.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { useTokenDirectory } from "~/hooks/useTokenDirectory.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"
import { NetworkLaneRow } from "./NetworkLaneRow.tsx"
import { NetworkLaneRowNoVerifiers } from "./NetworkLaneRowNoVerifiers.tsx"
import type { TokenRateLimits } from "~/lib/ccip/types/index.ts"

// Feature flag: set to `true` once the backend is ready to re-enable the Verifiers accordion.
const SHOW_VERIFIERS_ACCORDION = false

enum TokenTab {
  Outbound = "outbound",
  Inbound = "inbound",
}

function TokenDrawer({
  token,
  network,
  environment,
  poolTypesByChain,
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
  environment: Environment
  poolTypesByChain?: Record<string, PoolType>
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

  // Single API call — returns outboundLanes + inboundLanes with rate limits and verifiers
  const { data: tokenDirectory, isLoading: isLoadingRateLimits } = useTokenDirectory(token.id, network.key, environment)

  // Select the appropriate lane map and direction based on the active tab
  const activeLanes =
    activeTab === TokenTab.Outbound ? (tokenDirectory?.outboundLanes ?? {}) : (tokenDirectory?.inboundLanes ?? {})

  const direction = activeTab === TokenTab.Outbound ? "out" : "in"

  type LaneRow = {
    networkDetails: { name: string; logo: string }
    chainKey: string
    destinationPoolType: PoolType | undefined
    rateLimits: TokenRateLimits | null
  }

  const laneRows: LaneRow[] = Object.entries(activeLanes)
    .map(([chainKey, laneEntry]) => {
      const networkDetails = getNetwork({ filter: environment, chain: chainKey })
      if (!networkDetails) return null

      return {
        networkDetails,
        chainKey,
        destinationPoolType: poolTypesByChain?.[chainKey],
        rateLimits: laneEntry.rateLimits ?? null,
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
          poolRawType: network.tokenPoolRawType,
          poolAddress: network.tokenPoolAddress,
        }}
        network={{
          name: network.name,
          logo: network.logo,
          explorer: network.explorer,
          chainType: network.chainType,
        }}
        poolDetails={
          tokenDirectory?.pool
            ? {
                version: tokenDirectory.pool.version,
                hook: tokenDirectory.pool.hook,
                finality: tokenDirectory.pool.finality,
                ccv: tokenDirectory.pool.ccv,
              }
            : null
        }
        isLoadingPoolDetails={isLoadingRateLimits}
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
                .filter(
                  ({ networkDetails }) =>
                    networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(({ networkDetails, chainKey, destinationPoolType, rateLimits }) => {
                  const allLimits = realtimeDataService.getAllRateLimitsForDirection(rateLimits, direction)
                  const tokenPaused = allLimits.standard?.capacity === "0"

                  const mechanism =
                    activeTab === TokenTab.Outbound
                      ? determineTokenMechanism(network.tokenPoolType, destinationPoolType)
                      : determineTokenMechanism(destinationPoolType, network.tokenPoolType)

                  return SHOW_VERIFIERS_ACCORDION ? (
                    <NetworkLaneRow
                      key={chainKey}
                      networkDetails={networkDetails}
                      tokenPaused={tokenPaused}
                      isExpanded={expandedRows.has(networkDetails.name)}
                      onToggle={() => toggleRowExpansion(networkDetails.name)}
                      mechanism={mechanism}
                      allLimits={allLimits}
                      isLoadingRateLimits={isLoadingRateLimits}
                      destinationVerifiers={[]}
                      explorer={network.explorer}
                      chainType={network.chainType}
                    />
                  ) : (
                    <NetworkLaneRowNoVerifiers
                      key={chainKey}
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
          {isLoadingRateLimits ? (
            <>Loading...</>
          ) : (
            laneRows.filter(
              ({ networkDetails }) => networkDetails && networkDetails.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && <>No lanes found</>
          )}
        </div>
      </div>
    </div>
  )
}

export default TokenDrawer
