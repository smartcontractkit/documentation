import { updateStepProgress, type StepId, TUTORIAL_STEPS, subscribeToStepProgress } from "@stores/lanes"
import { useCallback, memo, useMemo, useEffect, useRef } from "react"

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

// Controlled checkbox component that manages its own animation state
const StepCheckboxBase = <T extends StepId>({ stepId, subStepId, label, onChange }: StepCheckboxProps<T>) => {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const isAnimating = useRef(false)
  const isUserAction = useRef(false)
  const currentValue = useRef<boolean>(false)

  // Subscribe to store changes with proper filtering
  useEffect(() => {
    const unsubscribe = subscribeToStepProgress(stepId, (progress) => {
      const newValue = progress[subStepId] ?? false

      // Skip update if value hasn't changed
      if (newValue === currentValue.current) {
        return
      }
      currentValue.current = newValue

      // Only update DOM directly if it's not a user action
      if (!isUserAction.current && checkboxRef.current) {
        checkboxRef.current.checked = newValue
        if (newValue && !isAnimating.current) {
          isAnimating.current = true
          checkboxRef.current.parentElement?.classList.add("animating")
          setTimeout(() => {
            if (checkboxRef.current?.parentElement) {
              checkboxRef.current.parentElement.classList.remove("animating")
              isAnimating.current = false
            }
          }, 300)
        }
      }
      isUserAction.current = false
    })
    return unsubscribe
  }, [stepId, subStepId])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked
      isUserAction.current = true
      currentValue.current = newValue

      if (process.env.NODE_ENV === "development") {
        console.log(`[CheckboxChange] ${stepId}.${subStepId}:`, {
          newValue,
          timestamp: new Date().toISOString(),
        })
      }

      // Start animation if checked
      if (newValue) {
        isAnimating.current = true
        e.target.parentElement?.classList.add("animating")
        setTimeout(() => {
          if (checkboxRef.current?.parentElement) {
            checkboxRef.current.parentElement.classList.remove("animating")
            isAnimating.current = false
          }
        }, 300)
      }

      // Update store
      if (onChange) {
        onChange(newValue)
      } else {
        updateStepProgress(stepId.toString(), subStepId.toString(), newValue)
      }
    },
    [onChange, stepId, subStepId]
  )

  const ariaLabel = useMemo(
    () => `Mark ${label || TUTORIAL_STEPS[stepId]?.subSteps?.[subStepId as string] || subStepId} as complete`,
    [label, stepId, subStepId]
  )

  const displayLabel = useMemo(
    () => label || TUTORIAL_STEPS[stepId]?.subSteps?.[subStepId as string] || subStepId,
    [label, stepId, subStepId]
  )

  return (
    <div className="step-checkbox">
      <label>
        <input
          ref={checkboxRef}
          type="checkbox"
          defaultChecked={false}
          onChange={handleChange}
          aria-label={ariaLabel}
        />
        <span>{displayLabel}</span>
      </label>
    </div>
  )
}

// Memoized version with prop comparison
export const StepCheckbox = memo(StepCheckboxBase, (prev, next) => {
  return (
    prev.stepId === next.stepId &&
    prev.subStepId === next.subStepId &&
    prev.label === next.label &&
    prev.onChange === next.onChange
  )
})
