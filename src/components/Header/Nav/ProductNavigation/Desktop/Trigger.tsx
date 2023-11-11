import { CaretIcon } from "../../CaretIcon"
import styles from "./trigger.module.css"

type Props = {
  icon?: string
  label: string
}
export const Trigger = ({ label }: Props) => (
  <div style={{ display: "flex" }}>
    <span className={styles.trigger}>
      {label}
      <CaretIcon aria-hidden />
    </span>
  </div>
)
