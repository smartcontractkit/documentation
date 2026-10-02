const SKIPPED_EXACT_PATHS = new Set(["/api", "/_astro", "/_image", "/_vercel", "/samples"])
const SKIPPED_PREFIXES = ["/api/", "/_astro/", "/_image/", "/_vercel/", "/samples/"]

// A dot means a file only when the last segment ends with one of these.
// Version directories such as v1.6.0 are pages. "0" is not in this list.
const FILE_EXTENSIONS = [
  "avif",
  "css",
  "csv",
  "eot",
  "gif",
  "go",
  "gz",
  "htm",
  "html",
  "ico",
  "jpeg",
  "jpg",
  "js",
  "json",
  "map",
  "md",
  "mdx",
  "mjs",
  "mp3",
  "mp4",
  "otf",
  "pdf",
  "png",
  "py",
  "rs",
  "sol",
  "svg",
  "toml",
  "ts",
  "tsx",
  "ttf",
  "txt",
  "wasm",
  "webm",
  "webmanifest",
  "webp",
  "woff",
  "woff2",
  "xml",
  "yaml",
  "yml",
  "zip",
] as const

const FILE_EXTENSION_SET = new Set<string>(FILE_EXTENSIONS)

// Vercel reads root middleware.ts as text, so that file repeats this string.
// The middleware test checks the two copies match.
const skippedPrefixPattern = SKIPPED_PREFIXES.map((prefix) => prefix.slice(1)).join("|")
const fileExtensionPattern = FILE_EXTENSIONS.join("|")
export const MARKDOWN_NEGOTIATION_MATCHER = `/((?!${skippedPrefixPattern})(?!.*\\.(?:${fileExtensionPattern})$).*)`

export const MARKDOWN_FALLBACK_PARAM = "markdown_fallback"
export const MARKDOWN_FALLBACK_HEADER = "x-markdown-fallback"

function lastSegmentIsFile(segment: string): boolean {
  const dot = segment.lastIndexOf(".")
  if (dot <= 0) return false
  return FILE_EXTENSION_SET.has(segment.slice(dot + 1).toLowerCase())
}

export type MarkdownNegotiation =
  { action: "rewrite"; pathname: string } | { action: "html"; alternatePath: string } | { action: "skip" }

export function acceptsMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false

  for (const part of acceptHeader.split(",")) {
    const [typeToken, ...params] = part.split(";")
    if (typeToken.trim().toLowerCase() !== "text/markdown") continue

    let quality = 1
    for (const param of params) {
      const equalsIndex = param.indexOf("=")
      if (equalsIndex === -1) continue
      const key = param.slice(0, equalsIndex).trim().toLowerCase()
      if (key !== "q") continue
      const parsed = Number(param.slice(equalsIndex + 1).trim())
      if (!Number.isNaN(parsed)) quality = parsed
    }

    if (quality > 0) return true
  }

  return false
}

export function markdownAlternatePath(pathname: string): string | null {
  if (!pathname.startsWith("/")) return null

  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  if (SKIPPED_EXACT_PATHS.has(path) || SKIPPED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return null
  }

  const lastSegment = path.slice(path.lastIndexOf("/") + 1)
  if (lastSegmentIsFile(lastSegment)) return null

  return path === "/" ? "/index.md" : `${path}.md`
}

export function negotiateMarkdown(pathname: string, acceptHeader: string | null): MarkdownNegotiation {
  const alternatePath = markdownAlternatePath(pathname)
  if (!alternatePath) return { action: "skip" }
  if (acceptsMarkdown(acceptHeader)) return { action: "rewrite", pathname: alternatePath }
  return { action: "html", alternatePath }
}
