import type { APIRoute } from "astro"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { collectFeedEntries, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const type = params.type as string

  if (!VALID_FEED_TYPES.includes(type as any)) {
    return new Response(`Invalid type "${type}"`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const url = new URL(request.url)
  const networkFilter = url.searchParams.get("network") || null

  const chainCache = await getServerSideChainMetadata(CHAINS)

  const feeds = collectFeedEntries(type as any, networkFilter, chainCache)

  return new Response(JSON.stringify(feeds, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  })
}
