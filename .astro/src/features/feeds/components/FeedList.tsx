/** @jsxImportSource preact */
import h from "preact"
import { useEffect, useState } from "preact/hooks"
import { Addresses } from "../types"
import { MainnetTable, TestnetTable } from "./Tables"
import useFetch from "../../../hooks/useFetch"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib"
import button from "@chainlink/design-system/button.module.css"
import { updateTableOfContents } from "~/components/RightSidebar/TableOfContents/tocStore"

const RerenderToc = () => {
  updateTableOfContents()
  return <></>
}
export type DataFeedType = "default" | "por" | "nftFloor"
export const FeedList = ({
  initialNetwork = "ethereum",
  dataFeedType = "default",
  ecosystem = "",
}: {
  initialNetwork: string
  dataFeedType: DataFeedType
  ecosystem?: string
}) => {
  const [path, setPath] = useState<string | undefined>()
  useEffect(() => {
    // no window during SSG build step
    if (!window) return
    setPath(
      window.location.host === "localhost:3000"
        ? "/addresses/addresses.json"
        : window.location.host.includes("chainlinklabs.vercel.app")
        ? "https://raw.githubusercontent.com/smartcontractkit/documentation/addresses-preview/_src/addresses/addresses-preview.json"
        : "https://cl-docs-addresses.web.app/addresses.json"
    )
  }, [])

  const [selectedNetwork, setSelectedNetwork] = useState<string>(initialNetwork)
  const [showExtraDetails, setShowExtraDetails] = useState(false)
  const feeds = useFetch<Addresses>(path)

  function handleNetworkSelect(networkName: string) {
    setSelectedNetwork(networkName)
    window.history.pushState("", "", `/feeds/${networkName}`)
  }

  useEffect(() => {
    // add a delay so that the DOM is updated before we trigger the rerender
    const timeout = setTimeout(() => {
      updateTableOfContents()
    }, 100)

    return () => clearTimeout(timeout)
  }, [feeds, selectedNetwork])

  return (
    <>
      <div className="content">
        <section>
          {ecosystem !== "solana" && (
            <div class={feedList.clChainnavProduct} id="networks-list">
              <div>
                <div>
                  {[
                    {
                      id: "ethereum",
                      img: "/images/logos/ethereum.svg",
                      label: "Ethereum",
                    },
                    {
                      id: "bnb-chain",
                      img: "/images/logos/bnb-chain.svg",
                      label: "BNB Chain",
                    },
                    {
                      id: "polygon",
                      img: "/images/logos/polygon.svg",
                      label: "Polygon (Matic)",
                    },
                    {
                      id: "gnosis-chain",
                      img: "/images/logos/gnosis-chain.svg",
                      label: "Gnosis Chain (xDai)",
                    },
                    {
                      id: "heco-chain",
                      img: "/images/logos/heco.svg",
                      label: "HECO Chain",
                    },
                    {
                      id: "avalanche",
                      img: "/images/logos/avalanche.svg",
                      label: "Avalanche",
                    },
                    {
                      id: "fantom",
                      img: "/images/logos/fantom.svg",
                      label: "Fantom",
                    },
                    {
                      id: "arbitrum",
                      img: "/images/logos/arbitrum.svg",
                      label: "Arbitrum",
                    },
                    {
                      id: "harmony",
                      img: "/images/logos/harmony.svg",
                      label: "Harmony",
                    },
                    {
                      id: "optimism",
                      img: "/images/logos/optimism.svg",
                      label: "Optimism",
                    },
                    {
                      id: "moonriver",
                      img: "/images/logos/moonriver.svg",
                      label: "Moonriver",
                    },
                    {
                      id: "moonbeam",
                      img: "/images/logos/moonbeam.svg",
                      label: "Moonbeam",
                    },
                    {
                      id: "metis",
                      img: "/images/logos/metis.png",
                      label: "Metis",
                    },
                    {
                      id: "klaytn",
                      img: "/images/logos/klaytn.svg",
                      label: "Klaytn",
                    },
                  ].map((chain) => (
                    <button
                      id={chain.id}
                      role="tab"
                      aria-selected={selectedNetwork === chain.id}
                      class={clsx(
                        feedList.networkSwitchButton,
                        button.tertiary
                      )}
                      onClick={() => handleNetworkSelect(chain.id)}
                    >
                      <img src={chain.img} title={chain.label} loading="lazy" />
                      <span>{chain.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(selectedNetwork === "arbitrum" ||
            selectedNetwork === "optimism" ||
            selectedNetwork === "metis") && (
            <p>
              This is an L2 network. As a best practice, use the L2 sequencer
              feed to verify the status of the sequencer when running
              applications on L2 networks. See the{" "}
              <a href="/docs/data-feeds/l2-sequencer-feeds/">
                L2 Sequencer Uptime Feeds
              </a>
              page for examples.
            </p>
          )}

          {feeds.error && <p>There was an error loading the feeds...</p>}
          {!feeds.data && <p>Loading...</p>}
          {feeds.data?.[selectedNetwork]?.networkStatusUrl && (
            <p>
              Track the status of this network at{" "}
              <a href={feeds.data?.[selectedNetwork]?.networkStatusUrl}>
                {feeds.data?.[selectedNetwork]?.networkStatusUrl}
              </a>
            </p>
          )}
          {feeds.data?.[selectedNetwork]?.networks
            ?.filter((value) => value.dataType === dataFeedType)
            .map((network) => (
              <div key={network.name}>
                <h2 id={network.name}>
                  {network.name}{" "}
                  <a className="anchor" href={`#${network.name}`}>
                    <img src="/images/link.svg" alt="Link to this section" />
                  </a>
                </h2>
                <label>
                  <input
                    type="checkbox"
                    className="extra"
                    checked={showExtraDetails}
                    onChange={() => setShowExtraDetails((old) => !old)}
                  />{" "}
                  Show more details
                </label>
                {network.networkType === "mainnet" && (
                  <MainnetTable
                    network={network}
                    showExtraDetails={showExtraDetails}
                    feedType={feeds.data[selectedNetwork].feedType}
                  />
                )}
                {network.networkType !== "mainnet" && (
                  <TestnetTable
                    network={network}
                    showExtraDetails={showExtraDetails}
                    feedType={feeds.data[selectedNetwork].feedType}
                  />
                )}
              </div>
            ))}
        </section>
      </div>
    </>
  )
}
