import { useStore } from "@nanostores/react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { laneStore, progressStore, TUTORIAL_STEPS, type StepId, type LaneState } from "@stores/lanes"
import styles from "./TutorialProgress.module.css"
import { ChainSelectorDisplay } from "./ChainSelectorDisplay"
import { ContractAddressDisplay } from "./ContractAddressDisplay"
import { SectionProgress } from "./SectionProgress"

// Helper function to determine current step
const determineCurrentStep = (state: Omit<LaneState, "progress">): number => {
  if (!state.sourceChain || !state.destinationChain) return 1
  if (!state.sourceContracts.token || !state.sourceContracts.tokenPool) return 2
  if (!state.destinationContracts.token || !state.destinationContracts.tokenPool) return 3
  if (!state.sourceContracts.configured) return 4
  return 5
}

// Add navigation helper
const navigateToSubStep = (stepId: StepId, subStepId: string) => {
  // First, ensure the parent step is expanded
  const elementId = `${stepId}-${subStepId}`
  const element = document.getElementById(elementId)

  if (element) {
    // Expand the parent step if needed
    laneStore.set({
      ...laneStore.get(),
      currentStep: stepId,
    })

    // Scroll to the element
    element.scrollIntoView({ behavior: "smooth", block: "center" })

    // Add a temporary highlight
    element.style.transition = "background-color 0.3s ease"
    element.style.backgroundColor = "rgba(55, 91, 210, 0.1)"
    setTimeout(() => {
      element.style.backgroundColor = ""
    }, 1500)
  }
}

