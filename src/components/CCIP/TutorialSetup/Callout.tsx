import { ReactNode } from "react"
import infoIcon from "@components/Alert/Assets/info-icon.svg"
import styles from "./Callout.module.css"

interface CalloutProps {
  type?: "note" | "tip" | "caution" | "danger"
  children: ReactNode
}

export const Callout = ({ type = "note", children }: CalloutProps) => (
  <div className={`${styles.callout} ${styles[type]}`}>
    <div className={styles.icon}>
      <img src={infoIcon.src} alt={type} width={24} height={24} />
    </div>
    <div className={styles.content}>
      <div className={styles.title}>{type.toUpperCase()}</div>
      <div className={styles.message}>{children}</div>
    </div>
  </div>
)
