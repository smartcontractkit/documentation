import styles from "./TutorialStep.module.css"

interface TutorialStepProps {
  title: string
  children: React.ReactNode
}

export const TutorialStep = ({ title, children }: TutorialStepProps) => (
  <li className={styles.step}>
    <div className={styles.stepHeader}>
      <span className={styles.stepTitle}>{title}</span>
    </div>
    <div className={styles.stepContent}>{children}</div>
  </li>
)
