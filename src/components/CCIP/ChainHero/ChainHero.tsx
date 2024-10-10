import { Environment, LaneConfig } from "~/config/data/ccip"
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
    routerExplorerUrl: string
    chainSelector: string
  }
  token?: {
    name: string
    logo: string
  }
  environment: Environment
}

function ChainHero({ chains, tokens, network, token, environment, lanes }: ChainHeroProps) {
  return (
    <section className="ccip-hero">
      <img src="/assets/ccip.png" alt="" className="ccip-hero__grid" />

      <div className="ccip-hero__content">
        <div className="ccip-hero__top">
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
          <div className="ccip-hero__chainSearch">
            <Search chains={chains} tokens={tokens} small environment={environment} lanes={lanes} />
          </div>
        </div>

        <h1 className="ccip-hero__heading">
          <img src={network?.logo || token?.logo} alt="" className={token?.logo ? "ccip-hero__token-logo" : ""} />
          {network?.name || token?.name}
        </h1>
        {network && (
          <div className="ccip-hero__details">
            <div className="ccip-hero__details__item">
              <div className="ccip-hero__details__label">Router</div>
              <div className="ccip-hero__details__value">
                <Address endLength={4} contractUrl={network.routerExplorerUrl} />
              </div>
            </div>
            <div className="ccip-hero__details__item">
              <div className="ccip-hero__details__label">Chain selector</div>
              <div className="ccip-hero__details__value">{network.chainSelector || "n/a"}</div>
            </div>
            <div className="ccip-hero__details__item">
              <div className="ccip-hero__details__label">RMN</div>
              <div className="ccip-hero__details__value">n/a</div>
            </div>
            <div className="ccip-hero__details__item">
              <div className="ccip-hero__details__label">Token admin registry</div>
              <div className="ccip-hero__details__value">
                {network.tokenAdminRegistry ? (
                  <Address endLength={4} contractUrl={network.tokenAdminRegistry} />
                ) : (
                  "n/a"
                )}
              </div>
            </div>
            <div className="ccip-hero__details__item">
              <div className="ccip-hero__details__label">Registry module owner</div>
              <div className="ccip-hero__details__value">
                {network.registryModule ? <Address endLength={4} contractUrl={network.registryModule} /> : "n/a"}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ChainHero
