import type { APIRoute } from "astro"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { buildMarkdownArtifact, normalizeMarkdownPath } from "@lib/markdown/buildMarkdownArtifact.js"
import { MARKDOWN_FALLBACK_HEADER, MARKDOWN_FALLBACK_PARAM } from "@lib/markdown/negotiateMarkdown.js"
import { toContentEntryId } from "@lib/ccip/contentPathMapping.js"
import { LATEST_CCIP_CONTENT_DIR } from "@config/ccipVersions.js"
import { ccipRedirects } from "@config/redirects/ccip.js"
import redirectsJson from "@features/redirects/redirects.json" with { type: "json" }

const markdownHeaders = {
  ...textPlainHeaders,
  "Content-Type": "text/markdown; charset=utf-8",
}

const isCcipPath = (p: string) => p === "ccip" || p.startsWith("ccip/")
const trimSlashes = (p: string) => p.replace(/^\/+/, "").replace(/\/+$/, "")

// The site's CCIP redirects (redirects.json, then Astro config, which wins as it does on the site), so moved pages
// such as today's production URLs keep resolving: internal targets get their .md, absolute URLs are used as-is.
const CCIP_MARKDOWN_REDIRECTS = new Map<string, string>()
for (const [source, destination] of [
  ...redirectsJson.redirects.map((r) => [r.source, r.destination] as const),
  ...Object.entries(ccipRedirects).map(([source, r]) => [source, r.destination] as const),
]) {
  const from = trimSlashes(source)
  if (!isCcipPath(from)) continue
  if (/^https?:\/\//.test(destination)) {
    CCIP_MARKDOWN_REDIRECTS.set(from, destination)
    continue
  }
  const to = trimSlashes(destination.split(/[?#]/)[0])
  if (to && to !== from) CCIP_MARKDOWN_REDIRECTS.set(from, `/${to}.md`)
}

export const prerender = false

function plainNotFound(): Response {
  return new Response("Page not found.", { status: 404 })
}

function wantsHtmlFallback(request: Request, url: URL): boolean {
  return url.searchParams.get(MARKDOWN_FALLBACK_PARAM) === "1" || request.headers.get(MARKDOWN_FALLBACK_HEADER) === "1"
}

function htmlPathForMarkdown(pathParam: string | undefined): string {
  const cleaned = normalizeMarkdownPath(pathParam)
  // "/" is rewritten to /index.md. There is no home markdown file.
  if (!cleaned || cleaned === "index") return "/"
  return `/${cleaned}`
}

async function htmlFallback(request: Request, htmlPath: string): Promise<Response> {
  const htmlUrl = new URL(request.url)
  htmlUrl.pathname = htmlPath
  htmlUrl.searchParams.delete(MARKDOWN_FALLBACK_PARAM)

  const headers = new Headers()
  headers.set("accept", "text/html")
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) headers.set("accept-language", acceptLanguage)

  try {
    const htmlResponse = await fetch(htmlUrl, { headers, redirect: "manual", signal: AbortSignal.timeout(20000) })
    const outHeaders = new Headers(htmlResponse.headers)
    // The HTML pass adds a Link to the .md URL. That file is the one we just missed.
    outHeaders.delete("link")
    outHeaders.delete("content-encoding")
    outHeaders.delete("content-length")
    outHeaders.set("cache-control", "private, no-store")
    outHeaders.set("cdn-cache-control", "no-store")
    outHeaders.set("vercel-cdn-cache-control", "no-store")
    return new Response(htmlResponse.body, { status: htmlResponse.status, headers: outHeaders })
  } catch {
    return new Response("Page not found.", { status: 404 })
  }
}

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url)
  const fallback = wantsHtmlFallback(request, url)
  url.searchParams.delete(MARKDOWN_FALLBACK_PARAM)
  const lang = url.searchParams.get("lang") || undefined

  const notFound = () => (fallback ? htmlFallback(request, htmlPathForMarkdown(params.path)) : plainNotFound())

  const requestPath = normalizeMarkdownPath(params.path)
  if (!requestPath) return notFound()

  // Direct /ccip/v2/* paths are not canonical (vercel.json 301s them to /ccip/*); reject here too.
  if (requestPath === `ccip/${LATEST_CCIP_CONTENT_DIR}` || requestPath.startsWith(`ccip/${LATEST_CCIP_CONTENT_DIR}/`)) {
    return notFound()
  }

  // CCIP latest content lives on disk under /v2; map canonical "ccip/x" -> "ccip/v2/x" (v1 unchanged).
  const lookupPath = isCcipPath(requestPath)
    ? `ccip/${toContentEntryId(requestPath.replace(/^ccip\/?/, ""))}`
    : requestPath

  const artifact = await buildMarkdownArtifact(lookupPath, { lang })
  if (!artifact) {
    // A moved CCIP page 301s like its HTML page does, one hop at a time.
    const redirectTarget = CCIP_MARKDOWN_REDIRECTS.get(requestPath)
    if (redirectTarget) {
      return new Response(null, {
        status: 301,
        headers: {
          ...markdownHeaders,
          Location: redirectTarget.startsWith("/") ? `${redirectTarget}${url.search}` : redirectTarget,
        },
      })
    }
    return notFound()
  }

  return new Response(artifact.markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
