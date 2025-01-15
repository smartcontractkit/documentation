import { useState, useEffect } from "react"
import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { ContractAddress } from "./ContractAddress"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { SolidityParam } from "../TutorialSetup/SolidityParam"
import { StoredContractAddress } from "./StoredContractAddress"
import { NetworkAddress } from "./NetworkAddress"
import { ContractVerificationStep } from "./ContractVerificationStep"
import { Callout } from "../TutorialSetup/Callout"
import type { LaneState, DeployedContracts } from "@stores/lanes"
import styles from "./DeployPoolStep.module.css"
import { utils } from "ethers"

interface DeployPoolStepProps {
  chain: "source" | "destination"
}

// Extend LaneState to include the properties we need
interface ExtendedLaneState extends Omit<LaneState, "progress" | "sourceContracts" | "destinationContracts"> {
  tokenPoolAddress?: {
    [key in "source" | "destination"]?: string
  }
  sourceContracts: {
    tokenPool?: string
  } & DeployedContracts
  destinationContracts: {
    tokenPool?: string
  } & DeployedContracts
}

export const DeployPoolStep = ({ chain }: DeployPoolStepProps) => {
  const [poolType, setPoolType] = useState<"lock" | "burn">("burn")
  const state = useStore(laneStore) as ExtendedLaneState

  // Add effect to store pool type when valid address is provided
  useEffect(() => {
    const currentContracts = chain === "source" ? state.sourceContracts : state.destinationContracts

    // Only update pool type when we have a valid address
    if (currentContracts.tokenPool && utils.isAddress(currentContracts.tokenPool)) {
      const current = laneStore.get()

      // Debug log before update
      console.log(`[PoolType Update] ${chain}:`, {
        address: currentContracts.tokenPool,
        currentPoolType: currentContracts.poolType,
        newPoolType: poolType,
        timestamp: new Date().toISOString(),
      })

      if (chain === "source") {
        laneStore.set({
          ...current,
          sourceContracts: {
            ...current.sourceContracts,
            poolType,
          },
        })
      } else {
        laneStore.set({
          ...current,
          destinationContracts: {
            ...current.destinationContracts,
            poolType,
          },
        })
      }
    }
  }, [chain, poolType, state.sourceContracts.tokenPool, state.destinationContracts.tokenPool])

  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const contractAddress = chain === "source" ? state.sourceContracts?.tokenPool : state.destinationContracts?.tokenPool

  const networkInfo = network
    ? {
        name: network.name,
        logo: network.logo,
      }
    : { name: "loading..." }

  const stepId = chain === "source" ? "sourceChain" : "destinationChain"
  const getSubStepId = (subStep: string) => `${stepId}-${subStep}`
  const deployedStepId = chain === "source" ? "pool-deployed" : "dest-pool-deployed"

  return (
    <TutorialCard title="Deploy Token Pool" description="Choose your pool type and deploy using Remix IDE">
      <NetworkCheck network={networkInfo} />

      <ol className={styles.steps}>
        <TutorialStep id={getSubStepId("pool-type")} title="Choose Pool Type">
          <Callout type="note" title="Understanding Pool Types">
            Each pool type serves different use cases and has specific requirements. Learn more about pool types and
            their characteristics in the{" "}
            <a href="/ccip/concepts/cross-chain-tokens#standard-token-pools">token pools documentation</a>.
          </Callout>
          <div className={styles.selectionDescription}>
            Select the appropriate pool type based on your token's characteristics and requirements
          </div>

          <div className={styles.poolOptions}>
            <button
              className={`${styles.poolOption} ${poolType === "burn" ? styles.selected : ""}`}
              onClick={() => setPoolType("burn")}
            >
              <div className={styles.poolTitle}>
                <span className={styles.poolName}>
                  Burn & Mint Pool
                  <span className={styles.contractName}>BurnMintTokenPool</span>
                </span>
                {poolType === "burn" && <span className={styles.selectedIndicator} />}
              </div>
              <div className={styles.poolContent}>
                <p className={styles.poolDescription}>
                  Standard mechanism for cross-chain transfers. Tokens are burned on one chain and minted on another,
                  maintaining constant total supply.
                </p>
                <div className={styles.poolNote}>ℹ️ Use this for new tokens or tokens with burn/mint capability</div>
              </div>
            </button>

            <button
              className={`${styles.poolOption} ${poolType === "lock" ? styles.selected : ""}`}
              onClick={() => setPoolType("lock")}
            >
              <div className={styles.poolTitle}>
                <span className={styles.poolName}>
                  Lock & Release Pool
                  <span className={styles.contractName}>LockReleaseTokenPool</span>
                </span>
                {poolType === "lock" && <span className={styles.selectedIndicator} />}
              </div>
              <div className={styles.poolContent}>
                <p className={styles.poolDescription}>
                  Suitable for tokens that already exist on this blockchain and can't be burned. Tokens are locked here
                  and "wrapped" versions are minted on other chains.
                </p>
                <div className={styles.poolNote}>
                  ℹ️ Deploy this on the blockchain where your token originally exists
                </div>
              </div>
            </button>
          </div>
        </TutorialStep>

        <TutorialStep id={getSubStepId("pool-remix")} title="Configure Remix">
          <ul>
            <li>Open the "Deploy & Run Transactions" tab</li>
            <li>Set Environment to "Injected Provider - MetaMask"</li>
            <li>
              Select <strong>{poolType === "burn" ? "BurnMintTokenPool" : "LockReleaseTokenPool"}</strong> contract
            </li>
          </ul>
        </TutorialStep>

        <TutorialStep id={getSubStepId("pool-params")} title="Set Parameters">
          <div className={styles.parametersIntro}>
            <p>Configure your pool by setting these required parameters in Remix:</p>
          </div>
          <div className={styles.parameters}>
            {poolType === "lock" ? (
              <>
                <SolidityParam
                  name="token"
                  type="address"
                  description="Address of the token to be released/locked"
                  example={<StoredContractAddress type="token" chain={chain} />}
                />
                <SolidityParam
                  name="localTokenDecimals"
                  type="uint8"
                  description="Number of decimals for your token"
                  example="18"
                />
                <SolidityParam
                  name="allowlist"
                  type="address[]"
                  description="Addresses allowed to transfer tokens (empty array for no restrictions)"
                  example="[]"
                />
                <SolidityParam
                  name="rmnProxy"
                  type="address"
                  description="Address of the RMN contract"
                  example={<NetworkAddress type="armProxy" chain={chain} />}
                />
                <SolidityParam
                  name="acceptLiquidity"
                  type="bool"
                  description="Enable external liquidity for lock/release mechanism"
                  example="true"
                />
                <SolidityParam
                  name="router"
                  type="address"
                  description="Address of the CCIP Router contract"
                  example={<NetworkAddress type="router" chain={chain} />}
                />
              </>
            ) : (
              <>
                <SolidityParam
                  name="token"
                  type="address"
                  description="Address of the token to be minted/burned"
                  example={<StoredContractAddress type="token" chain={chain} />}
                />
                <SolidityParam
                  name="localTokenDecimals"
                  type="uint8"
                  description="Number of decimals for your token"
                  example="18"
                />
                <SolidityParam
                  name="allowlist"
                  type="address[]"
                  description="Addresses allowed to transfer tokens (empty array for no restrictions)"
                  example="[]"
                />
                <SolidityParam
                  name="rmnProxy"
                  type="address"
                  description="Address of the RMN contract"
                  example={<NetworkAddress type="armProxy" chain={chain} />}
                />
                <SolidityParam
                  name="router"
                  type="address"
                  description="Address of the CCIP Router contract"
                  example={<NetworkAddress type="router" chain={chain} />}
                />
              </>
            )}
          </div>
        </TutorialStep>

        <TutorialStep id={getSubStepId(deployedStepId)} title="Deploy Contract">
          <ul>
            <li>Click "Deploy" and confirm in MetaMask</li>
            <li>Copy your pool address from "Deployed Contracts"</li>
          </ul>
          <div className={styles.addressInput}>
            <ContractAddress type="tokenPool" chain={chain} placeholder="Enter deployed pool address" />
          </div>
        </TutorialStep>

        <ContractVerificationStep
          stepId={getSubStepId("verify-contract")}
          network={network}
          contractAddress={contractAddress}
          contractType="pool"
        />
      </ol>
    </TutorialCard>
  )
}
