import styles from "./AiBadge.module.css"

interface AiBadgeProps {
  className?: string
}

export function AiBadge({ className }: AiBadgeProps) {
  return (
    <span className={`${styles.badge} ${className || ""}`} aria-label="Includes AI features">
      <svg
        className={styles.sparkle}
        width="8"
        height="8"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.06 2.06L13 0L13.94 2.06L16 3L13.94 3.94L13 6L12.06 3.94L10 3L12.06 2.06ZM4.47 7.47L6.5 3L8.53 7.47L13 9.5L8.53 11.53L6.5 16L4.47 11.53L0 9.5L4.47 7.47Z"
          fill="currentColor"
        />
      </svg>
      AI
    </span>
  )
}
