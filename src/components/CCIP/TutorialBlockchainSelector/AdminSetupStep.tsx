import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkAddress } from "./NetworkAddress"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"
import { SolidityParam } from "../TutorialSetup/SolidityParam"
import styles from "./AdminSetupStep.module.css"

interface AdminSetupStepProps {
  chain: "source" | "destination"
}

export const AdminSetupStep = ({ chain }: AdminSetupStepProps) => {
  const state = useStore(laneStore)
  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const networkInfo = network ? { name: network.name, logo: network.logo } : { name: "loading..." }
  const stepId = chain === "source" ? "sourceChain" : "destinationChain"
  const tokenAddress = chain === "source" ? state.sourceContracts.token : state.destinationContracts.token

  const content = (
    <>
      <NetworkCheck network={networkInfo} />

      <ol className={styles.steps}>
        <TutorialStep title="Register as Admin" checkbox={<StepCheckbox stepId={stepId} subStepId="admin-claimed" />}>
          <ol className={styles.instructions}>
            <li>
              In the "Deploy & Run Transactions" tab, select <strong>RegistryModuleOwnerCustom</strong> contract
            </li>
            <li>
              Use "At Address" with:
              <div className={styles.contractInfo}>
                <strong>Contract:</strong> RegistryModuleOwnerCustom
                <NetworkAddress type="registryModule" chain={chain} />
              </div>
            </li>
            <li>The RegistryModuleOwnerCustom will be displayed in the "Deployed Contracts" section</li>
            <li>Click on the RegistryModuleOwnerCustom contract address to open the contract details</li>
            <li>
              Call <code>registerAdminViaOwner</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>registerAdminViaOwner</code>
                  <div className={styles.functionPurpose}>
                    Register yourself as the CCIP administrator for your token
                  </div>
                </div>

                <div className={styles.functionRequirement}>⚠️ You must be the token owner to call this function</div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="token"
                      type="address"
                      description="The token contract you want to administer"
                      example={tokenAddress || "Your deployed token address"}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>Confirm the transaction in MetaMask</li>
          </ol>
        </TutorialStep>

        <TutorialStep title="Accept Admin Role" checkbox={<StepCheckbox stepId={stepId} subStepId="admin-accepted" />}>
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
            <li>The TokenAdminRegistry will be displayed in the "Deployed Contracts" section</li>
            <li>Click on the TokenAdminRegistry contract address to open the contract details</li>
            <li>
              Call <code>acceptAdminRole</code>:
              <div className={styles.functionCall}>
                <div className={styles.functionHeader}>
                  <code className={styles.functionName}>acceptAdminRole</code>
                  <div className={styles.functionPurpose}>Accept your role as CCIP administrator for your token</div>
                </div>

                <div className={styles.functionRequirement}>
                  ⚠️ Must be called after registerAdminViaOwner is confirmed
                </div>

                <div className={styles.parametersSection}>
                  <div className={styles.parametersTitle}>Parameters:</div>
                  <div className={styles.parametersList}>
                    <SolidityParam
                      name="token"
                      type="address"
                      description="The token contract to accept administrator role for"
                      example={tokenAddress || "Your deployed token address"}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>Confirm the transaction in MetaMask</li>
          </ol>
        </TutorialStep>
      </ol>
    </>
  )

  return (
    <TutorialCard
      title="Claim and Accept Admin Role"
      description="Configure your EOA as CCIP administrator of your token"
    >
      {content}
    </TutorialCard>
  )
}