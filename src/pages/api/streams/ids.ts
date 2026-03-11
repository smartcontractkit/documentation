/**
 * GET /api/streams/ids?type={category}&schema={version}&format={markdown|json}
 *
 * Returns stream IDs for the given category.
 * See /data-streams/stream-id-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import {
  buildFeedAddressMarkdown,
  collectStreamEntries,
  FEED_TYPE_LABELS,
  type FeedMarkdownOptions,
} from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

const memoryCache = new Map<string, { content: string; timestamp: number }>()
const MEMORY_CACHE_TTL = 5 * 60 * 1000

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawType = url.searchParams.get("type") ?? "crypto"
  const format = url.searchParams.get("format") ?? "markdown"

  const internalType = STREAM_CATEGORY_MAP[rawType]
  if (!internalType) {
    const valid = Object.keys(STREAM_CATEGORY_MAP).join(", ")
    return new Response(
      `Invalid type "${rawType}". Valid values: ${valid}\n\nFor Data Feeds addresses, see /api/feeds/addresses.`,
      { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    )
  }

  const schemaFilter = url.searchParams.get("schema") || undefined
  const options: FeedMarkdownOptions = { schemaFilter, publicType: rawType }
  const cacheKey = `${internalType}:${schemaFilter ?? "all"}:${format}`

  const cached = memoryCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    const contentType = format === "json" ? "application/json" : textPlainHeaders["Content-Type"]
    return new Response(cached.content, { status: 200, headers: { "Content-Type": contentType, "X-Cache": "HIT" } })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)

  let content: string
  let contentType: string

  if (format === "json") {
    const streams = collectStreamEntries(internalType, chainCache, options)
    const payload = {
      type: rawType,
      label: FEED_TYPE_LABELS[internalType],
      schemaFilter: schemaFilter ?? null,
      count: streams.length,
      streams,
    }
    content = JSON.stringify(payload, null, 2)
    contentType = "application/json"
  } else {
    content = buildFeedAddressMarkdown(internalType, null, chainCache, "https://docs.chain.link", options)
    contentType = textPlainHeaders["Content-Type"]
  }

  memoryCache.set(cacheKey, { content, timestamp: Date.now() })

  return new Response(content, { status: 200, headers: { "Content-Type": contentType, "X-Cache": "MISS" } })
}
