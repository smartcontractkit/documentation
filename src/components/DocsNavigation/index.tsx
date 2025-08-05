import React from "react"
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
  return (
    <>
      <DocsNavigationDesktop pathname={pathname} isCcipDirectory={isCcipDirectory}>
        {children}
      </DocsNavigationDesktop>
      <DocsNavigationMobile pathname={pathname}>{children}</DocsNavigationMobile>
    </>
  )
}

export default DocsNavigation
