/** @jsxImportSource preact */
import { useState } from "preact/hooks"
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
      {!isTestnet && (
        <div>
          <dl className={tableStyles.listContainer}>
            {proxy.docs.assetName && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Asset name:</span>
                </dt>
                <dd>{proxy.docs.assetName}</dd>
              </div>
            )}
            {proxy.docs.feedType && (
              <div className={tableStyles.definitionGroup}>
                <dt>
                  <span className="label">Asset type:</span>
                </dt>
                <dd>
                  {proxy.docs.feedType}
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
          </dl>
        </div>
      )}
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
          href={network.explorerUrl.replace("%s", proxy.proxyAddress)}
          target="_blank"
        >
          {proxy.proxyAddress}
        </a>
        <button
          className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
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
        <dl className={tableStyles.listContainer}>
          <div className={tableStyles.definitionGroup}>
            <dt>
              <span className="label">Asset name:</span>
            </dt>
            <dd>{proxy.docs.assetName}</dd>
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
    network: "Botanix",
    logoUrl: "/assets/chains/botanix.svg",
    testnet: {
      label: "Botanix Testnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://testnet.botanixscan.io/address/%s",
    },
  },
  {
    network: "Mantle",
    logoUrl: "/assets/chains/mantle.svg",
    networkStatus: "https://0xmantle.instatus.com",
    mainnet: {
      label: "Mantle Mainnet",
      verifierProxy: "0x223752Eb475098e79d10937480DF93864D7EfB83",
      explorerUrl: "https://mantlescan.xyz/address/%s",
    },
    testnet: {
      label: "Mantle Sepolia Testnet",
      verifierProxy: "0xdc458847982C496E1a5E25D005A332D5a838302B",
      explorerUrl: "https://sepolia.mantlescan.xyz/address/%s",
    },
  },
  {
    network: "opBNB",
    logoUrl: "/assets/chains/opbnb.svg",
    networkStatus: "https://opbnb-status.bnbchain.org/",
    mainnet: {
      label: "opBNB Mainnet",
      verifierProxy: "0x7D543D1a715ED544f7e3Ae9e3b1777BCdA56bF8e",
      explorerUrl: "https://opbnb.bscscan.com/address/%s",
    },
    testnet: {
      label: "opBNB Testnet",
      verifierProxy: "0x001225Aca0efe49Dbb48233aB83a9b4d177b581A",
      explorerUrl: "https://opbnb-testnet.bscscan.com/address/%s",
    },
  },
  {
    network: "Optimism",
    logoUrl: "/assets/chains/optimism.svg",
    networkStatus: "https://status.optimism.io/",
    mainnet: {
      label: "Optimism Mainnet",
      verifierProxy: "0xEBA4789A88C89C18f4657ffBF47B13A3abC7EB8D",
      explorerUrl: "https://optimistic.etherscan.io/address/%s",
    },
    testnet: {
      label: "Optimism Testnet",
      verifierProxy: "0x5f64394a2Ab3AcE9eCC071568Fc552489a8de7AF",
      explorerUrl: "https://sepolia-optimism.etherscan.io/address/%s",
    },
  },
  {
    network: "Scroll",
    logoUrl: "/assets/chains/scroll.svg",
    mainnet: {
      label: "Scroll Mainnet",
      verifierProxy: "0x37e550C9b35DB56F9c943126F1c2642fcbDF7B51",
      explorerUrl: "https://scrollscan.com/address/%s",
    },
    testnet: {
      label: "Scroll Sepolia Testnet",
      verifierProxy: "0xE17A7C6A7c2eF0Cb859578aa1605f8Bc2434A365",
      explorerUrl: "https://sepolia.scrollscan.com/address/%s",
    },
  },
  {
    network: "Shibarium",
    logoUrl: "/assets/chains/shibarium.svg",
    mainnet: {
      label: "Shibarium Mainnet",
      verifierProxy: "0xBE9f07f73de2412A9d0Ed64C42De7d9A10C9F28C",
      explorerUrl: "https://www.shibariumscan.io/address/%s",
    },
    testnet: {
      label: "Shibarium Puppynet",
      verifierProxy: "0xc44eb6c00A0F89D044279cD91Bdfd5f62f752Da3",
      explorerUrl: "https://puppyscan.shib.io/address/%s",
    },
  },
  {
    network: "Soneium",
    logoUrl: "/assets/chains/soneium.svg",
    mainnet: {
      label: "Soneium Mainnet",
      verifierProxy: "0x8760535A80Ac5908096B57A094266866f4aA1A8c",
      explorerUrl: "https://soneium.blockscout.com/address/%s",
    },
    testnet: {
      label: "Soneium Minato Testnet",
      verifierProxy: "0x26603bAC5CE09DAE5604700B384658AcA13AD6ae",
      explorerUrl: "https://soneium-minato.blockscout.com/address/%s",
    },
  },
  {
    network: "Sonic",
    logoUrl: "/assets/chains/sonic.svg",
    mainnet: {
      label: "Sonic Mainnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://sonicscan.org/address/%s",
    },
    testnet: {
      label: "Sonic Blaze Testnet",
      verifierProxy: "0xfBFff08fE4169853F7B1b5Ac67eC10dc8806801d",
      explorerUrl: "https://testnet.sonicscan.org/address/%s",
    },
  },
  {
    network: "Solana",
    logoUrl: "/assets/chains/solana.svg",
    networkStatus: "https://status.solana.com/",
    isSolana: true,
    mainnet: {
      label: "Solana Mainnet",
      verifierProgramId: "Gt9S41PtjR58CbG9JhJ3J6vxesqrNAswbWYbLNTMZA3c",
      accessController: "7mSn5MoBjyRLKoJShgkep8J17ueGG8rYioVAiSg5YWMF",
      explorerUrl: "https://explorer.solana.com/address/%s",
    },
    testnet: {
      label: "Solana Devnet",
      verifierProgramId: "Gt9S41PtjR58CbG9JhJ3J6vxesqrNAswbWYbLNTMZA3c",
      accessController: "2k3DsgwBoqrnvXKVvd7jX7aptNxdcRBdcd5HkYsGgbrb",
      explorerUrl: "https://explorer.solana.com/address/%s?cluster=devnet",
    },
  },
  {
    network: "ZKSync",
    logoUrl: "/assets/chains/zksync.svg",
    networkStatus: "https://uptime.com/statuspage/zkSync",
    mainnet: {
      label: "ZKSync Era Mainnet",
      verifierProxy: "0xcA64d9D1a9AE4C10E94D0D45af9E878fc64dc207",
      explorerUrl: "https://explorer.zksync.io/address/%s",
    },
    testnet: {
      label: "ZKSync Sepolia Testnet",
      verifierProxy: "0xDf37875775d1E777bB413f27de093A62CFF4264b",
      explorerUrl: "https://sepolia.explorer.zksync.io/address/%s",
    },
  },
]

