/**
 * Chainlink Functions and Chainlink Automation stay reachable at their old URLs.
 * They are left out of navigation, search, sitemaps, and Markdown output.
 */

export const SUNSET_DOC_ROOTS = ["chainlink-automation", "chainlink-functions"] as const

export const SUNSET_SIDEBAR_SECTIONS = ["automation", "chainlinkFunctions"] as const

/** Quickstarts that document only Functions, only Automation, or both. */
export const SUNSET_QUICKSTART_SLUGS = [
  "automation-station",
  "dynamic-metadata",
  "eth-balance-monitor",
  "functions-demo-app",
  "time-based-upkeep",
] as const

const SUNSET_SIDEBAR_SECTION_SET = new Set<string>(SUNSET_SIDEBAR_SECTIONS)

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

  return SUNSET_QUICKSTART_SLUGS.some((slug) => normalized.endsWith(`/src/content/quickstarts/${slug}.mdx`))
}
