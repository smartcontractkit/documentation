import { useStore } from "@nanostores/react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { laneStore, progressStore, TUTORIAL_STEPS, type StepId, type LaneState } from "@stores/lanes"
import styles from "./TutorialProgress.module.css"

// Helper function to determine current step
const determineCurrentStep = (state: Omit<LaneState, "progress">): number => {
  if (!state.sourceChain || !state.destinationChain) return 1
  if (!state.sourceContracts.token || !state.sourceContracts.tokenPool) return 2
  if (!state.destinationContracts.token || !state.destinationContracts.tokenPool) return 3
  if (!state.sourceContracts.configured) return 4
  return 5
}

export const TutorialProgress = () => {
  const mainState = useStore(laneStore)
  const progress = useStore(progressStore)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [forceExpanded, setForceExpanded] = useState<string | null>(null)

  // Use currentStep to determine which step should be expanded by default
  const currentStepNumber = useMemo(() => determineCurrentStep(mainState), [mainState])

  const steps = useMemo(
    () => [
      { id: "setup", title: "Setup", stepNumber: 1 },
      { id: "sourceChain", title: "Source Chain", stepNumber: 2 },
      { id: "destinationChain", title: "Destination Chain", stepNumber: 3 },
      { id: "sourceConfig", title: "Source Configuration", stepNumber: 4 },
      { id: "destinationConfig", title: "Destination Configuration", stepNumber: 5 },
    ],
    []
  )

  // Auto-expand current step on initial render
  useEffect(() => {
    if (!expandedStep) {
      const currentStep = steps.find((step) => step.stepNumber === currentStepNumber)
      if (currentStep) {
        setExpandedStep(currentStep.id)
        setForceExpanded(currentStep.id)
      }
    }
  }, [currentStepNumber, steps, expandedStep])

  useEffect(() => {
    if (forceExpanded) {
      setExpandedStep(forceExpanded)
    }
  }, [forceExpanded])

  const toggleStepDetails = useCallback(
    (stepId: string) => {
      setForceExpanded(stepId)
      setExpandedStep(expandedStep === stepId ? null : stepId)
    },
    [expandedStep]
  )

  const getStepStatus = useCallback(
    (stepId: string) => {
      const stepProgress = progress[stepId] || {}
      const totalSubSteps = Object.keys(TUTORIAL_STEPS[stepId].subSteps).length
      const completedSubSteps = Object.values(stepProgress).filter(Boolean).length

      if (completedSubSteps === 0) return "not-started"
      if (completedSubSteps === totalSubSteps) return "completed"
      return "in-progress"
    },
    [progress]
  )

  const getStepProgress = useCallback(
    (stepId: StepId) => {
      const stepConfig = TUTORIAL_STEPS[stepId]
      const stepProgress = progress[stepId] || {}
      return Object.entries(stepConfig.subSteps).map(([id, title]) => ({
        id,
        title,
        completed: !!stepProgress[id],
      }))
    },
    [progress]
  )

  return (
    <section className={styles["sidebar-nav"]} aria-labelledby="grid-right" data-sticky>
      <div className={styles.title}>Tutorial Progress</div>
      <div className={styles["toc-wrapper"]}>
        <div className={styles["progress-tracker"]}>
          <div className={styles.steps}>
            {steps.map((step) => {
              const status = getStepStatus(step.id)
              const isCurrentStep = step.stepNumber === currentStepNumber
              return (
                <div
                  key={step.id}
                  className={`${styles["step-container"]} ${styles[status]} ${isCurrentStep ? styles.current : ""}`}
                >
                  <div
                    className={`${styles.connector} ${getStepStatus(step.id) === "completed" ? styles.completed : ""}`}
                  />

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
      </div>
    </section>
  )
}
