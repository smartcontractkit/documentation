/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { Fragment } from "preact"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { ChainNetwork } from "~/features/data/chains.ts"
import tableStyles from "./Tables.module.css"
import button from "@chainlink/design-system/button.module.css"
import { CheckHeartbeat } from "./pause-notice/CheckHeartbeat.tsx"
import { monitoredFeeds, FeedDataItem } from "~/features/data/index.ts"
import { StreamsNetworksData, type NetworkData } from "../data/StreamsNetworksData.ts"
import { FEED_CATEGORY_CONFIG } from "../../../db/feedCategories.js"
import { useBatchedFeedCategories, getFeedCategoryFromBatch, getNetworkIdentifier } from "./useBatchedFeedCategories.ts"
import { isSharedSVR, isAaveSVR } from "~/features/feeds/utils/svrDetection.ts"
import { ExpandableTableWrapper } from "./ExpandableTableWrapper.tsx"

const feedItems = monitoredFeeds.mainnet

// Render a category icon/link from the config
const getFeedCategoryElement = (riskTier: string | undefined) => {
  if (!riskTier) return ""
  const category = FEED_CATEGORY_CONFIG[riskTier.toLowerCase()]
  if (!category) return ""
  return (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title={category.title}>
      <a href={category.link} aria-label={category.name} target="_blank">
        {category.icon}
      </a>
    </span>
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
}: {
  showExtraDetails: boolean
  networkName: string
  dataFeedType: string
}) => {
  const isAptosNetwork = networkName === "Aptos Mainnet" || networkName === "Aptos Testnet"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"

  return (
    <thead>
      <tr>
        <th className={tableStyles.heading}>{isUSGovernmentMacroeconomicData ? "Feed" : "Pair"}</th>
        <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Deviation</th>
        <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Heartbeat</th>
        <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Dec</th>
        <th>{isAptosNetwork ? "Feed ID and info" : "Address and info"}</th>
      </tr>
    </thead>
  )
}

