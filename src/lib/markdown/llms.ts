import { transformPageBodyToMarkdown } from "./buildMarkdownArtifact.js"
import { unescapeMarkdown } from "./formatters.js"
import type { DroppedComponent, LlmsRenderObservers, MarkdownArtifact } from "./types.js"
import {
  extractFrontmatter,
  getIsoStringOrUndefined,
  inferTitleFromPath,
  toCanonicalUrl,
  toContentRelative,
} from "./utils.js"

const SITE_BASE = "https://docs.chain.link"

// Body text uses transformPageBodyToMarkdown, the same function as the Markdown route.
// unescapeMarkdown only cleans the plain-text llms dump after that transform.
export async function renderLlmsPageMarkdown(
  raw: string,
  absFile: string,
  section: string,
  targetLanguage?: string,
  observers: LlmsRenderObservers = {}
): Promise<{ markdown: string; transformMode: MarkdownArtifact["transformMode"] }> {
  const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)
  const relFromContent = toContentRelative(absFile)
  const sourceUrl = toCanonicalUrl(section, relFromContent, SITE_BASE)
  const title = fmTitle || inferTitleFromPath(relFromContent)
  const lastModified = getIsoStringOrUndefined(fmLastModified)
  const drops: DroppedComponent[] = []
  const transformed = await transformPageBodyToMarkdown(body, absFile, {
    siteBase: SITE_BASE,
    targetLanguage,
    onDropComponent: observers.onPageRendered ? (drop) => drops.push(drop) : undefined,
  })
  const cleanedPlain = unescapeMarkdown(transformed.markdown)
  const headerLines = [
    `# ${title}`,
    `Source: ${sourceUrl}`,
    ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
    "",
  ]

  const result = {
    markdown: [...headerLines, cleanedPlain.trim()].join("\n"),
    transformMode: transformed.transformMode,
  }
  try {
    observers.onPageRendered?.(absFile, transformed.transformMode, drops)
  } catch {
    // Diagnostics must not change the generated document.
  }

  return result
}

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
export function assembleLlmsDocument(pages: string[], options: { deduplicateDisclaimers?: boolean } = {}): string {
  if (options.deduplicateDisclaimers === false) return pages.join("\n\n---\n\n") + "\n"
  const seen = new Set<string>()
  return pages.map((page) => omitRepeatedDisclaimerBlocks(page, seen)).join("\n\n---\n\n") + "\n"
}
