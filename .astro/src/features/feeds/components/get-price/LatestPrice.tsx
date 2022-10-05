/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PriceButton } from "./PriceButton"
import { web3Providers } from "@config"

export const LatestPrice = ({
  feedAddress,
  provider,
}: {
  feedAddress: string
  provider: web3Providers.ProviderList
}) => {
  const fetchLatestPrice = (e: Event) => {
    e.preventDefault()
    const rpcProvider = web3Providers[provider]
    const priceFeed = new ethers.Contract(
      feedAddress,
      aggregatorV3InterfaceABI,
      rpcProvider
    )

    priceFeed.latestRoundData().then((roundData: ROUND_DATA_RESPONSE) => {
      setLatestPrice(roundData.answer.toString())
    })
  }

  const [latestPrice, setLatestPrice] = useState<string>("Latest Price")

  return (
    <PriceButton
      buttonName=" Latest Price:"
      buttonFunction={fetchLatestPrice}
      value={latestPrice}
    />
  )
}
