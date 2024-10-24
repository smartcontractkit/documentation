import { useState } from "react"
import SeeMore from "../SeeMore/SeeMore"
import "./TokenGrid.css"
import TokenCard from "../Cards/TokenCard"

interface TokenGridProps {
  tokens: {
    name: string
    logo: string
  }[]
  environment: string
}

const BEFORE_SEE_MORE = 6 * 4 // Number of networks to show before the "See more" button, 7 rows x 4 items

function NetworkGrid({ tokens, environment }: TokenGridProps) {
  const [seeMore, setSeeMore] = useState(tokens.length <= BEFORE_SEE_MORE)
  return (
    <>
      <div className="tokens__grid">
        {tokens.slice(0, seeMore ? tokens.length : BEFORE_SEE_MORE).map((token) => (
          <TokenCard
            name={token.name}
            logo={token.logo}
            link={`/ccip/supported-networks/${environment}/token/${token.name}`}
          />
        ))}
      </div>
      {!seeMore && <SeeMore onClick={() => setSeeMore(!seeMore)} />}
    </>
  )
}

export default NetworkGrid
