import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { ChainUpdateBuilder } from "./ChainUpdateBuilder"
import { ethers } from "ethers"
import styles from "./ChainUpdateBuilderWrapper.module.css"
import { ReactCopyText } from "@components/ReactCopyText"
import { useState, useEffect } from "react"
import type { Network } from "@config/data/ccip/types"
import { TutorialCard, SolidityParam, NetworkCheck } from "../TutorialSetup"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"

interface ChainUpdateBuilderWrapperProps {
  chain: "source" | "destination"
}

interface RateLimiterConfig {
  enabled: boolean
  capacity: string
  rate: string
}

interface ChainUpdate {
  remoteChainSelector: bigint
  remotePoolAddresses: string[]
  remoteTokenAddress: string
  outboundRateLimiterConfig: RateLimiterConfig
  inboundRateLimiterConfig: RateLimiterConfig
}

interface ChainUpdateInput {
  remoteChainSelector: string
  poolAddress: string
  tokenAddress: string
  outbound: RateLimiterConfig
  inbound: RateLimiterConfig
}

const isValidNetwork = (network: Network | null): network is Network => {
  return !!network && typeof network.chainSelector === "string" && typeof network.name === "string"
}

export const ChainUpdateBuilderWrapper = ({ chain }: ChainUpdateBuilderWrapperProps) => {
  const state = useStore(laneStore)
  const [formattedUpdate, setFormattedUpdate] = useState<string>("")
  const [callData, setCallData] = useState<string>("")
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  const currentNetwork = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const remoteNetwork = chain === "source" ? state.destinationNetwork : state.sourceNetwork
  const poolAddress = chain === "source" ? state.sourceContracts.tokenPool : state.destinationContracts.tokenPool
  const remoteTokenAddress = chain === "source" ? state.destinationContracts.token : state.sourceContracts.token
  const networkInfo = currentNetwork ? { name: currentNetwork.name, logo: currentNetwork.logo } : { name: "loading..." }

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

  const handleCalculate = (input: ChainUpdateInput) => {
    const update = {
      remoteChainSelector: input.remoteChainSelector,
      remotePoolAddresses: [input.poolAddress].map((addr) => ethers.utils.defaultAbiCoder.encode(["address"], [addr])),
      remoteTokenAddress: ethers.utils.defaultAbiCoder.encode(["address"], [input.tokenAddress]),
      outboundRateLimiterConfig: {
        enabled: input.outbound.enabled,
        capacity: input.outbound.capacity,
        rate: input.outbound.rate,
      },
      inboundRateLimiterConfig: {
        enabled: input.inbound.enabled,
        capacity: input.inbound.capacity,
        rate: input.inbound.rate,
      },
    }

    const generatedCallData = generateCallData({
      ...update,
      remoteChainSelector: BigInt(input.remoteChainSelector),
    })

    const formatted = JSON.stringify(
      {
        json: [update],
        callData: generatedCallData,
      },
      null,
      2
    )

    setCallData(generatedCallData)
    setFormattedUpdate(formatted)
    return formatted
  }

  useEffect(() => {
    if (showCopyFeedback) {
      const timer = setTimeout(() => setShowCopyFeedback(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showCopyFeedback])

  if (!isValidNetwork(currentNetwork) || !isValidNetwork(remoteNetwork)) {
    return (
      <div className={styles.verificationCard}>
        <div className={styles.loadingState}>
          <span>Select Blockchains</span>
          <p>Please select valid source and destination blockchains.</p>
        </div>
      </div>
    )
  }

  if (!poolAddress) {
    return (
      <div className={styles.verificationCard}>
        <div className={styles.loadingState}>
          <span>Deploy Pool First</span>
          <p>Please deploy your token pool contract before configuring.</p>
        </div>
      </div>
    )
  }

  return (
    <TutorialCard title="Configure Remote Pool" description="Set up cross-chain communication parameters">
      <NetworkCheck network={networkInfo} />
      <div className={styles.verificationCard}>
        <div className={styles.chainInfo}>
          <div className={styles.chainDetails}>
            <span>Current Blockchain</span>
            <div className={styles.chainValue}>
              <code>{currentNetwork.name}</code>
              <div className={styles.chainSelector}>
                <span>Selector:</span>
                <ReactCopyText text={currentNetwork.chainSelector} code />
              </div>
            </div>
          </div>
          <div className={styles.chainDetails}>
            <span>Remote Blockchain</span>
            <div className={styles.chainValue}>
              <code>{remoteNetwork.name}</code>
              <div className={styles.chainSelector}>
                <span>Selector:</span>
                <ReactCopyText text={remoteNetwork.chainSelector} code />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.poolAddress}>
          <span>Pool Address</span>
          <ReactCopyText text={poolAddress} code />
        </div>

        <div className={styles.functionCall}>
          <div className={styles.functionHeader}>
            <div className={styles.functionTitle}>
              <code className={styles.functionName}>applyChainUpdates</code>
              <StepCheckbox stepId={`${chain}Config`} subStepId={`${chain}-pool-config`} />
            </div>
            <div className={styles.functionPurpose}>
              Sets the permissions for cross-chain communication and configures rate limits
            </div>
          </div>

          <div className={styles.functionRequirement}>⚠️ Only callable by the token pool owner</div>

          <div className={styles.parametersSection}>
            <div className={styles.parametersTitle}>Parameters:</div>
            <div className={styles.parametersList}>
              <SolidityParam
                name="remoteChainSelectorsToRemove"
                type="uint64[]"
                description="Chain selectors to remove from the allowed list"
                example={<ReactCopyText text="[]" code />}
              />

              <SolidityParam
                name="chainsToAdd"
                type="ChainUpdate[]"
                description="Configure permissions and rate limits for remote chains. The value for this parameter will be generated using the configuration tool below."
              />
            </div>
          </div>
        </div>

        <div className={styles.configurationTool}>
          <div className={styles.configSteps}>
            <h3 className={styles.configTitle}>Rate Limit Configuration</h3>
            <p className={styles.configDescription}>
              Configure the rate limits below. The generated value will be used for the chainsToAdd parameter.
            </p>
          </div>

          <ChainUpdateBuilder
            chain={chain}
            readOnly={{
              chainSelector: remoteNetwork.chainSelector,
              poolAddress,
              tokenAddress: remoteTokenAddress || "",
            }}
            defaultConfig={{
              outbound: { enabled: false, capacity: "0", rate: "0" },
              inbound: { enabled: false, capacity: "0", rate: "0" },
            }}
            onCalculate={handleCalculate}
          />

          {formattedUpdate && (
            <div className={styles.resultSection}>
              <div className={styles.copyBlock}>
                <div className={styles.copyInstructions}>Copy generated value to Remix:</div>
                <div className={styles.copyContainer}>
                  <ReactCopyText text={callData} code />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TutorialCard>
  )
}
