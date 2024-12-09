import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"
import { SolidityParam } from "../TutorialSetup/SolidityParam"
import { StoredContractAddress } from "./StoredContractAddress"
import { Callout } from "../TutorialSetup/Callout"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import styles from "./GrantPrivilegesStep.module.css"

interface GrantPrivilegesStepProps {
  chain: "source" | "destination"
}

export const GrantPrivilegesStep = ({ chain }: GrantPrivilegesStepProps) => {
  const state = useStore(laneStore)
  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const networkInfo = network ? { name: network.name, logo: network.logo } : { name: "loading..." }

  return (
    <TutorialCard title="Configure Token Privileges" description="Grant required privileges to your token pool">
      <NetworkCheck network={networkInfo} />
      <ol className={styles.steps}>
        <TutorialStep
          title="Grant Burn and Mint Privileges"
          checkbox={<StepCheckbox stepId={`${chain}Config`} subStepId={`${chain}-privileges`} />}
        >
          <Callout type="note" title="Optional Step" className={styles.skipNote}>
            Skip this section if you deployed a <strong>LockReleaseTokenPool</strong>
          </Callout>

          <ol className={styles.instructions}>
            <li>
              In the list of deployed contracts, select your <strong>BurnMintERC677</strong> token at{" "}
              <StoredContractAddress type="token" chain={chain} />
            </li>
            <li>Click to open the contract details</li>
            <li>
              Call <code>grantMintAndBurnRoles</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>grantMintAndBurnRoles</code>
                  <div className={styles.functionPurpose}>
                    Grant mint and burn privileges to your token pool for cross-chain transfers
                  </div>
                </div>

                <div className={styles.functionRequirement}>
                  ⚠️ You must be the token contract owner to call this function
                </div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="burnAndMinter"
                      type="address"
                      description="Address to grant mint and burn roles to (your token pool)"
                      example={<StoredContractAddress type="tokenPool" chain={chain} />}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>Confirm the transaction in MetaMask</li>
          </ol>
        </TutorialStep>
      </ol>
    </TutorialCard>
  )
}
