import { useEffect, useState } from "react"
import SeeMore from "../SeeMore/SeeMore"
import "./TokenGrid.css"
import TokenCard from "../Cards/TokenCard"

interface TokenGridProps {
  tokens: {
    id: string
    logo: string
  }[]
  environment: string
}

const BEFORE_SEE_MORE = 6 * 4 // Number of networks to show before the "See more" button, 7 rows x 4 items

function NetworkGrid({ tokens, environment }: TokenGridProps) {
  const [seeMore, setSeeMore] = useState(tokens.length <= BEFORE_SEE_MORE)

  // Enables displaying all content when `showAll=true` is present in the URL query parameters.
  // This is added to help expose additional content for the Algolia crawler.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("showAll") === "true") {
      setSeeMore(true)
    }
  }, [])

  return (
    <>
      <div className="tokens__grid">
        {tokens.slice(0, seeMore ? tokens.length : BEFORE_SEE_MORE).map((token) => (
          <TokenCard
            id={token.id}
            key={token.id}
            logo={token.logo}
            link={`/ccip/directory/${environment}/token/${token.id}`}
          />
        ))}
      </div>
      {!seeMore && <SeeMore onClick={() => setSeeMore(!seeMore)} />}
    </>
  )
}

export default NetworkGrid
