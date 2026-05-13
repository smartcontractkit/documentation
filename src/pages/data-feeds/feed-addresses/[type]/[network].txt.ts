import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"

export const runtime = "nodejs"
export const prerender = false

const INTERNAL_TO_PUBLIC: Record<string, string> = Object.fromEntries(
  Object.entries(STREAM_CATEGORY_MAP).map(([pub, internal]) => [internal, pub])
)

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as DataFeedType
  const network = typeof params.network === "string" ? params.network : null

  if (!VALID_FEED_TYPES.includes(type)) {
    return new Response(`Invalid type "${type}"`, { status: 400 })
  }

  const publicType = INTERNAL_TO_PUBLIC[type] ?? type

  let chainCache: Record<string, any> = {}

  try {
    chainCache = await getServerSideChainMetadata(CHAINS)
  } catch (e) {
    console.error("Failed to fetch chain metadata:", e)
  }

  // ✅ Validate actual usable data (not just object presence)
  const hasNetworks = Object.values(chainCache).some(
    (chain: any) => Array.isArray(chain?.networks) && chain.networks.length > 0
  )

  if (!hasNetworks) {
    console.error("Chain cache missing networks or empty:", chainCache)

    return new Response("# Feed data unavailable\n\nPreview environment could not load network metadata.", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  }

  const markdown = buildFeedAddressMarkdown(type, network, chainCache, "https://docs.chain.link", { publicType })

  // ✅ Guard against empty output (should not happen now, but safe)
  if (!markdown || markdown.trim().length === 0) {
    console.error("Empty markdown output:", { type, network })

    return new Response("# No data returned\n\nThe dataset could not be generated.", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  }

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
