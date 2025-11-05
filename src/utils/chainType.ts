import type { SectionContent } from "~/config/sidebar.js"
import type { ChainType } from "~/config/types.js"

/**
 * Extended SectionContent with optional chain type filtering
 * Items can specify which chain types they belong to
 */
export type ChainFilteredContent = SectionContent & {
  chainTypes?: ChainType[]
}

/**
 * Recursively filter sidebar content by selected chain type
 *
 * Filtering rules:
 * - Items WITHOUT chainTypes property: Always shown (universal content)
 * - Items WITH chainTypes property: Only shown if selected chain is in the array
 * - Parent items without chainTypes but with filtered children: Parent remains visible
 *
 * Examples:
 *   { title: "Overview", url: "..." }
 *     → Always shown (no chainTypes)
 *
 *   { title: "EVM Guide", url: "...", chainTypes: ['evm'] }
 *     → Only shown when EVM is selected
 *
 *   { title: "Architecture", children: [...], chainTypes: ['evm', 'solana'] }
 *     → Shown for both EVM and Solana
 *
 * @param contents - Array of sidebar content items
 * @param selectedChain - Currently selected chain type
 * @returns Filtered array of content items
 */
export function filterContentByChainType(contents: SectionContent[], selectedChain: ChainType): SectionContent[] {
  return contents
    .map((item) => {
      const filtered: SectionContent = { ...item }
      const chainTypes = (item as ChainFilteredContent).chainTypes

      // If chainTypes is specified and doesn't include selected chain, exclude item
      if (chainTypes && !chainTypes.includes(selectedChain)) {
        return null
      }

      // Recursively filter children
      if (item.children) {
        filtered.children = filterContentByChainType(item.children, selectedChain)

        // If parent has no chain restriction but all children were filtered out,
        // keep the parent visible (allows "Overview" pages to remain accessible)
      }

      return filtered
    })
    .filter((item): item is SectionContent => item !== null)
}

/**
 * Recursively propagates chainTypes from parent to children
 *
 * This ensures that children inherit their parent's chainTypes if they don't have their own.
 * This is critical for mobile navigation where items are rendered as siblings rather than
 * nested in DOM hierarchy, so CSS cascade doesn't provide implicit filtering.
 *
 * Rules:
 * - If child has explicit chainTypes: Keep them (don't override)
 * - If child has no chainTypes but parent does: Inherit from parent
 * - If neither child nor parent has chainTypes: Remain universal (no chainTypes)
 * - Recursively process all descendants
 *
 * Examples:
 *   Parent: { title: "API Reference", chainTypes: ['evm'], children: [...] }
 *   Child:  { title: "Messages" }  // No chainTypes
 *   Result: { title: "Messages", chainTypes: ['evm'] }  // Inherited
 *
 *   Parent: { title: "API Reference", chainTypes: ['evm'], children: [...] }
 *   Child:  { title: "Router", chainTypes: ['evm', 'solana'] }  // Has own
 *   Result: { title: "Router", chainTypes: ['evm', 'solana'] }  // Preserved
 *
 * @param contents - Array of sidebar content items
 * @param parentChainTypes - ChainTypes from parent (used in recursion)
 * @returns Contents with propagated chainTypes
 */
export function propagateChainTypes(contents: SectionContent[], parentChainTypes?: ChainType[]): SectionContent[] {
  return contents.map((item) => {
    // Create new item to avoid mutation
    const processed: SectionContent = { ...item }

    // If item doesn't have chainTypes, inherit from parent
    if (!processed.chainTypes && parentChainTypes) {
      processed.chainTypes = parentChainTypes
    }

    // Recursively process children, passing this item's chainTypes as parent
    if (processed.children) {
      processed.children = propagateChainTypes(processed.children, processed.chainTypes)
    }

    return processed
  })
}

/**
 * Filters sidebar DOM elements by chain type using show/hide approach
 *
 * This function is used by both desktop sidebar and mobile drawer to
 * filter navigation items based on the selected chain type.
 *
 * Filtering rules:
 * - data-chain-types="universal": Always visible (no chain restriction)
 * - data-chain-types includes selected chain: Visible
 * - data-chain-types doesn't include selected chain: Hidden (display: none)
 * - No data-chain-types attribute: Always visible (legacy/universal content)
 *
 * Performance: Operates on DOM after initial render for instant switching
 *
 * @param currentChain - Currently selected chain type from store
 *
 * @example
 * // In Astro script tag
 * import { applyChainTypeFilter } from "~/utils/chainType.js"
 * applyChainTypeFilter(selectedChainType.get())
 *
 * @example
 * // In React component
 * import { applyChainTypeFilter } from "~/utils/chainType.js"
 * useEffect(() => {
 *   applyChainTypeFilter(currentChain)
 * }, [currentChain])
 */
export function applyChainTypeFilter(currentChain: ChainType): void {
  const sidebarItems = document.querySelectorAll<HTMLElement>("[data-chain-types]")

  sidebarItems.forEach((item) => {
    const chainTypesAttr = item.getAttribute("data-chain-types")

    if (chainTypesAttr === "universal") {
      // Always show universal content
      item.style.display = ""
    } else if (chainTypesAttr) {
      // Check if item's chains include the current selection
      const itemChains = chainTypesAttr.split(",")
      if (itemChains.includes(currentChain)) {
        item.style.display = ""
      } else {
        item.style.display = "none"
      }
    } else {
      // No chain types attribute means universal/legacy content
      item.style.display = ""
    }
  })
}
