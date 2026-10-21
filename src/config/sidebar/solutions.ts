import type { Sections } from "../../content.config.ts"
import type { SectionEntry } from "../sidebar.ts"
import { getSolutionsForProduct } from "../solutions/index.ts"

/**
 * Builds the "Solutions" sidebar group for a product, or undefined when that product has
 * no solutions.
 */
export function getSolutionsSection(product: Sections): SectionEntry | undefined {
  const solutions = getSolutionsForProduct(product)
  if (solutions.length === 0) return undefined

  return {
    section: "Solutions",
    contents: solutions.map((solution) => ({
      title: solution.title,
      url: `solutions/${solution.slug}`,
    })),
  }
}
