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

  const popularCards = [
    {
      url: "https://dev.chain.link/resources/quickstarts",
      imgSrc: "https://cdn.prod.website-files.com/64cc2c23d8dbd707cdb556d8/684b28edebfa8dd23ec82671_Quickstarts.svg",
      label: "Quickstarts",
    },
    {
      url: "https://dev.chain.link/tools",
      imgSrc: "https://cdn.prod.website-files.com/64cc2c23d8dbd707cdb556d8/684b28f1b0dd30e51458603c_Tools.svg",
      label: "Tools",
    },
  ]

  return (
    <SearchButtonComponent
      algoliaAppId={algoliaVars.algoliaAppId}
      algoliaPublicApiKey={algoliaVars.algoliaPublicApiKey}
      categoryOrder={["Documentation"]}
      popularCards={popularCards}
      ariaLabel="Open AI search"
      spotlight={["Documentation"]}
      baseApiUrl="https://cl-ai-search-api-preview.vercel.app/api"
    />
  )
}

export default AlgoliaSearch
