import { CaretIcon } from "../CaretIcon"
import styles from "./trigger.module.css"

type Props = {
  icon?: string
  label: string
  className?: string
}
export const Trigger = ({ icon, label, className }: Props) => (
  <div style={{ display: "flex" }} className={className}>
    <span className={styles.trigger}>
      {icon && <img height={20} width={20} src={icon} />}
      {label}
      <div className={styles.caretContainer}>
        <CaretIcon aria-hidden />
      </div>
    </span>
  </div>
)
