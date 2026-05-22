import Address from "~/components/AddressReact.tsx"
import { getExplorerAddressUrl, fallbackTokenIconUrl } from "~/features/utils/index.ts"
import "./ChainHero.css"
import { ExplorerInfo, ChainType } from "~/config/types.ts"
import { formatPoolTypeForDisplay } from "~/lib/ccip/graphql/utils/type-version-parser.ts"

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
  poolDetails?: {
    version: string
    hook: string | null
    finality: { finalityDepth: number; finalitySafe: boolean } | null
    ccv: { thresholdAmount: string | null } | null
  } | null
  isLoadingPoolDetails?: boolean
  inDrawer?: boolean
}

function TokenDetailsHero({
  network,
  token,
  poolDetails,
  isLoadingPoolDetails,
  inDrawer = false,
}: TokenDetailsHeroProps) {
  return (
    <section className={`ccip-chain-hero ${inDrawer ? "ccip-chain-hero--drawer" : ""}`}>
      <div className="ccip-chain-hero__content">
        <div className="ccip-chain-hero__heading">
          <div className="ccip-chain-hero__heading__images">
            <img src={network.logo} alt="" />
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
            <div className="ccip-chain-hero__details__value">
              {token.poolRawType ? formatPoolTypeForDisplay(token.poolRawType) : "—"}
            </div>
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
          {poolDetails && (
            <>
              <div className="ccip-chain-hero__details__item">
                <div className="ccip-chain-hero__details__label">Pool version</div>
                <div className="ccip-chain-hero__details__value">{poolDetails.version || "—"}</div>
              </div>
              <div className="ccip-chain-hero__details__item">
                <div className="ccip-chain-hero__details__label">Custom finality</div>
                <div className="ccip-chain-hero__details__value">
                  {poolDetails.finality ? (poolDetails.finality.finalitySafe ? "Yes" : "No") : "—"}
                </div>
              </div>
              {poolDetails.finality?.finalitySafe && (
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">Finality depth</div>
                  <div className="ccip-chain-hero__details__value">{poolDetails.finality.finalityDepth}</div>
                </div>
              )}
              {poolDetails.ccv && poolDetails.ccv.thresholdAmount && poolDetails.ccv.thresholdAmount !== "0" && (
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">CCV threshold</div>
                  <div className="ccip-chain-hero__details__value">{poolDetails.ccv.thresholdAmount}</div>
                </div>
              )}
              {poolDetails.hook && (
                <div className="ccip-chain-hero__details__item">
                  <div className="ccip-chain-hero__details__label">Pool hook</div>
                  <div className="ccip-chain-hero__details__value">
                    <Address
                      endLength={4}
                      contractUrl={getExplorerAddressUrl(network?.explorer, network?.chainType)(poolDetails.hook)}
                      address={poolDetails.hook}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {isLoadingPoolDetails && !poolDetails && (
            <div className="ccip-chain-hero__details__item">
              <div className="ccip-chain-hero__details__value">Loading pool details...</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default TokenDetailsHero
