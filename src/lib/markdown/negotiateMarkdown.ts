const SKIPPED_EXACT_PATHS = new Set(["/api", "/_astro", "/_image", "/_vercel", "/samples"])
const SKIPPED_PREFIXES = ["/api/", "/_astro/", "/_image/", "/_vercel/", "/samples/"]

// Keep this aligned with the root middleware matcher. Dotted paths are files.
export const MARKDOWN_NEGOTIATION_MATCHER = "/((?!_astro/|_image/|_vercel/|api/|samples/)(?!.*\\.).*)"

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
  if (lastSegment.includes(".")) return null

  return path === "/" ? "/index.md" : `${path}.md`
}

export function negotiateMarkdown(pathname: string, acceptHeader: string | null): MarkdownNegotiation {
  const alternatePath = markdownAlternatePath(pathname)
  if (!alternatePath) return { action: "skip" }
  if (acceptsMarkdown(acceptHeader)) return { action: "rewrite", pathname: alternatePath }
  return { action: "html", alternatePath }
}
