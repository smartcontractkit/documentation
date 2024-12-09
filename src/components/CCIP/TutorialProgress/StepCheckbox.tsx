import { useStore } from "@nanostores/react"
import { laneStore, updateStepProgress, type StepId, type LaneState, TUTORIAL_STEPS } from "@stores/lanes"
import { useCallback } from "react"

interface StepCheckboxProps<T extends StepId> {
  stepId: T
  subStepId: T extends "sourceChain"
    ? "token-deployed" | "admin-claimed" | "admin-accepted" | "pool-deployed" | "pool-registered"
    : T extends "destinationChain"
    ? "dest-token-deployed" | "admin-claimed" | "admin-accepted" | "dest-pool-deployed" | "dest-pool-registered"
    : string
  label?: string
  onChange?: (checked: boolean) => void
}

export const StepCheckbox = <T extends StepId>({ stepId, subStepId, label, onChange }: StepCheckboxProps<T>) => {
  const state = useStore(laneStore)
  const completed = state.progress[stepId]?.[subStepId as string] ?? false

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked)
      } else {
        updateStepProgress(stepId.toString(), subStepId.toString(), e.target.checked)
      }
    },
    [onChange, stepId, subStepId]
  )

  return (
    <div className="step-checkbox">
      <label>
        <input type="checkbox" checked={completed} onChange={handleChange} />
        <span>{label || TUTORIAL_STEPS[stepId]?.subSteps?.[subStepId as string] || subStepId}</span>
      </label>
    </div>
  )
}
