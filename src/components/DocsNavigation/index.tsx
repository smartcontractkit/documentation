import DocsNavigationDesktop from "./DocsNavigationDesktop/DocsNavigationDesktop"
import DocsNavigationMobile from "./DocsNavigationMobile/DocsNavigationMobile"

function DocsNavigation({ pathname }: { pathname: string }) {
  return (
    <>
      <DocsNavigationDesktop pathname={pathname} />
      <DocsNavigationMobile pathname={pathname} />
    </>
  )
}

export default DocsNavigation
