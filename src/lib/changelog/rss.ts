/**
 * Shared utilities for converting changelog.json entries into @astrojs/rss feed items.
 *
 * Feed layout:
 *   /changelog/rss.xml                – all entries (main feed)
 *   /changelog/rss/deprecations.xml   – deprecations only, all products
 *   /changelog/rss/[topic].xml        – per-product feed (ccip, data-feeds, …)
 */

import type { RSSFeedItem } from "@astrojs/rss"
import { marked } from "marked"

// ---------------------------------------------------------------------------
// Types (mirrors the shape used in ReleaseNotes.astro)
// ---------------------------------------------------------------------------

export interface ChangelogToken {
  assetName: string
  baseAsset: string
  quoteAsset?: string
  network?: string
  productTypeCode?: string
  url: string
  iconUrl: string
}

export interface ChangelogEntry {
  category: string
  date: string
  description: string
  relatedNetworks?: string[]
  relatedTokens?: Array<ChangelogToken | string>
  newNetworks?: Array<{ displayName: string; network: string; url: string }>
  title: string
  topic: string
}

export interface NetworkInfo {
  displayName: string
  iconUrl: string
}

export type NetworksMap = Record<string, NetworkInfo>

// ---------------------------------------------------------------------------
// Topic → canonical docs URL
// ---------------------------------------------------------------------------

const TOPIC_URLS: Record<string, string> = {
  "Data Streams": "/data-streams",
  SmartData: "/data-feeds",
  "Data Feeds": "/data-feeds",
  CCIP: "/ccip",
  CRE: "/cre",
  Nodes: "/chainlink-nodes",
  Automation: "/chainlink-automation",
  Functions: "/chainlink-functions",
  VRF: "/vrf",
  General: "/",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Stable URL-safe slug for an entry – used as the fragment in <link> / <guid>. */
export function entrySlug(entry: ChangelogEntry): string {
  return `${entry.date}-${entry.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`
}

/** Lowercase kebab-case slug for a topic name, used in feed filenames. */
export function topicSlug(topic: string): string {
  return topic.toLowerCase().replace(/\s+/g, "-")
}

/** Canonical docs URL for a topic. */
export function topicDocsUrl(topic: string, siteBase: string): string {
  const path = TOPIC_URLS[topic] ?? "/"
  return `${siteBase}${path}`
}

// ---------------------------------------------------------------------------
// HTML content builder
// ---------------------------------------------------------------------------

async function buildItemContent(entry: ChangelogEntry, networksMap: NetworksMap): Promise<string> {
  const parts: string[] = []
  const isDeprecation = entry.category === "deprecation"

  if (isDeprecation) {
    parts.push(`<p><strong>⚠️ Deprecation notice — ${entry.topic}</strong></p>`)
  }

  // Description (markdown → HTML)
  parts.push(await marked.parse(entry.description))

  // New networks (e.g. "CCIP now available on X")
  if (entry.newNetworks?.length) {
    parts.push(`<h3>New networks (${entry.newNetworks.length})</h3><ul>`)
    for (const net of entry.newNetworks) {
      parts.push(`<li><a href="${net.url}">${net.displayName}</a></li>`)
    }
    parts.push("</ul>")
  }

  // Related tokens / assets
  if (entry.relatedTokens?.length) {
    const count = entry.relatedTokens.length
    const heading = isDeprecation ? `Affected assets (${count})` : `Assets (${count})`
    parts.push(`<h3>${heading}</h3><ul>`)

    for (const token of entry.relatedTokens) {
      if (typeof token === "string") {
        parts.push(`<li>${token}</li>`)
        continue
      }
      const pair = token.quoteAsset ? `${token.baseAsset}/${token.quoteAsset}` : token.baseAsset
      const typeTag = token.productTypeCode ? ` [${token.productTypeCode}]` : ""
      const networkLabel = token.network ? ` on ${networksMap[token.network]?.displayName ?? token.network}` : ""
      parts.push(`<li><a href="${token.url}">${pair}${typeTag}</a>${networkLabel}</li>`)
    }

    parts.push("</ul>")
  }

  // Related networks (only shown when tokens don't already carry per-token network info)
  const tokensHaveNetworks = entry.relatedTokens?.some(
    (t) => typeof t === "object" && t !== null && "network" in t && t.network
  )
  if (entry.relatedNetworks?.length && !tokensHaveNetworks) {
    const names = entry.relatedNetworks.map((n) => networksMap[n]?.displayName ?? n).join(", ")
    parts.push(`<p><strong>Available on:</strong> ${names}</p>`)
  }

  return parts.join("\n")
}

// ---------------------------------------------------------------------------
// Public converter
// ---------------------------------------------------------------------------

/**
 * Convert a single ChangelogEntry into an @astrojs/rss RSSFeedItem.
 * The `content` field populates <content:encoded> with full HTML.
 */
export async function entryToRssItem(
  entry: ChangelogEntry,
  networksMap: NetworksMap,
  siteBase: string
): Promise<RSSFeedItem> {
  const slug = entrySlug(entry)
  // Link to the changelog anchor once the page exists; valid GUID in the meantime
  const link = `${siteBase}/changelog#${slug}`

  // Plain-text summary for <description> – strip markdown link syntax
  const plainSummary = entry.description
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .slice(0, 300)
    .trimEnd()

  const content = await buildItemContent(entry, networksMap)

  return {
    title: entry.title,
    pubDate: new Date(entry.date),
    description: plainSummary,
    link,
    content,
    categories: [entry.topic, entry.category],
  }
}

// ---------------------------------------------------------------------------
// Feed-level helpers
// ---------------------------------------------------------------------------

/** Human-readable label for the main RSS feed. */
export const MAIN_FEED_TITLE = "Chainlink Docs Changelog"
export const MAIN_FEED_DESCRIPTION = "All updates, releases, integrations, and deprecations across Chainlink products."

/** Build title + description for a per-topic feed. */
export function topicFeedMeta(topic: string): { title: string; description: string } {
  return {
    title: `Chainlink ${topic} Changelog`,
    description: `Updates, releases, integrations, and deprecations for Chainlink ${topic}.`,
  }
}

/** Build title + description for a per-topic deprecations feed. */
export function topicDeprecationFeedMeta(topic: string): { title: string; description: string } {
  return {
    title: `Chainlink ${topic} Deprecations`,
    description: `Deprecation notices for Chainlink ${topic}.`,
  }
}
