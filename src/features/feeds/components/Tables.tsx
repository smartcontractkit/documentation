/** @jsxImportSource preact */
import feedList from "./FeedList.module.css"
import { clsx } from "../../../lib"
import { ChainNetwork } from "~/features/data/chains"
import tableStyles from "./Tables.module.css"
import { CheckHeartbeat } from "./pause-notice/CheckHeartbeat"
import { monitoredFeeds, FeedDataItem } from "../data"

const feedItems = monitoredFeeds.mainnet
const feedCategories = {
  verified: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Verified">
      <a href="/data-feeds/selecting-data-feeds#-verified-feeds" alt="Verified" target="_blank">
        🟢
      </a>
    </span>
  ),
  monitored: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Monitored">
      <a href="/data-feeds/selecting-data-feeds#-monitored-feeds" alt="Monitored" target="_blank">
        🟡
      </a>
    </span>
  ),
  provisional: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Provisional">
      <a href="/data-feeds/selecting-data-feeds#-provisional-feeds" alt="Provisional" target="_blank">
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
  specialized: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Specialized">
      <a href="/data-feeds/selecting-data-feeds#-specialized-feeds" alt="Specialized" target="_blank">
        ⚫
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

const DefaultTHead = ({ showExtraDetails, isTestnet = false }: { showExtraDetails: boolean; isTestnet?: boolean }) => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Pair</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address</th>
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
          style={{ height: "16px", width: "16px" }}
          data-clipboard-text={proxy.proxyAddress ?? proxy.transmissionsAccount}
        >
          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
        </button>
        <a
          class={tableStyles.addressLink}
          href={network.explorerUrl.replace("%s", proxy.proxyAddress ?? proxy.transmissionsAccount)}
        >
          {proxy.proxyAddress ?? proxy.transmissionsAccount}
        </a>
      </div>
      {!isTestnet ? (
        <div>
          <dl class={tableStyles.porDl}>
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
            {proxy.docs.feedType ? (
              <div>
                <dt>
                  <span class="label">Asset type:</span>
                </dt>
                <dd>
                  {proxy.docs.feedType}
                  {proxy.docs.assetSubClass === "UK" ? " - " + proxy.docs.assetSubClass : ""}
                </dd>
              </div>
            ) : (
              ""
            )}
          </dl>
        </div>
      ) : (
        ""
      )}
    </td>
  </tr>
)

const ProofOfReserveTHead = ({
  showExtraDetails,
  isTestnet = false,
}: {
  showExtraDetails: boolean
  isTestnet?: boolean
}) => (
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

const ProofOfReserveTr = ({ network, proxy, showExtraDetails, isTestnet = false }) => (
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
        <a class={tableStyles.addressLink} href={network.explorerUrl.replace("%s", proxy.proxyAddress)}>
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
              <span class="label">Attestation:</span>
            </dt>
            <dd>{proxy.docs.porSource}</dd>
          </div>
        </dl>
      </div>
    </td>
  </tr>
)

const NftFloorTHead = ({ showExtraDetails, isTestnet = false }: { showExtraDetails: boolean; isTestnet?: boolean }) => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>NFT Floor Pricing Feed</th>
      <th>Price units</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address</th>
    </tr>
  </thead>
)
const NftFloorTr = ({ network, proxy, showExtraDetails, isTestnet = false }) => (
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
    <td>{proxy.docs.nftFloorUnits}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.threshold ? proxy.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.heartbeat ? proxy.heartbeat : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.decimals ? proxy.decimals : "N/A"}</td>
    <td>
      <div className={tableStyles.assetAddress}>
        <button
          class={clsx(tableStyles.copyBtn, "copy-iconbutton")}
          style={{ height: "16px", width: "16px" }}
          data-clipboard-text={proxy.proxyAddress}
        >
          <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
        </button>
        <a class={tableStyles.addressLink} href={network.explorerUrl.replace("%s", proxy.proxyAddress)}>
          {proxy.proxyAddress}
        </a>
      </div>
    </td>
  </tr>
)

export const MainnetTable = ({
  network,
  showExtraDetails,
  dataFeedType,
  ecosystem,
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  dataFeedType: string
  ecosystem: string
}) => {
  if (!network.metadata) return null

  const isDeprecating = ecosystem === "deprecating"
  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isDefault = !isNftFloor && !isPor
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isDeprecating) return !!chain.docs.shutdownDate
      if (isPor) return !!chain.docs.porType
      if (isNftFloor) return !!chain.docs.nftFloorUnits
      return !chain.docs.nftFloorUnits && !chain.docs.porType
    })
  return (
    <div style={{ overflowX: "auto" }}>
      <table class={tableStyles.table}>
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} />}
        {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} />}
        {isNftFloor && <NftFloorTHead showExtraDetails={showExtraDetails} />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isPor && <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isDefault && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isNftFloor && <NftFloorTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
            </>
          ))}
        </tbody>
      </table>
    </div>
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

  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isRates = dataFeedType === "rates"
  const isDefault = !isNftFloor && !isPor && !isRates
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isPor) return !!chain.docs.porType
      if (isNftFloor) return !!chain.docs.nftFloorUnits
      if (isRates) return !!(chain.docs.productType === "Rates" || chain.docs.productSubType === "Realized Volatility")
      return (
        !chain.docs.nftFloorUnits &&
        !chain.docs.porType &&
        chain.docs.productType !== "Rates" &&
        chain.docs.productSubType !== "Realized Volatility"
      )
    })

  return (
    <div>
      <table class={tableStyles.table}>
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isNftFloor && <NftFloorTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isRates && <DefaultTHead showExtraDetails={showExtraDetails} isTestnet />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isPor && (
                <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isDefault && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />}
              {isNftFloor && (
                <NftFloorTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isRates && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
