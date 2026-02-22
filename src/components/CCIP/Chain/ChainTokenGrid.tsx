import { Environment, Version, Network } from "~/config/data/ccip/types.ts"
import { getAllTokenLanes, getTokenData } from "~/config/data/ccip/data.ts"
import TokenCard from "../Cards/TokenCard.tsx"
import { drawerContentStore } from "../Drawer/drawerStore.ts"
import TokenDrawer from "../Drawer/TokenDrawer.tsx"
import { directoryToSupportedChain, getChainIcon, getChainTypeAndFamily, getTitle } from "~/features/utils/index.ts"
import { useState } from "react"
import "./ChainTokenGrid.css"
import SeeMore from "../SeeMore/SeeMore.tsx"

interface ChainTokenGridProps {
  tokens: {
    id: string
    logo: string
    totalNetworks: number
  }[]
  network: Network
  environment: Environment
}

const BEFORE_SEE_MORE = 6 * 4 // Number of networks to show before the "See more" button, 7 rows x 4 items

function ChainTokenGrid({ tokens, network, environment }: ChainTokenGridProps) {
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
              onClick={() => {
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
                      tokenPoolType: data[key].pool.type,
                      tokenPoolRawType: data[key].pool.rawType,
                      tokenPoolAddress: data[key].pool.address || "",
                      tokenPoolVersion: data[key].pool.version || "",
                      explorer: network.explorer,
                      chainType,
                    }
                  })
                  .find((n) => n.key === network.key)

                if (selectedNetwork) {
                  const destinationLanes = getAllTokenLanes({
                    environment,
                    version: Version.V1_2_0,
                    token: token.id,
                  })[selectedNetwork.key]
                  drawerContentStore.set(() => (
                    <TokenDrawer
                      token={{
                        id: selectedNetwork.tokenId,
                        name: selectedNetwork.tokenName,
                        logo: selectedNetwork.tokenLogo,
                        symbol: selectedNetwork.tokenSymbol,
                      }}
                      network={selectedNetwork}
                      destinationLanes={destinationLanes}
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
