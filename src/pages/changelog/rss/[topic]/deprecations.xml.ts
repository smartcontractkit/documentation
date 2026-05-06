/**
 * Per-product deprecation RSS feeds.
 * Routes: /changelog/rss/ccip/deprecations.xml
 *         /changelog/rss/data-feeds/deprecations.xml
 *         /changelog/rss/data-streams/deprecations.xml
 *         /changelog/rss/vrf/deprecations.xml
 *         /changelog/rss/automation/deprecations.xml
 *         /changelog/rss/functions/deprecations.xml
 *         … (auto-generated for any topic with at least one deprecation entry)
 */

import rss from "@astrojs/rss"
import type { APIContext, GetStaticPaths } from "astro"
import changelogData from "../../../../../public/changelog.json" with { type: "json" }
import {
  entryToRssItem,
  topicSlug,
  topicDeprecationFeedMeta,
  type ChangelogEntry,
  type NetworksMap,
} from "@lib/changelog/rss.js"

export const getStaticPaths: GetStaticPaths = () => {
  const entries = changelogData.data as ChangelogEntry[]

  // Only generate feeds for topics that have at least one deprecation
  const topicMap = new Map<string, string>()
  for (const entry of entries) {
    if (entry.category === "deprecation" && !topicMap.has(entry.topic)) {
      topicMap.set(entry.topic, topicSlug(entry.topic))
    }
  }

  return Array.from(topicMap.entries()).map(([topic, slug]) => ({
    params: { topic: slug },
    props: { topicName: topic },
  }))
}

interface Props {
  topicName: string
}

export async function GET(context: APIContext) {
  const { topicName } = context.props as Props
  const allEntries = changelogData.data as ChangelogEntry[]
  const networksMap = changelogData.networks as NetworksMap
  const siteBase = context.site?.toString().replace(/\/$/, "") ?? "https://docs.chain.link"

  const deprecations = allEntries.filter((e) => e.topic === topicName && e.category === "deprecation")
  const { title, description } = topicDeprecationFeedMeta(topicName)

  const items = await Promise.all(deprecations.map((entry) => entryToRssItem(entry, networksMap, siteBase)))

  return rss({
    title,
    description,
    site: context.site ?? "https://docs.chain.link",
    items,
    customData: `<language>en-us</language>`,
  })
}
