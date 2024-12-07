import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { ChainUpdateBuilder } from "./ChainUpdateBuilder"
import { ethers } from "ethers"
import styles from "./ChainUpdateBuilderWrapper.module.css"
import { ReactCopyText } from "@components/ReactCopyText"
import { useState, useEffect } from "react"
import type { Network } from "@config/data/ccip/types"

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

      <div className={styles.functionBlock}>
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <span className={styles.stepTitle}>
              <code>applyChainUpdates</code>
            </span>
          </div>

          <div className={styles.stepDescription}>
            <p>Sets permissions and rate limits for cross-chain communication.</p>
            <p className={styles.parameterNote}>This function requires two parameters:</p>
          </div>

          <div className={styles.parameterList}>
            <div className={styles.parameter}>
              <div className={styles.parameterHeader}>
                <div className={styles.parameterName}>
                  <span className={styles.parameterLabel}>Parameter 1</span>
                  <div className={styles.parameterIdentifier}>
                    <span>remoteChainSelectorsToRemove</span>
                    <code>uint64[]</code>
                  </div>
                </div>
              </div>
              <div className={styles.parameterValue}>
                <div className={styles.copyBlock}>
                  <div className={styles.copyInstructions}>Copy this value to Remix:</div>
                  <div className={`${styles.copyWrapper} ${showCopyFeedback ? styles.copied : ""}`}>
                    <ReactCopyText text="[]" code />
                    <span className={styles.copyFeedback}>Copied!</span>
                  </div>
                </div>
              </div>
              <div className={styles.parameterDetails}>Empty array is used when adding new chain configuration.</div>
            </div>

            <div className={styles.parameter}>
              <div className={styles.parameterHeader}>
                <div className={styles.parameterName}>
                  <span className={styles.parameterLabel}>Parameter 2</span>
                  <div className={styles.parameterIdentifier}>
                    <span>chainsToAdd</span>
                    <code>ChainUpdate[]</code>
                  </div>
                </div>
              </div>
              <div className={styles.parameterValue}>
                <div className={styles.parameterDetails}>
                  Configure the rate limits below to generate this parameter's value:
                </div>
                <div className={styles.rateConfigSection}>
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
                    onCalculate={(chainUpdate) => {
                      const update = {
                        remoteChainSelector: chainUpdate.remoteChainSelector,
                        remotePoolAddresses: [chainUpdate.poolAddress].map((addr) =>
                          ethers.utils.defaultAbiCoder.encode(["address"], [addr])
                        ),
                        remoteTokenAddress: ethers.utils.defaultAbiCoder.encode(
                          ["address"],
                          [chainUpdate.tokenAddress]
                        ),
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

                      const generatedCallData = generateCallData({
                        ...update,
                        remoteChainSelector: BigInt(chainUpdate.remoteChainSelector),
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
                    }}
                  />
                </div>
                {formattedUpdate && (
                  <div className={styles.copyBlock}>
                    <div className={styles.copyInstructions}>Copy generated value to Remix:</div>
                    <ReactCopyText text={callData} code />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
