import type { APIRoute } from "astro"
import { buildMarkdownDocumentFromPath, markdownHeaders } from "@lib/markdown/buildMarkdownResponse.js"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const requestedId = params.id?.replace(/^\/+|\/+$/g, "") || "index"
  const canonicalPath = requestedId === "index" ? "resources" : `resources/${requestedId}`

  const markdown = await buildMarkdownDocumentFromPath(canonicalPath, request)

  if (!markdown) {
    return new Response("Page not found.", { status: 404 })
  }

  return new Response(markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
