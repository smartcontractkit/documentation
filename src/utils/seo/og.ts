/**
 * Determine Open Graph type for a given pathname.
 * - Returns "website" for home and product landing pages
 * - Returns "article" for everything else
 *
 * Keep this list in sync when adding new product roots.
 */
export function getOgType(pathname: string): "website" | "article" {
  const websiteExact = new Set<string>([
    "/",
    "/ccip",
    "/data-feeds",
    "/vrf",
    "/chainlink-functions",
    "/chainlink-automation",
    "/chainlink-local",
    "/resources",
  ])
  if (websiteExact.has(pathname) || pathname.startsWith("/ccip/directory")) return "website"
  return "article"
}
