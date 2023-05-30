import { network } from "~/features/vrf/v2/data"
import "./costTable.css"
import useFetch from "~/hooks/useFetch"
import { useState } from "preact/hooks"
import { APIKeys } from "./Dropdown.astro"

interface net {
  chain: network
  apiKeys: APIKeys
}

interface dataResponse {
  id: number
  jsonrpc: string
  result: string
}

export const CostTable = ({ chain, apiKeys }: net) => {
  const [gasPrice, setGasPrice] = useState<string>("")
  const gasUrl = `${chain.baseApiUrl}/api?module=proxy&action=eth_gasPrice&apiKey=${apiKeys.ethereum}`
  // TODO: Use Viem instead of ethers.js to read the below contract + read VRFCoordinator contract to get Config data.
  // const chainlinkAddress = "0x347Aa06Fd1a911078D858d87c4D1AE59Be818538"
  // const callbackGasLimitUrl = `${chain.baseApiUrl}/api?module=contract&action=getabi&address=${chainlinkAddress}&apiKey=${apiKeys.ethereum}`
  // const callbackGasResponse = useFetch<any>(callbackGasLimitUrl, { method: "GET" })
  const gasResponse = useFetch<dataResponse>(gasUrl, { method: "GET" })
  const hexToDecimal = (hex: string): number => parseInt(hex, 16)

  return (
    <div className="table-container">
      <table>
        <tr>
          <th>Input</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Gas price</td>
          <td>{gasPrice} gwei</td>
        </tr>
        <tr>
          <td>Callback gas limit</td>
          <td>100000</td>
        </tr>
        <tr>
          <td>Max verification gas</td>
          <td>200000</td>
        </tr>
        <tr>
          <td>LINK premium</td>
          <td>0.25 LINK</td>
        </tr>
      </table>
      <button
        onClick={() => {
          const gasPrice = hexToDecimal(gasResponse.data.result).toString()
          setGasPrice(gasPrice)
        }}
      >
        Calculate
      </button>
      <h6>{chain.name}: 37.5 LINK</h6>
    </div>
  )
}
