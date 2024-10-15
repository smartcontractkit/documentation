import { Environment, getTokenData, LaneConfig, Version } from "~/config/data/ccip"
import Address from "~/components/AddressReact"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import Search from "../Search/Search"
import "./ChainHero.css"
import CopyValue from "../CopyValue/CopyValue"
import { getExplorerAddressUrl, getTokenIconUrl } from "~/features/utils"

interface ChainHeroProps {
  chains: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  tokens: {
    name: string
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
      explorerUrl: string
    }
    lane: LaneConfig
  }[]
  network?: {
    name: string
    logo: string
    totalLanes: number
    totalTokens: number
    chain: string
    tokenAdminRegistry?: string
    registryModule?: string
    router?: {
      name: string
      address: string
    }
    explorerUrl: string
    routerExplorerUrl: string
    chainSelector: string
    feeTokens?: string[]
    nativeToken?: {
      name: string
      symbol: string
      logo: string
    }
  }
  token?: {
    name: string
    logo: string
    symbol: string
  }
  environment: Environment
}

function ChainHero({ chains, tokens, network, token, environment, lanes }: ChainHeroProps) {
  return (
    <section className="ccip-chain-hero">
      <img src="/assets/ccip.png" alt="" className="ccip-chain-hero__grid" />

      <div className="ccip-chain-hero__content">
        <div className="ccip-chain-hero__top">
          <Breadcrumb
            items={[
              {
                name: "CCIP Directory",
                url: `/ccip/supported-networks/${environment}`,
              },
              {
                name: network?.name || token?.name || "Current",
                url: network
                  ? `/ccip/supported-networks/${environment}/chain/${network.chain}`
                  : `/ccip/supported-networks/${environment}/token/${token?.name}`,
              },
            ]}
          />
          <div className="ccip-chain-hero__chainSearch">
            <Search chains={chains} tokens={tokens} small environment={environment} lanes={lanes} />
          </div>
        </div>

        <div className="ccip-chain-hero__heading">
          <img src={network?.logo || token?.logo} alt="" className={token?.logo ? "ccip-chain-hero__token-logo" : ""} />
          <h1>
            {network?.name || token?.name} <span className="ccip-chain-hero__token-logo__symbol">{token?.symbol}</span>
          </h1>
        </div>
        {network && (
          <div className="ccip-chain-hero__details">
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">Router</div>
              <div className="ccip-chain-hero__details__value">
                <Address endLength={4} contractUrl={network.routerExplorerUrl} />
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">Network selector</div>
              <div className="ccip-chain-hero__details__value">
                {network.chainSelector ? <CopyValue value={network.chainSelector} /> : "n/a"}{" "}
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">RMN</div>
              <div className="ccip-chain-hero__details__value">n/a</div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">Token admin registry</div>
              <div className="ccip-chain-hero__details__value">
                {network.tokenAdminRegistry ? (
                  <Address
                    endLength={4}
                    contractUrl={getExplorerAddressUrl(network.explorerUrl)(network.tokenAdminRegistry)}
                  />
                ) : (
                  "n/a"
                )}
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">Registry module owner</div>
              <div className="ccip-chain-hero__details__value">
                {network.registryModule ? (
                  <Address
                    endLength={4}
                    contractUrl={getExplorerAddressUrl(network.explorerUrl)(network.registryModule)}
                  />
                ) : (
                  "n/a"
                )}
              </div>
            </div>
          </div>
        )}

        {network && network.feeTokens && (
          <div className="ccip-chain-hero__feeTokens">
            <div className="ccip-chain-hero__details__label">Fee tokens</div>
            <div className="ccip-chain-hero__feeTokens__list">
              {network?.feeTokens.map((feeToken, index) => {
                const logo = getTokenIconUrl(feeToken)
                const token = getTokenData({
                  environment,
                  version: Version.V1_2_0,
                  tokenSymbol: feeToken,
                })
                console.log("feeToken", token)
                const explorerUrl = network.routerExplorerUrl
                const address = getExplorerAddressUrl(explorerUrl)(token[network.chain].tokenAddress)
                return (
                  <div key={index} className="ccip-chain-hero__feeTokens__item">
                    <img src={logo} alt={feeToken} className="ccip-chain-hero__feeTokens__item__logo" />
                    <div>{feeToken}</div>
                    <Address endLength={4} contractUrl={address} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ChainHero
