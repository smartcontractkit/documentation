import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { laneStore, type RateLimiterConfig, updateRateLimits } from "@stores/lanes"
import { useStore } from "@nanostores/react"
import styles from "./ChainUpdateBuilder.module.css"
import { ErrorBoundary } from "@components/ErrorBoundary"

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
  const state = useStore(laneStore)

  const [outbound, setOutbound] = useState<RateLimiterConfig>(() => {
    const rateLimits = chain === "source" ? state.sourceRateLimits : state.destinationRateLimits
    return rateLimits?.outbound ?? defaultConfig.outbound
  })

  const [inbound, setInbound] = useState<RateLimiterConfig>(() => {
    const rateLimits = chain === "source" ? state.sourceRateLimits : state.destinationRateLimits
    return rateLimits?.inbound ?? defaultConfig.inbound
  })

  const canGenerateUpdate = () => {
    return (
      readOnly.chainSelector &&
      ethers.utils.isAddress(readOnly.poolAddress) &&
      ethers.utils.isAddress(readOnly.tokenAddress)
    )
  }

  const handleRateLimitChange = (type: "inbound" | "outbound", field: keyof RateLimiterConfig, value: string) => {
    // Validate input as BigInt
    try {
      // Remove any non-numeric characters
      const cleanValue = value.replace(/[^0-9]/g, "")
      if (cleanValue) {
        const bigIntValue = BigInt(cleanValue)
        const MAX_UINT128 = BigInt(2) ** BigInt(128) - BigInt(1)

        // Ensure it's within uint128 range
        if (bigIntValue > MAX_UINT128) {
          console.warn("Value exceeds uint128 maximum")
          return
        }

        // Update with validated value
        const stringValue = bigIntValue.toString()

        // Update local state first
        if (type === "inbound") {
          setInbound((prev) => ({ ...prev, [field]: stringValue, enabled: true }))
        } else {
          setOutbound((prev) => ({ ...prev, [field]: stringValue, enabled: true }))
        }

        // Then update store
        updateRateLimits(chain, type, {
          [field]: stringValue,
          enabled: true,
        })

        // Force update of formatted data
        if (canGenerateUpdate()) {
          const chainUpdate = calculateChainUpdate(
            readOnly.chainSelector,
            [readOnly.poolAddress],
            readOnly.tokenAddress,
            outbound,
            inbound
          )
          onCalculate(chainUpdate)
        }
      }
    } catch (e) {
      console.error("Invalid BigInt value:", e)
    }
  }

  const handleRateLimitToggle = (type: "inbound" | "outbound", enabled: boolean) => {
    const current = laneStore.get()
    const rateLimitsKey = chain === "source" ? "sourceRateLimits" : "destinationRateLimits"

    const currentLimits = {
      inbound: { enabled: false, capacity: "0", rate: "0" },
      outbound: { enabled: false, capacity: "0", rate: "0" },
      ...current[rateLimitsKey],
    }

    laneStore.set({
      ...current,
      [rateLimitsKey]: {
        ...currentLimits,
        [type]: {
          ...currentLimits[type],
          enabled,
          capacity: enabled ? currentLimits[type].capacity : "0",
          rate: enabled ? currentLimits[type].rate : "0",
        },
      },
    })

    if (type === "inbound") {
      setInbound((prev) => ({
        ...prev,
        enabled,
        capacity: enabled ? prev.capacity : "0",
        rate: enabled ? prev.rate : "0",
      }))
    } else {
      setOutbound((prev) => ({
        ...prev,
        enabled,
        capacity: enabled ? prev.capacity : "0",
        rate: enabled ? prev.rate : "0",
      }))
    }
  }

  useEffect(() => {
    if (canGenerateUpdate()) {
      const chainUpdate = calculateChainUpdate(
        readOnly.chainSelector,
        [readOnly.poolAddress],
        readOnly.tokenAddress,
        outbound,
        inbound
      )
      onCalculate(chainUpdate)
    }
  }, [outbound, inbound, readOnly.chainSelector, readOnly.poolAddress, readOnly.tokenAddress])

  return (
    <ErrorBoundary
      fallback={<div>Error configuring rate limits. Please refresh and try again.</div>}
      onError={(error) => {
        console.error("Rate limit configuration error:", error)
        reportError?.(error) // Assuming you have an error reporting service
      }}
    >
      <div className={styles.builder}>
        <div className={styles.configSection}>
          {/* Remote Configuration Section */}
          <div className={styles.remoteConfig}>
            <span className={styles.sectionLabel}>Remote Configuration</span>
            <div className={styles.field}>
              <label>Chain Selector:</label>
              <code>{readOnly.chainSelector}</code>
            </div>
            <div className={styles.field}>
              <label>Pool Address:</label>
              <code>{readOnly.poolAddress}</code>
            </div>
            <div className={styles.field}>
              <label>Token Address:</label>
              <code>{readOnly.tokenAddress}</code>
            </div>
          </div>

          {/* Rate Limits Section */}
          <div className={styles.rateLimits}>
            <span className={styles.sectionLabel}>Rate Limit Configuration</span>

            <div className={styles.rateLimiterGroup}>
              {/* Outbound Configuration */}
              <div className={styles.rateLimiter}>
                <div className={styles.rateLimiterHeader}>
                  <span>Outbound Transfers</span>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={outbound.enabled}
                      onChange={(e) => handleRateLimitToggle("outbound", e.target.checked)}
                    />
                    <span>Enable Limits</span>
                  </label>
                </div>

                {outbound.enabled && (
                  <div className={styles.rateLimiterInputs}>
                    <div className={styles.input}>
                      <div className={styles.inputLabel}>
                        <label>Capacity</label>
                        <span className={styles.inputHint}>Maximum tokens allowed per period</span>
                      </div>
                      <input
                        type="text"
                        value={outbound.capacity}
                        onChange={(e) => handleRateLimitChange("outbound", "capacity", e.target.value)}
                        placeholder="Enter amount..."
                        pattern="[0-9]*"
                        className={styles.numericInput}
                      />
                    </div>
                    <div className={styles.input}>
                      <div className={styles.inputLabel}>
                        <label>Rate</label>
                        <span className={styles.inputHint}>Tokens allowed per second</span>
                      </div>
                      <input
                        type="text"
                        value={outbound.rate}
                        onChange={(e) => handleRateLimitChange("outbound", "rate", e.target.value)}
                        placeholder="Enter amount..."
                        pattern="[0-9]*"
                        className={styles.numericInput}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Inbound Configuration */}
              <div className={styles.rateLimiter}>
                <div className={styles.rateLimiterHeader}>
                  <span className={styles.sectionLabel}>Inbound Transfers</span>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={inbound.enabled}
                      onChange={(e) => handleRateLimitToggle("inbound", e.target.checked)}
                    />
                    <span>Enable Limits</span>
                  </label>
                </div>

                {inbound.enabled && (
                  <div className={styles.rateLimiterInputs}>
                    <div className={styles.input}>
                      <div className={styles.inputLabel}>
                        <label>Capacity</label>
                        <span className={styles.inputHint}>Maximum tokens allowed per period</span>
                      </div>
                      <input
                        type="text"
                        value={inbound.capacity}
                        onChange={(e) => handleRateLimitChange("inbound", "capacity", e.target.value)}
                        placeholder="Enter amount..."
                        pattern="[0-9]*"
                        className={styles.numericInput}
                      />
                    </div>
                    <div className={styles.input}>
                      <div className={styles.inputLabel}>
                        <label>Rate</label>
                        <span className={styles.inputHint}>Tokens allowed per second</span>
                      </div>
                      <input
                        type="text"
                        value={inbound.rate}
                        onChange={(e) => handleRateLimitChange("inbound", "rate", e.target.value)}
                        placeholder="Enter amount..."
                        pattern="[0-9]*"
                        className={styles.numericInput}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!canGenerateUpdate() && (
            <div className={styles.notice}>
              Please ensure all remote addresses are available before generating the update
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
