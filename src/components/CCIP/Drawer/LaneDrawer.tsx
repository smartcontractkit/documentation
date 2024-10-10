import Address from "../Address/Address"
import "../Tables/Table.css"
import { Environment, getNetwork, getTokenData, LaneConfig, representMoney, Version } from "~/config/data/ccip"

import { useState } from "react"
import LaneDetailsHero from "../ChainHero/LaneDetailsHero"
import { getExplorerAddressUrl, getTokenIconUrl } from "~/features/utils"
import TableSearchInput from "../Tables/TableSearchInput"

function LaneDrawer({
  lane,
  sourceNetwork,
  destinationNetwork,
  environment,
}: {
  lane: LaneConfig
  sourceNetwork: { name: string; logo: string; key: string }
  destinationNetwork: { name: string; logo: string; key: string; explorerUrl: string }
  environment: Environment
}) {
  const [search, setSearch] = useState("")
  const destinationNetworkDetails = getNetwork({
    filter: environment,
    chain: destinationNetwork.key,
  })

  return (
    <>
      <LaneDetailsHero
        sourceNetwork={{
          logo: sourceNetwork.logo,
          name: sourceNetwork.name,
        }}
        destinationNetwork={{
          logo: destinationNetwork.logo,
          name: destinationNetwork.name,
        }}
        onRamp={lane.onRamp.address}
        explorerUrl={destinationNetworkDetails?.explorerUrl || ""}
        destinationAddress={destinationNetworkDetails?.chainSelector || ""}
      />

      <div className="ccip-table__drawer-container">
        <div className="ccip-table__filters">
          <div>
            <div className="ccip-table__filters-title">
              Tokens <span>({lane?.supportedTokens ? Object.keys(lane.supportedTokens).length : 0})</span>
            </div>
          </div>
          <TableSearchInput search={search} setSearch={setSearch} />
        </div>
        <table className="ccip-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Token address (Source)</th>
              <th>Decimals</th>
              <th>Mechanism</th>
              <th>Rate limit capacity</th>
              <th>Rate limit refil rate</th>
            </tr>
          </thead>
          <tbody>
            {lane.supportedTokens &&
              Object.keys(lane.supportedTokens)
                ?.filter((token) => token.toLowerCase().includes(search.toLowerCase()))
                .map((token, index) => {
                  const data = getTokenData({
                    environment: Environment.Mainnet,
                    version: Version.V1_2_0,
                    tokenSymbol: token || "",
                  })
                  if (!Object.keys(data).length) return null
                  const logo = getTokenIconUrl(token)

                  return (
                    <tr key={index}>
                      <td>
                        <a href={`/ccip/supported-networks/${environment}/token/${token}`}>
                          <div className="ccip-table__network-name">
                            <img src={logo} alt={`${token} logo`} className="ccip-table__logo" />
                            {token}
                          </div>
                        </a>
                      </td>
                      <td>
                        <Address
                          address={data[sourceNetwork.key].tokenAddress}
                          endLength={6}
                          contractUrl={getExplorerAddressUrl(destinationNetwork.explorerUrl)(
                            data[sourceNetwork.key].tokenAddress
                          )}
                        />
                      </td>
                      <td>{data[sourceNetwork.key].decimals}</td>

                      <td>{data[sourceNetwork.key].poolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}</td>
                      <td>
                        {lane.supportedTokens &&
                          representMoney(String(lane.supportedTokens[token]?.rateLimiterConfig?.capacity || 0))}{" "}
                        {token}
                        /second
                      </td>
                      <td>
                        {lane.supportedTokens &&
                          representMoney(String(lane.supportedTokens[token]?.rateLimiterConfig?.rate || 0))}{" "}
                        {token}
                        /second
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
        <div className="ccip-table__notFound">
          {lane.supportedTokens &&
            Object.keys(lane.supportedTokens)?.filter((lane) => lane.toLowerCase().includes(search.toLowerCase()))
              .length === 0 && <>No tokens found</>}
        </div>
      </div>
    </>
  )
}

export default LaneDrawer
