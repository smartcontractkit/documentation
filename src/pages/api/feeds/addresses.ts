/**
 * GET /api/feeds/addresses?type={feedType}&network={queryString}&format={markdown|json}
 *
 * Returns feed contract addresses for the given type.
 * See /data-feeds/feed-address-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import {
  buildFeedAddressMarkdown,
  collectFeedEntries,
  FEED_TYPE_LABELS,
  VALID_FEED_TYPES,
} from "~/features/feeds/utils/feedMarkdown.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

const memoryCache = new Map<string, { content: string; timestamp: number }>()
const MEMORY_CACHE_TTL = 5 * 60 * 1000

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawType = url.searchParams.get("type") ?? "default"
  const networkFilter = url.searchParams.get("network") || null
  const format = url.searchParams.get("format") ?? "markdown"
  const rawNetworkType = url.searchParams.get("networkType") || null
  const networkType = rawNetworkType === "mainnet" || rawNetworkType === "testnet" ? rawNetworkType : undefined

  if (!VALID_FEED_TYPES.includes(rawType as DataFeedType)) {
    return new Response(`Invalid type "${rawType}". Valid values: ${VALID_FEED_TYPES.join(", ")}`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const type = rawType as DataFeedType
  const cacheKey = `${type}:${networkFilter ?? "all"}:${networkType ?? "all"}:${format}`

  const cached = memoryCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    const contentType = format === "json" ? "application/json" : textPlainHeaders["Content-Type"]
    return new Response(cached.content, { status: 200, headers: { "Content-Type": contentType, "X-Cache": "HIT" } })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)

  let content: string
  let contentType: string

  if (format === "json") {
    const feeds = collectFeedEntries(type, networkFilter, chainCache, { networkType })
    const payload = {
      type,
      label: FEED_TYPE_LABELS[type],
      network: networkFilter,
      networkType: networkType ?? null,
      count: feeds.length,
      feeds,
    }
    content = JSON.stringify(payload, null, 2)
    contentType = "application/json"
  } else {
    content = buildFeedAddressMarkdown(type, networkFilter, chainCache, "https://docs.chain.link", { networkType })
    contentType = textPlainHeaders["Content-Type"]
  }

  memoryCache.set(cacheKey, { content, timestamp: Date.now() })

  return new Response(content, { status: 200, headers: { "Content-Type": contentType, "X-Cache": "MISS" } })
}
