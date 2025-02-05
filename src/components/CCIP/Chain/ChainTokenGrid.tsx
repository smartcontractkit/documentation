import { Environment, getAllTokenLanes, getTokenData, Version, PoolType } from "~/config/data/ccip"
import TokenCard from "../Cards/TokenCard"
import { drawerContentStore } from "../Drawer/drawerStore"
import TokenDrawer from "../Drawer/TokenDrawer"
import { directoryToSupportedChain, getChainIcon, getTitle } from "~/features/utils"
import { useState } from "react"
import "./ChainTokenGrid.css"
import SeeMore from "../SeeMore/SeeMore"
import { ExplorerInfo } from "~/config/types"

interface ChainTokenGridProps {
  tokens: {
    id: string
    logo: string
    totalNetworks: number
  }[]
  network: {
    name: string
    key: string
    logo: string
    tokenId: string
    tokenLogo: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    tokenAddress: string
    tokenPoolType: PoolType
    tokenPoolAddress: string
    explorer: ExplorerInfo
  }
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
                    const directory = directoryToSupportedChain(key || "")
                    const title = getTitle(directory) || ""
                    const networkLogo = getChainIcon(directory) || ""
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
                      tokenPoolType: data[key].poolType,
                      tokenPoolAddress: data[key].poolAddress || "",
                      explorer: network.explorer,
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
