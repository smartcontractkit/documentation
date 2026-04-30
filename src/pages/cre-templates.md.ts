import type { APIRoute } from "astro"
import { buildMarkdownDocumentFromPath, markdownHeaders } from "@lib/markdown/buildMarkdownResponse.js"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const markdown = await buildMarkdownDocumentFromPath("cre/templates", request)

  if (!markdown) {
    return new Response("Page not found.", { status: 404 })
  }

  return new Response(markdown, {
    status: 200,
    headers: markdownHeaders,
  })
}
