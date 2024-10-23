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
          {/* We cannot use the normal Image/onError syntax as a fallback as the element is server rendered 
          and the onerror does not seem to work correctly. Using Picutre will also not work. */}
          <object data={logo} type="image/png">
            <img src={fallbackTokenIconUrl} alt="" />
          </object>
          <h3>{name}</h3>
        </div>
      </a>
    )
  }

  if (onClick) {
    return (
      <div className="token-card__container" onClick={onClick} role="button">
        <object data={logo} type="image/png">
          <img src={fallbackTokenIconUrl} alt="" />
        </object>
        <h3>{name}</h3>
      </div>
    )
  }

  return (
    <div className="token-card__container">
      <object data={logo} type="image/png">
        <img src={fallbackTokenIconUrl} alt="" />
      </object>
      <h3>{name}</h3>
    </div>
  )
}

export default TokenCard
