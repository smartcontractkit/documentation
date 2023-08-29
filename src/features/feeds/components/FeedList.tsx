/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks"
import { MainnetTable, TestnetTable } from "./Tables"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib"
import { Chain, CHAINS, ALL_CHAINS, ChainNetwork } from "~/features/data/chains"
import { useGetChainMetadata } from "./useGetChainMetadata"
import { ChainMetadata } from "../../data/api"
import useQueryString from "~/hooks/useQueryString"
import { updateContentObserver } from "~/components/PageContent/ContentObserver/coStore"

export type DataFeedType = "default" | "por" | "nftFloor" | "rates"
export const FeedList = ({
  dataFeedType = "default",
  ecosystem = "",
  initialCache,
}: {
  initialNetwork: string
  dataFeedType: DataFeedType
  ecosystem?: string
  initialCache?: Record<string, ChainMetadata>
}) => {
  const chains = ecosystem === "deprecating" ? ALL_CHAINS : CHAINS

  const [selectedChain, setSelectedChain] = useQueryString("network", chains[0].page)
  const [showExtraDetails, setShowExtraDetails] = useState(false)

  const chain = chains.filter((chain) => chain.page === selectedChain)[0]
  const chainMetadata = useGetChainMetadata(chain, initialCache && initialCache[chain.page])

  function handleNetworkSelect(chain: Chain) {
    setSelectedChain(chain.page)
  }

  useEffect(() => {
    if (chainMetadata.processedData) {
      updateContentObserver()
    }
  }, [chainMetadata.processedData])

  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isRates = dataFeedType === "rates"
  const isDeprecating = ecosystem === "deprecating"
  let netCount = 0
  const id = "network-list"

  return (
    <section id={id}>
      {!isDeprecating && (
        <>
          <h2 id={id}>Networks</h2>
          <section id={id}>
            <div class={feedList.clChainnavProduct} role="tablist">
              {chains
                .filter((chain) => {
                  if (isPor) return chain.tags?.includes("proofOfReserve")

                  if (isNftFloor) return chain.tags?.includes("nftFloorPrice")

                  if (isRates) return chain.tags?.includes("rates")

                  return chain.tags?.includes("default")
                })
                .map((chain) => (
                  <button
                    key={chain.page}
                    id={chain.page}
                    role="tab"
                    aria-selected={selectedChain === chain.page}
                    class={clsx(feedList.networkSwitchButton)}
                    onClick={() => handleNetworkSelect(chain)}
                  >
                    <img src={chain.img} title={chain.label} loading="lazy" width={32} height={32} />
                    <span>{chain.label}</span>
                  </button>
                ))}
            </div>
            {chainMetadata.processedData?.networkStatusUrl && !isDeprecating && (
              <p>
                Track the status of this network at{" "}
                <a href={chainMetadata.processedData?.networkStatusUrl}>
                  {chainMetadata.processedData?.networkStatusUrl}
                </a>
              </p>
            )}
          </section>
        </>
      )}

      {chainMetadata.error && <p>There was an error loading the feeds...</p>}

      {chainMetadata.loading && !chainMetadata.processedData && <p>Loading...</p>}

      {chainMetadata.processedData?.networks
        .filter((network: { metadata: any[]; tags: string | string[] }) => {
          if (isDeprecating) {
            let foundDeprecated = false
            network.metadata?.forEach((feed: { docs: { shutdownDate: any } }) => {
              if (feed.docs?.shutdownDate) {
                foundDeprecated = true
                netCount++
              }
            })
            return foundDeprecated
          }

          if (isPor) return network.tags?.includes("proofOfReserve")

          if (isNftFloor) return network.tags?.includes("nftFloorPrice")

          if (isRates) return network.tags?.includes("rates")

          return true
        })
        .map((network: ChainNetwork) => (
          <section key={network.name} id={network.name}>
            {network.networkType === "mainnet" ? (
              <>
                <h3 id={network.name}>
                  {network.name}{" "}
                  <a className="anchor" href={`#${network.name}`}>
                    <img src="/images/link.svg" alt="Link to this section" />
                  </a>
                </h3>
                {(selectedChain === "arbitrum" || selectedChain === "optimism" || selectedChain === "metis") && (
                  <p>
                    {network.name} is an L2 network. As a best practice, use the L2 sequencer feed to verify the status
                    of the sequencer when running applications on L2 networks. See the{" "}
                    <a href="/docs/data-feeds/l2-sequencer-feeds/">L2 Sequencer Uptime Feeds</a> page for examples.
                  </p>
                )}
                <label>
                  <input
                    type="checkbox"
                    style="width:15px;height:15px;display:inline;"
                    checked={showExtraDetails}
                    onChange={() => setShowExtraDetails((old) => !old)}
                  />{" "}
                  Show more details
                </label>
                <MainnetTable
                  network={network}
                  showExtraDetails={showExtraDetails}
                  dataFeedType={dataFeedType}
                  ecosystem={ecosystem}
                />
              </>
            ) : (
              <>
                <h3 id={network.name}>
                  {network.name}{" "}
                  <a className="anchor" href={`#${network.name}`}>
                    <img src="/images/link.svg" alt="Link to this section" />
                  </a>
                </h3>
                <label>
                  <input
                    type="checkbox"
                    style="width:15px;height:15px;display:inline;"
                    checked={showExtraDetails}
                    onChange={() => setShowExtraDetails((old) => !old)}
                  />{" "}
                  Show more details
                </label>
                <TestnetTable network={network} showExtraDetails={showExtraDetails} dataFeedType={dataFeedType} />
              </>
            )}
          </section>
        ))}
      {isDeprecating && netCount === 0 && (
        <div>
          <strong>No data feeds are scheduled for deprecation at this time.</strong>
        </div>
      )}
    </section>
  )
}
