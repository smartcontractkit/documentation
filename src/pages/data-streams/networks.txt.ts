import type { APIRoute } from "astro"
import { StreamsNetworksData } from "~/features/feeds/data/StreamsNetworksData.ts"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

export const prerender = false

interface StreamNetworkEntry {
  network: string
  label: string
  verifierProxy: string
}

function getNetworks(): {
  mainnet: StreamNetworkEntry[]
  testnet: StreamNetworkEntry[]
} {
  const mainnet: StreamNetworkEntry[] = []
  const testnet: StreamNetworkEntry[] = []

  for (const entry of StreamsNetworksData) {
    if (entry.isCanton) continue

    if (entry.mainnet?.verifierProxy) {
      mainnet.push({
        network: entry.network,
        label: entry.mainnet.label,
        verifierProxy: entry.mainnet.verifierProxy,
      })
    }

    if (entry.testnet?.verifierProxy) {
      testnet.push({
        network: entry.network,
        label: entry.testnet.label,
        verifierProxy: entry.testnet.verifierProxy,
      })
    }
  }

  return { mainnet, testnet }
}

function buildMarkdown(): string {
  const { mainnet, testnet } = getNetworks()

  const lines: string[] = [
    "# Chainlink Data Streams Networks",
    "",
    "Supported networks and verifier proxy addresses.",
    "",
    "Verifier proxies are shared across all Data Streams categories and schema versions.",
    "",
    "Use the verifier proxy for the network where your application is deployed.",
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

  if (testnet.length > 0) {
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
    "Use this file together with stream ID datasets:",
    "",
    "- /data-streams/stream-ids/{type}.txt",
    "",
    "Stream IDs are universal. Networks provide verifier proxy addresses."
  )

  return lines.join("\n")
}

export const GET: APIRoute = async () => {
  const markdown = buildMarkdown()

  return new Response(markdown, {
    status: 200,
    headers: {
      ...textPlainHeaders,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
