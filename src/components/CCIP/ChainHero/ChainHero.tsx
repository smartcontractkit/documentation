import { Environment, LaneConfig, Network, Version } from "~/config/data/ccip/types.ts"
import { getTokenData } from "~/config/data/ccip/data.ts"
import Address from "~/components/AddressReact.tsx"
import Breadcrumb from "../Breadcrumb/Breadcrumb.tsx"
import Search from "../Search/Search.tsx"
import "./ChainHero.css"
import CopyValue from "../CopyValue/CopyValue.tsx"
import {
  getExplorerAddressUrl,
  getTokenIconUrl,
  getNativeCurrency,
  directoryToSupportedChain,
  fallbackTokenIconUrl,
} from "~/features/utils/index.ts"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"
import { getChainTooltip } from "../Tooltip/index.ts"
import { PoolProgramTooltip } from "../Tooltip/PoolProgramTooltip.tsx"
import { ExplorerInfo, ChainType } from "@config/types.ts"

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
      chainType: ChainType
    }
    destinationNetwork: {
      name: string
      logo: string
      key: string
      explorer: ExplorerInfo
      chainType: ChainType
    }
    lane: LaneConfig
  }[]
  network?: Network
  token?: {
    id: string
    name: string
    logo: string
    symbol: string
  }
  environment: Environment
  breadcrumbItems?: Array<{
    name: string
    url: string
  }>
}

