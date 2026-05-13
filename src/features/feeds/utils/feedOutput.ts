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
  schemaFilter?: string
  publicType?: string
  networkType?: "mainnet" | "testnet"
}

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
  chain: string
  svr?: "shared" | "aave"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveSVR(feed: any): "shared" | "aave" | undefined {
  const isShared = typeof feed.path === "string" && /-shared-svr$/.test(feed.path)
  if (isShared) return "shared"
  if (feed.secondaryProxyAddress) return "aave"
  return undefined
}

export function collectStreamEntries(
  type: DataFeedType,
  chainCache: Record<string, any>,
  options: FeedMarkdownOptions = {}
): StreamEntry[] {
  const visibilityOpts = {
    ...(options.schemaFilter ? { schemaFilter: options.schemaFilter } : {}),
  } as any

  const seenFeedIds = new Set<string>()
  const raw: any[] = []

  for (const chain of CHAINS) {
    const chainData = chainCache[chain.page]
    if (!chainData?.networks) continue

    for (const network of chainData.networks as any[]) {
      if (!network?.metadata?.length) continue
      if (network.networkType !== "mainnet") continue

      for (const feed of network.metadata as any[]) {
        if (!isFeedVisible(feed, type, "", visibilityOpts)) continue
        if (!feed.feedId || seenFeedIds.has(feed.feedId)) continue

        seenFeedIds.add(feed.feedId)
        raw.push(feed)
      }
    }
  }

  raw.sort((a, b) => (resolveStreamPair(a) ?? "").localeCompare(resolveStreamPair(b) ?? ""))

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

    if (tradingHours && tradingHours !== "—") {
      entry.tradingHours = tradingHours
    }

    return [entry]
  })
}

function resolveChainName(chainTitle: string, chainPage: string): string {
  const stripped = chainTitle.replace(/\s*Data Feeds$/, "").trim()
  return stripped || chainPage.charAt(0).toUpperCase() + chainPage.slice(1)
}

export function collectFeedEntries(
  type: DataFeedType,
  networkFilter: string | null,
  chainCache: Record<string, any>,
  options: FeedMarkdownOptions = {}
): FeedEntry[] {
  const visibilityOpts = {
    ...(options.schemaFilter ? { schemaFilter: options.schemaFilter } : {}),
  } as any

  const entries: FeedEntry[] = []

  for (const chain of CHAINS) {
    const chainData = chainCache[chain.page]
    if (!chainData?.networks) continue

    const chainName = resolveChainName(chain.title, chain.page)

    for (const network of chainData.networks as any[]) {
      if (!network?.metadata?.length) continue
      if (networkFilter && network.queryString !== networkFilter) continue
      if (options.networkType && network.networkType !== options.networkType) continue

      const visibleFeeds = network.metadata.filter((feed: any) => isFeedVisible(feed, type, "", visibilityOpts))

      if (visibleFeeds.length === 0) continue

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

  entries.sort((a, b) => {
    if (a.network !== b.network) return a.network.localeCompare(b.network)
    return a.name.localeCompare(b.name)
  })

  return entries
}

export function buildFeedAddressMarkdown(
  type: DataFeedType,
  networkFilter: string | null,
  chainCache: Record<string, any>,
  siteBase = "https://docs.chain.link",
  options: FeedMarkdownOptions = {}
): string {
  const lines: string[] = []
  const streams = isStreamsType(type)
  const label = FEED_TYPE_LABELS[type]

  if (streams) {
    lines.push(`# Chainlink Data Streams: ${label}`)
    lines.push(`Source: ${siteBase}/data-streams`)
    lines.push("")
    lines.push(`> Stream IDs for Chainlink Data Streams – ${label.replace("Data Streams — ", "")}.`)
    lines.push(`> These IDs are universal and valid across all supported networks.`)
    lines.push(
      `> To use a stream ID, retrieve the verifier proxy for the target network from /data-streams/networks.txt.`
    )
    lines.push(`> Datasets may contain multiple schema versions. Filter by schema if needed.`)
    lines.push("")

    const streamEntries = collectStreamEntries(type, chainCache, options)

    if (streamEntries.length > 0) {
      lines.push("| Stream | Feed ID | Asset Class | Schema | Trading Hours |")
      lines.push("|--------|---------|-------------|--------|---------------|")

      for (const entry of streamEntries) {
        lines.push(
          `| ${entry.name} | \`${entry.feedId}\` | ${entry.assetClass} | \`${entry.schema}\` | ${entry.tradingHours ?? "—"} |`
        )
      }

      lines.push("")
    } else {
      lines.push(`No stream IDs found for type \`${type}\`.`)
    }
  } else {
    lines.push(`# Chainlink Feed Addresses: ${label}`)
    lines.push("")

    const feedEntries = collectFeedEntries(type, networkFilter, chainCache, options)

    if (feedEntries.length === 0) {
      lines.push(
        networkFilter
          ? `No feeds found for type \`${type}\` on network \`${networkFilter}\`.`
          : `No feeds found for type \`${type}\`.`
      )
    } else {
      let currentNetwork = ""

      for (const entry of feedEntries) {
        if (entry.network !== currentNetwork) {
          currentNetwork = entry.network
          const network = feedEntries.find((e) => e.network === currentNetwork)

          if (!network) continue

          lines.push(`## ${entry.chain} — ${network.networkName}`)
          lines.push(`- Network type: ${network.networkType}`)
          lines.push(`- Query string: \`${network.network}\``)
          lines.push("")
          lines.push("| Feed Name | Proxy Address | Deviation | Heartbeat |")
          lines.push("|-----------|--------------|-----------|-----------|")
        }

        const name = escapePipes(entry.name)

        lines.push(`| ${name} | \`${entry.proxyAddress}\` | ${entry.deviation} | ${entry.heartbeat} |`)
      }

      lines.push("")
    }
  }

  return lines.join("\n")
}
