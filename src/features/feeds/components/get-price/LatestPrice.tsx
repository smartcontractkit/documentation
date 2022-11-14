/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PriceButton } from "./PriceButton"
import { SupportedChain } from "@config"
import { getWeb3Provider } from "~/features/utils"

export const LatestPrice = ({
  feedAddress,
  supportedChain,
}: {
  feedAddress: string
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

    priceFeed.latestRoundData().then((roundData: ROUND_DATA_RESPONSE) => {
      setLatestPrice(roundData.answer.toString())
    })
  }

  const [latestPrice, setLatestPrice] = useState<string>("Latest Price")

  return <PriceButton buttonName=" Latest Price:" buttonFunction={fetchLatestPrice} value={latestPrice} />
}
