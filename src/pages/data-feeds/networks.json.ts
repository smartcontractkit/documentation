import type { APIRoute } from "astro"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"

export const prerender = false

export const GET: APIRoute = async () => {
  const chainCache = await getServerSideChainMetadata(CHAINS)

  const mainnet: any[] = []
  const testnet: any[] = []

  Object.values(chainCache).forEach((chain: any) => {
    ;(chain.networks || []).forEach((network: any) => {
      const entry = {
        queryString: network.queryString,
        networkName: network.networkName,
        chain: chain.chain,
      }

      if (network.networkType === "testnet") {
        testnet.push(entry)
      } else {
        mainnet.push(entry)
      }
    })
  })

  return new Response(JSON.stringify({ mainnet, testnet }, null, 2), {
    headers: { "Content-Type": "application/json" },
  })
}
