/** @jsxImportSource preact */
import { useEffect, useState, useRef, useMemo } from "preact/hooks"
import { MainnetTable, TestnetTable, StreamsNetworkAddressesTable, StreamsTHead, StreamsTr } from "./Tables.tsx"
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
import { ChainSelector } from "~/components/ChainSelector/ChainSelector.tsx"
import { isFeedVisible } from "../utils/feedVisibility.ts"
import { updateUrlClean, clearFilters } from "./urlStateHelpers.ts"

export type DataFeedType =
  | "default"
  | "smartdata"
  | "rates"
  | "usGovernmentMacroeconomicData"
  | "tokenizedEquity"
  | "streamsCrypto"
  | "streamsRwa"
  | "streamsNav"
  | "streamsExRate"
  | "streamsBacked"

type SchemaFilterValue = "all" | "v8" | "v11"
type StreamsRwaFeedTypeValue = "all" | "datalink" | "equities" | "forex"
type TradingHoursFilterValue = "all" | "regular" | "extended" | "overnight"

type FilterOption<T extends string> = {
  label: string
  value: T
}

interface FilterDropdownProps<T extends string> {
  label: string
  options: FilterOption<T>[]
  value: T
  onSelect: (value: T) => void
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
  onClose: () => void
  groupId: string
}

const schemaFilterOptions: FilterOption<SchemaFilterValue>[] = [
  { label: "All", value: "all" },
  { label: "RWA Standard (v8)", value: "v8" },
  { label: "RWA Advanced (v11)", value: "v11" },
]

const feedTypeFilterOptions: FilterOption<StreamsRwaFeedTypeValue>[] = [
  { label: "All", value: "all" },
  { label: "Datalink Streams", value: "datalink" },
  { label: "Equity Streams", value: "equities" },
  { label: "Forex Streams", value: "forex" },
]

const tradingHoursFilterOptions: FilterOption<TradingHoursFilterValue>[] = [
  { label: "All Time Segments", value: "all" },
  { label: "Regular Hours", value: "regular" },
  { label: "Extended Hours", value: "extended" },
  { label: "Overnight Hours", value: "overnight" },
]

const isSchemaFilterValue = (value: unknown): value is SchemaFilterValue =>
  value === "all" || value === "v8" || value === "v11"
const isStreamsRwaFeedTypeValue = (value: unknown): value is StreamsRwaFeedTypeValue =>
  value === "all" || value === "datalink" || value === "equities" || value === "forex"
const isTradingHoursFilterValue = (value: unknown): value is TradingHoursFilterValue =>
  value === "all" || value === "regular" || value === "extended" || value === "overnight"

