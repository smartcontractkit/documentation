import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"
import { laneStore, TUTORIAL_STEPS, type StepId } from "@stores/lanes"
import { ChainValue, StoredContractAddress } from "./TutorialBlockchainSelector"
import "./TutorialProgress.css"
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
    { id: "destConfig", title: "Destination Configuration", stepNumber: 5 },
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
    <div className="tutorial-progress-container">
      <div className="progress-tracker">
        <div className="progress-bar" style={{ width: `${(currentStep / 5) * 100}%` }} />
        <div className="steps">
          {steps.map((step) => {
            const status = getStepStatus(step.id)
            return (
              <div key={step.id} className={`step-container ${status}`}>
                <div className={`step ${status}`}>
                  <div className="step-indicator">{status === "completed" ? "✓" : step.stepNumber}</div>
                  <span className="step-title">{step.title}</span>
                  <button className="expand-button" onClick={() => toggleStepDetails(step.id)}>
                    {expandedStep === step.id ? "−" : "+"}
                  </button>
                </div>
                {expandedStep === step.id && (
                  <div className="step-details">
                    <div className="step-progress">
                      {getStepProgress(step.id as StepId).map(({ id, title, completed }) => (
                        <div key={id} className={`substep ${completed ? "completed" : ""}`}>
                          <span className="substep-title">{title}</span>
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

      <div className="configuration-status">
        <h3>Configuration Status</h3>
        <div className="status-grid">
          <StatusItem label="Source Chain" value={<ChainValue type="source" />} isComplete={!!state.sourceChain} />
          <StatusItem
            label="Source Token"
            value={<StoredContractAddress type="token" chain="source" />}
            isComplete={!!state.sourceContracts.token}
          />
          <StatusItem
            label="Source Pool"
            value={<StoredContractAddress type="tokenPool" chain="source" />}
            isComplete={!!state.sourceContracts.tokenPool}
          />
          <StatusItem
            label="Destination Chain"
            value={<ChainValue type="destination" />}
            isComplete={!!state.destinationChain}
          />
          <StatusItem
            label="Destination Token"
            value={<StoredContractAddress type="token" chain="destination" />}
            isComplete={!!state.destinationContracts.token}
          />
          <StatusItem
            label="Destination Pool"
            value={<StoredContractAddress type="tokenPool" chain="destination" />}
            isComplete={!!state.destinationContracts.tokenPool}
          />
        </div>
      </div>
    </div>
  )
}

const StatusItem = ({ label, value, isComplete }) => (
  <div className={`status-item ${isComplete ? "complete" : ""}`}>
    <span className="status-label">{label}</span>
    <div className="status-value">{value}</div>
    {isComplete && <span className="status-check">✓</span>}
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
