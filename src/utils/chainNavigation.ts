import type { ChainType } from "~/config/types.js"
import type { SectionEntry, SectionContent } from "~/config/sidebar.js"
import { detectChainFromPath } from "~/stores/chainType.js"

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

type UrlMatch =
  | {
      item: SectionContent
      matchedType: "url"
      matchedIndex: -1
    }
  | {
      item: SectionContent
      matchedType: "highlight"
      matchedIndex: number
    }

/**
 * Recursively searches sidebar content for an item matching the given URL.
 * Supports both canonical `url` and `highlightAsCurrent` variants.
 *
 * @param items - Sidebar content items to search
 * @param targetUrl - Normalized URL to find
 * @returns Match metadata or null
 */
function findItemMatchByUrl(items: SectionContent[], targetUrl: string): UrlMatch | null {
  for (const item of items) {
    if (item.url && normalizeUrl(item.url) === targetUrl) {
      return {
        item,
        matchedType: "url",
        matchedIndex: -1,
      }
    }

    if (item.highlightAsCurrent?.length) {
      const index = item.highlightAsCurrent.findIndex((url) => normalizeUrl(url) === targetUrl)
      if (index >= 0) {
        return {
          item,
          matchedType: "highlight",
          matchedIndex: index,
        }
      }
    }

    if (item.children) {
      const found = findItemMatchByUrl(item.children, targetUrl)
      if (found) return found
    }
  }
  return null
}

/**
 * Recursively searches sidebar content for an item matching the given URL
 * @param items - Sidebar content items to search
 * @param targetUrl - Normalized URL to find
 * @returns The matching SectionContent item or null
 */
function findItemByUrl(items: SectionContent[], targetUrl: string): SectionContent | null {
  return findItemMatchByUrl(items, targetUrl)?.item || null
}

/**
 * Recursively searches sidebar content for an item with the given pageId and chainType.
 * pageId provides deterministic cross-version/chain navigation (replaces title matching).
 *
 * @param items - Sidebar content items to search
 * @param pageId - pageId to match
 * @param targetChain - ChainType to match
 * @returns The matching SectionContent item or null
 */
function findItemByPageIdAndChain(
  items: SectionContent[],
  pageId: string,
  targetChain: ChainType
): SectionContent | null {
  for (const item of items) {
    // Chain-specific match
    if (item.pageId === pageId && item.chainTypes?.includes(targetChain)) {
      return item
    }
    // Universal items (no chainTypes) match any chain
    if (item.pageId === pageId && !item.chainTypes) {
      return item
    }
    if (item.children) {
      const found = findItemByPageIdAndChain(item.children, pageId, targetChain)
      if (found) return found
    }
  }
  return null
}

/**
 * Recursively searches sidebar content for an item with the given title and chainType.
 * Used as a fallback when pageId is not available on an item.
 *
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
    if (item.title === title && item.chainTypes?.includes(targetChain)) {
      return item
    }
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
    const directUrlMatch = item.url && normalizeUrl(item.url) === targetUrl
    const highlightMatch = item.highlightAsCurrent?.some((url) => normalizeUrl(url) === targetUrl) ?? false

    if (directUrlMatch || highlightMatch) {
      return parent
    }

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
 * Exported so chain switching can tell whether the current page is in the sidebar at all.
 *
 * @param targetUrl - Normalized URL to find section for
 * @param sidebarConfig - Sidebar configuration
 * @returns The section containing the URL, or null if not found
 */
export function findSectionForUrl(targetUrl: string, sidebarConfig: SectionEntry[]): SectionEntry | null {
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
    if (item.children) {
      for (const child of item.children) {
        if (child.url) return child.url
      }
    }
  }
  return null
}

/**
 * Resolves the equivalent target URL for a matched source item,
 * preserving highlightAsCurrent variant when applicable.
 *
 * @param targetItem - Equivalent item in the target sidebar
 * @param sourceMatch - Source URL match metadata
 * @returns Target URL or null
 */
function resolveMatchedTargetUrl(targetItem: SectionContent, sourceMatch: UrlMatch): string | null {
  if (sourceMatch.matchedType === "url") {
    return targetItem.url || null
  }

  const highlightUrl = targetItem.highlightAsCurrent?.[sourceMatch.matchedIndex]
  return highlightUrl || targetItem.url || null
}

/**
 * Finds the equivalent page URL for a different chain type (and optionally version).
 * Uses pageId for deterministic matching, with title matching as fallback.
 *
 * @param currentUrl        - Current page URL pathname
 * @param targetChain       - Target chain type to navigate to
 * @param targetSidebarConfig - Sidebar to search for the equivalent page
 * @param sourceSidebarConfig - Sidebar containing the current page (optional;
 *                              defaults to targetSidebarConfig for same-version switching)
 * @returns URL of equivalent page for target chain, or null if no equivalent exists
 */
