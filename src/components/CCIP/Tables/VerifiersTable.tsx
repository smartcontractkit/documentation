import Address from "~/components/AddressReact.tsx"
import "./Table.css"
import {
  Environment,
  Verifier,
  VerifierType,
  VerifierDescription,
  getVerifierTypeDisplay,
} from "~/config/data/ccip/index.ts"
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
  uniqueVerifiers?: Array<{
    id: string
    name: string
    type: VerifierType
    logo: string
    totalNetworks: number
  }>
  verifierDescriptions?: Record<string, VerifierDescription | undefined>
}

function VerifiersTable({ verifiers, uniqueVerifiers, verifierDescriptions }: VerifiersTableProps) {
  const [search, setSearch] = useState("")

  const verifierFilter =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("verifier") : null
  const filteredVerifierName =
    verifierFilter && uniqueVerifiers ? uniqueVerifiers.find((v) => v.id === verifierFilter)?.name : undefined
  const filteredVerifierDescription =
    verifierFilter && verifierDescriptions ? verifierDescriptions[verifierFilter] : undefined

  // Transform verifiers data to include network information.
  // Every network key in verifiers.json MUST be mapped in
  // directoryToSupportedChain (validated by `npm run validate:ccip-data`).
  // If this throws, the data layer is out of sync — fix the mappings, don't
  // silence the error here.
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

  const filteredVerifiers = verifiersWithNetworkInfo
    .filter((verifier) => (verifierFilter ? verifier.id === verifierFilter : true))
    .filter(
      (verifier) =>
        verifier.name.toLowerCase().includes(search.toLowerCase()) ||
        verifier.networkName.toLowerCase().includes(search.toLowerCase()) ||
        verifier.address.toLowerCase().includes(search.toLowerCase()) ||
        getVerifierTypeDisplay(verifier.type).toLowerCase().includes(search.toLowerCase())
    ) as (Verifier & {
    networkName: string
    networkLogo: string
    explorer: ReturnType<typeof getExplorer>
    chainType: ReturnType<typeof getChainTypeAndFamily>["chainType"]
  })[]

  return (
    <>
      <div className="ccip-table__filters">
        <div className="ccip-table__filters-title">
          {filteredVerifierName ? `${filteredVerifierName} verifiers` : "Verifiers"}{" "}
          <span>({filteredVerifiers.length})</span>
        </div>
        <TableSearchInput search={search} setSearch={setSearch} />
      </div>
      {filteredVerifierDescription && (
        <div className="ccip-table__verifier-description">
          <p>{filteredVerifierDescription.description}</p>
          {filteredVerifierDescription.learnMoreUrl && (
            <p>
              <a
                href={filteredVerifierDescription.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ccip-table__verifier-description-link"
              >
                {filteredVerifierDescription.learnMoreLabel || "Learn more"}
              </a>
            </p>
          )}
        </div>
      )}
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
