import type { APIRoute } from "astro"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { collectFeedEntries, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as string

  if (!VALID_FEED_TYPES.includes(type as any)) {
    return new Response(`Invalid type "${type}"`, { status: 400 })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)

  const feeds = collectFeedEntries(type as any, null, chainCache)

  return new Response(JSON.stringify(feeds, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  })
}
