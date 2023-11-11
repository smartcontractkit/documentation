import React from "react"
import { ExternalLink } from "@chainlink/components"
import { clsx } from "../../../lib"
import { getIconUrl } from "./utils"
import { config } from "./config"
import { getDevHubPageHref } from "./getDevHubPageHref"
import { Logo } from "./Logo"
import { NavBarProps } from "./Nav"
import styles from "./navBar.module.css"
import { NavTabs } from "./NavTabs/NavTabs"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation"
import { useScrollDirection } from "./useScrollDirection"
import { useScrollPosition } from "./useScrollPosition"

type Props = NavBarProps & {
  isMenuOpen: boolean
  setNavMenuOpen: (navMenuOpen: boolean) => void
  walletSection?: React.ReactNode
}

export const navBarHeight = 64

export const NavBarView = ({
  app,
  path,
  walletSection,
  searchInput: SearchInput,
  searchTrigger,
  isMenuOpen,
  setNavMenuOpen,
  onHideChange,
  productsNav,
  subProductsNav,
}: Props) => {
  const appConfig = config[app]
  const navTabsOptions = appConfig.navTabs
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
            <div className={styles.section}>
              <Logo app={app} />
              <ProductNavigation
                app={app}
                path={path}
                SearchInput={SearchInput}
                setNavMenuOpen={setNavMenuOpen}
                productsNav={productsNav}
                subProductsNav={subProductsNav}
              />
              {navTabsOptions && <NavTabs options={navTabsOptions} path={path} />}
            </div>
            <div className={styles.section}>
              {SearchInput && (
                <div className={styles.searchInput}>
                  <SearchInput />
                </div>
              )}
              {searchTrigger && <div className={styles.searchTrigger}>{searchTrigger}</div>}
              {appConfig.githubUrl && (
                <ExternalLink className={styles.iconButton} href={appConfig.githubUrl}>
                  <img src={getIconUrl("github")} />
                </ExternalLink>
              )}
              <ExternalLink className={styles.iconButton} href={getDevHubPageHref(app)}>
                <img src={getIconUrl("docs")} />
              </ExternalLink>
              {/* <div id="weglot"></div> */}
              {walletSection && walletSection}
              {appConfig.actionButton && (
                <ExternalLink href={appConfig.actionButton.href} className={styles.button}>
                  {appConfig.actionButton.label}
                </ExternalLink>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className={styles.headerPlaceholder} />
    </>
  )
}
