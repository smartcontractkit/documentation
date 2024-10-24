import Address from "~/components/AddressReact"
import "./Table.css"
import { drawerContentStore } from "../Drawer/drawerStore"
import { Environment, SupportedTokenConfig } from "~/config/data/ccip"
import TableSearchInput from "./TableSearchInput"
import { useState } from "react"
import { getExplorerAddressUrl, fallbackTokenIconUrl } from "~/features/utils"
import TokenDrawer from "../Drawer/TokenDrawer"

interface TableProps {
  networks: {
    name: string
    key: string
    logo: string
    token: string
    tokenLogo: string
    symbol: string
    decimals: number
    tokenAddress: string
    tokenPoolType: string
    tokenPoolAddress: string
    explorerUrl: string
  }[]
  token: {
    name: string
    logo: string
    symbol: string
  }
  lanes: {
    [sourceChain: string]: SupportedTokenConfig
  }
  environment: Environment
}

function TokenChainsTable({ networks, token, lanes: destinationLanes, environment }: TableProps) {
  const [search, setSearch] = useState("")
  return (
    <>
      <div className="ccip-table__filters">
        <div className="ccip-table__filters-title">
          Listed Networks <span>({networks.length})</span>
        </div>
        <TableSearchInput search={search} setSearch={setSearch} />
      </div>
      <div className="ccip-table__wrapper">
        <table className="ccip-table">
          <thead>
            <tr>
              <th>Network</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Decimals</th>
              <th>Token address</th>
              <th>Token pool type</th>
              <th>Token pool address</th>
            </tr>
          </thead>
          <tbody>
            {networks
              ?.filter((network) => network.name.toLowerCase().includes(search.toLowerCase()))
              .map((network, index) => (
                <tr key={index}>
                  <td>
                    <div
                      className="ccip-table__network-name"
                      role="button"
                      onClick={() => {
                        drawerContentStore.set(() => (
                          <TokenDrawer
                            token={token}
                            network={network}
                            destinationLanes={destinationLanes}
                            environment={environment}
                          />
                        ))
                      }}
                    >
                      <span className="ccip-table__logoContainer">
                        <img
                          src={network.logo}
                          alt={network.name}
                          className="ccip-table__logo"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null // prevents looping
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                        <img
                          src={network.tokenLogo}
                          alt={network.token}
                          className="ccip-table__smallLogo"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null // prevents looping
                            currentTarget.src = fallbackTokenIconUrl
                          }}
                        />
                      </span>
                      {network.name}
                    </div>
                  </td>
                  <td>{network.token}</td>
                  <td>{network.symbol}</td>
                  <td>{network.decimals}</td>
                  <td data-clipboard-type="token">
                    <Address
                      contractUrl={getExplorerAddressUrl(network.explorerUrl)(network.tokenAddress)}
                      address={network.tokenAddress}
                      endLength={6}
                    />
                  </td>
                  <td>{network.tokenPoolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}</td>
                  <td data-clipboard-type="token-pool">
                    <Address
                      contractUrl={getExplorerAddressUrl(network.explorerUrl)(network.tokenPoolAddress)}
                      address={network.tokenPoolAddress}
                      endLength={6}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="ccip-table__notFound">
          {networks?.filter((network) => network.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
            <>No networks found</>
          )}
        </div>
      </div>
    </>
  )
}

export default TokenChainsTable
