import { useState, useEffect, useRef } from "react"
import "./Search.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { useClickOutside } from "~/hooks/useClickOutside.tsx"
import { Environment, LaneConfig, LaneFilter } from "~/config/data/ccip/types.ts"
import { directoryToSupportedChain, getExplorer, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import { drawerContentStore, drawerWidthStore, DrawerWidth } from "../Drawer/drawerStore.ts"
import LaneDrawer from "../Drawer/LaneDrawer.tsx"
import { ChainType, ExplorerInfo } from "~/config/types.ts"
import type { WorkerMessage, WorkerResponse } from "~/workers/data-worker.ts"

interface SearchProps {
  chains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  tokens: {
    id: string
    totalNetworks: number
    logo: string
  }[]
  lanes: {
    sourceNetwork: {
      name: string
      logo: string
      key: string
      chainType: ChainType
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
      chainType: ChainType
    }
    lane: LaneConfig
  }[]
  small?: boolean
  environment: Environment
}

function Search({ chains, tokens, small, environment, lanes }: SearchProps) {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [openSearchMenu, setOpenSearchMenu] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [networksResults, setNetworksResults] = useState<typeof chains>([])
  const [tokensResults, setTokensResults] = useState<typeof tokens>([])
  const [lanesResults, setLanesResults] = useState<typeof lanes>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const workerReadyRef = useRef(false)

  // Lazily initialize Web Worker on first interaction
  const ensureWorker = () => {
    if (workerReadyRef.current || typeof window === "undefined") return
    workerRef.current = new Worker(new URL("~/workers/data-worker.ts", import.meta.url), { type: "module" })
    workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { networks, tokens: workerTokens, lanes: workerLanes } = event.data
      setNetworksResults(networks || [])
      setTokensResults(workerTokens || [])
      setLanesResults(workerLanes || [])
    }
    workerReadyRef.current = true
  }

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Filter data using Web Worker
  useEffect(() => {
    if (!debouncedSearch) {
      setNetworksResults([])
      setTokensResults([])
      setLanesResults([])
      return
    }

    // Ensure worker exists before posting message
    if (!workerReadyRef.current) ensureWorker()
    if (workerRef.current) {
      const message: WorkerMessage = {
        search: debouncedSearch,
        data: {
          chains,
          tokens,
          lanes,
        },
      }
      workerRef.current.postMessage(message)
    }
  }, [debouncedSearch, chains, tokens, lanes])

  // Handle menu visibility
  useEffect(() => {
    if (debouncedSearch) {
      setOpenSearchMenu(true)
    } else {
      setOpenSearchMenu(false)
    }
  }, [debouncedSearch])

  useClickOutside(searchRef, () => setOpenSearchMenu(false), { enabled: openSearchMenu })

  const generateExplorerUrl = (lane): ExplorerInfo => {
    const directory = directoryToSupportedChain(lane.sourceNetwork.key)
    const explorer = getExplorer(directory)

    if (!explorer) {
      // Provide an empty object if no explorer is found
      return {
        baseUrl: "",
      }
    }

    return explorer
  }
  return (
    <>
      {openSearchMenu && <div className="ccip-hero__search-overlay"></div>}
      <div
        className={clsx("ccip-hero__search", {
          active: isActive,
          small: small || false,
          open: openSearchMenu,
        })}
        ref={searchRef}
      >
        <img src="/assets/icons/search.svg" alt="Search icon" />
        <input
          type="search"
          placeholder="Network/Token/Lane"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setIsActive(true)
            ensureWorker()
          }}
          onBlur={() => setIsActive(false)}
          aria-label="Search networks, tokens, and lanes"
          aria-describedby={openSearchMenu ? "search-results" : undefined}
        />
        {openSearchMenu && (
          <div
            id="search-results"
            className={clsx("ccip-hero__search-results", {
              "ccip-hero__search-results--small": small || false,
            })}
            role="region"
            aria-live="polite"
            aria-label="Search results"
          >
            {networksResults.length === 0 && tokensResults.length === 0 && (
              <span className="ccip-hero__search-results__no-result">No results found</span>
            )}
            {networksResults.length > 0 && (
              <>
                <span className="ccip-hero__search-results__title">Networks</span>
                <ul aria-label="Networks">
                  {networksResults.map((network) => (
                    <li key={network.name}>
                      <a href={`/ccip/directory/${environment}/chain/${network.chain}`}>
                        <img
                          src={network.logo}
                          alt={`${network.name} blockchain logo`}
                          loading="lazy"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null // prevents looping
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                        {network.name}
                        {!small && (
                          <span>
                            {network.totalLanes} {network.totalLanes > 1 ? "lanes" : "lane"} | {network.totalTokens}{" "}
                            {network.totalTokens > 1 ? "tokens" : "token"}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {tokensResults.length > 0 && (
              <>
                <span className="ccip-hero__search-results__title">Tokens</span>
                <ul aria-label="Tokens">
                  {tokensResults.map((token) => (
                    <li key={token.id}>
                      <a href={`/ccip/directory/${environment}/token/${token.id}`}>
                        <img
                          src={token.logo}
                          alt={`${token.id} token logo`}
                          loading="lazy"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null // prevents looping
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                        {token.id}
                        {!small && (
                          <span>
                            {token.totalNetworks} {token.totalNetworks > 1 ? "networks" : "network"}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {lanesResults.length > 0 && (
              <>
                <span className="ccip-hero__search-results__title">Lanes</span>
                <ul aria-label="Lanes">
                  {lanesResults.map((lane) => (
                    <li key={lane.sourceNetwork.name + lane.destinationNetwork.key}>
                      <button
                        type="button"
                        onClick={() => {
                          drawerWidthStore.set(DrawerWidth.Wide)
                          drawerContentStore.set(() => (
                            <LaneDrawer
                              environment={environment}
                              lane={lane.lane}
                              sourceNetwork={lane.sourceNetwork}
                              destinationNetwork={{
                                ...lane.destinationNetwork,
                              }}
                              inOutbound={LaneFilter.Outbound}
                              explorer={generateExplorerUrl(lane)}
                            />
                          ))
                        }}
                        aria-label={`View lane from ${lane.sourceNetwork.name} to ${lane.destinationNetwork.name}`}
                      >
                        <div className="ccip-hero__search-results__lane-images">
                          <img
                            src={lane.sourceNetwork.logo}
                            alt={`${lane.sourceNetwork.name} source blockchain logo`}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null // prevents looping
                              currentTarget.src = fallbackTokenIconUrl
                            }}
                          />
                          <img
                            src={lane.destinationNetwork.logo}
                            alt={`${lane.destinationNetwork.name} destination blockchain logo`}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null // prevents looping
                              currentTarget.src = fallbackTokenIconUrl
                            }}
                          />
                        </div>
                        {lane.sourceNetwork.name} {">"} {lane.destinationNetwork.name}
                        {!small && (
                          <span>
                            {lane?.lane?.supportedTokens ? Object.keys(lane.lane.supportedTokens).length : 0}{" "}
                            {lane?.lane?.supportedTokens && Object.keys(lane.lane.supportedTokens).length > 1
                              ? "tokens"
                              : "token"}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Search
