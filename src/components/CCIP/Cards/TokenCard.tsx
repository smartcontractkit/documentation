import { fallbackTokenIconUrl, getTokenIconUrl } from "~/features/utils"
import "./TokenCard.css"

interface TokenCardProps {
  token: string
}

function TokenCard({ token }: TokenCardProps) {
  return (
    <div className="token-card__container">
      <img
        src={`${getTokenIconUrl(token)}`}
        alt=""
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src = fallbackTokenIconUrl
        }}
      />
      <h3>{token}</h3>
    </div>
  )
}

export default TokenCard
