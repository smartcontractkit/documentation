import { getCollection, type CollectionEntry } from "astro:content"
import type { Solution } from "../config/solutions/index.ts"
import { collectSolutionPages } from "./solutionPages.js"

export { collectSolutionPages, isMultiPage, buildSolutionNav, getOrderedSolutionPages } from "./solutionPages.js"
export type { SolutionPage, SolutionNavItem, ResolvedNavGroup } from "./solutionPages.js"

const README = "src/content/solutions/README.md"

export type SolutionEntry = CollectionEntry<"solutions">

/** All content pages belonging to one solution, keyed by page id ("index", "users/failed-transfers", ...). */
export async function getSolutionPages(slug: string): Promise<Map<string, SolutionEntry>> {
  const all = await getCollection("solutions")
  return collectSolutionPages(slug, all)
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
