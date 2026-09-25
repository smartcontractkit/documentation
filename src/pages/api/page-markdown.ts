/**
 * API endpoint to generate markdown for a single page
 * GET /api/page-markdown?path=/ccip/getting-started
 */

import type { APIRoute } from "astro"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { buildMarkdownArtifact } from "@lib/markdown/buildMarkdownArtifact.js"

// In-memory cache for transformed markdown
// TTL: 5 minutes (matches CDN cache duration)
const markdownCache = new Map<string, { markdown: string; timestamp: number }>()
const CACHE_TTL = 300_000 // 5 minutes in milliseconds

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const startTime = Date.now()

  try {
    const url = new URL(request.url)
    const requestedPath = url.searchParams.get("path")
    const targetLanguage = url.searchParams.get("lang") || undefined

    if (!requestedPath) {
      return new Response(JSON.stringify({ error: "Missing 'path' parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check in-memory cache first (cache key includes language for multi-lang pages)
    const cacheKey = targetLanguage ? `${requestedPath}:${targetLanguage}` : requestedPath
    const cached = markdownCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const processingTime = Date.now() - startTime
      return new Response(cached.markdown, {
        status: 200,
        headers: {
          ...textPlainHeaders,
          "X-Cache": "HIT",
          "X-Processing-Time": `${processingTime}ms`,
        },
      })
    }

    const artifact = await buildMarkdownArtifact(requestedPath, { lang: targetLanguage })
    if (!artifact) {
      return new Response(JSON.stringify({ error: `Page not found: ${requestedPath}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    markdownCache.set(cacheKey, {
      markdown: artifact.markdown,
      timestamp: Date.now(),
    })

    const processingTime = Date.now() - startTime

    return new Response(artifact.markdown, {
      status: 200,
      headers: {
        ...textPlainHeaders,
        "X-Cache": "MISS",
        "X-Processing-Time": `${processingTime}ms`,
      },
    })
  } catch (error) {
    console.error("Error generating markdown:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
