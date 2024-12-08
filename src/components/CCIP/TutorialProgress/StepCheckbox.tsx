import { useStore } from "@nanostores/react"
import { laneStore, updateStepProgress, type StepId, TUTORIAL_STEPS } from "@stores/lanes"

interface StepCheckboxProps<T extends StepId> {
  stepId: T
  subStepId: keyof (typeof TUTORIAL_STEPS)[T]["subSteps"]
  label?: string
  onChange?: (checked: boolean) => void
}

export const StepCheckbox = <T extends StepId>({ stepId, subStepId, label, onChange }: StepCheckboxProps<T>) => {
  const state = useStore(laneStore)
  const completed = state.progress[stepId]?.[subStepId as string] ?? false

  console.log("StepCheckbox render:", { stepId, subStepId, completed })

  return (
    <div className="step-checkbox">
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => {
            console.log("Checkbox onChange:", { checked: e.target.checked })
            if (onChange) {
              onChange(e.target.checked)
            } else {
              updateStepProgress(stepId.toString(), subStepId.toString(), e.target.checked)
            }
          }}
        />
        <span>{label || TUTORIAL_STEPS[stepId]?.subSteps?.[subStepId as string] || subStepId}</span>
      </label>
    </div>
  )
}
