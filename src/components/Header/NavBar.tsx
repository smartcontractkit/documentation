import React, { lazy, Suspense, useEffect, useState } from "react"
import { NavBar as Nav } from "./Nav/index.ts"
import { useNavBar } from "./useNavBar/useNavBar.ts"
import styles from "./scroll.module.css"
import { AlgoliaVars, ProductsNav, SubProductsNav } from "./Nav/config.tsx"

const LazySearch = lazy(() => import("./aiSearch/Search.tsx"))

export const NavBar = ({
  productsNav,
  subProductsNav,
  path,
  showSearch = true,
  algoliaVars,
}: {
  productsNav: ProductsNav
  subProductsNav: SubProductsNav
  path: string
  showSearch?: boolean
  algoliaVars: AlgoliaVars
}) => {
  const navRef = React.useRef(null)
  const [isClient, setIsClient] = useState(false)

  const { setNavBarInfo } = useNavBar()

  const doubleNavbar = () => {
    const pathWithoutDocNav = ["/quickstarts/", "/builders-quick-links"]
    const shouldAddDocNavigation = !pathWithoutDocNav.some((p) => path.includes(p))
    const isHomepage = path === "/"
    return shouldAddDocNavigation && !isHomepage
  }

  const onHideChange = (hidden: boolean) => {
    if (navRef.current) {
      /* This method calculate the height required for the sticky headers within the page content.
      / - The height is determined by two different factors:
      / - if the page has been scrolled down and the header is hidden
      / - if the page is a inner doc page or part of the "pathWithoutDocNav" or not
      */
      const innerDocNavHeight = 56
      let height = (navRef.current as HTMLElement).clientHeight
      let baseHeightNoNav = 0
      if (doubleNavbar()) {
        height += innerDocNavHeight
        baseHeightNoNav += innerDocNavHeight
      }
      const elements = document.body.querySelectorAll("[data-sticky]")
      elements.forEach((e: HTMLElement) => {
        if (!e.classList.contains(styles.animateTop)) {
          e.classList.add(styles.animateTop)
        }
        e.style.top = `${hidden ? baseHeightNoNav : height}px`
      })
      setNavBarInfo({ hidden, height })
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <span ref={navRef}>
      <Nav
        productsNav={productsNav}
        subProductsNav={subProductsNav}
        path={path}
        searchTrigger={
          isClient && showSearch ? (
            <Suspense fallback={null}>
              <LazySearch algoliaVars={algoliaVars} />
            </Suspense>
          ) : undefined
        }
        onHideChange={onHideChange}
        doubleNavbar={doubleNavbar()}
      />
    </span>
  )
}
