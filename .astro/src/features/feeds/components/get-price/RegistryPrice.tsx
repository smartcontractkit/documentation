/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { feedRegistryInterfaceABI } from "@abi"
import { ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PriceButton } from "./PriceButton"
import { web3Providers } from "@config"

export const RegistryPrice = ({
  registryAddress,
  baseSymbol,
  baseAddress,
  quoteSymbol,
  quoteAddress,
  provider,
}: {
  registryAddress: string
  baseSymbol: string
  baseAddress: string
  quoteSymbol: string
  quoteAddress: string
  provider: web3Providers.ProviderList
}) => {
  const fetchLatestPrice = (e: Event) => {
    e.preventDefault()
    const rpcProvider = web3Providers[provider]
    const feedRegistry = new ethers.Contract(
      registryAddress,
      feedRegistryInterfaceABI,
      rpcProvider
    )

    feedRegistry
      .latestRoundData(baseAddress, quoteAddress)
      .then((roundData: ROUND_DATA_RESPONSE) => {
        setLatestPrice(roundData.answer.toString())
      })
  }

  const [latestPrice, setLatestPrice] = useState<string>("Latest Price")
  return (
    <PriceButton
      buttonName={`Latest ${baseSymbol}/${quoteSymbol} Price:`}
      buttonFunction={fetchLatestPrice}
      value={latestPrice}
    />
  )
}
