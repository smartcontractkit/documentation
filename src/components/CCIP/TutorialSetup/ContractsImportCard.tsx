import { StepCheckbox } from "@components/CCIP/TutorialProgress/StepCheckbox"
import { CodeSampleReact } from "@components/CodeSample/CodeSampleReact"
import styles from "./ContractsImportCard.module.css"
import { TutorialCard } from "./TutorialCard"
import { SetupSection } from "./SetupSection"
import type { StepId, SubStepId } from "@stores/lanes"

export const ContractsImportCard = () => {
  // Generate unique ID for navigation
  const stepId = "setup-contracts-imported"

  return (
    <TutorialCard title="Contract Setup" description="Import and compile the required smart contracts">
      <div id={stepId} className={styles.requirements}>
        <SetupSection
          title="Import Required Contracts"
          description="Import and compile the token contracts in Remix IDE"
          checkbox={{
            stepId: "setup" as StepId,
            subStepId: "contracts-imported" as SubStepId<StepId>,
          }}
        >
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
        </SetupSection>
      </div>
    </TutorialCard>
  )
}
