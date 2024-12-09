import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"
import { laneStore, TUTORIAL_STEPS, type StepId } from "@stores/lanes"
import { ChainValue, StoredContractAddress } from "../TutorialBlockchainSelector"
import styles from "./TutorialProgress.module.css"
import { subscribeToProgress } from "@stores/lanes"

export const TutorialProgress = () => {
  const state = useStore(laneStore)
  const currentStep = determineCurrentStep(state)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [forceExpanded, setForceExpanded] = useState<string | null>(null)
  const [progressState, setProgressState] = useState(state.progress)
  const [steps] = useState([
    { id: "setup", title: "Setup", stepNumber: 1 },
    { id: "sourceChain", title: "Source Chain", stepNumber: 2 },
    { id: "destinationChain", title: "Destination Chain", stepNumber: 3 },
    { id: "sourceConfig", title: "Source Configuration", stepNumber: 4 },
    { id: "destinationConfig", title: "Destination Configuration", stepNumber: 5 },
  ])

  useEffect(() => {
    // Subscribe to progress updates
    const unsubscribe = subscribeToProgress((progress) => {
      setProgressState(progress)
      // Keep step expanded when interacting with checkboxes
      if (forceExpanded) {
        setExpandedStep(forceExpanded)
      }
    })
    return () => unsubscribe()
  }, [forceExpanded])

  const toggleStepDetails = (stepId) => {
    setForceExpanded(stepId)
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const getStepStatus = (stepId: string) => {
    const stepProgress = progressState[stepId] || {}
    const totalSubSteps = Object.keys(TUTORIAL_STEPS[stepId].subSteps).length
    const completedSubSteps = Object.values(stepProgress).filter(Boolean).length

    if (completedSubSteps === 0) return "not-started"
    if (completedSubSteps === totalSubSteps) return "completed"
    return "in-progress"
  }

  const getStepProgress = (stepId: StepId) => {
    const stepConfig = TUTORIAL_STEPS[stepId]
    const stepProgress = progressState[stepId] || {}
    const subSteps = Object.entries(stepConfig.subSteps).map(([id, title]) => ({
      id,
      title,
      completed: !!stepProgress[id],
    }))
    return subSteps
  }

  return (
    <section className={styles["sidebar-nav"]} aria-labelledby="grid-right" data-sticky>
      <div className={styles.title}>Tutorial Progress</div>
      <div className={styles["toc-wrapper"]}>
        <div className={styles["progress-tracker"]}>
          <div className={styles["progress-bar"]} style={{ width: `${(currentStep / 5) * 100}%` }} />
          <div className={styles.steps}>
            {steps.map((step) => {
              const status = getStepStatus(step.id)
              return (
                <div key={step.id} className={`${styles["step-container"]} ${styles[status]}`}>
                  <button
                    className={`${styles.step} ${styles[status]} ${expandedStep === step.id ? styles.expanded : ""}`}
                    onClick={() => toggleStepDetails(step.id)}
                    aria-expanded={expandedStep === step.id}
                    aria-controls={`details-${step.id}`}
                  >
                    <div className={styles["step-indicator"]}>{status === "completed" ? "✓" : step.stepNumber}</div>
                    <span className={styles["step-title"]}>{step.title}</span>
                    <div className={styles.chevron} aria-hidden="true" />
                  </button>
                  {expandedStep === step.id && (
                    <div className={styles["step-details"]}>
                      <div className={styles["step-progress"]}>
                        {getStepProgress(step.id as StepId).map(({ id, title, completed }) => (
                          <div key={id} className={`${styles.substep} ${completed ? styles.completed : ""}`}>
                            <span className={styles["substep-title"]}>{title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles["configuration-status"]}>
          <div className={styles.sectionTitle}>Configuration Status</div>

          {/* Source Chain Block */}
          <div className={styles.chainBlock}>
            <div className={styles.chainHeader}>
              <div className={styles.chainIdentity}>
                {state.sourceNetwork && (
                  <>
                    <img src={state.sourceNetwork.logo} alt={state.sourceNetwork.name} className={styles.networkLogo} />
                    <span className={styles.chainName}>{state.sourceNetwork.name || "Source Chain"}</span>
                  </>
                )}
                {!state.sourceNetwork && <span className={styles.chainName}>Source Chain</span>}
              </div>
            </div>
            <div className={styles.chainConfigs}>
              <StatusItem
                label="Token"
                value={<StoredContractAddress type="token" chain="source" />}
                isComplete={!!state.sourceContracts.token}
              />
              <StatusItem
                label="Pool"
                value={<StoredContractAddress type="tokenPool" chain="source" />}
                isComplete={!!state.sourceContracts.tokenPool}
              />
            </div>
          </div>

          {/* Destination Chain Block */}
          <div className={styles.chainBlock}>
            <div className={styles.chainHeader}>
              <div className={styles.chainIdentity}>
                {state.destinationNetwork && (
                  <img
                    src={state.destinationNetwork.logo}
                    alt={state.destinationNetwork.name}
                    className={styles.networkLogo}
                  />
                )}
                <span className={styles.chainName}>Destination Chain</span>
              </div>
            </div>
            <div className={styles.chainConfigs}>
              <StatusItem
                label="Token"
                value={<StoredContractAddress type="token" chain="destination" />}
                isComplete={!!state.destinationContracts.token}
              />
              <StatusItem
                label="Pool"
                value={<StoredContractAddress type="tokenPool" chain="destination" />}
                isComplete={!!state.destinationContracts.tokenPool}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const StatusItem = ({ label, value, isComplete }) => (
  <div className={`${styles["status-item"]} ${isComplete ? styles.complete : ""}`}>
    <span className={styles["status-label"]}>{label}</span>
    <div className={styles["status-value"]}>{value}</div>
    {isComplete && <span className={styles["status-check"]}>✓</span>}
  </div>
)

const determineCurrentStep = (state) => {
  if (!state.sourceChain || !state.destinationChain) return 1
  if (!state.sourceContracts.token || !state.sourceContracts.tokenPool) return 2
  if (!state.destinationContracts.token || !state.destinationContracts.tokenPool) return 3
  if (!state.sourceContracts.configured) return 4
  if (!state.destinationContracts.configured) return 5
  return 5
}
