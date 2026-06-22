import Address from "~/components/AddressReact.tsx"
import "./Table.css"
import { drawerContentStore, DrawerWidth, drawerWidthStore } from "../Drawer/drawerStore.ts"
import { Environment, SupportedTokenConfig, PoolType } from "~/config/data/ccip/index.ts"
import { areAllLanesPaused } from "~/config/data/ccip/utils.ts"
import { ChainType, ExplorerInfo } from "~/config/types.ts"
import TableSearchInput from "./TableSearchInput.tsx"
import { useState } from "react"
import { getExplorerAddressUrl, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import TokenDrawer from "../Drawer/TokenDrawer.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { useTokenFinality } from "~/hooks/useTokenFinality.ts"
import { formatPoolTypeForDisplay } from "~/lib/ccip/graphql/utils/type-version-parser.ts"

interface TableProps {
  networks: {
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
    tokenPoolVersion: string
    explorer: ExplorerInfo
  }[]
  token: {
    id: string
    name: string
    logo: string
    symbol: string
  }
  lanes: {
    [sourceChain: string]: {
      [destinationChain: string]: SupportedTokenConfig
    }
  }
  environment: Environment
}

function TokenChainsTable({ networks, token, lanes, environment }: TableProps) {
  const [search, setSearch] = useState("")

  // Build pool type map from GraphQL-enriched networks data for use in TokenDrawer
  const poolTypesByChain = networks.reduce<Record<string, PoolType>>((acc, n) => {
    if (n.tokenPoolType) acc[n.key] = n.tokenPoolType
    return acc
  }, {})

  // Fetch finality and pool details using custom hook
  const { finalityData, poolDetails, isLoading: loading } = useTokenFinality(token.id, environment, "internalId")

  return (
    <>
      <div className="ccip-table__filters">
        <div className="ccip-table__filters-title">
          Listed Networks <span>({Object.keys(lanes).length})</span>
        </div>
        <TableSearchInput search={search} setSearch={setSearch} />
      </div>
      <div className="ccip-table__wrapper">
        <table className="ccip-table">
          <thead>
            <tr>
              <th>Network</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Decimals</th>
              <th>Token address</th>
              <th>Token pool type</th>
              <th>Token pool address</th>
              <th>Pool version</th>
              <th>Custom finality</th>
              <th>Finality depth</th>
              <th>CCV threshold</th>
            </tr>
          </thead>
          <tbody>
            {networks
              ?.filter((network) => network.name.toLowerCase().includes(search.toLowerCase()))
              .map((network, index) => {
                // Check if all lanes for this token on this network are paused
                const allLanesPaused = areAllLanesPaused(lanes[network.key] || {})

                return (
                  <tr
                    key={index}
                    className={`ccip-table__row--clickable ${allLanesPaused ? "ccip-table__row--paused" : ""}`}
                    onClick={() => {
                      drawerWidthStore.set(DrawerWidth.Wide)
                      drawerContentStore.set(() => (
                        <TokenDrawer
                          token={token}
                          network={network}
                          environment={environment}
                          poolTypesByChain={poolTypesByChain}
                        />
                      ))
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${network.name} token details`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.currentTarget.click()
                      }
                    }}
                  >
                    <td>
                      <span
                        className={`ccip-table__network-name ${allLanesPaused ? "ccip-table__network-name--paused" : ""}`}
                      >
                        <span className="ccip-table__logoContainer">
                          <img
                            src={network.logo}
                            alt={`${network.name} blockchain logo`}
                            className="ccip-table__logo"
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null // prevents looping
                              currentTarget.src = fallbackTokenIconUrl
                            }}
                          />
                          <img
                            src={network.tokenLogo}
                            alt={network.tokenId}
                            className="ccip-table__smallLogo"
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null // prevents looping
                              currentTarget.src = fallbackTokenIconUrl
                            }}
                          />
                        </span>
                        {network.name}
                        {allLanesPaused && (
                          <span
                            className="ccip-table__paused-badge"
                            title="All transfers from this network are currently paused"
                          >
                            ⏸️
                          </span>
                        )}
                      </span>
                    </td>
                    <td>{network.tokenName}</td>
                    <td>{network.tokenSymbol}</td>
                    <td>{network.tokenDecimals}</td>
                    <td data-clipboard-type="token">
                      <Address
                        contractUrl={getExplorerAddressUrl(network.explorer, network.chainType)(network.tokenAddress)}
                        address={network.tokenAddress}
                        endLength={3}
                      />
                    </td>
                    <td>{network.tokenPoolRawType ? formatPoolTypeForDisplay(network.tokenPoolRawType) : "—"}</td>
                    <td data-clipboard-type="token-pool">
                      <Address
                        contractUrl={getExplorerAddressUrl(
                          network.explorer,
                          network.chainType
                        )(network.tokenPoolAddress)}
                        address={network.tokenPoolAddress}
                        endLength={4}
                      />
                    </td>
                    <td>{network.tokenPoolVersion}</td>
                    <td>
                      {loading ? (
                        "-"
                      ) : finalityData[network.key] ? (
                        finalityData[network.key].finalitySafe ? (
                          "Yes"
                        ) : (
                          "No"
                        )
                      ) : (
                        <Tooltip
                          label="N/A"
                          tip="Custom finality data is currently unavailable. You can find the custom finality settings by reading the Token Pool contract directly on the relevant blockchain."
                          labelStyle={{ marginRight: "5px" }}
                          style={{ display: "inline-block", verticalAlign: "middle" }}
                        />
                      )}
                    </td>
                    <td>{loading ? "-" : finalityData[network.key] ? finalityData[network.key].finalityDepth : "-"}</td>
                    <td>
                      {(() => {
                        if (loading) return "-"
                        const threshold = poolDetails[network.key]?.ccv?.thresholdAmount
                        return threshold && threshold !== "0" ? threshold : "-"
                      })()}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <div className="ccip-table__notFound">
          {networks?.filter((network) => network.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <>No networks found</>
          )}
        </div>
      </div>
    </>
  )
}

export default TokenChainsTable
