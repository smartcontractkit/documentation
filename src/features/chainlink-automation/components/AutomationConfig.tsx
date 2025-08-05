/** @jsxImportSource preact */
import { formatEther } from "ethers"
import { ChainlinkAutomationConfig } from "@features/chainlink-automation/types/index.ts"
import Address from "@components/Address.tsx"

export const AutomationConfig = ({
  config,
  registryAddress,
  getExplorerAddressUrl: getUrl,
}: {
  config: ChainlinkAutomationConfig
  registryAddress: string
  getExplorerAddressUrl: (contractAddress: string) => string
}) => {
  const {
    paymentPremiumPPB,
    blockCountPerTurn,
    maxCheckDataSize,
    checkGasLimit,
    gasCeilingMultiplier,
    minUpkeepSpend,
    maxPerformGas,
    maxPerformDataSize,
    registrar,
  } = config

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "center", padding: "8px", borderBottom: "1px solid #ddd" }}>Item</th>
            <th style={{ textAlign: "center", padding: "8px", borderBottom: "1px solid #ddd" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Registry Address</td>
            {!registryAddress ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                <Address contractUrl={getUrl(registryAddress)} />
              </td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Registrar Address</td>
            {!registrar ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                <Address contractUrl={getUrl(registrar)} />
              </td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Payment Premium %</td>
            {!paymentPremiumPPB ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {Math.round(parseInt(paymentPremiumPPB.toString(), 10) / 10000000)}
              </td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Block Count per Turn</td>
            {!blockCountPerTurn ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{blockCountPerTurn.toLocaleString()}</td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Maximum Check Data Size</td>
            {!maxCheckDataSize ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{maxCheckDataSize.toLocaleString()}</td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Check Gas Limit</td>
            {!checkGasLimit ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{checkGasLimit.toLocaleString()}</td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Perform Gas Limit</td>
            {!maxPerformGas ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{maxPerformGas.toLocaleString()}</td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Maximum Perform Data Size</td>
            {!maxPerformDataSize ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{maxPerformDataSize.toLocaleString()}</td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Gas Ceiling Multiplier</td>
            {!gasCeilingMultiplier ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {gasCeilingMultiplier.toLocaleString()}
              </td>
            )}
          </tr>
          <tr>
            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>Minimum Upkeep Spend (LINK)</td>
            {!minUpkeepSpend ? (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }} />
            ) : (
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{formatEther(minUpkeepSpend.hex)}</td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
