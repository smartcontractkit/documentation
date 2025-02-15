/** @jsxImportSource preact */
import { useCallback, useEffect, useState } from "preact/hooks"
import { aggregatorV3InterfaceABI } from "@abi"
import { Contract, BigNumberish } from "ethers"
import { ROUND_DATA_RESPONSE } from "@features/feeds/types/index.ts"
import { PauseNotice } from "./PauseNotice.tsx"
import { SupportedChain } from "@config/index.ts"
import { getWeb3Provider } from "~/features/utils/index.ts"

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
  const [latestUpdateTimestamp, setLatestUpdateTimestamp] = useState<BigNumberish | undefined>(undefined)
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
    const updatedTimestamp = roundData.updatedAt
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
        value={Number(latestUpdateTimestamp)}
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
