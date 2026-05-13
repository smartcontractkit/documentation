import type { APIRoute } from "astro"
import { getServerSideChainMetadata } from "~/features/data/api/backend.ts"
import { CHAINS } from "~/features/data/chains.ts"
import { buildFeedAddressMarkdown, type FeedMarkdownOptions } from "~/features/feeds/utils/feedOutput.ts"
import { STREAM_CATEGORY_MAP } from "~/features/feeds/utils/streamMetadata.ts"
import { textPlainHeaders } from "@lib/api/cacheHeaders.js"

// ✅ Build-time route generation
export function getStaticPaths() {
  return Object.keys(STREAM_CATEGORY_MAP).map((type) => ({
    params: { type },
  }))
}

export const GET: APIRoute = async ({ params }) => {
  const rawType = params.type as string

  const internalType = STREAM_CATEGORY_MAP[rawType]
  if (!internalType) {
    const valid = Object.keys(STREAM_CATEGORY_MAP).join(", ")
    return new Response(`Invalid type "${rawType}". Valid values: ${valid}`, {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  // ✅ Safe at build time
  const chainCache = await getServerSideChainMetadata(CHAINS)

  const options: FeedMarkdownOptions = {
    publicType: rawType,
  }

  let markdown = buildFeedAddressMarkdown(internalType, null, chainCache, "https://docs.chain.link", options)

  // --------------------------------------------------
  // CLEANUP: remove API + cross-product references
  // --------------------------------------------------

  markdown = markdown
    .replace(/Machine-readable endpoint:[^\n]*\n?/g, "")
    .replace(/Supported networks and verifier proxy addresses:[^\n]*\n?/g, "")
    .replace(/Static snapshot:[^\n]*\n?/g, "")

  // --------------------------------------------------
  // SCHEMA DETECTION
  // --------------------------------------------------

  const schemaMatches = [...markdown.matchAll(/\|\s*[^|]+\s*\|\s*`?0x[a-fA-F0-9]+`?\s*\|\s*[^|]*\|\s*(v\d+)/g)]

  const schemas = Array.from(new Set(schemaMatches.map((m) => m[1])))

  // --------------------------------------------------
  // SCHEMA → DOCS MAP
  // --------------------------------------------------

  const SCHEMA_DOCS: Record<string, string> = {
    v3: "https://docs.chain.link/data-streams/reference/report-schema-v3",
    v7: "https://docs.chain.link/data-streams/reference/report-schema-v7",
    v8: "https://docs.chain.link/data-streams/reference/report-schema-v8",
    v9: "https://docs.chain.link/data-streams/reference/report-schema-v9",
    v10: "https://docs.chain.link/data-streams/reference/report-schema-v10",
    v11: "https://docs.chain.link/data-streams/reference/report-schema-v11",
  }

  // --------------------------------------------------
  // BUILD INTRO BLOCK
  // --------------------------------------------------

  const introLines = [
    `> Stream IDs for Chainlink Data Streams – ${capitalize(rawType)}.`,
    `> These IDs are universal and valid across all supported networks.`,
    `> To use a stream ID, retrieve the verifier proxy for the target network from /data-streams/networks.txt.`,
    `> Datasets may contain multiple schema versions. Filter by schema if needed.`,
  ]

  if (schemas.length > 0) {
    introLines.push(`> Schemas present in this dataset:`)

    for (const s of schemas) {
      const url = SCHEMA_DOCS[s]
      if (url) {
        introLines.push(`> - \`${s}\` → ${url}`)
      } else {
        introLines.push(`> - ${s}`)
      }
    }
  }

  const introBlock = introLines.join("\n") + "\n"

  // --------------------------------------------------
  // REPLACE ORIGINAL INTRO
  // --------------------------------------------------

  markdown = markdown.replace(/> Stream IDs[\s\S]*?\n/, introBlock)

  return new Response(markdown.trim(), {
    status: 200,
    headers: {
      ...textPlainHeaders,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}

// -----------------------
// Utility
// -----------------------

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
