import styles from "./SectionProgress.module.css"

interface SectionProgressProps {
  currentStep: number
  totalSteps: number
  sectionTitle: string
}

export const SectionProgress = ({ currentStep, totalSteps, sectionTitle }: SectionProgressProps) => (
  <div className={styles.progressContainer}>
    <div className={styles.progressHeader}>
      <h3 className={styles.sectionTitle}>{sectionTitle}</h3>
      <span className={styles.stepCount}>
        Step {currentStep} of {totalSteps}
      </span>
    </div>
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
    </div>
  </div>
)
