import { getSunsetReplacement } from "../../config/sunset.js"

/** Shared by individual Markdown pages, product indexes, and full documentation bundles. */
export function renderSunsetNotice(docsPath: string, page?: { title: string; sourceUrl: string }): string | null {
  const product = getSunsetReplacement(docsPath)
  if (!product) return null
  return [
    `# ${page?.title ?? product.name} — Deprecated`,
    ...(page ? [`Source: ${page.sourceUrl}`] : []),
    "",
    `${product.name} is deprecated. Use ${product.replacement} instead.`,
    "",
    "For new development, use the replacement documentation. Do not use the deprecated product's APIs, code examples, or setup instructions.",
    "",
    `- [${product.replacement} documentation](https://docs.chain.link/${product.docsPath}.md)`,
    `- [${product.replacement} documentation index](https://docs.chain.link/${product.indexPath})`,
    "",
  ].join("\n")
}
