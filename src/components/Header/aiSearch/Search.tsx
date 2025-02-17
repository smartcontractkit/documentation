import { SearchButton } from "chainlink-algolia-search"
import "chainlink-algolia-search/dist/index.css"

export const Search = ({
  algoliaVars: { algoliaAppId, algoliaPublicApiKey },
}: {
  algoliaVars: { algoliaAppId: string; algoliaPublicApiKey: string }
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
    />
  )
}
