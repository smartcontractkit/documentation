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
import { type Docs } from "~/features/data/api/index.ts"

const feedItems = monitoredFeeds.mainnet
const feedCategories = {
  low: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Low Market Risk - Feeds that deliver a market price for liquid assets with robust market structure."
    >
      <a href="/data-feeds/selecting-data-feeds#-low-market-risk-feeds" aria-label="Low Market Risk" target="_blank">
        🟢
      </a>
    </span>
  ),
  medium: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Medium Market Risk - Feeds that deliver a market price for assets that show signs of liquidity-related risk or other market structure-related risk."
    >
      <a
        href="/data-feeds/selecting-data-feeds#-medium-market-risk-feeds"
        aria-label="Medium Market Risk"
        target="_blank"
      >
        🟡
      </a>
    </span>
  ),
  high: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="High Market Risk - Feeds that deliver a heightened degree of some of the risk factors associated with Medium Market Risk Feeds, or a separate risk that makes the market price subject to uncertainty or volatile. In using a high market risk data feed you acknowledge that you understand the risks associated with such a feed and that you are solely responsible for monitoring and mitigating such risks."
    >
      <a href="/data-feeds/selecting-data-feeds#-high-market-risk-feeds" aria-label="High Market Risk" target="_blank">
        🔴
      </a>
    </span>
  ),
  new: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="New Token - Tokens without the historical data required to implement a risk assessment framework may be launched in this category. Users must understand the additional market and volatility risks inherent with such assets. Users of New Token Feeds are responsible for independently verifying the liquidity and stability of the assets priced by feeds that they use."
    >
      <a href="/data-feeds/selecting-data-feeds#-new-token-feeds" aria-label="New Token" target="_blank">
        🟠
      </a>
    </span>
  ),
  custom: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Custom - Feeds built to serve a specific use case or rely on external contracts or data sources. These might not be suitable for general use or your use case's risk parameters. Users must evaluate the properties of a feed to make sure it aligns with their intended use case."
    >
      <a href="/data-feeds/selecting-data-feeds#-custom-feeds" aria-label="Custom" target="_blank">
        🔵
      </a>
    </span>
  ),
  deprecating: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Deprecating - These feeds are scheduled for deprecation. See the [Deprecation](/data-feeds/deprecating-feeds) page to learn more."
    >
      <a href="/data-feeds/deprecating-feeds" aria-label="Deprecating" target="_blank">
        ⭕
      </a>
    </span>
  ),
}

