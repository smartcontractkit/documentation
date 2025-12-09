import { useState, useEffect, useRef } from "react"
import type { ChangelogItem } from "~/components/ChangelogSnippet/types.ts"
import { matchesFilters } from "~/utils/changelogFilters.ts"
import { parseURLParams, updateFilterURL, toggleItemInArray } from "~/utils/changelogFilterUtils.ts"

export interface UseChangelogFiltersProps {
  items: ChangelogItem[]
}

interface FilterState {
  selectedProducts: string[]
  selectedNetworks: string[]
  selectedTypes: string[]
  searchTerm: string
  searchExpanded: boolean
}

export const useChangelogFilters = ({ items }: UseChangelogFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedProducts: [],
    selectedNetworks: [],
    selectedTypes: [],
    searchTerm: "",
    searchExpanded: false,
  })
  const isInitialMount = useRef(true)
  const hasLoadedFromURL = useRef(false)

  // Read URL parameters on mount
  useEffect(() => {
    const urlParams = parseURLParams()

    setFilters({
      selectedProducts: urlParams.products,
      selectedNetworks: urlParams.networks,
      selectedTypes: urlParams.types,
      searchTerm: urlParams.searchTerm,
      searchExpanded: urlParams.searchExpanded,
    })

    hasLoadedFromURL.current = true
  }, [])

  // Update URL when filters change (but not on initial mount)
  useEffect(() => {
    // Skip the first render and the initial load from URL
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Skip if we just loaded from URL
    if (hasLoadedFromURL.current) {
      hasLoadedFromURL.current = false
      return
    }

    updateFilterURL(filters.selectedProducts, filters.selectedNetworks, filters.selectedTypes, filters.searchTerm)
  }, [filters])

  // Filter items and update the display
  useEffect(() => {
    if (typeof window === "undefined") return

    const changelogItems = document.querySelectorAll(".changelog-item")
    const loadMoreSection = document.querySelector(".load-more-section") as HTMLElement
    const visibleCountSpan = document.getElementById("visible-count")
    const emptyState = document.querySelector(".empty-state") as HTMLElement
    const changelogList = document.querySelector(".changelog-list") as HTMLElement

    if (filters.searchTerm) {
      // Search takes priority - filter by search term
      const searchLower = filters.searchTerm.toLowerCase()
      let visibleCount = 0

      changelogItems.forEach((item) => {
        const index = parseInt(item.getAttribute("data-index") || "0")
        const changelogItem = items[index]

        const matchesSearch =
          changelogItem?.name.toLowerCase().includes(searchLower) ||
          changelogItem?.["text-description"]?.toLowerCase().includes(searchLower)

        if (matchesSearch) {
          ;(item as HTMLElement).style.display = ""
          visibleCount++
        } else {
          ;(item as HTMLElement).style.display = "none"
        }
      })

      // Hide load more section when searching
      if (loadMoreSection) {
        loadMoreSection.style.display = "none"
      }

      // Show/hide empty state
      if (emptyState && changelogList) {
        if (visibleCount === 0) {
          emptyState.style.display = "flex"
          changelogList.style.display = "none"
        } else {
          emptyState.style.display = "none"
          changelogList.style.display = "flex"
        }
      }
    } else {
      // Apply filter logic
      let visibleCount = 0
      const hasFilters =
        filters.selectedProducts.length > 0 || filters.selectedNetworks.length > 0 || filters.selectedTypes.length > 0

      changelogItems.forEach((item) => {
        const index = parseInt(item.getAttribute("data-index") || "0")
        const changelogItem = items[index]

        if (hasFilters && changelogItem) {
          const matches = matchesFilters(
            changelogItem,
            filters.selectedProducts,
            filters.selectedNetworks,
            filters.selectedTypes
          )
          if (matches) {
            ;(item as HTMLElement).style.display = ""
            visibleCount++
          } else {
            ;(item as HTMLElement).style.display = "none"
          }
        } else {
          // No filters - show first 25 items by default
          if (visibleCount < 25) {
            ;(item as HTMLElement).style.display = ""
            visibleCount++
          } else {
            ;(item as HTMLElement).style.display = "none"
          }
        }
      })

      // Show/hide load more section based on filters
      if (loadMoreSection) {
        if (hasFilters) {
          loadMoreSection.style.display = "none"
        } else {
          loadMoreSection.style.display = visibleCount >= items.length ? "none" : "flex"
        }
      }

      // Update visible count
      if (visibleCountSpan) {
        visibleCountSpan.textContent = visibleCount.toString()
      }

      // Show/hide empty state
      if (emptyState && changelogList) {
        if (hasFilters && visibleCount === 0) {
          emptyState.style.display = "flex"
          changelogList.style.display = "none"
        } else {
          emptyState.style.display = "none"
          changelogList.style.display = "flex"
        }
      }
    }
  }, [filters, items])

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }))
  }

  const handleSearchToggle = (expanded: boolean) => {
    setFilters((prev) => ({ ...prev, searchExpanded: expanded }))
  }

  const toggleSelection = (type: "product" | "network" | "type", value: string) => {
    setFilters((prev) => {
      switch (type) {
        case "product":
          return { ...prev, selectedProducts: toggleItemInArray(prev.selectedProducts, value) }
        case "network":
          return { ...prev, selectedNetworks: toggleItemInArray(prev.selectedNetworks, value) }
        case "type":
          return { ...prev, selectedTypes: toggleItemInArray(prev.selectedTypes, value) }
        default:
          return prev
      }
    })
  }

  const clearProductFilters = () => {
    setFilters((prev) => ({ ...prev, selectedProducts: [] }))
  }

  const clearNetworkFilters = () => {
    setFilters((prev) => ({ ...prev, selectedNetworks: [] }))
  }

  const clearTypeFilters = () => {
    setFilters((prev) => ({ ...prev, selectedTypes: [] }))
  }

  const clearAllFilters = () => {
    setFilters((prev) => ({ ...prev, selectedProducts: [], selectedNetworks: [], selectedTypes: [] }))
  }

  return {
    searchExpanded: filters.searchExpanded,
    searchTerm: filters.searchTerm,
    selectedProducts: filters.selectedProducts,
    selectedNetworks: filters.selectedNetworks,
    selectedTypes: filters.selectedTypes,
    handleSearchChange,
    handleSearchToggle,
    toggleSelection,
    clearProductFilters,
    clearNetworkFilters,
    clearTypeFilters,
    clearAllFilters,
  }
}
