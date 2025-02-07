import { useStore } from "@nanostores/react"
import { laneStore, TUTORIAL_STEPS, type RateLimits } from "@stores/lanes"
import { utils } from "ethers"
import { ReactCopyText } from "@components/ReactCopyText"
import styles from "./PoolConfigVerification.module.css"
import { TutorialCard, TutorialStep, NetworkCheck, SolidityParam } from "../TutorialSetup"
import { Callout } from "../TutorialSetup/Callout"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"

type ChainType = "source" | "destination"

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

export const PoolConfigVerification = ({ chain }: { chain: ChainType }) => {
  const state = useStore(laneStore)
  const currentNetwork = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const remoteNetwork = chain === "source" ? state.destinationNetwork : state.sourceNetwork
  const networkInfo = currentNetwork ? { name: currentNetwork.name, logo: currentNetwork.logo } : { name: "loading..." }
  const remoteSelector = remoteNetwork?.chainSelector
  const remoteName = remoteNetwork?.name
  const remoteContracts = chain === "source" ? state.destinationContracts : state.sourceContracts
  const poolAddress = chain === "source" ? state.sourceContracts.tokenPool : state.destinationContracts.tokenPool
  const rateLimits = chain === "source" ? state.sourceRateLimits : state.destinationRateLimits
  const poolType = chain === "source" ? state.sourceContracts.poolType : state.destinationContracts.poolType

  const stepId = chain === "source" ? "sourceConfig" : "destinationConfig"
  const subStepId = chain === "source" ? "source-verification" : "dest-verification"
  const navigationId = `${stepId}-${subStepId}`

  return (
    <TutorialCard
      title={TUTORIAL_STEPS[stepId].subSteps[subStepId]}
      description="Confirm your cross-chain setup is correct"
    >
      <NetworkCheck network={networkInfo} />
      <ol className={styles.steps}>
        <TutorialStep
          id={navigationId}
          title="Verify Configuration"
          checkbox={<StepCheckbox stepId={stepId} subStepId={subStepId} />}
        >
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
          </ol>
        </TutorialStep>

        <TutorialStep title="Verify Remote Token">
          <ol className={styles.instructions}>
            <li>
              Call <code>getRemoteToken</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>getRemoteToken</code>
                  <div className={styles.functionPurpose}>
                    Retrieves the ABI-encoded address of your token on the remote chain
                  </div>
                </div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="remoteChainSelector"
                      type="uint64"
                      description={`Chain selector for ${remoteName}`}
                      example={remoteSelector && <ReactCopyText text={remoteSelector} code />}
                    />
                  </div>
                </div>

                <div className={styles.returnsSection}>
                  <div className={styles.returnsTitle}>Returns:</div>
                  <div className={styles.returnsList}>
                    <div className={styles.returnValue}>
                      <div className={styles.returnType}>bytes</div>
                      <div className={styles.returnDescription}>
                        ABI-encoded address of the token on the remote chain
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.expectedResult}>
                  <div className={styles.resultTitle}>Expected Result:</div>
                  <div className={styles.resultContent}>
                    {remoteContracts.token
                      ? utils.defaultAbiCoder.encode(["address"], [remoteContracts.token])
                      : "Waiting for remote token address..."}
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </TutorialStep>

        <TutorialStep title="Verify Remote Pools">
          <ol className={styles.instructions}>
            <li>
              Call <code>getRemotePools</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>getRemotePools</code>
                  <div className={styles.functionPurpose}>Returns all registered token pools on the remote chain</div>
                </div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="remoteChainSelector"
                      type="uint64"
                      description={`Chain selector for ${remoteName}`}
                      example={remoteSelector && <ReactCopyText text={remoteSelector} code />}
                    />
                  </div>
                </div>

                <div className={styles.returnsSection}>
                  <div className={styles.returnsTitle}>Returns:</div>
                  <div className={styles.returnsList}>
                    <div className={styles.returnValue}>
                      <div className={styles.returnType}>bytes[]</div>
                      <div className={styles.returnDescription}>
                        Array of ABI-encoded addresses of all registered pools on the remote chain
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.expectedResult}>
                  <div className={styles.resultTitle}>Expected Result:</div>
                  <div className={styles.resultContent}>
                    {remoteContracts.tokenPool
                      ? [utils.defaultAbiCoder.encode(["address"], [remoteContracts.tokenPool])]
                      : "Waiting for remote pool address..."}
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </TutorialStep>

        <TutorialStep title="Verify Rate Limiters">
          <ol className={styles.instructions}>
            <li>
              Call <code>getCurrentInboundRateLimiterState</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>getCurrentInboundRateLimiterState</code>
                  <div className={styles.functionPurpose}>Verifies your inbound transfer rate limits</div>
                </div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="remoteChainSelector"
                      type="uint64"
                      description={`Chain selector for ${remoteName}`}
                      example={remoteSelector && <ReactCopyText text={remoteSelector} code />}
                    />
                  </div>
                </div>

                <div className={styles.returnsSection}>
                  <div className={styles.returnsTitle}>Returns:</div>
                  <div className={styles.returnsList}>
                    <div className={styles.returnValue}>
                      <div className={styles.returnType}>TokenBucket</div>
                      <div className={styles.returnDescription}>Current state of the inbound rate limiter</div>
                    </div>
                  </div>
                </div>

                <div className={styles.expectedResult}>
                  <div className={styles.resultTitle}>Expected Result:</div>
                  <div className={styles.resultContent}>{formatRateLimiterState(rateLimits, "inbound")}</div>
                  <Callout type="note">
                    The <code>tokens</code> field starts at 0 and the <code>lastUpdated</code> field will show the
                    current block timestamp.
                  </Callout>
                </div>
              </div>
            </li>
            <li>
              Call <code>getCurrentOutboundRateLimiterState</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>getCurrentOutboundRateLimiterState</code>
                  <div className={styles.functionPurpose}>Verifies your outbound transfer rate limits</div>
                </div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="remoteChainSelector"
                      type="uint64"
                      description={`Chain selector for ${remoteName}`}
                      example={remoteSelector && <ReactCopyText text={remoteSelector} code />}
                    />
                  </div>
                </div>

                <div className={styles.returnsSection}>
                  <div className={styles.returnsTitle}>Returns:</div>
                  <div className={styles.returnsList}>
                    <div className={styles.returnValue}>
                      <div className={styles.returnType}>TokenBucket</div>
                      <div className={styles.returnDescription}>Current state of the outbound rate limiter</div>
                    </div>
                  </div>
                </div>

                <div className={styles.expectedResult}>
                  <div className={styles.resultTitle}>Expected Result:</div>
                  <div className={styles.resultContent}>{formatRateLimiterState(rateLimits, "outbound")}</div>
                  <Callout type="note">
                    The <code>tokens</code> field starts at 0 and the <code>lastUpdated</code> field will show the
                    current block timestamp.
                  </Callout>
                </div>
              </div>
            </li>
          </ol>
        </TutorialStep>
      </ol>
    </TutorialCard>
  )
}
