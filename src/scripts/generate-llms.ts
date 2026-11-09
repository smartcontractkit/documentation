#!/usr/bin/env node
import fsSync from "fs"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "node:url"
import { LLM_SECTIONS_CONFIG, SUPPORTED_LLM_SECTIONS, type LlmsSectionConfig } from "../config/llms.js"
import { SIDEBAR } from "../config/sidebar.js"
import { isSunsetContentFile } from "../config/sunset.js"
import type { SectionEntry, SectionContent } from "../config/sidebar.js"
import { assembleLlmsDocument, renderLlmsPageMarkdown } from "../lib/markdown/llms.js"
import { SOLUTIONS, type Solution } from "../config/solutions/index.ts"
import {
  readSolutionLlmsPages,
  renderSolutionLlmsDocument,
  solutionLlmsOutputPath,
} from "../lib/markdown/solutionLlms.js"

import {
  extractFrontmatter,
  getPageLanguage,
  shouldIncludeInLanguageFile,
  toContentRelative,
} from "../lib/markdown/utils.js"

export { assembleLlmsDocument, renderLlmsPageMarkdown } from "../lib/markdown/llms.js"

const SITE_BASE = "https://docs.chain.link"

type SectionReport = {
  section: string
  pagesProcessed: number
  outputPath: string
  bytes: number
  prevBytes?: number
  deltaBytes?: number
}
type Report = { startedAt: string; finishedAt?: string; siteBase: string; sections: SectionReport[] }

type CliArgs = {
  section?: string
  pagesFile?: string
  reportPath?: string
}

export function selectLlmsTargets(section?: string): { sections: string[]; solutions: Solution[] } {
  const solutions = SOLUTIONS.filter((solution) => !solution.hidden)
  if (!section) return { sections: [...SUPPORTED_LLM_SECTIONS], solutions }
  if (section === "solutions") return { sections: [], solutions }
  if (section.startsWith("solutions/")) {
    const selected = solutions.filter((solution) => `solutions/${solution.slug}` === section)
    if (!selected.length) throw new Error(`[llms] Unknown or hidden solution: ${section}`)
    return { sections: [], solutions: selected }
  }
  return { sections: [section], solutions: [] }
}

export async function generateSolutionLlmsFiles(
  solutions: readonly Solution[],
  outputRoot?: string
): Promise<SectionReport[]> {
  const reports: SectionReport[] = []
  for (const solution of solutions) {
    if (solution.hidden) continue
    const pages = await readSolutionLlmsPages(solution)
    const document = await renderSolutionLlmsDocument(solution, pages)
    const outPath = solutionLlmsOutputPath(solution.slug, outputRoot)
    let prevBytes: number | undefined
    try {
      prevBytes = (await fs.stat(outPath)).size
    } catch {}
    await fs.mkdir(path.dirname(outPath), { recursive: true })
    await fs.writeFile(outPath, document, "utf8")
    const bytes = Buffer.byteLength(document, "utf8")
    reports.push({
      section: `solutions/${solution.slug}`,
      pagesProcessed: pages.length,
      outputPath: path.relative(process.cwd(), outPath),
      bytes,
      prevBytes,
      deltaBytes: prevBytes === undefined ? undefined : bytes - prevBytes,
    })
    console.log(`[llms] solutions/${solution.slug} → /solutions/${solution.slug}/llms-full.txt (${pages.length} pages)`)
  }
  return reports
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { sections, solutions } = selectLlmsTargets(args.section)
  if (args.pagesFile && args.section?.startsWith("solutions")) {
    throw new Error("[llms] --pages is only supported for product sections; solutions use their complete navigation.")
  }

  const report: Report = {
    startedAt: new Date().toISOString(),
    siteBase: SITE_BASE,
    sections: [],
  }

  for (const section of sections) {
    const cfg = LLM_SECTIONS_CONFIG[section as keyof typeof LLM_SECTIONS_CONFIG] as LlmsSectionConfig | undefined
    if (!cfg) continue

    const pages = args.pagesFile ? await readPagesList(args.pagesFile) : await discoverMdxFiles(cfg.root)

    // Deterministic order
    const explicitOrder = cfg.order || getSidebarFileOrder(section)
    const orderedPages = orderPages(section, pages, explicitOrder)

    // Check if this section has language-specific files
    const languages = cfg.languages || []

    if (languages.length > 0) {
      // Generate separate file for each language
      for (const lang of languages) {
        const outputs: string[] = []
        let processed = 0

        for (const absFile of orderedPages) {
          if (!absFile.endsWith(".mdx") && !absFile.endsWith(".md")) continue
          if (isSunsetContentFile(absFile)) continue

          const raw = await fs.readFile(absFile, "utf-8")
          const { sdkLang } = extractFrontmatter(raw)
          const pageLanguage = getPageLanguage(absFile, sdkLang)

          // Skip if this page doesn't belong to this language
          if (!shouldIncludeInLanguageFile(pageLanguage, lang)) continue

          const rendered = await renderLlmsPageMarkdown(raw, absFile, section, lang)
          if (rendered.transformMode !== "normal") {
            console.warn(`[llms] ${toContentRelative(absFile)}: transform mode ${rendered.transformMode}`)
          }

          outputs.push(rendered.markdown)
          processed += 1
        }

        const finalOutput = assembleLlmsDocument(outputs)
        const outPath = path.resolve(`src/content/${section}/llms-full-${lang}.txt`)

        // Compute previous size if file exists
        let prevBytes: number | undefined
        try {
          const stat = await fs.stat(outPath)
          prevBytes = stat.size
        } catch {}

        // Write file
        await fs.writeFile(outPath, finalOutput, "utf-8")
        const bytes = Buffer.byteLength(finalOutput, "utf-8")
        const deltaBytes = prevBytes !== undefined ? bytes - prevBytes : undefined

        report.sections.push({
          section: `${section}-${lang}`,
          pagesProcessed: processed,
          outputPath: path.relative(process.cwd(), outPath),
          bytes,
          prevBytes,
          deltaBytes,
        })
      }
    } else {
      // Generate single file (backward compatibility)
      const outputs: string[] = []
      let processed = 0

      for (const absFile of orderedPages) {
        if (!absFile.endsWith(".mdx") && !absFile.endsWith(".md")) continue
        if (isSunsetContentFile(absFile)) continue
        const raw = await fs.readFile(absFile, "utf-8")
        const rendered = await renderLlmsPageMarkdown(raw, absFile, section)
        if (rendered.transformMode !== "normal") {
          console.warn(`[llms] ${toContentRelative(absFile)}: transform mode ${rendered.transformMode}`)
        }

        outputs.push(rendered.markdown)
        processed += 1
      }

      const finalOutput = assembleLlmsDocument(outputs)
      const outPath = path.resolve(`src/content/${section}/llms-full.txt`)

      // Compute previous size if file exists
      let prevBytes: number | undefined
      try {
        const stat = await fs.stat(outPath)
        prevBytes = stat.size
      } catch {}

      // Write file
      await fs.writeFile(outPath, finalOutput, "utf-8")
      const bytes = Buffer.byteLength(finalOutput, "utf-8")
      const deltaBytes = prevBytes !== undefined ? bytes - prevBytes : undefined

      report.sections.push({
        section,
        pagesProcessed: processed,
        outputPath: path.relative(process.cwd(), outPath),
        bytes,
        prevBytes,
        deltaBytes,
      })
    }
  }

  report.sections.push(...(await generateSolutionLlmsFiles(solutions)))
  report.finishedAt = new Date().toISOString()
  await writeReports(report, args.reportPath)
  console.log("LLM generation complete.")
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--section") args.section = argv[++i]
    if (a === "--pages") args.pagesFile = argv[++i]
    if (a === "--report") args.reportPath = argv[++i]
  }
  return args
}

