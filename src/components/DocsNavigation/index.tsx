import React from "react"
import DocsNavigationDesktop from "./DocsNavigationDesktop/DocsNavigationDesktop.tsx"
import DocsNavigationMobile from "./DocsNavigationMobile/DocsNavigationMobile.tsx"

function DocsNavigation({ pathname, children }: { pathname: string; children?: React.ReactNode }) {
  return (
    <>
      <DocsNavigationDesktop pathname={pathname}>{children}</DocsNavigationDesktop>
      <DocsNavigationMobile pathname={pathname}>{children}</DocsNavigationMobile>
    </>
  )
}

export default DocsNavigation
