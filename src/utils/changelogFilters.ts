import { ChangelogItem } from "~/components/ChangelogSnippet/types.ts"

/**
 * Extracts network names from the HTML networks field
 * Networks are hidden in divs with fs-cmsfilter-field="network" class
 */
export function extractNetworkFromHtml(html: string): string[] {
  const networks: string[] = []
  const regex = /<div[^>]*fs-cmsfilter-field="network"[^>]*class="hidden"[^>]*>(.*?)<\/div>/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const networkName = match[1].trim()
    if (networkName) {
      networks.push(networkName)
    }
  }

  return networks
}

/**
 * Extracts all unique networks from changelog items
 */
export function getUniqueNetworks(items: ChangelogItem[]): string[] {
  const networksSet = new Set<string>()

  items.forEach((item) => {
    if (item.networks) {
      const networks = extractNetworkFromHtml(item.networks)
      networks.forEach((network) => networksSet.add(network))
    }
  })

  return Array.from(networksSet).sort()
}

/**
 * Extracts all unique topics from changelog items
 */
export function getUniqueTopics(items: ChangelogItem[]): string[] {
  const topicsSet = new Set<string>()

  items.forEach((item) => {
    if (item.topic) {
      topicsSet.add(item.topic)
    }
  })

  return Array.from(topicsSet).sort()
}

/**
 * Extracts all unique types from changelog items
 */
export function getUniqueTypes(items: ChangelogItem[]): string[] {
  const typesSet = new Set<string>()

  items.forEach((item) => {
    if (item.type) {
      typesSet.add(item.type)
    }
  })

  return Array.from(typesSet).sort()
}

/**
 * Checks if a changelog item matches the selected filters
 */
export function matchesFilters(
  item: ChangelogItem,
  selectedProducts: string[],
  selectedNetworks: string[],
  selectedTypes: string[]
): boolean {
  // If no filters selected, show all items
  const hasProductFilter = selectedProducts.length > 0
  const hasNetworkFilter = selectedNetworks.length > 0
  const hasTypeFilter = selectedTypes.length > 0

  if (!hasProductFilter && !hasNetworkFilter && !hasTypeFilter) {
    return true
  }

  // Check product filter (matches against item.topic field)
  if (hasProductFilter && !selectedProducts.includes(item.topic)) {
    return false
  }

  // Check type filter
  if (hasTypeFilter && !selectedTypes.includes(item.type)) {
    return false
  }

  // Check network filter
  if (hasNetworkFilter) {
    const itemNetworks = extractNetworkFromHtml(item.networks)
    const hasMatchingNetwork = selectedNetworks.some((network) => itemNetworks.includes(network))
    if (!hasMatchingNetwork) {
      return false
    }
  }

  return true
}
