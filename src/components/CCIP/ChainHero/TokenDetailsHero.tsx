import Address from "~/components/AddressReact"
import { getExplorerAddressUrl, fallbackTokenIconUrl } from "~/features/utils"
import "./ChainHero.css"

interface TokenDetailsHeroProps {
  network: {
    name: string
    logo: string
    explorerUrl: string
  }
  token: {
    name: string
    symbol: string
    logo: string
    decimals: number
    address: string
    poolType: string
    poolAddress: string
  }
}

function TokenDetailsHero({ network, token }: TokenDetailsHeroProps) {
  return (
    <section className="ccip-chain-hero">
      <div className="ccip-chain-hero__content">
        <div className="ccip-chain-hero__heading">
          <div className="ccip-chain-hero__heading__images">
            <img src={network?.logo} alt="" />
            <img
              src={token?.logo}
              alt=""
              className="ccip-chain-hero__heading__images__small"
              onError={(event) => {
                ;(event.target as HTMLImageElement).setAttribute("src", fallbackTokenIconUrl)
              }}
            />
          </div>

          <h1>
            {token?.name} <span className="ccip-chain-hero__token-logo__symbol">{token?.symbol}</span>
          </h1>
        </div>

        <div className="ccip-chain-hero__details">
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Network</div>
            <div className="ccip-chain-hero__details__value">{network?.name}</div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Decimals</div>
            <div className="ccip-chain-hero__details__value">{token?.decimals}</div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Token address</div>
            <div className="ccip-chain-hero__details__value" data-clipboard-type="token">
              <Address endLength={4} contractUrl={getExplorerAddressUrl(network?.explorerUrl)(token?.address)} />
            </div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Token pool type</div>
            <div className="ccip-chain-hero__details__value">
              {token?.poolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}
            </div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Token pool address</div>
            <div className="ccip-chain-hero__details__value" data-clipboard-type="token-pool">
              <Address endLength={4} contractUrl={getExplorerAddressUrl(network?.explorerUrl)(token?.poolAddress)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenDetailsHero
