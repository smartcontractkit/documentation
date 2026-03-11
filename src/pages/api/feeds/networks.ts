/**
 * GET /api/feeds/networks?type={feedType}
 *
 * Returns all network queryStrings for the given feed type, split by mainnet and testnet.
 * See /data-feeds/feed-address-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { CHAINS } from "~/features/data/chains.ts"
import type { DataFeedType } from "~/features/feeds/components/FeedList.tsx"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

const SITE_BASE = "https://docs.chain.link"

const VALID_TYPES: DataFeedType[] = [
  "default",
  "smartdata",
  "rates",
  "streamsCrypto",
  "streamsRwa",
  "streamsNav",
  "streamsExRate",
  "streamsBacked",
  "tokenizedEquity",
  "usGovernmentMacroeconomicData",
]

// Map DataFeedType values to the chain-level tag used in chains.ts
function feedTypeToChainTag(type: DataFeedType): string {
  if (
    type === "streamsCrypto" ||
    type === "streamsRwa" ||
    type === "streamsNav" ||
    type === "streamsExRate" ||
    type === "streamsBacked"
  )
    return "streams"
  if (type === "smartdata") return "smartData"
  if (type === "rates") return "rates"
  if (type === "usGovernmentMacroeconomicData") return "usGovernmentMacroeconomicData"
  if (type === "tokenizedEquity") return "tokenizedEquity"
  return "default"
}

interface NetworkEntry {
  queryString: string
  networkName: string
  chainTitle: string
  chainPage: string
}

function getNetworks(typeFilter: DataFeedType | null): {
  mainnet: NetworkEntry[]
  testnet: NetworkEntry[]
} {
  const mainnet: NetworkEntry[] = []
  const testnet: NetworkEntry[] = []

  for (const chain of CHAINS) {
    // If a type filter is given, skip chains whose tags don't include the relevant tag
    if (typeFilter) {
      const tag = feedTypeToChainTag(typeFilter)
      if (!chain.tags?.includes(tag as never)) continue
    }

    for (const network of chain.networks) {
      if (!network.rddUrl && !network.queryString) continue

      const entry: NetworkEntry = {
        queryString: network.queryString,
        networkName: network.name,
        chainTitle: chain.title,
        chainPage: chain.page,
      }

      if (network.networkType === "mainnet") {
        mainnet.push(entry)
      } else {
        testnet.push(entry)
      }
    }
  }

  return { mainnet, testnet }
}

function buildMarkdown(typeFilter: DataFeedType | null): string {
  const lines: string[] = []
  const { mainnet, testnet } = getNetworks(typeFilter)

  const typeClause = typeFilter ? ` for type \`${typeFilter}\`` : ""
  const addressesBase = `${SITE_BASE}/api/feeds/addresses`
  const typeParam = typeFilter ? `?type=${typeFilter}` : "?type=default"

  lines.push(`# Chainlink Feed Networks${typeClause}`)
  lines.push(`Source: ${SITE_BASE}/api/feeds/networks${typeFilter ? `?type=${typeFilter}` : ""}`)
  lines.push("")
  lines.push(`> All available network \`queryString\` values${typeClause}.`)
  lines.push(`> Use these with the addresses endpoint: \`${addressesBase}${typeParam}&network={queryString}\``)
  if (!typeFilter) {
    lines.push(`> Filter this list by feed type: \`${SITE_BASE}/api/feeds/networks?type={feedType}\``)
    lines.push(`> Valid types: ${VALID_TYPES.join(", ")}`)
  }
  lines.push("")

  lines.push("## Mainnet Networks")
  lines.push("")
  lines.push("| queryString | Network Name | Chain |")
  lines.push("|-------------|--------------|-------|")
  for (const n of mainnet) {
    lines.push(`| \`${n.queryString}\` | ${n.networkName} | ${n.chainTitle} |`)
  }
  lines.push("")

  lines.push("## Testnet Networks")
  lines.push("")
  lines.push("| queryString | Network Name | Chain |")
  lines.push("|-------------|--------------|-------|")
  for (const n of testnet) {
    lines.push(`| \`${n.queryString}\` | ${n.networkName} | ${n.chainTitle} |`)
  }
  lines.push("")

  return lines.join("\n")
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const rawType = url.searchParams.get("type")

  if (rawType && !VALID_TYPES.includes(rawType as DataFeedType)) {
    return new Response(`Invalid type "${rawType}". Valid values: ${VALID_TYPES.join(", ")}`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const typeFilter = rawType ? (rawType as DataFeedType) : null
  const markdown = buildMarkdown(typeFilter)

  return new Response(markdown, {
    status: 200,
    headers: textPlainHeaders,
  })
}
