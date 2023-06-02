import { network } from "~/features/vrf/v2/data"
import "./costTable.css"
import { useEffect, useState } from "preact/hooks"
import { APIKeys } from "./Dropdown.astro"
import { ethers, utils } from "ethers"
import { SupportedChain } from "~/config"
import { getWeb3Provider } from "~/features/utils"

interface net {
  chain: network
  apiKeys: APIKeys
  method: "subscription" | "directFunding"
}

interface dataResponse {
  id: number
  jsonrpc: string
  result: string
}

export const CostTable = ({ chain, apiKeys, method }: net) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [gasPrice, setGasPrice] = useState<string>("")
  const [LINKPremium, setLINKPremium] = useState<number>(0.5)
  const [callbackGasLimit, setCallbackGasLimit] = useState<string>("")
  const [wrapperOverheadGas, setWrapperOverheadGas] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  const gasUrl = `${chain.baseApiUrl}/api?module=proxy&action=eth_gasPrice&apiKey=${apiKeys.ethereum}`
  // TODO: Use Viem instead of ethers.js to read the below contract + read VRFCoordinator contract to get Config data.
  const abiUrl = `${chain.baseApiUrl}/api?module=contract&action=getabi&address=${chain.vrfCoordinatorContractAddress}&apiKey=${apiKeys.ethereum}`
  const abiWrapperUrl = `${chain.baseApiUrl}/api?module=contract&action=getabi&address=${chain.vrfWrapperContractAddress}&apiKey=${apiKeys.ethereum}`
  const abiPriceFeedUrl = `${chain.baseApiUrl}/api?module=contract&action=getabi&address=${chain.priceFeedAddress}&apiKey=${apiKeys.ethereum}`

  useEffect(() => {
    setIsLoading(true)
    const fillInputs = async () => {
      const urls: string[] = [gasUrl, abiUrl, abiWrapperUrl, abiPriceFeedUrl]
      const res = await Promise.all(urls.map((url: string) => fetch(url, { method: "GET" })))
      const [gas, vrfCoordinatorAbi, vrfWrapperAbi, priceFeedAbi] = await Promise.all(
        res.map((response) => response.json())
      )

      const [fetchedGasPrice, fetchedCoordinatorAbi, fetchedVrfWrapperAbi, fetchedPriceFeedAbi] = [
        gas.result,
        vrfCoordinatorAbi.result,
        vrfWrapperAbi.result,
        priceFeedAbi.result,
      ]

      console.log(vrfCoordinatorAbi)
      const gasPriceInDecimals = parseInt(fetchedGasPrice, 16)
      setGasPrice(utils.formatUnits(gasPriceInDecimals, "gwei"))

      // read vrfCoordinator contract (only works for Ethereum Mainnet for now)
      const supportedChain: SupportedChain = "ETHEREUM_MAINNET"
      const rpcProvider = getWeb3Provider(supportedChain)
      const vrfCoordinatorContract = new ethers.Contract(
        chain.vrfCoordinatorContractAddress,
        fetchedCoordinatorAbi,
        rpcProvider
      )

      // read callback gas limit from getRequestConfig function in contract
      const [, callbackGasLimitReceived, verificationGasArray] = await vrfCoordinatorContract.getRequestConfig()
      setCallbackGasLimit(callbackGasLimitReceived)

      // get LINK / ETH latest price from Oracle data feed
      const priceFeedContract = new ethers.Contract(chain.priceFeedAddress, fetchedPriceFeedAbi, rpcProvider)
      const lastestPriceHex = await priceFeedContract.latestRoundData()
      const latestPrice = utils.formatEther(parseInt(lastestPriceHex.answer._hex, 16))

      // Handle directFunding and subscription method for LINK Premium and Wrapper gas overhead
      if (method === "directFunding") {
        // Read vrfWrapperContract
        const vrfWrapperContract = new ethers.Contract(
          chain.vrfWrapperContractAddress,
          fetchedVrfWrapperAbi,
          rpcProvider
        )

        // Read output of getConfig method in contract to get both LINK Premium and Wrapper gas overhead
        const configOutput = await vrfWrapperContract.getConfig()
        setLINKPremium(configOutput.fulfillmentFlatFeeLinkPPM * 10 ** -6)
        setWrapperOverheadGas(configOutput.wrapperGasOverhead)
      } else {
        const feeConfig = await vrfCoordinatorContract.getFeeConfig()
        console.log(feeConfig)
        setLINKPremium(feeConfig.fulfillmentFlatFeeLinkPPMTier1 * 10 ** -6)
      }

      setIsLoading(false)
    }

    fillInputs().catch((error) => {
      setIsLoading(false)
      console.error(error)
    })

    return () => setIsLoading(false)
  }, [method])

  if (isLoading) {
    return <p>Data is fetched. Please wait a moment...</p>
  } else {
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
            <td>{callbackGasLimit}</td>
          </tr>
          <tr>
            <td>Max verification gas</td>
            <td>200000</td>
          </tr>
          {method === "directFunding" && (
            <tr>
              <td>Wrapper overhead gas</td>
              <td>{wrapperOverheadGas}</td>
            </tr>
          )}
          <tr>
            <td>LINK premium</td>
            <td>{LINKPremium} LINK</td>
          </tr>
        </table>
        <button>Calculate</button>
        <h6>
          {chain.name}: {total} LINK
        </h6>
      </div>
    )
  }
}
