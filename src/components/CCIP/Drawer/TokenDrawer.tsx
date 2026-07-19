import "../Tables/Table.css"
import TokenDetailsHero from "../ChainHero/TokenDetailsHero.tsx"
import {
  Environment,
  getNetwork,
  determineTokenMechanism,
  PoolType,
  getTokenData,
  Version,
} from "~/config/data/ccip/index.ts"
import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { ChainType, ExplorerInfo } from "~/config/index.ts"
import TableSearchInput from "../Tables/TableSearchInput.tsx"
import Tabs from "../Tables/Tabs.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { useTokenDirectory } from "~/hooks/useTokenDirectory.ts"
import { realtimeDataService } from "~/lib/ccip/services/realtime-data-instance.ts"
import { NetworkLaneRow } from "./NetworkLaneRow.tsx"
import { NetworkLaneRowNoVerifiers } from "./NetworkLaneRowNoVerifiers.tsx"
import { buildLaneVerifierRows } from "./verifierRows.ts"
import type { TokenRateLimits, LaneVerifiers } from "~/lib/ccip/types/index.ts"

// Feature flag: the backend now serves live verifier (CCV) data, so the accordion is enabled.
const SHOW_VERIFIERS_ACCORDION = true

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
  const [openWarning, setOpenWarning] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const toggleRowExpansion = (networkName: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(networkName)) {
      newExpandedRows.delete(networkName)
    } else {
      newExpandedRows.add(networkName)
    }
    setExpandedRows(newExpandedRows)
  }

  const warningContent = (
    <>
      For v1.5.1 token pools on EVM chains, rate limit enforcement may differ from configured values when token decimals
      vary across chains. It is recommended to upgrade to the latest version of Token Pools.{" "}
      <a
        href="/ccip/concepts/cross-chain-token/evm/token-pools#token-pool-version-considerations"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline", color: "white" }}
      >
        Learn more
      </a>
      .
    </>
  )

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const scheduleCloseWarning = () => {
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenWarning(null)
      setTooltipPosition(null)
    }, 120)
  }

  const openWarningTooltip = (destinationChain: string, target: HTMLElement) => {
    clearCloseTimeout()

    const rect = target.getBoundingClientRect()
    const tooltipWidth = 320
    const gutter = 8
    const viewportWidth = window.innerWidth

    let left = rect.left
    if (left + tooltipWidth + gutter > viewportWidth) {
      left = Math.max(gutter, viewportWidth - tooltipWidth - gutter)
    }

    const openBelow = rect.top < 140
    const top = openBelow ? rect.bottom + 8 : rect.top - 8

    setTooltipPosition({ top, left })
    setOpenWarning(destinationChain)
  }

  // Single API call — returns outboundLanes + inboundLanes with rate limits and verifiers
  const { data: tokenDirectory, isLoading: isLoadingRateLimits } = useTokenDirectory(token.id, network.key, environment)

  // Select the appropriate lane map and direction based on the active tab
  const activeLanes =
    activeTab === TokenTab.Outbound ? (tokenDirectory?.outboundLanes ?? {}) : (tokenDirectory?.inboundLanes ?? {})

  const direction = activeTab === TokenTab.Outbound ? "out" : "in"

  type LaneRow = {
    networkDetails: { name: string; logo: string; explorer: ExplorerInfo; chainType: ChainType }
    chainKey: string
    destinationPoolType: PoolType | undefined
    rateLimits: TokenRateLimits | null
    verifiers: LaneVerifiers | null
    destinationDecimals: number | undefined
  }

  const laneRows: LaneRow[] = Object.entries(activeLanes)
    .map(([chainKey, laneEntry]) => {
      const networkDetails = getNetwork({ filter: environment, chain: chainKey })
      if (!networkDetails) return null

      // Destination token decimals (V1_2_0 config) — used to detect the v1.5.1 decimal-mismatch rate-limit warning
      const destinationDecimals = getTokenData({
        environment,
        version: Version.V1_2_0,
        tokenId: token.id,
      })[chainKey]?.decimals

      return {
        networkDetails,
        chainKey,
        destinationPoolType: poolTypesByChain?.[chainKey],
        rateLimits: laneEntry.rateLimits ?? null,
        verifiers: laneEntry.verifiers ?? null,
        destinationDecimals,
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
                .map(({ networkDetails, chainKey, destinationPoolType, rateLimits, verifiers, destinationDecimals }) => {
                  const allLimits = realtimeDataService.getAllRateLimitsForDirection(rateLimits, direction)
                  const tokenPaused = allLimits.standard?.capacity === "0"

                  const isOutbound = activeTab === TokenTab.Outbound
                  const mechanism = isOutbound
                    ? determineTokenMechanism(network.tokenPoolType, destinationPoolType)
                    : determineTokenMechanism(destinationPoolType, network.tokenPoolType)

                  // Resolve verifier addresses on the chain each side lives on:
                  // outbound tab = thisChain -> chainKey; inbound tab = chainKey -> thisChain.
                  const verifierRows = buildLaneVerifierRows(
                    verifiers,
                    isOutbound ? network.key : chainKey,
                    isOutbound ? chainKey : network.key,
                    environment
                  )

                  // v1.5.1 token pools on EVM may enforce rate limits differently when token decimals
                  // differ across chains. Warn on inbound lanes where a decimal mismatch exists.
                  const hasDecimalMismatch = network.tokenDecimals !== destinationDecimals
                  const isV151 = tokenDirectory?.pool?.version?.includes("1.5.1")
                  const isInboundLane = activeTab === TokenTab.Inbound
                  const isEvmNetwork = String(network.chainType).toLowerCase() === "evm"
                  const shouldWarn = Boolean(isV151 && hasDecimalMismatch && isInboundLane && isEvmNetwork)

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
                      verifierRows={verifierRows}
                      sourceExplorer={isOutbound ? network.explorer : networkDetails.explorer}
                      sourceChainType={isOutbound ? network.chainType : networkDetails.chainType}
                      destinationExplorer={isOutbound ? networkDetails.explorer : network.explorer}
                      destinationChainType={isOutbound ? networkDetails.chainType : network.chainType}
                      showWarning={shouldWarn}
                      onWarningEnter={(target) => openWarningTooltip(chainKey, target)}
                      onWarningLeave={scheduleCloseWarning}
                    />
                  ) : (
                    <NetworkLaneRowNoVerifiers
                      key={chainKey}
                      networkDetails={networkDetails}
                      tokenPaused={tokenPaused}
                      mechanism={mechanism}
                      allLimits={allLimits}
                      isLoadingRateLimits={isLoadingRateLimits}
                      showWarning={shouldWarn}
                      onWarningEnter={(target) => openWarningTooltip(chainKey, target)}
                      onWarningLeave={scheduleCloseWarning}
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

      {openWarning && tooltipPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                transform: tooltipPosition.top < 140 ? "none" : "translateY(-100%)",
                zIndex: 9999,
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
              onMouseEnter={() => {
                clearCloseTimeout()
              }}
              onMouseLeave={() => {
                scheduleCloseWarning()
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {warningContent}
            </div>,
            document.body
          )
        : null}
    </div>
  )
}

export default TokenDrawer
