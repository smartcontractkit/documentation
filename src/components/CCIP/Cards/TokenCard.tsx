import { fallbackTokenIconUrl } from "~/features/utils"
import "./TokenCard.css"

interface TokenCardProps {
  name: string
  logo?: string
}

function TokenCard({ name, logo }: TokenCardProps) {
  return (
    <a href={`/ccip/token/${name}`}>
      <div className="token-card__container">
        <img
          src={logo}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = fallbackTokenIconUrl
          }}
        />
        <h3>{name}</h3>
      </div>
    </a>
  )
}

export default TokenCard
