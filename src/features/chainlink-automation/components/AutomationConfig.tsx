/** @jsxImportSource preact */
import { ethers, BigNumber } from "ethers"
import { ChainlinkAutomationConfig, ChainlinkAutomationConfig_2_3 } from "@features/chainlink-automation"
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
    fallbackGasPrice,
    fallbackLinkPrice,
    registrar,
    latestVersion
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
            <td>Payment Premium % (LINK)</td>
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
          <tr>
            <td>Fallback Gas Price</td>
            {!fallbackGasPrice ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(fallbackGasPrice))}</td>}
          </tr>
          <tr>
            <td>Fallback LINK Price</td>
            {!fallbackLinkPrice ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(fallbackLinkPrice))}</td>}
          </tr>
          <tr>
            <td>Latest Automation Version</td>
            {!latestVersion ? <td /> : <td>{latestVersion.toLocaleString()}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const AutomationConfig2_3 = ({
  config,
  registryAddress,
  getExplorerAddressUrl: getUrl,
}: {
  config: ChainlinkAutomationConfig_2_3
  registryAddress: string
  getExplorerAddressUrl: (contractAddress: string) => string
}) => {
  const {
    gasFeePPBLink,
    gasFeePPBNative,
    maxCheckDataSize,
    checkGasLimit,
    gasCeilingMultiplier,
    minSpendLink,
    minSpendNative,
    maxPerformGas,
    maxPerformDataSize,
    fallbackGasPrice,
    fallbackLinkPrice,
    fallbackNativePrice,
    registrar,
    latestVersion
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
            <td>Payment Premium % (LINK)</td>
            {!gasFeePPBLink ? <td /> : <td>{Math.round(parseInt(gasFeePPBLink.toString(), 10) / 10000000)}</td>}
          </tr>
          <tr>
            <td>Payment Premium % (Native)</td>
            {!gasFeePPBNative ? <td /> : <td>{Math.round(parseInt(gasFeePPBNative.toString(), 10) / 10000000)}</td>}
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
            <td>Fallback Gas Price</td>
            {!fallbackGasPrice ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(fallbackGasPrice))}</td>}
          </tr>
          <tr>
            <td>Fallback LINK Price</td>
            {!fallbackLinkPrice ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(fallbackLinkPrice))}</td>}
          </tr>
          <tr>
            <td>Fallback Native Price</td>
            {!fallbackNativePrice ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(fallbackNativePrice))}</td>}
          </tr>
          <tr>
            <td>Gas Ceiling Multiplier</td>
            {!gasCeilingMultiplier ? <td /> : <td>{gasCeilingMultiplier.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Minimum Upkeep Spend (LINK)</td>
            {!minSpendLink ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(minSpendLink))}</td>}
          </tr>
          <tr>
            <td>Minimum Upkeep Spend (Native)</td>
            {!minSpendNative ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(minSpendNative))}</td>}
          </tr>
          <tr>
            <td>Latest Automation Version</td>
            {!latestVersion ? <td /> : <td>{latestVersion.toLocaleString()}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}