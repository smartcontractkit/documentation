/** @jsxImportSource preact */
import { useState, useRef, useEffect } from "preact/hooks"
import { clsx } from "~/lib/clsx/clsx.ts"
import { Chain } from "~/features/data/chains.ts"
import styles from "./ChainSelector.module.css"

interface ChainSelectorProps {
  chains: Chain[]
  selectedChain: Chain
  onChainSelect: (chain: Chain) => void
  onNetworkTypeChange?: (networkType: "mainnet" | "testnet", chain: Chain) => void
  dataFeedType?: string
  availableNetworkTypes?: { mainnet: boolean; testnet: boolean }
  selectedNetworkType?: "mainnet" | "testnet"
}

export function ChainSelector({
  chains,
  selectedChain,
  onChainSelect,
  onNetworkTypeChange,
  dataFeedType = "default",
  availableNetworkTypes = { mainnet: true, testnet: true },
  selectedNetworkType = "mainnet",
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const chainListRef = useRef<HTMLDivElement>(null)
  const chainOptionsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Filter chains based on dataFeedType and search term
  const filteredChains = chains.filter((chain) => {
    // Filter by dataFeedType first
    const matchesDataFeedType = (() => {
      if (dataFeedType.includes("streams")) return chain.tags?.includes("streams") ?? false
      if (dataFeedType === "smartdata") return chain.tags?.includes("smartData") ?? false
      if (dataFeedType === "rates") return chain.tags?.includes("rates") ?? false
      if (dataFeedType === "usGovernmentMacroeconomicData")
        return chain.tags?.includes("usGovernmentMacroeconomicData") ?? false
      return chain.tags?.includes("default") ?? false
    })()

    // Filter by search term
    const matchesSearch = !searchTerm || chain.label.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDataFeedType && matchesSearch
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
        setFocusedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, focusedIndex, filteredChains])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && chainOptionsRef.current[focusedIndex]) {
      chainOptionsRef.current[focusedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [focusedIndex])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Reset search when opening
      setSearchTerm("")
      setFocusedIndex(-1)
      // Focus search input after a brief delay to ensure it's rendered
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 10)
    }
  }

  const handleChainSelect = (chain: Chain) => {
    onChainSelect(chain)
    setIsOpen(false)
    setSearchTerm("")
    setFocusedIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex((prev) => (prev < filteredChains.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case "PageDown":
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(prev + 5, filteredChains.length - 1))
        break
      case "PageUp":
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 5, 0))
        break
      case "Enter":
        e.preventDefault()
        if (focusedIndex >= 0 && filteredChains[focusedIndex]) {
          handleChainSelect(filteredChains[focusedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setSearchTerm("")
        setFocusedIndex(-1)
        break
    }
  }

  const handleNetworkTypeToggle = (networkType: "mainnet" | "testnet") => {
    // Notify parent component about the network type change
    if (onNetworkTypeChange) {
      onNetworkTypeChange(networkType, selectedChain)
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label} htmlFor="chain-selector-trigger">
        Select network:
      </label>
      <div className={styles.controls}>
        <button
          id="chain-selector-trigger"
          className={styles.trigger}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          type="button"
        >
          <div className={styles.selectedChain}>
            <img
              src={selectedChain.img}
              alt={`${selectedChain.label} icon`}
              className={styles.chainIcon}
              width={28}
              height={28}
            />
            <span className={styles.chainLabel}>{selectedChain.label}</span>
          </div>
          <div className={clsx(styles.caret, isOpen && styles.caretOpen)}>
            <span></span>
          </div>
        </button>

        <div className={styles.networkSwitcher}>
          <button
            type="button"
            className={clsx(
              styles.networkToggle,
              selectedNetworkType === "mainnet" && styles.networkToggleActive,
              !availableNetworkTypes.mainnet && styles.networkToggleDisabled
            )}
            onClick={() => availableNetworkTypes.mainnet && handleNetworkTypeToggle("mainnet")}
            disabled={!availableNetworkTypes.mainnet}
            title={
              !availableNetworkTypes.mainnet ? `${selectedChain.label} feeds are not available on mainnet` : undefined
            }
          >
            Mainnet
          </button>
          <button
            type="button"
            className={clsx(
              styles.networkToggle,
              selectedNetworkType === "testnet" && styles.networkToggleActive,
              !availableNetworkTypes.testnet && styles.networkToggleDisabled
            )}
            onClick={() => availableNetworkTypes.testnet && handleNetworkTypeToggle("testnet")}
            disabled={!availableNetworkTypes.testnet}
            title={
              !availableNetworkTypes.testnet ? `${selectedChain.label} feeds are not available on testnet` : undefined
            }
          >
            Testnet
          </button>
        </div>

        {selectedChain.networkStatusUrl && (
          <a
            href={selectedChain.networkStatusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.networkStatusLink}
            title={`Track ${selectedChain.label} network status`}
          >
            Network Status
            <span className={styles.externalArrow}>↗</span>
          </a>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.dropdownContent}>
            <div className={styles.searchSection}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search chains..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.currentTarget.value)
                  setFocusedIndex(-1)
                }}
                onInput={(e) => {
                  setSearchTerm(e.currentTarget.value)
                  setFocusedIndex(-1)
                }}
                className={styles.searchInput}
              />
              <div className={styles.keyboardInstructions}>
                Use ↑↓ arrow keys, Page Up/Down to navigate • Enter to select • Esc to close
              </div>
            </div>
            <div className={styles.chainList} ref={chainListRef}>
              {filteredChains.map((chain, index) => (
                <button
                  key={chain.page}
                  ref={(el) => {
                    if (!chainOptionsRef.current) chainOptionsRef.current = []
                    chainOptionsRef.current[index] = el
                  }}
                  className={clsx(
                    styles.chainOption,
                    chain.page === selectedChain.page && styles.chainOptionSelected,
                    index === focusedIndex && styles.chainOptionFocused
                  )}
                  onClick={() => handleChainSelect(chain)}
                  role="option"
                  aria-selected={chain.page === selectedChain.page}
                  type="button"
                >
                  <img
                    src={chain.img}
                    alt={`${chain.label} icon`}
                    className={styles.chainIcon}
                    width={20}
                    height={20}
                  />
                  <span className={styles.chainLabel}>{chain.label}</span>
                </button>
              ))}
              {filteredChains.length === 0 && (
                <div className={styles.noResults}>No chains found matching "{searchTerm}"</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
