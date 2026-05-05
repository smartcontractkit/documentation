import type { APIRoute } from "astro"
import fs from "node:fs/promises"
import path from "node:path"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { transformPageToMarkdown } from "@lib/markdown/transformMarkdown.js"
import { extractFrontmatter, getIsoStringOrUndefined, toCanonicalUrl, toContentRelative } from "@lib/markdown/utils.js"

const SITE_BASE = "https://docs.chain.link"
const CONTENT_ROOT = path.resolve("src/content")
const LLMS_DIRECTIVE = "> For the complete documentation index, see [llms.txt](/llms.txt)."

const MARKDOWN_REDIRECTS: Record<string, string> = {
  "ccip/tutorials/cross-chain-tokens": "ccip/tutorials/evm/cross-chain-tokens",
}

const markdownHeaders = {
  ...textPlainHeaders,
  "Content-Type": "text/markdown; charset=utf-8",
}

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const cleanPath = normalizeMarkdownPath(params.path)

  if (!cleanPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const specialResolution = await resolveSpecialCanonicalMarkdownPath(cleanPath)
  if (specialResolution) {
    return buildMarkdownResponseFromPath(specialResolution.resolvedPath, request, specialResolution.sourceCanonicalPath)
  }

  const creResolution = await resolveCreCanonicalMarkdownPath(cleanPath)

  if (creResolution.kind === "selector") {
    return new Response(buildCreSelectorMarkdown(cleanPath, creResolution), {
      status: 200,
      headers: markdownHeaders,
    })
  }

  const resolvedPath = creResolution.kind === "resolved" ? creResolution.path : cleanPath
  return buildMarkdownResponseFromPath(resolvedPath, request)
}

async function buildMarkdownResponseFromPath(
  resolvedPath: string,
  request: Request,
  sourceCanonicalPathOverride?: string
): Promise<Response> {
  const markdownRedirectTarget = MARKDOWN_REDIRECTS[resolvedPath]

  if (markdownRedirectTarget) {
    return buildMarkdownMovedResponse(resolvedPath, markdownRedirectTarget)
  }

  const mdxAbsPath = await findContentFile(resolvedPath)

  if (!mdxAbsPath) {
    return new Response("Page not found.", { status: 404 })
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
    LLMS_DIRECTIVE,
    "",
  ]

  return new Response([...headerLines, transformed.trim()].join("\n"), {
    status: 200,
    headers: markdownHeaders,
  })
}

function normalizeMarkdownPath(pathParam: string | undefined): string | null {
  if (!pathParam) return null

  const cleanPath = pathParam.replace(/\.md$/i, "").replace(/^\/+/, "").replace(/\/+$/, "")

  if (!cleanPath) return null

  const segments = cleanPath.split("/")
  if (segments.some((segment) => segment === ".." || segment === "." || segment === "")) {
    return null
  }

  return cleanPath
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
    } catch {
      // Try the next possible content path.
    }
  }

  return null
}

type SpecialResolution = {
  resolvedPath: string
  sourceCanonicalPath: string
}

async function resolveSpecialCanonicalMarkdownPath(cleanPath: string): Promise<SpecialResolution | null> {
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

type CreResolution =
  | { kind: "none" }
  | { kind: "resolved"; path: string }
  | { kind: "selector"; goPath: string; tsPath: string }

async function resolveCreCanonicalMarkdownPath(cleanPath: string): Promise<CreResolution> {
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

function buildMarkdownMovedResponse(sourcePath: string, targetPath: string): Response {
  const sourceTitle = titleFromPath(sourcePath)
  const targetTitle = titleFromPath(targetPath)
  const sourceUrl = `${SITE_BASE}/${sourcePath}`
  const targetUrl = `/${targetPath}.md`

  return new Response(
    [
      `# ${sourceTitle}`,
      `Source: ${sourceUrl}`,
      "",
      LLMS_DIRECTIVE,
      "",
      "This page has moved.",
      "",
      `Use the current documentation: [${targetTitle}](${targetUrl}).`,
      "",
    ].join("\n"),
    {
      status: 200,
      headers: markdownHeaders,
    }
  )
}

function buildCreSelectorMarkdown(
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
    LLMS_DIRECTIVE,
    "",
    "This page has language-specific markdown variants:",
    "",
    `- Go: ${goUrl}`,
    `- TypeScript: ${tsUrl}`,
    "",
  ].join("\n")
}

function titleFromPath(cleanPath: string): string {
  const lastSegment = cleanPath.split("/").pop() || cleanPath

  return lastSegment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
