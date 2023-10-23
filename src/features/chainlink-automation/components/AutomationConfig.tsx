/** @jsxImportSource preact */
import { ethers, BigNumber } from "ethers"
import { ChainlinkAutomationConfig } from "@features/chainlink-automation"
import { Address } from "@components"

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
    <div style={{ overflowX: "auto" }}>
      <table style={{ display: "block", overflowX: "auto" }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Registry Address</td>
            {!registryAddress ? (
              <td />
            ) : (
              <td>
                <Address contractUrl={getUrl(registryAddress)} />
              </td>
            )}
          </tr>
          <tr>
            <td>Registrar Address</td>
            {!registrar ? (
              <td />
            ) : (
              <td>
                <Address contractUrl={getUrl(registrar)} />
              </td>
            )}
          </tr>
          <tr>
            <td>Payment Premium %</td>
            {!paymentPremiumPPB ? <td /> : <td>{Math.round(parseInt(paymentPremiumPPB.toString(), 10) / 10000000)}</td>}
          </tr>
          <tr>
            <td>Block Count per Turn</td>
            {!blockCountPerTurn ? <td /> : <td>{blockCountPerTurn.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Maximum Check Data Size</td>
            {!maxCheckDataSize ? <td /> : <td>{maxCheckDataSize.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Check Gas Limit</td>
            {!checkGasLimit ? <td /> : <td>{checkGasLimit.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Perform Gas Limit</td>
            {!maxPerformGas ? <td /> : <td>{maxPerformGas.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Maximum Perform Data Size</td>
            {!maxPerformDataSize ? <td /> : <td>{maxPerformDataSize.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Gas Ceiling Multiplier</td>
            {!gasCeilingMultiplier ? <td /> : <td>{gasCeilingMultiplier.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Minimum Upkeep Spend (LINK)</td>
            {!minUpkeepSpend ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(minUpkeepSpend))}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
