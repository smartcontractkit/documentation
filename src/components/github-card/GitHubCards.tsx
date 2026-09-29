import type { CSSProperties, HTMLAttributes, ReactNode } from "react"
import styles from "./GitHubCards.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"

type GitHubCardsProps = {
  /**
   * Number of columns to lay out the wrapped {@link GitHubCard} children in.
   *
   * Clamped to the range `[1, 4]`. Defaults to `1` (a single-column stack, which
   * is visually equivalent to rendering the cards as standalone full-width rows).
   *
   * On narrow viewports the grid reflows to fewer columns automatically via
   * `auto-fill` + `minmax(250px, ...)`, so the effective column count may be
   * less than `columns` on small screens.
   */
  columns?: number
  children?: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, "className">

export function GitHubCards({ columns, children, className, ...props }: GitHubCardsProps) {
  const cols = Math.min(Math.max(columns ?? 1, 1), 4)

  return (
    <div className={clsx(styles.cards, className)} style={{ "--columns": cols } as CSSProperties} {...props}>
      {children}
    </div>
  )
}
