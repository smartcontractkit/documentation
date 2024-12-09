import { ReactNode } from "react"
import infoIcon from "@components/Alert/Assets/info-icon.svg"
import styles from "./Callout.module.css"

interface CalloutProps {
  type?: "note" | "tip" | "caution" | "danger"
  title?: string
  children: ReactNode
  className?: string
}

export const Callout = ({ type = "note", title, children, className }: CalloutProps) => (
  <div className={`${styles.callout} ${styles[type]} ${className || ""}`}>
    <div className={styles.icon}>
      <img src={infoIcon.src} alt={type} width={20} height={20} />
    </div>
    <div className={styles.content}>
      <div className={styles.title}>{title || type.toUpperCase()}</div>
      <div className={styles.message}>{children}</div>
    </div>
  </div>
)
