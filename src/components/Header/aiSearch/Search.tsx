import { SearchButton } from "chainlink-algolia-search"
import "chainlink-algolia-search/dist/index.css"

export const Search = ({
  algoliaVars: { algoliaAppId, algoliaPublicApiKey },
}: {
  algoliaVars: { algoliaAppId: string; algoliaPublicApiKey: string }
}) => {
  return <SearchButton algoliaAppId={algoliaAppId} algoliaPublicApiKey={algoliaPublicApiKey} />
}
