import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"

export const prerender = false

const INTERNAL_TO_PUBLIC: Record<string, string> = Object.fromEntries(
  Object.entries(STREAM_CATEGORY_MAP).map(([pub, internal]) => [internal, pub])
)

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as DataFeedType
  const network = params.network ?? null

  if (!VALID_FEED_TYPES.includes(type)) {
    return new Response(`Invalid type "${type}"`, { status: 400 })
  }

  const publicType = INTERNAL_TO_PUBLIC[type] ?? type

  const chainCache = await getServerSideChainMetadata(CHAINS)

  if (!chainCache || Object.keys(chainCache).length === 0) {
    return new Response("Failed to load feed data", { status: 500 })
  }

  const markdown = buildFeedAddressMarkdown(type, network, chainCache, "https://docs.chain.link", { publicType })

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
