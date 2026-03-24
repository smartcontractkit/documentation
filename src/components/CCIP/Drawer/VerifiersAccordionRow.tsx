import { Verifier } from "~/config/data/ccip/index.ts"
import { ChainType, ExplorerInfo } from "~/config/index.ts"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import Address from "~/components/AddressReact.tsx"
import { Typography } from "@chainlink/blocks"

export interface VerifiersAccordionRowProps {
  destinationVerifiers: Verifier[]
  explorer: ExplorerInfo
  chainType: ChainType
}

export function VerifiersAccordionRow({ destinationVerifiers, explorer, chainType }: VerifiersAccordionRowProps) {
  return (
    <tr className="ccip-table__verifier-row">
      <td colSpan={7} style={{ padding: 0 }}>
        <div className="ccip-table__verifier-content">
          {destinationVerifiers.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60px",
              }}
            >
              <Typography variant="body">No verifiers found for this network.</Typography>
            </div>
          ) : (
            <table className="ccip-table ccip-table--verifiers">
              <thead>
                <tr>
                  <th>Verifier</th>
                  <th>Source verifier address</th>
                  <th>Destination verifier address</th>
                  <th>Threshold amount</th>
                </tr>
              </thead>
              <tbody>
                {destinationVerifiers.map((verifier) => (
                  <tr key={verifier.address}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={verifier.logo}
                          alt={`${verifier.name} logo`}
                          className="ccip-table__logo"
                          style={{ width: "24px", height: "24px" }}
                        />
                        <Typography variant="body">{verifier.name}</Typography>
                      </div>
                    </td>
                    <td>
                      <Address
                        contractUrl={getExplorerAddressUrl(explorer, chainType)(verifier.address)}
                        address={verifier.address}
                        endLength={4}
                      />
                    </td>
                    <td>
                      <Address
                        contractUrl={getExplorerAddressUrl(explorer, chainType)(verifier.address)}
                        address={verifier.address}
                        endLength={4}
                      />
                    </td>
                    <td>
                      <Typography variant="body">150,000</Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </td>
    </tr>
  )
}