type NetworkDetails = {
  verifierProxy?: string
  verifierProgramId?: string
  accessController?: string
  explorerUrl: string
  label: string
}

type NetworkData = {
  network: string
  logoUrl: string
  networkStatus?: string
  mainnet?: NetworkDetails
  testnet?: NetworkDetails
  message?: string
  isSolana?: boolean
}

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
                            type="verifierProgramId"
                          />
                        </div>
                        <div className={tableStyles.solanaAddress}>
                          <span>Access Controller Account:</span>
                          <CopyableAddress
                            address={network?.mainnet?.accessController}
                            explorerUrl={network?.mainnet?.explorerUrl}
                            network={network}
                            environment="Mainnet"
                            type="accessController"
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
                          type="verifierProxy"
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
                            type="verifierProgramId"
                          />
                        </div>
                        <div className={tableStyles.solanaAddress}>
                          <span>Access Controller Account:</span>
                          <CopyableAddress
                            address={network?.testnet?.accessController}
                            explorerUrl={network?.testnet?.explorerUrl}
                            network={network}
                            environment="Testnet"
                            type="accessController"
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
                          type="verifierProxy"
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
  type,
}: {
  address?: string
  explorerUrl: string
  network: NetworkData
  environment: string
  type: string
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
          {proxy.docs.assetName && (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Asset name:</span>
              </dt>
              <dd>{proxy.docs.assetName}</dd>
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
          {streamsCategoryMap[proxy.docs.feedCategory] ? (
            <div className={tableStyles.definitionGroup}>
              <dt>
                <span className="label">Category:</span>
              </dt>
              <dd>
                <a href={streamsCategoryMap[proxy.docs.feedCategory].link}>
                  {streamsCategoryMap[proxy.docs.feedCategory].text}
                </a>
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
          {proxy.docs.feedType === "Crypto" && (
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
          {proxy.docs.feedType === "Forex" && (
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
  const isStreams = dataFeedType === "streamsCrypto" || dataFeedType === "streamsRwa"
  const isSmartData = dataFeedType === "smartdata"
  const isDefault = !isSmartData && !isStreams
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isDeprecating) return !!chain.docs.shutdownDate

      if (dataFeedType === "streamsCrypto") {
        return chain.contractType === "verifier" && chain.docs.feedType === "Crypto"
      }

      if (dataFeedType === "streamsRwa") {
        return chain.contractType === "verifier" && chain.docs.feedType === "Forex"
      }

      if (isSmartData) {
        return (
          chain.docs.productType === "Proof of Reserve" ||
          chain.docs.productType === "NAVLink" ||
          chain.docs.productType === "SmartAUM"
        )
      }

      return (
        !chain.docs.porType &&
        chain.contractType !== "verifier" &&
        chain.docs.productType !== "Proof of Reserve" &&
        chain.docs.productType !== "NAVLink" &&
        chain.docs.productType !== "SmartAUM"
      )
    })
    .filter((chain) => {
      if (isSmartData)
        return (
          selectedFeedCategories.length === 0 ||
          (chain.docs.productType && selectedFeedCategories.includes(chain.docs.productType))
        )
      return selectedFeedCategories.length === 0 || selectedFeedCategories.includes(chain.feedCategory)
    })
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
}: {
  network: ChainNetwork
  showExtraDetails: boolean
  dataFeedType: string
}) => {
  if (!network.metadata) return null
  const isStreams = dataFeedType === "streamsCrypto" || dataFeedType === "streamsRwa"
  const isSmartData = dataFeedType === "smartdata"
  const isRates = dataFeedType === "rates"
  const isDefault = !isSmartData && !isRates && !isStreams
  const filteredMetadata = network.metadata
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter((chain) => {
      if (isStreams) {
        if (dataFeedType === "streamsCrypto") {
          return chain.contractType === "verifier" && chain.docs.feedType === "Crypto"
        }
        if (dataFeedType === "streamsRwa") {
          return chain.contractType === "verifier" && chain.docs.feedType === "Forex"
        }
      }
      if (isSmartData) return !!chain.docs.porType
      if (isRates) return !!(chain.docs.productType === "Rates" || chain.docs.productSubType === "Realized Volatility")

      return (
        !chain.feedId &&
        !chain.docs.porType &&
        chain.docs.productType !== "Rates" &&
        chain.docs.productSubType !== "Realized Volatility" &&
        chain.docs.productType !== "Proof of Reserve" &&
        chain.docs.productType !== "NAVLink" &&
        chain.docs.productType !== "SmartAUM"
      )
    })

  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        {isStreams && <StreamsTHead />}
        {isSmartData && <SmartDataTHead showExtraDetails={showExtraDetails} />}
        {isDefault && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
        {isRates && <DefaultTHead showExtraDetails={showExtraDetails} networkName={network.name} />}
        <tbody>
          {filteredMetadata.map((proxy) => (
            <>
              {isStreams && <StreamsTr proxy={proxy} isMainnet={false} />}
              {isSmartData && <SmartDataTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} />}
              {isDefault && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />}
              {isRates && <DefaultTr network={network} proxy={proxy} showExtraDetails={showExtraDetails} isTestnet />}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
