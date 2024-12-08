import { useState, useRef, useEffect } from "react"
import styles from "./ChainSelect.module.css"
import type { Network } from "@config/data/ccip/types"

interface ChainSelectProps {
  value: string
  onChange: (value: string) => void
  options: Network[]
  placeholder: string
}

export const ChainSelect = ({ value, onChange, options, placeholder }: ChainSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.chain === value)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1))
          break
        case "ArrowUp":
          event.preventDefault()
          setFocusedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "PageDown":
          event.preventDefault()
          setFocusedIndex((prev) => Math.min(prev + 5, options.length - 1))
          break
        case "PageUp":
          event.preventDefault()
          setFocusedIndex((prev) => Math.max(prev - 5, 0))
          break
        case "Home":
          event.preventDefault()
          setFocusedIndex(0)
          break
        case "End":
          event.preventDefault()
          setFocusedIndex(options.length - 1)
          break
        case "Enter":
          if (focusedIndex >= 0) {
            onChange(options[focusedIndex].chain)
            setIsOpen(false)
            setFocusedIndex(-1)
          }
          break
        case "Escape":
          setIsOpen(false)
          setFocusedIndex(-1)
          break
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, options, onChange, focusedIndex])

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[focusedIndex] as HTMLElement
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [focusedIndex, isOpen])

  return (
    <div
      ref={containerRef}
      className={styles.container}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="chain-select-dropdown"
    >
      <button
        className={`${styles.trigger} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selectedOption ? (
          <>
            <img src={selectedOption.logo} alt="" className={styles.chainLogo} />
            <span>{selectedOption.name}</span>
          </>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={styles.arrow}>▾</span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          id="chain-select-dropdown"
          className={styles.dropdown}
          role="listbox"
          aria-label="Select blockchain"
          tabIndex={-1}
        >
          {options.map((option, idx) => (
            <button
              key={option.chain}
              role="option"
              aria-selected={value === option.chain}
              className={`${styles.option} ${value === option.chain ? styles.selected : ""} ${
                focusedIndex === idx ? styles.focused : ""
              }`}
              onClick={() => {
                onChange(option.chain)
                setIsOpen(false)
              }}
              onMouseEnter={() => setFocusedIndex(idx)}
            >
              <img src={option.logo} alt="" className={styles.chainLogo} />
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
