import type { APIRoute } from "astro"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { buildMarkdownArtifact } from "@lib/markdown/buildMarkdownArtifact.js"

const markdownHeaders = {
  ...textPlainHeaders,
  "Content-Type": "text/markdown; charset=utf-8",
}

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestPath = params.path
  if (!requestPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const lang = new URL(request.url).searchParams.get("lang") || undefined
  const artifact = await buildMarkdownArtifact(requestPath, { lang })
  if (!artifact) {
    return new Response("Page not found.", { status: 404 })
  }

  return new Response(artifact.markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
