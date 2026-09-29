/**
 * Utility functions for changelog filter management
 */

/**
 * Parse URL parameters to extract filter state
 */
export function parseURLParams(): {
  products: string[]
  networks: string[]
  types: string[]
  searchTerm: string
  searchExpanded: boolean
} {
  if (typeof window === "undefined") {
    return {
      products: [],
      networks: [],
      types: [],
      searchTerm: "",
      searchExpanded: false,
    }
  }

  const params = new URLSearchParams(window.location.search)
  const productParam = params.get("product")
  const networkParam = params.get("network")
  const typeParam = params.get("type")
  const searchParam = params.get("*")

  return {
    products: productParam ? productParam.split(",") : [],
    networks: networkParam ? networkParam.split(",") : [],
    types: typeParam ? typeParam.split(",") : [],
    searchTerm: searchParam || "",
    searchExpanded: !!searchParam,
  }
}

/**
 * Build URL search parameters from filter state
 */
export function buildFilterURL(
  products: string[],
  networks: string[],
  types: string[],
  searchTerm: string
): URLSearchParams {
  const params = new URLSearchParams()

  if (searchTerm) {
    params.set("*", searchTerm)
  } else {
    if (products.length > 0) {
      params.set("product", products.join(","))
    }
    if (networks.length > 0) {
      params.set("network", networks.join(","))
    }
    if (types.length > 0) {
      params.set("type", types.join(","))
    }
  }

  return params
}

/**
 * Update browser URL with filter parameters
 */
export function updateFilterURL(products: string[], networks: string[], types: string[], searchTerm: string): void {
  if (typeof window === "undefined") return

  const params = buildFilterURL(products, networks, types, searchTerm)
  const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname

  window.history.replaceState({}, "", newURL)
}

/**
 * Toggle an item in an array (add if not present, remove if present)
 */
export function toggleItemInArray<T>(array: T[], item: T): T[] {
  return array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
}
