import { Environment, getAllTokenLanes, getTokenData, Version } from "~/config/data/ccip"
import TokenCard from "../Cards/TokenCard"
import { drawerContentStore } from "../Drawer/drawerStore"
import TokenDrawer from "../Drawer/TokenDrawer"
import { directoryToSupportedChain, getChainIcon, getTitle } from "~/features/utils"
import React from "react"

interface ChainTokenGridProps {
  tokens: {
    name: string
    logo: string
    totalNetworks: number
  }[]
  network: {
    name: string
    logo: string
    tokenAddress: string
    tokenPoolType: string
    tokenPoolAddress: string
    decimals: number
    key: string
    explorerUrl: string
  }
  environment: Environment
}

function ChainTokenGrid({ tokens, network, environment }: ChainTokenGridProps) {
  return tokens.map((token) => {
    const data = getTokenData({
      environment,
      version: Version.V1_2_0,
      tokenSymbol: token.name || "",
    })
    return (
      <TokenCard
        name={token.name}
        logo={token.logo}
        key={token.name}
        onClick={() => {
          const selectedNetwork = Object.keys(data)
            .map((key) => {
              const directory = directoryToSupportedChain(key || "")
              const title = getTitle(directory) || ""
              const networkLogo = getChainIcon(directory) || ""
              return {
                name: title,
                token: data[key].name || "",
                key,
                logo: networkLogo,
                symbol: token,
                tokenLogo: network.logo || "",
                decimals: data[key].decimals || 0,
                tokenAddress: data[key].tokenAddress || "",
                tokenPoolType: data[key].poolType || "",
                tokenPoolAddress: data[key].poolAddress || "",
                explorerUrl: network.explorerUrl,
              }
            })
            .find((n) => n.key === network.key)

          if (selectedNetwork) {
            drawerContentStore.set(() => (
              <TokenDrawer
                token={{
                  name: data[Object.keys(data)[0]]?.name || "",
                  logo: token.logo,
                  symbol: token.name,
                }}
                network={selectedNetwork}
                destinationLanes={getAllTokenLanes({
                  environment,
                  version: Version.V1_2_0,
                  token: token.name || "",
                })}
                environment={environment}
              />
            ))
          }
        }}
      />
    )
  })
}

export default ChainTokenGrid
