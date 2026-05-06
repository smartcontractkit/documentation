/**
 * Main changelog RSS feed — all entries across every product, most recent first.
 * Route: /changelog/rss.xml
 */

import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import changelogData from "../../../public/changelog.json" with { type: "json" }
import {
  entryToRssItem,
  MAIN_FEED_TITLE,
  MAIN_FEED_DESCRIPTION,
  type ChangelogEntry,
  type NetworksMap,
} from "@lib/changelog/rss.js"

export async function GET(context: APIContext) {
  const entries = changelogData.data as ChangelogEntry[]
  const networksMap = changelogData.networks as NetworksMap

  const items = await Promise.all(
    entries.map((entry) => entryToRssItem(entry, networksMap, context.site?.toString() ?? "https://docs.chain.link"))
  )

  return rss({
    title: MAIN_FEED_TITLE,
    description: MAIN_FEED_DESCRIPTION,
    site: context.site ?? "https://docs.chain.link",
    items,
    customData: `<language>en-us</language>`,
  })
}
