import React from "react"
import { ProductsNav, SubProductsNav } from "./config"
import styles from "./navBar.module.css"
import { clsx } from "./utils"
import { useScrollDirection } from "./useScrollDirection"
import { useScrollPosition } from "./useScrollPosition"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation"
import { useHideHeader } from "./useHideHeader"

export type SearchTrigger = React.ReactNode

export type NavBarProps = {
  searchTrigger?: SearchTrigger
  path: string
  onHideChange?: (hidden: boolean) => void
  productsNav: ProductsNav
  subProductsNav: SubProductsNav
}

export const navBarHeight = 64

export const NavBar = ({ path, searchTrigger, onHideChange, productsNav, subProductsNav }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const scrollDirection = useScrollDirection()
  const { isAtTopOfPage, isAtBottomOfPage } = useScrollPosition(navBarHeight)
  const { shouldHideHeader } = useHideHeader({
    isMenuOpen,
    scrollDirection,
    onHideChange,
    isAtTopOfPage,
    isAtBottomOfPage,
  })

  return (
    <>
      <header className={styles.header}>
        <div className={clsx(styles.navBar, shouldHideHeader && styles.headerHidden)}>
          <div className={styles.container}>
            <div className={styles.leftSection}>
              <ProductNavigation
                path={path}
                searchTrigger={searchTrigger}
                setNavMenuOpen={setIsMenuOpen}
                productsNav={productsNav}
                subProductsNav={subProductsNav}
              />
            </div>
            <div className={styles.rightSection}>
              {searchTrigger && <div className={styles.searchTrigger}>{searchTrigger}</div>}
              <div id="weglot" />
              <a
                rel="noreferrer"
                target="_blank"
                className={clsx(styles.button)}
                href="https://github.com/smartcontractkit/documentation"
              >
                <img width="24px" height="24px" src="/assets/github.svg" />
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.headerPlaceholder} />
    </>
  )
}
