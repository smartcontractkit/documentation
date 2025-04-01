import { SearchButton } from "chainlink-algolia-search"
import "chainlink-algolia-search/dist/index.css"
import { AlgoliaVars } from "../Nav/config.tsx"

const Search = ({
  algoliaVars: { algoliaAppId, algoliaPublicApiKey, googleProjectId, googleAppId, googleAccessToken },
}: {
  algoliaVars: AlgoliaVars
}) => {
  return (
    <SearchButton
      algoliaAppId={algoliaAppId}
      algoliaPublicApiKey={algoliaPublicApiKey}
      popularCards={[
        {
          url: "https://dev.chain.link/resources/quickstarts",
          imgSrc: "/images/algolia/quick-start.png",
          label: "Quickstarts",
        },
        { url: "https://dev.chain.link/tools", imgSrc: "/images/algolia/tools.png", label: "Tools" },
      ]}
      googleProjectId={googleProjectId}
      googleAppId={googleAppId}
      googleAccessToken={googleAccessToken}
    />
  )
}

export default Search
