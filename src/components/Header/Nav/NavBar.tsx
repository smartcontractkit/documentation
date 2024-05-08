import React, { useState } from "react"
import { ProductsNav, SubProductsNav } from "./config"
import styles from "./navBar.module.css"
import { clsx } from "./utils"
import { useScrollDirection } from "./useScrollDirection"
import { useScrollPosition } from "./useScrollPosition"
import { ProductNavigation } from "./ProductNavigation/ProductNavigation"
import { useHideHeader } from "./useHideHeader"
import ProductChainTable from "../../QuickLinks/sections/ProductChainTable"
import QuickLinksIcon from "../../QuickLinks/assets/quick-links-icon.svg"

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
              <button className={styles.quickLinksButton} onClick={toggleModal}>
                <img src={QuickLinksIcon.src} className={styles.quickLinksIcon} alt="Quick Links" />
              </button>
              {searchTrigger && <div className={styles.searchTrigger}>{searchTrigger}</div>}
              <div id="weglot" />
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
