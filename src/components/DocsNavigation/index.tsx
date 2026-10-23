import React, { useEffect, useState } from "react"
import DocsNavigationDesktop from "./DocsNavigationDesktop/DocsNavigationDesktop.tsx"
import DocsNavigationMobile from "./DocsNavigationMobile/DocsNavigationMobile.tsx"

function DocsNavigation({
  pathname,
  children,
  isCcipDirectory = false,
}: {
  pathname: string
  children?: React.ReactNode
  isCcipDirectory?: boolean
}) {
  // Shared pages viewed through a product sidebar carry `?parent=<section>`. The param never reaches
  // this island as a prop (static output), so read it on the client. The initializer runs against the
  // DOM that DocsLayout's inline script has already corrected, which keeps hydration consistent.
  const [parentSection, setParentSection] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("parent")
  })
  useEffect(() => {
    const readParentSection = () => setParentSection(new URLSearchParams(window.location.search).get("parent"))
    readParentSection()
    document.addEventListener("astro:after-swap", readParentSection)
    return () => document.removeEventListener("astro:after-swap", readParentSection)
  }, [])

  return (
    <>
      <DocsNavigationDesktop pathname={pathname} isCcipDirectory={isCcipDirectory} parentSection={parentSection}>
        {children}
      </DocsNavigationDesktop>
      <DocsNavigationMobile pathname={pathname} parentSection={parentSection}>
        {children}
      </DocsNavigationMobile>
    </>
  )
}

export default DocsNavigation
