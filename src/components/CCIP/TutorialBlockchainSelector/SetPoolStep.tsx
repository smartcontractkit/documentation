import { useStore } from "@nanostores/react"
import { laneStore, setPoolRegistered } from "@stores/lanes"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkAddress } from "./NetworkAddress"
import { StoredContractAddress } from "./StoredContractAddress"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"
import { SolidityParam } from "../TutorialSetup/SolidityParam"
import styles from "./SetPoolStep.module.css"

interface SetPoolStepProps {
  chain: "source" | "destination"
}

export const SetPoolStep = ({ chain }: SetPoolStepProps) => {
  const state = useStore(laneStore)
  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const networkInfo = network ? { name: network.name, logo: network.logo } : { name: "loading..." }
  const stepId = chain === "source" ? "sourceChain" : "destinationChain"

  return (
    <TutorialCard title="Configure Token Registry" description="Register your token pool in the CCIP registry">
      <NetworkCheck network={networkInfo} />

      <ol className={styles.steps}>
        <TutorialStep
          title="Configure Registry"
          checkbox={
            <StepCheckbox
              stepId={stepId}
              subStepId={chain === "source" ? "pool-registered" : "dest-pool-registered"}
              onChange={(checked) => setPoolRegistered(chain, checked)}
            />
          }
        >
          <ol className={styles.instructions}>
            <li>
              In the "Deploy & Run Transactions" tab, select <strong>TokenAdminRegistry</strong> contract
            </li>
            <li>
              Use "At Address" with:
              <div className={styles.contractInfo}>
                <strong>Contract:</strong> TokenAdminRegistry
                <NetworkAddress type="tokenAdminRegistry" chain={chain} />
              </div>
            </li>
            <li>Click on the TokenAdminRegistry contract to open its details</li>
            <li>
              Call <code>setPool</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>setPool</code>
                  <div className={styles.functionPurpose}>Enable your token for CCIP by registering its token pool</div>
                </div>

                <div className={styles.functionRequirement}>⚠️ You must be the token admin to call this function</div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="localToken"
                      type="address"
                      description="The token to enable for CCIP"
                      example={<StoredContractAddress type="token" chain={chain} />}
                    />
                    <SolidityParam
                      name="pool"
                      type="address"
                      description="The token pool that will handle cross-chain transfers"
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