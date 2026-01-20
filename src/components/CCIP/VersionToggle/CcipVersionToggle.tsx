/** @jsxImportSource react */
import { useEffect, useState } from "react"
import styles from "./CcipVersionToggle.module.css"
import { getCcipVersionToggleState, resolveCcipVersionToggleDestination } from "~/utils/ccipVersionToggle.js"

export function CcipVersionToggle() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [state, setState] = useState(() => ({ current: "v2.0" as const, other: "v1.6" as const }))

  useEffect(() => {
    setState(getCcipVersionToggleState(window.location.pathname))
  }, [])

  const onClick = async () => {
    if (isNavigating) return
    setIsNavigating(true)

    try {
      const to = await resolveCcipVersionToggleDestination(window.location.href)
      window.location.href = to
    } finally {
      // If navigation fails for any reason, allow retry.
      setIsNavigating(false)
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onClick}
      disabled={isNavigating}
      aria-label={`Switch CCIP docs version to ${state.other}`}
      title={`Switch to ${state.other}`}
    >
      <span className={styles.pill}>
        <span className={`${styles.segment} ${state.current === "v2.0" ? styles.segmentActive : ""}`}>v2.0</span>
        <span className={styles.divider} />
        <span className={`${styles.segment} ${state.current === "v1.6" ? styles.segmentActive : ""}`}>v1.6</span>
      </span>
    </button>
  )
}

