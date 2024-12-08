import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkAddress } from "./NetworkAddress"
import { StoredContractAddress } from "./StoredContractAddress"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"
import styles from "./AdminSetupStep.module.css"

interface AdminSetupStepProps {
  chain: "source" | "destination"
}

export const AdminSetupStep = ({ chain }: AdminSetupStepProps) => {
  const state = useStore(laneStore)
  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const networkInfo = network ? { name: network.name, logo: network.logo } : { name: "loading..." }
  const stepId = chain === "source" ? "sourceChain" : "destinationChain"

  const content = (
    <>
      <NetworkCheck network={networkInfo} />

      <div className={styles.stepContent}>
        <ol className={styles.stepList}>
          <li className={styles.stepItem}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>Register as Admin</span>
              <StepCheckbox stepId={stepId} subStepId="admin-claimed" />
            </div>
            <div className={styles.contractInfo}>
              <strong>Contract:</strong> RegistryModuleOwnerCustom
              <NetworkAddress type="registryModule" chain={chain} />
            </div>
            <div className={styles.actionDetails}>
              <div className={styles.actionTitle}>
                Call <code>registerAdminViaOwner</code> with:
              </div>
              <div className={styles.parameter}>
                <span className={styles.paramName}>token</span>
                <StoredContractAddress type="token" chain={chain} />
              </div>
            </div>
          </li>

          <li className={styles.stepItem}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>Accept Admin Role</span>
              <StepCheckbox stepId={stepId} subStepId="admin-accepted" />
            </div>
            <div className={styles.contractInfo}>
              <strong>Contract:</strong> TokenAdminRegistry
              <NetworkAddress type="tokenAdminRegistry" chain={chain} />
            </div>
            <div className={styles.actionDetails}>
              <div className={styles.actionTitle}>
                Call <code>acceptAdminRole</code> with:
              </div>
              <div className={styles.parameter}>
                <span className={styles.paramName}>token</span>
                <StoredContractAddress type="token" chain={chain} />
              </div>
            </div>
          </li>
        </ol>
      </div>
    </>
  )

  return (
    <TutorialCard title="Claim and Accept Admin Role" description="Set up the admin permissions for your token">
      {content}
    </TutorialCard>
  )
}
