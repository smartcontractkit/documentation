/** @jsxImportSource preact */
import h from "preact"
import feedList from "./FeedList.module.css"
import { clsx } from "../../../lib"
import { ChainNetwork } from "../data/chains"
import tableStyles from "./Tables.module.css"

const feedCategories = {
  verified: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Verified">
      <a href="/docs/selecting-data-feeds/#🟢-verified-feeds" alt="Verified" target="_blank">
        🟢
      </a>
    </span>
  ),
  monitored: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Monitored">
      <a href="/docs/selecting-data-feeds/#🟡-monitored-feeds" alt="Monitored" target="_blank">
        🟡
      </a>
    </span>
  ),
  custom: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Custom">
      <a href="/docs/selecting-data-feeds/#-custom-feeds" alt="Custom" target="_blank">
        🔵
      </a>
    </span>
  ),
  specialized: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Specialized">
      <a href="/docs/selecting-data-feeds/#-specialized-feeds" alt="Specialized" target="_blank">
        ⚫
      </a>
    </span>
  ),
  deprecating: (
    <span className={clsx(feedList.hoverText, tableStyles.statusIcon, "feed-category")} title="Deprecating">
      <a href="#categories" alt="Deprecating" target="_blank">
        ⭕
      </a>
    </span>
  ),
}

const PriceTHead = ({ showExtraDetails, isTestnet = false }: { showExtraDetails: boolean; isTestnet?: boolean }) => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Pair</th>
      <th aria-hidden={isTestnet}>Asset</th>
      <th aria-hidden={isTestnet}>Type</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address</th>
    </tr>
  </thead>
)

const PriceTr = ({ network, proxy, showExtraDetails, isTestnet = false }) => (
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

    <td aria-hidden={isTestnet}>
      <div className={tableStyles.assetName}>{proxy.docs.assetName}</div>
    </td>
    <td aria-hidden={isTestnet}>{proxy.docs.feedType}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.threshold ? proxy.threshold + "%" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.heartbeat ? proxy.heartbeat + "s" : "N/A"}</td>
    <td aria-hidden={!showExtraDetails}>{proxy.decimals ? proxy.decimals : "N/A"}</td>
    <td>
      {/*
        EVM feeds use proxy.proxyAddress. The proxy.transmissionsAccount is specific to Solana.
      */}
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

const MiscTHead = ({ showExtraDetails, isTestnet = false }: { showExtraDetails: boolean; isTestnet?: boolean }) => (
  <thead>
    <tr>
      <th class={tableStyles.heading}>Misc Feeds</th>
      <th aria-hidden={!showExtraDetails}>Deviation</th>
      <th aria-hidden={!showExtraDetails}>Heartbeat</th>
      <th aria-hidden={!showExtraDetails}>Dec</th>
      <th>Address</th>
    </tr>
  </thead>
)
const MiscTr = ({ network, proxy, showExtraDetails, isTestnet = false }) => (
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
  const isPrice = dataFeedType === "price"
  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isIndex = dataFeedType === "index"
  const isRate = dataFeedType === "rate"
  const isBlockchain = dataFeedType === "blockchain"
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isDeprecating) return !!chain.docs.shutdownDate

      if (isPrice) return !!(
        chain.docs.productType === "Price" &&
        chain.docs.assetSubClass !== "NFT"
        )

      // PoR feeds require only the Proof of Reserve product type
      if (isPor) return !!(
        chain.docs.productType === "Proof of Reserve"
        )
      
      // NFT Floor price feeds must include all three properties
      if (isNftFloor) return !!(
        chain.docs.productType === "Price" &&
        chain.docs.assetSubClass === "NFT"
        )

      if (isIndex) return (
        chain.docs.productType === "Index"
        )
      
      if (isRate) return (
        chain.docs.productType === "Rates"
        )

      if (isBlockchain) return (
        chain.docs.productType === "Blockchain"
        )

    })
  return (
    <div style={{ overflowX: "auto" }}>
      <table class={tableStyles.table}>
        {isPrice && <PriceTHead showExtraDetails={showExtraDetails} />}
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} />}
        {isNftFloor && <NftFloorTHead showExtraDetails={showExtraDetails} />}
        {isIndex && <MiscTHead showExtraDetails={showExtraDetails} />}
        {isRate && <MiscTHead showExtraDetails={showExtraDetails} />}
        {isBlockchain && <MiscTHead showExtraDetails={showExtraDetails} />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isPrice && <PriceTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isPor && <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isNftFloor && <NftFloorTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isIndex && <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isRate && <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isBlockchain && <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
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

  const isPrice = dataFeedType === "price"
  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isIndex = dataFeedType === "index"
  const isRate = dataFeedType === "rate"
  const isBlockchain = dataFeedType === "blockchain"
  
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {

      if (isPrice) return !!(!chain.docs.nftFloorUnits &&
        !chain.docs.porType && 
        chain.docs.productType !== "Index" &&
        chain.docs.productType !== "Rates"
        )

      if (isPor) return !!chain.docs.porType
      
      if (isNftFloor) return chain.docs.nftFloorUnits

      if (isIndex) return (
        chain.docs.productType === "Index" ||
        chain.docs.productType === "Price"
        )
      
      if (isRate) return (
        chain.docs.productType === "Rates"
        )

      if (isBlockchain) return (
        chain.docs.productType === "Blockchain"
        )

    })

  return (
    <div>
      <table class={tableStyles.table}>
        {isPrice && <PriceTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isNftFloor && <NftFloorTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isIndex && <MiscTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isRate && <MiscTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isBlockchain && <MiscTHead showExtraDetails={showExtraDetails} isTestnet />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isPrice && (
                <PriceTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isPor && (
                <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isNftFloor && (
                <NftFloorTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isIndex && (
                <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isRate && (
                <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
              {isBlockchain && (
                <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
