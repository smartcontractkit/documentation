/** @jsxImportSource preact */
import feedList from "./FeedList.module.css"
import { clsx } from "../../../lib"
import { ChainNetwork } from "~/features/data/chains"
import tableStyles from "./Tables.module.css"
import button from "@chainlink/design-system/button.module.css"
import { CheckHeartbeat } from "./pause-notice/CheckHeartbeat"
import { monitoredFeeds, FeedDataItem } from "~/features/data"

const verifierProxies = new Map<string, string>([
  ["0x534a7FF707Bc862cAB0Dda546F1B817Be5235b66", "0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C"],
  ["0xA403a4a521be034B4A0D54019aF469A207094246", "0x2ff010DEbC1297f19579B4246cad07bd24F2488A"],
])

const feedItems = monitoredFeeds.mainnet
const feedCategories = {
  low: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Low Market Risk">
      <a href="/data-feeds/selecting-data-feeds#-low-market-risk-feeds" alt="Low Market Risk" target="_blank">
        🟢
      </a>
    </span>
  ),
  medium: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Medium Market Risk">
      <a href="/data-feeds/selecting-data-feeds#-medium-market-risk-feeds" alt="Medium Market Risk" target="_blank">
        🟡
      </a>
    </span>
  ),
  high: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="High Market Risk">
      <a href="/data-feeds/selecting-data-feeds#-high-market-risk-feeds" alt="High Market Risk" target="_blank">
        🔴
      </a>
    </span>
  ),
  new: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="New Token">
      <a href="/data-feeds/selecting-data-feeds#-new-token-feeds" alt="New Token" target="_blank">
        🟠
      </a>
    </span>
  ),
  custom: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Custom">
      <a href="/data-feeds/selecting-data-feeds#-custom-feeds" alt="Custom" target="_blank">
        🔵
      </a>
    </span>
  ),
  deprecating: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Deprecating">
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
        </dl>
      </div>
    </td>
  </tr>
)

const StreamsTHead = () => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Stream</th>
      <th>Stream info</th>
    </tr>
  </thead>
)

const StreamsTr = ({ network, proxy, showExtraDetails }) => (
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
        >
          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
        </button>
      </div>
      <div className={tableStyles.assetAddress}>
        <span class="label">Verifier proxy address:</span>
        <a
          style="font-size: 0.75em;"
          class={tableStyles.addressLink}
          href={network.explorerUrl.replace("%s", verifierProxies.get(proxy.contractAddress))}
          target="_blank"
        >
          {verifierProxies.get(proxy.contractAddress)}
        </a>
        <button
          class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
          style={{ height: "16px", width: "16px" }}
          data-clipboard-text={verifierProxies.get(proxy.contractAddress)}
        >
          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
        </button>
      </div>
      <div>
        <dl class={tableStyles.porDl}>
          {proxy.docs.productType ? (
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
          )}
          {proxy.docs.assetClass ? (
            <div>
              <dt>
                <span class="label">Asset class:</span>
              </dt>
              <dd>
                {proxy.docs.assetClass}
                {proxy.docs.assetSubClass ? " - " + proxy.docs.assetSubClass : ""}
              </dd>
            </div>
          ) : (
            ""
          )}
          {proxy.docs.quoteAsset ? (
            <div aria-hidden={!showExtraDetails}>
              <dt>
                <span class="label">Quote asset:</span>
              </dt>
              <dd>{proxy.docs.quoteAsset}</dd>
            </div>
          ) : (
            ""
          )}
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
          {proxy.name ? (
            <div>
              <dt>
                <span class="label">Full name:</span>
              </dt>
              <dd>
                <span style="font-size: 0.9em;">{proxy.docs.clicProductName}</span>
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
                    {isStreams && <StreamsTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
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
              {isStreams && <StreamsTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
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
