/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { useState, useRef, useEffect } from "react"
import { selectedChainType, setChainType } from "~/stores/chainType.js"
import { CHAIN_TYPE_CONFIGS, CCIP_SUPPORTED_CHAINS } from "~/config/chainTypes.js"
import { CCIP_SIDEBAR_CONTENT } from "~/config/sidebar/ccip-dynamic.js"
import { findEquivalentPageUrlWithFallback } from "~/utils/chainNavigation.js"
import type { ChainType } from "~/config/types.js"
import styles from "./ChainTypeSelector.module.css"

/**
 * Chain Type Dropdown Selector Component
 *
 * Allows users to filter CCIP documentation by blockchain type (EVM, Solana, Aptos).
 * Uses a dropdown design that scales well with many chain types.
 *
 * Features:
 * - Scalable dropdown design (works with 10+ chains)
 * - Smart navigation: automatically switches to equivalent page for selected chain
 * - Sidebar-driven: uses sidebar config as source of truth for navigation
 * - Reactive UI based on nanostore state
 * - Google Analytics tracking
 * - Keyboard accessible (ARIA compliant)
 * - Click-outside to close
 * - Mobile responsive
 *
 * Behavior:
 * - If equivalent page exists for target chain → Navigate to it
 * - If no equivalent page → Update filter state only (sidebar filters content)
 */
export function ChainTypeSelector() {
  const activeChain = useStore(selectedChainType)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeConfig = CHAIN_TYPE_CONFIGS[activeChain]

  const handleSelect = (chainType: ChainType) => {
    setIsOpen(false)
    setChainType(chainType)

    // Find target URL with intelligent fallback: exact match → parent → section root
    const targetUrl = findEquivalentPageUrlWithFallback(window.location.pathname, chainType, CCIP_SIDEBAR_CONTENT)

    window.location.href = `/${targetUrl}`
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

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

  return (
    <div className={styles.selector} ref={dropdownRef}>
      <div className={styles.dropdown}>
        <button
          type="button"
          className={styles.dropdownButton}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select blockchain type"
          style={{ "--chain-color": activeConfig.color } as React.CSSProperties}
        >
          <img src={activeConfig.icon} alt="" className={styles.icon} width="20" height="20" aria-hidden="true" />
          <span className={styles.name}>{activeConfig.displayName}</span>
          <svg
            className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
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
          <ul className={styles.dropdownMenu} role="listbox" aria-label="Blockchain options">
            {CCIP_SUPPORTED_CHAINS.map((chainId) => {
              const config = CHAIN_TYPE_CONFIGS[chainId]
              const isActive = activeChain === chainId

              return (
                <li key={chainId} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ""}`}
                    onClick={() => handleSelect(chainId)}
                    style={{ "--chain-color": config.color } as React.CSSProperties}
                    title={config.description}
                  >
                    <img src={config.icon} alt="" className={styles.icon} width="20" height="20" aria-hidden="true" />
                    <span className={styles.name}>{config.displayName}</span>
                    {isActive && (
                      <svg
                        className={styles.checkmark}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
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
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
