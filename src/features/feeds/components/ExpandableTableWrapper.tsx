/** @jsxImportSource preact */

/**
 * ExpandableTableWrapper - Internal component for making tables collapsible
 *
 * DEFAULT BEHAVIOR: Content is always visible with no header (allowExpansion=false)
 *
 * INTERNAL USAGE:
 * <ExpandableTableWrapper
 *   allowExpansion={true}
 *   defaultExpanded={false}
 *   title="Table Title"
 *   description="Expand to view contents"
 * >
 *   {tableContent}
 * </ExpandableTableWrapper>
 */
import { useState } from "preact/hooks"
import { clsx } from "~/lib/clsx/clsx.ts"
import tableStyles from "./Tables.module.css"

interface ExpandableTableWrapperProps {
  title?: string
  description?: string
  allowExpansion?: boolean
  defaultExpanded?: boolean
  children: preact.ComponentChildren
}

export const ExpandableTableWrapper = ({
  title,
  description,
  allowExpansion = false,
  defaultExpanded = true,
  children,
}: ExpandableTableWrapperProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // If expansion is not allowed, always show content without header
  if (!allowExpansion) {
    return <>{children}</>
  }

  return (
    <div>
      <div
        className={tableStyles.expandableHeader}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
          if (e.key === "Escape" && isExpanded) {
            setIsExpanded(false)
          }
        }}
      >
        <div className={tableStyles.expandableHeaderContent}>
          {title && <h2>{title}</h2>}
          {!isExpanded && description && (
            <p className={tableStyles.expandableDescription}>
              <em>{description}</em>
            </p>
          )}
        </div>
        <div className={clsx(tableStyles.expandableArrow, isExpanded && tableStyles.expandableArrowExpanded)} />
      </div>

      {isExpanded && <div className={tableStyles.tableContainer}>{children}</div>}
    </div>
  )
}
