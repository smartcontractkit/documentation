import { fallbackTokenIconUrl } from "~/features/utils"
import "./TokenCard.css"

interface TokenCardProps {
  name: string
  logo?: string
  basePath: string
}

function TokenCard({ name, logo, basePath }: TokenCardProps) {
  return (
    <a href={`${basePath}/token/${name}`}>
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
