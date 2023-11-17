import React from "react"
import { ProductsNav, SubProductsNav } from "./config"
import styles from "./navBar.module.css"
import { useScrollDirection } from "./useScrollDirection"
import { useScrollPosition } from "./useScrollPosition"
import { clsx } from "~/lib"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation"
import { getIconUrl } from "./utils"

export type SearchTrigger = React.ReactNode

export type NavBarProps = {
  searchTrigger?: SearchTrigger
  path: string
  onHideChange?: (hidden: boolean) => void
  productsNav: ProductsNav
  subProductsNav: SubProductsNav
  languageSelector?: React.ReactNode
}

export const navBarHeight = 64

export const NavBar = ({
  path,
  searchTrigger,
  onHideChange,
  productsNav,
  subProductsNav,
  languageSelector,
}: NavBarProps) => {
  const [isMenuOpen, setisMenuOpen] = React.useState(false)
  const scrollDirection = useScrollDirection()
  const { isAtTopOfPage, isAtBottomOfPage } = useScrollPosition(navBarHeight)

  let shouldHideHeader = false

  if (scrollDirection === "down") {
    shouldHideHeader = true
  }

  if (isAtTopOfPage) {
    shouldHideHeader = false
  }

  if (isAtBottomOfPage) {
    shouldHideHeader = true
  }

  if (isMenuOpen) {
    shouldHideHeader = false
  }

  React.useEffect(() => {
    if (onHideChange) {
      onHideChange(shouldHideHeader)
    }
  }, [shouldHideHeader])

  return (
    <>
      <header className={styles.header}>
        <div className={clsx(styles.navBar, shouldHideHeader && styles.headerHidden)}>
          <div className={styles.container}>
            <div className={styles.leftSection}>
              <ProductNavigation
                path={path}
                searchTrigger={searchTrigger}
                setNavMenuOpen={setisMenuOpen}
                productsNav={productsNav}
                subProductsNav={subProductsNav}
              />
            </div>
            <div className={styles.rightSection}>
              {searchTrigger && <div className={styles.searchTrigger}>{searchTrigger}</div>}
              {!!languageSelector && languageSelector}
              <a
                rel="noreferrer"
                target="_blank"
                className={clsx(styles.iconButton)}
                href="https://github.com/smartcontractkit/documentation"
              >
                <img src={getIconUrl("github")} />
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.headerPlaceholder} />
    </>
  )
}
