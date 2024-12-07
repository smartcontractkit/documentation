import { useStore } from "@nanostores/react"
import { laneStore, type RateLimits } from "@stores/lanes"
import { utils } from "ethers"
import { ReactCopyText } from "@components/ReactCopyText"
import type { Network } from "@config/data/ccip"
import styles from "./PoolConfigVerification.module.css"

type ChainType = "source" | "destination"

interface VerificationStep {
  functionName: string
  description: string
  params: Array<{
    name: string
    type: string
    description: string
    value?: string
  }>
  returns: {
    type: string
    description: string
  }
  expectedResult: string | string[] | React.ReactNode
}

const formatRateLimiterState = (limits: RateLimits | null, type: "inbound" | "outbound") => {
  const config = limits?.[type]

  return (
    <div className={styles.tokenBucket}>
      <div className={styles.tokenBucketItem}>
        <span>Tokens</span>
        <code>0</code>
      </div>
      <div className={styles.tokenBucketItem}>
        <span>Last Updated</span>
        <code>Current block timestamp</code>
      </div>
      <div className={styles.tokenBucketItem}>
        <span>Status</span>
        <code>{config?.enabled ? "true" : "false"}</code>
      </div>
      <div className={styles.tokenBucketItem}>
        <span>Capacity</span>
        <code>{config?.capacity || "0"}</code>
      </div>
      <div className={styles.tokenBucketItem}>
        <span>Rate</span>
        <code>{config?.rate || "0"}</code>
      </div>
    </div>
  )
}

// Add type guard
const isValidNetwork = (network: Network | null): network is Network => {
  return !!network && typeof network.chainSelector === "string" && typeof network.name === "string"
}

const VerificationStep = ({ step }: { step: VerificationStep }) => {
  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <span className={styles.stepTitle}>
          <code>{step.functionName}</code>
        </span>
      </div>

      <div className={styles.stepDescription}>{step.description}</div>

      <div className={styles.parameterList}>
        {step.params.map((param, idx) => (
          <div key={idx} className={styles.parameter}>
            <div className={styles.parameterHeader}>
              <div className={styles.parameterName}>
                <span>{param.name}:</span>
                <code>{param.type}</code>
              </div>
              {param.value && <ReactCopyText text={param.value} code />}
            </div>
            <div className={styles.parameterDetails}>
              <span>{param.description}</span>
            </div>
          </div>
        ))}
        <div className={styles.parameter}>
          <div className={styles.parameterName}>
            <span>returns</span>
            <code>{step.returns.type}</code>
          </div>
          <span>{step.returns.description}</span>
        </div>
      </div>

      <div className={styles.expectedResult}>
        <span className={styles.resultLabel}>Expected Result</span>
        <div className={styles.resultContent}>{step.expectedResult}</div>
      </div>
    </div>
  )
}

export const PoolConfigVerification = ({ chain }: { chain: ChainType }) => {
  const state = useStore(laneStore)
  const currentNetwork = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const remoteNetwork = chain === "source" ? state.destinationNetwork : state.sourceNetwork

  // Validate networks first
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

  // Now TypeScript knows these are valid
  const currentSelector = currentNetwork.chainSelector
  const remoteSelector = remoteNetwork.chainSelector
  const currentName = currentNetwork.name
  const remoteName = remoteNetwork.name

  const remoteContracts = chain === "source" ? state.destinationContracts : state.sourceContracts
  const poolAddress = chain === "source" ? state.sourceContracts.tokenPool : state.destinationContracts.tokenPool
  const rateLimits = chain === "source" ? state.sourceRateLimits : state.destinationRateLimits

  // After network validation
  if (!poolAddress) {
    return (
      <div className={styles.verificationCard}>
        <div className={styles.loadingState}>
          <span>Deploy Pool First</span>
          <p>Please deploy your token pool contract before verifying configuration.</p>
        </div>
      </div>
    )
  }

  const verificationSteps: VerificationStep[] = [
    {
      functionName: "getRemoteToken",
      description:
        "Retrieves the ABI-encoded address of your token on the remote chain. This encoding supports both EVM and non-EVM chains.",
      params: [
        {
          name: "remoteChainSelector",
          type: "uint64",
          description: `Chain selector for ${remoteName}`,
          value: remoteSelector,
        },
      ],
      returns: {
        type: "bytes",
        description: "ABI-encoded address of the token on the remote chain",
      },
      expectedResult: remoteContracts.token
        ? utils.defaultAbiCoder.encode(["address"], [remoteContracts.token])
        : "Waiting for remote token address...",
    },
    {
      functionName: "getRemotePools",
      description:
        "Returns all registered token pools on the remote chain. Multiple pools can be configured for advanced setups.",
      params: [
        {
          name: "remoteChainSelector",
          type: "uint64",
          description: `Chain selector for ${remoteName}`,
          value: remoteSelector,
        },
      ],
      returns: {
        type: "bytes[]",
        description: "Array of ABI-encoded addresses of all registered pools on the remote chain",
      },
      expectedResult: remoteContracts.tokenPool
        ? [utils.defaultAbiCoder.encode(["address"], [remoteContracts.tokenPool])]
        : "Waiting for remote pool address...",
    },
    {
      functionName: "getCurrentInboundRateLimiterState",
      description: "Verifies your inbound transfer rate limits. Controls the rate of incoming token transfers.",
      params: [
        {
          name: "remoteChainSelector",
          type: "uint64",
          description: `Chain selector for ${remoteName}`,
          value: remoteSelector,
        },
      ],
      returns: {
        type: "TokenBucket",
        description: "Current state of the inbound rate limiter",
      },
      expectedResult: (
        <>
          {formatRateLimiterState(rateLimits, "inbound")}
          <div className={styles.tokenBucketNote}>
            <span>Note:</span>
            <p>
              Configure rate limits in the Chain Update Builder above. The <code>tokens</code> field starts at 0 and the{" "}
              <code>lastUpdated</code> field will show the current block timestamp.
            </p>
          </div>
        </>
      ),
    },
    {
      functionName: "getCurrentOutboundRateLimiterState",
      description: "Verifies your outbound transfer rate limits. Controls the rate of outgoing token transfers.",
      params: [
        {
          name: "remoteChainSelector",
          type: "uint64",
          description: `Chain selector for ${remoteName}`,
          value: remoteSelector,
        },
      ],
      returns: {
        type: "TokenBucket",
        description: "Current state of the outbound rate limiter",
      },
      expectedResult: (
        <>
          {formatRateLimiterState(rateLimits, "outbound")}
          <div className={styles.tokenBucketNote}>
            <span>Note:</span>
            <p>
              Configure rate limits in the Chain Update Builder above. The <code>tokens</code> field starts at 0 and the{" "}
              <code>lastUpdated</code> field will show the current block timestamp.
            </p>
          </div>
        </>
      ),
    },
  ]

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
            <code>{remoteName}</code>
            <div className={styles.chainSelector}>
              <span>Selector:</span>
              <ReactCopyText text={remoteSelector} code />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.poolAddress}>
        <span>Pool Address</span>
        <ReactCopyText text={poolAddress} code />
      </div>

      {verificationSteps.map((step, index) => (
        <div key={index} className={styles.step}>
          <VerificationStep step={step} />
        </div>
      ))}
    </div>
  )
}
