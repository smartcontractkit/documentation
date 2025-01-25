import { useState } from "react"
import { isMatchedPath } from "../Header/Nav/isMatchedPath"
import { getNavigationProps } from "../Header/getNavigationProps"
import styles from "./docsPicker.module.css"
import { clsx } from "../Header/Nav/utils"

function DocsPicker({ pathname }: { pathname: string }) {
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const { subProductsNav } = getNavigationProps()
  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath(pathname, href))

  const label = subProductTrigger?.label || "Resources"
  const icon = subProductTrigger?.label ? subProductTrigger.icon : undefined

  // MENU
  return (
    <div
      className={styles.container}
      onMouseEnter={() => setProductMenuOpen(true)}
      onMouseLeave={() => setProductMenuOpen(false)}
    >
      <img src={icon} alt="" className={styles.logo} /> {label}
      <div className={styles.caret}>
        <span></span>
      </div>
      {productMenuOpen && (
        <div className={styles.menu}>
          <ul>
            {subProductsNav
              .filter((item) => !item.hideFromDropdown)
              .map((item) => (
                <li className={styles.item} key={item.label}>
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

export default DocsPicker
