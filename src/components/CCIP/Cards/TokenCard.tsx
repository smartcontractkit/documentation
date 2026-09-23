import { memo } from "react"
import { fallbackTokenIconUrl } from "~/features/utils/index.ts"
import Card from "./Card.tsx"
import "./TokenCard.css"

interface TokenCardProps {
  id: string
  logo?: string
  link?: string
  onClick?: () => void
  totalNetworks?: number
  variant?: "default" | "square"
}

const TokenCard = memo(function TokenCard({
  id,
  logo,
  link,
  onClick,
  totalNetworks,
  variant = "default",
}: TokenCardProps) {
  const logoElement = (
    <object data={logo} type="image/png" aria-label={`${id} token logo`}>
      <img src={fallbackTokenIconUrl} alt={`${id} token logo`} loading="lazy" />
    </object>
  )

  const subtitle =
    totalNetworks !== undefined ? `${totalNetworks} ${totalNetworks === 1 ? "network" : "networks"}` : undefined

  if (variant === "square") {
    const content = (
      <>
        <div className="token-card__square-logo">{logoElement}</div>
        <div className="token-card__square-content">
          <h3>{id}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </>
    )

    if (link) {
      return (
        <a href={link} aria-label={`View ${id} token details`}>
          <div className="token-card__square-container">{content}</div>
        </a>
      )
    }

    if (onClick) {
      return (
        <button
          type="button"
          className="token-card__square-container"
          onClick={onClick}
          aria-label={`View ${id} token details`}
        >
          {content}
        </button>
      )
    }

    return <div className="token-card__square-container">{content}</div>
  }

  return (
    <Card
      logo={logoElement}
      title={id}
      subtitle={subtitle}
      link={link}
      onClick={onClick}
      ariaLabel={`View ${id} token details`}
    />
  )
})

export default TokenCard
