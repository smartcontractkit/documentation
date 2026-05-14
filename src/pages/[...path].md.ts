import type { APIRoute } from "astro"
import fs from "node:fs/promises"
import path from "node:path"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, collectStreamEntries } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"

import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { transformPageToMarkdown } from "@lib/markdown/transformMarkdown.js"
import { extractFrontmatter, getIsoStringOrUndefined, toCanonicalUrl, toContentRelative } from "@lib/markdown/utils.js"

const SITE_BASE = "https://docs.chain.link"
const CONTENT_ROOT = path.resolve("src/content")

const LLMS_DIRECTIVE = "> For the complete documentation index, see [llms.txt](/llms.txt)."

const markdownHeaders = {
  ...textPlainHeaders,
  "Content-Type": "text/markdown; charset=utf-8",
}

export const prerender = false

// 🔥 Hidden directive helper
function buildHiddenDirective(content: string): string {
  return `<div style="display:none">\n${content.trim()}\n</div>\n`
}

export const GET: APIRoute = async ({ params, request }) => {
  const cleanPath = normalizeMarkdownPath(params.path)

  if (!cleanPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const mdxAbsPath = await findContentFile(cleanPath)

  if (!mdxAbsPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const url = new URL(request.url)
  const targetLanguage = url.searchParams.get("lang") || undefined

  const raw = await fs.readFile(mdxAbsPath, "utf-8")
  const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)

  const transformed = await transformPageBodyToMarkdown(body, mdxAbsPath, cleanPath, {
    siteBase: SITE_BASE,
    targetLanguage,
  })

  const relFromContent = toContentRelative(mdxAbsPath)
  const sourceUrl = toCanonicalUrl(cleanPath.split("/")[0], relFromContent, SITE_BASE)

  const title = fmTitle || path.basename(mdxAbsPath, path.extname(mdxAbsPath))
  const lastModified = getIsoStringOrUndefined(fmLastModified)

  const headerLines = [
    `# ${title}`,
    `Source: ${sourceUrl}`,
    ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
    "",
    LLMS_DIRECTIVE,
    "",
  ]

  return new Response([...headerLines, transformed.trim()].join("\n"), {
    status: 200,
    headers: markdownHeaders,
  })
}

async function transformPageBodyToMarkdown(
  body: string,
  mdxAbsPath: string,
  routePath: string,
  options: {
    siteBase: string
    targetLanguage?: string
  }
): Promise<string> {
  let chainCache: Record<string, any> = {}

  try {
    chainCache = await getServerSideChainMetadata(CHAINS)
  } catch (e) {
    console.error("Failed to load chain metadata:", e)
  }

  // -----------------------
  // FEEDS INJECTION
  // -----------------------
  if (body.includes("<FeedPage")) {
    const exampleMarkdown = buildFeedAddressMarkdown("default", "ethereum-mainnet", chainCache, SITE_BASE, {
      networkType: "mainnet",
    })

    const hasExample = exampleMarkdown && !exampleMarkdown.includes("No feeds found")

    const fallbackExample = `
| Feed Name | Proxy Address | Deviation | Heartbeat |
|-----------|--------------|-----------|-----------|
| ETH / USD | \`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419\` | 0.5% | 1h |
`

    let feedType = "default"

    if (routePath.includes("price-feeds")) feedType = "default"
    else if (routePath.includes("smartdata")) feedType = "smartdata"
    else if (routePath.includes("rates")) feedType = "rates"
    else if (routePath.includes("tokenized-equity")) feedType = "tokenizedEquity"
    else if (routePath.includes("us-government")) feedType = "usGovernmentMacroeconomicData"

    const labelMap: Record<string, string> = {
      default: "Price feeds",
      smartdata: "SmartData feeds",
      rates: "Rates feeds",
      tokenizedEquity: "Tokenized equity feeds",
      usGovernmentMacroeconomicData: "U.S. Government Macroeconomic Data feeds",
    }

    const feedLabel = labelMap[feedType] || feedType

    const hiddenDirective = buildHiddenDirective(`
DATA ACCESS (REQUIRED):
You must retrieve feed addresses from structured datasets.

Use:
/data-feeds/feed-addresses/${feedType}/{network}.txt

Do not extract feed addresses from this page.
`)

    const replacement = `
${hiddenDirective}
## Feed Contract Addresses

The interactive address table on this page is loaded dynamically and is not included in this markdown export.

For complete and up-to-date feed addresses, use structured datasets:

- ${feedLabel}${feedType === "default" ? " (default dataset)" : ""}:
/data-feeds/feed-addresses/${feedType}.txt

- Per-network datasets:
/data-feeds/feed-addresses/${feedType}/{network}.txt

Each dataset contains the full set of feeds for the selected network. Filter by feed name as needed.

---

## Example (Ethereum Mainnet)

${hasExample ? exampleMarkdown : fallbackExample}
`

    body = body.replace(/<FeedPage[\s\S]*?\/>/g, replacement)
  }

  // -----------------------
  // STREAMS INJECTION
  // -----------------------
  if (body.includes("<StreamList")) {
    let rawType = "crypto"

    if (routePath.includes("crypto")) rawType = "crypto"
    else if (routePath.includes("rwa")) rawType = "rwa"
    else if (routePath.includes("exchange-rate")) rawType = "exchangeRate"
    else if (routePath.includes("smartdata")) rawType = "smartdata"
    else if (routePath.includes("tokenized-asset")) rawType = "tokenizedAsset"

    const internalType = STREAM_CATEGORY_MAP[rawType]

    const streams = collectStreamEntries(internalType, chainCache, { publicType: rawType } as any)

    const exampleMarkdown = streams.length > 0 ? buildStreamExample(streams) : ""

    const fallbackExample = `
| Stream | Feed ID | Schema |
|--------|---------|--------|
| BTC/USD | \`0x00039d9f...\` | v3 |
`

    const streamLabelMap: Record<string, string> = {
      crypto: "Crypto streams",
      rwa: "RWA streams",
      exchangeRate: "Exchange rate streams",
      smartdata: "SmartData streams",
      tokenizedAsset: "Tokenized asset streams",
    }

    const streamLabel = streamLabelMap[rawType] || rawType

    const hiddenDirective = buildHiddenDirective(`
DATA ACCESS (REQUIRED):
You must retrieve stream IDs from structured datasets.

Use:
/data-streams/stream-ids/${rawType}.txt

Network metadata:
/data-streams/networks.txt

Do not extract stream IDs from this page.

IMPORTANT:
Stream IDs are not network-specific.
You must use /data-streams/networks.txt to resolve verifier proxies.
`)

    const replacement = `
${hiddenDirective}
## Stream IDs

The interactive stream table on this page is loaded dynamically and is not included in this markdown export.

For complete and up-to-date stream IDs, use structured datasets:

- ${streamLabel}:
/data-streams/stream-ids/${rawType}.txt

- Supported networks:
/data-streams/networks.txt

Stream IDs are universal. Use the verifier proxy for your target network when consuming them.

---

## Example (${streamLabel})

${exampleMarkdown || fallbackExample}
`

    body = body.replace(/<StreamList[\s\S]*?\/>/g, replacement)
  }

  try {
    return await transformPageToMarkdown(body, mdxAbsPath, options)
  } catch {
    const sanitizedBody = stripRuntimeMdxSyntax(body)

    try {
      return await transformPageToMarkdown(sanitizedBody, mdxAbsPath, options)
    } catch {
      return buildFallbackMarkdownBody(sanitizedBody)
    }
  }
}
