import styles from "./TutorialCard.module.css"

interface TutorialCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export const TutorialCard = ({ title, description, children }: TutorialCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
