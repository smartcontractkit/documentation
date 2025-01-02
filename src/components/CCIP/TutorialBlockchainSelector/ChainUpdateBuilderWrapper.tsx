import { useStore } from "@nanostores/react"
import { laneStore, TUTORIAL_STEPS } from "@stores/lanes"
import { ChainUpdateBuilder } from "./ChainUpdateBuilder"
import { ethers } from "ethers"
import styles from "./ChainUpdateBuilderWrapper.module.css"
import { ReactCopyText } from "@components/ReactCopyText"
import { useState } from "react"
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

export const ChainUpdateBuilderWrapper = ({ chain }: ChainUpdateBuilderWrapperProps) => {
  const state = useStore(laneStore)
  const [formattedUpdate, setFormattedUpdate] = useState<string>("")
  const [callData, setCallData] = useState<string>("")

  // Get current network info
  const currentNetwork = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const networkInfo = currentNetwork ? { name: currentNetwork.name, logo: currentNetwork.logo } : { name: "loading..." }

  // Get remote network info
  const remoteNetwork = chain === "source" ? state.destinationNetwork : state.sourceNetwork
  const remoteContracts = chain === "source" ? state.destinationContracts : state.sourceContracts

  // Get contract addresses and pool type
  const poolAddress = chain === "source" ? state.sourceContracts.tokenPool : state.destinationContracts.tokenPool
  const poolType = chain === "source" ? state.sourceContracts.poolType : state.destinationContracts.poolType

  const isDataReady = isValidNetwork(currentNetwork) && isValidNetwork(remoteNetwork) && Boolean(poolAddress)

  const canGenerateUpdate = () => {
    return (
      isDataReady &&
      remoteNetwork?.chainSelector &&
      remoteContracts.tokenPool &&
      ethers.utils.isAddress(remoteContracts.tokenPool) &&
      remoteContracts.token &&
      ethers.utils.isAddress(remoteContracts.token)
    )
  }

  const handleCalculate = (input: ChainUpdateInput): string => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[UpdateCalculation] ${chain}-update-builder:`, {
        input,
        timestamp: new Date().toISOString(),
      })
    }

    try {
      // Validate addresses
      if (!ethers.utils.isAddress(input.poolAddress) || !ethers.utils.isAddress(input.tokenAddress)) {
        if (process.env.NODE_ENV === "development") {
          console.log(`[UpdateSkipped] ${chain}-update-builder: Invalid addresses`, {
            validPoolAddress: ethers.utils.isAddress(input.poolAddress),
            validTokenAddress: ethers.utils.isAddress(input.tokenAddress),
            timestamp: new Date().toISOString(),
          })
        }
        return ""
      }

      const formattedUpdate = {
        remoteChainSelector: input.remoteChainSelector,
        remotePoolAddresses: [input.poolAddress].map((addr) =>
          ethers.utils.defaultAbiCoder.encode(["address"], [addr])
        ),
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
        ...formattedUpdate,
        remoteChainSelector: BigInt(input.remoteChainSelector),
      })

      const formatted = JSON.stringify(
        {
          json: [formattedUpdate],
          callData: generatedCallData,
        },
        null,
        2
      )

      setFormattedUpdate(formatted)
      setCallData(generatedCallData)

      if (process.env.NODE_ENV === "development") {
        console.log(`[UpdateSuccess] ${chain}-update-builder:`, {
          formatted,
          callData: generatedCallData,
          timestamp: new Date().toISOString(),
        })
      }

      return formatted
    } catch (error) {
      console.error("Error formatting chain update:", error)
      setFormattedUpdate("")
      setCallData("")
      return ""
    }
  }

  const stepId = chain === "source" ? "sourceConfig" : "destinationConfig"
  const subStepId = chain === "source" ? "source-pool-config" : "dest-pool-config"
  const navigationId = `${stepId}-${subStepId}`

  return (
    <TutorialCard
      title={TUTORIAL_STEPS[stepId].subSteps[subStepId]}
      description="Set up cross-chain communication parameters"
    >
      <NetworkCheck network={networkInfo} />
      <ol className={styles.steps}>
        <TutorialStep
          id={navigationId}
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
              <li>Open the "Deploy & Run Transactions" tab in Remix</li>
              <li>
                Select your token pool contract:
                <div className={styles.contractInfo}>
                  <strong>{poolType === "burn" ? "BurnMintTokenPool" : "LockReleaseTokenPool"}</strong>
                  <ReactCopyText text={poolAddress || ""} code />
                </div>
              </li>
              <li>Click the contract to view its functions</li>

              <li>
                Call <code>applyChainUpdates</code>:
                <div className={styles.functionCall}>
                  <div className={styles.functionHeader}>
                    <code className={styles.functionName}>applyChainUpdates</code>
                    <div className={styles.functionPurpose}>Configure cross-chain token and pool mapping</div>
                  </div>

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

              {canGenerateUpdate() && (
                <>
                  <li>
                    Configure the rate limits below:
                    <div className={styles.configurationTool}>
                      <ChainUpdateBuilder
                        chain={chain}
                        readOnly={{
                          chainSelector: remoteNetwork?.chainSelector || "",
                          poolAddress: remoteContracts.tokenPool || "",
                          tokenAddress: remoteContracts.token || "",
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
                </>
              )}
            </ol>
          ) : (
            <div className={styles.prerequisites}>
              <div className={styles.prerequisitesIcon}>⚡️</div>
              <div className={styles.prerequisitesContent}>
                <h4>Current Chain Prerequisites</h4>
                <ul>
                  {!isValidNetwork(currentNetwork) && <li>Select valid blockchains for the transfer</li>}
                  {!poolAddress && <li>Deploy your token pool on the current chain</li>}
                </ul>
              </div>
            </div>
          )}
        </TutorialStep>
      </ol>
    </TutorialCard>
  )
}
