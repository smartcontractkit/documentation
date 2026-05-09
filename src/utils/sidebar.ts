import { SIDEBAR } from "../config/sidebar.js"
import type { SectionContent } from "../config/sidebar.js"

/**
 * Extracts canonical URLs that have language-specific variants
 * by scanning the sidebar configuration for entries with highlightAsCurrent arrays.
 *
 * This is used to exclude canonical URLs from the sitemap, as they only contain
 * client-side redirect scripts and no actual content. The language-specific
 * variants (-go, -ts) are the actual pages that should be indexed and link-checked.
 *
 * @returns A Set of canonical URLs (e.g., "/cre/reference/sdk/core") that have variants
 *
 * @example
 * // Sidebar entry with language variants:
 * {
 *   title: "Core SDK",
 *   url: "cre/reference/sdk/core",
 *   highlightAsCurrent: [
 *     "cre/reference/sdk/core-ts",
 *     "cre/reference/sdk/core-go",
 *   ],
 * }
 * // Returns: Set(["/cre/reference/sdk/core"])
 */
export function extractCanonicalUrlsWithLanguageVariants(): Set<string> {
  const canonicalUrls = new Set<string>()

  function processContent(content: SectionContent) {
    // If this entry has highlightAsCurrent with language variants, add the canonical URL
    if (content.highlightAsCurrent && content.highlightAsCurrent.length > 0 && content.url) {
      // Normalize the URL (remove leading slash, remove trailing slash)
      const normalizedUrl = content.url.startsWith("/") ? content.url.slice(1) : content.url
      const cleanUrl = normalizedUrl.endsWith("/") ? normalizedUrl.slice(0, -1) : normalizedUrl
      canonicalUrls.add(`/${cleanUrl}`)
    }

    // Recursively process children
    if (content.children) {
      content.children.forEach(processContent)
    }
  }

  // Process all sidebar sections
  Object.values(SIDEBAR).forEach((sections) => {
    if (sections) {
      sections.forEach((section) => {
        if (section?.contents) {
          section.contents.forEach(processContent)
        }
      })
    }
  })

  return canonicalUrls
}
