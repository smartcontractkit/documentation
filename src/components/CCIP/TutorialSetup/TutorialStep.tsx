import styles from "./TutorialStep.module.css"

interface TutorialStepProps {
  title: string
  children: React.ReactNode
  checkbox?: React.ReactNode
}

export const TutorialStep = ({ title, children, checkbox }: TutorialStepProps) => (
  <li className={styles.step}>
    <div className={styles.stepHeader}>
      <span className={styles.stepTitle}>{title}</span>
      {checkbox && <div className={styles.checkbox}>{checkbox}</div>}
    </div>
    <div className={styles.stepContent}>{children}</div>
  </li>
)
