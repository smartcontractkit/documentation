import { ReactNode } from "react"
import infoIcon from "@components/Alert/Assets/info-icon.svg"
import alertIcon from "@components/Alert/Assets/alert-icon.svg"
import dangerIcon from "@components/Alert/Assets/danger-icon.svg"
import styles from "./Callout.module.css"

interface CalloutProps {
  type?: "note" | "tip" | "caution" | "danger"
  title?: string
  children: ReactNode
  className?: string
}

const CALLOUT_ICONS = {
  note: infoIcon,
  tip: infoIcon,
  caution: alertIcon,
  danger: dangerIcon,
} as const

export const Callout = ({ type = "note", title, children, className }: CalloutProps) => {
  return (
    <div className={`${styles.callout} ${styles[type]} ${className || ""}`} aria-label={title}>
      <div className={styles.icon} aria-hidden="true">
        <img
          src={CALLOUT_ICONS[type].src}
          alt={type}
          style={{ width: "1.5em", height: "1.5em" }}
          className={styles.iconImage}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title} aria-hidden="true">
          {title || type.toUpperCase()}
        </div>
        <div className={styles.message}>{children}</div>
      </div>
    </div>
  )
}
