import React, { useEffect, useRef } from "react"
import { BackArrowIcon } from "./BackArrowIcon"
import { Page } from "../../Header/Nav/config"
import styles from "./subProductContent.module.css"

type Props = {
  onSubproductClick: () => void
  subProducts?: {
    label: string
    items: { label: string; icon?: string; href: string; pages?: Page[] }[]
  }
  currentPath: string
}

const renderPages = (pages: Page[], currentPath: string, indent: boolean) => {
  return pages.map(({ label, href, children }) => {
    const adjustedHref = "/" + href
    const isActive = currentPath.replace(/\/$/, "") === adjustedHref.replace(/\/$/, "")

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
      marginLeft: indent ? "20px" : "0",
    }

    return (
      <React.Fragment key={label}>
        <a ref={linkRef} style={linkStyle} className={`${styles.link} subproduct-link`} href={adjustedHref}>
          {label}
        </a>
        {children && renderPages(children, currentPath, true)}
      </React.Fragment>
    )
  })
}

export const SubProductContent = ({ subProducts, onSubproductClick, currentPath }: Props) => {
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
          {pages && renderPages(pages, currentPath, false)}
        </div>
      ))}
    </>
  )
}
