import React, { useEffect, useRef, useState } from "react"
import { ProductsNav, SubProductsNav } from "./config.tsx"
import styles from "./navBar.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"
import { useScrollDirection } from "./useScrollDirection.tsx"
import { useScrollPosition } from "./useScrollPosition.tsx"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation.tsx"
import { useHideHeader } from "./useHideHeader.tsx"
import ProductChainTable from "../../QuickLinks/sections/ProductChainTable.tsx"

interface WeglotType {
  initialize(config: {
    api_key: string
    switchers: Array<{
      button_style: {
        full_name: boolean
        with_name: boolean
        is_dropdown: boolean
        with_flags: boolean
      }
      location: {
        target: string
        sibling: null
      }
    }>
  }): void
}

declare const Weglot: WeglotType

export type SearchTrigger = React.ReactNode

export type NavBarProps = {
  searchTrigger?: SearchTrigger
  path: string
  onHideChange?: (hidden: boolean) => void
  productsNav: ProductsNav
  subProductsNav: SubProductsNav
  doubleNavbar: boolean
}

export const navBarHeight = 64

export const NavBar = ({
  path,
  searchTrigger,
  onHideChange,
  productsNav,
  subProductsNav,
  doubleNavbar,
}: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMegaMenuOpen, setShowMegaMenu] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)

  const scrollDirection = useScrollDirection()
  const { isAtTopOfPage, isAtBottomOfPage } = useScrollPosition(navBarHeight)
  const { shouldHideHeader } = useHideHeader({
    isMenuOpen,
    scrollDirection,
    onHideChange,
    isAtTopOfPage,
    isAtBottomOfPage,
  })

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  useEffect(() => {
    if (
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("documentation-private-git-")
    ) {
      const script = document.createElement("script")
      script.src = "https://cdn.weglot.com/weglot.min.js"
      script.async = true
      script.onload = () => {
        Weglot.initialize({
          api_key: "wg_bc56a95905bfa8990f449554339e82be8",
          switchers: [
            {
              button_style: {
                full_name: false,
                with_name: true,
                is_dropdown: true,
                with_flags: false,
              },
              location: {
                target: "#weglot",
                sibling: null,
              },
            },
          ],
        })
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [])

  const exitMegamenu = () => {
    setShowMegaMenu(false)
  }
  const showMegaMenu = () => {
    setShowMegaMenu(true)
  }

  return (
    <>
      <header className={styles.header} ref={navRef}>
        <div
          className={clsx(styles.navBar, { [styles.headerHidden]: shouldHideHeader, [styles.noShadow]: doubleNavbar })}
        >
          <div className={clsx(styles.container, { [styles.isHomepage]: !doubleNavbar })}>
            <div className={styles.logoSection} onMouseEnter={exitMegamenu}>
              <a rel="noreferrer noopener" className={clsx("home-logo", styles.logo)} href="https://dev.chain.link/">
                <img
                  alt="Documentation Home"
                  title="Documentation Home"
                  style={{ display: "flex" }}
                  src="/chainlink-docs.svg"
                  height={32}
                />
              </a>
            </div>
            <div className={styles.menuSection}>
              <ProductNavigation
                path={path}
                searchTrigger={searchTrigger}
                setNavMenuOpen={setIsMenuOpen}
                productsNav={productsNav}
                subProductsNav={subProductsNav}
                showMegaMenu={showMegaMenu}
                isMegamenuOpen={isMegaMenuOpen}
                exitMegamenu={exitMegamenu}
              />
            </div>
            <div className={styles.rightSection} onMouseEnter={exitMegamenu}>
              <div id="weglot" className={styles.weglotContainer} />
              {searchTrigger && <div className={styles.searchTrigger}>{searchTrigger}</div>}
            </div>
          </div>
        </div>
      </header>
      <div className={styles.headerPlaceholder} />

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modalContentWrapper} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={toggleModal}>
              &times;
            </button>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>
                Quick links for <span>Builders</span>
              </h2>
              <p className={styles.modalDescription}>
                Find all the supported networks at a glance, and the network-specific information you need to build your
                project.
              </p>
              <ProductChainTable />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
