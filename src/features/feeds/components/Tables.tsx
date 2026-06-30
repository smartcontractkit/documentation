/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks"
import { Fragment, render } from "preact"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { ChainNetwork } from "~/features/data/chains.ts"
import tableStyles from "./Tables.module.css"
import button from "@chainlink/design-system/button.module.css"
import { CheckHeartbeat } from "./pause-notice/CheckHeartbeat.tsx"
import { monitoredFeeds, FeedDataItem } from "~/features/data/index.ts"
import { StreamsNetworksData, type NetworkData } from "../data/StreamsNetworksData.ts"
import {
  FEED_CATEGORY_CONFIG,
  getRiskCategoryLink,
  getRiskCategoryTitle,
  type CategoryKey,
} from "../../../db/feedCategories.js"
import type { MarketPricingRiskProduct } from "../content/marketPricingRiskTerms.ts"
import { REPORT_SCHEMA_DEFINITIONS, type SchemaDefinition } from "./reportSchemaData.ts"
import schemaFieldsTableStyles from "../../data-streams/common/schemaFieldsTable.module.css"
import { isSharedSVR, isAaveSVR } from "~/features/feeds/utils/svrDetection.ts"
import { ExpandableTableWrapper } from "./ExpandableTableWrapper.tsx"
import { shouldHideAddress, shouldHideStreamFeedId } from "~/features/feeds/utils/feedVisibility.ts"
import { DATA_STREAMS_CONTACT_URL, TOKENIZED_EQUITY_CONTACT_EMAIL } from "~/features/feeds/constants.ts"
import {
  getSchemaVersion,
  getMarketStatusDocLink,
  getTradingHoursDocLink,
  isApacEquitiesStreamFeed,
} from "~/features/feeds/utils/feedMetadata.ts"
import { getFeedTypeFlags } from "~/features/feeds/types.ts"
import { useFilteredFeedMetadata } from "~/features/feeds/hooks/useFilteredFeedMetadata.ts"

const feedItems = monitoredFeeds.mainnet
type StreamNetworkType = "mainnet" | "testnet"

/**
 * Decodes a raw maxSubmissionValue (BigInt string scaled by 10^decimals) into a
 * human-readable USD price string. Returns null if the value is effectively unbounded
 * (i.e. the contract's default max sentinel — all 0xff bytes) or otherwise too large
 * to represent a real price cap.
 *
 * The raw value lives on-chain and is stored as a string to avoid JS number precision
 * loss. We divide by 10^decimals to recover the actual price, then format it.
 */
const getMaxSubmissionValueBound = (
  maxSubmissionValue: string | undefined,
  decimals: number | undefined
): string | null => {
  if (!maxSubmissionValue || decimals == null || decimals < 0) return null
  try {
    const raw = BigInt(maxSubmissionValue)
    const divisor = BigInt(10) ** BigInt(decimals)
    // Hide the badge if the decoded price exceeds $2.00 (fixed-point compare avoids
    // float drift). The all-0xff unbounded sentinel decodes to ~9.578e44 and is filtered here.
    if (raw > BigInt(2) * divisor) return null
    const wholePart = raw / divisor
    const remainder = raw % divisor
    const price = Number(wholePart) + Number(remainder) / Number(divisor)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return null
  }
}

const getSchemaDefinitionKey = (metadata: any): string | undefined => {
  const feedType = metadata.feedType || metadata.docs?.feedType

  if (metadata.feedType === "Crypto-DEX") return "v3-dex"
  if (metadata.feedType === "Crypto" && metadata.docs?.productTypeCode !== "ExRate") return "v3-crypto"

  const schemaVersion = getSchemaVersion(metadata)
  if (feedType === "Equities" || feedType === "Forex" || feedType === "Datalink") {
    if (schemaVersion === "v11") {
      return isApacEquitiesStreamFeed(metadata) ? "v11-apac" : "v11"
    }
    if (schemaVersion === "v8") return "v8"
    return undefined
  }

  if (metadata.docs?.productTypeCode === "ExRate") return "v7"
  if (schemaVersion === "v9") return "v9"
  if (feedType === "Tokenized Equities") return "v10"

  return undefined
}

