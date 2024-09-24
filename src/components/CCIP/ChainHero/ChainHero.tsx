import Breadcrumb from "../Breadcrumb/Breadcrumb"
import Search from "../Search/Search"
import "./ChainHero.css"

interface ChainHeroProps {
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
  network: {
    name: string
    logo: string
    totalLanes: number
    totalTokens: number
    chain: string
  }
}

function ChainHero({ chains, tokens, network }: ChainHeroProps) {
  return (
    <section className="ccip-hero">
      <img src="/assets/ccip.png" alt="" className="ccip-hero__grid" />

      <div className="ccip-hero__content layout">
        <div className="ccip-hero__top">
          <Breadcrumb
            items={[
              {
                name: "Networks & Tokens",
                url: "/ccip",
              },
              {
                name: "Current",
                url: `/ccip/${network.chain}`,
              },
            ]}
          />
          <div className="ccip-hero__chainSearch">
            <Search chains={chains} tokens={tokens} small />
          </div>
        </div>

        <h1 className="ccip-hero__heading">
          <img src={network.logo} alt="" />
          {network.name}
        </h1>
        <div className="ccip-hero__details">
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Router</div>
            <div className="ccip-hero__details__value">0x9402...E6e5</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Chain selector</div>
            <div className="ccip-hero__details__value">6433500567565415381</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">RMN</div>
            <div className="ccip-hero__details__value">n/a</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token admin registry</div>
            <div className="ccip-hero__details__value">n/a</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Registry module owner</div>
            <div className="ccip-hero__details__value">n/a</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChainHero
