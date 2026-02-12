/**
 * Clean URL parameter management for feed tables
 *
 * Philosophy:
 * - Only add params when they differ from defaults
 * - Keep URL minimal and human-readable
 * - Order params logically: network → type → filters → pagination
 * - Clear related params when context changes (e.g., switching networks)
 */

import { useCallback } from "preact/hooks"

export type FeedUrlParams = {
  // Network selection
  network?: string
  networkType?: "mainnet" | "testnet"

  // Search filters
  search?: string
  testnetSearch?: string

  // Category filters
  categories?: string[]

  // Feature flags
  showSvr?: boolean
  showDetails?: boolean

  // Pagination
  page?: number
  testnetPage?: number

  // Streams-specific filters
  feedType?: string
  testnetFeedType?: string
  schema?: string
  testnetSchema?: string
}

const DEFAULT_VALUES: Required<FeedUrlParams> = {
  network: "",
  networkType: "mainnet",
  search: "",
  testnetSearch: "",
  categories: [],
  showSvr: false,
  showDetails: false,
  page: 1,
  testnetPage: 1,
  feedType: "all",
  testnetFeedType: "all",
  schema: "all",
  testnetSchema: "all",
}

/**
 * Build a clean URL with only non-default parameters
 */
function buildCleanUrl(params: Partial<FeedUrlParams>, pathname: string, hash = ""): string {
  const urlParams = new URLSearchParams()

  // Add params in logical order (network first, then filters, then pagination)
  const orderedKeys: (keyof FeedUrlParams)[] = [
    "network",
    "networkType",
    "search",
    "testnetSearch",
    "categories",
    "showSvr",
    "showDetails",
    "feedType",
    "testnetFeedType",
    "schema",
    "testnetSchema",
    "page",
    "testnetPage",
  ]

  orderedKeys.forEach((key) => {
    const value = params[key]
    const defaultValue = DEFAULT_VALUES[key]

    // Skip if value is undefined or matches default
    if (value === undefined) return

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return // Skip empty arrays
      value.forEach((v) => urlParams.append(key, v))
      return
    }

    // Handle booleans
    if (typeof value === "boolean") {
      if (!value) return // Only add true values
      urlParams.set(key, "true")
      return
    }

    // Handle strings and numbers
    const stringValue = String(value)
    const defaultStringValue = String(defaultValue)

    if (stringValue !== defaultStringValue && stringValue !== "") {
      urlParams.set(key, stringValue)
    }
  })

  const queryString = urlParams.toString()
  return pathname + (queryString ? "?" + queryString : "") + hash
}

/**
 * Parse current URL params into a typed object
 */
function parseUrlParams(initialNetwork?: string): FeedUrlParams {
  if (typeof window === "undefined") {
    return { network: initialNetwork }
  }

  const urlParams = new URLSearchParams(window.location.search)

  return {
    network: urlParams.get("network") || undefined,
    networkType: (urlParams.get("networkType") as "mainnet" | "testnet") || undefined,
    search: urlParams.get("search") || undefined,
    testnetSearch: urlParams.get("testnetSearch") || undefined,
    categories: urlParams.getAll("categories").filter(Boolean),
    showSvr: urlParams.get("showSvr") === "true" || undefined,
    showDetails: urlParams.get("showDetails") === "true" || undefined,
    page: urlParams.get("page") ? parseInt(urlParams.get("page") || "1") : undefined,
    testnetPage: urlParams.get("testnetPage") ? parseInt(urlParams.get("testnetPage") || "1") : undefined,
    feedType: urlParams.get("feedType") || undefined,
    testnetFeedType: urlParams.get("testnetFeedType") || undefined,
    schema: urlParams.get("schema") || undefined,
    testnetSchema: urlParams.get("testnetSchema") || undefined,
  }
}

export function useCleanUrlParams(initialNetwork: string) {
  const updateUrl = useCallback(
    (updates: Partial<FeedUrlParams>, clearRelated = false) => {
      if (typeof window === "undefined") return

      const current = parseUrlParams(initialNetwork)
      let newParams: Partial<FeedUrlParams>

      if (clearRelated) {
        // When clearing related params, start fresh with only the updates
        newParams = { ...updates }
      } else {
        // Merge with existing params
        newParams = { ...current, ...updates }
      }

      const newUrl = buildCleanUrl(newParams, window.location.pathname, window.location.hash)
      window.history.replaceState({ path: newUrl }, "", newUrl)
    },
    [initialNetwork]
  )

  const getCurrentParams = useCallback(() => {
    return parseUrlParams(initialNetwork)
  }, [initialNetwork])

  const clearAllFilters = useCallback(
    (keepNetwork = true) => {
      const newParams: Partial<FeedUrlParams> = {}
      if (keepNetwork) {
        const current = parseUrlParams(initialNetwork)
        if (current.network) newParams.network = current.network
        if (current.networkType) newParams.networkType = current.networkType
      }
      updateUrl(newParams, true)
    },
    [updateUrl, initialNetwork]
  )

  return {
    updateUrl,
    getCurrentParams,
    clearAllFilters,
  }
}
