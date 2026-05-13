import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { VALID_FEED_TYPES } from "~/features/feeds/utils/feedOutput.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"

export function getStaticPaths() {
  return VALID_FEED_TYPES.map((type) => ({
    params: { type },
  }))
}

export const GET: APIRoute = async ({ params }) => {
  const type = params.type as DataFeedType

  if (!VALID_FEED_TYPES.includes(type)) {
    return new Response(`Invalid type "${type}"`, { status: 400 })
  }

  const chainCache = await getServerSideChainMetadata(CHAINS)

  const networks: {
    queryString: string
    networkName: string
    chain: string
    networkType: string
  }[] = []

  const seen = new Set<string>()

  for (const chain of Object.values(chainCache)) {
    for (const network of chain.networks ?? []) {
      const queryString = network.queryString
      if (!queryString) continue

      if (seen.has(queryString)) continue
      seen.add(queryString)

      networks.push({
        queryString,
        networkName: network.name,
        chain: network.chain || "",
        networkType: network.networkType || "mainnet",
      })
    }
  }

  // Sort: mainnet first, then testnet
  networks.sort((a, b) => {
    if (a.networkType !== b.networkType) {
      return a.networkType === "mainnet" ? -1 : 1
    }
    return a.queryString.localeCompare(b.queryString)
  })

  const lines: string[] = []

  lines.push(`# Chainlink Feed Addresses Index (${type})`)
  lines.push("")
  lines.push("This document lists all available networks for this feed type.")
  lines.push("")
  lines.push("Each network has a dedicated dataset.")
  lines.push("")
  lines.push("Do not load multiple networks unless required.")
  lines.push("Each file contains the complete dataset for one network.")
  lines.push("")

  lines.push("## Networks")
  lines.push("")

  for (const net of networks) {
    lines.push(`- ${net.queryString} → /data-feeds/feed-addresses/${type}/${net.queryString}.txt`)
    lines.push(`  name: ${net.networkName}`)
    lines.push(`  type: ${net.networkType}`)
    if (net.chain) {
      lines.push(`  chain: ${net.chain}`)
    }
    lines.push("")
  }

  lines.push("## Usage pattern")
  lines.push("")
  lines.push("1. Select a network from the list above")
  lines.push("2. Fetch the corresponding dataset")
  lines.push("3. Filter by feed name as needed")
  lines.push("")

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
