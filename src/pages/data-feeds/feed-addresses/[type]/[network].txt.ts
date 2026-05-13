import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"

export const prerender = false
export const runtime = "nodejs"

export const GET: APIRoute = async () => {
  let chainCache: Record<string, any> = {}

  try {
    chainCache = await getServerSideChainMetadata(CHAINS)
  } catch (e) {
    console.error("FAILED METADATA FETCH:", e)

    return new Response(
      JSON.stringify(
        {
          error: "fetch_failed",
          message: String(e),
        },
        null,
        2
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  const keys = Object.keys(chainCache)

  const sampleKey = keys[0]
  const sample = sampleKey ? chainCache[sampleKey] : null

  const hasNetworks = Object.values(chainCache).some(
    (chain: any) => Array.isArray(chain?.networks) && chain.networks.length > 0
  )

  return new Response(
    JSON.stringify(
      {
        keys,
        sampleKey,
        sample,
        hasNetworks,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
