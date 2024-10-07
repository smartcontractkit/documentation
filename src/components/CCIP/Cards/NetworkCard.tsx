import "./NetworkCard.css"

interface NetworkCardProps {
  name: string
  totalLanes: number
  totalTokens: number
  logo: string
}

function NetworkCard({ name, totalLanes, totalTokens, logo }: NetworkCardProps) {
  return (
    <div className="network-card__container">
      <img src={logo} alt="" />
      <div>
        <h3>{name}</h3>
        <p>
          {totalLanes} lanes | {totalTokens} tokens
        </p>
      </div>
    </div>
  )
}

export default NetworkCard
