import { SearchButton } from "./tempAlgoliaSearch"
import "./tempAlgoliaSearch/index.css"

export const Search = ({ variant = "default" }: { variant?: "default" | "mobile" }) => {
  return (
    <SearchButton algoliaAppId="K1NK1TQHV9" algoliaPublicApiKey="6a8a11b235338f5b9e7c9fbe1aa94e57" categoryOrder={[]} />
  )
  // return (
  //   <>
  //     <SearchButton variant={variant} />
  //     <SearchModal />
  //   </>
  // )
}
