import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { laneStore, type RateLimiterConfig, updateRateLimits } from "@stores/lanes"
import { useStore } from "@nanostores/react"
import styles from "./ChainUpdateBuilder.module.css"
import { ErrorBoundary } from "@components/ErrorBoundary"
import { Callout } from "../TutorialSetup/Callout"

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

const validateRateLimiterConfig = (config: RateLimiterConfig): string | null => {
  const rate = BigInt(config.rate || "0")
  const capacity = BigInt(config.capacity || "0")

  if (config.enabled) {
    // For enabled config: 0 < rate < capacity
    if (rate <= BigInt(0)) {
      return "Rate must be greater than 0 when enabled"
    }
    if (rate >= capacity) {
      return "Rate must be less than capacity for effective rate limiting"
    }
  } else {
    // For disabled config: rate = 0 and capacity = 0
    if (rate !== BigInt(0) || capacity !== BigInt(0)) {
      return "Rate and capacity must be 0 when disabled"
    }
  }
  return null
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

  const [validationErrors, setValidationErrors] = useState<{
    inbound: string | null
    outbound: string | null
  }>({ inbound: null, outbound: null })

  const canGenerateUpdate = () => {
    return (
      readOnly.chainSelector &&
      ethers.utils.isAddress(readOnly.poolAddress) &&
      ethers.utils.isAddress(readOnly.tokenAddress)
    )
  }

  const handleRateLimitChange = (type: "inbound" | "outbound", field: keyof RateLimiterConfig, value: string) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[RateLimitChange] ${chain}-${type}-${field}:`, {
        value,
        timestamp: new Date().toISOString(),
      })
    }

    // Validate input as BigInt
    try {
      // Remove any non-numeric characters
      const cleanValue = value.replace(/[^0-9]/g, "")
      // Always update the state, using "0" for empty values
      const stringValue = cleanValue ? BigInt(cleanValue).toString() : "0"

      // Check uint128 range only for non-empty values
      if (cleanValue) {
        const bigIntValue = BigInt(cleanValue)
        const MAX_UINT128 = BigInt(2) ** BigInt(128) - BigInt(1)

        // Ensure it's within uint128 range
        if (bigIntValue > MAX_UINT128) {
          console.warn("Value exceeds uint128 maximum")
          return
        }
      }

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
    } catch (e) {
      console.error("Invalid BigInt value:", e)
    }
  }

  const handleRateLimitToggle = (type: "inbound" | "outbound", enabled: boolean) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[RateLimitToggle] ${chain}-${type}:`, {
        enabled,
        timestamp: new Date().toISOString(),
      })
    }

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

  useEffect(() => {
    // Validate configurations whenever they change
    setValidationErrors({
      inbound: validateRateLimiterConfig(inbound),
      outbound: validateRateLimiterConfig(outbound),
    })
  }, [inbound, outbound])

  if (process.env.NODE_ENV === "development") {
    console.log(`[ConfigState] ${chain}-rate-limits:`, {
      outbound,
      inbound,
      readOnly,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <ErrorBoundary
      fallback={<div>Error configuring rate limits. Please refresh and try again.</div>}
      onError={(error) => {
        console.error("Rate limit configuration error:", error)
        reportError?.(error)
      }}
    >
      <div className={styles.builder}>
        <Callout type="note" title="About Rate Limits">
          <p>
            Rate limits control how many tokens can be transferred over a given blockchain lane within a specific time
            frame. When working with rate limits, consider the following:
          </p>
          <ul>
            <li>
              <strong>Maximum capacity:</strong> The total amount of tokens that can be transferred before the pool is
              fully consumed.
            </li>
            <li>
              <strong>Refill rate:</strong> How quickly this capacity is restored over time after transfers occur.
            </li>
            <li>
              <strong>Disabling rate limits:</strong> Setting both capacity and rate to 0 removes all limitations,
              allowing unlimited transfers.
            </li>
            <li>
              <strong>Token decimals:</strong> When defining these limits, remember to account for token decimals. For
              example, for a token with 18 decimals, to allow a maximum capacity of 1 whole token, set it to{" "}
              <code>1000000000000000000</code>.
            </li>
          </ul>
          <p>
            Learn more in the <a href="/ccip/architecture#ccip-rate-limits">CCIP rate limits documentation</a>.
          </p>
        </Callout>

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

            {/* MaxSupply Consideration Callout */}
            {(outbound.enabled || inbound.enabled) && (
              <div className={styles.maxSupplyInfo}>
                <Callout type="note" title="Rate Limit Capacity Consideration">
                  Ensure the capacity is not set higher than your token's maximum supply (configured during token
                  deployment). Setting a capacity larger than the maximum supply would create an ineffective rate limit.
                </Callout>
              </div>
            )}

            {/* Validation Warnings */}
            {(validationErrors.inbound || validationErrors.outbound) && (
              <div className={styles.validationWarnings}>
                {validationErrors.outbound && (
                  <Callout type="caution" title="Outbound Rate Limit Warning">
                    {validationErrors.outbound}
                  </Callout>
                )}
                {validationErrors.inbound && (
                  <Callout type="caution" title="Inbound Rate Limit Warning">
                    {validationErrors.inbound}
                  </Callout>
                )}
              </div>
            )}

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
                        <span className={styles.inputHint}>Maximum tokens allowed</span>
                      </div>
                      <input
                        type="text"
                        value={outbound.capacity}
                        onChange={(e) => handleRateLimitChange("outbound", "capacity", e.target.value)}
                        placeholder="Enter amount..."
                        pattern="[0-9]*"
                        className={`${styles.numericInput} ${validationErrors.outbound ? styles.inputError : ""}`}
                      />
                    </div>
                    <div className={styles.input}>
                      <div className={styles.inputLabel}>
                        <label>Rate</label>
                        <span className={styles.inputHint}>
                          Rate at which available capacity is replenished (tokens/second)
                        </span>
                      </div>
                      <input
                        type="text"
                        value={outbound.rate}
                        onChange={(e) => handleRateLimitChange("outbound", "rate", e.target.value)}
                        placeholder="Enter amount..."
                        pattern="[0-9]*"
                        className={`${styles.numericInput} ${validationErrors.outbound ? styles.inputError : ""}`}
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
                        <span className={styles.inputHint}>Maximum tokens allowed</span>
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
                        <span className={styles.inputHint}>
                          Rate at which available capacity is replenished (tokens/second)
                        </span>
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
              <div className={styles.noticeHeader}>
                <span className={styles.noticeIcon}>⚠️</span>
                <span className={styles.noticeTitle}>Action Required</span>
              </div>
              <div className={styles.noticeContent}>
                {!ethers.utils.isAddress(readOnly.tokenAddress) && (
                  <div className={styles.noticeItem}>
                    <span className={styles.noticeItemIcon}>→</span>
                    <span>Please deploy your token first to proceed with configuration</span>
                  </div>
                )}
                {!ethers.utils.isAddress(readOnly.poolAddress) && (
                  <div className={styles.noticeItem}>
                    <span className={styles.noticeItemIcon}>→</span>
                    <span>Token pool address is required</span>
                  </div>
                )}
                {!readOnly.chainSelector && (
                  <div className={styles.noticeItem}>
                    <span className={styles.noticeItemIcon}>→</span>
                    <span>Chain selector is required</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
