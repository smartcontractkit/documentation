import type { ChainType } from "~/config/types.js"
import type { SectionEntry, SectionContent } from "~/config/sidebar.js"

/**
 * Normalizes a URL by removing leading/trailing slashes and query parameters
 * @param url - URL to normalize
 * @returns Normalized URL string
 */
function normalizeUrl(url: string): string {
  let normalized = url.split("?")[0].split("#")[0]
  if (normalized.startsWith("/")) normalized = normalized.slice(1)
  if (normalized.endsWith("/")) normalized = normalized.slice(0, -1)
  return normalized
}

/**
 * Recursively searches sidebar content for an item matching the given URL
 * @param items - Sidebar content items to search
 * @param targetUrl - Normalized URL to find
 * @returns The matching SectionContent item or null
 */
function findItemByUrl(items: SectionContent[], targetUrl: string): SectionContent | null {
  for (const item of items) {
    if (item.url && normalizeUrl(item.url) === targetUrl) {
      return item
    }
    if (item.children) {
      const found = findItemByUrl(item.children, targetUrl)
      if (found) return found
    }
  }
  return null
}

/**
 * Recursively searches sidebar content for an item with the given title and chainType
 * @param items - Sidebar content items to search
 * @param title - Title to match
 * @param targetChain - ChainType to match
 * @returns The matching SectionContent item or null
 */
function findItemByTitleAndChain(
  items: SectionContent[],
  title: string,
  targetChain: ChainType
): SectionContent | null {
  for (const item of items) {
    // Check if this item matches
    if (item.title === title && item.chainTypes?.includes(targetChain)) {
      return item
    }
    // Search children recursively
    if (item.children) {
      const found = findItemByTitleAndChain(item.children, title, targetChain)
      if (found) return found
    }
  }
  return null
}

/**
 * Finds the parent item of a given URL in the sidebar
 * Searches recursively through the sidebar structure
 *
 * @param targetUrl - Normalized URL to find parent for
 * @param items - Sidebar content items to search
 * @param parent - Current parent item (used in recursion)
 * @returns The parent SectionContent item or null if not found
 */
function findParentOfUrl(
  targetUrl: string,
  items: SectionContent[],
  parent: SectionContent | null = null
): SectionContent | null {
  for (const item of items) {
    // Check if this item's URL matches
    if (item.url && normalizeUrl(item.url) === targetUrl) {
      return parent
    }
    // Search children recursively with current item as parent
    if (item.children) {
      const foundParent = findParentOfUrl(targetUrl, item.children, item)
      if (foundParent) return foundParent
    }
  }
  return null
}

/**
 * Finds which section contains a given URL
 * Uses sidebar structure as source of truth
 *
 * @param targetUrl - Normalized URL to find section for
 * @param sidebarConfig - Sidebar configuration
 * @returns The section containing the URL, or null if not found
 */
function findSectionForUrl(targetUrl: string, sidebarConfig: SectionEntry[]): SectionEntry | null {
  for (const section of sidebarConfig) {
    if (findItemByUrl(section.contents, targetUrl)) {
      return section
    }
  }
  return null
}

/**
 * Gets the first valid URL from a section
 * Searches top-level items first, then their children
 *
 * @param section - Section to get URL from
 * @returns First valid URL in section, or null if none found
 */
function getFirstUrlFromSection(section: SectionEntry): string | null {
  for (const item of section.contents) {
    if (item.url) return item.url
    // Check children if parent has no URL
    if (item.children) {
      for (const child of item.children) {
        if (child.url) return child.url
      }
    }
  }
  return null
}

/**
 * Finds the equivalent page URL for a different chain type
 * Uses sidebar configuration as the source of truth
 *
 * Algorithm:
 * 1. Find current page in sidebar by matching URL
 * 2. Extract the title of the current page
 * 3. Search sidebar for item with same title but different chainType
 * 4. Return the URL of the matching item
 *
 * @param currentUrl - Current page URL pathname
 * @param targetChain - Target chain type to navigate to
 * @param sidebarConfig - Sidebar configuration (source of truth)
 * @returns URL of equivalent page for target chain, or null if no equivalent exists
 *
 * @example
 * // User is on /ccip/getting-started/aptos and selects Solana
 * findEquivalentPageUrl("/ccip/getting-started/aptos", "solana", CCIP_SIDEBAR_CONTENT)
 * // Returns: "ccip/getting-started/svm"
 */
