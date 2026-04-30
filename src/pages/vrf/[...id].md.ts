import type { APIRoute } from "astro"
import { buildMarkdownDocumentFromPath, markdownHeaders } from "@lib/markdown/buildMarkdownResponse.js"

export const prerender = false

function normalizeParam(value: string | undefined) {
  return value?.replace(/^\/+|\/+$/g, "") || "index"
}

export const GET: APIRoute = async ({ params, request }) => {
  const requestedId = normalizeParam(params.id)
  const canonicalPath = requestedId === "index" ? "vrf" : `vrf/${requestedId}`

  console.log("[vrf nested md route hit]", { id: params.id, canonicalPath })

  const markdown = await buildMarkdownDocumentFromPath(canonicalPath, request)

  if (!markdown) {
    return new Response("Page not found.", { status: 404 })
  }

  return new Response(markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
