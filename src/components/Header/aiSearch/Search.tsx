import { SearchButton } from "chainlink-algolia-search"
import "chainlink-algolia-search/dist/index.css"

const algoliaAppId = import.meta.env.PUBLIC_ALGOLIA_SEARCH_APP_ID || ""
const algoliaPublicApiKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_PUBLIC_API_KEY || ""

export const Search = () => {
  return <SearchButton algoliaAppId={algoliaAppId} algoliaPublicApiKey={algoliaPublicApiKey} />
}
