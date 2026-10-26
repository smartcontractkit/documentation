import React, { useEffect, useRef } from "react"
import { useStore } from "@nanostores/react"
import { selectedLanguage } from "~/lib/languageStore.js"
import { selectedChainType } from "~/stores/chainType.js"
import { BackArrowIcon } from "./BackArrowIcon.js"
import { Page } from "../../Header/Nav/config.js"
import { isChainVisible } from "~/utils/ccipSidebarChainFilter.js"
import styles from "./subProductContent.module.css"

type Props = {
  onSubproductClick: () => void
  subProducts?: {
    label: string
    items: { label: string; icon?: string; href: string; pages?: Page[] }[]
  }
  currentPath: string
}

// Separate component for each page link to properly use React hooks
const PageLink = ({ page, currentPath, level }: { page: Page; currentPath: string; level: number }) => {
  const adjustedHref = page.href.startsWith("http") ? page.href : `/${page.href}`

  // Normalize paths for comparison (remove trailing slashes)
  const normalizedCurrentPath = currentPath.replace(/\/$/, "")
  const normalizedHref = adjustedHref.replace(/\/$/, "")

  // Check if current path matches this page's href or any of its highlightAsCurrent variants
  const isActive =
    normalizedCurrentPath === normalizedHref ||
    (page.highlightAsCurrent &&
      page.highlightAsCurrent.some((variant) => normalizedCurrentPath === `/${variant.replace(/\/$/, "")}`))

  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (isActive && linkRef.current) {
      linkRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isActive])

  const linkStyle = {
    backgroundColor: isActive ? "var(--blue-100)" : "transparent",
    color: isActive ? "var(--blue-600)" : "inherit",
    fontWeight: isActive ? "500" : "normal",
  }

  // Format chainTypes as data attribute (matching desktop sidebar)
  const chainAttr = page.chainTypes ? page.chainTypes.join(",") : "universal"

  return (
    <a
      ref={linkRef}
      style={linkStyle}
      className={`${styles.link} subproduct-link level-${level}`}
      href={adjustedHref}
      data-chain-types={chainAttr}
    >
      {page.label}
    </a>
  )
}

const renderPages = (
  pages: Page[],
  currentPath: string,
  currentLang: string,
  currentChain: string,
  level = 0
): React.ReactNode[] => {
  return pages
    .filter((page) => {
      // Filter by sdkLang (for CRE language switching)
      if (page.sdkLang && page.sdkLang !== currentLang) {
        return false
      }
      // Chain-family filter, applied at RENDER time (shared rule with the desktop sidebar) so it can
      // never go stale when the tree is swapped. Universal / untagged pages always show.
      if (!isChainVisible(page.chainTypes, currentChain)) {
        return false
      }
      return true
    })
    .map((page) => {
      // Non-clickable blue group label — mirrors the desktop sidebar's type:"separator".
      if (page.type === "separator") {
        const chainAttr = page.chainTypes ? page.chainTypes.join(",") : "universal"
        return (
          <span key={`separator-${page.label}`} className={styles.separator} data-chain-types={chainAttr}>
            {page.label}
          </span>
        )
      }
      return (
        <React.Fragment key={`${page.label}-${page.href}`}>
          <PageLink page={page} currentPath={currentPath} level={level} />
          {page.children && renderPages(page.children, currentPath, currentLang, currentChain, level + 1)}
        </React.Fragment>
      )
    })
}

export const SubProductContent = ({ subProducts, onSubproductClick, currentPath }: Props) => {
  const currentLang = useStore(selectedLanguage)
  // Chain family is read reactively: SubProductContent re-renders (and re-filters) whenever the
  // selected chain changes OR the tree changes. No post-render DOM mutation — filtering happens in
  // renderPages, which is what keeps mobile in parity with the desktop sidebar.
  const currentChain = useStore(selectedChainType)

  if (!subProducts) {
    return null
  }

  return (
    <>
      <button key="back" className={styles.back} onClick={onSubproductClick}>
        <BackArrowIcon />
        Back
      </button>
      {subProducts.items.map(({ label, pages }) => {
        const rendered = pages ? renderPages(pages, currentPath, currentLang, currentChain, 1) : []
        // Hide a section whose pages are all filtered out for the active chain family.
        if (rendered.length === 0) {
          return null
        }
        return (
          <div key={label}>
            <h3 className={styles.section}>{label}</h3>
            {rendered}
          </div>
        )
      })}
    </>
  )
}
