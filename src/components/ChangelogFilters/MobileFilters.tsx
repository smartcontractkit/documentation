import { SvgSearch, SvgTaillessArrowDownSmall, SvgX } from "@chainlink/blocks"
import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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

interface MobileFiltersButtonProps {
  totalCount: number
  onClick: () => void
}

const MobileFiltersButton = ({ totalCount, onClick }: MobileFiltersButtonProps) => {
  return (
    <button className={styles.mobileFiltersBtn} onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.5 5h15M5 10h10M7.5 15h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {totalCount > 0 && <span className={styles.mobileBadge}>{totalCount}</span>}
    </button>
  )
}

interface FilterSectionProps {
  title: string
  count: number
  isExpanded: boolean
  options: string[]
  selectedValues: string[]
  onToggle: () => void
  onSelect: (value: string) => void
  onClearAll: () => void
}

const FilterSection = ({
  title,
  count,
  isExpanded,
  options,
  selectedValues,
  onToggle,
  onSelect,
  onClearAll,
}: FilterSectionProps) => {
  return (
    <div className={styles.filterSection}>
      <button className={styles.filterSectionHeader} onClick={onToggle}>
        <div className={styles.filterSectionTitle}>
          {title}
          {count > 0 && (
            <span className={styles.filterSectionCount}>
              {count}{" "}
              <SvgX
                height={10}
                width={10}
                color="input-muted-more"
                onClick={(e) => {
                  e.stopPropagation()
                  onClearAll()
                }}
              />
            </span>
          )}
        </div>
        <SvgTaillessArrowDownSmall
          color="pill-active"
          className={clsx(styles.filterSectionChevron, isExpanded && styles.filterSectionChevronOpen)}
        />
      </button>
      {isExpanded && (
        <div className={styles.filterSectionContent}>
          {options.map((option) => (
            <FilterPill
              key={option}
              label={option}
              isSelected={selectedValues.includes(option)}
              onClick={() => onSelect(option)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface MobileFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  products: string[]
  networks: string[]
  types: string[]
  selectedProducts: string[]
  selectedNetworks: string[]
  selectedTypes: string[]
  onSelectProduct: (value: string) => void
  onSelectNetwork: (value: string) => void
  onSelectType: (value: string) => void
  onClearAll: () => void
  expandedSection: FilterType
  onToggleSection: (section: FilterType) => void
  onClearProducts: () => void
  onClearNetworks: () => void
  onClearTypes: () => void
}

const MobileFiltersModal = ({
  isOpen,
  onClose,
  products,
  networks,
  types,
  selectedProducts,
  selectedNetworks,
  selectedTypes,
  onSelectProduct,
  onSelectNetwork,
  onSelectType,
  onClearAll,
  expandedSection,
  onToggleSection,
  onClearProducts,
  onClearNetworks,
  onClearTypes,
}: MobileFiltersModalProps) => {
  if (!isOpen) return null

  return (
    <>
      <div className={styles.mobileModalBackdrop} onClick={onClose} />
      <div className={styles.mobileModal}>
        <div className={styles.mobileModalHeader}>
          <h3 className={styles.mobileModalTitle}>Filters</h3>
          <button className={styles.mobileModalClose} onClick={onClose}>
            <SvgX color="pill-active" />
          </button>
        </div>
        <div className={styles.mobileModalBody}>
          <FilterSection
            title="Product"
            count={selectedProducts.length}
            isExpanded={expandedSection === "product"}
            options={products}
            selectedValues={selectedProducts}
            onToggle={() => onToggleSection(expandedSection === "product" ? null : "product")}
            onSelect={onSelectProduct}
            onClearAll={onClearProducts}
          />
          <FilterSection
            title="Network"
            count={selectedNetworks.length}
            isExpanded={expandedSection === "network"}
            options={networks}
            selectedValues={selectedNetworks}
            onToggle={() => onToggleSection(expandedSection === "network" ? null : "network")}
            onSelect={onSelectNetwork}
            onClearAll={onClearNetworks}
          />
          <FilterSection
            title="Type"
            count={selectedTypes.length}
            isExpanded={expandedSection === "type"}
            options={types}
            selectedValues={selectedTypes}
            onToggle={() => onToggleSection(expandedSection === "type" ? null : "type")}
            onSelect={onSelectType}
            onClearAll={onClearTypes}
          />
        </div>
        <div className={styles.mobileModalFooter}>
          <button className={styles.mobileModalClearAll} onClick={onClearAll}>
            Clear All
          </button>
          <button className={styles.mobileModalApply} onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </>
  )
}

interface MobileFiltersProps {
  products: string[]
  networks: string[]
  types: string[]
  items: ChangelogItem[]
  searchExpanded: boolean
  onSearchExpandedChange: (expanded: boolean) => void
}

export const MobileFilters = ({
  products,
  networks,
  types,
  items,
  searchExpanded,
  onSearchExpandedChange,
}: MobileFiltersProps) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<FilterType>(null)

  const {
    searchTerm,
    selectedProducts,
    selectedNetworks,
    selectedTypes,
    handleSearchChange,
    toggleSelection,
    clearProductFilters,
    clearNetworkFilters,
    clearTypeFilters,
    clearAllFilters,
  } = useChangelogFilters({ items })

  const totalFilterCount = selectedProducts.length + selectedNetworks.length + selectedTypes.length

  // Disable body scroll when mobile modal is open
  useEffect(() => {
    if (typeof window === "undefined") return

    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileFiltersOpen])

  const modalContent = (
    <MobileFiltersModal
      isOpen={isMobileFiltersOpen}
      onClose={() => setIsMobileFiltersOpen(false)}
      products={products}
      networks={networks}
      types={types}
      selectedProducts={selectedProducts}
      selectedNetworks={selectedNetworks}
      selectedTypes={selectedTypes}
      onSelectProduct={(value) => toggleSelection("product", value)}
      onSelectNetwork={(value) => toggleSelection("network", value)}
      onSelectType={(value) => toggleSelection("type", value)}
      onClearAll={clearAllFilters}
      expandedSection={expandedSection}
      onToggleSection={setExpandedSection}
      onClearProducts={clearProductFilters}
      onClearNetworks={clearNetworkFilters}
      onClearTypes={clearTypeFilters}
    />
  )

  return (
    <>
      <div className={clsx(styles.content, searchExpanded && styles.searchExpanded)}>
        <MobileFiltersButton totalCount={totalFilterCount} onClick={() => setIsMobileFiltersOpen(true)} />
        <SearchInput
          isExpanded={searchExpanded}
          onClick={onSearchExpandedChange}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  )
}
