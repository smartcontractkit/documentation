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
