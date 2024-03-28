import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { SubProductsNav } from "../../config"
import { clsx } from "../../utils"
import styles from "./subProductContent.module.css"

export const SubProductContent = ({ subProductsNav }: { subProductsNav: SubProductsNav }) => (
  <ul
    style={{
      display: "flex",
      flexDirection: "column",
      margin: "0",
      listStyle: "none",
      padding: "var(--space-2x)",
      width: "240px",
    }}
  >
    <li className={styles.item}>
      {subProductsNav
        .filter((item) => !item.hideFromDropdown)
        .map((item) => (
          <NavigationMenu.Link key={item.label} asChild>
            <a className={clsx(styles.link, "subproduct-link")} href={item.href}>
              <img className={clsx(styles.icon, "subproduct-icon")} src={item.icon}></img>
              {item.label}
            </a>
          </NavigationMenu.Link>
        ))}
    </li>
  </ul>
)
