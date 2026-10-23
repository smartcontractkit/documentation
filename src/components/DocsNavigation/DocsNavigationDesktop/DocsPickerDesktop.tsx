import { useState } from "react"
import { isMatchedPath } from "../../Header/Nav/isMatchedPath.ts"
import { getNavigationProps, getSubProductByParentParam } from "../../Header/getNavigationProps.ts"
import styles from "./docsPickerDesktop.module.css"
import { clsx } from "../../Header/Nav/utils.ts"
import defaultLogo from "../../../assets/product-logos/default-logo.svg"

function DocsPickerDesktop({ pathname, parentSection = null }: { pathname: string; parentSection?: string | null }) {
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const { subProductsNav } = getNavigationProps()

  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath(pathname, href))
  // A shared page viewed through a product sidebar keeps that product in the trigger.
  const parentProduct = getSubProductByParentParam(parentSection)
  const activeProduct = parentProduct || subProductTrigger

  const label = activeProduct?.label || "Resources"
  const icon = activeProduct?.label ? activeProduct.icon : defaultLogo.src

  return (
    <div
      className={styles.docsPickerContainer}
      onMouseEnter={() => setProductMenuOpen(true)}
      onMouseLeave={() => setProductMenuOpen(false)}
    >
      <img src={icon} alt="" className={styles.logo} data-docs-picker-icon />
      <span data-docs-picker-label>{label}</span>
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
                    className={clsx(styles.link, {
                      [styles.active]: isMatchedPath(pathname, item.href) || item.href === parentProduct?.href,
                    })}
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
