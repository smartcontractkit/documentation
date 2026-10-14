import fs from "node:fs/promises"
import path from "node:path"
import type { Solution } from "../../config/solutions/index.ts"
import { collectSolutionPages, getOrderedSolutionPages, type SolutionPage } from "../../utils/solutionPages.js"
import { assembleLlmsDocument, renderLlmsPageMarkdown } from "./llms.js"
import { extractFrontmatter, toContentRelative } from "./utils.js"
import type { LlmsRenderObservers } from "./types.js"

const SOLUTIONS_ROOT = path.resolve("src/content/solutions")

export function solutionLlmsOutputPath(slug: string, outputRoot = SOLUTIONS_ROOT): string {
  return path.join(outputRoot, slug, "llms-full.txt")
}

/** Match the solutions collection's MD/MDX discovery without requiring Astro's virtual modules. */
export async function readSolutionLlmsPages(solution: Solution, contentRoot = SOLUTIONS_ROOT): Promise<SolutionPage[]> {
  const pages: SolutionPage[] = []
  async function walk(directory: string): Promise<void> {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      const filePath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        await walk(filePath)
      } else if (entry.isFile() && /\.mdx?$/.test(entry.name) && entry.name !== "README.md") {
        const { fmTitle } = extractFrontmatter(await fs.readFile(filePath, "utf8"))
        if (!fmTitle) throw new Error(`[solutions] "${filePath}" has no page title.`)
        pages.push({
          id: path
            .relative(contentRoot, filePath)
            .split(path.sep)
            .join("/")
            .replace(/\.mdx?$/, ""),
          filePath,
          data: { title: fmTitle },
        })
      }
    }
  }
  await walk(path.join(contentRoot, solution.slug))
  return pages
}

/** Both the CLI and the Astro endpoint use this exact conversion, order, and disclaimer policy. */
export async function renderSolutionLlmsDocument(
  solution: Solution,
  pages: readonly SolutionPage[],
  observers: LlmsRenderObservers = {}
): Promise<string> {
  const orderedPages = getOrderedSolutionPages(solution, collectSolutionPages(solution.slug, pages))
  const outputs: string[] = []
  for (const entry of orderedPages) {
    if (!entry.filePath) {
      throw new Error(`[solutions] "${entry.id}" has no source file for its LLM documentation.`)
    }
    const absFile = path.resolve(entry.filePath)
    const raw = await fs.readFile(absFile, "utf8")
    const rendered = await renderLlmsPageMarkdown(raw, absFile, "solutions", undefined, observers)
    if (rendered.transformMode !== "normal") {
      console.warn(`[llms] ${toContentRelative(absFile)}: transform mode ${rendered.transformMode}`)
    }
    outputs.push(rendered.markdown)
  }
  // Preserve the complete disclaimer and any MDX callouts on every solution page.
  return assembleLlmsDocument(outputs, { deduplicateDisclaimers: false })
}
