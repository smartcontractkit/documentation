import { ReactNode } from "react"
import styles from "./SetupSection.module.css"
import { StepCheckbox } from "../TutorialProgress/StepCheckbox"
import type { StepId, SubStepId } from "@stores/lanes"

interface SetupSectionProps {
  title: string
  description?: string
  children: ReactNode
  checkbox?: {
    stepId: StepId
    subStepId: SubStepId<StepId>
  }
}

export const SetupSection = ({ title, description, children, checkbox }: SetupSectionProps) => {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h4>{title}</h4>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {checkbox && (
          <div className={styles.headerActions}>
            <StepCheckbox stepId={checkbox.stepId} subStepId={checkbox.subStepId} />
          </div>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
