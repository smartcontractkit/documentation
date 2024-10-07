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
          <img src={network?.logo} alt="" />
          {token?.name}
        </h1>

        <div className="ccip-hero__details">
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Network</div>
            <div className="ccip-hero__details__value">{network?.name}</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Decimals</div>
            <div className="ccip-hero__details__value">{token?.decimals}</div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token address</div>
            <div className="ccip-hero__details__value">
              <Address endLength={4} contractUrl={`https://etherscan.io/address/${token?.address}`} />
            </div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token pool type</div>
            <div className="ccip-hero__details__value">
              {token?.poolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}
            </div>
          </div>
          <div className="ccip-hero__details__item">
            <div className="ccip-hero__details__label">Token pool address</div>
            <div className="ccip-hero__details__value">
              <Address endLength={4} contractUrl={`https://etherscan.io/address/${token?.poolAddress}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenDetailsHero
