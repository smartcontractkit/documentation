/**
 * GET /api/streams/networks?include=testnet
 *
 * Returns supported Data Streams networks and their verifier proxy addresses.
 * See /data-streams/stream-id-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { StreamsNetworksData } from "~/features/feeds/data/StreamsNetworksData.ts"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

function buildNetworksMarkdown(includeTestnet: boolean): string {
  const lines: string[] = [
    "# Chainlink Data Streams — Supported Networks",
    "",
    "Verifier proxy addresses are shared across all Data Streams schema types (Crypto, RWA, NAV, Exchange Rate, Tokenized Asset).",
    "",
    "To verify a report onchain, call the verifier proxy contract on the network where your application is deployed.",
    "See: https://docs.chain.link/data-streams/tutorials/evm-onchain-report-verification",
    "",
    "---",
    "",
    "## Mainnet Networks",
    "",
    "| Network | Label | Verifier Proxy |",
    "|---------|-------|----------------|",
  ]

  for (const entry of StreamsNetworksData) {
    if (entry.isCanton) continue
    if (entry.mainnet?.verifierProxy) {
      lines.push(`| ${entry.network} | ${entry.mainnet.label} | \`${entry.mainnet.verifierProxy}\` |`)
    }
  }

  if (includeTestnet) {
    lines.push(
      "",
      "## Testnet Networks",
      "",
      "| Network | Label | Verifier Proxy |",
      "|---------|-------|----------------|"
    )

    for (const entry of StreamsNetworksData) {
      if (entry.isCanton) continue
      if (entry.testnet?.verifierProxy) {
        lines.push(`| ${entry.network} | ${entry.testnet.label} | \`${entry.testnet.verifierProxy}\` |`)
      }
    }
  }

  lines.push(
    "",
    "---",
    "",
    `Source: https://docs.chain.link/data-streams/supported-networks`,
    `Stream ID API: https://docs.chain.link/data-streams/stream-id-api`
  )

  return lines.join("\n")
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const includeTestnet = url.searchParams.get("include") === "testnet"

  const markdown = buildNetworksMarkdown(includeTestnet)

  return new Response(markdown, {
    status: 200,
    headers: {
      ...textPlainHeaders,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
