/** @jsxImportSource preact */
import { useEffect, useState, useRef } from "preact/hooks"
import { MainnetTable, TestnetTable, StreamsNetworkAddressesTable } from "./Tables.tsx"
import feedList from "./FeedList.module.css"
import tableStyles from "./Tables.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { Chain, CHAINS, ALL_CHAINS, ChainNetwork } from "~/features/data/chains.ts"
import { useGetChainMetadata } from "./useGetChainMetadata.ts"
import { ChainMetadata } from "~/features/data/api/index.ts"
import useQueryString from "~/hooks/useQueryString.ts"
import { RefObject } from "preact"
import { getFeedCategories } from "../../../db/feedCategories.js"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper.tsx"
import button from "@chainlink/design-system/button.module.css"
import { updateTableOfContents } from "~/components/TableOfContents/tocStore.ts"
import alertIcon from "../../../components/Alert/Assets/alert-icon.svg"

export type DataFeedType =
  | "default"
  | "smartdata"
  | "rates"
  | "usGovernmentMacroeconomicData"
  | "streamsCrypto"
  | "streamsRwa"
  | "streamsNav"
  | "streamsExRate"
  | "streamsBacked"
export const FeedList = ({
  initialNetwork,
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
  const isStreams =
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  const isSmartData = dataFeedType === "smartdata"
  const isUSGovernmentMacroeconomicData = dataFeedType === "usGovernmentMacroeconomicData"

  // Get network directly from URL
  const networkFromURL =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("network") : null

  // If URL has a network param, use it directly
  const effectiveInitialNetwork = networkFromURL || initialNetwork

  // Initialize state with the URL value
  const [currentNetwork, setCurrentNetwork] = useState(effectiveInitialNetwork)

  // Get network directly from URL or fall back to initialNetwork
  const getNetworkFromURL = () => {
    if (typeof window === "undefined") return initialNetwork
    const params = new URLSearchParams(window.location.search)
    const networkParam = params.get("network")
    return networkParam || initialNetwork
  }

  // Sync with URL when it changes externally (browser back/forward)
  useEffect(() => {
    if (!isStreams && typeof window !== "undefined") {
      const handleUrlChange = () => {
        const networkFromURL = getNetworkFromURL()
        if (networkFromURL !== currentNetwork) {
          setCurrentNetwork(networkFromURL)
        }
      }

      // Listen for popstate events (back/forward navigation)
      window.addEventListener("popstate", handleUrlChange)

      // Also check immediately in case URL was changed externally
      handleUrlChange()

      return () => {
        window.removeEventListener("popstate", handleUrlChange)
      }
    }
  }, [currentNetwork, isStreams])

  // Force initial sync with URL
  useEffect(() => {
    // Get the latest network from URL
    const latestNetworkFromURL = getNetworkFromURL()
    if (latestNetworkFromURL !== currentNetwork) {
      setCurrentNetwork(latestNetworkFromURL)
    }

    // Force a redraw after a short delay
    if (typeof window !== "undefined") {
      // execute after the DOM is fully loaded
      window.addEventListener("load", () => {
        const networkFromURL = getNetworkFromURL()
        setCurrentNetwork(networkFromURL)

        // Force a repaint of aria-selected attributes
        document.querySelectorAll(".network-button").forEach((button) => {
          const buttonId = button.getAttribute("id")
          if (buttonId === networkFromURL) {
            button.setAttribute("aria-selected", "true")
          } else {
            button.setAttribute("aria-selected", "false")
          }
        })
      })
    }
  }, [])

  // Regular query string states
  const [searchValue, setSearchValue] = useQueryString("search", "")
  const [testnetSearchValue, setTestnetSearchValue] = useQueryString("testnetSearch", "")
  const [selectedFeedCategories, setSelectedFeedCategories] = useQueryString("categories", [])
  const [currentPage, setCurrentPage] = useQueryString("page", "1")

  // Initialize all other states
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState<boolean>(false)
  const [showExtraDetails, setShowExtraDetails] = useState(false)
  const [showOnlyMVRFeeds, setShowOnlyMVRFeeds] = useState(false)
  const [showOnlyMVRFeedsTestnet, setShowOnlyMVRFeedsTestnet] = useState(false)
  const [showOnlySVR, setShowOnlySVR] = useState(false)
  const [showOnlyDEXFeeds, setShowOnlyDEXFeeds] = useState(false)
  const [showOnlyDEXFeedsTestnet, setShowOnlyDEXFeedsTestnet] = useState(false)
  const paginate = (pageNumber) => setCurrentPage(String(pageNumber))
  const addrPerPage = 8
  const lastAddr = Number(currentPage) * addrPerPage
  const firstAddr = lastAddr - addrPerPage

  // Pagination for testnet table
  const [testnetCurrentPage, setTestnetCurrentPage] = useQueryString("testnetPage", "1")
  const testnetPaginate = (pageNumber) => setTestnetCurrentPage(String(pageNumber))
  const testnetAddrPerPage = 8
  const testnetLastAddr = Number(testnetCurrentPage) * testnetAddrPerPage
  const testnetFirstAddr = testnetLastAddr - testnetAddrPerPage

  // Dynamic feed categories loaded from Supabase
  const [dataFeedCategory, setDataFeedCategory] = useState([
    { key: "low", name: "Low Market Risk" },
    { key: "medium", name: "Medium Market Risk" },
    { key: "high", name: "High Market Risk" },
    { key: "custom", name: "Custom" },
    { key: "new", name: "New Token" },
    { key: "deprecating", name: "Deprecating" },
  ])

  // Load dynamic categories from Supabase on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getFeedCategories()
        setDataFeedCategory(categories)
      } catch (error) {}
    }

    loadCategories()
  }, [])
  const smartDataTypes = [
    { key: "Proof of Reserve", name: "Proof of Reserve" },
    { key: "NAVLink", name: "NAVLink" },
    { key: "SmartAUM", name: "SmartAUM" },
  ]
  const [streamsChain] = useState(initialNetwork)
  const activeChain = isStreams ? streamsChain : currentNetwork
  const chain = chains.find((c) => c.page === activeChain) || chains[0]
  const chainMetadata = useGetChainMetadata(chain, initialCache && initialCache[chain.page])
  const wrapperRef = useRef(null)

  // scroll handler
  useEffect(() => {
    if (!chainMetadata.loading && chainMetadata.processedData) {
      if (typeof window === "undefined") return

      // Get the anchor from URL if present
      const hash = window.location.hash.substring(1) // Remove the # character

      // Force a delay to ensure DOM elements are rendered before updating
      setTimeout(() => {
        let hasUpdatedAnyId = false

        // Find all section elements that need their IDs updated
        chainMetadata.processedData?.networks.forEach((network) => {
          const sectionId = network.name.toLowerCase().replace(/\s+/g, "-")
          const existingSection = document.getElementById(sectionId)

          // If section exists with correct ID, no need to update
          if (existingSection) return

          // Find section with network name title and update its ID
          document.querySelectorAll("h3").forEach((heading) => {
            if (heading.textContent === network.name) {
              const section = heading.closest("section")
              if (section) {
                const oldId = section.id
                section.id = sectionId
                heading.id = sectionId
                hasUpdatedAnyId = true

                // Update anchor links inside the heading
                const anchor = heading.querySelector("a")
                if (anchor) {
                  anchor.href = `#${sectionId}`
                }

                // If we're updating the ID that matches our hash, we need to scroll to it
                if (hash && (hash === oldId || hash === sectionId)) {
                  setTimeout(() => section.scrollIntoView({ behavior: "auto" }), 100)
                }
              }
            }
          })
        })

        // Also update testnet section if it exists
        if (chainMetadata.processedData?.testnetNetwork) {
          const testnetId =
            chainMetadata.processedData.testnetNetwork.name.toLowerCase().replace(/\s+/g, "-") || "testnet-feeds"
          document.querySelectorAll("h2").forEach((heading) => {
            if (heading.textContent === "Testnet Feeds" || heading.textContent?.includes("Testnet")) {
              const section = heading.closest("section")
              if (section) {
                const oldId = section.id
                section.id = testnetId
                heading.id = testnetId
                hasUpdatedAnyId = true

                // Update anchor links inside the heading
                const anchor = heading.querySelector("a")
                if (anchor) {
                  anchor.href = `#${testnetId}`
                }

                // If we're updating the ID that matches our hash, we need to scroll to it
                if (hash && (hash === oldId || hash === testnetId)) {
                  setTimeout(() => section.scrollIntoView({ behavior: "auto" }), 100)
                }
              }
            }
          })
        }

        // If we have a hash but haven't scrolled yet, try to find the element with that ID
        if (hash && hasUpdatedAnyId) {
          const targetElement = document.getElementById(hash)
          if (targetElement) {
            setTimeout(() => targetElement.scrollIntoView({ behavior: "auto" }), 100)
          }
        } else if (hash) {
          // Basic fallback if we didnt update any IDs but still have a hash
          const targetElement = document.getElementById(hash)
          if (targetElement) {
            setTimeout(() => targetElement.scrollIntoView({ behavior: "auto" }), 200)
          }
        }

        // Update TOC links if we made any ID changes
        if (hasUpdatedAnyId) {
          // Find the TOC container and update its links
          const tocLinks = document.querySelectorAll(".toc-item a")
          tocLinks.forEach((link) => {
            const href = link.getAttribute("href")
            if (href) {
              const currentHash = href.split("#")[1]
              if (currentHash) {
                // Try to find element with this ID
                const targetHeading = document.getElementById(currentHash)
                if (targetHeading) {
                  // Update the TOC link to point to the correct ID
                  const updatedHref = window.location.pathname + window.location.search + "#" + currentHash
                  link.setAttribute("href", updatedHref)
                }
              }
            }
          })

          // Trigger a TOC update
          updateTableOfContents()
        }
      }, 300)
    }
  }, [chainMetadata.loading, chainMetadata.processedData, currentNetwork])

  // Network selection handler
  function handleNetworkSelect(chain: Chain) {
    if (!isStreams) {
      const params = new URLSearchParams(window.location.search)
      params.set("network", chain.page)
      // Remove hash fragment when changing networks to avoid mismatched anchors
      const newUrl = window.location.pathname + "?" + params.toString()
      window.history.replaceState({ path: newUrl }, "", newUrl)
      setCurrentNetwork(chain.page)
    }
    setSearchValue("")
    setSelectedFeedCategories([])
    setCurrentPage("1")
    setShowOnlyMVRFeeds(false)
    setShowOnlyMVRFeedsTestnet(false)
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
    if (searchValue === "") {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.delete("search")
      const hashFragment = window.location.hash
      const newUrl = window.location.pathname + "?" + searchParams.toString() + hashFragment
      window.history.replaceState({ path: newUrl }, "", newUrl)
      const inputElement = document.getElementById("search") as HTMLInputElement
      if (inputElement) {
        inputElement.placeholder = "Search"
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
  const isRates = dataFeedType === "rates"
  const isDeprecating = ecosystem === "deprecating"
  let netCount = 0

  const streamsMainnetSectionTitle =
    dataFeedType === "streamsCrypto"
      ? "Mainnet Crypto Streams"
      : dataFeedType === "streamsNav"
        ? "Mainnet NAV Streams"
        : dataFeedType === "streamsExRate"
          ? "Mainnet Exchange Rate Streams"
          : dataFeedType === "streamsBacked"
            ? "Mainnet Backed xStock Streams"
            : "Mainnet RWA Streams"
  const streamsTestnetSectionTitle =
    dataFeedType === "streamsCrypto"
      ? "Testnet Crypto Streams"
      : dataFeedType === "streamsNav"
        ? "Testnet NAV Streams"
        : dataFeedType === "streamsExRate"
          ? "Testnet Exchange Rate Streams"
          : dataFeedType === "streamsBacked"
            ? "Testnet Backed xStock Streams"
            : "Testnet RWA Streams"

  // Initialize search input fields with URL parameter values
  useEffect(() => {
    // mainnet
    if (searchValue) {
      const searchInputElement = document.getElementById("search") as HTMLInputElement
      if (searchInputElement) {
        searchInputElement.value = typeof searchValue === "string" ? searchValue : ""
      }
    }

    // testnet
    if (testnetSearchValue) {
      const testnetInputElement = document.getElementById("testnetSearch") as HTMLInputElement
      if (testnetInputElement) {
        testnetInputElement.value = typeof testnetSearchValue === "string" ? testnetSearchValue : ""
      }
    }
  }, [searchValue, testnetSearchValue, chainMetadata.loading])

  // handles button selection based on URL
  const NetworkSelectionUpdater = () => {
    // Update network buttons based on URL
    useEffect(() => {
      function updateNetworkButtons() {
        if (typeof window === "undefined") return

        // Get network from URL
        const urlParams = new URLSearchParams(window.location.search)
        const networkFromURL = urlParams.get("network")

        if (!networkFromURL) return

        // Update all network buttons using DOM API
        document.querySelectorAll(".network-button").forEach((button) => {
          const buttonId = button.getAttribute("id")
          if (buttonId === networkFromURL) {
            button.setAttribute("aria-selected", "true")
          } else {
            button.setAttribute("aria-selected", "false")
          }
        })
      }

      // Run immediately
      updateNetworkButtons()

      // Also run when DOM is fully loaded
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateNetworkButtons)
      }

      // And run after everything is loaded
      window.addEventListener("load", updateNetworkButtons)

      return () => {
        // Clean up listeners
        document.removeEventListener("DOMContentLoaded", updateNetworkButtons)
        window.removeEventListener("load", updateNetworkButtons)
      }
    }, [])

    return null
  }

  if (
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  ) {
    const mainnetFeeds: ChainNetwork[] = []
    const testnetFeeds: ChainNetwork[] = []

    chainMetadata.processedData?.networks.forEach((network) => {
      if (network.name.includes("Arbitrum")) {
        if (network.networkType === "mainnet") {
          mainnetFeeds.push(network)
        } else if (network.networkType === "testnet") {
          testnetFeeds.push(network)
        }
      }
    })

    return (
      <>
        <SectionWrapper title="Streams Verifier Network Addresses" depth={2}>
          <StreamsNetworkAddressesTable />
        </SectionWrapper>

        <SectionWrapper
          title={streamsMainnetSectionTitle}
          depth={2}
          idOverride={streamsMainnetSectionTitle.toLowerCase().replace(/\s+/g, "-")}
        >
          <div className={feedList.tableFilters}>
            <form class={feedList.filterDropdown_search}>
              <input
                id="search"
                class={feedList.filterDropdown_searchInput}
                placeholder="Search"
                onInput={(event) => {
                  setSearchValue((event.target as HTMLInputElement).value)
                  setCurrentPage("1")
                }}
              />
              {searchValue && (
                <button
                  type="button"
                  className={clsx(button.secondary, feedList.clearFilterBtn)}
                  onClick={() => {
                    setSearchValue("")
                    setCurrentPage("1")
                    const inputElement = document.getElementById("search") as HTMLInputElement
                    if (inputElement) {
                      inputElement.value = ""
                    }
                  }}
                  aria-label="Clear search filter"
                >
                  Clear filter
                </button>
              )}
            </form>
            {dataFeedType === "streamsCrypto" && (
              <div className={feedList.checkboxContainer}>
                <label className={feedList.detailsLabel}>
                  <input
                    type="checkbox"
                    style="width:15px;height:15px;display:inline;margin-right:8px;"
                    checked={showOnlyDEXFeeds}
                    onChange={() => {
                      setShowOnlyDEXFeeds((old) => !old)
                      setCurrentPage("1") // Reset to first page when filter changes
                    }}
                  />
                  Show DEX State Price streams
                </label>
              </div>
            )}
          </div>
          {mainnetFeeds.length ? (
            mainnetFeeds.map((network) => (
              <MainnetTable
                selectedFeedCategories={
                  Array.isArray(selectedFeedCategories)
                    ? selectedFeedCategories
                    : selectedFeedCategories
                      ? [selectedFeedCategories]
                      : []
                }
                network={network}
                showExtraDetails={showExtraDetails}
                showOnlySVR={showOnlySVR}
                showOnlyMVRFeeds={showOnlyMVRFeeds}
                showOnlyDEXFeeds={showOnlyDEXFeeds}
                dataFeedType={dataFeedType}
                ecosystem={ecosystem}
                lastAddr={lastAddr}
                firstAddr={firstAddr}
                addrPerPage={addrPerPage}
                currentPage={Number(currentPage)}
                paginate={paginate}
                searchValue={typeof searchValue === "string" ? searchValue : ""}
              />
            ))
          ) : (
            <p>No Mainnet feeds available.</p>
          )}
        </SectionWrapper>

        <SectionWrapper
          title={streamsTestnetSectionTitle}
          depth={2}
          idOverride={streamsTestnetSectionTitle.toLowerCase().replace(/\s+/g, "-")}
        >
          <div className={feedList.tableFilters}>
            <form class={feedList.filterDropdown_search}>
              <input
                id="testnetSearch"
                class={feedList.filterDropdown_searchInput}
                placeholder="Search"
                onInput={(event) => {
                  setTestnetSearchValue((event.target as HTMLInputElement).value)
                  setTestnetCurrentPage("1")
                }}
              />
              {testnetSearchValue && (
                <button
                  type="button"
                  className={clsx(button.secondary, feedList.clearFilterBtn)}
                  onClick={() => {
                    setTestnetSearchValue("")
                    setTestnetCurrentPage("1")
                    const inputElement = document.getElementById("testnetSearch") as HTMLInputElement
                    if (inputElement) {
                      inputElement.value = ""
                    }
                  }}
                  aria-label="Clear search filter"
                >
                  Clear filter
                </button>
              )}
            </form>
            {dataFeedType === "streamsCrypto" && (
              <div className={feedList.checkboxContainer}>
                <label className={feedList.detailsLabel}>
                  <input
                    type="checkbox"
                    style="width:15px;height:15px;display:inline;margin-right:8px;"
                    checked={showOnlyDEXFeedsTestnet}
                    onChange={() => {
                      setShowOnlyDEXFeedsTestnet((old) => !old)
                      setTestnetCurrentPage("1") // Reset to first page when filter changes
                    }}
                  />
                  Show DEX State Price streams
                </label>
              </div>
            )}
          </div>
          {testnetFeeds.length ? (
            testnetFeeds.map((network) => (
              <TestnetTable
                key={network.name}
                network={network}
                showExtraDetails={showExtraDetails}
                dataFeedType={dataFeedType}
                selectedFeedCategories={
                  Array.isArray(selectedFeedCategories)
                    ? selectedFeedCategories
                    : selectedFeedCategories
                      ? [selectedFeedCategories]
                      : []
                }
                showOnlyMVRFeeds={showOnlyMVRFeedsTestnet}
                showOnlyDEXFeeds={showOnlyDEXFeedsTestnet}
                firstAddr={testnetFirstAddr}
                lastAddr={testnetLastAddr}
                addrPerPage={testnetAddrPerPage}
                currentPage={Number(testnetCurrentPage)}
                paginate={testnetPaginate}
                searchValue={typeof testnetSearchValue === "string" ? testnetSearchValue : ""}
              />
            ))
          ) : (
            <p>No Testnet feeds available.</p>
          )}
        </SectionWrapper>
      </>
    )
  }

  return (
    <SectionWrapper title="Networks" depth={2} updateTOC={false}>
      <NetworkSelectionUpdater />

      {!isDeprecating && (
        <>
          <div class={feedList.clChainnavProduct} role="tablist">
            {chains
              .filter((chain) => {
                if (isStreams) return chain.tags?.includes("streams")
                if (isSmartData) return chain.tags?.includes("smartData")
                if (isRates) return chain.tags?.includes("rates")
                if (isUSGovernmentMacroeconomicData) return chain.tags?.includes("usGovernmentMacroeconomicData")
                return chain.tags?.includes("default")
              })
              .map((chain) => {
                // Get network directly from URL
                const urlNetworkParam =
                  typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("network") : null

                // Consider selected if either state or URL parameter matches
                const isSelected = chain.page === (urlNetworkParam || currentNetwork)

                return (
                  <button
                    key={chain.page}
                    id={chain.page}
                    role="tab"
                    aria-selected={isSelected}
                    class={clsx(feedList.networkSwitchButton, "network-button")}
                    onClick={() => handleNetworkSelect(chain)}
                  >
                    <img src={chain.img} title={chain.label} loading="lazy" width={32} height={32} />
                    <span>{chain.label}</span>
                  </button>
                )
              })}
          </div>
          {chainMetadata.processedData?.networkStatusUrl && !isDeprecating && (
            <p>
              Track the status of this network at{" "}
              <a href={chainMetadata.processedData?.networkStatusUrl}>
                {chainMetadata.processedData?.networkStatusUrl}
              </a>
            </p>
          )}
        </>
      )}

      {chainMetadata.error && <p>There was an error loading the feeds...</p>}

      {chainMetadata.loading && !chainMetadata.processedData && <p>Loading...</p>}

      {(() => {
        // Handle deprecating feeds from initialCache if available
        if (isDeprecating && initialCache && initialCache.deprecated && (initialCache.deprecated as any).networks) {
          return (initialCache.deprecated as any).networks
            .filter((network: any) => {
              let foundDeprecated = false
              network.metadata?.forEach((feed: any) => {
                if (feed.feedCategory === "deprecating") {
                  foundDeprecated = true
                }
              })
              if (foundDeprecated) {
                netCount++
              }
              return foundDeprecated
            })
            .map((network: any) => (
              <SectionWrapper
                title={network.name}
                depth={3}
                key={network.name}
                idOverride={network.name.toLowerCase().replace(/\s+/g, "-")}
              >
                <MainnetTable
                  selectedFeedCategories={
                    Array.isArray(selectedFeedCategories)
                      ? selectedFeedCategories
                      : selectedFeedCategories
                        ? [selectedFeedCategories]
                        : []
                  }
                  network={{
                    ...network,
                    metadata: network.metadata.filter((feed: any) => feed.feedCategory === "deprecating"),
                  }}
                  showExtraDetails={showExtraDetails}
                  showOnlySVR={showOnlySVR}
                  showOnlyMVRFeeds={showOnlyMVRFeeds}
                  showOnlyDEXFeeds={false}
                  dataFeedType={dataFeedType}
                  ecosystem={ecosystem}
                  lastAddr={lastAddr}
                  firstAddr={firstAddr}
                  addrPerPage={addrPerPage}
                  currentPage={Number(currentPage)}
                  paginate={paginate}
                  searchValue={typeof searchValue === "string" ? searchValue : ""}
                />
              </SectionWrapper>
            ))
        }

        // Handle regular network processing
        return chainMetadata.processedData?.networks
          ?.filter((network: { metadata: unknown[]; tags: string | string[] }) => {
            if (isDeprecating) {
              let foundDeprecated = false
              network.metadata?.forEach((feed: any) => {
                if (feed.feedCategory === "deprecating") {
                  foundDeprecated = true
                }
              })
              if (foundDeprecated) {
                netCount++
              }
              return foundDeprecated
            }

            if (isStreams) return network.tags?.includes("streams")

            if (isSmartData) return network.tags?.includes("smartData")

            if (isRates) return network.tags?.includes("rates")

            if (isUSGovernmentMacroeconomicData) return network.tags?.includes("usGovernmentMacroeconomicData")

            return true
          })
          .map((network: ChainNetwork) => {
            return (
              <>
                <SectionWrapper
                  title={network.name}
                  depth={3}
                  key={network.name}
                  idOverride={network.name.toLowerCase().replace(/\s+/g, "-")}
                >
                  {network.name === "Solana Mainnet" && (
                    <div
                      style={{
                        padding: "var(--space-4x)",
                        gap: "var(--space-4x)",
                        backgroundColor: "var(--color-background-warning)",
                        border: "1px solid #eee",
                        borderRadius: "var(--border-radius-10)",
                        outline: "1px solid transparent",
                        display: "flex",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ flexShrink: 0, width: "1.5em" }}>
                        <img src={alertIcon.src} style={{ width: "1.5em", height: "1.5em" }} alt="caution" />
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            textTransform: "uppercase",
                            color: "var(--theme-text)",
                            fontSize: "14px",
                            marginBottom: "0.5rem",
                            fontFamily: "TASAOrbiterDisplay",
                          }}
                        >
                          Solana Data Feeds Deprecation
                        </p>
                        <p style={{ color: "var(--theme-text-light)", lineHeight: 1.5, fontSize: "14px" }}>
                          Several Data Feeds on Solana{" "}
                          <a
                            href="/data-feeds/deprecating-feeds"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-text-link)", textDecoration: "underline" }}
                          >
                            are being deprecated
                          </a>{" "}
                          as Chainlink migrates support to Data Streams' pull-based model. See{" "}
                          <a
                            href="/data-streams/crypto-streams"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-text-link)", textDecoration: "underline" }}
                          >
                            this page
                          </a>{" "}
                          for the complete list of Data Streams available on Solana.
                        </p>
                      </div>
                    </div>
                  )}
                  {network.networkType === "mainnet" ? (
                    <>
                      {!isStreams && chain.l2SequencerFeed && (
                        <p>
                          {network.name} is an L2 network. As a best practice, use the L2 sequencer feed to verify the
                          status of the sequencer when running applications on L2 networks. See the{" "}
                          <a href="/docs/data-feeds/l2-sequencer-feeds/">L2 Sequencer Uptime Feeds</a> page for
                          examples.
                        </p>
                      )}
                      {network.name === "Aptos Mainnet" && (
                        <>
                          <p>
                            Chainlink Data Feeds on Aptos provides data through a single price feed contract that
                            handles multiple data feeds. You interact with this contract by passing the specific feed
                            ID(s) for the data you need. For more details, refer to the{" "}
                            <a href="/data-feeds/aptos/">Using Data Feeds on Aptos</a> guide.
                          </p>
                          <ul>
                            <li>
                              ChainlinkDataFeeds package address on Aptos Mainnet:{" "}
                              <a
                                className={tableStyles.addressLink}
                                href="https://explorer.aptoslabs.com/object/0x3f985798ce4975f430ef5c75776ff98a77b9f9d0fb38184d225adc9c1cc6b79b/modules/packages/ChainlinkDataFeeds?network=mainnet"
                                target="_blank"
                              >
                                0x3f985798ce4975f430ef5c75776ff98a77b9f9d0fb38184d225adc9c1cc6b79b
                              </a>
                              <button
                                className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                                style={{ height: "16px", width: "16px", marginLeft: "5px" }}
                                data-clipboard-text="0x3f985798ce4975f430ef5c75776ff98a77b9f9d0fb38184d225adc9c1cc6b79b"
                              >
                                <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                              </button>
                            </li>
                            <li>
                              ChainlinkPlatform package address on Aptos Mainnet:{" "}
                              <a
                                className={tableStyles.addressLink}
                                href="https://explorer.aptoslabs.com/object/0x9976bb288ed9177b542d568fa1ac386819dc99141630e582315804840f41928a/modules/packages/ChainlinkPlatform?network=mainnet"
                                target="_blank"
                              >
                                0x9976bb288ed9177b542d568fa1ac386819dc99141630e582315804840f41928a
                              </a>
                              <button
                                className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                                style={{ height: "16px", width: "16px", marginLeft: "5px" }}
                                data-clipboard-text="0x9976bb288ed9177b542d568fa1ac386819dc99141630e582315804840f41928a"
                              >
                                <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                              </button>
                            </li>
                          </ul>
                        </>
                      )}
                      <div className={feedList.tableFilters}>
                        {!isStreams && !isSmartData && (
                          <details class={feedList.filterDropdown_details}>
                            <summary class="text-200" onClick={() => setShowCategoriesDropdown((prev) => !prev)}>
                              Data Feed Categories
                            </summary>
                            <nav ref={wrapperRef} style={!showCategoriesDropdown ? { display: "none" } : {}}>
                              <ul>
                                {dataFeedCategory.map((category) => (
                                  <li>
                                    <button onClick={() => handleCategorySelection(category.key)}>
                                      <input
                                        type="checkbox"
                                        checked={selectedFeedCategories?.includes(category.key)}
                                        readonly
                                        style="cursor:pointer;"
                                      />
                                      <span> {category.name}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </nav>
                          </details>
                        )}
                        {isSmartData && (
                          <details class={feedList.filterDropdown_details}>
                            <summary class="text-200" onClick={() => setShowCategoriesDropdown((prev) => !prev)}>
                              SmartData Type
                            </summary>
                            <nav ref={wrapperRef} style={!showCategoriesDropdown ? { display: "none" } : {}}>
                              <ul>
                                {smartDataTypes.map((category) => (
                                  <li>
                                    <button onClick={() => handleCategorySelection(category.key)}>
                                      <input
                                        type="checkbox"
                                        checked={selectedFeedCategories?.includes(category.key)}
                                        readonly
                                        style="cursor:pointer;"
                                      />
                                      <span> {category.name}</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </nav>
                          </details>
                        )}
                        <div className={feedList.searchAndCheckbox}>
                          <form class={feedList.filterDropdown_search}>
                            <input
                              id="search"
                              class={feedList.filterDropdown_searchInput}
                              placeholder="Search"
                              onInput={(event) => {
                                setSearchValue((event.target as HTMLInputElement).value)
                                setCurrentPage("1")
                              }}
                            />
                            {searchValue && (
                              <button
                                type="button"
                                className={clsx(button.secondary, feedList.clearFilterBtn)}
                                onClick={() => {
                                  setSearchValue("")
                                  setCurrentPage("1")
                                  const inputElement = document.getElementById("search") as HTMLInputElement
                                  if (inputElement) {
                                    inputElement.value = ""
                                  }
                                }}
                                aria-label="Clear search filter"
                              >
                                Clear filter
                              </button>
                            )}
                          </form>
                          {!isStreams && (
                            <label className={feedList.detailsLabel}>
                              <input
                                type="checkbox"
                                style="width:15px;height:15px;display:inline;margin-right:8px;"
                                checked={showExtraDetails}
                                onChange={() => setShowExtraDetails((old) => !old)}
                              />
                              Show more details
                            </label>
                          )}
                        </div>
                        <div className={feedList.checkboxContainer}>
                          {!isStreams && isSmartData && (
                            <label className={feedList.detailsLabel}>
                              <input
                                type="checkbox"
                                style="width:15px;height:15px;display:inline;margin-right:8px;"
                                checked={showOnlyMVRFeeds}
                                onChange={() => {
                                  setShowOnlyMVRFeeds((old) => !old)
                                  setCurrentPage("1") // Reset to first page when filter changes
                                }}
                              />
                              Show Multiple-Variable Response (MVR) feeds
                            </label>
                          )}
                          {!isStreams && !isSmartData && !isUSGovernmentMacroeconomicData && (
                            <label className={feedList.detailsLabel}>
                              <input
                                type="checkbox"
                                style="width:15px;height:15px;display:inline;margin-right:8px;"
                                checked={showOnlySVR}
                                onChange={() => {
                                  setShowOnlySVR((old) => !old)
                                  setCurrentPage("1")
                                }}
                              />
                              Show Smart Value Recapture (SVR) feeds
                            </label>
                          )}
                        </div>
                      </div>
                      <MainnetTable
                        selectedFeedCategories={
                          Array.isArray(selectedFeedCategories)
                            ? selectedFeedCategories
                            : selectedFeedCategories
                              ? [selectedFeedCategories]
                              : []
                        }
                        network={network}
                        showExtraDetails={showExtraDetails}
                        showOnlySVR={showOnlySVR}
                        showOnlyMVRFeeds={showOnlyMVRFeeds}
                        showOnlyDEXFeeds={false}
                        dataFeedType={dataFeedType}
                        ecosystem={ecosystem}
                        lastAddr={lastAddr}
                        firstAddr={firstAddr}
                        addrPerPage={addrPerPage}
                        currentPage={Number(currentPage)}
                        paginate={paginate}
                        searchValue={typeof searchValue === "string" ? searchValue : ""}
                      />
                    </>
                  ) : (
                    <>
                      {network.name === "Aptos Testnet" && (
                        <>
                          <ul>
                            <li>
                              ChainlinkDataFeeds package address on Aptos Testnet:{" "}
                              <a
                                className={tableStyles.addressLink}
                                href="https://explorer.aptoslabs.com/object/0xf1099f135ddddad1c065203431be328a408b0ca452ada70374ce26bd2b32fdd3/modules/packages/ChainlinkDataFeeds?network=testnet"
                                target="_blank"
                              >
                                0xf1099f135ddddad1c065203431be328a408b0ca452ada70374ce26bd2b32fdd3
                              </a>
                              <button
                                className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                                style={{ height: "16px", width: "16px", marginLeft: "5px" }}
                                data-clipboard-text="0xf1099f135ddddad1c065203431be328a408b0ca452ada70374ce26bd2b32fdd3"
                              >
                                <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                              </button>
                            </li>
                            <li>
                              ChainlinkPlatform package address on Aptos Testnet:{" "}
                              <a
                                className={tableStyles.addressLink}
                                href="https://explorer.aptoslabs.com/object/0x516e771e1b4a903afe74c27d057c65849ecc1383782f6642d7ff21425f4f9c99/modules/packages/ChainlinkPlatform?network=testnet"
                                target="_blank"
                              >
                                0x516e771e1b4a903afe74c27d057c65849ecc1383782f6642d7ff21425f4f9c99
                              </a>
                              <button
                                className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
                                style={{ height: "16px", width: "16px", marginLeft: "5px" }}
                                data-clipboard-text="0x516e771e1b4a903afe74c27d057c65849ecc1383782f6642d7ff21425f4f9c99"
                              >
                                <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
                              </button>
                            </li>
                          </ul>
                        </>
                      )}
                      {!isStreams && (
                        <div className={feedList.tableFilters}>
                          {isSmartData && (
                            <details class={feedList.filterDropdown_details}>
                              <summary class="text-200" onClick={() => setShowCategoriesDropdown((prev) => !prev)}>
                                SmartData Type
                              </summary>
                              <nav ref={wrapperRef} style={!showCategoriesDropdown ? { display: "none" } : {}}>
                                <ul>
                                  {smartDataTypes.map((category) => (
                                    <li>
                                      <button onClick={() => handleCategorySelection(category.key)}>
                                        <input
                                          type="checkbox"
                                          checked={selectedFeedCategories?.includes(category.key)}
                                          readonly
                                          style="cursor:pointer;"
                                        />
                                        <span> {category.name}</span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </nav>
                            </details>
                          )}
                          <div className={feedList.searchAndCheckbox}>
                            <form class={feedList.filterDropdown_search}>
                              <input
                                id="testnetSearch"
                                class={feedList.filterDropdown_searchInput}
                                placeholder="Search"
                                onInput={(event) => {
                                  setTestnetSearchValue((event.target as HTMLInputElement).value)
                                  setTestnetCurrentPage("1")
                                }}
                              />
                              {testnetSearchValue && (
                                <button
                                  type="button"
                                  className={clsx(button.secondary, feedList.clearFilterBtn)}
                                  onClick={() => {
                                    setTestnetSearchValue("")
                                    setTestnetCurrentPage("1")
                                    const inputElement = document.getElementById("testnetSearch") as HTMLInputElement
                                    if (inputElement) {
                                      inputElement.value = ""
                                    }
                                  }}
                                  aria-label="Clear search filter"
                                >
                                  Clear filter
                                </button>
                              )}
                            </form>
                            <label className={feedList.detailsLabel}>
                              <input
                                type="checkbox"
                                style="width:15px;height:15px;display:inline;margin-right:8px;"
                                checked={showExtraDetails}
                                onChange={() => setShowExtraDetails((old) => !old)}
                              />
                              Show more details
                            </label>
                          </div>
                          <div className={feedList.checkboxContainer}>
                            {!isStreams && isSmartData && (
                              <label className={feedList.detailsLabel}>
                                <input
                                  type="checkbox"
                                  style="width:15px;height:15px;display:inline;margin-right:8px;"
                                  checked={showOnlyMVRFeedsTestnet}
                                  onChange={() => {
                                    setShowOnlyMVRFeedsTestnet((old) => !old)
                                    setTestnetCurrentPage("1") // Reset to first page when filter changes
                                  }}
                                />
                                Show Multiple-Variable Response (MVR) feeds
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                      {isStreams && (
                        <div className={feedList.tableFilters}>
                          <form class={feedList.filterDropdown_search}>
                            <input
                              id="testnetSearch"
                              class={feedList.filterDropdown_searchInput}
                              placeholder="Search"
                              onInput={(event) => {
                                setTestnetSearchValue((event.target as HTMLInputElement).value)
                                setTestnetCurrentPage("1")
                              }}
                            />
                            {testnetSearchValue && (
                              <button
                                type="button"
                                className={clsx(button.secondary, feedList.clearFilterBtn)}
                                onClick={() => {
                                  setTestnetSearchValue("")
                                  setTestnetCurrentPage("1")
                                  const inputElement = document.getElementById("testnetSearch") as HTMLInputElement
                                  if (inputElement) {
                                    inputElement.value = ""
                                  }
                                }}
                                aria-label="Clear search filter"
                              >
                                Clear filter
                              </button>
                            )}
                          </form>
                        </div>
                      )}
                      <TestnetTable
                        network={network}
                        showExtraDetails={showExtraDetails}
                        dataFeedType={dataFeedType}
                        selectedFeedCategories={
                          Array.isArray(selectedFeedCategories)
                            ? selectedFeedCategories
                            : selectedFeedCategories
                              ? [selectedFeedCategories]
                              : []
                        }
                        showOnlyMVRFeeds={showOnlyMVRFeedsTestnet}
                        firstAddr={testnetFirstAddr}
                        lastAddr={testnetLastAddr}
                        addrPerPage={testnetAddrPerPage}
                        currentPage={Number(testnetCurrentPage)}
                        paginate={testnetPaginate}
                        searchValue={typeof testnetSearchValue === "string" ? testnetSearchValue : ""}
                      />
                    </>
                  )}
                </SectionWrapper>
              </>
            )
          })
      })()}
      {isDeprecating && netCount === 0 && (
        <div>
          <strong>No data feeds are scheduled for deprecation at this time.</strong>
        </div>
      )}

      {!isDeprecating &&
        chainMetadata.processedData?.testnetProcessedData &&
        chainMetadata.processedData?.testnetProcessedData.length > 0 && (
          <SectionWrapper
            title={isStreams ? streamsTestnetSectionTitle : "Testnet Feeds"}
            depth={2}
            updateTOC={true}
            idOverride={
              chainMetadata.processedData.testnetNetwork?.name?.toLowerCase().replace(/\s+/g, "-") || "testnet-feeds"
            }
          >
            <div className={feedList.tableFilters}>
              {!isStreams && isSmartData && (
                <details class={feedList.filterDropdown_details}>
                  <summary class="text-200" onClick={() => setShowCategoriesDropdown((prev) => !prev)}>
                    SmartData Type
                  </summary>
                  <nav ref={wrapperRef} style={!showCategoriesDropdown ? { display: "none" } : {}}>
                    <ul>
                      {smartDataTypes.map((category) => (
                        <li>
                          <button onClick={() => handleCategorySelection(category.key)}>
                            <input
                              type="checkbox"
                              checked={selectedFeedCategories?.includes(category.key)}
                              readonly
                              style="cursor:pointer;"
                            />
                            <span> {category.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>
              )}
              <div className={feedList.searchAndCheckbox}>
                <form class={feedList.filterDropdown_search}>
                  <input
                    id="testnetSearch"
                    class={feedList.filterDropdown_searchInput}
                    placeholder="Search"
                    onInput={(event) => {
                      setTestnetSearchValue((event.target as HTMLInputElement).value)
                      setTestnetCurrentPage("1")
                    }}
                  />
                  {testnetSearchValue && (
                    <button
                      type="button"
                      className={clsx(button.secondary, feedList.clearFilterBtn)}
                      onClick={() => {
                        setTestnetSearchValue("")
                        setTestnetCurrentPage("1")
                        const inputElement = document.getElementById("testnetSearch") as HTMLInputElement
                        if (inputElement) {
                          inputElement.value = ""
                        }
                      }}
                      aria-label="Clear search filter"
                    >
                      Clear filter
                    </button>
                  )}
                </form>
                {!isStreams && (
                  <label className={feedList.detailsLabel}>
                    <input
                      type="checkbox"
                      style="width:15px;height:15px;display:inline;margin-right:8px;"
                      checked={showExtraDetails}
                      onChange={() => setShowExtraDetails((old) => !old)}
                    />
                    Show more details
                  </label>
                )}
              </div>
              <div className={feedList.checkboxContainer}>
                {!isStreams && isSmartData && (
                  <label className={feedList.detailsLabel}>
                    <input
                      type="checkbox"
                      style="width:15px;height:15px;display:inline;margin-right:8px;"
                      checked={showOnlyMVRFeedsTestnet}
                      onChange={() => {
                        setShowOnlyMVRFeedsTestnet((old) => !old)
                        setTestnetCurrentPage("1") // Reset to first page when filter changes
                      }}
                    />
                    Show Multiple-Variable Response (MVR) feeds
                  </label>
                )}
              </div>
            </div>
            <TestnetTable
              network={chainMetadata.processedData.testnetNetwork}
              showExtraDetails={showExtraDetails}
              dataFeedType={dataFeedType}
              selectedFeedCategories={
                Array.isArray(selectedFeedCategories)
                  ? selectedFeedCategories
                  : selectedFeedCategories
                    ? [selectedFeedCategories]
                    : []
              }
              showOnlyMVRFeeds={showOnlyMVRFeedsTestnet}
              firstAddr={testnetFirstAddr}
              lastAddr={testnetLastAddr}
              addrPerPage={testnetAddrPerPage}
              currentPage={Number(testnetCurrentPage)}
              paginate={testnetPaginate}
              searchValue={typeof testnetSearchValue === "string" ? testnetSearchValue : ""}
            />
          </SectionWrapper>
        )}
    </SectionWrapper>
  )
}
