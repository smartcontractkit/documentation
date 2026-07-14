import { Environment, LaneConfig, Network, Version } from "~/config/data/ccip/types.ts"
import { getTokenData } from "~/config/data/ccip/data.ts"
import Address from "~/components/AddressReact.tsx"
import Breadcrumb from "../Breadcrumb/Breadcrumb.tsx"
import Search from "../Search/Search.tsx"
import "./ChainHero.css"
import CopyValue from "../CopyValue/CopyValue.tsx"
import {
  getTokenIconUrl,
  getNativeCurrency,
  directoryToSupportedChain,
  fallbackTokenIconUrl,
  getContractExplorerUrl,
  isCantonNativeFeeToken,
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
  isDecommissioned?: boolean
}

const CCIP_EXPLORER_URL = "https://ccip.chain.link/"

function ChainHero({ chains, tokens, network, token, environment, lanes, isDecommissioned = false }: ChainHeroProps) {
  // Get chain-specific tooltip configuration
  const chainTooltipConfig = network?.chain && !isDecommissioned ? getChainTooltip(network.chain) : null
  const hasFullNetworkDetails = Boolean(network?.router?.address)
  const showNetworkConfiguration = !isDecommissioned || hasFullNetworkDetails
  const isCanton = network?.chainType === "canton"
  const addressEndLength = isCanton ? 10 : 4
  const cantonWideAddressEndLength = 14
  const networkContractUrl = network ? getContractExplorerUrl(network.explorer, network.chainType) : undefined

  const feeTokensWithAddress =
    network?.feeTokens?.map((feeToken) => {
      const logo = feeToken.logo
      const token = getTokenData({
        environment,
        version: Version.V1_2_0,
        tokenId: feeToken.name,
      })
      const address = token[network.chain]?.tokenAddress
      const contractUrl =
        address && !(isCanton && isCantonNativeFeeToken(network.chain, feeToken.name))
          ? networkContractUrl?.(address)
          : undefined

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

        {isDecommissioned && (
          <aside className="ccip-chain-hero__decom-banner" aria-label="Inactive Chain">
            <div className="ccip-chain-hero__decom-banner__icon" aria-hidden="true">
              !
            </div>
            <div className="ccip-chain-hero__decom-banner__content">
              <p className="ccip-chain-hero__decom-banner__title">Inactive Chain</p>
              <p>
                This chain is inactive on the CCIP network. No new transactions can be initiated, but historical
                transactions remain accessible in the CCIP Explorer.
              </p>
            </div>
          </aside>
        )}

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
          <div className="ccip-chain-hero__title-group">
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
                overflow: "visible",
              }}
            >
              {network?.name || token?.id}
              <span className="ccip-chain-hero__token-logo__symbol">
                {token?.id === "USDC" ? "USD Coin" : token?.name}
              </span>

              {chainTooltipConfig && (
                <Tooltip
                  tip={chainTooltipConfig.content}
                  hoverable={chainTooltipConfig.hoverable}
                  hideDelay={chainTooltipConfig.hideDelay}
                />
              )}
            </h1>
            {isDecommissioned && network && <span className="ccip-chain-hero__decom-subtitle">Inactive</span>}
          </div>
        </div>

        {isCanton && (
          <aside className="ccip-chain-hero__decom-banner" aria-label="Canton address caution">
            <div className="ccip-chain-hero__decom-banner__icon" aria-hidden="true">
              !
            </div>
            <div className="ccip-chain-hero__decom-banner__content">
              <p className="ccip-chain-hero__decom-banner__title">Caution</p>
              <p>
                Addresses shown may change due to upgrades since Canton contracts are immutable. Confirm party IDs and
                contract addresses with{" "}
                <a href="https://chain.link/ccip-contact" target="_blank" rel="noopener noreferrer">
                  Chainlink CCIP
                </a>
                .
              </p>
            </div>
          </aside>
        )}

        {network && (
          <div className={`ccip-chain-hero__details${isCanton ? " ccip-chain-hero__details--canton" : ""}`}>
            {showNetworkConfiguration && (
              <>
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">
                    {isCanton ? "Per party factory router" : "Router"}
                  </div>
                  <div className="ccip-chain-hero__details__value" data-clipboard-type="router">
                    <Address
                      endLength={addressEndLength}
                      contractUrl={networkContractUrl?.(network.router?.address)}
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
                        endLength={addressEndLength}
                        contractUrl={networkContractUrl?.(network.armProxy.address)}
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
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.tokenAdminRegistry)}
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
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.registryModule)}
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
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.tokenAdminRegistry)}
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
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.mcms)}
                            address={network.mcms}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {network.chainType === "canton" && (
                  <>
                    {network.ccipOwnerParty && (
                      <div className="ccip-chain-hero__details__item ccip-chain-hero__details__item--wide">
                        <div className="ccip-chain-hero__details__label">
                          CCIP owner party
                          <Tooltip
                            label=""
                            tip="The CCIP owner party is the signatory and owner of core CCIP contracts on Canton."
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
                        <div className="ccip-chain-hero__details__value" data-clipboard-type="ccip-owner-party">
                          <Address
                            endLength={cantonWideAddressEndLength}
                            contractUrl={networkContractUrl?.(network.ccipOwnerParty)}
                            address={network.ccipOwnerParty}
                          />
                        </div>
                      </div>
                    )}

                    {network.committeeVerifier && (
                      <div className="ccip-chain-hero__details__item">
                        <div className="ccip-chain-hero__details__label">
                          Committee verifier
                          <Tooltip
                            label=""
                            tip="The Committee Verifier contract (CCVS) validates cross-chain message proofs on Canton."
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
                        <div className="ccip-chain-hero__details__value" data-clipboard-type="committee-verifier">
                          <Address
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.committeeVerifier.address)}
                            address={network.committeeVerifier.address}
                          />
                        </div>
                      </div>
                    )}

                    {network.feeQuoterModule && (
                      <div className="ccip-chain-hero__details__item">
                        <div className="ccip-chain-hero__details__label">
                          Fee quoter module
                          <Tooltip
                            label=""
                            tip="The Fee Quoter module calculates CCIP fees for cross-chain messages on Canton."
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
                        <div className="ccip-chain-hero__details__value" data-clipboard-type="fee-quoter-module">
                          <Address
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.feeQuoterModule.address)}
                            address={network.feeQuoterModule.address}
                          />
                        </div>
                      </div>
                    )}

                    {network.chain === "canton-testnet" && network.tokenAdminRegistry && (
                      <div className="ccip-chain-hero__details__item">
                        <div className="ccip-chain-hero__details__label">
                          Token admin registry
                          <Tooltip
                            label=""
                            tip="The Token Admin Registry manages token pool configuration for cross-chain tokens on Canton."
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
                          <Address
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.tokenAdminRegistry)}
                            address={network.tokenAdminRegistry}
                          />
                        </div>
                      </div>
                    )}

                    {network.ccipExplicitDisclosureServer && (
                      <div className="ccip-chain-hero__details__item ccip-chain-hero__details__item--wide">
                        <div className="ccip-chain-hero__details__label">
                          Explicit disclosure server
                          <Tooltip
                            label=""
                            tip="The Explicit Disclosure Server (EDS) endpoint for Canton CCIP disclosures."
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
                        <div className="ccip-chain-hero__details__value" data-clipboard-type="eds-server">
                          <CopyValue value={network.ccipExplicitDisclosureServer} />
                        </div>
                      </div>
                    )}

                    {network.indexer?.primary && (
                      <div className="ccip-chain-hero__details__item ccip-chain-hero__details__item--wide">
                        <div className="ccip-chain-hero__details__label">
                          Indexer
                          <Tooltip
                            label=""
                            tip="The CCIP indexer endpoint used to retrieve Merkle proofs for manual execution on Canton."
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
                        <div className="ccip-chain-hero__details__value" data-clipboard-type="indexer">
                          {network.indexer.backup ? (
                            <div className="ccip-chain-hero__indexer-list">
                              <div className="ccip-chain-hero__pool-program-entry">
                                <span className="ccip-chain-hero__pool-program-type">Primary:</span>
                                <CopyValue value={network.indexer.primary} />
                              </div>
                              <div className="ccip-chain-hero__pool-program-entry">
                                <span className="ccip-chain-hero__pool-program-type">Backup:</span>
                                <CopyValue value={network.indexer.backup} />
                              </div>
                            </div>
                          ) : (
                            <CopyValue value={network.indexer.primary} />
                          )}
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
                          endLength={addressEndLength}
                          contractUrl={networkContractUrl?.(network.feeQuoter)}
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
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.poolPrograms.BurnMintTokenPool)}
                            address={network.poolPrograms.BurnMintTokenPool}
                          />
                        </div>
                      )}
                      {network.poolPrograms.LockReleaseTokenPool && (
                        <div className="ccip-chain-hero__pool-program-entry">
                          <span className="ccip-chain-hero__pool-program-type">LockRelease:</span>
                          <Address
                            endLength={addressEndLength}
                            contractUrl={networkContractUrl?.(network.poolPrograms.LockReleaseTokenPool)}
                            address={network.poolPrograms.LockReleaseTokenPool}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {network.ccipHome && (
                  <div className="ccip-chain-hero__details__item">
                    <div className="ccip-chain-hero__details__label">
                      CCIP home
                      <Tooltip
                        label=""
                        tip="The CCIPHome Contract is used for v1.6 config"
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
                    <div className="ccip-chain-hero__details__value" data-clipboard-type="ccip-home">
                      <Address
                        endLength={addressEndLength}
                        contractUrl={networkContractUrl?.(network.ccipHome)}
                        address={network.ccipHome}
                      />
                    </div>
                  </div>
                )}

                {network.tokenPoolFactory && (
                  <div className="ccip-chain-hero__details__item">
                    <div className="ccip-chain-hero__details__label">
                      Token pool factory
                      <Tooltip
                        label=""
                        tip="The TokenPoolFactory contract can be used for deploying CrossChainTokens and TokenPools for cross-chain token transfers."
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
                    <div className="ccip-chain-hero__details__value" data-clipboard-type="token-pool-factory">
                      <Address
                        endLength={addressEndLength}
                        contractUrl={networkContractUrl?.(network.tokenPoolFactory)}
                        address={network.tokenPoolFactory}
                      />
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
                                <Address
                                  endLength={token.name === "TON" ? undefined : addressEndLength}
                                  contractUrl={token.name === "TON" ? undefined : contractUrl}
                                  address={address}
                                />
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
              </>
            )}

            {!showNetworkConfiguration && isDecommissioned && (
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
                  {network.chainSelector ? <CopyValue value={network.chainSelector} /> : "n/a"}
                </div>
              </div>
            )}

            {isDecommissioned && (
              <>
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">Status</div>
                  <div className="ccip-chain-hero__details__value">
                    <span className="ccip-chain-hero__decom-status-badge">Inactive</span>
                  </div>
                </div>
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">Historical data</div>
                  <div className="ccip-chain-hero__details__value">
                    <a
                      href={CCIP_EXPLORER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ccip-chain-hero__decom-explorer-link"
                    >
                      View in CCIP Explorer →
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ChainHero
