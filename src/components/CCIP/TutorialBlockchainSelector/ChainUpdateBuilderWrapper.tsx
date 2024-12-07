import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { getAllNetworks } from "@config/data/ccip"
import { ChainUpdateBuilder } from "./ChainUpdateBuilder"
import { ethers } from "ethers"

interface ChainUpdateBuilderWrapperProps {
  chain: "source" | "destination"
}

interface ChainUpdate {
  remoteChainSelector: bigint
  remotePoolAddresses: string[]
  remoteTokenAddress: string
  outboundRateLimiterConfig: {
    enabled: boolean
    capacity: string
    rate: string
  }
  inboundRateLimiterConfig: {
    enabled: boolean
    capacity: string
    rate: string
  }
}

export const ChainUpdateBuilderWrapper = ({ chain }: ChainUpdateBuilderWrapperProps) => {
  const state = useStore(laneStore)
  const chainId = chain === "source" ? state.sourceChain : state.destinationChain
  const remoteChainId = chain === "source" ? state.destinationChain : state.sourceChain

  const networks = getAllNetworks({ filter: state.environment })
  const network = networks.find((n) => n.chain === remoteChainId)

  const remoteContracts = chain === "source" ? state.destinationContracts : state.sourceContracts

  if (!network || !chainId) return <div></div>

  const generateCallData = (chainUpdate: ChainUpdate) => {
    if (!chainUpdate.remoteChainSelector || !chainUpdate.remotePoolAddresses || !chainUpdate.remoteTokenAddress) {
      return ""
    }

    return JSON.stringify(
      [
        [
          chainUpdate.remoteChainSelector.toString(),
          chainUpdate.remotePoolAddresses,
          chainUpdate.remoteTokenAddress,
          [
            chainUpdate.outboundRateLimiterConfig.enabled,
            BigInt(chainUpdate.outboundRateLimiterConfig.capacity).toString(),
            BigInt(chainUpdate.outboundRateLimiterConfig.rate).toString(),
          ],
          [
            chainUpdate.inboundRateLimiterConfig.enabled,
            BigInt(chainUpdate.inboundRateLimiterConfig.capacity).toString(),
            BigInt(chainUpdate.inboundRateLimiterConfig.rate).toString(),
          ],
        ],
      ],
      null,
      2
    )
  }

  return (
    <ChainUpdateBuilder
      chain={chain}
      readOnly={{
        chainSelector: network.chainSelector,
        poolAddress: remoteContracts.tokenPool || "",
        tokenAddress: remoteContracts.token || "",
      }}
      defaultConfig={{
        outbound: { enabled: false, capacity: "0", rate: "0" },
        inbound: { enabled: false, capacity: "0", rate: "0" },
      }}
      onCalculate={(chainUpdate) => {
        const formattedUpdate = {
          remoteChainSelector: chainUpdate.remoteChainSelector,
          remotePoolAddresses: [chainUpdate.poolAddress].map((addr) =>
            ethers.utils.defaultAbiCoder.encode(["address"], [addr])
          ),
          remoteTokenAddress: ethers.utils.defaultAbiCoder.encode(["address"], [chainUpdate.tokenAddress]),
          outboundRateLimiterConfig: {
            enabled: chainUpdate.outbound.enabled,
            capacity: chainUpdate.outbound.capacity,
            rate: chainUpdate.outbound.rate,
          },
          inboundRateLimiterConfig: {
            enabled: chainUpdate.inbound.enabled,
            capacity: chainUpdate.inbound.capacity,
            rate: chainUpdate.inbound.rate,
          },
        }

        const callData = generateCallData({
          ...formattedUpdate,
          remoteChainSelector: BigInt(chainUpdate.remoteChainSelector),
        })

        return JSON.stringify(
          {
            json: [formattedUpdate],
            callData,
          },
          null,
          2
        )
      }}
    />
  )
}