const SchemaInlineExpander = ({
  schemaDef,
  schemaKey,
  metadata,
}: {
  schemaDef: SchemaDefinition
  schemaKey: string
  metadata: any
}) => {
  const marketHoursLink = getTradingHoursDocLink(metadata, schemaKey)

  return (
    <div className={tableStyles.schemaRow}>
      <div className={tableStyles.definitionGroup}>
        <dt>
          <span className="label">Report Schema:</span>
        </dt>
        <dd>
          <a href={schemaDef.url} rel="noreferrer" target="_blank">
            {schemaDef.label}
          </a>
        </dd>
      </div>
      <details className={tableStyles.schemaDetails}>
        <summary>View {schemaDef.shortLabel} schema fields</summary>
        <div className={schemaFieldsTableStyles.wrapper}>
          <table className={schemaFieldsTableStyles.table}>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {schemaDef.fields.map((f) => {
                const fieldLink = f.field === "marketStatus" ? getMarketStatusDocLink(metadata, schemaKey) : f.link

                return (
                  <tr key={f.field}>
                    <td>
                      <code>{f.field}</code>
                    </td>
                    <td>
                      <code>{f.type}</code>
                    </td>
                    <td>
                      {f.description}
                      {fieldLink && (
                        <>
                          {" See "}
                          <a href={fieldLink.href} rel="noreferrer" target="_blank">
                            {fieldLink.label}
                          </a>
                          {"."}
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className={tableStyles.schemaFooterLinks}>
          <a href={schemaDef.url} rel="noreferrer" target="_blank" className={tableStyles.schemaFullLink}>
            Full schema documentation ↗
          </a>
          {marketHoursLink && (
            <a href={marketHoursLink.href} rel="noreferrer" target="_blank" className={tableStyles.schemaFullLink}>
              {marketHoursLink.label} ↗
            </a>
          )}
        </div>
      </details>
    </div>
  )
}

// Helper function to parse markdown links and render them
const parseMarkdownLink = (text: string) => {
  // Match markdown link format: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: any[] = []
  let lastIndex = 0
  let match

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // Add the link
    parts.push(
      <a href={match[2]} target="_blank" rel="noopener noreferrer" key={match.index}>
        {match[1]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

const RISK_TIER_SHORT_LABELS: Record<string, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
  veryhigh: "Very high risk",
  new: "New token",
  custom: "Custom",
  deprecating: "Deprecating",
}

const normalizeRiskKey = (riskTier?: string | null) => riskTier?.toLowerCase().replace(/\s+/g, "") ?? ""

const getRiskTooltipText = (normalizedKey: CategoryKey, product: MarketPricingRiskProduct) => {
  const title = getRiskCategoryTitle(normalizedKey, product)

  if (normalizedKey === "veryhigh") {
    const assetLabel = product === "streams" ? "streams" : "feeds"
    const assetSingular = product === "streams" ? "stream" : "feed"

    return `${title} The contract address is hidden to help prevent accidental onboarding to inherently risky ${assetLabel}. Contact ${TOKENIZED_EQUITY_CONTACT_EMAIL} if you would like to use this ${assetSingular}.`
  }

  return title
}

const RISK_TOOLTIP_MAX_WIDTH = 280
const RISK_TOOLTIP_VIEWPORT_PADDING = 8

const getRiskTooltipPosition = (anchor: HTMLElement) => {
  const rect = anchor.getBoundingClientRect()
  const maxWidth = Math.min(RISK_TOOLTIP_MAX_WIDTH, window.innerWidth - RISK_TOOLTIP_VIEWPORT_PADDING * 2)
  let left = rect.left

  if (left + maxWidth > window.innerWidth - RISK_TOOLTIP_VIEWPORT_PADDING) {
    left = window.innerWidth - maxWidth - RISK_TOOLTIP_VIEWPORT_PADDING
  }

  const spaceBelow = window.innerHeight - rect.bottom - RISK_TOOLTIP_VIEWPORT_PADDING
  const showAbove = spaceBelow < 120 && rect.top > spaceBelow

  return {
    top: rect.bottom + 6,
    anchorTop: rect.top,
    left: Math.max(RISK_TOOLTIP_VIEWPORT_PADDING, left),
    maxWidth,
    showAbove,
  }
}

const RiskTHeadCell = () => <th className={clsx(tableStyles.heading, tableStyles.riskCol)}>Risk</th>

const getFeedTableColSpan = (isStreams: boolean, showRiskColumn: boolean) =>
  (isStreams ? 2 : 5) + (showRiskColumn ? 1 : 0)

const RiskCell = ({
  riskTier,
  product = "feeds",
}: {
  riskTier?: string | null
  product?: MarketPricingRiskProduct
}) => {
  const [tooltipPos, setTooltipPos] = useState<ReturnType<typeof getRiskTooltipPosition> | null>(null)
  const normalizedKey = normalizeRiskKey(riskTier)
  const category = normalizedKey ? FEED_CATEGORY_CONFIG[normalizedKey as CategoryKey] : undefined
  const tooltipText = category ? getRiskTooltipText(normalizedKey as CategoryKey, product) : ""
  const riskLink = category ? getRiskCategoryLink(normalizedKey as CategoryKey, product) : ""

  useEffect(() => {
    if (!tooltipPos || typeof document === "undefined") return

    const container = document.createElement("div")
    document.body.appendChild(container)

    render(
      <div
        className={tableStyles.riskTooltipBubble}
        style={{
          top: tooltipPos.showAbove ? undefined : `${tooltipPos.top}px`,
          bottom: tooltipPos.showAbove ? `${window.innerHeight - tooltipPos.anchorTop + 6}px` : undefined,
          left: `${tooltipPos.left}px`,
          maxWidth: `${tooltipPos.maxWidth}px`,
        }}
        role="tooltip"
      >
        <p className={tableStyles.riskTooltipText}>{tooltipText}</p>
        <p className={tableStyles.riskTooltipHint}>Click to view the risk selection page.</p>
      </div>,
      container
    )

    return () => {
      render(null, container)
      container.remove()
    }
  }, [tooltipPos, tooltipText])

  if (!category) {
    return (
      <td className={tableStyles.riskCol}>
        <span className={tableStyles.riskUnavailable}>—</span>
      </td>
    )
  }

  const showTooltip = (event: Event) => {
    setTooltipPos(getRiskTooltipPosition(event.currentTarget as HTMLElement))
  }

  const hideTooltip = () => setTooltipPos(null)

  return (
    <td className={tableStyles.riskCol}>
      <div className={tableStyles.riskCell}>
        <span className={tableStyles.riskIcon} aria-hidden="true">
          {category.icon}
        </span>
        <a
          href={riskLink}
          className={tableStyles.riskLabelLink}
          aria-label={category.name}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
        >
          {RISK_TIER_SHORT_LABELS[normalizedKey] ?? category.name}
        </a>
      </div>
    </td>
  )
}

const Pagination = ({ addrPerPage, totalAddr, paginate, currentPage, firstAddr, lastAddr }) => {
  const pageNumbers: number[] = []

  for (let i = 1; i <= Math.ceil(totalAddr / addrPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className={tableStyles.pagination} role="navigation" aria-label="Table pagination">
      {totalAddr !== 0 && (
        <>
          <button
            className={button.secondary}
            style={"outline-offset: 2px"}
            disabled={currentPage === 1}
            onClick={() => paginate(Number(currentPage) - 1)}
            aria-label={`Go to previous page, page ${currentPage - 1}`}
          >
            Prev
          </button>
          <p aria-live="polite">
            Showing {firstAddr + 1} to {lastAddr > totalAddr ? totalAddr : lastAddr} of {totalAddr} entries
          </p>
          <button
            className={button.secondary}
            style={"outline-offset: 2px"}
            disabled={lastAddr >= totalAddr}
            onClick={() => paginate(Number(currentPage) + 1)}
            aria-label={`Go to next page, page ${currentPage + 1}`}
          >
            Next
          </button>
        </>
      )}
    </div>
  )
}

const handleClick = (e, additionalInfo) => {
  e.preventDefault()

  const dataLayerEvent = {
    event: "docs_product_interaction",
    ...additionalInfo,
  }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(dataLayerEvent)
}

const CopyableAddress = ({
  address,
  explorerUrl,
  network,
  environment,
}: {
  address?: string
  explorerUrl: string
  network: NetworkData
  environment: string
}) => {
  if (!address) return null

  return (
    <div className={tableStyles.compactAddressContainer}>
      <a
        className={tableStyles.compactAddressLink}
        href={explorerUrl.replace("%s", address)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address}
      </a>
      <button
        className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
        data-clipboard-text={address}
        onClick={(e) =>
          handleClick(e, {
            product: "STREAMS",
            action: "verifierProxyAddress_copied",
            extraInfo1: environment,
            extraInfo2: network.network,
          })
        }
      >
        <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
      </button>
    </div>
  )
}

const getNetworkStatusUrl = (network: NetworkData): string | null => {
  if (network.networkStatus) {
    return network.networkStatus
  }

  if (network.mainnet?.explorerUrl) {
    try {
      return new URL(network.mainnet.explorerUrl.replace("%s", "")).origin
    } catch {
      return null
    }
  }

  return null
}

const DefaultTHead = ({
  showExtraDetails,
  networkName,
  dataFeedType,
  showRiskColumn = true,
}: {
  showExtraDetails: boolean
  networkName: string
  dataFeedType: string
  showRiskColumn?: boolean
}) => {
  const isAptosNetwork = networkName === "Aptos Mainnet" || networkName === "Aptos Testnet"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"

  return (
    <thead>
      <tr>
        {showRiskColumn && <RiskTHeadCell />}
        <th className={tableStyles.heading}>{isUSGovernmentMacroeconomicData ? "Feed" : "Pair"}</th>
        <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Deviation</th>
        <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Heartbeat</th>
        <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Dec</th>
        <th>{isAptosNetwork ? "Feed ID and info" : "Address and info"}</th>
      </tr>
    </thead>
  )
}

const HiddenAddressContact = ({ className }: { className?: string }) => (
  <span>
    Contact us:{" "}
    <a href={`mailto:${TOKENIZED_EQUITY_CONTACT_EMAIL}`} className={className}>
      {TOKENIZED_EQUITY_CONTACT_EMAIL}
    </a>
  </span>
)

const HiddenStreamFeedIdContact = ({ className }: { className?: string }) => (
  <span>
    Contact us:{" "}
    <a href={DATA_STREAMS_CONTACT_URL} target="_blank" rel="noopener noreferrer" className={className}>
      chain.link/contact
    </a>
  </span>
)

const DefaultTr = ({
  network,
  metadata,
  showExtraDetails,
  batchedCategoryData,
  dataFeedType,
  showRiskColumn = true,
}) => {
  // Use the pre-computed finalCategory from enriched metadata
  // (already includes deprecating status and Supabase risk tier)
  const finalTier = metadata.finalCategory ?? null

  // Feed type checks
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"
  // True tokenized equity feeds (e.g. Ondo) — controls the "Tokenized Equity" badge.
  const isTokenizedEquityFeed =
    metadata.docs?.assetClass === "Equity" &&
    metadata.contractType !== "verifier" &&
    metadata.docs?.productTypeCode === "primaryTokenizedPrice"

  // Any feed with a calculated price, or one explicitly listed in CONTACT_EMAIL_PROXY_ADDRESSES,
  // should have its address hidden and show a contact email instead.
  const hideAddress = shouldHideAddress(metadata, finalTier)

  // Stablecoin price-bound note: only when the source marks the feed as explicitly capped
  const stablecoinBound =
    metadata.docs?.stablecoinCapped === true
      ? getMaxSubmissionValueBound(metadata.maxSubmissionValue, metadata.decimals)
      : null

  const label = isUSGovernmentMacroeconomicData ? "Category" : "Asset type"
  const value = isUSGovernmentMacroeconomicData
    ? metadata.docs.assetClass === "Macroeconomics"
      ? "U.S. Government Macroeconomic Data Feeds"
      : metadata.docs.assetClass
    : metadata.feedType
  return (
    <tr>
      {showRiskColumn && <RiskCell riskTier={finalTier} />}
      <td className={tableStyles.pairCol}>
        <div className={tableStyles.assetPair}>
          <div className={tableStyles.pairNameRow}>{metadata.name}</div>
          {metadata.secondaryProxyAddress && (
            <div style={{ marginTop: "5px" }}>
              <a
                href={
                  isAaveSVR(metadata)
                    ? "/data-feeds/svr-feeds#aave-svr-feeds"
                    : isSharedSVR(metadata)
                      ? "/data-feeds/svr-feeds"
                      : "/data-feeds/svr-feeds"
                }
                target="_blank"
                className={tableStyles.feedVariantBadge}
                title={
                  isAaveSVR(metadata) ? "Aave Dedicated SVR Feed" : isSharedSVR(metadata) ? " SVR Feed" : "SVR Feed"
                }
              >
                {isAaveSVR(metadata) ? "Aave SVR" : isSharedSVR(metadata) ? "SVR" : "SVR"}
              </a>
            </div>
          )}
          {isTokenizedEquityFeed && (
            <div style={{ marginTop: "5px" }}>
              <a
                href="/data-feeds/tokenized-equity-feeds"
                className={tableStyles.feedVariantBadge}
                title="Tokenized Equity Feed"
              >
                Tokenized Equity
              </a>
            </div>
          )}
          {stablecoinBound && (
            <div>
              <a
                href="/data-feeds/selecting-data-feeds#bounded-market-price-feeds"
                className={tableStyles.boundedNote}
                title="This feed has a maximum reportable price"
                target="_blank"
              >
                Bounded (Upper): {stablecoinBound}
              </a>
            </div>
          )}
        </div>
        {metadata.docs.shutdownDate && (
          <div className={clsx(feedList.shutDate)}>
            <hr />
            Deprecating:
            <br />
            {metadata.docs.shutdownDate}
          </div>
        )}
      </td>
      <td style={{ display: showExtraDetails ? "table-cell" : "none" }}>
        {metadata.threshold ? metadata.threshold + "%" : "N/A"}
      </td>
      <td style={{ display: showExtraDetails ? "table-cell" : "none" }}>
        {metadata.heartbeat ? metadata.heartbeat + "s" : "N/A"}
      </td>
      <td style={{ display: showExtraDetails ? "table-cell" : "none" }}>
        {metadata.decimals ? metadata.decimals : "N/A"}
      </td>
      <td>
        <div>
          <dl className={tableStyles.listContainer}>
            <div className={tableStyles.definitionGroup}>
              {metadata.secondaryProxyAddress && (
                <dt>
                  <span className="label">Standard Proxy:</span>
                </dt>
              )}
              <dd>
                {hideAddress ? (
                  <HiddenAddressContact className={tableStyles.addressLink} />
                ) : (
                  <div className={tableStyles.assetAddress}>
                    <button
                      className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                      data-clipboard-text={metadata.proxyAddress ?? metadata.transmissionsAccount}
                      onClick={(e) =>
                        handleClick(e, {
                          product: "FEEDS",
                          action: "feedId_copied",
                          extraInfo1: network.name,
                          extraInfo2: metadata.name,
                          extraInfo3: metadata.proxyAddress,
                        })
                      }
                    >
                      <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                    </button>
                    <a
                      className={tableStyles.addressLink}
                      href={network.explorerUrl.replace("%s", metadata.proxyAddress ?? metadata.transmissionsAccount)}
                      target="_blank"
                    >
                      {metadata.proxyAddress ?? metadata.transmissionsAccount}
                    </a>
                  </div>
                )}
              </dd>
            </div>
            {metadata.assetName && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Asset name:</span>
                </dt>
                <dd>{metadata.assetName}</dd>
              </div>
            )}
            {value && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">{label}:</span>
                </dt>
                <dd>
                  {value}
                  {metadata.docs.assetSubClass === "UK" ? " - " + metadata.docs.assetSubClass : ""}
                </dd>
              </div>
            )}
            {metadata.docs.marketHours && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Market hours:</span>
                </dt>
                <dd>
                  <a href="/data-feeds/selecting-data-feeds#market-hours" target="_blank">
                    {metadata.docs.marketHours}
                  </a>
                </dd>
              </div>
            )}
            {metadata.secondaryProxyAddress && (
              <>
                <div className={tableStyles.separator} />
                <div className={tableStyles.assetAddress}>
                  <dt>
                    <span className="label">{isAaveSVR(metadata) ? "AAVE SVR Proxy:" : "SVR Proxy:"}</span>
                  </dt>
                  <dd>
                    {hideAddress ? (
                      <HiddenAddressContact className={tableStyles.addressLink} />
                    ) : (
                      <>
                        <button
                          className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                          data-clipboard-text={metadata.secondaryProxyAddress}
                          onClick={(e) =>
                            handleClick(e, {
                              product: "FEEDS",
                              action: "SVR_proxy_copied",
                              extraInfo1: network.name,
                              extraInfo2: metadata.name,
                              extraInfo3: metadata.secondaryProxyAddress,
                            })
                          }
                        >
                          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                        </button>
                        <a
                          className={tableStyles.addressLink}
                          href={network.explorerUrl.replace("%s", metadata.secondaryProxyAddress)}
                          target="_blank"
                        >
                          {metadata.secondaryProxyAddress}
                        </a>
                      </>
                    )}
                  </dd>
                </div>
                {isAaveSVR(metadata) && !hideAddress && (
                  <div className={clsx(tableStyles.aaveCallout)}>
                    <strong>⚠️ Aave Dedicated Feed:</strong> This SVR proxy feed is dedicated exclusively for use by the
                    Aave protocol. Learn more about{" "}
                    <a href="/data-feeds/svr-feeds#aave-svr-feeds" target="_blank">
                      Aave SVR Feeds
                    </a>
                    .
                  </div>
                )}
                {isSharedSVR(metadata) && !hideAddress && (
                  <div className={clsx(tableStyles.sharedCallout)}>
                    <strong>🔗 SVR Feed:</strong> This SVR proxy feed is usable by any protocol. Learn more about{" "}
                    <a href="/data-feeds/svr-feeds" target="_blank">
                      SVR Feeds
                    </a>
                    .
                  </div>
                )}
              </>
            )}
          </dl>
        </div>
      </td>
    </tr>
  )
}

const SmartDataTHead = ({
  showExtraDetails,
  showRiskColumn = true,
}: {
  showExtraDetails: boolean
  showRiskColumn?: boolean
}) => (
  <thead>
    <tr>
      {showRiskColumn && <RiskTHeadCell />}
      <th className={tableStyles.heading}>SmartData Feed</th>
      <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Deviation</th>
      <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Heartbeat</th>
      <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Dec</th>
      <th>Address and Info</th>
    </tr>
  </thead>
)

const SmartDataTr = ({ network, metadata, showExtraDetails, batchedCategoryData, showRiskColumn = true }) => {
  // Check if this is an MVR feed
  const hasDecoding = Array.isArray(metadata.docs?.decoding) && metadata.docs.decoding.length > 0
  const isMVRFlagSet = metadata.docs?.isMVR === true

  // Only show MVR badge if explicitly flagged as MVR
  const finalIsMVRFeed = isMVRFlagSet && hasDecoding

  // Use the pre-computed finalCategory from enriched metadata
  // (already includes deprecating status and Supabase risk tier)
  const finalTier = metadata.finalCategory ?? null

  // Stablecoin price-bound note: only when the source marks the feed as explicitly capped
  const stablecoinBound =
    metadata.docs?.stablecoinCapped === true
      ? getMaxSubmissionValueBound(metadata.maxSubmissionValue, metadata.decimals)
      : null

  const hideAddress = shouldHideAddress(metadata, finalTier)

  return (
    <tr>
      {showRiskColumn && <RiskCell riskTier={finalTier} />}
      <td className={tableStyles.pairCol}>
        {feedItems.map((feedItem: FeedDataItem) => {
          const [feedAddress] = Object.keys(feedItem)
          if (feedAddress === metadata.proxyAddress) {
            return (
              <CheckHeartbeat
                feedAddress={metadata.proxyAddress}
                supportedChain="ETHEREUM_MAINNET"
                feedName={metadata.name}
                list
                currencyName={feedItem[feedAddress]}
              />
            )
          }
          return ""
        })}
        <div className={tableStyles.assetPair}>{metadata.name}</div>
        {metadata.docs.shutdownDate && (
          <div className={clsx(feedList.shutDate)}>
            <hr />
            Deprecating:
            <br />
            {metadata.docs.shutdownDate}
          </div>
        )}
        {(metadata.docs.assetClass === "Stablecoin Stability Assessment" ||
          (metadata.docs.productType && metadata.docs.assetClass !== "Stablecoin Stability Assessment")) && (
          <div style={{ marginTop: "5px", textAlign: "center" }}>
            <dd>
              {metadata.docs.assetClass === "Stablecoin Stability Assessment"
                ? metadata.docs.assetClass
                : metadata.docs.productType}
            </dd>
          </div>
        )}
        {finalIsMVRFeed && (
          <div style={{ marginTop: "5px", textAlign: "center" }}>
            <a
              href="/data-feeds/mvr-feeds"
              className={tableStyles.feedVariantBadge}
              title="Multiple-Variable Response (MVR) Feed"
            >
              MVR
            </a>
          </div>
        )}
        {stablecoinBound && (
          <div style={{ textAlign: "center" }}>
            <a
              href="/data-feeds/selecting-data-feeds#bounded-market-price-feeds"
              className={tableStyles.boundedNote}
              title="This feed has a maximum reportable price"
              target="_blank"
            >
              Bounded (Upper): {stablecoinBound}
            </a>
          </div>
        )}
      </td>

      <td style={{ display: showExtraDetails ? "table-cell" : "none" }}>
        {metadata.threshold ? metadata.threshold + "%" : "N/A"}
      </td>
      <td style={{ display: showExtraDetails ? "table-cell" : "none" }}>
        {metadata.heartbeat ? metadata.heartbeat : "N/A"}
      </td>
      <td style={{ display: showExtraDetails ? "table-cell" : "none" }}>
        {metadata.decimals ? metadata.decimals : "N/A"}
      </td>
      <td>
        <div className={tableStyles.assetAddress}>
          {hideAddress ? (
            <HiddenAddressContact className={tableStyles.addressLink} />
          ) : (
            <>
              <a
                className={tableStyles.addressLink}
                href={network.explorerUrl.replace("%s", metadata.proxyAddress ?? metadata.transmissionsAccount)}
                target="_blank"
              >
                {metadata.proxyAddress ?? metadata.transmissionsAccount}
              </a>
              <button
                className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                style={{ height: "16px", width: "16px" }}
                data-clipboard-text={metadata.proxyAddress ?? metadata.transmissionsAccount}
                onClick={(e) =>
                  handleClick(e, {
                    product: "FEEDS-POR",
                    action: "feedId_copied",
                    extraInfo1: network.name,
                    extraInfo2: metadata.name,
                    extraInfo3: metadata.proxyAddress ?? metadata.transmissionsAccount,
                  })
                }
              >
                <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
              </button>
            </>
          )}
        </div>
        <div>
          <dl className={tableStyles.listContainer}>
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">
                  {metadata.docs.assetClass === "Stablecoin Stability Assessment"
                    ? "Stablecoin assessed:"
                    : "Asset name:"}
                </span>
              </dt>
              <dd>
                {/* For Stablecoin Stability Assessment feeds, valueSuffix contains the stablecoin ticker being assessed */}
                {metadata.docs.assetClass === "Stablecoin Stability Assessment"
                  ? metadata.valueSuffix || metadata.assetName
                  : metadata.assetName}
              </dd>
            </div>
            {/* Hide Reserve type for Stablecoin Stability Assessment feeds */}
            {metadata.docs.porType && metadata.docs.assetClass !== "Stablecoin Stability Assessment" && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Reserve type:</span>
                </dt>
                <dd>{metadata.docs.porType}</dd>
              </div>
            )}
            {metadata.docs.porAuditor && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Data source:</span>
                </dt>
                <dd>{metadata.docs.porAuditor}</dd>
              </div>
            )}
            {metadata.docs.porSource && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">
                    {metadata.docs.porSource === "Third-party" ? "Auditor verification:" : "Reporting:"}
                  </span>
                </dt>
                <dd>{parseMarkdownLink(metadata.docs.porSource)}</dd>
              </div>
            )}
            {metadata.docs.issuer ? (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Issuer:</span>
                </dt>
                <dd>{metadata.docs.issuer}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        {finalIsMVRFeed && metadata.docs?.decoding && (
          <div className={tableStyles.mvrDecoding}>
            <details style={{ textAlign: "left" }}>
              <summary>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                MVR Bundle Info
              </summary>
              <p className={tableStyles.mvrDescription}>
                This table shows the data structure definition you need to decode the MVR feed's byte array. For
                step-by-step instructions on how to decode and use this data in your applications, see the{" "}
                <a href="/data-feeds/mvr-feeds/guides">implementation guides</a>.{" "}
              </p>
              <div className={tableStyles.mvrDecodingContent}>
                <table className={tableStyles.mvrDecodingTable}>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Type</th>
                      <th>Decimals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.docs.decoding.map((variable, index) => (
                      <tr key={index}>
                        <td>
                          <code>{variable.name}</code>
                        </td>
                        <td>
                          <code>{variable.type}</code>
                        </td>
                        <td>
                          <code>{variable.decimals}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}
      </td>
    </tr>
  )
}

export const StreamsNetworkAddressesTable = ({
  allowExpansion = false,
  defaultExpanded = false,
  initialSearch = "",
  lockSearch = false,
  networkType,
  onNetworkTypeChange,
  showNetworkTypeFilter = false,
}: {
  allowExpansion?: boolean
  defaultExpanded?: boolean
  initialSearch?: string
  lockSearch?: boolean
  networkType?: StreamNetworkType
  onNetworkTypeChange?: (networkType: StreamNetworkType) => void
  showNetworkTypeFilter?: boolean
} = {}) => {
  // null = untouched; string = user has set a value
  const [searchState, setSearchState] = useState<string | null>(null)
  const getNetworkTypeFromURL = (): StreamNetworkType => {
    if (typeof window === "undefined") return "mainnet"
    return new URLSearchParams(window.location.search).get("networkType") === "testnet" ? "testnet" : "mainnet"
  }
  const [internalNetworkType, setInternalNetworkType] = useState<StreamNetworkType>(getNetworkTypeFromURL)
  const [isHydrated, setIsHydrated] = useState(false)
  const selectedNetworkType = networkType ?? internalNetworkType

  useEffect(() => {
    const syncNetworkTypeFromURL = () => {
      setInternalNetworkType((current) => {
        const networkTypeFromURL = getNetworkTypeFromURL()
        return networkTypeFromURL === current ? current : networkTypeFromURL
      })
    }

    setIsHydrated(true)
    syncNetworkTypeFromURL()
    window.addEventListener("popstate", syncNetworkTypeFromURL)
    window.addEventListener("pageshow", syncNetworkTypeFromURL)

    return () => {
      window.removeEventListener("popstate", syncNetworkTypeFromURL)
      window.removeEventListener("pageshow", syncNetworkTypeFromURL)
    }
  }, [])

  const urlSearch =
    typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("streamsNetwork") ?? "") : ""

  // When lockSearch is true, always use initialSearch and ignore user input / URL params
  const searchValue = lockSearch ? initialSearch : (searchState ?? (initialSearch || urlSearch))

  const updateSearch = (value: string) => {
    if (lockSearch) return
    setSearchState(value)
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set("streamsNetwork", value)
    } else {
      params.delete("streamsNetwork")
    }
    const queryString = params.toString()
    const newUrl = window.location.pathname + (queryString ? "?" + queryString : "") + window.location.hash
    window.history.replaceState({ path: newUrl }, "", newUrl)
  }

  const updateNetworkType = (nextNetworkType: StreamNetworkType) => {
    onNetworkTypeChange?.(nextNetworkType)
    if (!networkType) {
      setInternalNetworkType(nextNetworkType)
    }
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (nextNetworkType === "testnet") {
      params.set("networkType", "testnet")
    } else {
      params.delete("networkType")
    }
    const queryString = params.toString()
    const newUrl = window.location.pathname + (queryString ? "?" + queryString : "") + window.location.hash
    window.history.replaceState({ path: newUrl }, "", newUrl)
  }

  const normalizedSearch = searchValue.toLowerCase().replaceAll(" ", "")

  const match = (value?: string) => !!value && value.toLowerCase().replaceAll(" ", "").includes(normalizedSearch)

  const filteredNetworks = StreamsNetworksData.filter((network) => {
    const selectedNetwork = network[selectedNetworkType]
    if (!selectedNetwork) return false
    if (!normalizedSearch) return true

    const networkMatch = match(network.network)
    const selectedLabel = selectedNetwork.label
    const selectedAddr = network.isSolana ? selectedNetwork.verifierProgramId : selectedNetwork.verifierProxy

    return networkMatch || match(selectedLabel) || match(selectedAddr)
  })

  const tableContent = (
    <>
      {showNetworkTypeFilter && isHydrated && (
        <div className={feedList.streamNetworkSelector} style={{ padding: "0.5rem 0.5rem 0" }}>
          <span className={feedList.streamNetworkSelectorLabel}>Environment</span>
          <div className={feedList.streamNetworkToggleGroup} role="group" aria-label="Select network environment">
            <button
              type="button"
              className={clsx(
                feedList.streamNetworkToggle,
                selectedNetworkType === "mainnet" && feedList.streamNetworkToggleActive
              )}
              onClick={() => updateNetworkType("mainnet")}
              aria-pressed={selectedNetworkType === "mainnet"}
            >
              Mainnet
            </button>
            <button
              type="button"
              className={clsx(
                feedList.streamNetworkToggle,
                selectedNetworkType === "testnet" && feedList.streamNetworkToggleActive
              )}
              onClick={() => updateNetworkType("testnet")}
              aria-pressed={selectedNetworkType === "testnet"}
            >
              Testnet
            </button>
          </div>
        </div>
      )}

      {!lockSearch && (
        <div className={feedList.filterDropdown_search} style={{ padding: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
            <input
              type="text"
              placeholder="Search"
              className={feedList.filterDropdown_searchInput}
              value={searchValue}
              onInput={(e) => updateSearch((e.target as HTMLInputElement).value)}
            />
            {searchValue && (
              <button className={clsx(button.secondary, feedList.clearFilterBtn)} onClick={() => updateSearch("")}>
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}

      <table className={tableStyles.networksTable}>
        <thead>
          <tr>
            <th className={tableStyles.networkColumn}>Network</th>
            <th className={tableStyles.environmentColumn}></th>
            <th className={tableStyles.addressColumn}>Verifier Proxy Address</th>
          </tr>
        </thead>
        <tbody>
          {typeof window === "undefined" ? null : filteredNetworks.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "2rem", fontStyle: "italic" }}>
                No results found
              </td>
            </tr>
          ) : (
            filteredNetworks.map((network: NetworkData, index: number) => {
              const statusUrl = getNetworkStatusUrl(network)
              const environmentDetails = network[selectedNetworkType]

              const showMainnet =
                selectedNetworkType === "mainnet" &&
                network.mainnet &&
                (!normalizedSearch ||
                  match(network.network) ||
                  match(network.mainnet.label) ||
                  match(network.isSolana ? network.mainnet.verifierProgramId : network.mainnet.verifierProxy))

              const showTestnet =
                selectedNetworkType === "testnet" &&
                network.testnet &&
                (!normalizedSearch ||
                  match(network.network) ||
                  match(network.testnet.label) ||
                  match(network.isSolana ? network.testnet.verifierProgramId : network.testnet.verifierProxy))

              return (
                <Fragment key={network.network}>
                  {showMainnet && (
                    <tr
                      key={`${network.network}-mainnet`}
                      className={index > 0 ? tableStyles.firstNetworkRow : undefined}
                    >
                      <td className={tableStyles.networkColumn}>
                        <div className={tableStyles.networkInfo}>
                          <img src={network.logoUrl} alt={`${network.network} logo`} />
                          <span>{network.network}</span>
                        </div>
                      </td>
                      <td>
                        {network.mainnet?.label}
                        {network.mainnet?.note && (
                          <div
                            className={tableStyles.note}
                            dangerouslySetInnerHTML={{ __html: network.mainnet.note }}
                          />
                        )}
                      </td>
                      <td className={tableStyles.addressColumn}>
                        {network.isCanton ? (
                          <a href="/data-streams/canton-integration">See Canton integration guide →</a>
                        ) : network.isSolana ? (
                          <>
                            <div>
                              <small className={tableStyles.addressLabel}>Verifier Program ID:</small>
                              <CopyableAddress
                                address={network.mainnet?.verifierProgramId || ""}
                                explorerUrl={network.mainnet?.explorerUrl || ""}
                                network={network}
                                environment="Mainnet"
                              />
                            </div>
                            <div className={tableStyles.mt1}>
                              <small className={tableStyles.addressLabel}>Access Controller:</small>
                              <CopyableAddress
                                address={network.mainnet?.accessController || ""}
                                explorerUrl={network.mainnet?.explorerUrl || ""}
                                network={network}
                                environment="Mainnet"
                              />
                            </div>
                          </>
                        ) : (
                          <CopyableAddress
                            address={network.mainnet?.verifierProxy || ""}
                            explorerUrl={network.mainnet?.explorerUrl || ""}
                            network={network}
                            environment="Mainnet"
                          />
                        )}
                      </td>
                    </tr>
                  )}

                  {showTestnet && (
                    <tr
                      key={`${network.network}-testnet`}
                      className={index > 0 ? tableStyles.firstNetworkRow : tableStyles.testnetRow}
                    >
                      <td className={tableStyles.networkColumn}>
                        <div className={tableStyles.networkInfo}>
                          <img src={network.logoUrl} alt={`${network.network} logo`} />
                          <span>{network.network}</span>
                        </div>
                      </td>
                      <td>
                        {network.testnet?.label}
                        {network.testnet?.note && (
                          <div
                            className={tableStyles.note}
                            dangerouslySetInnerHTML={{ __html: network.testnet.note }}
                          />
                        )}
                      </td>
                      <td className={tableStyles.addressColumn}>
                        {network.isSolana ? (
                          <>
                            <div>
                              <small className={tableStyles.addressLabel}>Verifier Program ID:</small>
                              <CopyableAddress
                                address={network.testnet?.verifierProgramId || ""}
                                explorerUrl={network.testnet?.explorerUrl || ""}
                                network={network}
                                environment="Testnet"
                              />
                            </div>
                            <div className={tableStyles.mt1}>
                              <small className={tableStyles.addressLabel}>Access Controller:</small>
                              <CopyableAddress
                                address={network.testnet?.accessController || ""}
                                explorerUrl={network.testnet?.explorerUrl || ""}
                                network={network}
                                environment="Testnet"
                              />
                            </div>
                          </>
                        ) : (
                          <CopyableAddress
                            address={network.testnet?.verifierProxy || ""}
                            explorerUrl={network.testnet?.explorerUrl || ""}
                            network={network}
                            environment="Testnet"
                          />
                        )}
                      </td>
                    </tr>
                  )}
                  {statusUrl && environmentDetails && (
                    <tr key={`${network.network}-status-explorer`} className={tableStyles.statusRow}>
                      <td colSpan={3} className={tableStyles.statusCell}>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                          <a
                            href={statusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={tableStyles.statusLink}
                          >
                            View {network.network} Network Status →
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </>
  )

  return (
    <div className={tableStyles.compactNetworksTable}>
      <ExpandableTableWrapper
        title="Streams Verifier Network Addresses"
        description="Expand to view supported networks and addresses required for onchain report verification"
        allowExpansion={allowExpansion}
        defaultExpanded={defaultExpanded}
        scrollable={allowExpansion}
      >
        {tableContent}
      </ExpandableTableWrapper>
    </div>
  )
}

export const StreamsTHead = ({ showRiskColumn = true }: { showRiskColumn?: boolean } = {}) => (
  <thead>
    <tr>
      {showRiskColumn && <RiskTHeadCell />}
      <th className={tableStyles.heading}>Stream</th>
      <th>Details</th>
    </tr>
  </thead>
)

const streamsCategoryMap = {
  new_token: {
    text: "New token",
    link: "/data-streams/developer-responsibilities#new-token-data-streams",
  },
}

export const StreamsTr = ({ metadata, isMainnet, showRiskColumn = isMainnet }) => {
  const finalTier = metadata.finalCategory
  const isDeprecating = !!metadata.docs?.shutdownDate
  const hideFeedId = shouldHideStreamFeedId(metadata)

  // Temporary calculated stream detection until proper metadata tagging is implemented
  // TODO: Replace with metadata.docs.isCalculated or similar once available
  const isCalculatedStream =
    metadata.docs?.productTypeCode === "ExRate" &&
    metadata.docs?.attributeType === "ExchangeRate" &&
    metadata.docs?.assetClass === "Tokenized Debt"

  return (
    <tr>
      {showRiskColumn && <RiskCell riskTier={finalTier} product="streams" />}
      <td className={tableStyles.pairCol}>
        <div className={tableStyles.assetPair}>
          <div className={tableStyles.pairNameRow}>
            {metadata.pair[0]}/{metadata.pair[1]}
            {metadata.feedType === "Crypto-DEX" && (
              <a
                href="/data-streams/concepts/dex-state-price-streams"
                target="_blank"
                className={tableStyles.feedVariantBadge}
              >
                DEX State Price
              </a>
            )}
            {metadata.feedType === "Datalink" && (
              <a
                href="/data-streams/stream-ids"
                target="_blank"
                className={tableStyles.feedVariantBadge}
                title="Datalink Stream"
              >
                Datalink
              </a>
            )}
            {isCalculatedStream && (
              <a
                href="/data-streams/concepts/calculated-streams"
                target="_blank"
                className={tableStyles.feedVariantBadge}
                title="Calculated Stream"
              >
                Calculated
              </a>
            )}
          </div>
          {metadata.docs.shutdownDate && (
            <div className={clsx(feedList.shutDate)}>
              <hr />
              <a
                href="/data-streams/deprecating-streams"
                style={{ color: "inherit", textDecoration: "underline dotted" }}
              >
                Deprecating:
              </a>
              <br />
              {metadata.docs.shutdownDate}
            </div>
          )}
        </div>
      </td>
      <td style="width:80%;">
        <div className={tableStyles.assetAddress}>
          {hideFeedId ? (
            <HiddenStreamFeedIdContact className={tableStyles.addressLink} />
          ) : (
            <>
              <span className={tableStyles.streamAddress}>{metadata.feedId}</span>
              <button
                className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                style={{ height: "16px", width: "16px" }}
                data-clipboard-text={metadata.feedId}
                onClick={(e) =>
                  handleClick(e, {
                    product: "STREAMS",
                    action: "feedId_copied",
                    extraInfo1: isMainnet ? "Mainnet" : "Testnet",
                    extraInfo2: metadata.pair[0],
                    extraInfo3: metadata.feedId,
                  })
                }
              >
                <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
              </button>
            </>
          )}
        </div>
        <div>
          <dl className={tableStyles.listContainer}>
            {isMainnet && metadata.docs.clicProductName && metadata.feedType !== "Tokenized Equities" && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Full name:</span>
                </dt>
                <dd>{metadata.docs.clicProductName}</dd>
              </div>
            )}
            {metadata.assetName && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Asset name:</span>
                </dt>
                <dd>{metadata.assetName}</dd>
              </div>
            )}
            {metadata.docs.assetClass ? (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Asset class:</span>
                </dt>
                <dd>
                  {metadata.docs.assetClass}
                  {metadata.docs.assetSubClass &&
                  metadata.docs.assetSubClass !== "Crypto" &&
                  metadata.docs.assetSubClass !== "Equities"
                    ? " - " + metadata.docs.assetSubClass
                    : ""}
                </dd>
              </div>
            ) : null}
            {(() => {
              const assetSubClass = (metadata.docs as any)?.assetSubClass
              const clicProductName = (metadata.docs as any)?.clicProductName || ""

              // Determine the trading hours type from either assetSubClass or clicProductName
              let hoursType = ""
              let timeRange = ""

              if (
                assetSubClass === "Regular Hours" ||
                (clicProductName.includes("RegularHours") &&
                  !clicProductName.includes("ExtendedHours") &&
                  !clicProductName.includes("OvernightHours"))
              ) {
                hoursType = "Regular Hours"
                timeRange = "9:30am–4:00pm Mon–Fri"
              } else if (assetSubClass === "Extended Hours" || clicProductName.includes("ExtendedHours")) {
                hoursType = "Extended Hours"
                timeRange = "4:00am–9:30am & 4:00pm–8:00pm Mon–Fri"
              } else if (assetSubClass === "Overnight Hours" || clicProductName.includes("OvernightHours")) {
                hoursType = "Overnight Hours"
                timeRange = "8:00pm–4:00am Sun evening–Fri morning"
              }

              if (hoursType) {
                return (
                  <div className={tableStyles.definitionGroup}>
                    <dt>
                      <span className="label">Trading hours:</span>
                    </dt>
                    <dd>
                      <a href="/data-streams/market-hours" target="_blank">
                        <strong>{hoursType}</strong> ({timeRange} ET)
                      </a>
                    </dd>
                  </div>
                )
              }
              return null
            })()}
            {metadata.docs.marketHours ? (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Market hours:</span>
                </dt>
                <dd>
                  <a href="/data-streams/market-hours" target="_blank">
                    {metadata.docs.marketHours}
                  </a>
                </dd>
              </div>
            ) : null}
            {streamsCategoryMap[metadata.feedCategory] ? (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Category:</span>
                </dt>
                <dd>
                  <a href={streamsCategoryMap[metadata.feedCategory].link}>
                    {streamsCategoryMap[metadata.feedCategory].text}
                  </a>
                </dd>
              </div>
            ) : null}
            {metadata.decimals ? (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Decimals:</span>
                </dt>
                <dd>{metadata.decimals}</dd>
              </div>
            ) : null}
            {(() => {
              const schemaKey = getSchemaDefinitionKey(metadata)
              const schemaDef = schemaKey ? REPORT_SCHEMA_DEFINITIONS[schemaKey] : undefined
              if (!schemaDef || !schemaKey) return null
              return <SchemaInlineExpander schemaDef={schemaDef} schemaKey={schemaKey} metadata={metadata} />
            })()}
          </dl>
        </div>
      </td>
    </tr>
  )
}

export const MainnetTable = ({
  network,
  showExtraDetails,
  showOnlySVR,
  showOnlyMVRFeeds,
  showOnlyDEXFeeds,
  showOnlyDatalinkFeeds,
  rwaSchemaFilter,
  streamCategoryFilter,
  show24x5Feeds,
  showApacEquitiesFeeds,
  tradingHoursFilter,
  dataFeedType,
  ecosystem,
  selectedFeedCategories,
  firstAddr,
  lastAddr,
  addrPerPage,
  currentPage,
  paginate,
  searchValue,
  tokenizedEquityProvider,
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  showOnlySVR: boolean
  showOnlyMVRFeeds: boolean
  showOnlyDEXFeeds: boolean
  showOnlyDatalinkFeeds?: boolean
  rwaSchemaFilter?: "all" | "v8" | "v11"
  streamCategoryFilter?: "all" | "datalink" | "equities" | "forex"
  show24x5Feeds?: boolean
  showApacEquitiesFeeds?: boolean
  tradingHoursFilter?: "all" | "regular" | "extended" | "overnight"
  dataFeedType: string
  ecosystem: string
  selectedFeedCategories: string[]
  firstAddr: number
  lastAddr: number
  addrPerPage: number
  currentPage: number
  paginate
  searchValue: string
  tokenizedEquityProvider?: string
}) => {
  if (!network.metadata) return null

  const feedTypeFlags = getFeedTypeFlags(dataFeedType, "mainnet")
  const { isStreams, isSmartData, isUSGovernmentMacroeconomicData, isDefaultTable: isDefault } = feedTypeFlags

  const { batchedCategoryData, filteredMetadata, isBatchLoading } = useFilteredFeedMetadata({
    network,
    dataFeedType,
    ecosystem,
    selectedFeedCategories,
    searchValue,
    searchVariant: "mainnet",
    showOnlySVR,
    show24x5Feeds,
    showApacEquitiesFeeds,
    tradingHoursFilter,
    visibilityOptions: {
      showOnlyDEXFeeds,
      showOnlyDatalinkFeeds,
      streamCategoryFilter,
      rwaSchemaFilter,
      showOnlyMVRFeeds,
      tokenizedEquityProvider,
    },
  })

  const slicedFilteredMetadata = filteredMetadata.slice(firstAddr, lastAddr)

  if (isBatchLoading) {
    return <p style="font-style: italic;">Loading...</p>
  }

  return (
    <>
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table} data-show-details={showExtraDetails}>
          {slicedFilteredMetadata.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={isStreams ? 3 : 6} style={{ textAlign: "center" }}>
                  <img
                    src="https://smartcontract.imgix.net/icons/null-search.svg?auto=compress%2Cformat"
                    style={{ height: "160px" }}
                  />
                  <h4>No results found</h4>
                  <p>There are no data feeds in this category at the moment.</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              {isStreams && <StreamsTHead />}
              {isSmartData && <SmartDataTHead showExtraDetails={showExtraDetails} />}
              {(isDefault || isUSGovernmentMacroeconomicData) && (
                <DefaultTHead
                  showExtraDetails={showExtraDetails}
                  networkName={network.name}
                  dataFeedType={dataFeedType}
                />
              )}
              <tbody>
                {slicedFilteredMetadata.map((metadata) => (
                  <>
                    {isStreams && <StreamsTr metadata={metadata} isMainnet />}
                    {isSmartData && (
                      <SmartDataTr
                        network={network}
                        metadata={metadata}
                        showExtraDetails={showExtraDetails}
                        batchedCategoryData={batchedCategoryData}
                      />
                    )}
                    {(isDefault || isUSGovernmentMacroeconomicData) && (
                      <DefaultTr
                        network={network}
                        metadata={metadata}
                        showExtraDetails={showExtraDetails}
                        batchedCategoryData={batchedCategoryData}
                        dataFeedType={dataFeedType}
                      />
                    )}
                  </>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
      {filteredMetadata.length > addrPerPage && (
        <Pagination
          addrPerPage={addrPerPage}
          totalAddr={filteredMetadata.length}
          paginate={paginate}
          currentPage={currentPage}
          firstAddr={firstAddr}
          lastAddr={lastAddr}
        />
      )}
    </>
  )
}

export const TestnetTable = ({
  network,
  showExtraDetails,
  dataFeedType,
  ecosystem = "",
  selectedFeedCategories = [],
  firstAddr = 0,
  lastAddr = 1000,
  addrPerPage = 8,
  currentPage = 1,
  paginate = (_page: number) => {
    /* Default no-op function */
  },
  searchValue = "",
  showOnlyMVRFeeds,
  showOnlyDEXFeeds,
  showOnlyDatalinkFeeds,
  rwaSchemaFilter,
  streamCategoryFilter,
  show24x5Feeds,
  showApacEquitiesFeeds,
  tradingHoursFilter,
  tokenizedEquityProvider,
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  dataFeedType: string
  ecosystem?: string
  selectedFeedCategories?: string[]
  firstAddr?: number
  lastAddr?: number
  addrPerPage?: number
  currentPage?: number
  paginate?: (page: number) => void
  searchValue?: string
  showOnlyMVRFeeds?: boolean
  showOnlyDEXFeeds?: boolean
  showOnlyDatalinkFeeds?: boolean
  rwaSchemaFilter?: "all" | "v8" | "v11"
  streamCategoryFilter?: "all" | "datalink" | "equities" | "forex"
  show24x5Feeds?: boolean
  showApacEquitiesFeeds?: boolean
  tradingHoursFilter?: "all" | "regular" | "extended" | "overnight"
  tokenizedEquityProvider?: string
}) => {
  if (!network.metadata) return null

  const {
    isStreams,
    isSmartData,
    isRates,
    isUSGovernmentMacroeconomicData,
    isDefaultTable: isDefault,
  } = getFeedTypeFlags(dataFeedType, "testnet")

  const { batchedCategoryData, filteredMetadata, isBatchLoading } = useFilteredFeedMetadata({
    network,
    dataFeedType,
    ecosystem,
    selectedFeedCategories,
    searchValue,
    searchVariant: "testnet",
    show24x5Feeds,
    showApacEquitiesFeeds,
    tradingHoursFilter,
    visibilityOptions: {
      showOnlyDEXFeeds,
      showOnlyDatalinkFeeds,
      streamCategoryFilter,
      rwaSchemaFilter,
      showOnlyMVRFeeds,
      tokenizedEquityProvider,
    },
  })

  const slicedFilteredMetadata = filteredMetadata.slice(firstAddr, lastAddr)

  const showRiskColumn = false

  if (isBatchLoading) {
    return <p style="font-style: italic;">Loading...</p>
  }

  return (
    <>
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          {slicedFilteredMetadata.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={getFeedTableColSpan(isStreams, showRiskColumn)} style={{ textAlign: "center" }}>
                  <img
                    src="https://smartcontract.imgix.net/icons/null-search.svg?auto=compress%2Cformat"
                    style={{ height: "160px" }}
                  />
                  <h4>No results found</h4>
                  <p>There are no data feeds in this category at the moment.</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              {isStreams && <StreamsTHead showRiskColumn={showRiskColumn} />}
              {isSmartData && <SmartDataTHead showExtraDetails={showExtraDetails} showRiskColumn={showRiskColumn} />}
              {(isDefault || isUSGovernmentMacroeconomicData) && (
                <DefaultTHead
                  showExtraDetails={showExtraDetails}
                  networkName={network.name}
                  dataFeedType={dataFeedType}
                  showRiskColumn={showRiskColumn}
                />
              )}
              {isRates && (
                <DefaultTHead
                  showExtraDetails={showExtraDetails}
                  networkName={network.name}
                  dataFeedType={dataFeedType}
                  showRiskColumn={showRiskColumn}
                />
              )}
              <tbody>
                {slicedFilteredMetadata.map((metadata) => (
                  <>
                    {isStreams && <StreamsTr metadata={metadata} isMainnet={false} showRiskColumn={showRiskColumn} />}
                    {isSmartData && (
                      <SmartDataTr
                        network={network}
                        metadata={metadata}
                        showExtraDetails={showExtraDetails}
                        batchedCategoryData={batchedCategoryData}
                        showRiskColumn={showRiskColumn}
                      />
                    )}
                    {(isDefault || isUSGovernmentMacroeconomicData) && (
                      <DefaultTr
                        network={network}
                        metadata={metadata}
                        showExtraDetails={showExtraDetails}
                        dataFeedType={dataFeedType}
                        batchedCategoryData={batchedCategoryData}
                        showRiskColumn={showRiskColumn}
                      />
                    )}
                    {isRates && (
                      <DefaultTr
                        network={network}
                        metadata={metadata}
                        showExtraDetails={showExtraDetails}
                        dataFeedType={dataFeedType}
                        batchedCategoryData={batchedCategoryData}
                        showRiskColumn={showRiskColumn}
                      />
                    )}
                  </>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
      <Pagination
        addrPerPage={addrPerPage}
        totalAddr={filteredMetadata.length}
        currentPage={currentPage}
        firstAddr={firstAddr}
        lastAddr={lastAddr}
        paginate={paginate}
      />
    </>
  )
}
