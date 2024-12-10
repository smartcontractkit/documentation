import { StepCheckbox } from "@components/CCIP/TutorialProgress/StepCheckbox"
import { CodeSampleReact } from "@components/CodeSample/CodeSampleReact"
import styles from "./PrerequisitesCard.module.css" // We'll reuse the same styles initially

export const ContractsImportCard = () => {
  // Generate unique ID for navigation
  const stepId = "setup-contracts-imported"

  return (
    <div id={stepId} className={styles.card}>
      <div className={styles.title}>Contract Setup</div>
      <div className={styles.requirements}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Import Required Contracts</div>
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepInfo}>
                <span className={styles.stepTitle}>Import and Compile Contracts</span>
                <p className={styles.stepDescription}>Import and compile the token contracts in Remix IDE</p>
              </div>
              <div className={styles.stepActions}>
                <StepCheckbox stepId="setup" subStepId="contracts-imported" />
              </div>
            </div>

            <div className={styles.stepContent}>
              <ol className={styles.stepsList}>
                <li>
                  Open the pre-configured token contract in Remix:
                  <div className={styles.codeContainer}>
                    <CodeSampleReact
                      src="samples/CCIP/cct/TokenDependencies.sol"
                      showButtonOnly={true}
                      optimize={true}
                      runs={1000}
                    />
                  </div>
                </li>
                <li>Wait a few seconds for Remix to automatically compile all contracts.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