export const TutorialProgress = () => {
  const mainState = useStore(laneStore)
  const progress = useStore(progressStore)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [forceExpanded, setForceExpanded] = useState<string | null>(null)

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

  // Calculate the highest completed step
  const highestCompletedStep = useMemo(() => {
    return steps.reduce((highest, step) => {
      const status = getStepStatus(step.id)
      if (status === "completed") {
        return Math.max(highest, step.stepNumber)
      }
      return highest
    }, 0)
  }, [steps, getStepStatus])

  // Determine the displayed step number (should be the lowest incomplete step)
  const displayedStepNumber = useMemo(() => {
    const inProgressStep = steps.find((step) => getStepStatus(step.id) === "in-progress")
    if (inProgressStep) return inProgressStep.stepNumber

    // If no step is in progress, show the next step after highest completed
    const nextStep = highestCompletedStep + 1
    return Math.min(nextStep, steps.length)
  }, [steps, getStepStatus, highestCompletedStep])

  // Use currentStep to determine which step should be expanded by default
  const currentStepNumber = useMemo(() => determineCurrentStep(mainState), [mainState])

  // Create steps data for progress bar
  const progressSteps = useMemo(
    () =>
      steps.map((step) => ({
        id: step.id as StepId,
        stepNumber: step.stepNumber,
        status: getStepStatus(step.id),
      })),
    [steps, getStepStatus]
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

  // Update the substep rendering to be clickable
  const renderSubSteps = useCallback(
    (stepId: StepId) => {
      const subSteps = getStepProgress(stepId)
      return subSteps.map(({ id: subStepId, title, completed }) => (
        <button
          key={subStepId}
          className={`${styles.substep} ${completed ? styles.completed : ""}`}
          onClick={() => navigateToSubStep(stepId, subStepId)}
          aria-label={`Go to ${title}`}
        >
          <span className={styles.substepTitle}>{title}</span>
        </button>
      ))
    },
    [getStepProgress]
  )

  return (
    <section className={styles.tutorialProgress} aria-label="Tutorial Progress">
      <div className={styles.title}>Tutorial Progress</div>
      <SectionProgress
        currentStep={displayedStepNumber}
        totalSteps={steps.length}
        sectionTitle="Tutorial Progress"
        steps={progressSteps}
      />
      <div className={styles.progressSteps}>
        <div className={styles.steps}>
          {steps.map((step) => {
            const status = getStepStatus(step.id)
            const isCurrentStep = step.stepNumber === currentStepNumber
            return (
              <div
                key={step.id}
                className={`${styles.stepContainer} ${styles[status]} ${isCurrentStep ? styles.current : ""}`}
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
                  <div className={styles.stepIndicator}>{status === "completed" ? "✓" : step.stepNumber}</div>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <div className={styles.chevron} aria-hidden="true" />
                </button>

                {expandedStep === step.id && (
                  <div className={styles.stepDetails}>
                    <div className={styles.stepProgress}>{renderSubSteps(step.id as StepId)}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.sectionTitle}>Configuration Status</h3>

        {/* Source Chain Status */}
        <div className={styles.chainBlock}>
          <div className={styles.chainHeader}>
            <div className={styles.chainIdentity}>
              <div className={styles.chainLogo}>
                {mainState.sourceNetwork?.logo ? (
                  <img
                    src={mainState.sourceNetwork.logo}
                    alt={mainState.sourceNetwork.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : null}
              </div>
              <div className={styles.chainName}>{mainState.sourceNetwork?.name || "Source Chain"}</div>
            </div>
          </div>
          <div className={styles.chainConfigs}>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Chain Selector</div>
              <div className={styles.statusValue}>
                {mainState.sourceNetwork?.chainSelector ? (
                  <div className={styles.statusValueWithAddress}>
                    <span className={styles.statusCheck}>✓</span>
                    <ChainSelectorDisplay selector={mainState.sourceNetwork.chainSelector} />
                  </div>
                ) : (
                  <span className={styles.statusPending}>Not Available</span>
                )}
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Token</div>
              <div className={styles.statusValue}>
                {mainState.sourceContracts.token ? (
                  <div className={styles.statusValueWithAddress}>
                    <span className={styles.statusCheck}>✓</span>
                    <ContractAddressDisplay address={mainState.sourceContracts.token} />
                  </div>
                ) : (
                  <span className={styles.statusPending}>Not Deployed</span>
                )}
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Token Pool</div>
              <div className={styles.statusValue}>
                {mainState.sourceContracts.tokenPool ? (
                  <div className={styles.statusValueWithAddress}>
                    <span className={styles.statusCheck}>✓</span>
                    <ContractAddressDisplay address={mainState.sourceContracts.tokenPool} />
                  </div>
                ) : (
                  <span className={styles.statusPending}>Not Deployed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Destination Chain Status */}
        <div className={styles.chainBlock}>
          <div className={styles.chainHeader}>
            <div className={styles.chainIdentity}>
              <div className={styles.chainLogo}>
                {mainState.destinationNetwork?.logo ? (
                  <img
                    src={mainState.destinationNetwork.logo}
                    alt={mainState.destinationNetwork.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : null}
              </div>
              <div className={styles.chainName}>{mainState.destinationNetwork?.name || "Destination Chain"}</div>
            </div>
          </div>
          <div className={styles.chainConfigs}>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Chain Selector</div>
              <div className={styles.statusValue}>
                {mainState.destinationNetwork?.chainSelector ? (
                  <div className={styles.statusValueWithAddress}>
                    <span className={styles.statusCheck}>✓</span>
                    <ChainSelectorDisplay selector={mainState.destinationNetwork.chainSelector} />
                  </div>
                ) : (
                  <span className={styles.statusPending}>Not Available</span>
                )}
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Token</div>
              <div className={styles.statusValue}>
                {mainState.destinationContracts.token ? (
                  <div className={styles.statusValueWithAddress}>
                    <span className={styles.statusCheck}>✓</span>
                    <ContractAddressDisplay address={mainState.destinationContracts.token} />
                  </div>
                ) : (
                  <span className={styles.statusPending}>Not Deployed</span>
                )}
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Token Pool</div>
              <div className={styles.statusValue}>
                {mainState.destinationContracts.tokenPool ? (
                  <div className={styles.statusValueWithAddress}>
                    <span className={styles.statusCheck}>✓</span>
                    <ContractAddressDisplay address={mainState.destinationContracts.tokenPool} />
                  </div>
                ) : (
                  <span className={styles.statusPending}>Not Deployed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
