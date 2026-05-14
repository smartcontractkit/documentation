import type { APIRoute } from "astro"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { collectFeedEntries } from "~/features/feeds/utils/feedOutput.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)

  const type = url.searchParams.get("type") || "default"
  const feed = url.searchParams.get("feed")?.toLowerCase()
  const network = url.searchParams.get("network")

  const chainCache = await getServerSideChainMetadata(CHAINS)

  let feeds = collectFeedEntries(type as any, network || null, chainCache)

  // 🔑 filter by feed name
  if (feed) {
    feeds = feeds.filter((f: any) => f.name?.toLowerCase().includes(feed))
  }

  return new Response(
    JSON.stringify(
      {
        query: {
          type,
          feed: feed || null,
          network: network || null,
        },
        count: feeds.length,
        matches: feeds,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    }
  )
}
