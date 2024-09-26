import { Address } from "~/components"
import "./Table.css"

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
  }[]
}

function TokenChainsTable({ networks }: TableProps) {
  return (
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
        {networks?.map((network, index) => (
          <tr key={index}>
            <td>
              <div className="ccip-table__network-name">
                <span className="ccip-table__logoContainer">
                  <img src={network.logo} alt={network.name} className="ccip-table__logo" />
                  <img src={network.tokenLogo} alt={network.token} className="ccip-table__smallLogo" />
                </span>
                {network.name}
              </div>
            </td>
            <td>{network.token}</td>
            <td>{network.symbol}</td>
            <td>{network.decimals}</td>
            <td>
              <Address contractUrl={network.tokenAddress} address={network.tokenAddress} endLength={6} />
            </td>
            <td>{network.tokenPoolType === "lockRelease" ? "Lock/Release" : "Burn/Mint"}</td>
            <td>
              <Address contractUrl={network.tokenPoolAddress} address={network.tokenPoolAddress} endLength={6} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TokenChainsTable
