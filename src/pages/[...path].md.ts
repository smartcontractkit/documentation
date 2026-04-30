import type { APIRoute } from "astro"
import {
  buildMarkdownResponseFromPath,
  markdownHeaders,
  normalizeMarkdownPath,
  resolveMarkdownTarget,
} from "@lib/markdown/buildMarkdownResponse.js"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  console.log("[global md catch-all hit]", params.path)
  const cleanPath = normalizeMarkdownPath(params.path)

  if (!cleanPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const target = await resolveMarkdownTarget(cleanPath)

  if (target.kind === "not-found") {
    return new Response("Page not found.", { status: 404 })
  }

  if (target.kind === "selector") {
    return new Response(target.markdown, {
      status: 200,
      headers: markdownHeaders,
    })
  }

  return buildMarkdownResponseFromPath(target.resolvedPath, request, target.sourceCanonicalPathOverride)
}
