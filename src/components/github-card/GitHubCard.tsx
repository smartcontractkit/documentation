import type { ReactNode } from "react"
import styles from "./GitHubCard.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { cardIcons, type CardIconName } from "./icons/index.js"

type GitHubCardProps = {
  title: string
  href: string
  icon?: ReactNode
  iconName?: CardIconName | string
  /** Short label shown as a pill after the title, e.g. "New". */
  badge?: string
  children?: ReactNode
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">

export function GitHubCard({ title, href, icon, iconName, badge, children, className, ...props }: GitHubCardProps) {
  const iconFromName = iconName ? cardIcons[iconName as CardIconName] : undefined
  const resolvedIcon = icon ?? (iconFromName ? <img src={iconFromName.src} alt="" aria-hidden="true" /> : null)
  const titleElement = (
    <span className={styles.title} title={title}>
      {title}
    </span>
  )

  return (
    <a href={href} className={clsx(styles.card, className)} {...props}>
      {resolvedIcon ? <span className={styles.icon}>{resolvedIcon}</span> : null}
      <span className={styles.content}>
        {badge ? (
          <span className={styles.titleRow}>
            {titleElement}
            <span className={styles.badge}>{badge}</span>
          </span>
        ) : (
          titleElement
        )}
        {children ? <span className={styles.description}>{children}</span> : null}
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  )
}
