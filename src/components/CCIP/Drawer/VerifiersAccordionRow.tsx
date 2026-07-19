import { ChainType, ExplorerInfo } from "~/config/index.ts"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import Address from "~/components/AddressReact.tsx"
import { Typography } from "@chainlink/blocks"
import type { LaneVerifierRow } from "./verifierRows.ts"

export interface VerifiersAccordionRowProps {
  rows: LaneVerifierRow[]
  /** Explorer + chain type for resolving source-chain verifier address links. */
  sourceExplorer: ExplorerInfo
  sourceChainType: ChainType
  /** Explorer + chain type for resolving destination-chain verifier address links. */
  destinationExplorer: ExplorerInfo
  destinationChainType: ChainType
}

export function VerifiersAccordionRow({
  rows,
  sourceExplorer,
  sourceChainType,
  destinationExplorer,
  destinationChainType,
}: VerifiersAccordionRowProps) {
  return (
    <tr className="ccip-table__verifier-row">
      <td colSpan={7} style={{ padding: 0 }}>
        <div className="ccip-table__verifier-content">
          {rows.length === 0 ? (
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
              <Typography variant="body">No verifiers configured for this lane.</Typography>
            </div>
          ) : (
            <table className="ccip-table ccip-table--verifiers">
              <thead>
                <tr>
                  <th>Verifier</th>
                  <th>Source verifier address</th>
                  <th>Destination verifier address</th>
                  <th>Required</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((verifier) => (
                  <tr key={verifier.key}>
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
                      {verifier.sourceAddress ? (
                        <Address
                          contractUrl={getExplorerAddressUrl(sourceExplorer, sourceChainType)(verifier.sourceAddress)}
                          address={verifier.sourceAddress}
                          endLength={4}
                        />
                      ) : (
                        <Typography variant="body">—</Typography>
                      )}
                    </td>
                    <td>
                      {verifier.destinationAddress ? (
                        <Address
                          contractUrl={getExplorerAddressUrl(
                            destinationExplorer,
                            destinationChainType
                          )(verifier.destinationAddress)}
                          address={verifier.destinationAddress}
                          endLength={4}
                        />
                      ) : (
                        <Typography variant="body">—</Typography>
                      )}
                    </td>
                    <td>
                      <Typography variant="body">
                        {verifier.aboveThresholdOnly ? "Above threshold" : "Always"}
                      </Typography>
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
