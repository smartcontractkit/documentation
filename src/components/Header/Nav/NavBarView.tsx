import React from "react"
import { NavBarProps } from "./NavBar"
import styles from "./navBar.module.css"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation"
import { useScrollDirection } from "./useScrollDirection"
import { useScrollPosition } from "./useScrollPosition"
import { clsx, getIconUrl } from "./utils"

type Props = NavBarProps & {
  isMenuOpen: boolean
  setNavMenuOpen: (navMenuOpen: boolean) => void
  walletSection?: React.ReactNode
  languageSelector?: React.ReactNode
}

export const navBarHeight = 64

export const NavBarView = ({
  path,
  searchTrigger,
  isMenuOpen,
  setNavMenuOpen,
  onHideChange,
  productsNav,
  subProductsNav,
}: Props) => {
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
                setNavMenuOpen={setNavMenuOpen}
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
                <img width={"24px"} height={"24px"} src={getIconUrl("github")} />
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.headerPlaceholder} />
    </>
  )
}
