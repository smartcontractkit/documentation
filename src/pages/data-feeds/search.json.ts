import type { APIRoute } from "astro"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { collectFeedEntries, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)

  const type = url.searchParams.get("type") || "default"
  const network = url.searchParams.get("network")

  // --------------------------------------------------
  // 🚨 HARD ENFORCEMENT: network is REQUIRED
  // --------------------------------------------------
  if (!network) {
    return new Response(
      JSON.stringify(
        {
          error: "Missing required 'network' parameter.",
          instruction:
            "First fetch /data-feeds/networks.json to obtain a valid network queryString, then call /data-feeds/search.json?type={type}&network={queryString}.",
        },
        null,
        2
      ),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  if (!VALID_FEED_TYPES.includes(type as any)) {
    return new Response(
      JSON.stringify(
        {
          error: `Invalid type "${type}"`,
          validTypes: VALID_FEED_TYPES,
        },
        null,
        2
      ),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)

  // --------------------------------------------------
  // 🔑 ALWAYS return FULL dataset for the network
  // --------------------------------------------------
  const feeds = collectFeedEntries(type as any, network, chainCache)

  return new Response(
    JSON.stringify(
      {
        type,
        network,
        count: feeds.length,
        feeds,
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
