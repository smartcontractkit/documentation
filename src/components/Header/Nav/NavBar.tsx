import React, { useEffect, useRef, useState } from "react"
import { ProductsNav, SubProductsNav } from "./config"
import styles from "./navBar.module.css"
import { clsx } from "./utils"
import { useScrollDirection } from "./useScrollDirection"
import { useScrollPosition } from "./useScrollPosition"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation"
import { useHideHeader } from "./useHideHeader"
import ProductChainTable from "../../QuickLinks/sections/ProductChainTable"
import QuickLinksIcon from "../../QuickLinks/assets/quick-links-icon.svg"
import { Search } from "../aiSearch/Search"

declare const Weglot: any

export type SearchTrigger = React.ReactNode

export type NavBarProps = {
  searchTrigger?: SearchTrigger
  path: string
  onHideChange?: (hidden: boolean) => void
  productsNav: ProductsNav
  subProductsNav: SubProductsNav
  showMegaMenu: () => void
  isMegamenuOpen: boolean
  exitMegamenu: () => void
}

export const navBarHeight = 64

const SearchButton = <Search variant="default" />

export const NavBar = ({
  path,
  searchTrigger,
  onHideChange,
  productsNav,
  subProductsNav,
  showMegaMenu,
  isMegamenuOpen,
  exitMegamenu,
}: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  return (
    <>
      <header className={styles.header} ref={navRef}>
        <div className={clsx(styles.navBar, shouldHideHeader && styles.headerHidden)}>
          <div className={styles.container}>
            <div className={styles.logoSection} onMouseEnter={exitMegamenu}>
              <a rel="noreferrer noopener" className={clsx("home-logo", styles.logo)} href="/">
                <img
                  alt="Documentation Home"
                  title="Documentation Home"
                  style={{ display: "flex" }}
                  src="/chainlink-docs.svg"
                  height={30}
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
                isMegamenuOpen={isMegamenuOpen}
                exitMegamenu={exitMegamenu}
              />
            </div>
            <div className={styles.rightSection} onMouseEnter={exitMegamenu}>
              {searchTrigger && <div className={styles.searchTrigger}>{searchTrigger}</div>}
              <div id="weglot" className={styles.weglotContainer} />
              <div className={styles.quickLinksWrapper}>
                <button className={styles.quickLinksButton} onClick={toggleModal}>
                  <img src={QuickLinksIcon.src} className={styles.quickLinksIcon} alt="Search" />
                </button>
                <Search variant="mobile" />
                <span className={styles.quickLinksTooltip}>
                  <img
                    src="https://smartcontract.imgix.net/icons/info.svg?auto=compress%2Cformat"
                    className={styles.infoIcon}
                    alt="Info"
                  />
                  Quick links for Builders
                </span>
              </div>
              <a
                rel="noreferrer noopener"
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
