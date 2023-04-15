/** @jsxImportSource preact */
import h from "preact"
import feedList from "./FeedList.module.css"
import { clsx } from "../../../lib"
import { ChainNetwork } from "../data/chains"
import tableStyles from "./Tables.module.css"

// Feed type definitions
const feedDefs = {
  "price": {
    "productType": [
      "Price",
      "Index"
    ],
    "productSubType": [
      "Reference",
      "Calculated"
    ]
  },
  "por": {
    "productType": [
      "Proof of Reserve"
    ],
  },
  "nftFloor": {
    "productType": [
      "Price"
    ],
    "productSubType": [
      "Floor"
    ],
    "assetSubClass": [
      "NFT"
    ]
  },
  "misc": {
    "productType": [
      "Index",
      "Rates"
    ],
    "productSubType": [
      "IRC",
      "Rvol",
      "Staking"
    ],
    "assetClass": [
      "Index"
    ]
  }
}


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
  const isMisc = dataFeedType === "misc"
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isDeprecating) return !!chain.docs.shutdownDate

      // Price feeds require 
      if (isPrice) return !!(
        feedDefs.price.productType.includes(chain.docs.productType) &&
        feedDefs.price.productSubType.includes(chain.docs.productSubType) &&
        chain.docs.assetClass !== "Index"
        )

      // PoR feeds require only the Proof of Reserve product type
      if (isPor) return !!(
        feedDefs.por.productType.includes(chain.docs.productType)
        )
      
      // NFT Floor price feeds must include all three properties
      if (isNftFloor) return !!(
        feedDefs.nftFloor.productType.includes(chain.docs.productType) &&
        feedDefs.nftFloor.productSubType.includes(chain.docs.productSubType) &&
        feedDefs.nftFloor.assetSubClass.includes(chain.docs.assetSubClass)
        )

      
      if (isMisc) return (
        feedDefs.misc.productType.includes(chain.docs.productType) &&
        feedDefs.misc.productSubType.includes(chain.docs.productSubType) ||
        feedDefs.misc.assetClass.includes(chain.docs.assetClass) ||
        ["Marketcap"].includes(chain.docs.productSubType)
        )
    })
  return (
    <div style={{ overflowX: "auto" }}>
      <table class={tableStyles.table}>
        {isPrice && <PriceTHead showExtraDetails={showExtraDetails} />}
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} />}
        {isNftFloor && <NftFloorTHead showExtraDetails={showExtraDetails} />}
        {isMisc && <MiscTHead showExtraDetails={showExtraDetails} />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isPrice && <PriceTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isPor && <ProofOfReserveTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isNftFloor && <NftFloorTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isMisc && <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
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
  const isMisc = dataFeedType === "misc"
  
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {

      if (isPor) return !!chain.docs.porType
      if (isNftFloor) return !!chain.docs.nftFloorUnits

      if (isMisc) return (
        feedDefs.misc.productType.includes(chain.docs.productType) &&
        feedDefs.misc.productSubType.includes(chain.docs.productSubType)
        )

      return !chain.docs.nftFloorUnits && !chain.docs.porType &&
      !(
        feedDefs.misc.productType.includes(chain.docs.productType) &&
        feedDefs.misc.productSubType.includes(chain.docs.productSubType)
        )
    })

  return (
    <div>
      <table class={tableStyles.table}>
        {isPrice && <PriceTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isPor && <ProofOfReserveTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isNftFloor && <NftFloorTHead showExtraDetails={showExtraDetails} isTestnet />}
        {isMisc && <MiscTHead showExtraDetails={showExtraDetails} isTestnet />}
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
              {isMisc && (
                <MiscTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
