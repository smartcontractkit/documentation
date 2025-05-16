// src/components/Header/aiSearch/SearchReact.tsx
import React, { useEffect, useState, ComponentType } from "react"
import { SearchButtonProps } from "chainlink-algolia-search"
import "chainlink-algolia-search/dist/index.css"

function AlgoliaSearch({ algoliaVars, categoryOrder, popularCards }) {
  // Only render the component on the client side
  const [isClient, setIsClient] = useState(false)
  const [SearchButtonComponent, setSearchButtonComponent] = useState<ComponentType<SearchButtonProps> | null>(null)

  useEffect(() => {
    setIsClient(true)
    import("chainlink-algolia-search").then((module) => {
      setSearchButtonComponent(() => module.SearchButton)
    })
  }, [])

  // Return null during server-side rendering
  if (!isClient || !SearchButtonComponent) {
    return <div></div>
  }

  return (
    <SearchButtonComponent
      algoliaAppId={algoliaVars.algoliaAppId}
      algoliaPublicApiKey={algoliaVars.algoliaPublicApiKey}
      categoryOrder={categoryOrder}
      popularCards={popularCards}
    />
  )
}

export default AlgoliaSearch
