import { useStore } from "@nanostores/react"
import {
  laneStore,
  updateStepProgress,
  type StepId,
  type SubStepId,
  TUTORIAL_STEPS,
  setPoolRegistered,
} from "@stores/lanes"

interface StepCheckboxProps<T extends StepId> {
  stepId: T
  subStepId: SubStepId<T>
  label?: string
}

export const StepCheckbox = <T extends StepId>({ stepId, subStepId, label }: StepCheckboxProps<T>) => {
  const state = useStore(laneStore)
  const completed = state.progress[stepId]?.[subStepId as string] ?? false
  const defaultLabel = TUTORIAL_STEPS[stepId]?.subSteps?.[subStepId as string] || subStepId

  if (!TUTORIAL_STEPS[stepId]) {
    return null
  }

  return (
    <div className="step-checkbox">
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => {
            console.log("Checkbox changed:", { stepId, subStepId, checked: e.target.checked })
            updateStepProgress(stepId.toString(), subStepId.toString(), e.target.checked)
            console.log("State after update:", laneStore.get())

            if (stepId === "sourceChain" && subStepId === "pool-registered") {
              setPoolRegistered("source", e.target.checked)
            } else if (stepId === "destinationChain" && subStepId === "dest-pool-registered") {
              setPoolRegistered("destination", e.target.checked)
            }
          }}
        />
        <span>{label || defaultLabel}</span>
      </label>
    </div>
  )
}