const Pagination = ({ addrPerPage, totalAddr, paginate, currentPage, firstAddr, lastAddr }) => {
  const pageNumbers: number[] = []

  for (let i = 1; i <= Math.ceil(totalAddr / addrPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className={tableStyles.pagination}>
      {totalAddr !== 0 && (
        <>
          <button
            className={button.secondary}
            style={"outline-offset: 2px"}
            disabled={currentPage === 1}
            onClick={() => paginate(Number(currentPage) - 1)}
          >
            Prev
          </button>
          <p>
            Showing {firstAddr + 1} to {lastAddr > totalAddr ? totalAddr : lastAddr} of {totalAddr} entries
          </p>
          <button
            className={button.secondary}
            style={"outline-offset: 2px"}
            disabled={lastAddr >= totalAddr}
            onClick={() => paginate(Number(currentPage) + 1)}
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

const DefaultTHead = ({ showExtraDetails, networkName }: { showExtraDetails: boolean; networkName: string }) => {
  const isAptosNetwork = networkName === "Aptos Mainnet" || networkName === "Aptos Testnet"

  return (
    <thead>
      <tr>
        <th className={tableStyles.heading}>Pair</th>
        <th aria-hidden={!showExtraDetails}>Deviation</th>
        <th aria-hidden={!showExtraDetails}>Heartbeat</th>
        <th aria-hidden={!showExtraDetails}>Dec</th>
        <th>{isAptosNetwork ? "Feed ID and info" : "Address and info"}</th>
      </tr>
    </thead>
  )
}

const DefaultTr = ({ network, metadata, showExtraDetails }) => (
  <tr>
    <td className={tableStyles.pairCol}>
      <div className={tableStyles.assetPair}>
        <div className={tableStyles.pairNameRow}>
          {feedCategories[metadata.feedCategory?.toLowerCase()] || ""}
          {metadata.name}
        </div>
        {metadata.secondaryProxyAddress && (
          <div style={{ marginTop: "5px" }}>
            <a
              href="/data-feeds/svr-feeds"
              target="_blank"
              className={tableStyles.feedVariantBadge}
              title="SVR-enabled Feed"
            >
              SVR
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
    <td aria-hidden={!showExtraDetails}>{metadata.threshold ? metadata.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{metadata.heartbeat ? metadata.heartbeat + "s" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{metadata.decimals ? metadata.decimals : "N/A"}</td>
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
          {metadata.feedType && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset type:</span>
              </dt>
              <dd>
                {metadata.feedType}
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
                  <span className="label">AAVE SVR Proxy:</span>
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
              <div className={clsx(tableStyles.aaveCallout)}>
                <strong>⚠️ Aave Dedicated Feed:</strong> This SVR proxy feed is dedicated exclusively for use by the
                Aave protocol. Learn more about{" "}
                <a href="/data-feeds/svr-feeds" target="_blank">
                  SVR-enabled Feeds
                </a>
                .
              </div>
            </>
          )}
        </dl>
      </div>
    </td>
  </tr>
)

const SmartDataTHead = ({ showExtraDetails }: { showExtraDetails: boolean }) => (
  <thead>
    <tr>
      <th className={tableStyles.heading}>SmartData Feed</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address and Info</th>
    </tr>
  </thead>
)

const SmartDataTr = ({ network, metadata, showExtraDetails }) => {
  // Check if this is an MVR feed
  const hasDecoding = Array.isArray(metadata.docs?.decoding) && metadata.docs.decoding.length > 0
  const isMVRFlagSet = metadata.docs?.isMVR === true

  // Only show MVR badge if explicitly flagged as MVR
  const finalIsMVRFeed = isMVRFlagSet && hasDecoding

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
          {feedCategories[metadata.feedCategory?.toLowerCase()] || ""} {metadata.name}
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

      <td aria-hidden={!showExtraDetails}>{metadata.threshold ? metadata.threshold + "%" : "N/A"}</td>
      <td aria-hidden={!showExtraDetails}>{metadata.heartbeat ? metadata.heartbeat : "N/A"}</td>
      <td aria-hidden={!showExtraDetails}>{metadata.decimals ? metadata.decimals : "N/A"}</td>
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

export const StreamsNetworkAddressesTable = () => {
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

  return (
    <div className={tableStyles.compactNetworksTable}>
      <div className={feedList.filterDropdown_search} style={{ padding: "0.5rem" }}>
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

      <table className={tableStyles.networksTable}>
        <thead>
          <tr>
            <th className={tableStyles.networkColumn}>Network</th>
            <th className={tableStyles.environmentColumn}></th>
            <th className={tableStyles.addressColumn}>Verifier Proxy Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredNetworks.map((network: NetworkData, index: number) => {
            const statusUrl = getNetworkStatusUrl(network)
            return (
              <Fragment key={network.network}>
                {network.mainnet &&
                  (!normalizedSearch ||
                    match(network.network) ||
                    match(network.mainnet.label) ||
                    match(network.isSolana ? network.mainnet.verifierProgramId : network.mainnet.verifierProxy)) && (
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

                {network.testnet &&
                  (!normalizedSearch ||
                    match(network.network) ||
                    match(network.testnet.label) ||
                    match(network.isSolana ? network.testnet.verifierProgramId : network.testnet.verifierProxy)) && (
                    <tr
                      key={`${network.network}-testnet`}
                      className={!network.mainnet && index > 0 ? tableStyles.firstNetworkRow : tableStyles.testnetRow}
                    >
                      <td className={tableStyles.networkColumn}>
                        {!network.mainnet && (
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
          })}
        </tbody>
      </table>
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
          {isMainnet && metadata.docs.clicProductName && (
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
                metadata.docs.assetSubClass !== "Forex"
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
          {metadata.feedType === "Crypto" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema" rel="noreferrer" target="_blank">
                  Crypto Schema (v3)
                </a>
              </dd>
            </div>
          )}{" "}
          {metadata.feedType === "Forex" && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Report Schema:</span>
              </dt>
              <dd>
                <a href="/data-streams/reference/report-schema-v4" rel="noreferrer" target="_blank">
                  RWA Schema (v4)
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

  const isStreams = dataFeedType === "streamsCrypto" || dataFeedType === "streamsRwa"
  const isSmartData = dataFeedType === "smartdata"
  const isDefault = !isStreams && !isSmartData
  const isDeprecating = ecosystem === "deprecating"

  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((metadata) => {
      if (showOnlySVR && !metadata.secondaryProxyAddress) {
        return false
      }

      if (isDeprecating) return !!metadata.docs.shutdownDate

      if (dataFeedType === "streamsCrypto") {
        return metadata.contractType === "verifier" && metadata.docs.feedType === "Crypto"
      }

      if (dataFeedType === "streamsRwa") {
        return metadata.contractType === "verifier" && metadata.docs.feedType === "Forex"
      }

      if (isSmartData) {
        if (showOnlyMVRFeeds) {
          return !metadata.docs?.hidden && metadata.docs?.isMVR === true
        }

        return (
          !metadata.docs?.hidden &&
          (metadata.docs.productType === "Proof of Reserve" ||
            metadata.docs.productType === "NAVLink" ||
            metadata.docs.productType === "SmartAUM" ||
            metadata.docs?.isMVR === true)
        )
      }

      // Exclude MVR feeds from default view
      return (
        !metadata.docs.porType &&
        metadata.contractType !== "verifier" &&
        metadata.docs.productType !== "Proof of Reserve" &&
        metadata.docs.productType !== "NAVLink" &&
        metadata.docs.productType !== "SmartAUM"
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
              {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
              <tbody>
                {slicedFilteredMetadata.map((metadata) => (
                  <>
                    {isStreams && <StreamsTr metadata={metadata} isMainnet />}
                    {isSmartData && (
                      <SmartDataTr network={network} metadata={metadata} showExtraDetails={showExtraDetails} />
                    )}
                    {isDefault && (
                      <DefaultTr network={network} metadata={metadata} showExtraDetails={showExtraDetails} />
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
}) => {
  if (!network.metadata) return null

  const isStreams = dataFeedType === "streamsCrypto" || dataFeedType === "streamsRwa"
  const isSmartData = dataFeedType === "smartdata"
  const isRates = dataFeedType === "rates"
  const isDefault = !isSmartData && !isRates && !isStreams

  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((metadata) => {
      if (isStreams) {
        if (dataFeedType === "streamsCrypto") {
          return metadata.contractType === "verifier" && metadata.feedType === "Crypto"
        }

        if (dataFeedType === "streamsRwa") {
          return metadata.contractType === "verifier" && metadata.feedType === "Forex"
        }
      }

      if (isSmartData) {
        if (showOnlyMVRFeeds) {
          return !metadata.docs?.hidden && metadata.docs?.isMVR === true
        }

        // Otherwise, include all SmartData feeds (MVR, PoR, NAVLink, SmartAUM)
        return (
          !metadata.docs?.hidden &&
          (metadata.docs.productType === "Proof of Reserve" ||
            metadata.docs.productType === "NAVLink" ||
            metadata.docs.productType === "SmartAUM" ||
            metadata.docs?.isMVR === true)
        )
      }

      if (isRates)
        return !!(metadata.docs.productType === "Rates" || metadata.docs.productSubType === "Realized Volatility")

      // Exclude MVR feeds from default view
      return (
        !metadata.feedId &&
        !metadata.docs.porType &&
        metadata.docs.productType !== "Rates" &&
        metadata.docs.productSubType !== "Realized Volatility" &&
        metadata.docs.productType !== "Proof of Reserve" &&
        metadata.docs.productType !== "NAVLink" &&
        metadata.docs.productType !== "SmartAUM"
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
              {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
              {isRates && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
              <tbody>
                {slicedFilteredMetadata.map((metadata) => (
                  <>
                    {isStreams && <StreamsTr metadata={metadata} isMainnet={false} />}
                    {isSmartData && (
                      <SmartDataTr network={network} metadata={metadata} showExtraDetails={showExtraDetails} />
                    )}
                    {isDefault && (
                      <DefaultTr network={network} metadata={metadata} showExtraDetails={showExtraDetails} />
                    )}
                    {isRates && <DefaultTr network={network} metadata={metadata} showExtraDetails={showExtraDetails} />}
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
