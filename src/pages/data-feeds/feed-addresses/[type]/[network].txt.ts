/**
 * Static snapshots of feed addresses per network, pre-rendered at build time.
 * Served at /data-feeds/feed-addresses/{type}/{network}.txt
 *
 * For always-live data use the dynamic endpoint: /api/feeds/addresses
 */

import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"

// Reverse map: internal → public
const INTERNAL_TO_PUBLIC: Record<string, string> = Object.fromEntries(
  Object.entries(STREAM_CATEGORY_MAP).map(([pub, internal]) => [internal, pub])
)

// ✅ Build-time route generation
export async function getStaticPaths() {
  const chainCache = await getServerSideChainMetadata(CHAINS)

  const paths: { params: { type: string; network: string } }[] = []
  const seen = new Set<string>()

  for (const type of VALID_FEED_TYPES) {
    for (const chain of Object.values(chainCache)) {
      const networks = (chain as any).networks ?? []

      for (const network of networks) {
        const queryString = network.queryString
        if (!queryString) continue

        const key = `${type}:${queryString}`
        if (seen.has(key)) continue
        seen.add(key)

        paths.push({
          params: {
            type,
            network: queryString,
          },
        })
      }
    }
  }

  return paths
}

// ❌ IMPORTANT: no `prerender = false` here
// this must run at build time

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as DataFeedType
  const network = typeof params.network === "string" ? params.network : null

  if (!VALID_FEED_TYPES.includes(type)) {
    return new Response(`Invalid type "${type}"`, { status: 400 })
  }

  const publicType = INTERNAL_TO_PUBLIC[type]

  // ✅ Safe at build time (filesystem allowed)
  const chainCache = await getServerSideChainMetadata(CHAINS)

  const markdown = buildFeedAddressMarkdown(type, network, chainCache, "https://docs.chain.link", { publicType })

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Long CDN cache — content only changes on redeploy
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
