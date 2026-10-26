/**
 * Networks where a single proxy contract serves every feed and consumers select
 * a feed by its 32-byte data_id (feed ID) rather than a per-feed contract address.
 * On these networks the feed table's "address" column shows the copyable feed ID.
 *
 * Kept in its own module to avoid a circular import between feedMetadata.ts and
 * useBatchedFeedCategories.ts (both of which need this predicate).
 */
export function isFeedIdAddressedNetwork(networkName: string): boolean {
  const name = networkName.toLowerCase()
  return name.includes("aptos") || name.includes("stellar")
}
