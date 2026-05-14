import type { APIRoute } from "astro"
import fs from "node:fs/promises"
import path from "node:path"

import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"

import { textPlainHeaders } from "@lib/api/cacheHeaders.js"
import { transformPageToMarkdown } from "@lib/markdown/transformMarkdown.js"
import { extractFrontmatter, getIsoStringOrUndefined, toCanonicalUrl, toContentRelative } from "@lib/markdown/utils.js"

const CONTENT_ROOT = path.resolve("src/content")

const LLMS_DIRECTIVE = "> For the complete documentation index, see [llms.txt](/llms.txt)."

const markdownHeaders = {
  ...textPlainHeaders,
  "Content-Type": "text/markdown; charset=utf-8",
}

export const prerender = false

export const GET: APIRoute = async ({ params, request }) => {
  const cleanPath = normalizeMarkdownPath(params.path)

  if (!cleanPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const mdxAbsPath = await findContentFile(cleanPath)

  if (!mdxAbsPath) {
    return new Response("Page not found.", { status: 404 })
  }

  const origin = new URL(request.url).origin
  const targetLanguage = new URL(request.url).searchParams.get("lang") || undefined

  const raw = await fs.readFile(mdxAbsPath, "utf-8")
  const { body, fmTitle, fmLastModified } = extractFrontmatter(raw)

  const transformed = await transformPageBodyToMarkdown(body, mdxAbsPath, cleanPath, {
    siteBase: origin,
    targetLanguage,
  })

  const relFromContent = toContentRelative(mdxAbsPath)
  const sourceUrl = toCanonicalUrl(cleanPath.split("/")[0], relFromContent, origin)

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
  const BASE_URL = options.siteBase

  // --------------------------------------------------
  // STRIP HIDDEN DIRECTIVE (prevents JSX leakage)
  // --------------------------------------------------
  body = body.replace(/<div style=\{\{\s*display:\s*["']none["']\s*\}\}>[\s\S]*?<\/div>/g, "")

  const isFeedPage = body.includes("<FeedPage") && !body.includes('dataFeedType="streams')

  const isStreamPage = body.includes('dataFeedType="streams')

  // --------------------------------------------------
  // FEEDS
  // --------------------------------------------------
  if (isFeedPage) {
    let feedType = "default"

    if (routePath.includes("smartdata")) feedType = "smartdata"
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

    const replacement = `
## Feed Contract Addresses

You must first retrieve available networks (this step is required):
${BASE_URL}/data-feeds/feed-addresses/${feedType}.json

Do not construct or guess network paths.

You must use the URL provided in the dataset.

Do not construct or modify dataset URLs manually.

Example:
${BASE_URL}/data-feeds/feed-addresses/${feedType}.json?network=ethereum-mainnet

The interactive address table on this page is loaded dynamically and is not included in this markdown export.

- ${feedLabel}${feedType === "default" ? " (default dataset)" : ""}:
/data-feeds/feed-addresses/${feedType}.json

- Optional parameter:
  ?network={queryString}
`

    body = body.replace(/<FeedPage[\s\S]*?\/>/g, replacement)
  }

  // --------------------------------------------------
  // STREAMS
  // --------------------------------------------------
  if (isStreamPage) {
    let rawType = "crypto"

    if (routePath.includes("rwa")) rawType = "rwa"
    else if (routePath.includes("exchange-rate")) rawType = "exchangeRate"
    else if (routePath.includes("smartdata")) rawType = "smartdata"
    else if (routePath.includes("tokenized-asset")) rawType = "tokenizedAsset"

    const streamLabelMap: Record<string, string> = {
      crypto: "Crypto streams",
      rwa: "RWA streams",
      exchangeRate: "Exchange rate streams",
      smartdata: "SmartData streams",
      tokenizedAsset: "Tokenized asset streams",
    }

    const streamLabel = streamLabelMap[rawType] || rawType

    const replacement = `
## Stream IDs

For programmatic access:
${BASE_URL}/data-streams/stream-ids/${rawType}.json

The interactive stream table on this page is loaded dynamically and is not included in this markdown export.

- ${streamLabel}:
/data-streams/stream-ids/${rawType}.json
`

    body = body.replace(/<FeedPage[\s\S]*?\/>/g, replacement)
  }

  try {
    return await transformPageToMarkdown(body, mdxAbsPath, options)
  } catch {
    return body
  }
}

// -----------------------
// UTILITIES
// -----------------------

function normalizeMarkdownPath(pathParam: string | undefined): string | null {
  if (!pathParam) return null

  const cleanPath = pathParam.replace(/\.md$/i, "").replace(/^\/+/, "").replace(/\/+$/, "")

  if (!cleanPath) return null

  const segments = cleanPath.split("/")
  if (segments.some((segment) => segment === ".." || segment === "." || segment === "")) {
    return null
  }

  return cleanPath
}

async function findContentFile(cleanPath: string): Promise<string | null> {
  const possiblePaths = [
    path.resolve(CONTENT_ROOT, `${cleanPath}.mdx`),
    path.resolve(CONTENT_ROOT, cleanPath, "index.mdx"),
    path.resolve(CONTENT_ROOT, `${cleanPath}.md`),
    path.resolve(CONTENT_ROOT, cleanPath, "index.md"),
  ]

  for (const candidate of possiblePaths) {
    if (!candidate.startsWith(`${CONTENT_ROOT}${path.sep}`)) continue
    try {
      await fs.access(candidate)
      return candidate
    } catch {}
  }

  return null
}
