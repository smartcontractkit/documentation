/**
 * GET /api/streams/ids?type={category}&schema={version}
 *
 * Returns stream IDs in plain markdown for the given category.
 * See /data-streams/stream-id-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, type FeedMarkdownOptions } from "~/features/feeds/utils/feedMarkdown.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

const memoryCache = new Map<string, { content: string; timestamp: number }>()
const MEMORY_CACHE_TTL = 5 * 60 * 1000

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawType = url.searchParams.get("type") ?? "crypto"

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

  const cacheKey = `${internalType}:${schemaFilter ?? "all"}`
  const cached = memoryCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return new Response(cached.content, { status: 200, headers: { ...textPlainHeaders, "X-Cache": "HIT" } })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)
  const markdown = buildFeedAddressMarkdown(internalType, null, chainCache, "https://docs.chain.link", options)

  memoryCache.set(cacheKey, { content: markdown, timestamp: Date.now() })

  return new Response(markdown, { status: 200, headers: { ...textPlainHeaders, "X-Cache": "MISS" } })
}
