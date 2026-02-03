import Address from "~/components/AddressReact.tsx"
import "./Table.css"
import { Environment, Verifier, getVerifierTypeDisplay } from "~/config/data/ccip/index.ts"
import TableSearchInput from "./TableSearchInput.tsx"
import { useState } from "react"
import {
  getExplorerAddressUrl,
  fallbackVerifierIconUrl,
  getChainIcon,
  getTitle,
  directoryToSupportedChain,
  getExplorer,
  getChainTypeAndFamily,
} from "~/features/utils/index.ts"

interface VerifiersTableProps {
  verifiers: Verifier[]
}

function VerifiersTable({ verifiers }: VerifiersTableProps) {
  const [search, setSearch] = useState("")

  // Transform verifiers data to include network information
  const verifiersWithNetworkInfo = verifiers.map((verifier) => {
    const supportedChain = directoryToSupportedChain(verifier.network)
    const networkName = getTitle(supportedChain) || verifier.network
    const networkLogo = getChainIcon(supportedChain) || ""
    const explorer = getExplorer(supportedChain)
    const { chainType } = getChainTypeAndFamily(supportedChain)

    return {
      ...verifier,
      networkName,
      networkLogo,
      supportedChain,
      explorer,
      chainType,
    }
  })

  const filteredVerifiers = verifiersWithNetworkInfo.filter(
    (verifier) =>
      verifier.name.toLowerCase().includes(search.toLowerCase()) ||
      verifier.networkName.toLowerCase().includes(search.toLowerCase()) ||
      verifier.address.toLowerCase().includes(search.toLowerCase()) ||
      getVerifierTypeDisplay(verifier.type).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="ccip-table__filters">
        <div className="ccip-table__filters-title">
          Verifiers <span>({verifiers.length})</span>
        </div>
        <TableSearchInput search={search} setSearch={setSearch} />
      </div>
      <div className="ccip-table__wrapper">
        <table className="ccip-table">
          <thead>
            <tr>
              <th>Verifier</th>
              <th>Network</th>
              <th>Verifier address</th>
              <th>Verifier type</th>
            </tr>
          </thead>
          <tbody>
            {filteredVerifiers.map((verifier, index) => (
              <tr key={`${verifier.network}-${verifier.address}`}>
                <td>
                  <div className="ccip-table__network-name">
                    <span className="ccip-table__logoContainer">
                      <img
                        src={verifier.logo}
                        alt={`${verifier.name} verifier logo`}
                        className="ccip-table__logo"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null // prevents looping
                          currentTarget.src = fallbackVerifierIconUrl
                        }}
                      />
                    </span>
                    {verifier.name}
                  </div>
                </td>
                <td>
                  <div className="ccip-table__network-name">
                    <span className="ccip-table__logoContainer">
                      <img
                        src={verifier.networkLogo}
                        alt={`${verifier.networkName} blockchain logo`}
                        className="ccip-table__logo"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null // prevents looping
                          currentTarget.src = fallbackVerifierIconUrl
                        }}
                      />
                    </span>
                    {verifier.networkName}
                  </div>
                </td>
                <td data-clipboard-type="verifier-address">
                  <Address
                    contractUrl={
                      verifier.explorer
                        ? getExplorerAddressUrl(verifier.explorer, verifier.chainType)(verifier.address)
                        : ""
                    }
                    address={verifier.address}
                    endLength={4}
                  />
                </td>
                <td>{getVerifierTypeDisplay(verifier.type)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ccip-table__notFound">{filteredVerifiers.length === 0 && <>No verifiers found</>}</div>
      </div>
    </>
  )
}

export default VerifiersTable
