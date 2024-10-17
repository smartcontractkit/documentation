import { fallbackTokenIconUrl } from "~/features/utils"
import "./TokenCard.css"

interface TokenCardProps {
  name: string
  logo?: string
  link?: string
  onClick?: () => void
}

function TokenCard({ name, logo, link, onClick }: TokenCardProps) {
  if (link) {
    return (
      <a href={link}>
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

  if (onClick) {
    return (
      <div className="token-card__container" onClick={onClick} role="button">
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
    )
  }

  return (
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
  )
}

export default TokenCard
