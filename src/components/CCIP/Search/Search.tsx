import { useState, useEffect, useRef } from "react"
import "./Search.css"
import { clsx } from "~/lib"
import { useClickOutside } from "~/hooks/useClickOutside"

interface SearchProps {
  chains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  tokens: {
    name: string
    totalNetworks: number
    logo: string
  }[]
  small?: boolean
}

function Search({ chains, tokens, small }: SearchProps) {
  const [search, setSearch] = useState("")
  const [openSearchMenu, setOpenSearchMenu] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [networksResults, setNetworksResults] = useState<SearchProps["chains"]>([])
  const [tokensResults, setTokensResults] = useState<SearchProps["tokens"]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (search) {
      const networks = chains.filter((chain) => chain.name.toLowerCase().includes(search.toLowerCase()))
      const tokensList = tokens.filter((token) => token.name.toLowerCase().includes(search.toLowerCase()))

      setNetworksResults(networks)
      setTokensResults(tokensList)
      setOpenSearchMenu(true)
    } else {
      setNetworksResults([])
      setTokensResults([])
      setOpenSearchMenu(false)
    }
  }, [search, chains, tokens])

  useClickOutside(searchRef, () => setOpenSearchMenu(false))

  return (
    <div
      className={clsx("ccip-hero__search", {
        active: isActive,
        small: small || false,
      })}
      ref={searchRef}
    >
      <img src="/assets/icons/search.svg" alt="" />
      <input
        type="search"
        placeholder="Network/Token/Lane"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
      {openSearchMenu && (
        <div className="ccip-hero__search-results">
          {networksResults.length === 0 && tokensResults.length === 0 && (
            <span className="ccip-hero__search-results__title">No results found</span>
          )}
          {networksResults.length > 0 && (
            <>
              <span className="ccip-hero__search-results__title">Networks</span>
              <ul aria-label="Networks">
                {networksResults.map((network) => (
                  <li key={network.name}>
                    <a href={`/ccip/chain/${network.chain}`}>
                      <img src={network.logo} alt="" />
                      {network.name}
                      <span>
                        {network.totalLanes} lanes | {network.totalTokens} tokens
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {tokensResults.length > 0 && (
            <>
              <span className="ccip-hero__search-results__title">Tokens</span>
              <ul aria-label="Networks">
                {tokensResults.map((token) => (
                  <li key={token.name}>
                    <a href={`/ccip/token/${token.name}`}>
                      <img src={token.logo} alt="" />
                      {token.name}
                      <span>{token.totalNetworks} networks</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
