import type { APIRoute } from "astro"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { collectStreamEntries } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const rawType = params.type as string
  const internalType = STREAM_CATEGORY_MAP[rawType]

  if (!internalType) {
    return new Response(`Invalid type "${rawType}"`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)

  // --------------------------------------------------
  // CASE 1: Return stream dataset
  // --------------------------------------------------
  const streams = collectStreamEntries(internalType, chainCache, { publicType: rawType } as any)

  // --------------------------------------------------
  // ALSO include self-referencing URL
  // --------------------------------------------------
  const origin = new URL(request.url).origin

  return new Response(
    JSON.stringify(
      {
        type: rawType,
        url: `${origin}/data-streams/stream-ids/${rawType}.json`,
        count: streams.length,
        streams,
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
