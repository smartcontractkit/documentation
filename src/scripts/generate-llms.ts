#!/usr/bin/env node
import fs from "fs/promises"
import path from "path"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMdx from "remark-mdx"
import remarkGfm from "remark-gfm"
import remarkStringify from "remark-stringify"
import { visit } from "unist-util-visit"
import type { Node, Parent, Literal } from "unist"
import { LLM_SECTIONS_CONFIG, SUPPORTED_LLM_SECTIONS, type LlmsSectionConfig } from "../config/llms.js"
import { SIDEBAR } from "../config/sidebar.js"
import type { SectionEntry, SectionContent } from "../config/sidebar.js"
import fsSync from "fs"
import { stripHighlightComments, unescapeMarkdown } from "../lib/markdown/index.js"

interface MdxJsxAttribute {
  name: string
  value?: string | { value: string } | { data?: { estree?: { body?: unknown[] } } }
}

interface MdxJsxNode extends Node {
  name?: string
  attributes?: MdxJsxAttribute[]
}

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
          const { body, fmTitle, fmLastModified, sdkLang } = extractFrontmatter(raw)
          const pageLanguage = getPageLanguage(absFile, sdkLang)

          // Skip if this page doesn't belong to this language
          if (!shouldIncludeInLanguageFile(pageLanguage, lang)) continue

          const relFromContent = toContentRelative(absFile)
          const sourceUrl = toCanonicalUrl(section, relFromContent)
          const title = fmTitle || inferTitleFromPath(relFromContent)
          const lastModified = getIsoStringOrUndefined(fmLastModified)

          const cleaned = await transformMarkdown(body, absFile, lang)
          const cleanedPlain = unescapeMarkdown(cleaned)

          const headerLines = [
            `# ${title}`,
            `Source: ${sourceUrl}`,
            ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
            "",
          ]

          outputs.push([...headerLines, cleanedPlain.trim()].join("\n"))
          processed += 1
        }

        const finalOutput = outputs.join("\n\n---\n\n") + "\n"
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
        const relFromContent = toContentRelative(absFile)
        const sourceUrl = toCanonicalUrl(section, relFromContent)

        const raw = await fs.readFile(absFile, "utf-8")
        const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)
        const title = fmTitle || inferTitleFromPath(relFromContent)
        const lastModified = getIsoStringOrUndefined(fmLastModified)

        const cleaned = await transformMarkdown(body, absFile)
        const cleanedPlain = unescapeMarkdown(cleaned)

        const headerLines = [
          `# ${title}`,
          `Source: ${sourceUrl}`,
          ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
          "",
        ]

        outputs.push([...headerLines, cleanedPlain.trim()].join("\n"))
        processed += 1
      }

      const finalOutput = outputs.join("\n\n---\n\n") + "\n"
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

function extractFrontmatter(raw: string): {
  body: string
  fmTitle?: string
  fmLastModified?: string
  sdkLang?: string
} {
  // Lightweight frontmatter extractor to avoid extra deps
  // Supports triple-dash YAML frontmatter at the start of the file
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3)
    if (end > 0) {
      const fm = raw.slice(3, end).trim()
      const body = raw.slice(end + 4)
      // Very minimal parsing for title, metadata.lastModified, and sdkLang
      const fmTitleMatch = fm.match(/^\s*title:\s*"?(.+?)"?\s*$/m)
      const lastModMatch = fm.match(/^\s*metadata:\s*[\s\S]*?lastModified:\s*"?(.+?)"?\s*$/m)
      const sdkLangMatch = fm.match(/^\s*sdkLang:\s*"?(.+?)"?\s*$/m)
      const fmTitle = fmTitleMatch ? fmTitleMatch[1] : undefined
      const fmLastModified = lastModMatch ? lastModMatch[1] : undefined
      const sdkLang = sdkLangMatch ? sdkLangMatch[1] : undefined
      return { body, fmTitle, fmLastModified, sdkLang }
    }
  }
  return { body: raw }
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

function toContentRelative(absFile: string): string {
  const idx = absFile.indexOf(path.normalize("src/content/"))
  return idx >= 0 ? absFile.slice(idx + "src/content/".length) : absFile
}

function toCanonicalUrl(section: string, relFromContent: string): string {
  // relFromContent like "ccip/index.mdx" or "ccip/foo/bar.mdx"
  const withoutExt = relFromContent.replace(/\.(md|mdx)$/i, "")
  let slug = withoutExt
  if (slug.endsWith("/index")) slug = slug.slice(0, -"/index".length)
  if (!slug.startsWith(section)) slug = `${section}/${slug}`
  if (!slug.startsWith("/")) slug = `/${slug}`
  return `${SITE_BASE}${slug}`
}

