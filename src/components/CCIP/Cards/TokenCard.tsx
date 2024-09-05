import "./TokenCard.css"

interface TokenCardProps {
  name: string
  logo: string
}

function TokenCard({ name, logo }: TokenCardProps) {
  return (
    <div className="token-card__container">
      <img src={logo} alt="" />
      <h3>{name}</h3>
    </div>
  )
}

export default TokenCard
