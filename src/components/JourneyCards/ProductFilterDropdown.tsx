import { useState, useRef } from "react"
import styles from "./ProductFilterDropdown.module.css"
import { Typography } from "@chainlink/blocks"
import { useClickOutside } from "~/hooks/useClickOutside.tsx"

export interface ProductFilterOption {
  label: string
  value: string
}

interface ProductFilterDropdownProps {
  selectedFilters: string[]
  onFiltersChange: (filters: string[]) => void
  options: ProductFilterOption[]
}

export const ProductFilterDropdown = ({ selectedFilters, onFiltersChange, options }: ProductFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsOpen(false), { enabled: isOpen })

  const handleCheckboxChange = (value: string) => {
    if (value === "all") {
      // When clicking "All Products"
      if (selectedFilters.includes("all")) {
        // If already checked, uncheck it and default to showing all
        onFiltersChange(["all"])
      } else {
        // If not checked, check it and clear all individual selections
        onFiltersChange(["all"])
      }
    } else {
      // Handle individual product selection
      if (selectedFilters.includes("all")) {
        // If "All Products" is currently selected, uncheck it and select only this product
        onFiltersChange([value])
      } else {
        // "All Products" is not selected, toggle the individual product
        if (selectedFilters.includes(value)) {
          // Uncheck the item
          const updated = selectedFilters.filter((f) => f !== value)
          // If no products are selected, default to showing all
          onFiltersChange(updated.length === 0 ? ["all"] : updated)
        } else {
          // Check the item (keep other individual selections)
          onFiltersChange([...selectedFilters, value])
        }
      }
    }
  }

  const isChecked = (value: string) => {
    if (value === "all") {
      return selectedFilters.includes("all")
    }
    // Individual products are only checked if explicitly in the filters array
    // (not when "all" is selected)
    return selectedFilters.includes(value) && !selectedFilters.includes("all")
  }

  // Get the display text for the trigger button
  const getTriggerText = () => {
    // If "All Products" is selected or no filters selected
    if (selectedFilters.includes("all") || selectedFilters.length === 0) {
      return "All Products"
    }

    // If exactly 1 product is selected
    if (selectedFilters.length === 1) {
      const selectedProduct = options.find((filter) => filter.value === selectedFilters[0])
      return selectedProduct?.label || "All Products"
    }

    // If 2 or more products are selected
    return "Multiple Products"
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <Typography variant="body-xs">{getTriggerText()}</Typography>
        <svg
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          {options.map((filter) => (
            <label
              key={filter.value}
              className={styles.checkboxLabel}
              role="option"
              aria-selected={isChecked(filter.value)}
            >
              <input
                type="checkbox"
                checked={isChecked(filter.value)}
                onChange={() => handleCheckboxChange(filter.value)}
                className={styles.checkboxInput}
              />
              <span className={styles.customCheckbox}>
                {isChecked(filter.value) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <Typography variant="body-xs">{filter.label}</Typography>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
