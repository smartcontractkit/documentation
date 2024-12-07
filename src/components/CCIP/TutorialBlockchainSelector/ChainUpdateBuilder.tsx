import { ReactCopyText } from "@components/ReactCopyText"
import { useState, useEffect } from "react"
import styles from "./ChainUpdateBuilder.module.css"
import { ethers } from "ethers"
import { useStore } from "@nanostores/react"
import { laneStore, updateStepProgress } from "@stores/lanes"

interface RateLimiterConfig {
  isEnabled: boolean
  capacity: string
  rate: string
}

interface ChainUpdateBuilderProps {
  chain: "source" | "destination"
  readOnly: {
    chainSelector: string
    poolAddress: string
    tokenAddress: string
  }
  defaultConfig: {
    outbound: RateLimiterConfig
    inbound: RateLimiterConfig
  }
  onCalculate: (chainUpdate: {
    remoteChainSelector: string
    poolAddress: string
    tokenAddress: string
    outbound: RateLimiterConfig
    inbound: RateLimiterConfig
  }) => string
}

const calculateChainUpdate = (
  chainSelector: string,
  poolAddresses: string[],
  tokenAddress: string,
  outbound: RateLimiterConfig,
  inbound: RateLimiterConfig
) => {
  return {
    remoteChainSelector: chainSelector,
    poolAddress: poolAddresses[0],
    tokenAddress,
    outbound,
    inbound,
  }
}

export const ChainUpdateBuilder = ({ chain, readOnly, defaultConfig, onCalculate }: ChainUpdateBuilderProps) => {
  const [outbound, setOutbound] = useState(defaultConfig.outbound)
  const [inbound, setInbound] = useState(defaultConfig.inbound)
  const [formattedUpdate, setFormattedUpdate] = useState<string>("")

  const canGenerateUpdate = () => {
    return (
      readOnly.chainSelector &&
      ethers.utils.isAddress(readOnly.poolAddress) &&
      ethers.utils.isAddress(readOnly.tokenAddress)
    )
  }

  const generateAndSetUpdate = () => {
    if (!canGenerateUpdate()) return

    const chainUpdate = calculateChainUpdate(
      readOnly.chainSelector,
      [readOnly.poolAddress],
      readOnly.tokenAddress,
      outbound,
      inbound
    )
    const formatted = onCalculate(chainUpdate)
    setFormattedUpdate(formatted)
    handleApplyConfig()
  }

  useEffect(() => {
    if (canGenerateUpdate()) {
      generateAndSetUpdate()
    }
  }, [outbound, inbound, readOnly])

  const handleApplyConfig = () => {
    if (chain === "source") {
      updateStepProgress("sourceConfig", "source-pool-config", true)
    } else {
      updateStepProgress("destConfig", "dest-pool-config", true)
    }
  }

  return (
    <div className={styles.builder}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Remote Configuration</div>
        <div className={styles.field}>
          <label>Remote Chain Selector:</label>
          <code>{readOnly.chainSelector}</code>
        </div>
        <div className={styles.field}>
          <label>Remote Pool Address:</label>
          <code>{readOnly.poolAddress}</code>
        </div>
        <div className={styles.field}>
          <label>Remote Token Address:</label>
          <code>{readOnly.tokenAddress}</code>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Rate Limits (Optional)</div>

        <div className={styles.rateLimiterConfig}>
          <h5>Outbound Configuration</h5>
          <label>
            <input
              type="checkbox"
              checked={outbound.isEnabled}
              onChange={(e) =>
                setOutbound({
                  isEnabled: e.target.checked,
                  capacity: e.target.checked ? outbound.capacity : "0",
                  rate: e.target.checked ? outbound.rate : "0",
                })
              }
            />
            Enable Rate Limit
          </label>
          {outbound.isEnabled && (
            <>
              <input
                type="number"
                value={outbound.capacity}
                onChange={(e) => setOutbound({ ...outbound, capacity: e.target.value })}
                placeholder="Capacity"
              />
              <input
                type="number"
                value={outbound.rate}
                onChange={(e) => setOutbound({ ...outbound, rate: e.target.value })}
                placeholder="Rate"
              />
            </>
          )}
        </div>

        <div className={styles.rateLimiterConfig}>
          <h5>Inbound Configuration</h5>
          <label>
            <input
              type="checkbox"
              checked={inbound.isEnabled}
              onChange={(e) =>
                setInbound({
                  isEnabled: e.target.checked,
                  capacity: e.target.checked ? inbound.capacity : "0",
                  rate: e.target.checked ? inbound.rate : "0",
                })
              }
            />
            Enable Rate Limit
          </label>
          {inbound.isEnabled && (
            <>
              <input
                type="number"
                value={inbound.capacity}
                onChange={(e) => setInbound({ ...inbound, capacity: e.target.value })}
                placeholder="Capacity"
              />
              <input
                type="number"
                value={inbound.rate}
                onChange={(e) => setInbound({ ...inbound, rate: e.target.value })}
                placeholder="Rate"
              />
            </>
          )}
        </div>
      </div>

      {formattedUpdate && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Configuration Data</div>
          <div className={styles.field}>
            <label>1. Copy these values to Remix:</label>
            <div className={styles.copyGroup}>
              <div>
                <small>remoteChainSelectorsToRemove:</small>
                <ReactCopyText text="[]" code={true} />
              </div>
              <div>
                <small>chainsToAdd:</small>
                <ReactCopyText text={JSON.parse(formattedUpdate).callData} code={true} />
              </div>
            </div>
          </div>

          <div className={styles.confirmSection}>
            <label>2. After applying in Remix:</label>
            <button className={styles.confirmButton} onClick={handleApplyConfig}>
              ✓ Mark Configuration as Complete
            </button>
          </div>
        </div>
      )}

      {!canGenerateUpdate() && (
        <div className={styles.notice}>
          Please ensure all remote addresses are available before generating the update
        </div>
      )}

      <ReactCopyText text={formattedUpdate} />
    </div>
  )
}
