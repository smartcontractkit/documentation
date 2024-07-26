import DocsNavigationDesktop from "./DocsNavigationDesktop"

function DocsNavigation({ pathname }: { pathname: string }) {
  return (
    <>
      <DocsNavigationDesktop pathname={pathname} />
    </>
  )
}

export default DocsNavigation
