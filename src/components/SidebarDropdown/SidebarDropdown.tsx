/** @jsxImportSource react */
import { useState, useRef, useEffect, type ReactNode } from "react"
import styles from "./SidebarDropdown.module.css"

export interface DropdownItem {
  id: string
  label: string
  icon: string
  description?: string
}

interface SidebarDropdownProps {
  label: string
  items: DropdownItem[]
  selectedId: string
  onSelect: (id: string) => void
  triggerId: string
  ariaLabel: string
  rightSlot?: ReactNode
}

/**
 * Generic Sidebar Dropdown Component
 *
 * A reusable dropdown component for sidebar navigation.
 * Handles all UI rendering and interaction logic.
 *
 * Features:
 * - Sticky positioning at top of sidebar
 * - Click-outside to close
 * - Keyboard accessible (ARIA compliant, Escape key)
 * - Mobile responsive
 */
export function SidebarDropdown({
  label,
  items,
  selectedId,
  onSelect,
  triggerId,
  ariaLabel,
  rightSlot,
}: SidebarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((item) => item.id === selectedId)

  const handleSelect = (id: string) => {
    setIsOpen(false)
    onSelect(id)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  if (!selectedItem) {
    return null
  }

  return (
    <div className={styles.selector} ref={dropdownRef}>
      <div className={styles.dropdown}>
        <label className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
        <div className={styles.controlsRow}>
          <div className={styles.triggerWrap}>
            <button
              id={triggerId}
              type="button"
              className={styles.trigger}
              onClick={handleToggle}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-label={ariaLabel}
            >
              <img src={selectedItem.icon} alt={selectedItem.label} className={styles.triggerIcon} />
              <span className={styles.triggerText}>{selectedItem.label}</span>
              <svg className={styles.arrow} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isOpen && (
              <div className={styles.menu}>
                <div className={styles.menuContent}>
                  {items.map((item) => {
                    const isActive = selectedId === item.id

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.option} ${isActive ? styles.selected : ""}`}
                        onClick={() => handleSelect(item.id)}
                        title={item.description}
                      >
                        <img src={item.icon} alt={item.label} className={styles.optionIcon} />
                        <span>{item.label}</span>
                        {isActive && (
                          <svg className={styles.checkmark} width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13.5 4.5L6 12L2.5 8.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {rightSlot ? <div className={styles.rightSlot}>{rightSlot}</div> : null}
        </div>
      </div>
    </div>
  )
}
