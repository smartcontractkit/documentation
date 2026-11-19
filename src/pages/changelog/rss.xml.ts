import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getSecret } from "astro:env/server"
import { searchClient } from "@algolia/client-search"
import type { ChangelogItem } from "~/components/ChangelogSnippet/types.ts"

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

  return rss({
    title: "Chainlink Documentation Changelog",
    description: "Updates and releases across Chainlink products and networks.",
    site: context.site ?? "https://docs.chain.link",
    trailingSlash: false,
    items: logs.map((log) => ({
      title: log.name,
      link: `/changelog/${log.slug}`,
      pubDate: new Date(log["date-of-release"]),
      description: log["text-description"],
      categories: [log.type, log.topic].filter(Boolean),
    })),
  })
}
