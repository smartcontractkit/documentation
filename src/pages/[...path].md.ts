import type { APIRoute } from "astro"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { buildMarkdownArtifact, normalizeMarkdownPath } from "@lib/markdown/buildMarkdownArtifact.js"
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

export const GET: APIRoute = async ({ params, request }) => {
  const requestPath = normalizeMarkdownPath(params.path)
  if (!requestPath) {
    return new Response("Page not found.", { status: 404 })
  }

  // Direct /ccip/v2/* paths are not canonical (vercel.json 301s them to /ccip/*); reject here too.
  if (requestPath === `ccip/${LATEST_CCIP_CONTENT_DIR}` || requestPath.startsWith(`ccip/${LATEST_CCIP_CONTENT_DIR}/`)) {
    return new Response("Page not found.", { status: 404 })
  }

  // CCIP latest content lives on disk under /v2; map canonical "ccip/x" -> "ccip/v2/x" (v1 unchanged).
  const lookupPath = isCcipPath(requestPath)
    ? `ccip/${toContentEntryId(requestPath.replace(/^ccip\/?/, ""))}`
    : requestPath

  const url = new URL(request.url)
  const lang = url.searchParams.get("lang") || undefined
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
    return new Response("Page not found.", { status: 404 })
  }

  return new Response(artifact.markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
