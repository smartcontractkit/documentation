import { getCollection, type CollectionEntry } from "astro:content"
import { toPageId, toPagePath } from "~/config/solutions/index.ts"
import type { Solution } from "~/config/solutions/index.ts"

const README = "src/content/solutions/README.md"

export type SolutionEntry = CollectionEntry<"solutions">
export type SolutionNavItem = { title: string; url: string }
export type ResolvedNavGroup = { section: string; contents: SolutionNavItem[] }

/** All content pages belonging to one solution, keyed by page id ("index", "users/failed-transfers", ...). */
export async function getSolutionPages(slug: string): Promise<Map<string, SolutionEntry>> {
  const all = await getCollection("solutions")
  const pages = new Map<string, SolutionEntry>()

  for (const entry of all) {
    const id = entry.id.replace(/\.mdx?$/, "")
    if (id !== slug && !id.startsWith(`${slug}/`)) continue
    pages.set(toPageId(slug, entry.id), entry)
  }

  if (!pages.has("index")) {
    throw new Error(
      `[solutions] "${slug}" has no landing page. Create src/content/solutions/${slug}/index.mdx. See ${README}.`
    )
  }

  return pages
}

/** A solution is multi-page when it has more than its landing page. This is the ONLY definition. */
export function isMultiPage(pages: Map<string, SolutionEntry>): boolean {
  return pages.size > 1
}

/**
 * Resolves the left navigation, or null when the solution is single-page and no sidebar
 * should render. Validates the manifest against what is actually on disk, in both directions.
 */
export function buildSolutionNav(solution: Solution, pages: Map<string, SolutionEntry>): ResolvedNavGroup[] | null {
  const { slug } = solution

  if (!isMultiPage(pages)) {
    if (solution.nav) {
      throw new Error(
        `[solutions] "${slug}" has a single page but declares "nav" in src/config/solutions/${slug}.ts. ` +
          `Single-page solutions render no sidebar, so "nav" would do nothing. Remove it. See ${README}.`
      )
    }
    return null
  }

  if (!solution.nav) {
    throw new Error(
      `[solutions] "${slug}" has ${pages.size} pages but declares no "nav" in src/config/solutions/${slug}.ts. ` +
        `Multi-page solutions must declare their navigation. See ${README}.`
    )
  }

  const declared = new Set<string>()
  const groups: ResolvedNavGroup[] = solution.nav.map((group) => ({
    section: group.group,
    contents: group.pages.map((pageId) => {
      const entry = pages.get(pageId)
      if (!entry) {
        throw new Error(
          `[solutions] "${slug}" nav references "${pageId}" but no page exists for it. ` +
            `Expected src/content/solutions/${slug}/${pageId}.mdx. See ${README}.`
        )
      }
      if (declared.has(pageId)) {
        throw new Error(`[solutions] "${slug}" lists "${pageId}" more than once in its nav. See ${README}.`)
      }
      declared.add(pageId)
      // RecursiveSidebar prepends Astro.site.pathname, so strip the leading slash. See §1.6.
      return { title: entry.data.title, url: toPagePath(slug, pageId).slice(1) }
    }),
  }))

  for (const pageId of pages.keys()) {
    if (!declared.has(pageId)) {
      throw new Error(
        `[solutions] src/content/solutions/${slug}/${pageId}.mdx exists but is not listed in the nav of ` +
          `src/config/solutions/${slug}.ts. Every page must appear exactly once. See ${README}.`
      )
    }
  }

  return groups
}

/** Fails the build when a registered manifest has no content directory. */
export async function assertRegisteredSolutionsHaveContent(solutions: Solution[]): Promise<void> {
  const all = await getCollection("solutions")
  for (const solution of solutions) {
    const has = all.some((e) => {
      const id = e.id.replace(/\.mdx?$/, "")
      return id === solution.slug || id.startsWith(`${solution.slug}/`)
    })
    if (!has) {
      throw new Error(
        `[solutions] "${solution.slug}" is registered in src/config/solutions/index.ts but has no content at ` +
          `src/content/solutions/${solution.slug}/. See ${README}.`
      )
    }
  }
}
