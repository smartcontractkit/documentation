import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getSecret } from "astro:env/server"
import { searchClient } from "@algolia/client-search"
import type { ChangelogItem } from "~/components/ChangelogSnippet/types.ts"
import { toFeedDescription } from "~/components/ChangelogSnippet/feedDescription.ts"

const FEED_ITEM_LIMIT = 50

export async function GET(context: APIContext) {
  const appId = getSecret("ALGOLIA_APP_ID")
  const apiKey = getSecret("PUBLIC_ALGOLIA_SEARCH_PUBLIC_API_KEY")
  const logs: ChangelogItem[] = []

  if (appId && apiKey) {
    const client = searchClient(appId, apiKey)
    for (let page = 0, nbPages = 1; page < nbPages; page++) {
      const { results } = await client.search({ requests: [{ indexName: "Changelog", page, hitsPerPage: 1000 }] })
      const result = results[0]
      if ("hits" in result) logs.push(...(result.hits as ChangelogItem[]))
      if ("nbPages" in result) nbPages = result.nbPages ?? 1
    }
  }

  // Algolia's ranking doesn't guarantee date order, so sort newest first before limiting
  const latest = logs
    .sort((a, b) => Date.parse(b["date-of-release"]) - Date.parse(a["date-of-release"]))
    .slice(0, FEED_ITEM_LIMIT)

  return rss({
    title: "Chainlink Documentation Changelog",
    description: "Updates and releases across Chainlink products and networks.",
    site: context.site ?? "https://docs.chain.link",
    trailingSlash: false,
    items: latest.map((log) => ({
      title: log.name,
      link: `/changelog/${log.slug}`,
      pubDate: new Date(log["date-of-release"]),
      description: toFeedDescription(log["text-description"] ?? ""),
      categories: [log.type, log.topic].filter(Boolean),
    })),
  })
}
