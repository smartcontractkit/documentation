/**
 * GET /api/feeds/addresses?type={feedType}&network={queryString}
 *
 * Returns feed contract addresses in plain markdown.
 * See /data-feeds/feed-address-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, VALID_FEED_TYPES } from "~/features/feeds/utils/feedMarkdown.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

const memoryCache = new Map<string, { content: string; timestamp: number }>()
const MEMORY_CACHE_TTL = 5 * 60 * 1000

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawType = url.searchParams.get("type") ?? "default"
  const networkFilter = url.searchParams.get("network") || null

  if (!VALID_FEED_TYPES.includes(rawType as DataFeedType)) {
    return new Response(`Invalid type "${rawType}". Valid values: ${VALID_FEED_TYPES.join(", ")}`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const type = rawType as DataFeedType
  const cacheKey = `${type}:${networkFilter ?? "all"}`

  const cached = memoryCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return new Response(cached.content, { status: 200, headers: { ...textPlainHeaders, "X-Cache": "HIT" } })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)
  const markdown = buildFeedAddressMarkdown(type, networkFilter, chainCache)

  memoryCache.set(cacheKey, { content: markdown, timestamp: Date.now() })

  return new Response(markdown, { status: 200, headers: { ...textPlainHeaders, "X-Cache": "MISS" } })
}
