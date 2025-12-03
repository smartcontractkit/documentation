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
}

const TokenCard = memo(function TokenCard({ id, logo, link, onClick, totalNetworks }: TokenCardProps) {
  const logoElement = (
    <object data={logo} type="image/png" aria-label={`${id} token logo`}>
      <img src={fallbackTokenIconUrl} alt={`${id} token logo`} loading="lazy" />
    </object>
  )

  const subtitle =
    totalNetworks !== undefined ? `${totalNetworks} ${totalNetworks === 1 ? "network" : "networks"}` : undefined

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
