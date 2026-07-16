import type { ReactNode } from "react"
import styles from "./GitHubCard.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { cardIcons, type CardIconName } from "./icons/index.js"

type GitHubCardProps = {
  title: string
  href: string
  icon?: ReactNode
  iconName?: CardIconName | string
  children?: ReactNode
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">

export function GitHubCard({ title, href, icon, iconName, children, className, ...props }: GitHubCardProps) {
  const iconFromName = iconName ? cardIcons[iconName as CardIconName] : undefined
  const resolvedIcon = icon ?? (iconFromName ? <img src={iconFromName.src} alt="" aria-hidden="true" /> : null)

  return (
    <a href={href} className={clsx(styles.card, className)} {...props}>
      {resolvedIcon ? <span className={styles.icon}>{resolvedIcon}</span> : null}
      <span className={styles.content}>
        <span className={styles.title} title={title}>
          {title}
        </span>
        {children ? <span className={styles.description}>{children}</span> : null}
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  )
}
