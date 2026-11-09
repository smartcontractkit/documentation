import path from "node:path"
import { ALL_REGISTERED_SOLUTIONS, SOLUTION_PRODUCTS, toPageId } from "../../config/solutions/index.ts"
import { SOLUTION_DISCLAIMER } from "../../config/solutions/disclaimer.ts"
import { formatHeading, formatLink } from "./formatters.js"

/** Include the content that SolutionLayout adds outside the MDX body in every Markdown/TXT export. */
export function withSolutionLayoutContent(body: string, sourcePath: string): string {
  const relative = path.relative(path.resolve("src/content/solutions"), sourcePath).split(path.sep).join("/")
  if (relative.startsWith("../") || path.isAbsolute(relative)) return body
  const id = relative.replace(/\.mdx?$/, "")
  const slug = id.split("/")[0]
  const solution = ALL_REGISTERED_SOLUTIONS.find((solution) => solution.slug === slug)
  if (!solution) return body

  const sections: string[] = []
  if (toPageId(slug, id) === "index") {
    const products = solution.products.map((key) => SOLUTION_PRODUCTS[key]).filter(Boolean)
    sections.push(
      formatHeading(2, "What is it") + solution.description,
      products.map((product) => formatLink(product.label, product.href)).join(" · "),
      solution.categories.join(", "),
      solution.repoUrl ? formatLink("View on GitHub", solution.repoUrl) : ""
    )
  }
  sections.push(
    body.trim(),
    formatHeading(2, "Disclaimer") +
      SOLUTION_DISCLAIMER.beforeTerms +
      " " +
      formatLink(SOLUTION_DISCLAIMER.termsLabel, SOLUTION_DISCLAIMER.termsUrl) +
      SOLUTION_DISCLAIMER.afterTerms
  )
  return sections.filter(Boolean).join("\n\n")
}
