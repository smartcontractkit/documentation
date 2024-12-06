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
    isEnabled: boolean
    capacity: bigint
    rate: bigint
  }
  inboundRateLimiterConfig: {
    isEnabled: boolean
    capacity: bigint
    rate: bigint
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
    // Ensure all required fields are present and properly formatted
    if (!chainUpdate.remoteChainSelector || !chainUpdate.remotePoolAddresses || !chainUpdate.remoteTokenAddress) {
      return ""
    }

    // Format tuple array for Remix IDE: (uint64,bytes[],bytes,(bool,uint128,uint128),(bool,uint128,uint128))[]
    return JSON.stringify(
      [
        [
          chainUpdate.remoteChainSelector.toString(), // uint64 remoteChainSelector
          chainUpdate.remotePoolAddresses, // bytes[] remotePoolAddresses
          chainUpdate.remoteTokenAddress, // bytes remoteTokenAddress
          [
            // outboundRateLimiterConfig tuple
            chainUpdate.outboundRateLimiterConfig.isEnabled,
            chainUpdate.outboundRateLimiterConfig.capacity.toString(),
            chainUpdate.outboundRateLimiterConfig.rate.toString(),
          ],
          [
            // inboundRateLimiterConfig tuple
            chainUpdate.inboundRateLimiterConfig.isEnabled,
            chainUpdate.inboundRateLimiterConfig.capacity.toString(),
            chainUpdate.inboundRateLimiterConfig.rate.toString(),
          ],
        ],
      ],
      null,
      2
    )
  }

  return (
    <ChainUpdateBuilder
      readOnly={{
        chainSelector: network.chainSelector,
        poolAddress: remoteContracts.tokenPool || "",
        tokenAddress: remoteContracts.token || "",
      }}
      defaultConfig={{
        outbound: { isEnabled: false, capacity: "0", rate: "0" },
        inbound: { isEnabled: false, capacity: "0", rate: "0" },
      }}
      onCalculate={(chainUpdate) => {
        const formattedUpdate = {
          remoteChainSelector: BigInt(chainUpdate.remoteChainSelector),
          remotePoolAddresses: [chainUpdate.poolAddress].map((addr) =>
            ethers.utils.defaultAbiCoder.encode(["address"], [addr])
          ),
          remoteTokenAddress: ethers.utils.defaultAbiCoder.encode(["address"], [chainUpdate.tokenAddress]),
          outboundRateLimiterConfig: {
            isEnabled: chainUpdate.outbound.isEnabled,
            capacity: BigInt(chainUpdate.outbound.capacity || "0"),
            rate: BigInt(chainUpdate.outbound.rate || "0"),
          },
          inboundRateLimiterConfig: {
            isEnabled: chainUpdate.inbound.isEnabled,
            capacity: BigInt(chainUpdate.inbound.capacity || "0"),
            rate: BigInt(chainUpdate.inbound.rate || "0"),
          },
        }

        // Generate both the JSON and the encoded call data
        const callData = generateCallData(formattedUpdate)
        const serializableUpdate = {
          ...formattedUpdate,
          remoteChainSelector: formattedUpdate.remoteChainSelector.toString(),
          outboundRateLimiterConfig: {
            ...formattedUpdate.outboundRateLimiterConfig,
            capacity: formattedUpdate.outboundRateLimiterConfig.capacity.toString(),
            rate: formattedUpdate.outboundRateLimiterConfig.rate.toString(),
          },
          inboundRateLimiterConfig: {
            ...formattedUpdate.inboundRateLimiterConfig,
            capacity: formattedUpdate.inboundRateLimiterConfig.capacity.toString(),
            rate: formattedUpdate.inboundRateLimiterConfig.rate.toString(),
          },
        }
        return JSON.stringify(
          {
            json: [serializableUpdate],
            callData,
          },
          null,
          2
        )
      }}
    />
  )
}
