import { useState, useEffect, useRef } from "react"
import "./Search.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { useClickOutside } from "~/hooks/useClickOutside.tsx"
import { Environment, LaneConfig, LaneFilter } from "~/config/data/ccip/types.ts"
import { directoryToSupportedChain, getExplorer, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import { drawerContentStore } from "../Drawer/drawerStore.ts"
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

  // --- Worker (client only) ---
  const ensureWorker = () => {
    if (workerReadyRef.current) return
    if (typeof window === "undefined") return

    workerRef.current = new Worker(new URL("../../../workers/data-worker.ts", import.meta.url), { type: "module" })

    workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { networks, tokens: workerTokens, lanes: workerLanes } = event.data
      setNetworksResults(networks || [])
      setTokensResults(workerTokens || [])
      setLanesResults(workerLanes || [])
    }

    workerReadyRef.current = true
  }

  // Cleanup
  useEffect(() => {
    return () => workerRef.current?.terminate()
  }, [])

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Execute search
  useEffect(() => {
    if (!debouncedSearch) {
      setNetworksResults([])
      setTokensResults([])
      setLanesResults([])
      return
    }

    ensureWorker()
    if (!workerRef.current) return

    const message: WorkerMessage = {
      search: debouncedSearch,
      data: { chains, tokens, lanes },
    }

    workerRef.current.postMessage(message)
  }, [debouncedSearch, chains, tokens, lanes])

  // Menu visibility
  useEffect(() => {
    setOpenSearchMenu(!!debouncedSearch)
  }, [debouncedSearch])

  useClickOutside(searchRef, () => setOpenSearchMenu(false), {
    enabled: openSearchMenu,
  })

  const generateExplorerUrl = (lane): ExplorerInfo => {
    const directory = directoryToSupportedChain(lane.sourceNetwork.key)
    return getExplorer(directory) || { baseUrl: "" }
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
        />

        {openSearchMenu && (
          <div
            id="search-results"
            className={clsx("ccip-hero__search-results", {
              "ccip-hero__search-results--small": small || false,
            })}
          >
            {networksResults.length === 0 && tokensResults.length === 0 && lanesResults.length === 0 && (
              <span className="ccip-hero__search-results__no-result">No results found</span>
            )}

            {/* Networks */}
            {networksResults.length > 0 && (
              <>
                <span className="ccip-hero__search-results__title">Networks</span>
                <ul>
                  {networksResults.map((network) => (
                    <li key={network.name}>
                      <a href={`/ccip/directory/${environment}/chain/${network.chain}`}>
                        <img
                          src={network.logo}
                          alt={network.name}
                          onError={({ currentTarget }) => {
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                        {network.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Tokens */}
            {tokensResults.length > 0 && (
              <>
                <span className="ccip-hero__search-results__title">Tokens</span>
                <ul>
                  {tokensResults.map((token) => (
                    <li key={token.id}>
                      <a href={`/ccip/directory/${environment}/token/${token.id}`}>
                        <img
                          src={token.logo}
                          alt={token.id}
                          onError={({ currentTarget }) => {
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                        {token.id}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Lanes (with icons restored) */}
            {lanesResults.length > 0 && (
              <>
                <span className="ccip-hero__search-results__title">Lanes</span>
                <ul>
                  {lanesResults.map((lane) => (
                    <li key={lane.sourceNetwork.name + lane.destinationNetwork.key}>
                      <button
                        type="button"
                        onClick={() =>
                          drawerContentStore.set(() => (
                            <LaneDrawer
                              environment={environment}
                              lane={lane.lane}
                              sourceNetwork={lane.sourceNetwork}
                              destinationNetwork={lane.destinationNetwork}
                              inOutbound={LaneFilter.Outbound}
                              explorer={generateExplorerUrl(lane)}
                            />
                          ))
                        }
                      >
                        <div className="ccip-hero__search-results__lane-images">
                          <img
                            src={lane.sourceNetwork.logo}
                            alt={lane.sourceNetwork.name}
                            onError={({ currentTarget }) => {
                              currentTarget.src = fallbackTokenIconUrl
                            }}
                          />
                          <img
                            src={lane.destinationNetwork.logo}
                            alt={lane.destinationNetwork.name}
                            onError={({ currentTarget }) => {
                              currentTarget.src = fallbackTokenIconUrl
                            }}
                          />
                        </div>
                        {lane.sourceNetwork.name} {" > "} {lane.destinationNetwork.name}
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
