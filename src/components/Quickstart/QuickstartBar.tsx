import { useCurrentIds } from "../../hooks/currentIds/useCurrentIds"
import styles from "./quickstartBar.module.css"

export const QuickstartBar = () => {
  const { $currentIds } = useCurrentIds()
  const idValues = Object.values($currentIds)
  const hasActiveId = idValues.some((active) => active)
  return <div className={styles.bar} disabled={!hasActiveId} />
}
