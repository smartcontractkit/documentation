import React from "react"
import DocsNavigationDesktop from "./DocsNavigationDesktop/DocsNavigationDesktop"
import DocsNavigationMobile from "./DocsNavigationMobile/DocsNavigationMobile"

function DocsNavigation({ pathname, children }: { pathname: string; children?: React.ReactNode }) {
  return (
    <>
      <DocsNavigationDesktop pathname={pathname}>{children}</DocsNavigationDesktop>
      <DocsNavigationMobile pathname={pathname}>{children}</DocsNavigationMobile>
    </>
  )
}

export default DocsNavigation
