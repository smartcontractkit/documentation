import { SvgSearch, SvgTaillessArrowDownSmall, SvgX } from "@chainlink/blocks"
import styles from "./styles.module.css"
import { useState, useEffect, useRef } from "react"
import { clsx } from "~/lib/clsx/clsx.ts"
import type { ChangelogItem } from "~/components/ChangelogSnippet/types.ts"
import { useChangelogFilters } from "./useChangelogFilters.ts"

type FilterType = "product" | "network" | "type" | null

interface SearchInputProps {
  isExpanded: boolean
  onClick: (value: boolean) => void
  value: string
  onChange: (value: string) => void
}

const SearchInput = ({ isExpanded, onClick, value, onChange }: SearchInputProps) => {
  return (
    <div className={clsx(styles.searchInputWrapper, isExpanded && styles.expanded)} onClick={() => onClick(true)}>
      <SvgSearch className={styles.searchIcon} color="pill-active" />
      <input
        placeholder={!isExpanded ? "Search" : "Search a product, network or type"}
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isExpanded && (
        <SvgX
          color="pill-active"
          onClick={(e) => {
            e.stopPropagation()
            onClick(false)
            onChange("")
          }}
          style={{
            marginRight: "var(--space-4x)",
          }}
        />
      )}
    </div>
  )
}

interface TriggerProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  onClose: () => void
  onClearAll: () => void
}

const Trigger = ({ label, count, isActive, onClick, onClose, onClearAll }: TriggerProps) => {
  return (
    <button className={clsx(styles.btn, isActive && styles.btnActive)} onClick={onClick}>
      <div>
        {label}
        {count > 0 && (
          <span>
            {count}{" "}
            <SvgX
              height={10}
              width={10}
              color="input-muted-more"
              onClick={(e) => {
                e.stopPropagation()
                onClearAll()
              }}
            />{" "}
          </span>
        )}
      </div>{" "}
      {isActive ? (
        <SvgX
          color="pill-active"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          height={10}
          width={10}
        />
      ) : (
        <SvgTaillessArrowDownSmall color="pill-active" />
      )}
    </button>
  )
}

interface FilterPillProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

const FilterPill = ({ label, isSelected, onClick }: FilterPillProps) => {
  return (
    <button
      className={clsx(styles.pill, isSelected && styles.pillSelected)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {label}
      {isSelected && (
        <span>
          <SvgX color="pill-active" width={12} height={12} />
        </span>
      )}
    </button>
  )
}

interface DesktopFiltersProps {
  products: string[]
  networks: string[]
  types: string[]
  items: ChangelogItem[]
}

export const DesktopFilters = ({ products, networks, types, items }: DesktopFiltersProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const {
    searchExpanded,
    searchTerm,
    selectedProducts,
    selectedNetworks,
    selectedTypes,
    handleSearchChange,
    handleSearchToggle,
    toggleSelection,
    clearProductFilters,
    clearNetworkFilters,
    clearTypeFilters,
  } = useChangelogFilters({ items })

  const toggleFilter = (filterType: FilterType) => {
    setActiveFilter(filterType)
  }

  const closeFilter = () => {
    setActiveFilter(null)
  }

  // Close filter when clicking outside
  useEffect(() => {
    if (!activeFilter) return

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closeFilter()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeFilter])

  const getFilterOptions = () => {
    switch (activeFilter) {
      case "product":
        return products
      case "network":
        return networks
      case "type":
        return types
      default:
        return []
    }
  }

  const getSelectedValues = () => {
    switch (activeFilter) {
      case "product":
        return selectedProducts
      case "network":
        return selectedNetworks
      case "type":
        return selectedTypes
      default:
        return []
    }
  }

  return (
    <div ref={wrapperRef}>
      {activeFilter && (
        <div className={styles.expandedContent}>
          {getFilterOptions().map((option) => (
            <FilterPill
              key={option}
              label={option}
              isSelected={getSelectedValues().includes(option)}
              onClick={() => {
                const type = activeFilter as "product" | "network" | "type"
                toggleSelection(type, option)
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.content}>
        {!searchExpanded && (
          <>
            <Trigger
              label="Product"
              count={selectedProducts.length}
              isActive={activeFilter === "product"}
              onClick={() => toggleFilter("product")}
              onClose={closeFilter}
              onClearAll={clearProductFilters}
            />
            <Trigger
              label="Network"
              count={selectedNetworks.length}
              isActive={activeFilter === "network"}
              onClick={() => toggleFilter("network")}
              onClose={closeFilter}
              onClearAll={clearNetworkFilters}
            />
            <Trigger
              label="Type"
              count={selectedTypes.length}
              isActive={activeFilter === "type"}
              onClick={() => toggleFilter("type")}
              onClose={closeFilter}
              onClearAll={clearTypeFilters}
            />
          </>
        )}
        <SearchInput
          isExpanded={searchExpanded}
          onClick={handleSearchToggle}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}
