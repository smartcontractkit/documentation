import { memo } from "react"
import "./NetworkCard.css"

interface NetworkCardProps {
  name: string
  totalLanes: number
  totalTokens: number
  logo: string
}

const NetworkCard = memo(function NetworkCard({ name, totalLanes, totalTokens, logo }: NetworkCardProps) {
  return (
    <div className="network-card__container">
      <img src={logo} alt="" loading="lazy" />
      <div>
        <h3>{name}</h3>
        <p>
          {totalLanes} {totalLanes > 1 ? "lanes" : "lane"} | {totalTokens} {totalTokens > 1 ? "tokens" : "token"}
        </p>
      </div>
    </div>
  )
})

export default NetworkCard
