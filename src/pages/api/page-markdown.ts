/**
 * API endpoint to generate markdown for a single page
 * GET /api/page-markdown?path=/ccip/getting-started
 */

import type { APIRoute } from "astro"
import fs from "fs/promises"
import path from "path"
import { transformPageToMarkdown } from "@lib/markdown/transformMarkdown.js"
import { extractFrontmatter, toCanonicalUrl, toContentRelative, getIsoStringOrUndefined } from "@lib/markdown/utils.js"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

const SITE_BASE = "https://docs.chain.link"

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

    // Convert URL path to file path
    // e.g., "/ccip/getting-started" -> "src/content/ccip/getting-started.mdx"
    const cleanPath = requestedPath.startsWith("/") ? requestedPath.slice(1) : requestedPath
    const possiblePaths = [
      path.resolve(`src/content/${cleanPath}.mdx`),
      path.resolve(`src/content/${cleanPath}/index.mdx`),
      path.resolve(`src/content/${cleanPath}.md`),
      path.resolve(`src/content/${cleanPath}/index.md`),
    ]

    let mdxAbsPath: string | null = null
    for (const p of possiblePaths) {
      try {
        await fs.access(p)
        mdxAbsPath = p
        break
      } catch {
        // File doesn't exist, try next
      }
    }

    if (!mdxAbsPath) {
      return new Response(JSON.stringify({ error: `Page not found: ${requestedPath}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Read the MDX file
    const raw = await fs.readFile(mdxAbsPath, "utf-8")
    const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)

    // Extract section from path (first segment)
    const section = cleanPath.split("/")[0]

    // Transform to markdown
    const transformed = await transformPageToMarkdown(body, mdxAbsPath, {
      siteBase: SITE_BASE,
      targetLanguage,
    })

    // Generate metadata
    const relFromContent = toContentRelative(mdxAbsPath)
    const sourceUrl = toCanonicalUrl(section, relFromContent, SITE_BASE)
    const title = fmTitle || path.basename(mdxAbsPath, path.extname(mdxAbsPath))
    const lastModified = getIsoStringOrUndefined(fmLastModified)

    // Format output with frontmatter
    const headerLines = [
      `# ${title}`,
      `Source: ${sourceUrl}`,
      ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
      "",
      "",
    ]

    // Detect FeedPage components — the interactive table is dynamically loaded and cannot be
    // rendered server-side. Append pointers to machine-readable endpoints so LLMs and Copy
    // Page consumers can retrieve actual data.
    const feedPageMatch = raw.match(/<FeedPage[^>]*dataFeedType=["']([^"']+)["']/)
    const feedType = feedPageMatch?.[1] ?? "default"

    // Map internal stream DataFeedType values to public API type names
    const STREAM_INTERNAL_TO_PUBLIC: Record<string, string> = {
      streamsCrypto: "crypto",
      streamsRwa: "rwa",
      streamsNav: "smartdata",
      streamsExRate: "exchangeRate",
      streamsBacked: "tokenizedAsset",
    }
    const isStreams = feedType in STREAM_INTERNAL_TO_PUBLIC
    const publicType = STREAM_INTERNAL_TO_PUBLIC[feedType]

    const feedsNote = /<FeedPage/.test(raw)
      ? isStreams
        ? [
            "",
            "---",
            "",
            "## Stream Feed IDs",
            "",
            "The interactive stream table on this page is loaded dynamically and is not included in this markdown export.",
            `Stream feed IDs are available in machine-readable format. See the full API reference at ${SITE_BASE}/data-streams/stream-id-api`,
            "",
            `- **All stream IDs (markdown):** \`${SITE_BASE}/api/streams/ids?type=${publicType}\``,
            `- **All stream IDs (JSON):** \`${SITE_BASE}/api/streams/ids?type=${publicType}&format=json\``,
            `- **Supported networks & verifier proxies (JSON):** \`${SITE_BASE}/api/streams/networks?format=json\``,
            "",
            "Stream IDs are universal — the same feed ID is valid across all supported networks.",
            "",
          ].join("\n")
        : [
            "",
            "---",
            "",
            "## Feed Contract Addresses",
            "",
            "The interactive address table on this page is loaded dynamically and is not included in this markdown export.",
            `Feed addresses are available in machine-readable format. See the full API reference at ${SITE_BASE}/data-feeds/feed-address-api`,
            "",
            `- **All networks (markdown):** \`${SITE_BASE}/api/feeds/addresses?type=${feedType}\``,
            `- **Mainnet only (JSON):** \`${SITE_BASE}/api/feeds/addresses?type=${feedType}&networkType=mainnet&format=json\``,
            `- **Single network (JSON):** \`${SITE_BASE}/api/feeds/addresses?type=${feedType}&network={queryString}&format=json\``,
            `- **Available networks & queryStrings:** \`${SITE_BASE}/api/feeds/networks?type=${feedType}&format=json\``,
            "",
          ].join("\n")
      : ""

    const finalMarkdown = [...headerLines, transformed.trim(), feedsNote].join("\n")

    // Store in cache (cache key includes language for multi-lang pages)
    markdownCache.set(cacheKey, {
      markdown: finalMarkdown,
      timestamp: Date.now(),
    })

    const processingTime = Date.now() - startTime

    return new Response(finalMarkdown, {
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
