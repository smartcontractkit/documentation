/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { BigNumber, ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PriceButton } from "./PriceButton"
import { SupportedChain } from "@config"
import { getWeb3Provider } from "~/features/utils"

export const HistoricalPrice = ({
  feedAddress,
  roundId,
  supportedChain,
}: {
  feedAddress: string
  roundId: string
  supportedChain: SupportedChain
}) => {
  const fetchLatestPrice = (e: Event) => {
    e.preventDefault()
    const rpcProvider = getWeb3Provider(supportedChain)
    if (!rpcProvider) {
      console.error(`web3 provider not found for chain ${supportedChain}`)
      return
    }

    const priceFeed = new ethers.Contract(feedAddress, aggregatorV3InterfaceABI, rpcProvider)

    priceFeed.getRoundData(BigNumber.from(roundId)).then((historicalRoundData: ROUND_DATA_RESPONSE) => {
      setHistoricalPrice(historicalRoundData.answer.toString())
    })
  }

  const [historicalPrice, setHistoricalPrice] = useState<string>("Historical Price")
  return <PriceButton buttonName={`Round ${roundId}:`} buttonFunction={fetchLatestPrice} value={historicalPrice} />
}
