import { memo } from "react"
import Card from "./Card.tsx"

interface NetworkCardProps {
  name: string
  totalLanes: number
  totalTokens: number
  logo: string
}

const NetworkCard = memo(function NetworkCard({ name, totalLanes, totalTokens, logo }: NetworkCardProps) {
  const subtitle = `${totalLanes} ${totalLanes === 1 ? "lane" : "lanes"} | ${totalTokens} ${totalTokens === 1 ? "token" : "tokens"}`

  return <Card logo={<img src={logo} alt="" loading="lazy" />} title={name} subtitle={subtitle} />
})

export default NetworkCard
