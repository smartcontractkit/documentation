import { useState, useEffect } from "react"
import "./Search.css"
import { clsx } from "~/lib"

interface SearchProps {
  chains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
  }[]
  tokens: {
    name: string
    totalNetworks: number
    logo: string
  }[]
}

function Search({ chains, tokens }: SearchProps) {
  const [search, setSearch] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [networksResults, setNetworksResults] = useState<SearchProps["chains"]>([])
  const [tokensResults, setTokensResults] = useState<SearchProps["tokens"]>([])

  useEffect(() => {
    if (search) {
      const networks = chains.filter((chain) => chain.name.toLowerCase().includes(search.toLowerCase()))
      const tokensList = tokens.filter((token) => token.name.toLowerCase().includes(search.toLowerCase()))

      setNetworksResults(networks)
      setTokensResults(tokensList)
    } else {
      setNetworksResults([])
      setTokensResults([])
    }
  }, [search, chains, tokens])

  return (
    <div
      className={clsx("ccip-hero__search", {
        active: isActive,
      })}
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
      {search && (
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
                    <img src={network.logo} alt="" />
                    {network.name}
                    <span>
                      {network.totalLanes} lanes | {network.totalTokens} tokens
                    </span>
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
                    <img src={token.logo} alt="" />
                    {token.name}
                    <span>{token.totalNetworks} networks</span>
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
