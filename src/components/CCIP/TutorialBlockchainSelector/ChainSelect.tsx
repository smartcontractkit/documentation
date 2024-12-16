import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "./ChainSelect.module.css"
import type { Network } from "@config/data/ccip/types"

interface ChainSelectProps {
  value: string
  onChange: (value: string) => void
  options: Network[]
  placeholder: string
}

interface DropdownPosition {
  top: number
  left: number
  width: number
}

export const ChainSelect = ({ value, onChange, options, placeholder }: ChainSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.chain === value)

  // Update dropdown position when opening
  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap as per original CSS
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }

  // Update position on open and scroll
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition()
      window.addEventListener("scroll", updateDropdownPosition)
      window.addEventListener("resize", updateDropdownPosition)

      // Scroll selected option into view when dropdown opens
      if (dropdownRef.current && value) {
        requestAnimationFrame(() => {
          const dropdown = dropdownRef.current
          if (!dropdown) return

          const selectedOptionElement = dropdown.querySelector(`.${styles.selected}`) as HTMLElement
          if (selectedOptionElement) {
            // Calculate the dropdown's visible height
            const dropdownHeight = dropdown.clientHeight
            const optionHeight = selectedOptionElement.offsetHeight

            // Scroll the selected option to be in the middle of the dropdown
            const scrollPosition = selectedOptionElement.offsetTop - dropdownHeight / 2 + optionHeight / 2

            dropdown.scrollTo({
              top: Math.max(0, scrollPosition),
              behavior: "instant", // Use 'instant' to prevent visible scrolling when opening
            })
          }
        })
      }
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition)
      window.removeEventListener("resize", updateDropdownPosition)
    }
  }, [isOpen, value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the container and the dropdown
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(event.target as Node)
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target as Node)

      if (isOutsideContainer && isOutsideDropdown) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "PageUp":
          e.preventDefault()
          setFocusedIndex(0)
          break
        case "PageDown":
          e.preventDefault()
          setFocusedIndex(options.length - 1)
          break
        case "Enter":
          e.preventDefault()
          if (focusedIndex >= 0) {
            onChange(options[focusedIndex].chain)
            setIsOpen(false)
            setFocusedIndex(-1)
          }
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          setFocusedIndex(-1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, focusedIndex, options, onChange])

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const options = dropdownRef.current.getElementsByClassName(styles.option)
      const focusedOption = options[focusedIndex] as HTMLElement
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [focusedIndex, isOpen])

  const renderDropdown = () => {
    if (!isOpen || !dropdownPosition) return null

    const dropdown = (
      <div
        ref={dropdownRef}
        className={styles.dropdown}
        style={{
          position: "absolute",
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
        }}
      >
        {options.map((option, idx) => (
          <button
            key={option.chain}
            className={`${styles.option} ${option.chain === value ? styles.selected : ""} ${
              focusedIndex === idx ? styles.focused : ""
            }`}
            onClick={() => {
              onChange(option.chain)
              setIsOpen(false)
              setFocusedIndex(-1)
            }}
            onMouseEnter={() => setFocusedIndex(idx)}
            type="button"
          >
            <img src={option.logo} alt={option.name} className={styles.chainLogo} />
            {option.name}
          </button>
        ))}
      </div>
    )

    return createPortal(dropdown, document.body)
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selectedOption ? (
          <>
            <img src={selectedOption.logo} alt={selectedOption.name} className={styles.chainLogo} />
            {selectedOption.name}
          </>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={styles.arrow}>▼</span>
      </button>

      {renderDropdown()}
    </div>
  )
}
