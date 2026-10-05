/** @jsxImportSource preact */
import { clsx } from "~/lib/clsx/clsx.ts"
import tableStyles from "./Tables.module.css"
import atlasStyles from "./AtlasContractsTable.module.css"
import { ATLAS_CONTRACTS } from "../utils/atlasContracts.ts"

const ATLAS_CHAINS: { label: string; key: string }[] = [
  { label: "Arbitrum", key: "arbitrum" },
  { label: "Arc", key: "arc" },
  { label: "Base", key: "base" },
  { label: "BNB Chain", key: "bnb-chain" },
  { label: "HyperEVM", key: "hyperevm" },
  { label: "Ink", key: "ink" },
  { label: "Monad", key: "monad" },
  { label: "Robinhood Chain", key: "robinhood" },
  { label: "Unichain", key: "unichain" },
]

export const AddressCell = ({ address, explorerUrl }: { address: string; explorerUrl: string }) => (
  <div className={tableStyles.assetAddress}>
    <button
      className={clsx(tableStyles.copyBtn, "copy-iconbutton")}
      data-clipboard-text={address}
      aria-label="Copy address to clipboard"
    >
      <img src="/assets/icons/copyIcon.svg" alt="copy to clipboard" />
    </button>
    <a className={tableStyles.addressLink} href={explorerUrl.replace("%s", address)} target="_blank">
      {address}
    </a>
  </div>
)

export const AtlasContractsTable = () => (
  <div className={tableStyles.tableWrapper}>
    <table className={clsx(tableStyles.table, atlasStyles.atlasTable)}>
      <thead>
        <tr>
          <th>Network</th>
          <th>Atlas (v1.6.4)</th>
          <th>DappControl</th>
        </tr>
      </thead>
      <tbody>
        {ATLAS_CHAINS.map(({ label, key }) => {
          const contracts = ATLAS_CONTRACTS[key]
          if (!contracts) return null
          return (
            <tr key={key}>
              <td>{label}</td>
              <td>
                <AddressCell address={contracts.atlas} explorerUrl={contracts.explorerUrl} />
              </td>
              <td>
                <AddressCell address={contracts.dappControl} explorerUrl={contracts.explorerUrl} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
