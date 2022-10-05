/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { BigNumber, ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PriceButton } from "./PriceButton"
import { web3Providers } from "@config"

export const HistoricalPrice = ({
  feedAddress,
  roundId,
  provider,
}: {
  feedAddress: string
  roundId: string
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

    priceFeed
      .getRoundData(BigNumber.from(roundId))
      .then((historicalRoundData: ROUND_DATA_RESPONSE) => {
        setHistoricalPrice(historicalRoundData.answer.toString())
      })
  }

  const [historicalPrice, setHistoricalPrice] =
    useState<string>("Historical Price")
  return (
    <PriceButton
      buttonName={`Round ${roundId}:`}
      buttonFunction={fetchLatestPrice}
      value={historicalPrice}
    />
  )
}
