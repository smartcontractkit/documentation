/**
 * Shared data collection and output formatting (markdown + JSON) for Chainlink feed and stream data.
 *
 * Used by:
 * - /api/feeds/addresses  (dynamic endpoint)
 * - /api/streams/ids      (dynamic endpoint)
 * - /data-feeds/feed-addresses/[type].txt  (static snapshot, pre-rendered at build time)
 */

import { CHAINS } from "~/features/data/chains.ts"
import { isFeedVisible } from "./feedVisibility.ts"
import {
  resolveStreamPair,
  resolveAssetClass,
  resolveTradingHours,
  resolveStreamSchema,
  escapePipes,
} from "./streamMetadata.ts"
import type { DataFeedType } from "../components/FeedList.tsx"

export const VALID_FEED_TYPES: DataFeedType[] = [
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

export const FEED_TYPE_LABELS: Record<DataFeedType, string> = {
  default: "Standard Price Feeds",
  smartdata: "SmartData Feeds (Proof of Reserve, NAVLink, SmartAUM)",
  rates: "Rates Feeds",
  streamsCrypto: "Data Streams — Crypto",
  streamsRwa: "Data Streams — RWA",
  streamsNav: "Data Streams — SmartData (NAV)",
  streamsExRate: "Data Streams — Exchange Rate",
  streamsBacked: "Data Streams — Tokenized Assets",
  tokenizedEquity: "Tokenized Equity Feeds",
  usGovernmentMacroeconomicData: "US Government Macroeconomic Data Feeds",
}

export function isStreamsType(type: DataFeedType): boolean {
  return (
    type === "streamsCrypto" ||
    type === "streamsRwa" ||
    type === "streamsNav" ||
    type === "streamsExRate" ||
    type === "streamsBacked"
  )
}

export function formatHeartbeat(seconds: number): string {
  if (!seconds) return "N/A"
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${Math.round(seconds / 3600)}h`
}

export function formatDeviation(threshold: number): string {
  if (threshold == null || threshold === 0) return "N/A"
  return `${threshold}%`
}

export interface FeedMarkdownOptions {
  /** Filter by schema version, e.g. "v8" or "v11". Only meaningful for streamsRwa. */
  schemaFilter?: string
  /** Public-facing API type name for use in generated URLs (e.g. "crypto" instead of "streamsCrypto"). */
  publicType?: string
  /** Restrict to "mainnet" or "testnet" networks only. */
  networkType?: "mainnet" | "testnet"
}

// ---------------------------------------------------------------------------
// Structured data types — used for JSON output
// ---------------------------------------------------------------------------

export interface StreamEntry {
  name: string
  feedId: string
  assetClass: string
  schema: string
  tradingHours?: string
}

export interface FeedEntry {
  name: string
  proxyAddress: string
  deviation: string
  heartbeat: string
  network: string
  networkName: string
  networkType: string
  /** Blockchain ecosystem name (e.g. "Ethereum", "Arbitrum"). */
  chain: string
  svr?: "shared" | "aave"
}

// ---------------------------------------------------------------------------
// Shared data collectors — used by both markdown and JSON formatters
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveSVR(feed: any): "shared" | "aave" | undefined {
  const isShared = typeof feed.path === "string" && /-shared-svr$/.test(feed.path)
  if (isShared) return "shared"
  if (feed.secondaryProxyAddress) return "aave"
  return undefined
}

export function collectStreamEntries(
  type: DataFeedType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chainCache: Record<string, any>,
  options: FeedMarkdownOptions = {}
): StreamEntry[] {
  const visibilityOpts = { schemaFilter: options.schemaFilter }
  const seenFeedIds = new Set<string>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = []

  for (const chain of CHAINS) {
    const chainData = chainCache[chain.page]
    if (!chainData?.networks) continue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const network of chainData.networks as any[]) {
      if (!network?.metadata?.length) continue
      if (network.networkType !== "mainnet") continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const feed of network.metadata as any[]) {
        if (!isFeedVisible(feed, type, "", visibilityOpts)) continue
        if (!feed.feedId || seenFeedIds.has(feed.feedId)) continue
        seenFeedIds.add(feed.feedId)
        raw.push(feed)
      }
    }
  }

  raw.sort((a, b) => (resolveStreamPair(a) ?? "").localeCompare(resolveStreamPair(b) ?? ""))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.flatMap((feed: any) => {
    const name = resolveStreamPair(feed)
    if (!name) return []
    const tradingHours = resolveTradingHours(feed)
    const entry: StreamEntry = {
      name,
      feedId: feed.feedId,
      assetClass: resolveAssetClass(feed),
      schema: resolveStreamSchema(type, feed),
    }
    if (tradingHours && tradingHours !== "—") entry.tradingHours = tradingHours
    return [entry]
  })
}

/** Strips the " Data Feeds" suffix Chainlink appends to chain group titles. */
function resolveChainName(chainTitle: string, chainPage: string): string {
  // Handles "Arbitrum Data Feeds" → "Arbitrum" and "Data Feeds" (Ethereum) → "Ethereum"
  const stripped = chainTitle.replace(/\s*Data Feeds$/, "").trim()
  return stripped || chainPage.charAt(0).toUpperCase() + chainPage.slice(1)
}

export function collectFeedEntries(
  type: DataFeedType,
  networkFilter: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chainCache: Record<string, any>,
  options: FeedMarkdownOptions = {}
): FeedEntry[] {
  const visibilityOpts = { schemaFilter: options.schemaFilter }
  const entries: FeedEntry[] = []

  for (const chain of CHAINS) {
    const chainData = chainCache[chain.page]
    if (!chainData?.networks) continue
    const chainName = resolveChainName(chain.title, chain.page)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const network of chainData.networks as any[]) {
      if (!network?.metadata?.length) continue
      if (networkFilter && network.queryString !== networkFilter) continue
      if (options.networkType && network.networkType !== options.networkType) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visibleFeeds = network.metadata.filter((feed: any) => isFeedVisible(feed, type, "", visibilityOpts))
      if (visibleFeeds.length === 0) continue

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const feed of visibleFeeds as any[]) {
        const svr = resolveSVR(feed)
        const entry: FeedEntry = {
          name: feed.name || feed.assetName || "Unknown",
          proxyAddress: feed.proxyAddress || feed.transmissionsAccount || feed.contractAddress || "N/A",
          deviation: formatDeviation(feed.threshold),
          heartbeat: formatHeartbeat(feed.heartbeat),
          network: network.queryString,
          networkName: network.name,
          networkType: network.networkType,
          chain: chainName,
        }
        if (svr) entry.svr = svr
        entries.push(entry)
      }
    }
  }

  // Sort alphabetically by feed name within each network for consistent, scannable output
  entries.sort((a, b) => {
    if (a.network !== b.network) return a.network.localeCompare(b.network)
    return a.name.localeCompare(b.name)
  })

  return entries
}

// ---------------------------------------------------------------------------
// Markdown formatter
// ---------------------------------------------------------------------------

/**
 * Builds a plain-markdown document listing feed addresses or stream IDs
 * for the given type, optionally filtered to a single network.
 */
export function buildFeedAddressMarkdown(
  type: DataFeedType,
  networkFilter: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chainCache: Record<string, any>,
  siteBase = "https://docs.chain.link",
  options: FeedMarkdownOptions = {}
): string {
  const lines: string[] = []
  const streams = isStreamsType(type)
  const label = FEED_TYPE_LABELS[type]
  const baseUrl = `${siteBase}/api/feeds/addresses?type=${type}`
  const visibilityOpts = { schemaFilter: options.schemaFilter }

  const mainnetQueryStrings: string[] = []
  const testnetQueryStrings: string[] = []

  if (!streams) {
    for (const chain of CHAINS) {
      const chainData = chainCache[chain.page]
      if (!chainData?.networks) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const network of chainData.networks as any[]) {
        if (!network?.queryString) continue
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasFeeds = network.metadata?.some((feed: any) => isFeedVisible(feed, type, "", visibilityOpts))
        if (!hasFeeds) continue
        if (network.networkType === "mainnet") mainnetQueryStrings.push(network.queryString)
        else testnetQueryStrings.push(network.queryString)
      }
    }
  }

  if (streams) {
    lines.push(`# Chainlink Data Streams: ${label}`)
    lines.push(`Source: ${siteBase}/data-streams`)
    lines.push(`Machine-readable endpoint: ${siteBase}/api/streams/ids?type=${options.publicType ?? type}`)
    lines.push(`Static snapshot: ${siteBase}/data-feeds/feed-addresses/${type}.txt`)
    lines.push("")
    lines.push(
      `> Stream IDs for Chainlink **${label}**. Stream IDs are universal — the same ID is valid across all supported networks.`
    )
    lines.push(`> Supported networks and verifier proxy addresses: \`${siteBase}/api/streams/networks\``)
    lines.push("")

    const streamEntries = collectStreamEntries(type, chainCache, options)
    if (streamEntries.length > 0) {
      lines.push("| Stream | Feed ID | Asset Class | Schema | Trading Hours |")
      lines.push("|--------|---------|-------------|--------|---------------|")
      for (const entry of streamEntries) {
        lines.push(
          `| ${entry.name} | \`${entry.feedId}\` | ${entry.assetClass} | ${entry.schema} | ${entry.tradingHours ?? "—"} |`
        )
      }
      lines.push("")
    } else {
      lines.push(`No stream IDs found for type \`${type}\`.`)
    }
  } else {
    lines.push(`# Chainlink Feed Addresses: ${label}`)
    lines.push(`Source: ${siteBase}/data-feeds/price-feeds/addresses`)
    lines.push(`Machine-readable endpoint: ${baseUrl}`)
    lines.push(`Static snapshot: ${siteBase}/data-feeds/feed-addresses/${type}.txt`)
    lines.push("")
    lines.push(`> Feed contract addresses for Chainlink **${label}** across all supported networks.`)
    lines.push(
      `> To narrow results to a single network, append \`&network={queryString}\` — e.g. \`${baseUrl}&network=${mainnetQueryStrings[0] ?? "ethereum-mainnet"}\``
    )
    lines.push(`> Full network list with queryStrings: \`${siteBase}/api/feeds/networks?type=${type}\``)
    lines.push("")
    if (mainnetQueryStrings.length > 0) {
      lines.push(`**Mainnet queryStrings:** ${mainnetQueryStrings.map((q) => `\`${q}\``).join(", ")}`)
      lines.push("")
    }
    if (testnetQueryStrings.length > 0) {
      lines.push(`**Testnet queryStrings:** ${testnetQueryStrings.map((q) => `\`${q}\``).join(", ")}`)
      lines.push("")
    }

    const feedEntries = collectFeedEntries(type, networkFilter, chainCache, options)
    if (feedEntries.length === 0) {
      lines.push(
        networkFilter
          ? `No feeds found for type \`${type}\` on network \`${networkFilter}\`. Check the network queryString or omit the \`network\` parameter to see all networks.`
          : `No feeds found for type \`${type}\`.`
      )
    } else {
      let currentNetwork = ""
      for (const entry of feedEntries) {
        if (entry.network !== currentNetwork) {
          currentNetwork = entry.network
          const network = feedEntries.find((e) => e.network === currentNetwork)!
          lines.push(`## ${entry.chain} — ${network.networkName}`)
          lines.push(`- Network type: ${network.networkType}`)
          lines.push(`- Query string: \`${network.network}\``)
          lines.push("")
          lines.push("| Feed Name | Proxy Address | Deviation | Heartbeat |")
          lines.push("|-----------|--------------|-----------|-----------|")
        }
        const svrLabel = entry.svr === "shared" ? " (Shared SVR)" : entry.svr === "aave" ? " (Aave SVR)" : ""
        const name = escapePipes(`${entry.name}${svrLabel}`)
        lines.push(`| ${name} | \`${entry.proxyAddress}\` | ${entry.deviation} | ${entry.heartbeat} |`)
      }
      lines.push("")
    }
  }

  return lines.join("\n")
}
