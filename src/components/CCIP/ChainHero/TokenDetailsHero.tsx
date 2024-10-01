import Address from "../Address/Address"
import "./ChainHero.css"

interface TokenDetailsHeroProps {
  network?: {
    name: string
    logo: string
  }
  token?: {
    name: string
    logo: string
    decimals: number
    address: string
    poolType: string
    poolAddress: string
  }
}

function TokenDetailsHero({ network, token }: TokenDetailsHeroProps) {
  return (
    <section className="ccip-hero">
      <div className="ccip-hero__content layout">
        <h1 className="ccip-hero__heading">
          <img src={network?.logo || token?.logo} alt="" />
          {network?.name || token?.name}
        </h1>

        <div className="ccip-hero__details">
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Network</div>
            <div className="ccip-hero__details__value">Avalanche</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Decimals</div>
            <div className="ccip-hero__details__value">18</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token address</div>
            <div className="ccip-hero__details__value">
              <Address
                endLength={4}
                contractUrl="https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
              />
            </div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token pool type</div>
            <div className="ccip-hero__details__value">Lock/Release</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token pool address</div>
            <div className="ccip-hero__details__value">
              <Address
                endLength={4}
                contractUrl="https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenDetailsHero
