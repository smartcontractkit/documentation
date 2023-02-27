/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { feedRegistryInterfaceABI } from "@abi"
import { ethers } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PriceButton } from "./PriceButton"
import { SupportedChain } from "@config"
import { getWeb3Provider } from "@features/utils"

export const RegistryPrice = ({
  registryAddress,
  baseSymbol,
  baseAddress,
  quoteSymbol,
  quoteAddress,
  supportedChain,
}: {
  registryAddress: string
  baseSymbol: string
  baseAddress: string
  quoteSymbol: string
  quoteAddress: string
  supportedChain: SupportedChain
}) => {
  const fetchLatestPrice = (e: Event) => {
    e.preventDefault()
    const rpcProvider = getWeb3Provider(supportedChain)
    if (!rpcProvider) {
      console.error(`web3 provider not found for chain ${supportedChain}`)
      return
    }
    const feedRegistry = new ethers.Contract(registryAddress, feedRegistryInterfaceABI, rpcProvider)

    feedRegistry.latestRoundData(baseAddress, quoteAddress).then((roundData: ROUND_DATA_RESPONSE) => {
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
