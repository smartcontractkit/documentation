/**
 * Convert a path or URL string to an absolute URL string.
 * - If already absolute (http/https), returns as-is
 * - If relative and a site URL is provided, resolves against it
 * - If site is missing, returns the original string
 *
 * @param pathOrUrl Relative path (e.g. "/images/og.png") or absolute URL
 * @param site The site base URL (Astro.site) – may be undefined in some contexts
 * @returns Absolute URL string when resolvable; otherwise the input
 */
export function toAbsoluteUrl(pathOrUrl: string, site: URL | undefined): string {
  try {
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
    if (site) return new URL(pathOrUrl, site).toString()
    return pathOrUrl
  } catch {
    return pathOrUrl
  }
}

/**
 * Resolve a canonical URL override.
 * - If candidate is provided, resolves it against the site
 * - Falls back to the provided default URL when invalid or missing
 *
 * @param candidate Optional canonical override from frontmatter
 * @param site Site base URL (Astro.site) – may be undefined in some contexts
 * @param defaultUrl The default canonical (already absolute URL/string)
 * @returns A valid absolute canonical URL or the default URL
 */
export function resolveCanonical(
  candidate: string | undefined,
  site: URL | undefined,
  defaultUrl: URL | string
): string | URL {
  if (!candidate) return defaultUrl
  try {
    return new URL(candidate, site).toString()
  } catch {
    return defaultUrl
  }
}

/**
 * Infer an image MIME type from a URL pathname (query/hash ignored).
 * Supports: .jpg/.jpeg, .png, .webp, .gif
 *
 * @param pathname URL pathname (e.g. "/images/og.png")
 * @returns MIME type string like "image/png" or undefined when unknown
 */
export function getMimeFromUrlPath(pathname: string): string | undefined {
  const lower = pathname.toLowerCase()
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg"
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".webp")) return "image/webp"
  if (lower.endsWith(".gif")) return "image/gif"
  return undefined
}
