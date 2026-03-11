/**
 * GET /api/streams/networks?include=testnet&format={markdown|json}
 *
 * Returns supported Data Streams networks and their verifier proxy addresses.
 * See /data-streams/stream-id-api for documentation and examples.
 */

import type { APIRoute } from "astro"
import { StreamsNetworksData } from "~/features/feeds/data/StreamsNetworksData.ts"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

interface StreamNetworkEntry {
  network: string
  label: string
  verifierProxy: string
}

function getNetworks(includeTestnet: boolean): {
  mainnet: StreamNetworkEntry[]
  testnet: StreamNetworkEntry[]
} {
  const mainnet: StreamNetworkEntry[] = []
  const testnet: StreamNetworkEntry[] = []

  for (const entry of StreamsNetworksData) {
    if (entry.isCanton) continue
    if (entry.mainnet?.verifierProxy) {
      mainnet.push({ network: entry.network, label: entry.mainnet.label, verifierProxy: entry.mainnet.verifierProxy })
    }
    if (includeTestnet && entry.testnet?.verifierProxy) {
      testnet.push({ network: entry.network, label: entry.testnet.label, verifierProxy: entry.testnet.verifierProxy })
    }
  }

  return { mainnet, testnet }
}

function buildMarkdown(includeTestnet: boolean): string {
  const { mainnet, testnet } = getNetworks(includeTestnet)

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

  for (const n of mainnet) {
    lines.push(`| ${n.network} | ${n.label} | \`${n.verifierProxy}\` |`)
  }

  if (includeTestnet && testnet.length > 0) {
    lines.push(
      "",
      "## Testnet Networks",
      "",
      "| Network | Label | Verifier Proxy |",
      "|---------|-------|----------------|"
    )
    for (const n of testnet) {
      lines.push(`| ${n.network} | ${n.label} | \`${n.verifierProxy}\` |`)
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
  const format = url.searchParams.get("format") ?? "markdown"

  if (format === "json") {
    const { mainnet, testnet } = getNetworks(includeTestnet)
    const payload = includeTestnet ? { mainnet, testnet } : { mainnet }
    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    })
  }

  const markdown = buildMarkdown(includeTestnet)

  return new Response(markdown, {
    status: 200,
    headers: {
      ...textPlainHeaders,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
