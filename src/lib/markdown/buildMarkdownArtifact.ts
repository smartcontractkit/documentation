import fs from "node:fs/promises"
import path from "node:path"
import { transformPageToMarkdown } from "./transformMarkdown.js"
import type { MarkdownArtifact } from "./types.js"
import { extractFrontmatter, getIsoStringOrUndefined, toCanonicalUrl, toContentRelative } from "./utils.js"

const SITE_BASE = "https://docs.chain.link"
const CONTENT_ROOT = path.resolve("src/content")
const LLMS_DIRECTIVE = "> For the complete documentation index, see [llms.txt](/llms.txt)."

const MARKDOWN_REDIRECTS: Record<string, string> = {
  "ccip/tutorials/cross-chain-tokens": "ccip/tutorials/evm/cross-chain-tokens",

  // Data Streams
  "data-streams/getting-started": "data-streams/tutorials/streams-trade/getting-started",
  "data-streams/getting-started-hardhat": "data-streams/tutorials/streams-trade/getting-started-hardhat",
  "data-streams/reference/streams-direct/streams-direct-onchain-verification":
    "data-streams/reference/onchain-verification",

  // Newly surfaced redirects
  "chainlink-functions/resources/concepts": "chainlink-functions/resources",
  "cre/getting-started/conclusion": "cre/getting-started",
  "data-streams/reference/streams-direct/streams-direct-interface-ws": "data-streams/reference/interface-ws",
}

type TransformOutcome = Pick<MarkdownArtifact, "markdown" | "transformMode">

type SpecialResolution = {
  resolvedPath: string
  sourceCanonicalPath: string
  sourcePath: string
}

type CreResolution =
  | { kind: "none" }
  | { kind: "resolved"; path: string; sourcePath: string }
  | { kind: "selector"; goPath: string; tsPath: string }

export function normalizeMarkdownPath(pathParam: string | undefined): string | null {
  if (!pathParam) return null

  let start = 0
  let end = pathParam.length
  while (start < end && pathParam[start] === "/") start++
  while (end > start && pathParam[end - 1] === "/") end--
  const cleanPath = pathParam.slice(start, end)

  if (!cleanPath || /\.(?:md|mdx)$/i.test(cleanPath)) return null

  const segments = cleanPath.split("/")
  if (segments.some((segment) => segment === ".." || segment === "." || segment === "")) {
    return null
  }

  return cleanPath
}

export async function buildMarkdownArtifact(
  requestPath: string,
  options: { lang?: string } = {}
): Promise<MarkdownArtifact | null> {
  const cleanPath = normalizeMarkdownPath(requestPath)
  if (!cleanPath) return null

  const specialResolution = await resolveSpecialCanonicalMarkdownPath(cleanPath)
  if (specialResolution) {
    return buildMarkdownArtifactFromPath(
      cleanPath,
      specialResolution.resolvedPath,
      "special",
      options,
      specialResolution.sourcePath,
      specialResolution.sourceCanonicalPath
    )
  }

  const creResolution = await resolveCreCanonicalMarkdownPath(cleanPath)
  if (creResolution.kind === "selector") {
    return {
      requestPath: cleanPath,
      routeKind: "selector",
      transformMode: "normal",
      markdown: buildCreSelectorMarkdown(cleanPath, creResolution),
    }
  }

  const resolvedPath = creResolution.kind === "resolved" ? creResolution.path : cleanPath
  const redirectTarget = MARKDOWN_REDIRECTS[resolvedPath]
  if (redirectTarget) {
    return {
      requestPath: cleanPath,
      routeKind: "redirect",
      transformMode: "normal",
      markdown: buildMarkdownMovedBody(resolvedPath, redirectTarget),
    }
  }

  return buildMarkdownArtifactFromPath(
    cleanPath,
    resolvedPath,
    "normal",
    options,
    creResolution.kind === "resolved" ? creResolution.sourcePath : undefined
  )
}

export async function transformPageBodyToMarkdown(
  body: string,
  mdxAbsPath: string,
  options: { siteBase?: string; targetLanguage?: string } = {}
): Promise<TransformOutcome> {
  if (mdxAbsPath.includes("data-feeds/deprecating-feeds")) {
    return {
      transformMode: "replacement",
      markdown: `
## Deprecated Feeds

This page contains dynamically generated or component-heavy content.

For the full and most up-to-date information, see:
https://docs.chain.link/data-feeds/deprecating-feeds
`.trim(),
    }
  }

  const transformOptions = {
    siteBase: options.siteBase ?? SITE_BASE,
    targetLanguage: options.targetLanguage,
  }

  try {
    return {
      transformMode: "normal",
      markdown: await transformPageToMarkdown(body, mdxAbsPath, transformOptions),
    }
  } catch {
    const sanitizedBody = stripRuntimeMdxSyntax(body)

    try {
      return {
        transformMode: "sanitized",
        markdown: await transformPageToMarkdown(sanitizedBody, mdxAbsPath, transformOptions),
      }
    } catch {
      return {
        transformMode: "fallback",
        markdown: buildFallbackMarkdownBody(sanitizedBody),
      }
    }
  }
}

async function resolveSpecialCanonicalMarkdownPath(cleanPath: string): Promise<SpecialResolution | null> {
  const specialPathMap: Record<string, string> = {
    "cre-templates": "cre/templates",
  }

  const resolvedPath = specialPathMap[cleanPath]
  if (!resolvedPath) return null

  const sourcePath = await findContentFile(resolvedPath)
  if (!sourcePath) return null

  return {
    resolvedPath,
    sourceCanonicalPath: cleanPath,
    sourcePath,
  }
}

