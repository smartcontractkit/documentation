import { Environment, LaneConfig } from "~/config/data/ccip/index.ts"
import Search from "../Search/Search.tsx"
import "./Hero.css"
import { ExplorerInfo } from "~/config/types.ts"

interface HeroProps {
  chains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  tokens: {
    id: string
    totalNetworks: number
    logo: string
  }[]
  lanes: {
    sourceNetwork: {
      name: string
      logo: string
      key: string
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
    }
    lane: LaneConfig
  }[]
  environment: Environment
}

function Hero({ chains, tokens, environment, lanes }: HeroProps) {
  return (
    <section className="ccip-hero">
      <div className="ccip-hero__content">
        <h1 className="ccip-hero__heading">CCIP Directory</h1>
        <Search chains={chains} tokens={tokens} environment={environment} lanes={lanes} />
      </div>
    </section>
  )
}

export default Hero
