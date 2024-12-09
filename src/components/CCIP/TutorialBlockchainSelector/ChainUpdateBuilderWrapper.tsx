import { useStore } from "@nanostores/react"
import { laneStore, TUTORIAL_STEPS } from "@stores/lanes"
import { ChainUpdateBuilder } from "./ChainUpdateBuilder"
import { ethers } from "ethers"
import styles from "./ChainUpdateBuilderWrapper.module.css"
import { ReactCopyText } from "@components/ReactCopyText"
import { useState, useEffect } from "react"
import type { Network } from "@config/data/ccip/types"
import { TutorialCard, SolidityParam, NetworkCheck, TutorialStep } from "../TutorialSetup"
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

  // Check if all required data is available
  const isDataReady =
    isValidNetwork(currentNetwork) && isValidNetwork(remoteNetwork) && poolAddress && remoteTokenAddress

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

  const stepId = `${chain}Config` as const
  const subStepId = chain === "source" ? "source-pool-config" : "dest-pool-config"

  return (
    <TutorialCard
      title={TUTORIAL_STEPS[stepId].subSteps[subStepId]}
      description="Set up cross-chain communication parameters"
    >
      <NetworkCheck network={networkInfo} />
      <ol className={styles.steps}>
        <TutorialStep
          title={TUTORIAL_STEPS[stepId].subSteps[subStepId]}
          checkbox={<StepCheckbox stepId={stepId} subStepId={subStepId} />}
        >
          {!isValidNetwork(currentNetwork) && (
            <div className={styles.stepRequirement}>⚠️ Please select valid blockchains first</div>
          )}
          {!poolAddress && (
            <div className={styles.stepRequirement}>⚠️ Please deploy your token pool before proceeding</div>
          )}

          {isDataReady ? (
            <ol className={styles.instructions}>
              <li>
                In the "Deploy & Run Transactions" tab, select your token pool at:
                <div className={styles.contractInfo}>
                  <strong>Contract:</strong> TokenPool
                  <ReactCopyText text={poolAddress} code />
                </div>
              </li>

              <li>Click on the contract to open its details</li>

              <li>
                Call <code>applyChainUpdates</code>:
                <div className={styles.functionCall}>
                  <div className={styles.functionHeader}>
                    <div className={styles.functionTitle}>
                      <code className={styles.functionName}>applyChainUpdates</code>
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
                        description="Configure permissions and rate limits for remote chains. Use the configuration tool below to generate this value."
                      />
                    </div>
                  </div>
                </div>
              </li>

              <li>
                Configure the rate limits below:
                <div className={styles.configurationTool}>
                  <ChainUpdateBuilder
                    chain={chain}
                    readOnly={{
                      chainSelector: remoteNetwork.chainSelector,
                      poolAddress,
                      tokenAddress: remoteTokenAddress,
                    }}
                    defaultConfig={{
                      outbound: { enabled: false, capacity: "0", rate: "0" },
                      inbound: { enabled: false, capacity: "0", rate: "0" },
                    }}
                    onCalculate={handleCalculate}
                  />
                </div>
              </li>

              {formattedUpdate && (
                <li>
                  Copy the generated value and paste it into the <code>chainsToAdd</code> parameter in Remix:
                  <div className={styles.copyBlock}>
                    <div className={styles.copyContainer}>
                      <ReactCopyText text={callData} code />
                    </div>
                  </div>
                </li>
              )}

              <li>Confirm the transaction in MetaMask</li>
            </ol>
          ) : null}
        </TutorialStep>
      </ol>
    </TutorialCard>
  )
}
