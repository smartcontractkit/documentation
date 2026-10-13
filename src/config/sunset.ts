/**
 * Sunset pages stay reachable at their old URLs.
 * Site menus, search, and Markdown output leave them out.
 * Functions and Automation pages still show the left sidebar from SIDEBAR_WITH_SUNSET_PRODUCTS.
 * Pages send noindex. They stay in the sitemap so a crawler can recrawl and see noindex.
 * Set SUNSET_PAGES_STAY_IN_SITEMAP to false after a few weeks to drop them from the sitemap.
 *
 * Also hidden: Any API, the seven direct-request job specs, and external initiators.
 * OCR job docs stay. Keeper jobs stay and carry the Automation sunset note.
 */

/** Temporary. Flip to false after crawlers have had time to read noindex. */
export const SUNSET_PAGES_STAY_IN_SITEMAP = true

export const SUNSET_DOC_ROOTS = ["any-api", "chainlink-automation", "chainlink-functions"] as const

export const SUNSET_SIDEBAR_SECTIONS = ["automation", "chainlinkFunctions"] as const

/** Subtrees inside a product that stays in the menu. */
export const SUNSET_PATH_PREFIXES = ["chainlink-nodes/external-initiators"] as const

/** Individual pages. The rest of chainlink-nodes stays indexed, including OCR jobs. */
export const SUNSET_EXACT_PATHS = [
  "chainlink-nodes/job-specs/direct-request-existing-job",
  "chainlink-nodes/job-specs/direct-request-get-bool",
  "chainlink-nodes/job-specs/direct-request-get-bytes",
  "chainlink-nodes/job-specs/direct-request-get-int256",
  "chainlink-nodes/job-specs/direct-request-get-string",
  "chainlink-nodes/job-specs/direct-request-get-uint256",
  "chainlink-nodes/job-specs/multi-word-job",
] as const

/** Quickstarts that document only Functions, only Automation, or both. */
export const SUNSET_QUICKSTART_SLUGS = [
  "automation-station",
  "dynamic-metadata",
  "eth-balance-monitor",
  "functions-demo-app",
  "time-based-upkeep",
] as const

const SUNSET_SIDEBAR_SECTION_SET = new Set<string>(SUNSET_SIDEBAR_SECTIONS)
const SUNSET_EXACT_PATH_SET = new Set<string>(SUNSET_EXACT_PATHS)

export function normalizeDocsPath(pathname: string): string {
  const withoutHash = pathname.split("#")[0] ?? ""
  const withoutQuery = withoutHash.split("?")[0] ?? ""
  let clean = withoutQuery.trim()

  if (/^https?:\/\//i.test(clean)) {
    try {
      clean = new URL(clean).pathname
    } catch {
      return ""
    }
  }

  return clean.replace(/^\/+/, "").replace(/\/+$/, "")
}

export function isSunsetDocsPath(pathname: string): boolean {
  const clean = normalizeDocsPath(pathname)
  if (!clean) return false

  if (SUNSET_DOC_ROOTS.some((root) => clean === root || clean.startsWith(`${root}/`))) {
    return true
  }

  if (SUNSET_PATH_PREFIXES.some((prefix) => clean === prefix || clean.startsWith(`${prefix}/`))) {
    return true
  }

  if (SUNSET_EXACT_PATH_SET.has(clean)) return true

  return SUNSET_QUICKSTART_SLUGS.some((slug) => clean === `quickstarts/${slug}`)
}

export function isSunsetSidebarSection(section: string): boolean {
  return SUNSET_SIDEBAR_SECTION_SET.has(section)
}

export function isSunsetContentFile(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/")

  if (SUNSET_DOC_ROOTS.some((root) => normalized.includes(`/src/content/${root}/`))) {
    return true
  }

  if (SUNSET_PATH_PREFIXES.some((prefix) => normalized.includes(`/src/content/${prefix}/`))) {
    return true
  }

  if (SUNSET_EXACT_PATHS.some((docsPath) => normalized.endsWith(`/src/content/${docsPath}.mdx`))) {
    return true
  }

  return SUNSET_QUICKSTART_SLUGS.some((slug) => normalized.endsWith(`/src/content/quickstarts/${slug}.mdx`))
}
