/** @jsxImportSource preact */
import feedList from "./FeedList.module.css"
import { clsx } from "../../../lib"
import { ChainNetwork } from "~/features/data/chains"
import tableStyles from "./Tables.module.css"
import button from "@chainlink/design-system/button.module.css"
import { CheckHeartbeat } from "./pause-notice/CheckHeartbeat"
import { monitoredFeeds, FeedDataItem } from "~/features/data"

const feedItems = monitoredFeeds.mainnet
const feedCategories = {
  low: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Low Market Risk - Feeds that deliver a market price for liquid assets with robust market structure."
    >
      <a href="/data-feeds/selecting-data-feeds#-low-market-risk-feeds" alt="Low Market Risk" target="_blank">
        🟢
      </a>
    </span>
  ),
  medium: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Medium Market Risk - Feeds that deliver a market price for assets that show signs of liquidity-related risk or other market structure-related risk."
    >
      <a href="/data-feeds/selecting-data-feeds#-medium-market-risk-feeds" alt="Medium Market Risk" target="_blank">
        🟡
      </a>
    </span>
  ),
  high: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="High Market Risk - Feeds that deliver a heightened degree of some of the risk factors associated with Medium Market Risk Feeds, or a separate risk that makes the market price subject to uncertainty or volatile. In using a high market risk data feed you acknowledge that you understand the risks associated with such a feed and that you are solely responsible for monitoring and mitigating such risks."
    >
      <a href="/data-feeds/selecting-data-feeds#-high-market-risk-feeds" alt="High Market Risk" target="_blank">
        🔴
      </a>
    </span>
  ),
  new: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="New Token - Tokens without the historical data required to implement a risk assessment framework may be launched in this category. Users must understand the additional market and volatility risks inherent with such assets. Users of New Token Feeds are responsible for independently verifying the liquidity and stability of the assets priced by feeds that they use."
    >
      <a href="/data-feeds/selecting-data-feeds#-new-token-feeds" alt="New Token" target="_blank">
        🟠
      </a>
    </span>
  ),
  custom: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Custom - Feeds built to serve a specific use case or rely on external contracts or data sources. These might not be suitable for general use or your use case's risk parameters. Users must evaluate the properties of a feed to make sure it aligns with their intended use case."
    >
      <a href="/data-feeds/selecting-data-feeds#-custom-feeds" alt="Custom" target="_blank">
        🔵
      </a>
    </span>
  ),
  deprecating: (
    <span
      className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")}
      title="Deprecating - These feeds are scheduled for deprecation. See the [Deprecation](/data-feeds/deprecating-feeds) page to learn more."
    >
      <a href="/data-feeds/deprecating-feeds" alt="Deprecating" target="_blank">
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
    <div class={tableStyles.pagination}>
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

const DefaultTHead = ({ showExtraDetails }: { showExtraDetails: boolean }) => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Pair</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address and info</th>
    </tr>
  </thead>
)