const DefaultTr = ({ network, metadata, showExtraDetails, batchedCategoryData, dataFeedType }) => {
  // Risk categorization logic
  const contractAddress = metadata.contractAddress || metadata.proxyAddress
  const networkIdentifier = getNetworkIdentifier(network)
  let finalTier =
    contractAddress && batchedCategoryData?.size
      ? (getFeedCategoryFromBatch(batchedCategoryData, contractAddress, networkIdentifier, metadata.feedCategory)
          ?.final ?? metadata.feedCategory)
      : metadata.feedCategory

  // Override with deprecating category if feed has shutdown date
  if (metadata.docs?.shutdownDate) {
    finalTier = "deprecating"
  }

  // US Government Macroeconomic Data logic
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"
  const label = isUSGovernmentMacroeconomicData ? "Category" : "Asset type"
  const value = isUSGovernmentMacroeconomicData
    ? metadata.docs.assetClass === "Macroeconomics"
      ? "U.S. Government Macroeconomic Data Feeds"
      : metadata.docs.assetClass
    : metadata.feedType
  return (
    <tr>
      <td className={tableStyles.pairCol}>
        <div className={tableStyles.assetPair}>
          <div className={tableStyles.pairNameRow}>
            {getFeedCategoryElement(finalTier || undefined)}
            {metadata.name}
          </div>
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
                  </dd>
                </div>
                {isAaveSVR(metadata) && (
                  <div className={clsx(tableStyles.aaveCallout)}>
                    <strong>⚠️ Aave Dedicated Feed:</strong> This SVR proxy feed is dedicated exclusively for use by the
                    Aave protocol. Learn more about{" "}
                    <a href="/data-feeds/svr-feeds#aave-svr-feeds" target="_blank">
                      Aave SVR Feeds
                    </a>
                    .
                  </div>
                )}
                {isSharedSVR(metadata) && (
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

const SmartDataTHead = ({ showExtraDetails }: { showExtraDetails: boolean }) => (
  <thead>
    <tr>
      <th className={tableStyles.heading}>SmartData Feed</th>
      <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Deviation</th>
      <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Heartbeat</th>
      <th style={{ display: showExtraDetails ? "table-cell" : "none" }}>Dec</th>
      <th>Address and Info</th>
    </tr>
  </thead>
)

const SmartDataTr = ({ network, metadata, showExtraDetails, batchedCategoryData }) => {
  // Check if this is an MVR feed
  const hasDecoding = Array.isArray(metadata.docs?.decoding) && metadata.docs.decoding.length > 0
  const isMVRFlagSet = metadata.docs?.isMVR === true

  // Only show MVR badge if explicitly flagged as MVR
  const finalIsMVRFeed = isMVRFlagSet && hasDecoding

  // Resolve final category from batch (fallback to metadata)
  const contractAddress = metadata.contractAddress || metadata.proxyAddress
  const networkIdentifier = getNetworkIdentifier(network)
  let finalTier =
    contractAddress && batchedCategoryData?.size
      ? (getFeedCategoryFromBatch(batchedCategoryData, contractAddress, networkIdentifier, metadata.feedCategory)
          ?.final ?? metadata.feedCategory)
      : metadata.feedCategory

  // Override with deprecating category if feed has shutdown date
  if (metadata.docs?.shutdownDate) {
    finalTier = "deprecating"
  }

  return (
    <tr>
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
        <div className={tableStyles.assetPair}>
          {getFeedCategoryElement(finalTier || undefined)} {metadata.name}
        </div>
        {metadata.docs.shutdownDate && (
          <div className={clsx(feedList.shutDate)}>
            <hr />
            Deprecating:
            <br />
            {metadata.docs.shutdownDate}
          </div>
        )}
        {metadata.docs.productType && (
          <div>
            <dd style={{ marginTop: "5px" }}>{metadata.docs.productType}</dd>
          </div>
        )}
        {finalIsMVRFeed && (
          <div style={{ marginTop: "5px" }}>
            <a
              href="/data-feeds/mvr-feeds"
              className={tableStyles.feedVariantBadge}
              title="Multiple-Variable Response (MVR) Feed"
            >
              MVR
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
        </div>
        <div>
          <dl className={tableStyles.listContainer}>
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset name:</span>
              </dt>
              <dd>{metadata.assetName}</dd>
            </div>
            {metadata.docs.porType && (
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
                <dd>{metadata.docs.porSource}</dd>
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
}: {
  allowExpansion?: boolean
  defaultExpanded?: boolean
} = {}) => {
  const [searchValue, setSearchValue] = useState("")

  const normalizedSearch = searchValue.toLowerCase().replaceAll(" ", "")

  const match = (value?: string) => !!value && value.toLowerCase().replaceAll(" ", "").includes(normalizedSearch)

  const filteredNetworks = StreamsNetworksData.filter((network) => {
    if (!normalizedSearch) return true

    const networkMatch = match(network.network)

    const mainnetLabel = network.mainnet?.label
    const testnetLabel = network.testnet?.label

    const mainnetAddr = network.isSolana ? network.mainnet?.verifierProgramId : network.mainnet?.verifierProxy
    const testnetAddr = network.isSolana ? network.testnet?.verifierProgramId : network.testnet?.verifierProxy

    return networkMatch || match(mainnetLabel) || match(testnetLabel) || match(mainnetAddr) || match(testnetAddr)
  })

  const tableContent = (
    <>
      <div className={feedList.filterDropdown_search} style={{ padding: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
          <input
            type="text"
            placeholder="Search"
            className={feedList.filterDropdown_searchInput}
            value={searchValue}
            onInput={(e) => setSearchValue((e.target as HTMLInputElement).value)}
          />
          {searchValue && (
            <button className={clsx(button.secondary, feedList.clearFilterBtn)} onClick={() => setSearchValue("")}>
              Clear filter
            </button>
          )}
        </div>
      </div>

      <table className={tableStyles.networksTable}>
        <thead>
          <tr>
            <th className={tableStyles.networkColumn}>Network</th>
            <th className={tableStyles.environmentColumn}></th>
            <th className={tableStyles.addressColumn}>Verifier Proxy Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredNetworks.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "2rem", fontStyle: "italic" }}>
                No results found
              </td>
            </tr>
          ) : (
            filteredNetworks.map((network: NetworkData, index: number) => {
              const statusUrl = getNetworkStatusUrl(network)

              const showMainnet =
                network.mainnet &&
                (!normalizedSearch ||
                  match(network.network) ||
                  match(network.mainnet.label) ||
                  match(network.isSolana ? network.mainnet.verifierProgramId : network.mainnet.verifierProxy))

              const showTestnet =
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
                      <td>{network.mainnet.label}</td>
                      <td className={tableStyles.addressColumn}>
                        {network.isSolana ? (
                          <>
                            <div>
                              <small className={tableStyles.addressLabel}>Verifier Program ID:</small>
                              <CopyableAddress
                                address={network?.mainnet?.verifierProgramId}
                                explorerUrl={network?.mainnet?.explorerUrl}
                                network={network}
                                environment="Mainnet"
                              />
                            </div>
                            <div className={tableStyles.mt1}>
                              <small className={tableStyles.addressLabel}>Access Controller:</small>
                              <CopyableAddress
                                address={network?.mainnet?.accessController}
                                explorerUrl={network?.mainnet?.explorerUrl}
                                network={network}
                                environment="Mainnet"
                              />
                            </div>
                          </>
                        ) : (
                          <CopyableAddress
                            address={network.mainnet.verifierProxy}
                            explorerUrl={network.mainnet.explorerUrl}
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
                      className={!showMainnet && index > 0 ? tableStyles.firstNetworkRow : tableStyles.testnetRow}
                    >
                      <td className={tableStyles.networkColumn}>
                        {!showMainnet && (
                          <div className={tableStyles.networkInfo}>
                            <img src={network.logoUrl} alt={`${network.network} logo`} />
                            <span>{network.network}</span>
                          </div>
                        )}
                      </td>
                      <td>{network.testnet.label}</td>
                      <td className={tableStyles.addressColumn}>
                        {network.isSolana ? (
                          <>
                            <div>
                              <small className={tableStyles.addressLabel}>Verifier Program ID:</small>
                              <CopyableAddress
                                address={network?.testnet?.verifierProgramId}
                                explorerUrl={network?.testnet?.explorerUrl}
                                network={network}
                                environment="Testnet"
                              />
                            </div>
                            <div className={tableStyles.mt1}>
                              <small className={tableStyles.addressLabel}>Access Controller:</small>
                              <CopyableAddress
                                address={network?.testnet?.accessController}
                                explorerUrl={network?.testnet?.explorerUrl}
                                network={network}
                                environment="Testnet"
                              />
                            </div>
                          </>
                        ) : (
                          <CopyableAddress
                            address={network.testnet.verifierProxy}
                            explorerUrl={network.testnet.explorerUrl}
                            network={network}
                            environment="Testnet"
                          />
                        )}
                      </td>
                    </tr>
                  )}
                  {statusUrl && (
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

const StreamsTHead = () => (
  <thead>
    <tr>
      <th className={tableStyles.heading}>Stream</th>
      <th>Details</th>
    </tr>
  </thead>
)

const streamsCategoryMap = {
  custom: {
    text: "Custom",
    link: "/data-streams/developer-responsibilities/#custom-data-streams",
  },
  new_token: {
    text: "New token",
    link: "/data-streams/developer-responsibilities#new-token-data-streams",
  },
}

const StreamsTr = ({ metadata, isMainnet }) => (
  <tr>
    <td className={tableStyles.pairCol}>
      <div className={tableStyles.assetPair}>
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
    <td style="width:80%;">
      <div className={tableStyles.assetAddress}>
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
          {metadata.feedType === "Crypto-DEX" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v3-dex" rel="noreferrer" target="_blank">
                  Crypto Schema - DEX (v3)
                </a>
              </dd>
            </div>
          )}
          {metadata.feedType === "Crypto" && metadata.docs?.productTypeCode !== "ExRate" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v3" rel="noreferrer" target="_blank">
                  Crypto Schema (v3)
                </a>
              </dd>
            </div>
          )}
          {(metadata.feedType === "Equities" || metadata.feedType === "Forex") && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v8" rel="noreferrer" target="_blank">
                  RWA Schema (v8)
                </a>
              </dd>
            </div>
          )}
          {metadata.docs?.productTypeCode === "ExRate" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v7" rel="noreferrer" target="_blank">
                  Exchange Rate Schema (v7)
                </a>
              </dd>
            </div>
          )}
          {metadata.feedType === "Net Asset Value" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v9" rel="noreferrer" target="_blank">
                  NAV Schema (v9)
                </a>
              </dd>
            </div>
          )}
          {metadata.feedType === "Tokenized Equities" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v10" rel="noreferrer" target="_blank">
                  Backed xStock Schema (v10)
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </td>
  </tr>
)

export const MainnetTable = ({
  network,
  showExtraDetails,
  showOnlySVR,
  showOnlyMVRFeeds,
  showOnlyDEXFeeds,
  dataFeedType,
  ecosystem,
  selectedFeedCategories,
  firstAddr,
  lastAddr,
  addrPerPage,
  currentPage,
  paginate,
  searchValue,
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  showOnlySVR: boolean
  showOnlyMVRFeeds: boolean
  showOnlyDEXFeeds: boolean
  dataFeedType: string
  ecosystem: string
  selectedFeedCategories: string[]
  firstAddr: number
  lastAddr: number
  addrPerPage: number
  currentPage: number
  paginate
  searchValue: string
}) => {
  if (!network.metadata) return null

  const { data: batchedCategoryData, isLoading: isBatchLoading } = useBatchedFeedCategories(network)

  const isStreams =
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  const isSmartData = dataFeedType === "smartdata"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"
  const isDefault = !isStreams && !isSmartData && !isUSGovernmentMacroeconomicData
  const isDeprecating = ecosystem === "deprecating"

  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1))
    .filter((metadata) => {
      // ---
      // Categorization logic:
      // 1. Try to get the risk category for this feed from Supabase (batchedCategoryData).
      //    - Uses contractAddress and networkIdentifier as lookup keys.
      //    - If found, use the DB value; if not, fall back to the default from metadata.
      // 2. If the risk category is 'hidden', exclude this feed from the docs.
      // ---
      const contractAddress = metadata.contractAddress || metadata.proxyAddress
      const networkIdentifier = getNetworkIdentifier(network)
      let batchCategory = metadata.feedCategory

      if (contractAddress && batchedCategoryData?.size) {
        const categoryResult = getFeedCategoryFromBatch(
          batchedCategoryData,
          contractAddress,
          networkIdentifier,
          metadata.feedCategory
        )
        const finalCategory = categoryResult?.final ?? null

        if (finalCategory) {
          batchCategory = finalCategory
        }
      }

      if (batchCategory === "hidden") return false
      if (showOnlySVR && !metadata.secondaryProxyAddress) {
        return false
      }

      if (isDeprecating) return !!metadata.docs.shutdownDate

      if (dataFeedType === "streamsCrypto") {
        const isValidStreamsFeed =
          metadata.contractType === "verifier" &&
          (metadata.docs.feedType === "Crypto" || metadata.docs.feedType === "Crypto-DEX")

        if (showOnlyDEXFeeds) {
          return isValidStreamsFeed && metadata.docs.feedType === "Crypto-DEX"
        }

        return isValidStreamsFeed
      }
      if (dataFeedType === "streamsRwa") {
        return (
          metadata.contractType === "verifier" &&
          (metadata.docs.feedType === "Equities" || metadata.docs.feedType === "Forex")
        )
      }

      if (dataFeedType === "streamsNav") {
        return metadata.contractType === "verifier" && metadata.docs.feedType === "Net Asset Value"
      }

      if (dataFeedType === "streamsExRate") {
        return metadata.contractType === "verifier" && metadata.docs?.productTypeCode === "ExRate"
      }

      if (dataFeedType === "streamsBacked") {
        return metadata.contractType === "verifier" && metadata.docs.feedType === "Tokenized Equities"
      }

      if (isSmartData) {
        if (showOnlyMVRFeeds) {
          return !metadata.docs?.hidden && metadata.docs?.isMVR === true && metadata.docs?.deliveryChannelCode !== "DS"
        }

        return (
          !metadata.docs?.hidden &&
          metadata.docs?.deliveryChannelCode !== "DS" &&
          (metadata.docs?.productType === "Proof of Reserve" ||
            metadata.docs?.productType === "NAVLink" ||
            metadata.docs?.productType === "SmartAUM" ||
            metadata.docs?.isMVR === true)
        )
      }

      if (isUSGovernmentMacroeconomicData) {
        const isMacro = metadata.docs?.productTypeCode === "RefMacro"
        return isMacro
      }

      // Exclude MVR feeds from default view
      return (
        !metadata.docs.porType &&
        metadata.contractType !== "verifier" &&
        metadata.docs.productType !== "Proof of Reserve" &&
        metadata.docs.productType !== "NAVLink" &&
        metadata.docs.productType !== "SmartAUM" &&
        metadata.docs?.productTypeCode !== "RefMacro"
      )
    })
    .filter((metadata) => {
      if (isSmartData) {
        // Include MVR category in SmartData filter
        if (selectedFeedCategories.includes("MVR") && metadata.docs?.isMVR) {
          return true
        }

        const included =
          selectedFeedCategories.length === 0 ||
          (metadata.docs.productType && selectedFeedCategories.includes(metadata.docs.productType))

        return included
      }
      return (
        selectedFeedCategories.length === 0 ||
        selectedFeedCategories.map((cat) => cat.toLowerCase()).includes(metadata.feedCategory?.toLowerCase())
      )
    })
    .filter(
      (metadata) =>
        metadata.name.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.proxyAddress
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.secondaryProxyAddress
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.assetName.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.feedType.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.docs.porType
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.docs.porAuditor
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.docs.porSource
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        metadata.feedId?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", ""))
    )

  const slicedFilteredMetadata = filteredMetadata.slice(firstAddr, lastAddr)

  return (
    <>
      {isBatchLoading && <p>Loading...</p>}
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table} data-show-details={showExtraDetails}>
          {slicedFilteredMetadata.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={showExtraDetails ? 4 : 2} style={{ textAlign: "center" }}>
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
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  dataFeedType: string
  selectedFeedCategories?: string[]
  firstAddr?: number
  lastAddr?: number
  addrPerPage?: number
  currentPage?: number
  paginate?: (page: number) => void
  searchValue?: string
  showOnlyMVRFeeds?: boolean
  showOnlyDEXFeeds?: boolean
}) => {
  if (!network.metadata) return null

  const { data: batchedCategoryData, isLoading: isBatchLoading } = useBatchedFeedCategories(network)

  const isStreams =
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  const isSmartData = dataFeedType === "smartdata"
  const isRates = dataFeedType === "rates"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"
  const isDefault = !isSmartData && !isRates && !isStreams && !isUSGovernmentMacroeconomicData

  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1))
    .filter((metadata) => {
      // ---
      // Categorization logic:
      // 1. Try to get the risk category for this feed from Supabase (batchedCategoryData).
      //    - Uses contractAddress and networkIdentifier as lookup keys.
      //    - If found, use the DB value; if not, fall back to the default from metadata.
      // 2. If the risk category is 'hidden', exclude this feed from the docs.
      // ---
      const contractAddress = metadata.contractAddress || metadata.proxyAddress
      const networkIdentifier = getNetworkIdentifier(network)
      let batchCategory = metadata.feedCategory

      if (contractAddress && batchedCategoryData?.size) {
        const categoryResult = getFeedCategoryFromBatch(
          batchedCategoryData,
          contractAddress,
          networkIdentifier,
          metadata.feedCategory
        )
        const finalCategory = categoryResult?.final ?? null

        if (finalCategory) {
          batchCategory = finalCategory
        }
      }

      if (batchCategory === "hidden") return false
      if (isStreams) {
        if (dataFeedType === "streamsCrypto") {
          const isValidStreamsFeed =
            metadata.contractType === "verifier" &&
            (metadata.feedType === "Crypto" || metadata.feedType === "Crypto-DEX")

          if (showOnlyDEXFeeds) {
            return isValidStreamsFeed && metadata.feedType === "Crypto-DEX"
          }

          return isValidStreamsFeed
        }

        if (dataFeedType === "streamsRwa") {
          return (
            metadata.contractType === "verifier" &&
            (metadata.docs.feedType === "Equities" || metadata.docs.feedType === "Forex")
          )
        }

        if (dataFeedType === "streamsExRate") {
          return metadata.contractType === "verifier" && metadata.docs?.productTypeCode === "ExRate"
        }

        if (dataFeedType === "streamsNav") {
          return metadata.contractType === "verifier" && metadata.docs.feedType === "Net Asset Value"
        }

        if (dataFeedType === "streamsBacked") {
          return metadata.contractType === "verifier" && metadata.docs.feedType === "Tokenized Equities"
        }
      }

      if (isSmartData) {
        if (showOnlyMVRFeeds) {
          return !metadata.docs?.hidden && metadata.docs?.isMVR === true && metadata.docs?.deliveryChannelCode !== "DS"
        }

        // Otherwise, include all SmartData feeds (MVR, PoR, NAVLink, SmartAUM)
        return (
          !metadata.docs?.hidden &&
          metadata.docs?.deliveryChannelCode !== "DS" &&
          (metadata.docs?.productType === "Proof of Reserve" ||
            metadata.docs?.productType === "NAVLink" ||
            metadata.docs?.productType === "SmartAUM" ||
            metadata.docs?.isMVR === true)
        )
      }

      if (isRates)
        return !!(metadata.docs.productType === "Rates" || metadata.docs.productSubType === "Realized Volatility")

      if (isUSGovernmentMacroeconomicData) {
        return metadata.docs?.productTypeCode === "RefMacro"
      }

      // Exclude MVR feeds from default view
      return (
        !metadata.feedId &&
        !metadata.docs.porType &&
        metadata.docs.productType !== "Rates" &&
        metadata.docs.productSubType !== "Realized Volatility" &&
        metadata.docs.productType !== "Proof of Reserve" &&
        metadata.docs.productType !== "NAVLink" &&
        metadata.docs.productType !== "SmartAUM" &&
        metadata.docs?.productTypeCode !== "RefMacro"
      )
    })
    .filter((metadata) => {
      if (isSmartData) {
        if (selectedFeedCategories.includes("MVR") && metadata.docs?.isMVR) {
          return true
        }

        const included =
          selectedFeedCategories.length === 0 ||
          (metadata.docs.productType && selectedFeedCategories.includes(metadata.docs.productType))

        return included
      }
      return (
        selectedFeedCategories.length === 0 ||
        selectedFeedCategories.map((cat) => cat.toLowerCase()).includes(metadata.feedCategory?.toLowerCase())
      )
    })
    .filter(
      (pair) =>
        !searchValue ||
        pair.name?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.proxyAddress?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.assetName?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.feedType?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.feedId?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", ""))
    )

  const slicedFilteredMetadata = filteredMetadata.slice(firstAddr, lastAddr)

  return (
    <>
      {isBatchLoading && <p>Loading...</p>}
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          {slicedFilteredMetadata.length === 0 ? (
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
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
              {isRates && (
                <DefaultTHead
                  showExtraDetails={showExtraDetails}
                  networkName={network.name}
                  dataFeedType={dataFeedType}
                />
              )}
              <tbody>
                {slicedFilteredMetadata.map((metadata) => (
                  <>
                    {isStreams && <StreamsTr metadata={metadata} isMainnet={false} />}
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
                        dataFeedType={dataFeedType}
                        batchedCategoryData={batchedCategoryData}
                      />
                    )}
                    {isRates && (
                      <DefaultTr
                        network={network}
                        metadata={metadata}
                        showExtraDetails={showExtraDetails}
                        dataFeedType={dataFeedType}
                        batchedCategoryData={batchedCategoryData}
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
