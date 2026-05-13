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

  const isFeedsPage = cleanPath.includes("data-feeds/price-feeds/addresses")
  const isStreamsPage = cleanPath.includes("data-streams")

  const headerLines = [
    `# ${title}`,
    `Source: ${sourceUrl}`,
    ...(lastModified ? [`Last Updated: ${lastModified}`] : []),
    "",
    LLMS_DIRECTIVE,
    "",
    ...(isFeedsPage
      ? [
          "## Full datasets",
          "",
          "Use the network index to retrieve feed addresses:",
          "",
          "/data-feeds/feed-addresses/default.txt",
          "",
          "Each network has its own dataset.",
          "Do not load multiple networks unless required.",
          "",
        ]
      : []),
    ...(isStreamsPage
      ? [
          "## Full datasets",
          "",
          "Use structured datasets for stream IDs and network metadata:",
          "",
          "/data-streams/stream-ids/crypto.txt",
          "/data-streams/networks.txt",
          "",
          "Stream IDs are universal.",
          "Networks provide verifier proxy addresses.",
          "",
        ]
      : []),
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
  const chainCache = await getServerSideChainMetadata(CHAINS)

  // -----------------------
  // FEEDS INJECTION
  // -----------------------
  if (body.includes("<FeedPage")) {
    const exampleMarkdown = buildFeedAddressMarkdown(
      "default",
      "ethereum-mainnet",
      chainCache,
      "https://docs.chain.link",
      { networkType: "mainnet" }
    )

    const replacement = `
## Full datasets

Use the network index to retrieve feed addresses:

/data-feeds/feed-addresses/default.txt

Each network has its own dataset.
Do not load multiple networks unless required.

---

## Example (Ethereum Mainnet)

${exampleMarkdown}
`

    body = body.replace(/<FeedPage[\s\S]*?\/>/g, replacement)
  }

  // -----------------------
  // STREAMS INJECTION
  // -----------------------
  if (body.includes("<StreamList")) {
    const streams = collectStreamEntries(STREAM_CATEGORY_MAP.crypto, chainCache, { publicType: "crypto" } as any)

    const exampleMarkdown = buildStreamExample(streams)

    const replacement = `
## Full datasets

Use structured datasets:

- /data-streams/stream-ids/crypto.txt
- /data-streams/networks.txt

Stream IDs are universal.
Networks provide verifier proxy addresses.

---

## Example (Crypto Streams)

${exampleMarkdown}
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

// -----------------------
// STREAM EXAMPLE BUILDER
// -----------------------
function buildStreamExample(streams: Array<{ name: string; feedId: string; schema: string }>): string {
  const sample = streams.slice(0, 10)

  const lines = ["| Stream | Feed ID | Schema |", "|--------|---------|--------|"]

  for (const s of sample) {
    lines.push(`| ${s.name} | \`${s.feedId}\` | ${s.schema} |`)
  }

  return lines.join("\n")
}

// -----------------------
// UTILITIES
// -----------------------
function buildFallbackMarkdownBody(body: string): string {
  return stripRuntimeMdxSyntax(body)
    .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, "")
    .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>/g, "")
    .replace(/<\/[A-Z][A-Za-z0-9]*>/g, "")
    .trim()
}

function stripRuntimeMdxSyntax(body: string): string {
  const lines = body.split("\n")
  const output: string[] = []

  let skippingExportBlock = false
  let skippingImportBlock = false
  let braceDepth = 0

  for (const line of lines) {
    const trimmed = line.trim()

    if (skippingImportBlock) {
      if (trimmed.includes(" from ") || trimmed.endsWith('"') || trimmed.endsWith("'")) {
        skippingImportBlock = false
      }
      continue
    }

    if (skippingExportBlock) {
      braceDepth += countChar(line, "{")
      braceDepth -= countChar(line, "}")

      if (braceDepth <= 0) {
        skippingExportBlock = false
        braceDepth = 0
      }
      continue
    }

    if (/^import\s+/.test(trimmed)) {
      if (!trimmed.includes(" from ")) skippingImportBlock = true
      continue
    }

    if (/^export\s+(async\s+)?function\s+/.test(trimmed)) {
      skippingExportBlock = true
      braceDepth = countChar(line, "{") - countChar(line, "}")
      continue
    }

    if (/^export\s+(const|let|var)\s+/.test(trimmed)) continue

    output.push(line)
  }

  return output.join("\n")
}

function countChar(value: string, char: string): number {
  return value.split(char).length - 1
}

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
