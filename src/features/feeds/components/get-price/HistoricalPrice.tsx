/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds/types/index.ts"
import { PriceButton } from "./PriceButton.tsx"
import { SupportedChain } from "@config/index.ts"
import { getWeb3Provider } from "~/features/utils/index.ts"

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

    priceFeed.getRoundData(BigInt(roundId)).then((historicalRoundData: ROUND_DATA_RESPONSE) => {
      setHistoricalPrice(historicalRoundData.answer.toString())
    })
  }

  const [historicalPrice, setHistoricalPrice] = useState<string>("Historical Price")
  return <PriceButton buttonName={`Round ${roundId}:`} buttonFunction={fetchLatestPrice} value={historicalPrice} />
}