function ChainHero({ chains, tokens, network, token, environment, lanes, breadcrumbItems }: ChainHeroProps) {
  // Get chain-specific tooltip configuration
  const chainTooltipConfig = network?.chain ? getChainTooltip(network.chain) : null

  const feeTokensWithAddress =
    network?.feeTokens?.map((feeToken) => {
      const logo = feeToken.logo
      const token = getTokenData({
        environment,
        version: Version.V1_2_0,
        tokenId: feeToken.name,
      })
      const explorer = network.explorer || {}
      const address = token[network.chain]?.tokenAddress
      const contractUrl = address ? getExplorerAddressUrl(explorer, network.chainType)(address) : ""

      return {
        logo,
        token: feeToken,
        address,
        contractUrl,
      }
    }) || []

  const nativeCurrency = ((network) => {
    if (!network) return
    const supportedNetwork = directoryToSupportedChain(network.chain)
    return getNativeCurrency(supportedNetwork)
  })(network)

  const nativeTokenHasAddress = () => {
    if (!network) return
    // We making sure the Native Currency is not already part of the FeeToken
    return feeTokensWithAddress?.some((feeToken) => {
      return feeToken.token.name.toLowerCase() === nativeCurrency?.symbol.toLowerCase()
    })
  }

  return (
    <section className="ccip-chain-hero">
      <div className="ccip-chain-hero__content">
        <div className="ccip-chain-hero__top">
          <Breadcrumb
            items={
              breadcrumbItems || [
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
              ]
            }
          />
          <div className="ccip-chain-hero__chainSearch">
            <Search chains={chains} tokens={tokens} small environment={environment} lanes={lanes} />
          </div>
        </div>

        {(network || token) && (
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
              {network?.name || token?.name}
              <span className="ccip-chain-hero__token-logo__symbol">{token?.id}</span>

              {chainTooltipConfig && (
                <Tooltip
                  tip={chainTooltipConfig.content}
                  hoverable={chainTooltipConfig.hoverable}
                  hideDelay={chainTooltipConfig.hideDelay}
                />
              )}
            </h1>
          </div>
        )}
        {network && (
          <div className="ccip-chain-hero__details">
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label">Router</div>
              <div className="ccip-chain-hero__details__value" data-clipboard-type="router">
                <Address
                  endLength={4}
                  contractUrl={
                    network.router?.address
                      ? getExplorerAddressUrl(network.explorer, network.chainType)(network.router.address)
                      : ""
                  }
                  address={network.router?.address}
                />
              </div>
            </div>
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__label" data-clipboard-type="chain-selector">
                Chain selector
                <Tooltip
                  label=""
                  tip="CCIP Blockchain identifier."
                  labelStyle={{
                    marginRight: "8px",
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
                  tip="The RMN contract is used to curse."
                  labelStyle={{
                    marginRight: "8px",
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
                    contractUrl={getExplorerAddressUrl(network.explorer, network.chainType)(network.armProxy.address)}
                    address={network.armProxy.address}
                  />
                ) : (
                  "n/a"
                )}
              </div>
            </div>

            {/* Conditional rendering based on chain type */}
            {network.chainType === "evm" && (
              <>
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">
                    Token admin registry
                    <Tooltip
                      label=""
                      tip="The TokenAdminRegistry contract is responsible for managing the configuration of token pools for all cross chain tokens."
                      labelStyle={{
                        marginRight: "8px",
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
                        contractUrl={getExplorerAddressUrl(
                          network.explorer,
                          network.chainType
                        )(network.tokenAdminRegistry)}
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
                        marginRight: "8px",
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
                        contractUrl={getExplorerAddressUrl(network.explorer, network.chainType)(network.registryModule)}
                        address={network.registryModule}
                      />
                    ) : (
                      "n/a"
                    )}
                  </div>
                </div>
              </>
            )}

            {network.chainType === "aptos" && (
              <>
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">
                    Token admin registry
                    <Tooltip
                      label=""
                      tip="The TokenAdminRegistry module is responsible for managing the configuration of token pools for all cross chain tokens."
                      labelStyle={{
                        marginRight: "8px",
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
                        contractUrl={getExplorerAddressUrl(
                          network.explorer,
                          network.chainType
                        )(network.tokenAdminRegistry)}
                        address={network.tokenAdminRegistry}
                      />
                    ) : (
                      "n/a"
                    )}
                  </div>
                </div>

                {network.mcms && (
                  <div className="ccip-chain-hero__details__item">
                    <div className="ccip-chain-hero__details__label">
                      MCMS
                      <Tooltip
                        label=""
                        tip="The MCMS address must be added as a dependency in your Move.toml file when building modules that interact with CCIP on Aptos chains."
                        labelStyle={{
                          marginRight: "8px",
                        }}
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                          marginBottom: "2px",
                        }}
                      />
                    </div>
                    <div className="ccip-chain-hero__details__value" data-clipboard-type="mcms">
                      <Address
                        endLength={4}
                        contractUrl={getExplorerAddressUrl(network.explorer, network.chainType)(network.mcms)}
                        address={network.mcms}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {network.chainType === "solana" && (
              <div className="ccip-chain-hero__details__item">
                <div className="ccip-chain-hero__details__label">
                  Fee Quoter Program
                  <Tooltip
                    label=""
                    tip="The Fee Quoter Program provides fee calculations for CCIP transactions on Solana."
                    labelStyle={{
                      marginRight: "8px",
                    }}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginBottom: "2px",
                    }}
                  />
                </div>
                <div className="ccip-chain-hero__details__value" data-clipboard-type="fee-quoter">
                  {network.feeQuoter ? (
                    <Address
                      endLength={4}
                      contractUrl={getExplorerAddressUrl(network.explorer, network.chainType)(network.feeQuoter)}
                      address={network.feeQuoter}
                    />
                  ) : (
                    "n/a"
                  )}
                </div>
              </div>
            )}

            {network.chainType === "solana" && network.poolPrograms && (
              <div className="ccip-chain-hero__details__item">
                <div className="ccip-chain-hero__details__label">
                  Self-service pool programs
                  <PoolProgramTooltip />
                </div>
                <div className="ccip-chain-hero__details__value ccip-chain-hero__pool-programs-container">
                  {network.poolPrograms.BurnMintTokenPool && (
                    <div className="ccip-chain-hero__pool-program-entry">
                      <span className="ccip-chain-hero__pool-program-type">BurnMint:</span>
                      <Address
                        endLength={4}
                        contractUrl={getExplorerAddressUrl(network.explorer)(network.poolPrograms.BurnMintTokenPool)}
                        address={network.poolPrograms.BurnMintTokenPool}
                      />
                    </div>
                  )}
                  {network.poolPrograms.LockReleaseTokenPool && (
                    <div className="ccip-chain-hero__pool-program-entry">
                      <span className="ccip-chain-hero__pool-program-type">LockRelease:</span>
                      <Address
                        endLength={4}
                        contractUrl={getExplorerAddressUrl(network.explorer)(network.poolPrograms.LockReleaseTokenPool)}
                        address={network.poolPrograms.LockReleaseTokenPool}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Start of new Fee Tokens Group */}
            {network &&
              ((feeTokensWithAddress && feeTokensWithAddress.length > 0) ||
                (!nativeTokenHasAddress() && nativeCurrency)) && (
                <div className="ccip-chain-hero__details__item ccip-chain-hero__fee-tokens-group-item">
                  <div className="ccip-chain-hero__details__label">Fee tokens</div>
                  <div className="ccip-chain-hero__details__value" data-clipboard-type="fee-tokens-group">
                    <div className="ccip-chain-hero__feeTokens__list">
                      {" "}
                      {/* This new div will hold all token items */}
                      {feeTokensWithAddress &&
                        feeTokensWithAddress.map(({ token, address, logo, contractUrl }, index) => (
                          <div key={`fee-token-${index}`} className="ccip-chain-hero__feeTokens__item">
                            <object
                              data={logo}
                              type="image/png"
                              width="20px"
                              height="20px"
                              className="ccip-chain-hero__feeTokens__item__logo"
                            >
                              <img
                                src={fallbackTokenIconUrl}
                                alt={`${token.name} token logo`}
                                width="20px"
                                height="20px"
                              />
                            </object>
                            <div>{token.name}</div>
                            <Address endLength={4} contractUrl={contractUrl} address={address} />
                          </div>
                        ))}
                      {!nativeTokenHasAddress() && nativeCurrency && (
                        <div className="ccip-chain-hero__feeTokens__item">
                          <object
                            data={`${getTokenIconUrl(nativeCurrency.symbol)}`}
                            type="image/png"
                            width="20px"
                            height="20px"
                            className="ccip-chain-hero__feeTokens__item__logo"
                          >
                            <img
                              src={fallbackTokenIconUrl}
                              alt={`${nativeCurrency.symbol} token logo`}
                              width="20px"
                              height="20px"
                            />
                          </object>
                          <div>{nativeCurrency.symbol}</div>
                          <span className="ccip-chain-hero__feeTokens__native-gas-token">(native gas token)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            {/* End of new Fee Tokens Group */}
          </div>
        )}
      </div>
    </section>
  )
}

export default ChainHero