export function findEquivalentPageUrl(
  currentUrl: string,
  targetChain: ChainType,
  targetSidebarConfig: SectionEntry[],
  sourceSidebarConfig?: SectionEntry[]
): string | null {
  const normalizedCurrentUrl = normalizeUrl(currentUrl)
  const sourceConfig = sourceSidebarConfig || targetSidebarConfig

  // Find current page in the SOURCE sidebar (where the current URL exists)
  let currentMatch: UrlMatch | null = null
  let currentParent: SectionContent | null = null
  let currentSection: SectionEntry | null = null

  for (const section of sourceConfig) {
    currentMatch = findItemMatchByUrl(section.contents, normalizedCurrentUrl)
    if (currentMatch) {
      currentSection = section
      currentParent = findParentOfUrl(normalizedCurrentUrl, section.contents)
      break
    }
  }

  if (!currentMatch || !currentSection) return null

  const currentItem = currentMatch.item

  // If current page is universal (no chainTypes), it works for all chains.
  // Check both item and parent: if item has no chainTypes BUT parent has chainTypes,
  // then item is chain-specific (inherits from parent).
  const isUniversal =
    (!currentItem.chainTypes || currentItem.chainTypes.length === 0) &&
    (!currentParent?.chainTypes || currentParent.chainTypes.length === 0)

  // For same-version chain switching, universal pages stay at the same URL.
  // For cross-version switching (sourceSidebarConfig provided), we must NOT
  // short-circuit — we need the pageId lookup to find the version-specific
  // equivalent (e.g., "ccip" → "ccip/v1" or "ccip/billing" → "ccip/v1/billing").
  if (isUniversal && !sourceSidebarConfig) {
    return normalizedCurrentUrl
  }

  // --- Primary: pageId-based matching (deterministic) ---
  if (currentItem.pageId) {
    for (const section of targetSidebarConfig) {
      const match = findItemByPageIdAndChain(section.contents, currentItem.pageId, targetChain)
      if (match) return resolveMatchedTargetUrl(match, currentMatch)
    }
    return null
  }

  // --- Fallback: title-based matching (backward compatibility for items without pageId) ---
  if (currentParent) {
    const equivalentParent = findItemByTitleAndChain(currentSection.contents, currentParent.title, targetChain)
    if (equivalentParent?.children) {
      const equivalentItem = findItemByTitleAndChain(equivalentParent.children, currentItem.title, targetChain)
      if (equivalentItem) return resolveMatchedTargetUrl(equivalentItem, currentMatch)
    }
  }

  const equivalentItem = findItemByTitleAndChain(currentSection.contents, currentItem.title, targetChain)
  return equivalentItem ? resolveMatchedTargetUrl(equivalentItem, currentMatch) : null
}

/**
 * Finds the equivalent page URL with intelligent fallback.
 * Implements graceful degradation: exact match → section root → current page (chainless) or version root
 *
 * @param currentUrl - Current page URL pathname
 * @param targetChain - Target chain type to navigate to
 * @param targetSidebarConfig - Sidebar configuration to search (target version)
 * @param sourceSidebarConfig - Optional. Pass when switching versions (source ≠ target).
 *                              Omit when switching chains within the same version.
 * @returns URL to navigate to (never returns null - always finds something)
 */
export function findEquivalentPageUrlWithFallback(
  currentUrl: string,
  targetChain: ChainType,
  targetSidebarConfig: SectionEntry[],
  sourceSidebarConfig?: SectionEntry[]
): string {
  const normalizedCurrentUrl = normalizeUrl(currentUrl)

  // 1. Try exact equivalent (pageId + chain match, with title fallback)
  const exactMatch = findEquivalentPageUrl(currentUrl, targetChain, targetSidebarConfig, sourceSidebarConfig)
  if (exactMatch) return exactMatch

  // 2. Try section root in the TARGET sidebar
  const section = findSectionForUrl(normalizedCurrentUrl, targetSidebarConfig)
  if (section) {
    const parent = findParentOfUrl(normalizedCurrentUrl, section.contents)
    if (parent?.url) {
      const parentEquivalent = findEquivalentPageUrl(parent.url, targetChain, targetSidebarConfig, sourceSidebarConfig)
      if (parentEquivalent) return parentEquivalent

      return parent.url
    }

    const sectionFirstUrl = getFirstUrlFromSection(section)
    if (sectionFirstUrl) return sectionFirstUrl
  }

  // 3. For cross-version fallback: if the URL isn't in the target sidebar,
  // try to find the first section root in the target version.
  if (sourceSidebarConfig && targetSidebarConfig.length > 0) {
    const firstSection = targetSidebarConfig[0]
    const sectionFirstUrl = getFirstUrlFromSection(firstSection)
    if (sectionFirstUrl) return sectionFirstUrl
  }

  // 4. Ultimate fallback (same-version switching).
  // Production parity: a page with no explicit chain segment (the landing, hub index pages)
  // stays where it is; the stored selection drives the sidebar on reload. A chain-specific URL
  // would re-detect its own chain on load and silently discard the selection, so those go to
  // the version root instead (v1 context preserved).
  if (!sourceSidebarConfig) {
    if (detectChainFromPath(`/${normalizedCurrentUrl}`) === null) return normalizedCurrentUrl
    if (normalizedCurrentUrl === "ccip/v1" || normalizedCurrentUrl.startsWith("ccip/v1/")) return "ccip/v1"
  }
  return "ccip"
}
