import { memo } from "react"
import { fallbackTokenIconUrl } from "~/features/utils/index.ts"
import "./TokenCard.css"

interface TokenCardProps {
  id: string
  logo?: string
  link?: string
  onClick?: () => void
}

const TokenCard = memo(function TokenCard({ id, logo, link, onClick }: TokenCardProps) {
  if (link) {
    return (
      <a href={link}>
        <div className="token-card__container">
          {/* We cannot use the normal Image/onError syntax as a fallback as the element is server rendered 
          and the onerror does not seem to work correctly. Using Picture will also not work. */}
          <object data={logo} type="image/png" aria-label={`${id} token logo`}>
            <img src={fallbackTokenIconUrl} alt={`${id} token logo`} loading="lazy" />
          </object>
          <h3>{id}</h3>
        </div>
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" className="token-card__container" onClick={onClick} aria-label={`View ${id} token details`}>
        <object data={logo} type="image/png" aria-label={`${id} token logo`}>
          <img src={fallbackTokenIconUrl} alt={`${id} token logo`} loading="lazy" />
        </object>
        <h3>{id}</h3>
      </button>
    )
  }

  return (
    <div className="token-card__container">
      <object data={logo} type="image/png">
        <img src={fallbackTokenIconUrl} alt="" loading="lazy" />
      </object>
      <h3>{id}</h3>
    </div>
  )
})

export default TokenCard
