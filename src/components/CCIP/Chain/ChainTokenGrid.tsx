import { Environment, Version, Network } from "~/config/data/ccip/types.ts"
import type { PoolType } from "~/config/data/ccip/types.ts"
import { getTokenData } from "~/config/data/ccip/data.ts"
import TokenCard from "../Cards/TokenCard.tsx"
import { drawerContentStore, DrawerWidth, drawerWidthStore } from "../Drawer/drawerStore.ts"
import TokenDrawer from "../Drawer/TokenDrawer.tsx"
import { directoryToSupportedChain, getChainIcon, getChainTypeAndFamily, getTitle } from "~/features/utils/index.ts"
import { useState } from "react"
import "./ChainTokenGrid.css"
import SeeMore from "../SeeMore/SeeMore.tsx"
import type { PoolInfo } from "~/lib/ccip/graphql/services/enrichment-data-service.ts"

interface ChainTokenGridProps {
  tokens: {
    id: string
    logo: string
    totalNetworks: number
  }[]
  network: Network
  environment: Environment
  poolDataByToken?: Record<string, PoolInfo>
}

const BEFORE_SEE_MORE = 6 * 4 // Number of networks to show before the "See more" button, 7 rows x 4 items

function ChainTokenGrid({ tokens, network, environment, poolDataByToken }: ChainTokenGridProps) {
  const [seeMore, setSeeMore] = useState(tokens.length <= BEFORE_SEE_MORE)
  return (
    <>
      <div className="tokens__grid">
        {tokens.slice(0, seeMore ? tokens.length : BEFORE_SEE_MORE).map((token) => {
          const data = getTokenData({
            environment,
            version: Version.V1_2_0,
            tokenId: token.id,
          })
          return (
            <TokenCard
              id={token.id}
              logo={token.logo}
              key={token.id}
              variant="square"
              onClick={() => {
                const poolInfo = poolDataByToken?.[token.id]
                const selectedNetwork = Object.keys(data)
                  .map((key) => {
                    const supportedChain = directoryToSupportedChain(key || "")
                    const { chainType } = getChainTypeAndFamily(supportedChain)
                    const title = getTitle(supportedChain) || ""
                    const networkLogo = getChainIcon(supportedChain) || ""
                    return {
                      name: title,
                      key,
                      logo: networkLogo,
                      tokenId: token.id,
                      tokenLogo: token.logo || "",
                      tokenName: data[key].name || "",
                      tokenSymbol: data[key].symbol,
                      tokenDecimals: data[key].decimals,
                      tokenAddress: data[key].tokenAddress,
                      tokenPoolType: (poolInfo?.type ?? data[key].pool?.type ?? "burnMint") as PoolType,
                      tokenPoolRawType: poolInfo?.rawType ?? data[key].pool?.rawType ?? "",
                      tokenPoolAddress: poolInfo?.address ?? data[key].pool?.address ?? "",
                      tokenPoolVersion: poolInfo?.version ?? data[key].pool?.version ?? "",
                      explorer: network.explorer,
                      chainType,
                    }
                  })
                  .find((n) => n.key === network.key)

                if (selectedNetwork) {
                  drawerWidthStore.set(DrawerWidth.Wide)
                  drawerContentStore.set(() => (
                    <TokenDrawer
                      token={{
                        id: selectedNetwork.tokenId,
                        name: selectedNetwork.tokenName,
                        logo: selectedNetwork.tokenLogo,
                        symbol: selectedNetwork.tokenSymbol,
                      }}
                      network={selectedNetwork}
                      environment={environment}
                    />
                  ))
                }
              }}
            />
          )
        })}
      </div>
      {!seeMore && <SeeMore onClick={() => setSeeMore(!seeMore)} />}
    </>
  )
}

export default ChainTokenGrid
