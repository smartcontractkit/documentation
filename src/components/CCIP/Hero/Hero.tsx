import { Environment, LaneConfig } from "~/config/data/ccip/index.ts"
import Search from "../Search/Search.tsx"
import "./Hero.css"
import { ChainType, ExplorerInfo } from "~/config/types.ts"

interface HeroProps {
  // Full datasets (used for search)
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

  // Curated datasets (used for display, if needed)
  featuredChains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  featuredTokens: {
    id: string
    totalNetworks: number
    logo: string
  }[]

  lanes: {
    sourceNetwork: {
      name: string
      logo: string
      key: string
      chainType: ChainType
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
      chainType: ChainType
    }
    lane: LaneConfig
  }[]

  environment: Environment
}

function Hero({
  chains,
  tokens,
  featuredChains, // currently unused but reserved for UI
  featuredTokens, // currently unused but reserved for UI
  environment,
  lanes,
}: HeroProps) {
  return (
    <section className="ccip-hero">
      <div className="ccip-hero__content">
        <h1 className="ccip-hero__heading">CCIP Directory</h1>

        {/* Search must always use FULL datasets */}
        <Search chains={chains} tokens={tokens} environment={environment} lanes={lanes} />
      </div>
    </section>
  )
}

export default Hero