async function readPagesList(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, "utf-8")
  const json = JSON.parse(content)
  const pages: string[] = json.pages || []
  return pages.map((p) => path.resolve(p))
}

async function discoverMdxFiles(rootDir: string): Promise<string[]> {
  const absRoot = path.resolve(rootDir)
  const out: string[] = []
  await walk(absRoot, out)
  return out.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
}

async function walk(dir: string, out: string[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) await walk(full, out)
    else out.push(full)
  }
}

export function orderPages(section: string, pages: string[], explicitOrder?: string[]): string[] {
  if (explicitOrder && explicitOrder.length > 0) {
    const discovered = new Set(pages.map((p) => path.resolve(p)))
    // Navigation determines order, not scope: linked solutions must stay in their own TXT exports.
    const absOrder = [...new Set(explicitOrder.map((p) => path.resolve(p)).filter((p) => discovered.has(p)))]
    const set = new Set(absOrder)
    const rest = pages.filter((p) => !set.has(path.resolve(p))).sort()
    return [...absOrder, ...rest]
  }
  return [...pages].sort()
}

function getSidebarFileOrder(sectionKey: string): string[] {
  const sidebarSection = SIDEBAR[sectionKey as keyof typeof SIDEBAR]
  if (!sidebarSection) return []

  const filePaths: string[] = []
  const contentRoot = path.resolve("src/content")

  function flatten(items: SectionContent[]) {
    for (const item of items) {
      if (item.url && !item.url.startsWith("http")) {
        // Convert sidebar URL to a file path
        const trimmedUrl = item.url.endsWith("/") ? item.url.slice(0, -1) : item.url
        const basePath = path.resolve(contentRoot, trimmedUrl)

        // Check for page.mdx or page/index.mdx
        if (fsSync.existsSync(`${basePath}.mdx`)) {
          filePaths.push(`${basePath}.mdx`)
        } else if (fsSync.existsSync(path.join(basePath, "index.mdx"))) {
          filePaths.push(path.join(basePath, "index.mdx"))
        }
      }
      if (item.children) {
        flatten(item.children)
      }
    }
  }

  sidebarSection.forEach((entry: SectionEntry) => {
    flatten(entry.contents)
  })

  return filePaths
}

async function writeReports(report: Report, reportPath?: string) {
  const jsonPath = path.resolve(reportPath ?? "reports/llms-report.json")
  await fs.mkdir(path.dirname(jsonPath), { recursive: true })
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf-8")
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
