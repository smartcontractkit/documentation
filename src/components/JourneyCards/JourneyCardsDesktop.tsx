import { useState, useMemo, useEffect } from "react"
import { Typography, Tag } from "@chainlink/blocks"
import styles from "./JourneyCardsDesktop.module.css"
import { ProductFilterDropdown } from "./ProductFilterDropdown.tsx"
import { PaginationControls } from "./PaginationControls.tsx"

export interface JourneyItem {
  title: string
  description: string
  badge: string
  href: string
}

export interface JourneyColumn {
  title: string
  items: JourneyItem[]
}

interface JourneyCardsDesktopProps {
  columns: JourneyColumn[]
}

// Product filter options
const PRODUCT_FILTERS = [
  { label: "All Products", value: "all" },
  { label: "Automation", value: "automation" },
  { label: "CCIP", value: "ccip" },
  { label: "CRE", value: "cre" },
  { label: "DataLink", value: "datalink" },
  { label: "Data Feeds", value: "data feeds" },
  { label: "Data Streams", value: "data streams" },
  { label: "DTA", value: "dta" },
  { label: "Functions", value: "functions" },
  { label: "VRF", value: "vrf" },
]

type ProductFilterValue = (typeof PRODUCT_FILTERS)[number]["value"]

// Validate badge values against expected product types
const VALID_BADGE_VALUES = new Set([
  "automation",
  "ccip",
  "cre",
  "datalink",
  "data feeds",
  "data streams",
  "dta",
  "functions",
  "vrf",
])

function validateBadge(badge: string): boolean {
  return VALID_BADGE_VALUES.has(badge)
}

const ITEMS_PER_PAGE = 4

export const JourneyCardsDesktop = ({ columns }: JourneyCardsDesktopProps) => {
  const [selectedFilters, setSelectedFilters] = useState<ProductFilterValue[]>(["all"])
  const [currentPage, setCurrentPage] = useState(0)

  // Filter columns based on selected products
  const filteredColumns = useMemo(() => {
    // If "all" is selected or no filters selected, show all items
    if (selectedFilters.includes("all") || selectedFilters.length === 0) {
      return columns
    }

    return columns
      .map((column) => ({
        ...column,
        items: column.items.filter((item) => {
          // Validate badge value
          if (!validateBadge(item.badge)) {
            console.warn(`Invalid badge value: ${item.badge}`)
            return false
          }
          // Show item if it matches ANY of the selected filters (OR logic)
          return selectedFilters.some((filter) => item.badge.toLowerCase() === filter.toLowerCase())
        }),
      }))
      .filter((column) => column.items.length > 0) // Hide columns with no matching cards
  }, [columns, selectedFilters])

  // Transform columns to rows (row-based layout) with pagination
  const rows = useMemo(() => {
    if (filteredColumns.length === 0) return []

    const maxItems = Math.max(...filteredColumns.map((col) => col.items.length))
    const maxPage = Math.max(0, Math.ceil(maxItems / ITEMS_PER_PAGE) - 1)

    // Clamp currentPage to valid bounds to prevent flash of empty content
    const validPage = Math.min(currentPage, maxPage)

    const startIndex = validPage * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Slice items from each column based on current page
    const paginatedColumns = filteredColumns.map((col) => ({
      ...col,
      items: col.items.slice(startIndex, endIndex),
    }))

    const maxPaginatedItems = Math.max(...paginatedColumns.map((col) => col.items.length))
    return Array.from({ length: maxPaginatedItems }, (_, rowIndex) => ({
      id: `row-${rowIndex}`,
      items: paginatedColumns.map((col) => col.items[rowIndex]).filter(Boolean),
    }))
  }, [filteredColumns, currentPage])

  // Calculate total pages based on max items across all columns
  const totalPages = useMemo(() => {
    if (filteredColumns.length === 0) return 0
    const maxItems = Math.max(...filteredColumns.map((col) => col.items.length))
    return Math.ceil(maxItems / ITEMS_PER_PAGE)
  }, [filteredColumns])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [filteredColumns])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Start your Chainlink journey
        </Typography>
        <div className={styles.filterWrapper}>
          <ProductFilterDropdown
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
            options={PRODUCT_FILTERS}
          />
        </div>
      </div>

      {filteredColumns.length > 0 ? (
        <div className={styles.journeyRows}>
          <div className={styles.journeyRow}>
            {filteredColumns.map((column) => (
              <header key={column.title} className={styles.columnHeader}>
                <Typography variant="h5" className={styles.columnTitle}>
                  {column.title}
                </Typography>
              </header>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.id} className={styles.journeyRow}>
              {row.items.map((item) => (
                <a key={item.href} href={item.href} className={styles.journeyCard}>
                  <div className={styles.cardContent}>
                    <Typography variant="body-semi">{item.title}</Typography>
                    <Typography variant="body-s" color="muted">
                      {item.description}
                    </Typography>
                  </div>

                  <footer className={styles.journeyFooter}>
                    <Tag size="sm" className={styles.footerTag}>
                      <Typography variant="code-s">{item.badge}</Typography>
                    </Tag>
                    <img src="/assets/icons/upper-right-arrow.svg" className={styles.footerIcon} alt="" />
                  </footer>
                </a>
              ))}
            </div>
          ))}

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            containerClassName={styles.paginationControls}
            buttonClassName={styles.paginationButton}
          />
        </div>
      ) : (
        <div className={styles.noResults}>
          <Typography variant="body" color="muted">
            No journey cards match the selected filter.
          </Typography>
        </div>
      )}
    </div>
  )
}
