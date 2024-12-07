import { useStore } from "@nanostores/react"
import { laneStore, updateStepProgress, type StepId, type SubStepId, TUTORIAL_STEPS } from "@stores/lanes"

interface StepCheckboxProps<T extends StepId> {
  stepId: T
  subStepId: SubStepId<T>
  label?: string
}

export const StepCheckbox = <T extends StepId>({ stepId, subStepId, label }: StepCheckboxProps<T>) => {
  const state = useStore(laneStore)
  const completed = state.progress[stepId]?.[subStepId as string]
  const defaultLabel = TUTORIAL_STEPS[stepId]?.subSteps?.[subStepId as string] || subStepId

  if (!TUTORIAL_STEPS[stepId]) {
    console.error(`Missing step configuration for ${stepId}`)
    return null
  }

  return (
    <div className="step-checkbox">
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => updateStepProgress(stepId.toString(), subStepId.toString(), e.target.checked)}
        />
        <span>{label || defaultLabel}</span>
      </label>
    </div>
  )
}