const FilterDropdown = <T extends string>({
  label,
  options,
  value,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  groupId,
}: FilterDropdownProps<T>) => {
  const selectedOption = options.find((option) => option.value === value)
  const isDefault = value === options[0]?.value
  const summaryLabel = isDefault ? label : (selectedOption?.label ?? label)

  return (
    <details
      class={feedList.filterDropdown_details}
      data-hasvalue={isDefault ? "false" : "true"}
      open={isOpen}
      onToggle={(event) => onToggle(event.currentTarget.open)}
    >
      <summary class="text-200" title={summaryLabel}>
        {summaryLabel}
      </summary>
      {isOpen && (
        <nav>
          <ul>
            {options.map((option) => {
              const isSelected = value === option.value
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(option.value)
                      onClose()
                    }}
                    style="user-select: none;"
                  >
                    <input type="radio" name={groupId} checked={isSelected} readOnly style="cursor:pointer;" />
                    <span style="user-select: none;">{option.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </details>
  )
}
export const FeedList = ({
  initialNetwork,
  dataFeedType = "default",
  ecosystem = "",
  initialCache,
  allowNetworkTableExpansion = false,
  defaultNetworkTableExpanded = false,
  force24x5Only = false,
  tokenizedEquityProvider,
}: {
  initialNetwork: string
  dataFeedType: DataFeedType
  ecosystem?: string
  initialCache?: Record<string, ChainMetadata>
  allowNetworkTableExpansion?: boolean
  defaultNetworkTableExpanded?: boolean
  force24x5Only?: boolean
  tokenizedEquityProvider?: string
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

  // Get network from URL parameters or fall back to initialNetwork
  const getNetworkFromURL = () => {
    if (typeof window === "undefined") return initialNetwork
    const params = new URLSearchParams(window.location.search)
    const networkParam = params.get("network")
    return networkParam || initialNetwork
  }

  // Get network type from URL parameters (detect testnet from testnetSearch, testnetPage, or explicit networkType)
  const getNetworkTypeFromURL = (): "mainnet" | "testnet" => {
    if (typeof window === "undefined") return "mainnet"
    const params = new URLSearchParams(window.location.search)

    // Check explicit networkType parameter first
    const networkType = params.get("networkType")
    if (networkType === "testnet") {
      return "testnet"
    }

    // If there's testnetSearch or testnetPage > 1, user is viewing testnet
    const testnetSearch = params.get("testnetSearch")
    const testnetPage = params.get("testnetPage")

    if (testnetSearch || (testnetPage && testnetPage !== "1")) {
      return "testnet"
    }

    return "mainnet"
  }

  // Initialize state with the URL value
  const [currentNetwork, setCurrentNetwork] = useState(getNetworkFromURL())

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

  // Sync with URL when it changes externally (browser back/forward)
  useEffect(() => {
    // Only run this effect on the client side after mount
    if (typeof window !== "undefined") {
      const latestNetworkFromURL = getNetworkFromURL()
      if (latestNetworkFromURL !== currentNetwork) {
        setCurrentNetwork(latestNetworkFromURL)
      }
    }
  }, []) // Run only once on mount

  // Additional sync for when window loads (fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLoad = () => {
        const networkFromURL = getNetworkFromURL()
        if (networkFromURL !== currentNetwork) {
          setCurrentNetwork(networkFromURL)
        }
      }

      // If window is already loaded, run immediately
      if (document.readyState === "complete") {
        handleLoad()
      } else {
        window.addEventListener("load", handleLoad)
        return () => window.removeEventListener("load", handleLoad)
      }
    }
  }, [])

  // Track the selected network type (mainnet/testnet)
  const [selectedNetworkType, setSelectedNetworkType] = useState<"mainnet" | "testnet">(getNetworkTypeFromURL())

  // Sync network type with URL when it changes externally (browser back/forward)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleNetworkTypeUrlChange = () => {
        const networkTypeFromURL = getNetworkTypeFromURL()
        if (networkTypeFromURL !== selectedNetworkType) {
          setSelectedNetworkType(networkTypeFromURL)
        }
      }

      // Listen for popstate events (back/forward navigation)
      window.addEventListener("popstate", handleNetworkTypeUrlChange)

      // Also check immediately in case URL was changed externally
      handleNetworkTypeUrlChange()

      return () => {
        window.removeEventListener("popstate", handleNetworkTypeUrlChange)
      }
    }
  }, [selectedNetworkType])

  // Track hydration state
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Regular query string states
  const [searchValue, setSearchValue] = useQueryString("search")
  const [testnetSearchValue, setTestnetSearchValue] = useQueryString("testnetSearch")
  const [selectedFeedCategoriesRaw, setSelectedFeedCategories] = useQueryString("categories")
  // Ensure categories is always an array
  const selectedFeedCategories = Array.isArray(selectedFeedCategoriesRaw)
    ? selectedFeedCategoriesRaw
    : selectedFeedCategoriesRaw
      ? [selectedFeedCategoriesRaw]
      : []
  const [currentPage, setCurrentPage] = useQueryString("page")

  // Initialize all other states
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState<boolean>(false)
  const [streamCategoryFilterParam, setStreamCategoryFilterParam] = useQueryString("feedType")
  const streamCategoryFilter =
    typeof streamCategoryFilterParam === "string" && isStreamsRwaFeedTypeValue(streamCategoryFilterParam)
      ? streamCategoryFilterParam
      : "all"
  const setStreamCategoryFilter = (next: StreamsRwaFeedTypeValue) => {
    setStreamCategoryFilterParam(next === "all" ? [] : next)
  }
  const [testnetStreamCategoryFilterParam, setTestnetStreamCategoryFilterParam] = useQueryString("testnetFeedType")
  const testnetStreamCategoryFilter =
    typeof testnetStreamCategoryFilterParam === "string" && isStreamsRwaFeedTypeValue(testnetStreamCategoryFilterParam)
      ? testnetStreamCategoryFilterParam
      : "all"
  const setTestnetStreamCategoryFilter = (next: StreamsRwaFeedTypeValue) => {
    setTestnetStreamCategoryFilterParam(next === "all" ? [] : next)
  }

  // Checkbox states backed by URL params
  const [showDetailsParam, setShowDetailsParam] = useQueryString("showDetails")
  const showExtraDetails = showDetailsParam === "true"
  const setShowExtraDetails = (value: boolean) => {
    setShowDetailsParam(value ? "true" : "")
    updateUrlClean({ showDetails: value || undefined })
  }

  const [showSvrParam, setShowSvrParam] = useQueryString("showSvr")
  const showOnlySVR = showSvrParam === "true"
  const setShowOnlySVR = (value: boolean) => {
    setShowSvrParam(value ? "true" : "")
    updateUrlClean({ showSvr: value || undefined })
    if (value) paginate(1)
  }

  // MVR and DEX filters are not in URL (too specialized)
  const [showOnlyMVRFeeds, setShowOnlyMVRFeeds] = useState(false)
  const [showOnlyMVRFeedsTestnet, setShowOnlyMVRFeedsTestnet] = useState(false)
  const [showOnlyDEXFeeds, setShowOnlyDEXFeeds] = useState(false)
  const [showOnlyDEXFeedsTestnet, setShowOnlyDEXFeedsTestnet] = useState(false)
  const [show24x5FeedsParam, setShow24x5FeedsParam] = useQueryString("show24x5")
  const show24x5Feeds = force24x5Only || show24x5FeedsParam === "true"
  const setShow24x5Feeds = (value: boolean) => {
    if (!force24x5Only) {
      setShow24x5FeedsParam(value ? "true" : [])
    }
  }
  const [tradingHoursFilterParam, setTradingHoursFilterParam] = useQueryString("tradingHours")
  const tradingHoursFilter =
    typeof tradingHoursFilterParam === "string" && isTradingHoursFilterValue(tradingHoursFilterParam)
      ? tradingHoursFilterParam
      : "all"
  const setTradingHoursFilter = (next: TradingHoursFilterValue) => {
    setTradingHoursFilterParam(next === "all" ? [] : next)
  }
  const [rwaSchemaFilterParam, setRwaSchemaFilterParam] = useQueryString("schema")
  const rwaSchemaFilter =
    typeof rwaSchemaFilterParam === "string" && isSchemaFilterValue(rwaSchemaFilterParam) ? rwaSchemaFilterParam : "all"
  const setRwaSchemaFilter = (next: SchemaFilterValue) => {
    setRwaSchemaFilterParam(next === "all" ? [] : next)
  }
  const [testnetRwaSchemaFilterParam, setTestnetRwaSchemaFilterParam] = useQueryString("testnetSchema")
  const testnetRwaSchemaFilter =
    typeof testnetRwaSchemaFilterParam === "string" && isSchemaFilterValue(testnetRwaSchemaFilterParam)
      ? testnetRwaSchemaFilterParam
      : "all"
  const setTestnetRwaSchemaFilter = (next: SchemaFilterValue) => {
    setTestnetRwaSchemaFilterParam(next === "all" ? [] : next)
  }
  const [show24x5FeedsTestnetParam, setShow24x5FeedsTestnetParam] = useQueryString("testnetShow24x5")
  const show24x5FeedsTestnet = force24x5Only || show24x5FeedsTestnetParam === "true"
  const setShow24x5FeedsTestnet = (value: boolean) => {
    if (!force24x5Only) {
      setShow24x5FeedsTestnetParam(value ? "true" : [])
    }
  }
  const [testnetTradingHoursFilterParam, setTestnetTradingHoursFilterParam] = useQueryString("testnetTradingHours")
  const testnetTradingHoursFilter =
    typeof testnetTradingHoursFilterParam === "string" && isTradingHoursFilterValue(testnetTradingHoursFilterParam)
      ? testnetTradingHoursFilterParam
      : "all"
  const setTestnetTradingHoursFilter = (next: TradingHoursFilterValue) => {
    setTestnetTradingHoursFilterParam(next === "all" ? [] : next)
  }
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const handleDropdownToggle = (dropdownId: string, isOpen: boolean) => {
    setOpenDropdownId((current) => {
      if (isOpen) {
        return dropdownId
      }
      return current === dropdownId ? null : current
    })
  }
  const closeAllDropdowns = () => setOpenDropdownId(null)
  const paginate = (pageNumber) => {
    const pageStr = String(pageNumber)
    setCurrentPage(pageStr)
    updateUrlClean({ page: pageNumber === 1 ? undefined : pageNumber })
  }
  const addrPerPage = ecosystem === "deprecating" && isStreams ? 10 : ecosystem === "deprecating" ? 10000 : 8
  const currentPageNum = Number(currentPage) || 1
  const lastAddr = currentPageNum * addrPerPage
  const firstAddr = lastAddr - addrPerPage

  // Pagination for testnet table
  const [testnetCurrentPage, setTestnetCurrentPage] = useQueryString("testnetPage")
  const testnetPaginate = (pageNumber) => {
    const pageStr = String(pageNumber)
    setTestnetCurrentPage(pageStr)
    updateUrlClean({ testnetPage: pageNumber === 1 ? undefined : pageNumber })
  }
  const testnetAddrPerPage = ecosystem === "deprecating" && isStreams ? 10 : ecosystem === "deprecating" ? 10000 : 8
  const testnetPageNum = Number(testnetCurrentPage) || 1
  const testnetLastAddr = testnetPageNum * testnetAddrPerPage
  const testnetFirstAddr = testnetLastAddr - testnetAddrPerPage

  // Dynamic feed categories loaded from Supabase
  const [dataFeedCategory, setDataFeedCategory] = useState([
    { key: "low", name: "Low Market Risk" },
    { key: "medium", name: "Medium Market Risk" },
    { key: "high", name: "High Market Risk" },
    { key: "veryhigh", name: "Very High Market Risk" },
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
    { key: "Stablecoin Stability Assessment", name: "Stablecoin Stability Assessment" },
  ]
  const [streamsChain] = useState(initialNetwork)
  const activeChain = isStreams ? streamsChain : currentNetwork

  // Filter chains by dataFeedType tag to get only chains that support this feed type
  const filteredChainsByTag = useMemo(() => {
    return chains.filter((chain) => {
      if (dataFeedType.includes("streams")) return chain.tags?.includes("streams") ?? false
      if (dataFeedType === "smartdata") return chain.tags?.includes("smartData") ?? false
      if (dataFeedType === "rates") return chain.tags?.includes("rates") ?? false
      if (dataFeedType === "usGovernmentMacroeconomicData")
        return chain.tags?.includes("usGovernmentMacroeconomicData") ?? false
      if (dataFeedType === "tokenizedEquity") return chain.tags?.includes("tokenizedEquity") ?? false
      return chain.tags?.includes("default") ?? false
    })
  }, [chains, dataFeedType])

  // Find the selected chain from available chains (filtered by dataFeedType)
  const selectedChain = useMemo(() => {
    // During SSR, try to find the chain from URL param if activeChain is not available
    if (!activeChain) {
      // Check if we have a network param that we can use directly
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search)
        const networkParam = urlParams.get("network")
        if (networkParam) {
          const foundFromUrl = filteredChainsByTag.find((c) => c.page === networkParam)
          if (foundFromUrl) {
            return foundFromUrl
          }
        }
      }
      return filteredChainsByTag[0] || chains[0] // fallback to first filtered chain
    }

    const foundChain = filteredChainsByTag.find((c) => c.page === activeChain)
    if (!foundChain) {
      return filteredChainsByTag[0] || chains[0]
    }
    return foundChain
  }, [activeChain, filteredChainsByTag, chains])
  const chainMetadata = useGetChainMetadata(selectedChain, initialCache && initialCache[selectedChain.page])
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
    closeAllDropdowns()
    if (!isStreams) {
      setCurrentNetwork(chain.page)
      // Clear all filters and pagination when switching networks
      setSearchValue("")
      setTestnetSearchValue("")
      setSelectedFeedCategories([])
      setCurrentPage("")
      setTestnetCurrentPage("")
      setShowOnlyMVRFeeds(false)
      setShowOnlyMVRFeedsTestnet(false)
      // Update URL with just the network (and networkType if not mainnet)
      const params = new URLSearchParams(window.location.search)
      const networkType = params.get("networkType")
      updateUrlClean({
        network: chain.page,
        networkType: networkType === "testnet" ? "testnet" : undefined,
        search: undefined,
        testnetSearch: undefined,
        page: undefined,
        testnetPage: undefined,
      })
    }
  }

  // Network type change handler for testnet/mainnet switching
  function handleNetworkTypeChange(networkType: "mainnet" | "testnet") {
    closeAllDropdowns()
    setSelectedNetworkType(networkType)

    // Reset filters and pagination when switching network types
    setSearchValue("")
    setTestnetSearchValue("")
    setSelectedFeedCategories([])
    setCurrentPage("")
    setTestnetCurrentPage("")
    setShowOnlyMVRFeeds(false)
    setShowOnlyMVRFeedsTestnet(false)

    // Update URL with clean params
    const params = new URLSearchParams(window.location.search)
    const network = params.get("network")
    updateUrlClean({
      network: network || undefined,
      networkType: networkType === "testnet" ? "testnet" : undefined,
      search: undefined,
      testnetSearch: undefined,
      page: undefined,
      testnetPage: undefined,
    })
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
    // Clean up empty search params
    if (searchValue === "") {
      updateUrlClean({ search: undefined })
    }
    if (testnetSearchValue === "") {
      updateUrlClean({ testnetSearch: undefined })
    }
  }, [searchValue, testnetSearchValue])

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

  // Available network types for current feed type
  const availableNetworkTypes = useMemo(() => {
    if (!chainMetadata.processedData?.networks) return { mainnet: false, testnet: false }

    const networkTypes = { mainnet: false, testnet: false }

    // Filter networks by feed type
    const filteredNetworks = chainMetadata.processedData.networks
      .filter((network) => {
        if (isDeprecating) {
          let foundDeprecated = false
          network.metadata?.forEach((feed: any) => {
            if (feed.feedCategory === "deprecating") {
              foundDeprecated = true
            }
          })
          // A deprecating network is relevant only if it still has at least one non-hidden deprecating feed
          if (!foundDeprecated) return false
          const hasVisible = network.metadata?.some(
            (feed: any) => feed.feedCategory === "deprecating" && !feed.docs?.hidden
          )
          return !!hasVisible
        }

        if (isStreams) return network.tags?.includes("streams")
        if (isSmartData) return network.tags?.includes("smartData")
        if (isRates) return network.tags?.includes("rates")
        if (isUSGovernmentMacroeconomicData) return network.tags?.includes("usGovernmentMacroeconomicData")

        return true
      })
      .filter((network) => {
        // Ensure the network has at least one visible feed for the current dataFeedType
        const feeds = network.metadata || []
        return feeds.some((feed: any) => isFeedVisible(feed, dataFeedType, ecosystem, { tokenizedEquityProvider }))
      })

    // Check available network types
    filteredNetworks.forEach((network) => {
      if (network.networkType === "mainnet") {
        networkTypes.mainnet = true
      } else if (network.networkType === "testnet") {
        networkTypes.testnet = true
      }
    })

    return networkTypes
  }, [
    chainMetadata.processedData?.networks,
    isDeprecating,
    isStreams,
    isSmartData,
    isRates,
    isUSGovernmentMacroeconomicData,
  ])

  // Auto-switch network type if current selection isn't available
  useEffect(() => {
    if (!chainMetadata.loading && chainMetadata.processedData) {
      const { mainnet, testnet } = availableNetworkTypes

      if (selectedNetworkType === "mainnet" && !mainnet && testnet) {
        setSelectedNetworkType("testnet")

        // Update URL parameters to reflect the auto-switch
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search)
          params.set("networkType", "testnet")
          if (!params.get("testnetPage")) {
            params.set("testnetPage", "1")
          }
          params.delete("testnetSearch") // Clear any previous testnet search
          const newUrl = window.location.pathname + "?" + params.toString()
          window.history.replaceState({ path: newUrl }, "", newUrl)
        }
      } else if (selectedNetworkType === "testnet" && !testnet && mainnet) {
        setSelectedNetworkType("mainnet")

        // Update URL parameters to reflect the auto-switch
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search)
          params.delete("networkType")
          params.delete("testnetSearch")
          const newUrl = window.location.pathname + "?" + params.toString()
          window.history.replaceState({ path: newUrl }, "", newUrl)
        }
      }
    }
  }, [
    chainMetadata.loading,
    chainMetadata.processedData,
    availableNetworkTypes,
    selectedNetworkType,
    dataFeedType,
    ecosystem,
  ])

  const streamsMainnetSectionTitle =
    dataFeedType === "streamsCrypto"
      ? "Mainnet Crypto Streams"
      : dataFeedType === "streamsNav"
        ? "Mainnet SmartData Streams"
        : dataFeedType === "streamsExRate"
          ? "Mainnet Exchange Rate Streams"
          : dataFeedType === "streamsBacked"
            ? "Mainnet Tokenized Asset Streams"
            : "Mainnet RWA Streams"
  const streamsTestnetSectionTitle =
    dataFeedType === "streamsCrypto"
      ? "Testnet Crypto Streams"
      : dataFeedType === "streamsNav"
        ? "Testnet SmartData Streams"
        : dataFeedType === "streamsExRate"
          ? "Testnet Exchange Rate Streams"
          : dataFeedType === "streamsBacked"
            ? "Testnet Tokenized Asset Streams"
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

  if (
    dataFeedType === "streamsCrypto" ||
    dataFeedType === "streamsRwa" ||
    dataFeedType === "streamsNav" ||
    dataFeedType === "streamsExRate" ||
    dataFeedType === "streamsBacked"
  ) {
    // For deprecating streams, show two separate tables: mainnet and testnet
    if (isDeprecating) {
      const mainnetDeprecatingStreams: any[] = []
      const testnetDeprecatingStreams: any[] = []

      if (initialCache) {
        Object.values(initialCache).forEach((chainData: any) => {
          // Only check Arbitrum chains for streams
          if (chainData.page === "arbitrum") {
            chainData.networks?.forEach((network: any) => {
              network.metadata?.forEach((item: any) => {
                // Only include items that are actual streams (have verifier contract type and feedId)
                // and have a shutdown date
                if (item.contractType === "verifier" && item.feedId && item.docs?.shutdownDate) {
                  const streamWithNetwork = {
                    ...item,
                    networkName: network.name,
                  }
                  if (network.networkType === "mainnet") {
                    mainnetDeprecatingStreams.push(streamWithNetwork)
                  } else if (network.networkType === "testnet") {
                    testnetDeprecatingStreams.push(streamWithNetwork)
                  }
                }
              })
            })
          }
        })
      }

      // Sort alphabetically by asset name or product name
      const sortStreams = (streams: any[]) => {
        return streams.sort((a, b) => {
          const nameA = (a.assetName || a.docs?.clicProductName || "").toUpperCase()
          const nameB = (b.assetName || b.docs?.clicProductName || "").toUpperCase()
          return nameA.localeCompare(nameB)
        })
      }

      sortStreams(mainnetDeprecatingStreams)
      sortStreams(testnetDeprecatingStreams)

      // Apply search filter for mainnet
      const filteredMainnetStreams = mainnetDeprecatingStreams.filter((stream) => {
        if (!searchValue || typeof searchValue !== "string") return true
        const searchLower = searchValue.toLowerCase()
        return (
          stream.feedId?.toLowerCase().includes(searchLower) ||
          stream.assetName?.toLowerCase().includes(searchLower) ||
          stream.feedType?.toLowerCase().includes(searchLower) ||
          stream.networkName?.toLowerCase().includes(searchLower) ||
          stream.docs?.clicProductName?.toLowerCase().includes(searchLower)
        )
      })

      // Apply search filter for testnet
      const filteredTestnetStreams = testnetDeprecatingStreams.filter((stream) => {
        if (!testnetSearchValue || typeof testnetSearchValue !== "string") return true
        const searchLower = testnetSearchValue.toLowerCase()
        return (
          stream.feedId?.toLowerCase().includes(searchLower) ||
          stream.assetName?.toLowerCase().includes(searchLower) ||
          stream.feedType?.toLowerCase().includes(searchLower) ||
          stream.networkName?.toLowerCase().includes(searchLower) ||
          stream.docs?.clicProductName?.toLowerCase().includes(searchLower)
        )
      })

      // Calculate mainnet pagination
      const paginatedMainnetStreams = filteredMainnetStreams.slice(firstAddr, lastAddr)

      // Calculate testnet pagination
      const paginatedTestnetStreams = filteredTestnetStreams.slice(testnetFirstAddr, testnetLastAddr)

      return (
        <>
          {chainMetadata.loading && !chainMetadata.processedData && !initialCache && <p>Loading...</p>}
          {chainMetadata.error && <p>There was an error loading the streams...</p>}

          <SectionWrapper title="Mainnet Deprecating Streams" depth={2}>
            <form class={feedList.filterDropdown_search}>
              <input
                id="search"
                class={feedList.filterDropdown_searchInput}
                placeholder="Search"
                value={typeof searchValue === "string" ? searchValue : ""}
                onInput={(event) => {
                  setSearchValue((event.target as HTMLInputElement).value)
                  setCurrentPage("1")
                }}
              />
            </form>
            {filteredMainnetStreams.length > 0 ? (
              <>
                <div className={feedList.tableWrapper}>
                  <table className={clsx(tableStyles.table)}>
                    <StreamsTHead />
                    <tbody>
                      {paginatedMainnetStreams.map((stream, index) => (
                        <StreamsTr key={`${stream.feedId}-${index}`} metadata={stream} isMainnet={true} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredMainnetStreams.length > addrPerPage && (
                  <div className={tableStyles.pagination} role="navigation" aria-label="Table pagination">
                    <button
                      className={button.secondary}
                      disabled={currentPageNum === 1}
                      onClick={() => paginate(currentPageNum - 1)}
                    >
                      Prev
                    </button>
                    <p aria-live="polite">
                      {firstAddr + 1}-
                      {lastAddr > filteredMainnetStreams.length ? filteredMainnetStreams.length : lastAddr} of{" "}
                      {filteredMainnetStreams.length}
                    </p>
                    <button
                      className={button.secondary}
                      disabled={lastAddr >= filteredMainnetStreams.length}
                      onClick={() => paginate(currentPageNum + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No mainnet deprecating streams found.</p>
            )}
          </SectionWrapper>

          <SectionWrapper title="Testnet Deprecating Streams" depth={2}>
            <form class={feedList.filterDropdown_search}>
              <input
                id="testnetSearch"
                class={feedList.filterDropdown_searchInput}
                placeholder="Search"
                value={typeof testnetSearchValue === "string" ? testnetSearchValue : ""}
                onInput={(event) => {
                  setTestnetSearchValue((event.target as HTMLInputElement).value)
                  setTestnetCurrentPage("1")
                }}
              />
            </form>
            {filteredTestnetStreams.length > 0 ? (
              <>
                <div className={feedList.tableWrapper}>
                  <table className={clsx(tableStyles.table)}>
                    <StreamsTHead />
                    <tbody>
                      {paginatedTestnetStreams.map((stream, index) => (
                        <StreamsTr key={`${stream.feedId}-${index}`} metadata={stream} isMainnet={false} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredTestnetStreams.length > testnetAddrPerPage && (
                  <div className={tableStyles.pagination} role="navigation" aria-label="Table pagination">
                    <button
                      className={button.secondary}
                      disabled={testnetPageNum === 1}
                      onClick={() => testnetPaginate(testnetPageNum - 1)}
                    >
                      Prev
                    </button>
                    <p aria-live="polite">
                      {testnetFirstAddr + 1}-
                      {testnetLastAddr > filteredTestnetStreams.length
                        ? filteredTestnetStreams.length
                        : testnetLastAddr}{" "}
                      of {filteredTestnetStreams.length}
                    </p>
                    <button
                      className={button.secondary}
                      disabled={testnetLastAddr >= filteredTestnetStreams.length}
                      onClick={() => testnetPaginate(testnetPageNum + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No testnet deprecating streams found.</p>
            )}
          </SectionWrapper>
        </>
      )
    }

    // Regular streams view (non-deprecating)
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
        {!isDeprecating && (
          <>
            {allowNetworkTableExpansion ? (
              <div style={{ marginBottom: "var(--space-2x)" }}>
                <StreamsNetworkAddressesTable
                  allowExpansion={allowNetworkTableExpansion}
                  defaultExpanded={defaultNetworkTableExpanded}
                />
              </div>
            ) : (
              <SectionWrapper title="Streams Verifier Network Addresses" depth={2}>
                <StreamsNetworkAddressesTable
                  allowExpansion={allowNetworkTableExpansion}
                  defaultExpanded={defaultNetworkTableExpanded}
                />
              </SectionWrapper>
            )}
          </>
        )}

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
                onFocus={closeAllDropdowns}
                onInput={(event) => {
                  closeAllDropdowns()
                  setSearchValue((event.target as HTMLInputElement).value)
                  setCurrentPage("1")
                }}
              />
            </form>
            {dataFeedType === "streamsCrypto" && (
              <div className={feedList.checkboxContainer}>
                <label className={feedList.detailsLabel}>
                  <input
                    type="checkbox"
                    style="width:15px;height:15px;display:inline;margin-right:8px;"
                    checked={showOnlyDEXFeeds}
                    onChange={() => {
                      closeAllDropdowns()
                      setShowOnlyDEXFeeds((old) => !old)
                      setCurrentPage("1") // Reset to first page when filter changes
                    }}
                  />
                  Show DEX State Price streams
                </label>
              </div>
            )}
            {dataFeedType === "streamsRwa" && (
              <>
                {!show24x5Feeds && (
                  <>
                    <FilterDropdown
                      isOpen={openDropdownId === "main-schema"}
                      onToggle={(isOpen) => handleDropdownToggle("main-schema", isOpen)}
                      onClose={closeAllDropdowns}
                      label="Filter schema"
                      options={schemaFilterOptions}
                      value={rwaSchemaFilter}
                      groupId="schema-main"
                      onSelect={(next) => {
                        setRwaSchemaFilter(next)
                        setCurrentPage("1")
                      }}
                    />
                    <FilterDropdown
                      isOpen={openDropdownId === "main-feed-type"}
                      onToggle={(isOpen) => handleDropdownToggle("main-feed-type", isOpen)}
                      onClose={closeAllDropdowns}
                      label="Filter category"
                      options={feedTypeFilterOptions}
                      value={streamCategoryFilter}
                      groupId="feed-type-main"
                      onSelect={(next) => {
                        setStreamCategoryFilter(next)
                        setCurrentPage("1")
                      }}
                    />
                  </>
                )}
                {!force24x5Only && (
                  <div className={feedList.checkboxContainer}>
                    <label className={feedList.detailsLabel}>
                      <input
                        type="checkbox"
                        style="width:15px;height:15px;display:inline;margin-right:8px;"
                        checked={show24x5Feeds}
                        onChange={() => {
                          closeAllDropdowns()
                          const newValue = !show24x5Feeds
                          setShow24x5Feeds(newValue)
                          if (newValue) {
                            // Reset trading hours filter when enabling 24/5
                            setTradingHoursFilter("all")
                          }
                          setCurrentPage("1")
                        }}
                      />
                      Show only 24/5 Equity Streams
                    </label>
                  </div>
                )}
                {show24x5Feeds && (
                  <FilterDropdown
                    isOpen={openDropdownId === "main-trading-hours"}
                    onToggle={(isOpen) => handleDropdownToggle("main-trading-hours", isOpen)}
                    onClose={closeAllDropdowns}
                    label="Time segment"
                    options={tradingHoursFilterOptions}
                    value={tradingHoursFilter}
                    groupId="trading-hours-main"
                    onSelect={(next) => {
                      setTradingHoursFilter(next)
                      setCurrentPage("1")
                    }}
                  />
                )}
                {(searchValue || rwaSchemaFilter !== "all" || streamCategoryFilter !== "all" || show24x5Feeds) && (
                  <button
                    type="button"
                    className={clsx(button.secondary, feedList.clearFilterBtn)}
                    onClick={() => {
                      closeAllDropdowns()
                      setSearchValue("")
                      setRwaSchemaFilter("all")
                      setStreamCategoryFilter("all")
                      setShow24x5Feeds(false)
                      setTradingHoursFilter("all")
                      setCurrentPage("1")
                      const inputElement = document.getElementById("search") as HTMLInputElement
                      if (inputElement) {
                        inputElement.value = ""
                      }
                    }}
                    aria-label="Clear all filters"
                  >
                    Clear filter
                  </button>
                )}
              </>
            )}
          </div>
          {chainMetadata.loading || !chainMetadata.processedData ? (
            <p style="font-style: italic;">Loading...</p>
          ) : mainnetFeeds.length > 0 ? (
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
                rwaSchemaFilter={rwaSchemaFilter}
                streamCategoryFilter={streamCategoryFilter}
                show24x5Feeds={show24x5Feeds}
                tradingHoursFilter={tradingHoursFilter}
                dataFeedType={dataFeedType}
                ecosystem={ecosystem}
                lastAddr={lastAddr}
                firstAddr={firstAddr}
                addrPerPage={addrPerPage}
                currentPage={currentPageNum}
                paginate={paginate}
                searchValue={typeof searchValue === "string" ? searchValue : ""}
                tokenizedEquityProvider={tokenizedEquityProvider}
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
                onFocus={closeAllDropdowns}
                onInput={(event) => {
                  closeAllDropdowns()
                  setTestnetSearchValue((event.target as HTMLInputElement).value)
                  setTestnetCurrentPage("1")
                }}
              />
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
            {dataFeedType === "streamsRwa" && (
              <>
                {!show24x5FeedsTestnet && (
                  <>
                    <FilterDropdown
                      isOpen={openDropdownId === "test-schema"}
                      onToggle={(isOpen) => handleDropdownToggle("test-schema", isOpen)}
                      onClose={closeAllDropdowns}
                      label="Filter schema"
                      options={schemaFilterOptions}
                      value={testnetRwaSchemaFilter}
                      groupId="schema-testnet"
                      onSelect={(next) => {
                        setTestnetRwaSchemaFilter(next)
                        setTestnetCurrentPage("1")
                      }}
                    />
                    <FilterDropdown
                      isOpen={openDropdownId === "test-feed-type"}
                      onToggle={(isOpen) => handleDropdownToggle("test-feed-type", isOpen)}
                      onClose={closeAllDropdowns}
                      label="Filter category"
                      options={feedTypeFilterOptions}
                      value={testnetStreamCategoryFilter}
                      groupId="feed-type-testnet"
                      onSelect={(next) => {
                        setTestnetStreamCategoryFilter(next)
                        setTestnetCurrentPage("1")
                      }}
                    />
                  </>
                )}
                {!force24x5Only && (
                  <div className={feedList.checkboxContainer}>
                    <label className={feedList.detailsLabel}>
                      <input
                        type="checkbox"
                        style="width:15px;height:15px;display:inline;margin-right:8px;"
                        checked={show24x5FeedsTestnet}
                        onChange={() => {
                          closeAllDropdowns()
                          const newValue = !show24x5FeedsTestnet
                          setShow24x5FeedsTestnet(newValue)
                          if (newValue) {
                            // Reset trading hours filter when enabling 24/5
                            setTestnetTradingHoursFilter("all")
                          }
                          setTestnetCurrentPage("1")
                        }}
                      />
                      Show only 24/5 Equity Streams
                    </label>
                  </div>
                )}
                {show24x5FeedsTestnet && (
                  <FilterDropdown
                    isOpen={openDropdownId === "test-trading-hours"}
                    onToggle={(isOpen) => handleDropdownToggle("test-trading-hours", isOpen)}
                    onClose={closeAllDropdowns}
                    label="Time segment"
                    options={tradingHoursFilterOptions}
                    value={testnetTradingHoursFilter}
                    groupId="trading-hours-testnet"
                    onSelect={(next) => {
                      setTestnetTradingHoursFilter(next)
                      setTestnetCurrentPage("1")
                    }}
                  />
                )}
                {(testnetSearchValue ||
                  testnetRwaSchemaFilter !== "all" ||
                  testnetStreamCategoryFilter !== "all" ||
                  show24x5FeedsTestnet) && (
                  <button
                    type="button"
                    className={clsx(button.secondary, feedList.clearFilterBtn)}
                    onClick={() => {
                      closeAllDropdowns()
                      setTestnetSearchValue("")
                      setTestnetRwaSchemaFilter("all")
                      setTestnetStreamCategoryFilter("all")
                      setShow24x5FeedsTestnet(false)
                      setTestnetTradingHoursFilter("all")
                      setTestnetCurrentPage("1")
                      const inputElement = document.getElementById("testnetSearch") as HTMLInputElement
                      if (inputElement) {
                        inputElement.value = ""
                      }
                    }}
                    aria-label="Clear all filters"
                  >
                    Clear filter
                  </button>
                )}
              </>
            )}
          </div>
          {chainMetadata.loading || !chainMetadata.processedData ? (
            <p style="font-style: italic;">Loading...</p>
          ) : testnetFeeds.length > 0 ? (
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
                rwaSchemaFilter={testnetRwaSchemaFilter}
                streamCategoryFilter={testnetStreamCategoryFilter}
                show24x5Feeds={show24x5FeedsTestnet}
                tradingHoursFilter={testnetTradingHoursFilter}
                firstAddr={testnetFirstAddr}
                lastAddr={testnetLastAddr}
                addrPerPage={testnetAddrPerPage}
                currentPage={testnetPageNum}
                paginate={testnetPaginate}
                searchValue={typeof testnetSearchValue === "string" ? testnetSearchValue : ""}
                tokenizedEquityProvider={tokenizedEquityProvider}
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
      {!isDeprecating && (
        <>
          <div
            className={feedList.clChainnavProduct}
            style={{
              marginBottom: "var(--space-4x)",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            {isHydrated && (
              <ChainSelector
                key={`chain-selector-${selectedChain.page}`} // Force re-render when chain changes
                chains={chains}
                selectedChain={selectedChain}
                onChainSelect={handleNetworkSelect}
                onNetworkTypeChange={handleNetworkTypeChange}
                dataFeedType={dataFeedType}
                availableNetworkTypes={availableNetworkTypes}
                selectedNetworkType={selectedNetworkType}
              />
            )}
          </div>
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
                // Only include actual feeds (not streams) with deprecating status
                if (feed.feedCategory === "deprecating" && !(feed.contractType === "verifier" && feed.feedId)) {
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
                    metadata: network.metadata.filter(
                      (feed: any) =>
                        feed.feedCategory === "deprecating" && !(feed.contractType === "verifier" && feed.feedId)
                    ),
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
                  currentPage={currentPageNum}
                  paginate={paginate}
                  searchValue={typeof searchValue === "string" ? searchValue : ""}
                  tokenizedEquityProvider={tokenizedEquityProvider}
                />
              </SectionWrapper>
            ))
        }

        // Handle regular network processing
        return chainMetadata.processedData?.networks
          ?.filter((network: { metadata: unknown[]; tags: string | string[]; networkType: string }) => {
            if (isDeprecating) {
              let foundDeprecated = false
              network.metadata?.forEach((feed: any) => {
                // Only include actual feeds (not streams) with deprecating status
                if (feed.feedCategory === "deprecating" && !(feed.contractType === "verifier" && feed.feedId)) {
                  foundDeprecated = true
                }
              })
              if (foundDeprecated) {
                netCount++
              }
              return foundDeprecated && network.networkType === selectedNetworkType
            }

            if (isStreams) return network.tags?.includes("streams") && network.networkType === selectedNetworkType

            if (isSmartData) return network.tags?.includes("smartData") && network.networkType === selectedNetworkType

            if (isRates) return network.tags?.includes("rates") && network.networkType === selectedNetworkType

            if (isUSGovernmentMacroeconomicData)
              return (
                network.tags?.includes("usGovernmentMacroeconomicData") && network.networkType === selectedNetworkType
              )

            // Filter by selected network type (mainnet/testnet)
            return network.networkType === selectedNetworkType
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
                  {network.networkType === "mainnet" ? (
                    <>
                      {!isStreams && selectedChain.l2SequencerFeed && (
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
                              onFocus={closeAllDropdowns}
                              onInput={(event) => {
                                closeAllDropdowns()
                                setSearchValue((event.target as HTMLInputElement).value)
                                setCurrentPage("1")
                              }}
                            />
                            {searchValue && (
                              <button
                                type="button"
                                className={clsx(button.secondary, feedList.clearFilterBtn)}
                                onClick={() => {
                                  closeAllDropdowns()
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
                                onChange={() => setShowExtraDetails(!showExtraDetails)}
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
                                onChange={() => setShowOnlySVR(!showOnlySVR)}
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
                        currentPage={currentPageNum}
                        paginate={paginate}
                        searchValue={typeof searchValue === "string" ? searchValue : ""}
                        tokenizedEquityProvider={tokenizedEquityProvider}
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
                                onChange={() => setShowExtraDetails(!showExtraDetails)}
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
                        currentPage={testnetPageNum}
                        paginate={testnetPaginate}
                        searchValue={typeof testnetSearchValue === "string" ? testnetSearchValue : ""}
                        tokenizedEquityProvider={tokenizedEquityProvider}
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
    </SectionWrapper>
  )
}