async function resolveCreCanonicalMarkdownPath(cleanPath: string): Promise<CreResolution> {
  if (!cleanPath.startsWith("cre/")) {
    return { kind: "none" }
  }

  const direct = await findContentFile(cleanPath)
  if (direct) {
    return { kind: "resolved", path: cleanPath, sourcePath: direct }
  }

  const goPath = `${cleanPath}-go`
  const tsPath = `${cleanPath}-ts`
  const [goFile, tsFile] = await Promise.all([findContentFile(goPath), findContentFile(tsPath)])

  if (goFile && tsFile) {
    return { kind: "selector", goPath, tsPath }
  }

  if (goFile) {
    return { kind: "resolved", path: goPath, sourcePath: goFile }
  }

  if (tsFile) {
    return { kind: "resolved", path: tsPath, sourcePath: tsFile }
  }

  return { kind: "none" }
}

async function buildMarkdownArtifactFromPath(
  requestPath: string,
  resolvedPath: string,
  routeKind: "normal" | "special",
  options: { lang?: string },
  knownSourcePath?: string,
  sourceCanonicalPathOverride?: string
): Promise<MarkdownArtifact | null> {
  const sourcePath = knownSourcePath ?? (await findContentFile(resolvedPath))
  if (!sourcePath) return null

  const raw = await fs.readFile(sourcePath, "utf-8")
  const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)
  const transformed = await transformPageBodyToMarkdown(body, sourcePath, {
    siteBase: SITE_BASE,
    targetLanguage: options.lang,
  })

  const section = resolvedPath.split("/")[0]
  const relFromContent = toContentRelative(sourcePath)
  const derivedSourceUrl = toCanonicalUrl(section, relFromContent, SITE_BASE)
  const sourceUrl = sourceCanonicalPathOverride ? `${SITE_BASE}/${sourceCanonicalPathOverride}` : derivedSourceUrl
  const title = fmTitle || path.basename(sourcePath, path.extname(sourcePath))
  const lastModified = getIsoStringOrUndefined(fmLastModified)
  const headerLines = [
    `# ${title}`,
    `Source: ${sourceUrl}`,
    ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
    "",
    LLMS_DIRECTIVE,
    "",
  ]

  return {
    requestPath,
    routeKind,
    transformMode: transformed.transformMode,
    sourcePath: relFromContent,
    markdown: [...headerLines, transformed.markdown.trim()].join("\n"),
  }
}

async function findContentFile(cleanPath: string): Promise<string | null> {
  const possiblePaths = [
    path.resolve(CONTENT_ROOT, `${cleanPath}.mdx`),
    path.resolve(CONTENT_ROOT, cleanPath, "index.mdx"),
    path.resolve(CONTENT_ROOT, `${cleanPath}.md`),
    path.resolve(CONTENT_ROOT, cleanPath, "index.md"),
  ]

  for (const candidate of possiblePaths) {
    if (!candidate.startsWith(`${CONTENT_ROOT}${path.sep}`)) continue
    try {
      await fs.access(candidate)
      return candidate
    } catch {}
  }

  return null
}

function buildFallbackMarkdownBody(body: string): string {
  return stripRuntimeMdxSyntax(body)
    .replace(/<\/?[A-Z][^>]*>/g, "")
    .trim()
}

function stripRuntimeMdxSyntax(body: string): string {
  const lines = body.split("\n")
  const output: string[] = []
  let skippingExportBlock = false
  let skippingImportBlock = false
  let braceDepth = 0

  for (const line of lines) {
    const trimmed = line.trim()

    if (skippingImportBlock) {
      if (trimmed.includes(" from ") || trimmed.endsWith('"') || trimmed.endsWith("'")) {
        skippingImportBlock = false
      }
      continue
    }

    if (skippingExportBlock) {
      braceDepth += countChar(line, "{")
      braceDepth -= countChar(line, "}")

      if (braceDepth <= 0) {
        skippingExportBlock = false
        braceDepth = 0
      }
      continue
    }

    if (/^import\s+/.test(trimmed)) {
      if (!trimmed.includes(" from ")) skippingImportBlock = true
      continue
    }

    if (/^export\s+(async\s+)?function\s+/.test(trimmed)) {
      skippingExportBlock = true
      braceDepth = countChar(line, "{") - countChar(line, "}")
      continue
    }

    if (/^export\s+(const|let|var)\s+/.test(trimmed)) {
      continue
    }

    output.push(line)
  }

  return output.join("\n")
}

function countChar(value: string, char: string): number {
  return value.split(char).length - 1
}

function buildMarkdownMovedBody(sourcePath: string, targetPath: string): string {
  const sourceUrl = `${SITE_BASE}/${sourcePath}`
  const targetUrl = `/${targetPath}.md`

  return [
    "# Redirect",
    `Source: ${sourceUrl}`,
    "",
    LLMS_DIRECTIVE,
    "",
    "This page has moved.",
    "",
    `Use the current documentation: [${targetPath}](${targetUrl}).`,
    "",
  ].join("\n")
}

function buildCreSelectorMarkdown(canonicalPath: string, resolution: { goPath: string; tsPath: string }): string {
  const canonicalUrl = `${SITE_BASE}/${canonicalPath}`
  return [
    `# ${canonicalPath}`,
    `Source: ${canonicalUrl}`,
    "",
    LLMS_DIRECTIVE,
    "",
    `- Go: /${resolution.goPath}.md`,
    `- TypeScript: /${resolution.tsPath}.md`,
    "",
  ].join("\n")
}
