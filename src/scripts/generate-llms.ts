#!/usr/bin/env node
import fsSync from "fs"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "node:url"
import { LLM_SECTIONS_CONFIG, SUPPORTED_LLM_SECTIONS, type LlmsSectionConfig } from "../config/llms.js"
import { SIDEBAR } from "../config/sidebar.js"
import type { SectionEntry, SectionContent } from "../config/sidebar.js"
import { transformPageBodyToMarkdown } from "../lib/markdown/buildMarkdownArtifact.js"
import { unescapeMarkdown } from "../lib/markdown/formatters.js"
import type { MarkdownArtifact } from "../lib/markdown/types.js"
import {
  extractFrontmatter,
  getIsoStringOrUndefined,
  getPageLanguage,
  inferTitleFromPath,
  shouldIncludeInLanguageFile,
  toCanonicalUrl,
  toContentRelative,
} from "../lib/markdown/utils.js"

const SITE_BASE = "https://docs.chain.link"

// Body text uses transformPageBodyToMarkdown, the same function as the Markdown route.
// unescapeMarkdown only cleans the plain-text llms dump after that transform.
export async function renderLlmsPageMarkdown(
  raw: string,
  absFile: string,
  section: string,
  targetLanguage?: string
): Promise<{ markdown: string; transformMode: MarkdownArtifact["transformMode"] }> {
  const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)
  const relFromContent = toContentRelative(absFile)
  const sourceUrl = toCanonicalUrl(section, relFromContent, SITE_BASE)
  const title = fmTitle || inferTitleFromPath(relFromContent)
  const lastModified = getIsoStringOrUndefined(fmLastModified)
  const transformed = await transformPageBodyToMarkdown(body, absFile, {
    siteBase: SITE_BASE,
    targetLanguage,
  })
  const cleanedPlain = unescapeMarkdown(transformed.markdown)
  const headerLines = [
    `# ${title}`,
    `Source: ${sourceUrl}`,
    ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
    "",
  ]

  return {
    markdown: [...headerLines, cleanedPlain.trim()].join("\n"),
    transformMode: transformed.transformMode,
  }
}

// Current pages and the wording in smartcontractkit/documentation#4200.
const CODE_EXAMPLE_DISCLAIMER_MARKERS = [
  "do not use the code in this example",
  "this code represents an example",
  "example code",
  "educational example",
  "educational purposes",
  "community examples",
]

function isCodeExampleDisclaimer(plain: string): boolean {
  if (!plain.includes("as is") || !plain.includes("as available")) return false
  return CODE_EXAMPLE_DISCLAIMER_MARKERS.some((marker) => plain.includes(marker))
}

function isFenceLine(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("```") || trimmed.startsWith("~~~")
}

function blockquotePlainText(lines: string[]): string {
  return lines
    .map((line) => line.replace(/^\s*>\s?/, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

function omitRepeatedDisclaimerBlocks(markdown: string, seen: Set<string>): string {
  const lines = markdown.split("\n")
  const kept: string[] = []
  let index = 0
  let inFence = false

  while (index < lines.length) {
    const line = lines[index]
    if (isFenceLine(line)) {
      inFence = !inFence
      kept.push(line)
      index += 1
      continue
    }

    if (!inFence && line.trim().startsWith(">")) {
      const block: string[] = []
      while (index < lines.length && !isFenceLine(lines[index]) && lines[index].trim().startsWith(">")) {
        block.push(lines[index])
        index += 1
      }
      const plain = blockquotePlainText(block)
      if (isCodeExampleDisclaimer(plain)) {
        if (seen.has(plain)) {
          if (kept.length > 0 && kept[kept.length - 1].trim() === "") kept.pop()
          continue
        }
        seen.add(plain)
      }
      kept.push(...block)
      continue
    }

    kept.push(line)
    index += 1
  }

  return kept.join("\n")
}

// Keep the first copy of each code-example disclaimer where it already appears.
// Drop later copies of that same text.
export function assembleLlmsDocument(pages: string[]): string {
  const seen = new Set<string>()
  return pages.map((page) => omitRepeatedDisclaimerBlocks(page, seen)).join("\n\n---\n\n") + "\n"
}

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
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const sections = args.section ? [args.section] : [...SUPPORTED_LLM_SECTIONS]

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

  report.finishedAt = new Date().toISOString()
  await writeReports(report)
  console.log("LLM generation complete.")
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--section") args.section = argv[++i]
    if (a === "--pages") args.pagesFile = argv[++i]
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

function orderPages(section: string, pages: string[], explicitOrder?: string[]): string[] {
  if (explicitOrder && explicitOrder.length > 0) {
    const absOrder = explicitOrder.map((p) => path.resolve(p))
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

async function writeReports(report: Report) {
  const reportsDir = path.resolve("reports")
  await fs.mkdir(reportsDir, { recursive: true })
  const jsonPath = path.join(reportsDir, "llms-report.json")
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf-8")
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
