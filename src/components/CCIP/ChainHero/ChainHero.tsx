import { Environment } from "~/config/data/ccip"
import Address from "../Address/Address"
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
  network?: {
    name: string
    logo: string
    totalLanes: number
    totalTokens: number
    chain: string
  }
  token?: {
    name: string
    logo: string
  }
  environment: Environment
}

function ChainHero({ chains, tokens, network, token, environment }: ChainHeroProps) {
  return (
    <section className="ccip-hero">
      <img src="/assets/ccip.png" alt="" className="ccip-hero__grid" />

      <div className="ccip-hero__content layout">
        <div className="ccip-hero__top">
          <Breadcrumb
            items={[
              {
                name: "CCIP Directory",
                url: `/ccip/supported-networks/${environment}`,
              },
              {
                name: "Current",
                url: network
                  ? `/ccip/supported-networks/${environment}/chain/${network.chain}`
                  : `/ccip/supported-networks/${environment}/token/${token?.name}`,
              },
            ]}
          />
          <div className="ccip-hero__chainSearch">
            <Search chains={chains} tokens={tokens} small environment={environment} />
          </div>
        </div>

        <h1 className="ccip-hero__heading">
          <img src={network?.logo || token?.logo} alt="" />
          {network?.name || token?.name}
        </h1>
        {network && (
          <div className="ccip-hero__details">
            <div className="ccip-hero__details__item">
              <div className="ccip-hero__details__label">Router</div>
              <div className="ccip-hero__details__value">
                <Address
                  endLength={4}
                  contractUrl="https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
                />
              </div>
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
        )}
      </div>
    </section>
  )
}

export default ChainHero
