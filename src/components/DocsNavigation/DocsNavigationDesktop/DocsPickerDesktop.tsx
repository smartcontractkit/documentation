import { useState } from "react"
import { isMatchedPath } from "../../Header/Nav/isMatchedPath"
import { getNavigationProps } from "../../Header/getNavigationProps"
import styles from "./docsPickerDesktop.module.css"
import { clsx } from "../../Header/Nav/utils"
import defaultLogo from "../../../assets/product-logos/default-logo.svg"

function DocsPickerDesktop({ pathname }: { pathname: string }) {
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const { subProductsNav } = getNavigationProps()
  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath(pathname, href))

  const label = subProductTrigger?.label || "Resources"
  const icon = subProductTrigger?.label ? subProductTrigger.icon : defaultLogo.src

  return (
    <div
      className={styles.docsPickerContainer}
      onMouseEnter={() => setProductMenuOpen(true)}
      onMouseLeave={() => setProductMenuOpen(false)}
    >
      <img src={icon} alt="" className={styles.logo} />
      <span>{label}</span>
      <div className={styles.caret}>
        <span></span>
      </div>
      {productMenuOpen && (
        <div className={styles.menu}>
          <ul className={styles.column}>
            {subProductsNav
              .filter((item) => !item.hideFromDropdown && item.col === 1)
              .map((item) => (
                <li className={clsx(styles.item)} key={item.label}>
                  <a
                    className={clsx(styles.link, { [styles.active]: isMatchedPath(pathname, item.href) })}
                    href={item.href}
                  >
                    <img className={clsx(styles.icon)} src={item.icon}></img>
                    {item.label}
                  </a>
                </li>
              ))}
          </ul>
          <ul className={styles.column}>
            {subProductsNav
              .filter((item) => !item.hideFromDropdown && item.col === 2)
              .map((item) => (
                <li className={clsx(styles.item)} key={item.label}>
                  <a className={clsx(styles.link)} href={item.href}>
                    <img className={clsx(styles.icon)} src={item.icon}></img>
                    {item.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DocsPickerDesktop