const DefaultTr = ({ network, proxy, showExtraDetails, isTestnet = false }) => (
  <tr>
    <td class={tableStyles.pairCol}>
      <div className={tableStyles.assetPair}>
        {feedCategories[proxy.docs.feedCategory] || ""}
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
    </td>
    <td aria-hidden={!showExtraDetails}>{proxy.threshold ? proxy.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.heartbeat ? proxy.heartbeat + "s" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.decimals ? proxy.decimals : "N/A"}</td>
    <td>
      <div className={tableStyles.assetAddress}>
        <button
          class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
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
          class={tableStyles.addressLink}
          href={network.explorerUrl.replace("%s", proxy.proxyAddress ?? proxy.transmissionsAccount)}
          target="_blank"
        >
          {proxy.proxyAddress ?? proxy.transmissionsAccount}
        </a>
      </div>
      {!isTestnet && (
        <div>
          <dl class={tableStyles.porDl}>
            {proxy.docs.assetName && (
              <div>
                <dt>
                  <span class="label">Asset name:</span>
                </dt>
                <dd>{proxy.docs.assetName}</dd>
              </div>
            )}
            {proxy.docs.feedType && (
              <div>
                <dt>
                  <span class="label">Asset type:</span>
                </dt>
                <dd>
                  {proxy.docs.feedType}
                  {proxy.docs.assetSubClass === "UK" ? " - " + proxy.docs.assetSubClass : ""}
                </dd>
              </div>
            )}
            {proxy.docs.marketHours && (
              <div>
                <dt>
                  <span class="label">Market hours:</span>
                </dt>
                <dd>
                  <a href="/data-feeds/selecting-data-feeds#market-hours" target="_blank">
                    {proxy.docs.marketHours}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </td>
  </tr>
)

const ProofOfReserveTHead = ({ showExtraDetails }: { showExtraDetails: boolean }) => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Proof of Reserve Feed</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address and Info</th>
    </tr>
  </thead>
)

const ProofOfReserveTr = ({ network, proxy, showExtraDetails }) => (
  <tr>
    <td class={tableStyles.pairCol}>
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
        {feedCategories[proxy.docs.feedCategory] || ""}
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
    </td>

    <td aria-hidden={!showExtraDetails}>{proxy.threshold ? proxy.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.heartbeat ? proxy.heartbeat : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.decimals ? proxy.decimals : "N/A"}</td>
    <td>
      <div className={tableStyles.assetAddress}>
        <a class={tableStyles.addressLink} href={network.explorerUrl.replace("%s", proxy.proxyAddress)} target="_blank">
          {proxy.proxyAddress}
        </a>
        <button
          class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
          style={{ height: "16px", width: "16px" }}
          data-clipboard-text={proxy.proxyAddress}
          onClick={(e) =>
            handleClick(e, {
              product: "FEEDS-POR",
              action: "feedId_copied",
              extraInfo1: network.name,
              extraInfo2: proxy.name,
              extraInfo3: proxy.proxyAddress,
            })
          }
        >
          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
        </button>
      </div>
      <div>
        <dl class={tableStyles.porDl}>
          <div>
            <dt>
              <span class="label">Asset name:</span>
            </dt>
            <dd>{proxy.docs.assetName}</dd>
          </div>
          <div>
            <dt>
              <span class="label">Reserve type:</span>
            </dt>
            <dd>{proxy.docs.porType}</dd>
          </div>
          <div>
            <dt>
              <span class="label">Data source:</span>
            </dt>
            <dd>{proxy.docs.porAuditor}</dd>
          </div>
          <div>
            <dt>
              <span class="label">
                {proxy.docs.porSource === "Third-party" ? "Auditor verification:" : "Reporting:"}
              </span>
            </dt>
            <dd>{proxy.docs.porSource}</dd>
          </div>
          {proxy.docs.issuer ? (
            <div>
              <dt>
                <span class="label">Issuer:</span>
              </dt>
              <dd>{proxy.docs.issuer}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </td>
  </tr>
)

const StreamsNetworksData = [
  {
    network: "Arbitrum",
    logoUrl: "/assets/chains/arbitrum.svg",
    networkStatus: "https://arbiscan.freshstatus.io/",
    mainnet: {
      label: "Arbitrum Mainnet",
      verifierProxy: "0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C",
      explorerUrl: "https://arbiscan.io/address/%s",
    },
    testnet: {
      label: "Arbitrum Sepolia",
      verifierProxy: "0x2ff010DEbC1297f19579B4246cad07bd24F2488A",
      explorerUrl: "https://sepolia.arbiscan.io/address/%s",
    },
  },
  {
    network: "Avalanche",
    logoUrl: "/assets/chains/avalanche.svg",
    networkStatus: "https://status.avax.network/",
    mainnet: {
      label: "Avalanche Mainnet",
      verifierProxy: "0x79BAa65505C6682F16F9b2C7F8afEBb1821BE3f6",
      explorerUrl: "https://snowtrace.io/address/%s",
    },
    testnet: {
      label: "Avalanche Fuji Testnet",
      verifierProxy: "0x2bf612C65f5a4d388E687948bb2CF842FFb8aBB3",
      explorerUrl: "https://testnet.snowtrace.io/address/%s",
    },
  },
  {
    network: "Base",
    logoUrl: "/assets/chains/base.svg",
    networkStatus: "https://basescan.statuspage.io/",
    mainnet: {
      label: "Base Mainnet",
      verifierProxy: "0xDE1A28D87Afd0f546505B28AB50410A5c3a7387a",
      explorerUrl: "https://basescan.org/address/%s",
    },
    testnet: {
      label: "Base Sepolia",
      verifierProxy: "0x8Ac491b7c118a0cdcF048e0f707247fD8C9575f9",
      explorerUrl: "https://sepolia.basescan.org/address/%s",
    },
  },
  {
    network: "Soneium",
    logoUrl: "/assets/chains/soneium.svg",
    testnet: {
      label: "Soneium Minato Testnet",
      verifierProxy: "0x26603bAC5CE09DAE5604700B384658AcA13AD6ae",
      explorerUrl: "https://explorer-testnet.soneium.org/address/%s",
    },
  },
]

export const StreamsVerifierProxyTable = () => {
  return (
    <table class={clsx(feedList.verifierProxyTable, tableStyles.table)}>
      <thead>
        <tr>
          <th>Network</th>
          <th>Verifier proxy address</th>
        </tr>
      </thead>
      <tbody>
        {StreamsNetworksData.map((network) => (
          <tr key={network.network}>
            <td class={tableStyles.pairCol} style={{ textAlign: "center" }}>
              <img src={network.logoUrl} alt={`${network.network} logo`} width={24} height={24} />
              <div className={tableStyles.assetPair}>{network.network}</div>
            </td>
            <td style="width:80%;">
              {network.mainnet && (
                <div className={tableStyles.assetAddress}>
                  <span style="font-size: 0.9em;">{network.mainnet.label}: </span>
                  <a
                    style={{ fontSize: "0.9em" }}
                    class={tableStyles.addressLink}
                    href={network.mainnet.explorerUrl.replace("%s", network.mainnet.verifierProxy)}
                    target="_blank"
                  >
                    {network.mainnet.verifierProxy}
                  </a>
                  <button
                    class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                    data-clipboard-text={network.mainnet.verifierProxy}
                    onClick={(e) =>
                      handleClick(e, {
                        product: "STREAMS",
                        action: "verifierProxyAddress_copied",
                        extraInfo1: "Mainnet",
                        extraInfo2: network.mainnet.label,
                      })
                    }
                  >
                    <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
                  </button>
                </div>
              )}

              <div className={tableStyles.assetAddress}>
                <span style="font-size: 0.9em;">{network.testnet.label}: </span>
                <a
                  style={{ fontSize: "0.9em" }}
                  class={tableStyles.addressLink}
                  href={network.testnet.explorerUrl.replace("%s", network.testnet.verifierProxy)}
                  target="_blank"
                >
                  {network.testnet.verifierProxy}
                </a>
                <button
                  class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                  data-clipboard-text={network.testnet.verifierProxy}
                  onClick={(e) =>
                    handleClick(e, {
                      product: "STREAMS",
                      action: "verifierProxyAddress_copied",
                      extraInfo1: "Testnet",
                      extraInfo2: network.testnet.label,
                    })
                  }
                >
                  <img src="/assets/icons/copyIcon.svg" alt="Copy to clipboard" />
                </button>
              </div>
              {network.networkStatus && (
                <div className={tableStyles.assetAddress}>
                  <span style="font-size: 0.9em; padding-top: 1em;">
                    Track the status of this network at <a href={network.networkStatus}>{network.networkStatus}</a>
                  </span>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const StreamsTHead = () => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Feed</th>
      <th>Details</th>
    </tr>
  </thead>
)

const StreamsTr = ({ proxy, showExtraDetails, isMainnet }) => (
  <tr>
    <td class={tableStyles.pairCol}>
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
        <span class="label">ID:</span>
        {proxy.feedId}
        <button
          class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
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
        <dl class={tableStyles.porDl}>
          {/* {proxy.docs.productType ? (
            <div>
              <dt>
                <span class="label">Data type:</span>
              </dt>
              <dd>
                {proxy.docs.productType}
                {proxy.docs.productSubType ? " - " + proxy.docs.productSubType : ""}
              </dd>
            </div>
          ) : (
            ""
          )} */}
          {isMainnet && proxy.docs.clicProductName ? (
            <div>
              <dt>
                <span class="label">Full name:</span>
              </dt>
              <dd>{proxy.docs.clicProductName}</dd>
            </div>
          ) : (
            ""
          )}
          {proxy.docs.assetName ? (
            <div>
              <dt>
                <span class="label">Asset name:</span>
              </dt>
              <dd>{proxy.docs.assetName}</dd>
            </div>
          ) : (
            ""
          )}
          {proxy.docs.assetClass ? (
            <div>
              <dt>
                <span class="label">Asset class:</span>
              </dt>
              <dd>
                {proxy.docs.assetClass}
                {proxy.docs.assetSubClass && proxy.docs.assetSubClass !== "Crypto"
                  ? " - " + proxy.docs.assetSubClass
                  : ""}
              </dd>
            </div>
          ) : (
            ""
          )}
          {/* {proxy.docs.quoteAsset ? (
            <div aria-hidden={!showExtraDetails}>
              <dt>
                <span class="label">Quote asset:</span>
              </dt>
              <dd>{proxy.docs.quoteAsset}</dd>
            </div>
          ) : (
            ""
          )} */}
          {proxy.docs.marketHours ? (
            <div aria-hidden={!showExtraDetails}>
              <dt>
                <span class="label">Market hours:</span>
              </dt>
              <dd>
                <a href="/data-feeds/selecting-data-feeds#market-hours" target="_blank">
                  {proxy.docs.marketHours}
                </a>
              </dd>
            </div>
          ) : (
            ""
          )}
          {proxy.decimals ? (
            <div>
              <dt>
                <span class="label">Decimals:</span>
              </dt>
              <dd>{proxy.decimals}</dd>
            </div>
          ) : (
            ""
          )}
        </dl>
      </div>
    </td>
  </tr>
)

export const MainnetTable = ({
  network,
  showExtraDetails,
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
  const isStreams = dataFeedType === "streams"
  const isPor = dataFeedType === "por"
  const isDefault = !isPor && !isStreams
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isDeprecating) return !!chain.docs.shutdownDate
      if (isStreams) return chain.contractType === "verifier"
      if (isPor) return !!chain.docs.porType
      return !chain.docs.porType && chain.contractType !== "verifier"
    })
    .filter((chain) => selectedFeedCategories.length === 0 || selectedFeedCategories.includes(chain.feedCategory))
    .filter(
      (pair) =>
        pair.name.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.proxyAddress?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.assetName.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.feedType.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.docs.porType?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.docs.porAuditor
          ?.toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", "")) ||
        pair.docs.porSource?.toLowerCase().replaceAll(" ", "").includes(searchValue.toLowerCase().replaceAll(" ", ""))
    )
  const slicedFilteredMetadata = filteredMetadata.slice(firstAddr, lastAddr)
  return (
    <>
      <div class={tableStyles.tableWrapper}>
        <table class={tableStyles.table}>
          {slicedFilteredMetadata.length === 0 ? (
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
          ) : (
            <>
              {isStreams && <StreamsTHead />}
              {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} />}
              {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} />}
              <tbody>
                {slicedFilteredMetadata.map((proxy) => (
                  <>
                    {isStreams && <StreamsTr proxy={proxy} showExtraDetails={showExtraDetails} isMainnet />}
                    {isPor && <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
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
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  dataFeedType: string
}) => {
  if (!network.metadata) return null

  const isStreams = dataFeedType === "streams"
  const isPor = dataFeedType === "por"
  const isRates = dataFeedType === "rates"
  const isDefault = !isPor && !isRates && !isStreams
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isStreams) return !!chain.contractType
      if (isPor) return !!chain.docs.porType
      if (isRates) return !!(chain.docs.productType === "Rates" || chain.docs.productSubType === "Realized Volatility")
      return (
        !chain.feedId &&
        !chain.docs.porType &&
        chain.docs.productType !== "Rates" &&
        chain.docs.productSubType !== "Realized Volatility"
      )
    })

  return (
    <div class={tableStyles.tableWrapper}>
      <table class={tableStyles.table}>
        {isStreams && <StreamsTHead />}
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} />}
        {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} />}
        {isRates && <DefaultTHead showExtraDetails={showExtraDetails} />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isStreams && <StreamsTr proxy={proxy} showExtraDetails={showExtraDetails} isMainnet={false} />}
              {isPor && <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isDefault && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />}
              {isRates && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
