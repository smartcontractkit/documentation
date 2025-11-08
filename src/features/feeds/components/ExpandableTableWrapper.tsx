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
  scrollable?: boolean
  children: preact.ComponentChildren
}

export const ExpandableTableWrapper = ({
  title,
  description,
  allowExpansion = false,
  defaultExpanded = true,
  scrollable = false,
  children,
}: ExpandableTableWrapperProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // If expansion is not allowed, still wrap content but without the header
  if (!allowExpansion) {
    return <div className={clsx(tableStyles.tableContainer, scrollable && tableStyles.scrollableTable)}>{children}</div>
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={clsx(tableStyles.expandableWrapper, !isExpanded && tableStyles.expandableWrapperCollapsed)}
      onClick={(e) => {
        // If expanded and clicking anywhere in the wrapper (not inside interactive elements)
        if (isExpanded && e.target === e.currentTarget) {
          handleToggle()
        }
      }}
    >
      <div
        className={tableStyles.expandableHeader}
        onClick={handleToggle}
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

      {isExpanded && (
        <div className={clsx(tableStyles.tableContainer, scrollable && tableStyles.scrollableTable)}>{children}</div>
      )}
    </div>
  )
}
