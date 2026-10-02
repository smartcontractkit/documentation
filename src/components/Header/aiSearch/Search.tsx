import React, { useEffect, useState, ComponentType } from "react"
import { SearchButtonProps } from "@chainlink/cl-search-frontend"
import "@chainlink/cl-search-frontend/dist/index.css"
import "./Search.css" // We need to use normal CSS to override a global class

function AlgoliaSearch({ algoliaVars }) {
  // Only render the component on the client side
  const [isClient, setIsClient] = useState(false)
  const [SearchButtonComponent, setSearchButtonComponent] = useState<ComponentType<SearchButtonProps> | null>(null)

  useEffect(() => {
    setIsClient(true)
    import("@chainlink/cl-search-frontend").then((module) => {
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
      categoryOrder={["Documentation"]}
      ariaLabel="Open AI search"
      spotlight={["Documentation"]}
    />
  )
}

export default AlgoliaSearch
