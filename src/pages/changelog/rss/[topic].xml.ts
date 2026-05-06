/**
 * Per-product RSS feeds. One feed per topic slug.
 * Routes: /changelog/rss/ccip.xml
 *         /changelog/rss/data-feeds.xml
 *         /changelog/rss/data-streams.xml
 *         /changelog/rss/smartdata.xml
 *         /changelog/rss/cre.xml
 *         /changelog/rss/nodes.xml
 *         /changelog/rss/automation.xml
 *         /changelog/rss/functions.xml
 *         /changelog/rss/vrf.xml
 *         /changelog/rss/general.xml
 */

import rss from "@astrojs/rss"
import type { APIContext, GetStaticPaths } from "astro"
import changelogData from "../../../../public/changelog.json" with { type: "json" }
import { entryToRssItem, topicSlug, topicFeedMeta, type ChangelogEntry, type NetworksMap } from "@lib/changelog/rss.js"

export const getStaticPaths: GetStaticPaths = () => {
  const entries = changelogData.data as ChangelogEntry[]

  // Collect unique topics and map each to its slug
  const topicMap = new Map<string, string>()
  for (const entry of entries) {
    if (!topicMap.has(entry.topic)) {
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

  const topicEntries = allEntries.filter((e) => e.topic === topicName)
  const { title, description } = topicFeedMeta(topicName)

  const items = await Promise.all(topicEntries.map((entry) => entryToRssItem(entry, networksMap, siteBase)))

  return rss({
    title,
    description,
    site: context.site ?? "https://docs.chain.link",
    items,
    customData: `<language>en-us</language>`,
  })
}