function inferTitleFromPath(relFromContent: string): string {
  const base = path.basename(relFromContent, path.extname(relFromContent))
  if (base.toLowerCase() === "index") {
    const parts = relFromContent.split(path.sep).filter(Boolean)
    return parts.length >= 2 ? titleCase(parts[parts.length - 2]) : "Documentation"
  }
  return titleCase(base)
}

function titleCase(s: string): string {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function getPageLanguage(absFile: string, sdkLang?: string): string | null {
  // Return the language if specified in frontmatter
  if (sdkLang) return sdkLang.toLowerCase()

  // Check filename suffix (e.g., "page-go.mdx" -> "go", "page-ts.mdx" -> "ts")
  const basename = path.basename(absFile, path.extname(absFile))
  const match = basename.match(/-(go|ts)$/)
  if (match) return match[1]

  // No language specified = common to all languages
  return null
}

function shouldIncludeInLanguageFile(pageLanguage: string | null, targetLanguage: string): boolean {
  // Include if page is common (no language) or matches target language
  return pageLanguage === null || pageLanguage === targetLanguage
}

function getIsoStringOrUndefined(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined
  const d = new Date(val)
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10)
}

// Load CcipCommon callout mapping dynamically from CcipCommon.astro
function loadCcipCommonMapping(): Record<string, string> {
  try {
    const astroFilePath = path.resolve("src/features/ccip/CcipCommon.astro")
    const astroContent = fsSync.readFileSync(astroFilePath, "utf-8")

    // First, build a map of Component names to file paths from imports
    const importRegex = /import\s+(\w+)\s+from\s+["'](.+?)["']/g
    const componentToFile: Record<string, string> = {}

    for (const match of astroContent.matchAll(importRegex)) {
      const [, componentName, filePath] = match
      const cleanPath = filePath.replace(/^\.\//, "")
      componentToFile[componentName] = cleanPath
    }

    // Then, parse the conditional statements to map callout names to component names
    const conditionalRegex = /callout\s+===\s+["'](\w+)["']\s+&&\s+<(\w+)/g
    const mapping: Record<string, string> = {}

    for (const match of astroContent.matchAll(conditionalRegex)) {
      const [, calloutName, componentName] = match
      const filePath = componentToFile[componentName]
      if (filePath) {
        mapping[calloutName] = filePath
      }
    }

    return mapping
  } catch (e) {
    console.warn("Failed to load CcipCommon mapping:", e)
    return {}
  }
}

async function transformMarkdown(markdown: string, mdxAbsPath: string, targetLanguage?: string): Promise<string> {
  // Pre-process: Replace CcipCommon callouts with their actual content
  // This is done BEFORE AST parsing because remarkMdx doesn't always parse them correctly
  const ccipCommonRegex = /<CcipCommon\s+callout="(\w+)"\s*\/>/g
  let preprocessedMarkdown = markdown

  for (const match of markdown.matchAll(ccipCommonRegex)) {
    const [fullMatch, calloutName] = match
    const calloutFileMap = loadCcipCommonMapping()
    const fileName = calloutFileMap[calloutName]

    if (fileName) {
      const calloutPath = path.resolve("src/features/ccip", fileName)
      if (fsSync.existsSync(calloutPath)) {
        let calloutContent = fsSync.readFileSync(calloutPath, "utf-8")

        // Strip frontmatter if present
        if (calloutContent.trim().startsWith("---")) {
          calloutContent = calloutContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
        }

        // Strip import statements
        calloutContent = calloutContent.replace(/^import\s+.+$/gm, "").trim()

        // Replace the CcipCommon tag with the raw content
        preprocessedMarkdown = preprocessedMarkdown.replace(fullMatch, "\n\n" + calloutContent + "\n\n")
      }
    }
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(() => (tree: Node) => {
      visit(tree, (node: Node, index: number | undefined, parent: Parent | undefined) => {
        if (
          parent &&
          typeof index === "number" &&
          node.type === "mdxJsxFlowElement" &&
          (node as MdxJsxNode).name === "CodeHighlightBlockMulti"
        ) {
          try {
            const languagesAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "languages")
            if (languagesAttr && targetLanguage) {
              // Extract the code variable name for the target language
              // The structure is: languages={{ go: { code: goVar }, ts: { code: tsVar } }}
              const attrValue = languagesAttr.value
              const estreeBody =
                typeof attrValue === "object" && attrValue && "data" in attrValue
                  ? attrValue.data?.estree?.body?.[0]
                  : undefined
              const languagesObj =
                estreeBody && typeof estreeBody === "object" && "expression" in estreeBody
                  ? (estreeBody.expression as { properties?: unknown })?.properties
                  : undefined

              if (languagesObj) {
                for (const langProp of languagesObj as Record<string, unknown>[]) {
                  const langKey =
                    (langProp.key as { name?: string; value?: string })?.name ||
                    (langProp.key as { name?: string; value?: string })?.value
                  if (langKey === targetLanguage) {
                    const codeProperty = (
                      langProp.value as { properties?: Record<string, unknown>[] }
                    )?.properties?.find((p) => (p.key as { name?: string })?.name === "code")
                    const codeVarName = (codeProperty?.value as { name?: string })?.name

                    if (codeVarName) {
                      // Find the import statement for this variable
                      const importRegex = new RegExp(`import\\s+${codeVarName}\\s+from\\s+['"](.+?)['"]`)
                      const match = markdown.match(importRegex)

                      if (match) {
                        const importPath = match[1].split("?")[0] // Strip "?raw"
                        const codeAbsPath = path.resolve(path.dirname(mdxAbsPath), importPath)
                        let codeContent = fsSync.readFileSync(codeAbsPath, "utf-8")

                        // Strip highlighter comments
                        codeContent = stripHighlightComments(codeContent)

                        // Infer language from file extension
                        const fileExt = path.extname(codeAbsPath).slice(1)
                        const lang = fileExt || targetLanguage

                        // Create a code block for this language
                        const newNodes: Node[] = []
                        newNodes.push({
                          type: "code",
                          lang,
                          value: codeContent.trim(),
                        } as Literal)

                        parent.children.splice(index, 1, ...newNodes)
                        return index + newNodes.length
                      }
                    }
                    break
                  }
                }
              }
            }
          } catch (e) {
            console.warn(`Failed to process CodeHighlightBlockMulti in ${mdxAbsPath}:`, e)
          }
        }

        // Handle CodeHighlightBlock imports
        if (
          parent &&
          typeof index === "number" &&
          node.type === "mdxJsxFlowElement" &&
          (node as MdxJsxNode).name === "CodeHighlightBlock"
        ) {
          try {
            const codeVarAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "code")
            const codeVarName = (
              codeVarAttr?.value as { data?: { estree?: { body?: { expression?: { name?: string } }[] } } }
            )?.data?.estree?.body?.[0]?.expression?.name
            if (codeVarName) {
              const importRegex = new RegExp(`import\\s+${codeVarName}\\s+from\\s+['"](.+?)['"]`)
              const match = markdown.match(importRegex)
              if (match) {
                const importPath = match[1].split("?")[0] // Strip "?raw" and other query params
                const codeAbsPath = path.resolve(path.dirname(mdxAbsPath), importPath)
                let codeContent = fsSync.readFileSync(codeAbsPath, "utf-8")
                // Strip highlighter comments
                codeContent = stripHighlightComments(codeContent)
                const langAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "lang")
                const titleAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "title")
                const newNodes: Node[] = []
                if (titleAttr) {
                  const title = `Code snippet for ${titleAttr.value}:`
                  newNodes.push({ type: "paragraph", children: [{ type: "text", value: title } as Literal] } as Parent)
                }
                newNodes.push({
                  type: "code",
                  lang: langAttr?.value || "",
                  value: codeContent.trim(),
                } as Literal)
                parent.children.splice(index, 1, ...newNodes)
                return index + newNodes.length
              }
            }
          } catch (e) {
            console.warn(`Failed to process CodeHighlightBlock in ${mdxAbsPath}:`, e)
          }
        }

        // Handle CcipCommon component - inline the referenced markdown content
        if (
          parent &&
          typeof index === "number" &&
          node.type === "mdxJsxFlowElement" &&
          (node as MdxJsxNode).name === "CcipCommon"
        ) {
          try {
            const calloutAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "callout")
            const calloutValue = typeof calloutAttr?.value === "string" ? calloutAttr.value : undefined

            if (calloutValue) {
              // Load mapping dynamically from CcipCommon.astro
              const calloutFileMap = loadCcipCommonMapping()

              const fileName = calloutFileMap[calloutValue]

              if (fileName) {
                const calloutPath = path.resolve("src/features/ccip", fileName)

                if (fsSync.existsSync(calloutPath)) {
                  let calloutContent = fsSync.readFileSync(calloutPath, "utf-8")

                  // Strip frontmatter/imports from the callout file
                  calloutContent = calloutContent.replace(/^import\s+.+$/gm, "").trim()

                  // Parse the callout markdown and insert it
                  const calloutTree = processor.parse(calloutContent)
                  if (calloutTree && (calloutTree as Parent).children) {
                    parent.children.splice(index, 1, ...(calloutTree as Parent).children)
                    return index + (calloutTree as Parent).children.length
                  }
                }
              }
            }
          } catch (e) {
            console.warn(`Failed to process CcipCommon in ${mdxAbsPath}:`, e)
          }
        }

        // Handle MDX JSX text elements (like <div> tags in MDX)
        if (node.type === "mdxJsxTextElement") {
          const nodeName = (node as MdxJsxNode).name
          // Skip <a> tags - preserve them as-is for links in Aside components and elsewhere
          // Handle <div> tags (often used for styling in tables) - extract text content
          if (nodeName === "div" && parent && typeof index === "number" && (node as Parent).children) {
            // Replace the <div> element with just its text content
            parent.children.splice(index, 1, ...(node as Parent).children)
            return index
          }
        }

        // Handle CodeSample component - inline the code from public/{src}
        if (
          parent &&
          typeof index === "number" &&
          node.type === "mdxJsxFlowElement" &&
          (node as MdxJsxNode).name === "CodeSample"
        ) {
          try {
            const srcAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "src")
            const langAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "lang")

            if (srcAttr?.value) {
              const srcValue = typeof srcAttr.value === "string" ? srcAttr.value : undefined

              if (srcValue) {
                const publicDir = path.resolve(process.cwd(), "public")
                const codePath = path.join(publicDir, srcValue)

                if (fsSync.existsSync(codePath)) {
                  let codeContent = fsSync.readFileSync(codePath, "utf-8")

                  // Strip highlighter comments
                  codeContent = stripHighlightComments(codeContent)

                  // Determine language from lang attribute or file extension
                  let lang = typeof langAttr?.value === "string" ? langAttr.value : undefined
                  if (!lang) {
                    const ext = path.extname(codePath).slice(1)
                    lang = ext || "text"
                  }

                  // Replace with code block
                  parent.children[index] = {
                    type: "code",
                    lang,
                    value: codeContent.trim(),
                  } as Literal

                  return
                }
              }
            }
          } catch (e) {
            console.warn(`Failed to process CodeSample in ${mdxAbsPath}:`, e)
          }
        }

        // Handle CopyText inline component - extract the text attribute
        if (
          parent &&
          typeof index === "number" &&
          node.type === "mdxJsxTextElement" &&
          (node as MdxJsxNode).name === "CopyText"
        ) {
          const textAttr = (node as MdxJsxNode).attributes?.find((a) => a.name === "text")
          if (textAttr?.value) {
            const attrValue = textAttr.value
            const textValue =
              typeof attrValue === "string"
                ? attrValue
                : typeof attrValue === "object" && attrValue && "value" in attrValue
                  ? attrValue.value
                  : ""
            parent.children[index] = { type: "text", value: textValue } as Literal
            return
          }
        }

        // Drop MDX/import/export nodes (but preserve Aside and CcipCommon components which are handled above)
        if (
          (node.type === "mdxJsxFlowElement" &&
            (node as MdxJsxNode).name !== "Aside" &&
            (node as MdxJsxNode).name !== "CcipCommon") ||
          node.type === "mdxjsEsm" ||
          node.type === "import" ||
          node.type === "export"
        ) {
          if (parent && typeof index === "number") parent.children.splice(index, 1)
          return
        }

        // Handle HTML nodes - for any remaining HTML, just drop them
        if (node.type === "html") {
          if (parent && typeof index === "number") {
            parent.children.splice(index, 1)
            return
          }
        }

        // Replace images with their alt text
        if (node.type === "image") {
          const alt = (node as { alt?: string }).alt ? String((node as { alt?: string }).alt) : "Image"
          if (parent && typeof index === "number")
            parent.children[index] = { type: "text", value: `(Image: ${alt})` } as Literal
        }

        // Note: We preserve link nodes as-is so they're rendered as markdown links [text](url)
      })
    })
    .use(remarkStringify, {
      fences: true,
      bullet: "-",
    })

  const file = await processor.process(preprocessedMarkdown)
  return String(file)
}

async function writeReports(report: Report) {
  const reportsDir = path.resolve("reports")
  await fs.mkdir(reportsDir, { recursive: true })
  const jsonPath = path.join(reportsDir, "llms-report.json")
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf-8")
}

// Run
main().catch((err) => {
  console.error(err)
  process.exit(1)
})
