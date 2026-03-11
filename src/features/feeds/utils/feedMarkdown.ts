/**
 * Shared markdown formatting for Chainlink feed address output.
 *
 * Used by:
 * - /api/feeds/addresses  (dynamic endpoint)
 * - /api/streams/ids      (dynamic endpoint)
 * - /data-feeds/feed-addresses/[type].txt  (static snapshot, pre-rendered at build time)
 */

import { CHAINS } from "~/features/data/chains.ts"
import { isFeedVisible } from "./feedVisibility.ts"
import { resolveStreamPair, resolveAssetClass, resolveTradingHours, resolveStreamSchema } from "./streamMetadata.ts"
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
}

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

  // Collect available queryStrings split by network type (feeds only; streams are network-agnostic)
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
  }

  let hasAnyFeeds = false

  if (streams) {
    // Stream IDs are universal — deduplicate by feedId across all networks
    const seenFeedIds = new Set<string>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allStreamFeeds: any[] = []

    for (const chain of CHAINS) {
      const chainData = chainCache[chain.page]
      if (!chainData?.networks) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const network of chainData.networks as any[]) {
        if (!network?.metadata?.length) continue
        // Stream IDs differ between mainnet and testnet — only include mainnet
        if (network.networkType !== "mainnet") continue
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const feed of network.metadata as any[]) {
          if (!isFeedVisible(feed, type, "", visibilityOpts)) continue
          if (!feed.feedId || seenFeedIds.has(feed.feedId)) continue
          seenFeedIds.add(feed.feedId)
          allStreamFeeds.push(feed)
        }
      }
    }

    if (allStreamFeeds.length > 0) {
      hasAnyFeeds = true
      // Sort alphabetically by resolved pair name for discoverability (e.g. BTC/USD before EZETH/ETH)
      allStreamFeeds.sort((a, b) => {
        const pairA = resolveStreamPair(a) ?? ""
        const pairB = resolveStreamPair(b) ?? ""
        return pairA.localeCompare(pairB)
      })
      lines.push("| Stream | Feed ID | Asset Class | Schema | Trading Hours |")
      lines.push("|--------|---------|-------------|--------|---------------|")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const feed of allStreamFeeds as any[]) {
        const pair = resolveStreamPair(feed)
        if (!pair) continue
        const feedId = feed.feedId
        const assetClass = resolveAssetClass(feed)
        const schema = resolveStreamSchema(type, feed)
        const tradingHours = resolveTradingHours(feed)
        lines.push(`| ${pair} | \`${feedId}\` | ${assetClass} | ${schema} | ${tradingHours} |`)
      }
      lines.push("")
    }
  } else {
    // Feeds: proxy addresses vary per network
    for (const chain of CHAINS) {
      const chainData = chainCache[chain.page]
      if (!chainData?.networks) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const network of chainData.networks as any[]) {
        if (!network?.metadata?.length) continue
        if (networkFilter && network.queryString !== networkFilter) continue
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const visibleFeeds = network.metadata.filter((feed: any) => isFeedVisible(feed, type, "", visibilityOpts))
        if (visibleFeeds.length === 0) continue

        hasAnyFeeds = true
        lines.push(`## ${chain.title} — ${network.name}`)
        lines.push(`- Network type: ${network.networkType}`)
        lines.push(`- Query string: \`${network.queryString}\``)
        if (network.explorerUrl) {
          lines.push(`- Explorer: ${network.explorerUrl.replace("%s", "")}`)
        }
        lines.push("")
        lines.push("| Feed Name | Proxy Address | Deviation | Heartbeat |")
        lines.push("|-----------|--------------|-----------|-----------|")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const feed of visibleFeeds as any[]) {
          const baseName = (feed.name || feed.assetName || "Unknown").replace(/\|/g, "\\|")
          // Label SVR variants so developers can distinguish them from the standard feed
          const isSharedSVR = typeof feed.path === "string" && /-shared-svr$/.test(feed.path)
          const isAaveSVR = !!feed.secondaryProxyAddress && !isSharedSVR
          const svrLabel = isSharedSVR ? " (Shared SVR)" : isAaveSVR ? " (Aave SVR)" : ""
          const name = `${baseName}${svrLabel}`
          const address = feed.proxyAddress || feed.transmissionsAccount || feed.contractAddress || "N/A"
          lines.push(
            `| ${name} | \`${address}\` | ${formatDeviation(feed.threshold)} | ${formatHeartbeat(feed.heartbeat)} |`
          )
        }
        lines.push("")
      }
    }
  }

  if (!hasAnyFeeds) {
    lines.push(
      networkFilter
        ? `No feeds found for type \`${type}\` on network \`${networkFilter}\`. Check the network queryString or omit the \`network\` parameter to see all networks.`
        : `No feeds found for type \`${type}\`.`
    )
  }

  return lines.join("\n")
}
