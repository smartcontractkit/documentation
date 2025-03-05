import { useEffect, useState } from "react"
import NetworkCard from "../Cards/NetworkCard"
import SeeMore from "../SeeMore/SeeMore"
import "./NetworkGrid.css"

interface NetworkGridProps {
  networks: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  environment: string
}

const BEFORE_SEE_MORE = 2 * 7 // Number of networks to show before the "See more" button, 2 rows x 8 items

function NetworkGrid({ networks, environment }: NetworkGridProps) {
  const [seeMore, setSeeMore] = useState(networks.length <= BEFORE_SEE_MORE)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("showAll") === "true") {
      setSeeMore(true)
    }
  }, [])

  const handleSeeMoreClick = () => {
    setSeeMore(true)
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("showAll", "true")
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`
    window.history.replaceState({ path: newUrl }, "", newUrl)
  }

  return (
    <>
      <div className="networks__grid">
        {networks.slice(0, seeMore ? networks.length : BEFORE_SEE_MORE).map((chain) => (
          <a href={`/ccip/directory/${environment}/chain/${chain.chain}`} key={chain.chain}>
            <NetworkCard
              name={chain.name}
              totalLanes={chain.totalLanes}
              totalTokens={chain.totalTokens}
              logo={chain.logo}
              key={chain.chain}
            />
          </a>
        ))}
      </div>
      {!seeMore && <SeeMore onClick={handleSeeMoreClick} />}
    </>
  )
}

export default NetworkGrid
