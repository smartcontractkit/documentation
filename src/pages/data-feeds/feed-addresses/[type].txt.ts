/**
 * Static snapshots of feed addresses, pre-rendered at build time.
 * Served at /data-feeds/feed-addresses/{type}.txt
 *
 * For always-live data use the dynamic endpoint: /api/feeds/addresses?type={type}
 */

import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"

// Reverse map: internal DataFeedType → public API name (e.g. "streamsCrypto" → "crypto")
const INTERNAL_TO_PUBLIC: Record<string, string> = Object.fromEntries(
  Object.entries(STREAM_CATEGORY_MAP).map(([pub, internal]) => [internal, pub])
)

export function getStaticPaths() {
  return VALID_FEED_TYPES.map((type) => ({ params: { type } }))
}

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as DataFeedType
  const publicType = INTERNAL_TO_PUBLIC[type]
  const chainCache = await getServerSideChainMetadata(CHAINS)
  const markdown = buildFeedAddressMarkdown(type, null, chainCache, "https://docs.chain.link", {
    publicType,
  })

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Long CDN cache — content only changes on redeploy
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
