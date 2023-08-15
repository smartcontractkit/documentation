/** @jsxImportSource preact */
import { useEffect, useState, useRef } from "preact/hooks"
import { MainnetTable, TestnetTable } from "./Tables"
import feedList from "./FeedList.module.css"
import { clsx } from "~/lib"
import { updateTableOfContents } from "~/components/RightSidebar/TableOfContents/tocStore"
import { Chain, CHAINS, ALL_CHAINS } from "~/features/data/chains"
import { useGetChainMetadata } from "./useGetChainMetadata"
import { ChainMetadata } from "../../data/api"
import useQueryString from "~/hooks/useQueryString"
import { RefObject } from "preact"

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
  const [searchValue, setSearchValue] = useQueryString("search", "")
  const [selectedFeedCategories, setSelectedFeedCategories] = useQueryString("categories", [])
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState<boolean>(false)
  const [showExtraDetails, setShowExtraDetails] = useState(false)
  const [currentPage, setCurrentPage] = useQueryString("page", 1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const addrPerPage = 8
  const lastAddr = currentPage * addrPerPage
  const firstAddr = lastAddr - addrPerPage
  const dataFeedCategory = ["verified", "monitored", "provisional", "custom", "specialized", "deprecating"]
  const chainMetadata = useGetChainMetadata(chains.filter((chain) => chain.page === selectedChain)[0], { initialCache })
  const wrapperRef = useRef(null)

  function handleNetworkSelect(chain: Chain) {
    setSelectedChain(chain.page)
    setSearchValue("")
    setSelectedFeedCategories([])
    setCurrentPage(1)
  }

  const handleCategorySelection = (category) => {
    paginate(1)
    if (typeof selectedFeedCategories === "string" && selectedFeedCategories !== category) {
      setSelectedFeedCategories([selectedFeedCategories, category])
    } else if (typeof selectedFeedCategories === "string" && selectedFeedCategories === category) {
      setSelectedFeedCategories([])
    }
    if (Array.isArray(selectedFeedCategories) && selectedFeedCategories.includes(category)) {
      setSelectedFeedCategories(selectedFeedCategories.filter((item) => item !== category))
    } else if (Array.isArray(selectedFeedCategories)) {
      setSelectedFeedCategories([...selectedFeedCategories, category])
    }
  }

  useEffect(() => {
    updateTableOfContents()
    if (searchValue === "") {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.delete("search")
      const newUrl = window.location.pathname + "?" + searchParams.toString()
      window.history.replaceState({ path: newUrl }, "", newUrl)
      const inputElement = document.getElementById("search") as HTMLInputElement
      if (inputElement) {
        inputElement.placeholder = "Search price feeds"
      }
    }
  }, [chainMetadata.processedData, searchValue])

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
          setShowCategoriesDropdown(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }
  useOutsideAlerter(wrapperRef)
  const isPor = dataFeedType === "por"
  const isNftFloor = dataFeedType === "nftFloor"
  const isRates = dataFeedType === "rates"
  const isDeprecating = ecosystem === "deprecating"
  let netCount = 0

  return (
    <>
      <div className="content" style={{ marginTop: "var(--space-4x)" }}>
        <section>
          {!isDeprecating && (
            <div class={feedList.clChainnavProduct} id="networks-list">
              <div>
                <div role="tablist">
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
              </div>
            </div>
          )}

          {chainMetadata.processedData?.networkStatusUrl && !isDeprecating && (
            <p>
              Track the status of this network at{" "}
              <a href={chainMetadata.processedData?.networkStatusUrl}>
                {chainMetadata.processedData?.networkStatusUrl}
              </a>
            </p>
          )}

          {chainMetadata.error && <p>There was an error loading the feeds...</p>}

          {chainMetadata.loading && !chainMetadata.processedData && <p>Loading...</p>}

          {chainMetadata.processedData?.networks
            .filter((network) => {
              if (isDeprecating) {
                let foundDeprecated = false
                network.metadata?.forEach((feed) => {
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
            .map((network) => (
              <>
                {network.networkType === "mainnet" ? (
                  <div key={network.name}>
                    <h2 id={network.name}>
                      {network.name}{" "}
                      <a className="anchor" href={`#${network.name}`}>
                        <img src="/images/link.svg" alt="Link to this section" />
                      </a>
                    </h2>
                    {(selectedChain === "arbitrum" || selectedChain === "optimism" || selectedChain === "metis") && (
                      <p>
                        {network.name} is an L2 network. As a best practice, use the L2 sequencer feed to verify the
                        status of the sequencer when running applications on L2 networks. See the{" "}
                        <a href="/docs/data-feeds/l2-sequencer-feeds/">L2 Sequencer Uptime Feeds</a> page for examples.
                      </p>
                    )}

                    <details class={feedList.filterDropdown_details}>
                      <summary
                        class={feedList.filterDropdown_details}
                        className="text-200"
                        onClick={() => setShowCategoriesDropdown((prev) => !prev)}
                      >
                        Data Feed Categories
                      </summary>
                      <nav ref={wrapperRef} style={!showCategoriesDropdown ? { display: "none" } : {}}>
                        <ul>
                          {dataFeedCategory.map((category) => (
                            <li>
                              <button onClick={() => handleCategorySelection(category)}>
                                <input
                                  type="checkbox"
                                  checked={selectedFeedCategories.includes(category)}
                                  readonly
                                  style="cursor:pointer;"
                                />
                                <span> {category}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </details>

                    <div class={feedList.filterDropdown_search}>
                      <input
                        id="search"
                        class={feedList.filterDropdown_searchInput}
                        placeholder="Search price feeds"
                        onInput={(event) => {
                          setSearchValue((event.target as HTMLInputElement).value)
                          setCurrentPage(1)
                        }}
                      />
                    </div>
                    <label class={feedList.detailsLabel}>
                      <input
                        type="checkbox"
                        style="width:15px;height:15px;display:inline;"
                        checked={showExtraDetails}
                        onChange={() => setShowExtraDetails((old) => !old)}
                      />{" "}
                      Show more details
                    </label>
                    <MainnetTable
                      selectedFeedCategories={selectedFeedCategories}
                      network={network}
                      showExtraDetails={showExtraDetails}
                      dataFeedType={dataFeedType}
                      ecosystem={ecosystem}
                      lastAddr={lastAddr}
                      firstAddr={firstAddr}
                      addrPerPage={addrPerPage}
                      currentPage={currentPage}
                      paginate={paginate}
                      searchValue={searchValue}
                    />
                  </div>
                ) : (
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
                        style="width:15px;height:15px;display:inline;"
                        checked={showExtraDetails}
                        onChange={() => setShowExtraDetails((old) => !old)}
                      />{" "}
                      Show more details
                    </label>
                    <TestnetTable network={network} showExtraDetails={showExtraDetails} dataFeedType={dataFeedType} />
                  </div>
                )}
              </>
            ))}
          {isDeprecating && netCount === 0 && (
            <div>
              <strong>No data feeds are scheduled for deprecation at this time.</strong>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
