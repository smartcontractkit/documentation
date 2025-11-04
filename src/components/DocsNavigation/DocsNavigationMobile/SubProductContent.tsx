import React, { useEffect, useRef } from "react"
import { useStore } from "@nanostores/react"
import { selectedLanguage } from "~/lib/languageStore.js"
import { BackArrowIcon } from "./BackArrowIcon.js"
import { Page } from "../../Header/Nav/config.js"
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

  return (
    <a ref={linkRef} style={linkStyle} className={`${styles.link} subproduct-link level-${level}`} href={adjustedHref}>
      {page.label}
    </a>
  )
}

const renderPages = (pages: Page[], currentPath: string, currentLang: string, level = 0): React.ReactNode[] => {
  return pages
    .filter((page) => {
      // If page has sdkLang, only show if it matches current language
      if (page.sdkLang) {
        return page.sdkLang === currentLang
      }
      // If no sdkLang, always show (language-agnostic pages)
      return true
    })
    .map((page) => {
      return (
        <React.Fragment key={`${page.label}-${page.href}`}>
          <PageLink page={page} currentPath={currentPath} level={level} />
          {page.children && renderPages(page.children, currentPath, currentLang, level + 1)}
        </React.Fragment>
      )
    })
}

export const SubProductContent = ({ subProducts, onSubproductClick, currentPath }: Props) => {
  const currentLang = useStore(selectedLanguage)

  if (!subProducts) {
    return null
  }

  return (
    <>
      <button key="back" className={styles.back} onClick={onSubproductClick}>
        <BackArrowIcon />
        Back
      </button>
      {subProducts.items.map(({ label, pages }) => (
        <div key={label}>
          <h3 className={styles.section}>{label}</h3>
          {pages && renderPages(pages, currentPath, currentLang, 1)}
        </div>
      ))}
    </>
  )
}
