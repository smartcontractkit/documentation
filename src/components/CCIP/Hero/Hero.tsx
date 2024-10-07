import { Environment } from "~/config/data/ccip"
import Search from "../Search/Search"
import "./Hero.css"

interface HeroProps {
  chains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
  }[]
  tokens: {
    name: string
    totalNetworks: number
    logo: string
  }[]
  environment: Environment
}

function Hero({ chains, tokens, environment }: HeroProps) {
  return (
    <section className="ccip-hero">
      <img src="/assets/ccip.png" alt="" className="ccip-hero__grid" />
      <div className="ccip-hero__content">
        <h1 className="ccip-hero__heading">CCIP Directory</h1>
        <Search chains={chains} tokens={tokens} environment={environment} />
      </div>
    </section>
  )
}

export default Hero