export function findEquivalentPageUrl(
  currentUrl: string,
  targetChain: ChainType,
  sidebarConfig: SectionEntry[]
): string | null {
  const normalizedCurrentUrl = normalizeUrl(currentUrl)

  // Find current page, its parent, and section
  let currentItem: SectionContent | null = null
  let currentParent: SectionContent | null = null
  let currentSection: SectionEntry | null = null

  for (const section of sidebarConfig) {
    currentItem = findItemByUrl(section.contents, normalizedCurrentUrl)
    if (currentItem) {
      currentSection = section
      currentParent = findParentOfUrl(normalizedCurrentUrl, section.contents)
      break
    }
  }

  if (!currentItem || !currentSection) return null

  // If current page is universal, it works for all chains
  // Check both item and parent: if item has no chainTypes BUT parent has chainTypes,
  // then item is chain-specific (inherits from parent)
  const isUniversal =
    (!currentItem.chainTypes || currentItem.chainTypes.length === 0) &&
    (!currentParent?.chainTypes || currentParent.chainTypes.length === 0)

  if (isUniversal) {
    return normalizedCurrentUrl
  }

  // If we have a parent, find the equivalent parent in the target chain first
  // Then search within THAT parent's children (not the current parent's children)
  if (currentParent) {
    const equivalentParent = findItemByTitleAndChain(currentSection.contents, currentParent.title, targetChain)
    if (equivalentParent?.children) {
      const equivalentItem = findItemByTitleAndChain(equivalentParent.children, currentItem.title, targetChain)
      if (equivalentItem?.url) return equivalentItem.url
    }
  }

  // Fallback: search the entire section if parent approach didn't work
  const equivalentItem = findItemByTitleAndChain(currentSection.contents, currentItem.title, targetChain)
  return equivalentItem?.url || null
}

/**
 * Finds the equivalent page URL with intelligent fallback
 * Implements graceful degradation: exact match → parent → section root
 *
 * This ensures users always land somewhere meaningful when switching chains,
 * even if the exact page doesn't exist for the target chain.
 *
 * Fallback chain:
 * 1. Try to find exact equivalent page (same title + target chain)
 * 2. If not found, try parent's equivalent page
 * 3. If still not found, fallback to section root
 *
 * @param currentUrl - Current page URL pathname
 * @param targetChain - Target chain type to navigate to
 * @param sidebarConfig - Sidebar configuration (source of truth)
 * @returns URL to navigate to (never returns null - always finds something)
 *
 * @example
 * // Scenario 1: Exact match exists
 * // /ccip/concepts/cross-chain-token/svm/tokens → EVM
 * // Returns: "ccip/concepts/cross-chain-token/evm/tokens" ✅
 *
 * // Scenario 2: No exact match, fallback to parent
 * // /ccip/concepts/cross-chain-token/svm/integration-guide → EVM (doesn't have integration-guide)
 * // Returns: "ccip/concepts/cross-chain-token" (parent) ✅
 *
 * // Scenario 3: Parent doesn't exist either, fallback to section
 * // /ccip/some-solana-only-nested-page → EVM
 * // Returns: "ccip/concepts" (section root) ✅
 */
export function findEquivalentPageUrlWithFallback(
  currentUrl: string,
  targetChain: ChainType,
  sidebarConfig: SectionEntry[]
): string {
  const normalizedCurrentUrl = normalizeUrl(currentUrl)

  // 1. Try exact match
  const exactMatch = findEquivalentPageUrl(currentUrl, targetChain, sidebarConfig)
  if (exactMatch) return exactMatch

  // 2. Find which section this page belongs to (single traversal)
  const section = findSectionForUrl(normalizedCurrentUrl, sidebarConfig)

  if (section) {
    // 3. Try parent equivalent
    const parent = findParentOfUrl(normalizedCurrentUrl, section.contents)
    if (parent?.url) {
      const parentEquivalent = findEquivalentPageUrl(parent.url, targetChain, sidebarConfig)
      if (parentEquivalent) return parentEquivalent

      // If parent has no equivalent, return the parent itself
      // (it's likely a universal page that works for all chains)
      return parent.url
    }

    // 4. Fallback to first item in section
    const sectionFirstUrl = getFirstUrlFromSection(section)
    if (sectionFirstUrl) return sectionFirstUrl
  }

  // 5. Ultimate fallback: stay on current page
  // This should rarely happen, but prevents navigation to nowhere
  return normalizedCurrentUrl
}
