/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { ChainNetwork } from "~/features/data/chains.ts"
import tableStyles from "./Tables.module.css"
import button from "@chainlink/design-system/button.module.css"
import { CheckHeartbeat } from "./pause-notice/CheckHeartbeat.tsx"
import { monitoredFeeds, FeedDataItem } from "~/features/data/index.ts"
import { StreamsNetworksData, type NetworkData } from "../data/StreamsNetworksData.ts"

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

const DefaultTr = ({ network, proxy, showExtraDetails, isTestnet = false }) => (
  <tr>
    <td className={tableStyles.pairCol}>
      <div className={tableStyles.assetPair}>
        <div className={tableStyles.pairNameRow}>
          {feedCategories[proxy.feedCategory] || ""}
          {proxy.name}
        </div>
        {proxy.secondaryProxyAddress && (
          <a href="/data-feeds/svr-feeds" target="_blank" className={tableStyles.svrLabel}>
            SVR
          </a>
        )}
      </div>
      {proxy.docs.shutdownDate && (
        <div className={clsx(feedList.shutDate)}>
          <hr />
          Deprecating:
          <br />
          {proxy.docs.shutdownDate}
        </div>
      )}
    </td>
    <td aria-hidden={!showExtraDetails}>{proxy.threshold ? proxy.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.heartbeat ? proxy.heartbeat + "s" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.decimals ? proxy.decimals : "N/A"}</td>
    <td>
      <div>
        <dl className={tableStyles.listContainer}>
          <div className={tableStyles.definitionGroup}>
            {proxy.secondaryProxyAddress && (
              <dt>
                <span className="label">Standard Proxy:</span>
              </dt>
            )}
            <dd>
              <div className={tableStyles.assetAddress}>
                <button
                  className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                  data-clipboard-text={proxy.proxyAddress ?? proxy.transmissionsAccount}
                  onClick={(e) =>
                    handleClick(e, {
                      product: "FEEDS",
                      action: "feedId_copied",
                      extraInfo1: network.name,
                      extraInfo2: proxy.name,
                      extraInfo3: proxy.proxyAddress,
                    })
                  }
                >
                  <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                </button>
                <a
                  className={tableStyles.addressLink}
                  href={network.explorerUrl.replace("%s", proxy.proxyAddress ?? proxy.transmissionsAccount)}
                  target="_blank"
                >
                  {proxy.proxyAddress ?? proxy.transmissionsAccount}
                </a>
              </div>
            </dd>
          </div>
          {proxy.assetName && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset name:</span>
              </dt>
              <dd>{proxy.assetName}</dd>
            </div>
          )}
          {proxy.feedType && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset type:</span>
              </dt>
              <dd>
                {proxy.feedType}
                {proxy.docs.assetSubClass === "UK" ? " - " + proxy.docs.assetSubClass : ""}
              </dd>
            </div>
          )}
          {proxy.docs.marketHours && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Market hours:</span>
              </dt>
              <dd>
                <a href="/data-feeds/selecting-data-feeds#market-hours" target="_blank">
                  {proxy.docs.marketHours}
                </a>
              </dd>
            </div>
          )}
          {proxy.secondaryProxyAddress && (
            <>
              <div className={tableStyles.separator} />
              <div className={tableStyles.assetAddress}>
                <dt>
                  <span className="label">AAVE SVR Proxy:</span>
                </dt>
                <dd>
                  <button
                    className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                    data-clipboard-text={proxy.secondaryProxyAddress}
                    onClick={(e) =>
                      handleClick(e, {
                        product: "FEEDS",
                        action: "SVR_proxy_copied",
                        extraInfo1: network.name,
                        extraInfo2: proxy.name,
                        extraInfo3: proxy.secondaryProxyAddress,
                      })
                    }
                  >
                    <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                  </button>
                  <a
                    className={tableStyles.addressLink}
                    href={network.explorerUrl.replace("%s", proxy.secondaryProxyAddress)}
                    target="_blank"
                  >
                    {proxy.secondaryProxyAddress}
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

const SmartDataTr = ({ network, proxy, showExtraDetails }) => (
  <tr>
    <td className={tableStyles.pairCol}>
      {feedItems.map((feedItem: FeedDataItem) => {
        const [feedAddress] = Object.keys(feedItem)
        if (feedAddress === proxy.proxyAddress) {
          return (
            <CheckHeartbeat
              feedAddress={proxy.proxyAddress}
              supportedChain="ETHEREUM_MAINNET"
              feedName="TUSD Reserves"
              list
              currencyName={feedItem[feedAddress]}
            />
          )
        }
        return ""
      })}
      <div className={tableStyles.assetPair}>
        {feedCategories[proxy.feedCategory] || ""}
        {proxy.name}
      </div>
      {proxy.docs.shutdownDate && (
        <div className={clsx(feedList.shutDate)}>
          <hr />
          Deprecating:
          <br />
          {proxy.docs.shutdownDate}
        </div>
      )}
      {proxy.docs.productType && (
        <div>
          <dd style={{ marginTop: "5px" }}>{proxy.docs.productType}</dd>
        </div>
      )}
    </td>

    <td aria-hidden={!showExtraDetails}>{proxy.threshold ? proxy.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.heartbeat ? proxy.heartbeat : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.decimals ? proxy.decimals : "N/A"}</td>
    <td>
      <div className={tableStyles.assetAddress}>
        <a
          className={tableStyles.addressLink}
          href={network.explorerUrl.replace("%s", proxy.proxyAddress ?? proxy.transmissionsAccount)}
          target="_blank"
        >
          {proxy.proxyAddress ?? proxy.transmissionsAccount}
        </a>
        <button
          className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
          style={{ height: "16px", width: "16px" }}
          data-clipboard-text={proxy.proxyAddress ?? proxy.transmissionsAccount}
          onClick={(e) =>
            handleClick(e, {
              product: "FEEDS-POR",
              action: "feedId_copied",
              extraInfo1: network.name,
              extraInfo2: proxy.name,
              extraInfo3: proxy.proxyAddress ?? proxy.transmissionsAccount,
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
            <dd>{proxy.assetName}</dd>
          </div>
          {proxy.docs.porType && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Reserve type:</span>
              </dt>
              <dd>{proxy.docs.porType}</dd>
            </div>
          )}
          {proxy.docs.porAuditor && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Data source:</span>
              </dt>
              <dd>{proxy.docs.porAuditor}</dd>
            </div>
          )}
          <div className={tableStyles.definitionGroup}>
            <dt>
              <span className="label">
                {proxy.docs.porSource === "Third-party" ? "Auditor verification:" : "Reporting:"}
              </span>
            </dt>
            <dd>{proxy.docs.porSource}</dd>
          </div>
          {proxy.docs.issuer ? (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Issuer:</span>
              </dt>
              <dd>{proxy.docs.issuer}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </td>
  </tr>
)

export const StreamsNetworkAddressesTable = () => {
  const [activeNetwork, setActiveNetwork] = useState<string | null>(null)

  const toggleNetwork = (network: string) => {
    setActiveNetwork(activeNetwork === network ? null : network)
  }

  return (
    <div className={tableStyles.networksContainer}>
      {StreamsNetworksData.map((network: NetworkData) => (
        <div key={network.network} className={tableStyles.networkCard}>
          <button
            className={clsx(tableStyles.networkHeader, activeNetwork === network.network && tableStyles.active)}
            onClick={() => toggleNetwork(network.network)}
          >
            <div className={tableStyles.networkInfo}>
              <img src={network.logoUrl} alt={`${network.network} logo`} width={32} height={32} />
              <span>{network.network}</span>
            </div>
            <span className={tableStyles.expandIcon}>{activeNetwork === network.network ? "−" : "+"}</span>
          </button>

          {activeNetwork === network.network && (
            <div className={tableStyles.networkDetails}>
              <>
                {network.mainnet && (
                  <div className={tableStyles.networkEnvironment}>
                    <h4>{network.mainnet.label}</h4>
                    {network.isSolana ? (
                      <>
                        <div className={tableStyles.solanaAddress}>
                          <span>Verifier Program ID:</span>
                          <CopyableAddress
                            address={network?.mainnet?.verifierProgramId}
                            explorerUrl={network?.mainnet?.explorerUrl}
                            network={network}
                            environment="Mainnet"
                          />
                        </div>
                        <div className={tableStyles.solanaAddress}>
                          <span>Access Controller Account:</span>
                          <CopyableAddress
                            address={network?.mainnet?.accessController}
                            explorerUrl={network?.mainnet?.explorerUrl}
                            network={network}
                            environment="Mainnet"
                          />
                        </div>
                      </>
                    ) : (
                      <div className={tableStyles.evmAddress}>
                        <span>Verifier Proxy Address:</span>
                        <CopyableAddress
                          address={network.mainnet.verifierProxy}
                          explorerUrl={network.mainnet.explorerUrl}
                          network={network}
                          environment="Mainnet"
                        />
                      </div>
                    )}
                  </div>
                )}

                {network.testnet && (
                  <div className={tableStyles.networkEnvironment}>
                    <h4>{network.testnet.label}</h4>
                    {network.isSolana ? (
                      <>
                        <div className={tableStyles.solanaAddress}>
                          <span>Verifier Program ID:</span>
                          <CopyableAddress
                            address={network?.testnet?.verifierProgramId}
                            explorerUrl={network?.testnet?.explorerUrl}
                            network={network}
                            environment="Testnet"
                          />
                        </div>
                        <div className={tableStyles.solanaAddress}>
                          <span>Access Controller Account:</span>
                          <CopyableAddress
                            address={network?.testnet?.accessController}
                            explorerUrl={network?.testnet?.explorerUrl}
                            network={network}
                            environment="Testnet"
                          />
                        </div>
                      </>
                    ) : (
                      <div className={tableStyles.evmAddress}>
                        <span>Verifier Proxy Address:</span>
                        <CopyableAddress
                          address={network.testnet.verifierProxy}
                          explorerUrl={network.testnet.explorerUrl}
                          network={network}
                          environment="Testnet"
                        />
                      </div>
                    )}
                  </div>
                )}

                {network.networkStatus && (
                  <div className={tableStyles.networkStatus}>
                    <a href={network.networkStatus} target="_blank" rel="noopener noreferrer">
                      View Network Status →
                    </a>
                  </div>
                )}
              </>
            </div>
          )}
        </div>
      ))}
    </div>
  )
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
    <div className={tableStyles.addressContainer}>
      <a
        className={tableStyles.addressLink}
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

const StreamsTr = ({ proxy, isMainnet }) => (
  <tr>
    <td className={tableStyles.pairCol}>
      <div className={tableStyles.assetPair}>
        {proxy.pair[0]}/{proxy.pair[1]}
      </div>
      {proxy.docs.shutdownDate && (
        <div className={clsx(feedList.shutDate)}>
          <hr />
          Deprecating:
          <br />
          {proxy.docs.shutdownDate}
        </div>
      )}
    </td>
    <td style="width:80%;">
      <div className={tableStyles.assetAddress}>
        <span className={tableStyles.streamAddress}>{proxy.feedId}</span>
        <button
          className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
          style={{ height: "16px", width: "16px" }}
          data-clipboard-text={proxy.feedId}
          onClick={(e) =>
            handleClick(e, {
              product: "STREAMS",
              action: "feedId_copied",
              extraInfo1: isMainnet ? "Mainnet" : "Testnet",
              extraInfo2: proxy.pair[0],
              extraInfo3: proxy.feedId,
            })
          }
        >
          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
        </button>
      </div>
      <div>
        <dl className={tableStyles.listContainer}>
          {isMainnet && proxy.docs.clicProductName && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Full name:</span>
              </dt>
              <dd>{proxy.docs.clicProductName}</dd>
            </div>
          )}
          {proxy.assetName && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset name:</span>
              </dt>
              <dd>{proxy.assetName}</dd>
            </div>
          )}
          {proxy.docs.assetClass ? (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset class:</span>
              </dt>
              <dd>
                {proxy.docs.assetClass}
                {proxy.docs.assetSubClass &&
                proxy.docs.assetSubClass !== "Crypto" &&
                proxy.docs.assetSubClass !== "Forex"
                  ? " - " + proxy.docs.assetSubClass
                  : ""}
              </dd>
            </div>
          ) : null}
          {proxy.docs.marketHours ? (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Market hours:</span>
              </dt>
              <dd>
                <a href="/data-streams/market-hours" target="_blank">
                  {proxy.docs.marketHours}
                </a>
              </dd>
            </div>
          ) : null}
          {streamsCategoryMap[proxy.feedCategory] ? (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Category:</span>
              </dt>
              <dd>
                <a href={streamsCategoryMap[proxy.feedCategory].link}>{streamsCategoryMap[proxy.feedCategory].text}</a>
              </dd>
            </div>
          ) : null}
          {proxy.decimals ? (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Decimals:</span>
              </dt>
              <dd>{proxy.decimals}</dd>
            </div>
          ) : null}
          {proxy.feedType === "Crypto" && (
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
          {proxy.feedType === "Forex" && (
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

  const isDeprecating = ecosystem === "deprecating"
  const isStreams = dataFeedType === "streamsCrypto" || dataFeedType === "streamsRwa"
  const isSmartData = dataFeedType === "smartdata"
  const isDefault = !isSmartData && !isStreams
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((metadata: Parameters<typeof DefaultTr>[0]["proxy"]) => {
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
        return (
          metadata.docs.productType === "Proof of Reserve" ||
          metadata.docs.productType === "NAVLink" ||
          metadata.docs.productType === "SmartAUM"
        )
      }

      return (
        !metadata.docs.porType &&
        metadata.contractType !== "verifier" &&
        metadata.docs.productType !== "Proof of Reserve" &&
        metadata.docs.productType !== "NAVLink" &&
        metadata.docs.productType !== "SmartAUM"
      )
    })
    .filter((metadata) => {
      if (isSmartData)
        return (
          selectedFeedCategories.length === 0 ||
          (metadata.docs.productType && selectedFeedCategories.includes(metadata.docs.productType))
        )
      return selectedFeedCategories.length === 0 || selectedFeedCategories.includes(metadata.feedCategory)
    })
    .filter(
      (pair) =>
        pair.name.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.proxyAddress?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.secondaryProxyAddress
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.assetName.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.feedType.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.docs.porType?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.docs.porAuditor
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.docs.porSource
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.feedId?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", ""))
    )
  const slicedFilteredMetadata = filteredMetadata.slice(firstAddr, lastAddr)
  return (
    <>
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table} data-show-details={showExtraDetails}>
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
              <tbody>
                {slicedFilteredMetadata.map((proxy) => (
                  <>
                    {isStreams && <StreamsTr proxy={proxy} isMainnet />}
                    {isSmartData && <SmartDataTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
                    {isDefault && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
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

export const TestnetTable = ({
  network,
  showExtraDetails,
  dataFeedType,
  firstAddr = 0,
  lastAddr = 1000,
  addrPerPage = 8,
  currentPage = 1,
  paginate = (page: number) => {
    /* Default no-op function */
  },
  searchValue = "",
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  dataFeedType: string
  firstAddr?: number
  lastAddr?: number
  addrPerPage?: number
  currentPage?: number
  paginate?: (page: number) => void
  searchValue?: string
}) => {
  if (!network.metadata) return null
  const isStreams = dataFeedType === "streamsCrypto" || dataFeedType === "streamsRwa"
  const isSmartData = dataFeedType === "smartdata"
  const isRates = dataFeedType === "rates"
  const isDefault = !isSmartData && !isRates && !isStreams

  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((proxy) => {
      if (isStreams) {
        if (dataFeedType === "streamsCrypto") {
          return proxy.contractType === "verifier" && proxy.feedType === "Crypto"
        }
        if (dataFeedType === "streamsRwa") {
          return proxy.contractType === "verifier" && proxy.feedType === "Forex"
        }
      }
      if (isSmartData) return !!proxy.docs.porType
      if (isRates) return !!(proxy.docs.productType === "Rates" || proxy.docs.productSubType === "Realized Volatility")

      return (
        !proxy.feedId &&
        !proxy.docs.porType &&
        proxy.docs.productType !== "Rates" &&
        proxy.docs.productSubType !== "Realized Volatility" &&
        proxy.docs.productType !== "Proof of Reserve" &&
        proxy.docs.productType !== "NAVLink" &&
        proxy.docs.productType !== "SmartAUM"
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
          {isStreams && <StreamsTHead />}
          {isSmartData && <SmartDataTHead showExtraDetails={showExtraDetails} />}
          {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
          {isRates && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
          <tbody>
            {slicedFilteredMetadata.length === 0 ? (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={5}>
                  <img
                    src="https://smartcontract.imgix.net/icons/null-search.svg?auto=compress%2Cformat"
                    style={{ height: "160px" }}
                  />
                  <h4>No results found</h4>
                  <p>There are no testnet data feeds in this category at the moment.</p>
                </td>
              </tr>
            ) : (
              slicedFilteredMetadata.map((proxy) => (
                <>
                  {isStreams && <StreamsTr proxy={proxy} isMainnet={false} />}
                  {isSmartData && <SmartDataTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
                  {isDefault && (
                    <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
                  )}
                  {isRates && (
                    <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
                  )}
                </>
              ))
            )}
          </tbody>
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
