import { SubStep } from "./types"

interface SubStepTrackerProps {
  steps: SubStep[]
  onComplete: (stepId: string, completed: boolean) => void
}

export const SubStepTracker = ({ steps, onComplete }: SubStepTrackerProps) => {
  return (
    <div className="substep-list">
      {steps.map((step) => (
        <div key={step.id} className={`substep ${step.completed ? "completed" : ""}`}>
          <label className="substep-checkbox">
            <input type="checkbox" checked={step.completed} onChange={(e) => onComplete(step.id, e.target.checked)} />
            <span className="checkmark">✓</span>
          </label>
          <span className="substep-title">{step.title}</span>
        </div>
      ))}
    </div>
  )
}
