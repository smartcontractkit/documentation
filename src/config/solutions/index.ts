/**
 * SOLUTIONS REGISTRY
 *
 * Adding a solution? Read src/content/solutions/README.md first. In short:
 *   1. Write your pages in       src/content/solutions/<slug>/
 *   2. Write your manifest in    src/config/solutions/<slug>.ts
 *   3. Register it below.
 *
 * Nothing else needs to change. Sidebar placement, the hub card, the hub filters,
 * whether a left navigation renders, and the legal disclaimer are all derived.
 *
 */
import type { Sections } from "../../content.config.ts"
import type { Solution } from "./types.ts"
import { demoSinglePage } from "./demo-single-page.ts"
import { demoMultiPage } from "./demo-multi-page.ts"
import { crossChainVaultAdapter } from "./cross-chain-vault-adapter.ts"

export type { Solution, SolutionNavGroup } from "./types.ts"
export { SOLUTION_PRODUCTS, productLabel } from "./products.ts"
export { SOLUTIONS_HUB_ENABLED } from "./hub.ts"

/**
 * Every registered solution. Add yours here.
 * This is the only shared file a contributor touches.
 */
const ALL_REGISTERED: Solution[] = [demoSinglePage, demoMultiPage, crossChainVaultAdapter]

export const SOLUTIONS: Solution[] = ALL_REGISTERED.filter((s) => !s.hidden)

export const ALL_REGISTERED_SOLUTIONS: Solution[] = ALL_REGISTERED

/** Newest first. Used by the hub. */
export function getAllSolutions(): Solution[] {
  return [...SOLUTIONS].sort((a, b) => (b.datePublished ?? "").localeCompare(a.datePublished ?? ""))
}

export function getSolutionBySlug(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug)
}

/** Solutions that declare `product`. Empty array when none. */
export function getSolutionsForProduct(product: Sections): Solution[] {
  return getAllSolutions().filter((s) => s.products.includes(product))
}

/**
 * Convert a content-collection entry id into the page id used by a manifest nav.
 * Handles both id shapes the glob loader may produce for the landing page.
 *
 *   "demo-multi-page/index"                 -> "index"
 *   "demo-multi-page"                       -> "index"
 *   "demo-multi-page/overview/how-it-works" -> "overview/how-it-works"
 */
export function toPageId(slug: string, entryId: string): string {
  const clean = entryId.replace(/\.mdx?$/, "").replace(/\/index$/, "")
  if (clean === slug) return "index"
  return clean.slice(slug.length + 1)
}

/** Absolute site path for a solution page. Inverse of toPageId. */
export function toPagePath(slug: string, pageId: string): string {
  return pageId === "index" ? `/solutions/${slug}` : `/solutions/${slug}/${pageId}`
}

/**
 * Distinct facet values across all solutions, for the hub filters.
 * Never hardcode filter values in the hub markup: adding a solution with a new
 * category must add its filter automatically.
 */
export function getSolutionFacets() {
  const products = new Set<string>()
  const categories = new Set<string>()
  for (const s of SOLUTIONS) {
    s.products.forEach((p) => products.add(p))
    s.categories.forEach((c) => categories.add(c))
  }
  return { products: [...products].sort(), categories: [...categories].sort() }
}
