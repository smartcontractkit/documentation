import Address from "~/components/AddressReact.tsx"
import { getExplorerAddressUrl, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import "./ChainHero.css"
import { ExplorerInfo, ChainType } from "~/config/types.ts"

interface TokenDetailsHeroProps {
  network: {
    name: string
    logo: string
    explorer: ExplorerInfo
    chainType?: ChainType
  }
  token: {
    id: string
    name: string
    symbol: string
    logo: string
    decimals: number
    address: string
    poolRawType: string
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
            {token.id} <span className="ccip-chain-hero__token-logo__symbol">{token.name}</span>
          </h1>
        </div>

        <div className="ccip-chain-hero__details">
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Network</div>
            <div className="ccip-chain-hero__details__value">{network?.name}</div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Decimals</div>
            <div className="ccip-chain-hero__details__value">{token.decimals}</div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Token address</div>
            <div className="ccip-chain-hero__details__value" data-clipboard-type="token">
              <Address
                endLength={4}
                contractUrl={getExplorerAddressUrl(network?.explorer, network?.chainType)(token.address)}
                address={token.address}
              />
            </div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Token pool type</div>
            <div className="ccip-chain-hero__details__value">{token.poolRawType ?? "—"}</div>
          </div>
          <div className="ccip-chain-hero__details__item">
            <div className="ccip-chain-hero__details__label">Token pool address</div>
            <div className="ccip-chain-hero__details__value" data-clipboard-type="token-pool">
              <Address
                endLength={4}
                contractUrl={getExplorerAddressUrl(network?.explorer, network?.chainType)(token.poolAddress)}
                address={token.poolAddress}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TokenDetailsHero
