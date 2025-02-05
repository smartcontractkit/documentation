import { Environment, getTokenData, LaneConfig, Version } from "~/config/data/ccip"
import Address from "~/components/AddressReact"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import Search from "../Search/Search"
import "./ChainHero.css"
import CopyValue from "../CopyValue/CopyValue"
import {
  getExplorerAddressUrl,
  getTokenIconUrl,
  getNativeCurrency,
  directoryToSupportedChain,
  fallbackTokenIconUrl,
} from "~/features/utils"
import { Tooltip } from "~/features/common/Tooltip"
import { ExplorerInfo } from "~/config/types"

interface ChainHeroProps {
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
      explorer: ExplorerInfo
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
    explorer: ExplorerInfo
    routerExplorerUrl: string
    chainSelector: string
    feeTokens?: string[]
    nativeToken?: {
      name: string
      symbol: string
      logo: string
    }
    armProxy: {
      address: string
      version: string
    }
  }
  token?: {
    id: string
    name: string
    logo: string
    symbol: string
  }
  environment: Environment
}

function ChainHero({ chains, tokens, network, token, environment, lanes }: ChainHeroProps) {
  const feeTokensWithAddress = network?.feeTokens?.map((feeToken) => {
    const logo = getTokenIconUrl(feeToken)
    const token = getTokenData({
      environment,
      version: Version.V1_2_0,
      tokenId: feeToken,
    })
    const explorer = network.explorer
    const address = token[network.chain].tokenAddress
    const contractUrl = getExplorerAddressUrl(explorer)(token[network.chain].tokenAddress)

    return {
      logo,
      token: feeToken,
      address,
      contractUrl,
    }
  })

  const nativeCurrency = ((network) => {
    if (!network) return
    const supportedNetwork = directoryToSupportedChain(network.chain)
    return getNativeCurrency(supportedNetwork)
  })(network)

  const nativeTokenHasAddress = () => {
    if (!network) return
    // We making sure the Navive Currency is not already part of the FeeToken
    return feeTokensWithAddress?.some((feeToken) => {
      return feeToken.token.toLowerCase() === nativeCurrency?.symbol.toLowerCase()
    })
  }

  return (
    <section className="ccip-chain-hero">
      <div className="ccip-chain-hero__content">
        <div className="ccip-chain-hero__top">
          <Breadcrumb
            items={[
              {
                name: "CCIP Directory",
                url: `/ccip/directory/${environment}`,
              },
              {
                name: network?.name || token?.id || "Current",
                url: network
                  ? `/ccip/directory/${environment}/chain/${network.chain}`
                  : `/ccip/directory/${environment}/token/${token?.id}`,
              },
            ]}
          />
          <div className="ccip-chain-hero__chainSearch">
            <Search chains={chains} tokens={tokens} small environment={environment} lanes={lanes} />
          </div>
        </div>

        <div className="ccip-chain-hero__heading">
          <img
            src={network?.logo || token?.logo}
            alt=""
            className={token?.logo ? "ccip-chain-hero__token-logo" : ""}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = fallbackTokenIconUrl
            }}
          />
          <h1>
            {network?.name || token?.id} <span className="ccip-chain-hero__token-logo__symbol">{token?.name}</span>
          </h1>
        </div>
        {network && (
          <div className="ccip-chain-hero__details">
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">Router</div>
              <div className="ccip-chain-hero__details__value" data-clipboard-type="router">
                <Address endLength={4} contractUrl={network.routerExplorerUrl} address={network.router?.address} />
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label" data-clipboard-type="chain-selector">
                Chain selector
                <Tooltip
                  label=""
                  tip="CCIP Blockchain identifier"
                  labelStyle={{
                    marginRight: "5px",
                  }}
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginBottom: "2px",
                  }}
                />
              </div>
              <div className="ccip-chain-hero__details__value">
                {network.chainSelector ? <CopyValue value={network.chainSelector} /> : "n/a"}{" "}
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">
                RMN
                <Tooltip
                  label=""
                  tip="The Risk Management contract maintains the list of Risk Management node addresses that are allowed to bless or curse. The contract also holds the quorum logic for blessing a committed Merkle Root and cursing CCIP on a destination blockchain."
                  labelStyle={{
                    marginRight: "5px",
                  }}
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginBottom: "2px",
                  }}
                />
              </div>
              <div className="ccip-chain-hero__details__value" data-clipboard-type="rmn">
                {network.armProxy ? (
                  <Address
                    endLength={4}
                    contractUrl={getExplorerAddressUrl(network.explorer)(network.armProxy.address)}
                    address={network.armProxy.address}
                  />
                ) : (
                  "n/a"
                )}
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">
                Token admin registry
                <Tooltip
                  label=""
                  tip="The TokenAdminRegistry contract is responsible for managing the configuration of token pools for all cross chain tokens."
                  labelStyle={{
                    marginRight: "5px",
                  }}
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginBottom: "2px",
                  }}
                />
              </div>
              <div className="ccip-chain-hero__details__value" data-clipboard-type="token-registry">
                {network.tokenAdminRegistry ? (
                  <Address
                    endLength={4}
                    contractUrl={getExplorerAddressUrl(network.explorer)(network.tokenAdminRegistry)}
                    address={network.tokenAdminRegistry}
                  />
                ) : (
                  "n/a"
                )}
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">
                Registry module owner
                <Tooltip
                  label=""
                  tip="The RegistryModuleOwnerCustom contract is responsible for registering the administrator of a token in the TokenAdminRegistry."
                  labelStyle={{
                    marginRight: "5px",
                  }}
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginBottom: "2px",
                  }}
                />
              </div>
              <div className="ccip-chain-hero__details__value" data-clipboard-type="registry">
                {network.registryModule ? (
                  <Address
                    endLength={4}
                    contractUrl={getExplorerAddressUrl(network.explorer)(network.registryModule)}
                    address={network.registryModule}
                  />
                ) : (
                  "n/a"
                )}
              </div>
            </div>
          </div>
        )}

        {feeTokensWithAddress && (
          <div className="ccip-chain-hero__feeTokens">
            <div className="ccip-chain-hero__details__label">Fee tokens</div>
            <div className="ccip-chain-hero__feeTokens__list">
              {feeTokensWithAddress.map(({ token, address, logo, contractUrl }, index) => {
                return (
                  <div key={index} className="ccip-chain-hero__feeTokens__item" data-clipboard-type="fee-token">
                    <object
                      data={logo}
                      type="image/png"
                      width="20px"
                      height="20px"
                      className="ccip-chain-hero__feeTokens__item__logo"
                    >
                      <img src={fallbackTokenIconUrl} alt={token} width="20px" height="20px" />
                    </object>
                    <div>{token}</div>
                    <Address endLength={4} contractUrl={contractUrl} address={address} />
                  </div>
                )
              })}
              {!nativeTokenHasAddress() && nativeCurrency && (
                <div key={"native-token"} className="ccip-chain-hero__feeTokens__item">
                  <object
                    data={`${getTokenIconUrl(nativeCurrency.symbol)}`}
                    type="image/png"
                    width="20px"
                    height="20px"
                    className="ccip-chain-hero__feeTokens__item__logo"
                  >
                    <img src={fallbackTokenIconUrl} alt={`${nativeCurrency.symbol} icon`} width="20px" height="20px" />
                  </object>
                  <div>{nativeCurrency.symbol} </div>
                  <span className="ccip-chain-hero__feeTokens__native-gas-token">(native gas token)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ChainHero
