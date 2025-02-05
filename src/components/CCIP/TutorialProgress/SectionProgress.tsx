import styles from "./SectionProgress.module.css"
import { navigateToStep, type StepId } from "@stores/lanes"
import { useMemo } from "react"

interface SectionProgressProps {
  currentStep: number
  totalSteps: number
  sectionTitle: string
  steps: Array<{ id: StepId; stepNumber: number; status: string }>
}

export const SectionProgress = ({ currentStep, totalSteps, sectionTitle, steps }: SectionProgressProps) => {
  const segments = useMemo(() => {
    return steps.map((step) => ({
      ...step,
      width: (1 / totalSteps) * 100,
      isActive: step.stepNumber === currentStep,
    }))
  }, [steps, currentStep, totalSteps])

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <h3 className={styles.sectionTitle}>{sectionTitle}</h3>
        <span className={styles.stepCount}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className={styles.progressBar} role="navigation" aria-label="Tutorial steps">
        {segments.map((segment) => (
          <button
            key={segment.id}
            className={`${styles.progressSegment} ${styles[segment.status]} ${segment.isActive ? styles.active : ""}`}
            style={{ width: `${segment.width}%` }}
            onClick={() => navigateToStep(segment.id)}
            aria-label={`Go to step ${segment.stepNumber}`}
            aria-current={segment.isActive ? "step" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
