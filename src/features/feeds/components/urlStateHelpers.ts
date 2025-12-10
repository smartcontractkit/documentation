/**
 * URL state management helpers for feed tables
 * Clean up empty and default values from URLs
 */

/**
 * Update URL with only non-empty, non-default values
 * Removes clutter like search=&page=1
 */
export function updateUrlClean(updates: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)

  // Apply updates
  Object.entries(updates).forEach(([key, value]) => {
    // Remove param if undefined, empty string, or default value
    if (
      value === undefined ||
      value === "" ||
      (key === "page" && value === 1) ||
      (key === "page" && value === "1") ||
      (key === "testnetPage" && value === 1) ||
      (key === "testnetPage" && value === "1") ||
      (key.includes("Schema") && value === "all") ||
      (key.includes("FeedType") && value === "all") ||
      value === false
    ) {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
  })

  // Build URL with params in logical order: network → networkType → filters → pagination
  const orderedParams = new URLSearchParams()
  const order = [
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

  order.forEach((key) => {
    if (params.has(key)) {
      const values = params.getAll(key)
      values.forEach((v) => orderedParams.append(key, v))
    }
  })

  const queryString = orderedParams.toString()
  const newUrl = window.location.pathname + (queryString ? "?" + queryString : "") + window.location.hash
  window.history.replaceState({ path: newUrl }, "", newUrl)
}

/**
 * Clear all filter-related params, optionally keeping network selection
 */
export function clearFilters(keepNetwork = true) {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)
  const network = params.get("network")
  const networkType = params.get("networkType")

  // Start fresh
  const newParams = new URLSearchParams()

  if (keepNetwork) {
    if (network) newParams.set("network", network)
    if (networkType && networkType !== "mainnet") newParams.set("networkType", networkType)
  }

  const queryString = newParams.toString()
  const newUrl = window.location.pathname + (queryString ? "?" + queryString : "") + window.location.hash
  window.history.replaceState({ path: newUrl }, "", newUrl)
}
