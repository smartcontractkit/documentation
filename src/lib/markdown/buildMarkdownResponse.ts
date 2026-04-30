import fs from "node:fs/promises"
import path from "node:path"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { transformPageToMarkdown } from "@lib/markdown/transformMarkdown.js"
import { extractFrontmatter, getIsoStringOrUndefined, toCanonicalUrl, toContentRelative } from "@lib/markdown/utils.js"

const SITE_BASE = "https://docs.chain.link"
const CONTENT_ROOT = path.resolve("src/content")

export const markdownHeaders = {
  ...textPlainHeaders,
  "Content-Type": "text/markdown; charset=utf-8",
}

export function normalizeMarkdownPath(pathParam: string | undefined): string | null {
  if (!pathParam) return null

  const cleanPath = pathParam.replace(/\.md$/i, "").replace(/^\/+/, "").replace(/\/+$/, "")

  if (!cleanPath) return null

  const segments = cleanPath.split("/")
  if (segments.some((segment) => segment === ".." || segment === "." || segment === "")) {
    return null
  }

  return cleanPath
}

export async function findContentFile(cleanPath: string): Promise<string | null> {
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
    } catch {
      // Try the next possible content path.
    }
  }

  return null
}

export type SpecialResolution = {
  resolvedPath: string
  sourceCanonicalPath: string
}

export async function resolveSpecialCanonicalMarkdownPath(cleanPath: string): Promise<SpecialResolution | null> {
  const specialPathMap: Record<string, string> = {
    "cre-templates": "cre/templates",
  }

  const mappedPath = specialPathMap[cleanPath]
  if (!mappedPath) {
    return null
  }

  const file = await findContentFile(mappedPath)
  if (!file) {
    return null
  }

  return {
    resolvedPath: mappedPath,
    sourceCanonicalPath: cleanPath,
  }
}

export type CreResolution =
  | { kind: "none" }
  | { kind: "resolved"; path: string }
  | { kind: "selector"; goPath: string; tsPath: string }

export async function resolveCreCanonicalMarkdownPath(cleanPath: string): Promise<CreResolution> {
  if (!cleanPath.startsWith("cre/")) {
    return { kind: "none" }
  }

  const direct = await findContentFile(cleanPath)
  if (direct) {
    return { kind: "resolved", path: cleanPath }
  }

  const goPath = `${cleanPath}-go`
  const tsPath = `${cleanPath}-ts`

  const [goFile, tsFile] = await Promise.all([findContentFile(goPath), findContentFile(tsPath)])

  if (goFile && tsFile) {
    return { kind: "selector", goPath, tsPath }
  }

  if (goFile) {
    return { kind: "resolved", path: goPath }
  }

  if (tsFile) {
    return { kind: "resolved", path: tsPath }
  }

  return { kind: "none" }
}

export function buildCreSelectorMarkdown(
  canonicalPath: string,
  resolution: Extract<CreResolution, { kind: "selector" }>
): string {
  const title = titleFromPath(canonicalPath)
  const canonicalUrl = `${SITE_BASE}/${canonicalPath}`
  const goUrl = `/${resolution.goPath}.md`
  const tsUrl = `/${resolution.tsPath}.md`

  return [
    `# ${title}`,
    `Source: ${canonicalUrl}`,
    "",
    "This page has language-specific markdown variants:",
    "",
    `- Go: ${goUrl}`,
    `- TypeScript: ${tsUrl}`,
    "",
  ].join("\n")
}

export function titleFromPath(cleanPath: string): string {
  const lastSegment = cleanPath.split("/").pop() || cleanPath

  return lastSegment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export type MarkdownTarget =
  | { kind: "not-found" }
  | { kind: "selector"; markdown: string }
  | { kind: "resolved"; resolvedPath: string; sourceCanonicalPathOverride?: string }

export async function resolveMarkdownTarget(cleanPath: string): Promise<MarkdownTarget> {
  const specialResolution = await resolveSpecialCanonicalMarkdownPath(cleanPath)
  if (specialResolution) {
    return {
      kind: "resolved",
      resolvedPath: specialResolution.resolvedPath,
      sourceCanonicalPathOverride: specialResolution.sourceCanonicalPath,
    }
  }

  const creResolution = await resolveCreCanonicalMarkdownPath(cleanPath)

  if (creResolution.kind === "selector") {
    return {
      kind: "selector",
      markdown: buildCreSelectorMarkdown(cleanPath, creResolution),
    }
  }

  if (creResolution.kind === "resolved") {
    return {
      kind: "resolved",
      resolvedPath: creResolution.path,
    }
  }

  const file = await findContentFile(cleanPath)
  if (file) {
    return {
      kind: "resolved",
      resolvedPath: cleanPath,
    }
  }

  return { kind: "not-found" }
}

export async function buildMarkdownDocumentFromPath(
  resolvedPath: string,
  request: Request,
  sourceCanonicalPathOverride?: string
): Promise<string | null> {
  const mdxAbsPath = await findContentFile(resolvedPath)

  if (!mdxAbsPath) {
    return null
  }

  const url = new URL(request.url)
  const targetLanguage = url.searchParams.get("lang") || undefined

  const raw = await fs.readFile(mdxAbsPath, "utf-8")
  const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)

  const section = resolvedPath.split("/")[0]
  const transformed = await transformPageToMarkdown(body, mdxAbsPath, {
    siteBase: SITE_BASE,
    targetLanguage,
  })

  const relFromContent = toContentRelative(mdxAbsPath)
  const derivedSourceUrl = toCanonicalUrl(section, relFromContent, SITE_BASE)
  const sourceUrl = sourceCanonicalPathOverride ? `${SITE_BASE}/${sourceCanonicalPathOverride}` : derivedSourceUrl

  const title = fmTitle || path.basename(mdxAbsPath, path.extname(mdxAbsPath))
  const lastModified = getIsoStringOrUndefined(fmLastModified)

  const headerLines = [
    `# ${title}`,
    `Source: ${sourceUrl}`,
    ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
    "",
    "",
  ]

  return [...headerLines, transformed.trim()].join("\n")
}

export async function buildMarkdownResponseFromPath(
  resolvedPath: string,
  request: Request,
  sourceCanonicalPathOverride?: string
): Promise<Response> {
  const markdown = await buildMarkdownDocumentFromPath(resolvedPath, request, sourceCanonicalPathOverride)

  if (!markdown) {
    return new Response("Page not found.", { status: 404 })
  }

  return new Response(markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
