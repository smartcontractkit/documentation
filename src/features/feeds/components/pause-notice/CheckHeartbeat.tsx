/** @jsxImportSource preact */
import { useCallback, useEffect, useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { Contract } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds"
import { PauseNotice } from "./PauseNotice"
import { SupportedChain } from "@config"
import { getWeb3Provider } from "~/features/utils"

export const CheckHeartbeat = ({
  feedAddress,
  supportedChain,
  feedName,
  list,
  currencyName,
}: {
  feedAddress: string
  supportedChain: SupportedChain
  feedName: string
  list?: boolean
  currencyName: string
}) => {
  const [latestUpdateTimestamp, setLatestUpdateTimestamp] = useState<number | undefined>(undefined)
  const getLatestTimestamp = useCallback(async () => {
    const rpcProvider = getWeb3Provider(supportedChain)
    if (!rpcProvider) {
      console.error(`web3 provider not found for chain ${supportedChain}`)
      return
    }
    const dataFeed = new Contract(feedAddress, aggregatorV3InterfaceABI, rpcProvider)
    const roundData: ROUND_DATA_RESPONSE = await dataFeed.latestRoundData()
    if (!roundData.updatedAt) {
      return
    }
    const updatedTimestamp = roundData.updatedAt.toNumber()
    setLatestUpdateTimestamp(updatedTimestamp)
  }, [feedAddress])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const fetchData = async () => {
      await getLatestTimestamp()
      if (!latestUpdateTimestamp) {
        timeout = setInterval(getLatestTimestamp, 5000)
      }
    }
    fetchData()
    return () => {
      clearTimeout(timeout)
    }
  }, [getLatestTimestamp, latestUpdateTimestamp])

  return latestUpdateTimestamp ? (
    <div>
      <PauseNotice
        value={latestUpdateTimestamp}
        list={list}
        type="alert"
        feedName={feedName}
        feedAddress={feedAddress}
        heartbeat={86400}
        buffer={900}
        currencyName={currencyName}
      />
    </div>
  ) : null
}
