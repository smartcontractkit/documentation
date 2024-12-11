import { useRef, useState, useEffect } from "react"
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
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.chain === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
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
      )}
    </div>
  )
}
