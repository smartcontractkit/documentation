import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { clsx } from "../../utils"
import { SubProductsNav } from "../../config"
import styles from "./subProductContent.module.css"

export const SubProductContent = ({ items }: SubProductsNav) => (
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
      {items
        .filter((item) => !item.hideFromDropdown)
        .map((item) => (
          <NavigationMenu.Link asChild>
            <a
              className={clsx(styles.link, "subproduct-link")}
              href={item.href}
              // ref={item.forwardedRef}
            >
              {item.label}
            </a>
          </NavigationMenu.Link>
        ))}
    </li>
  </ul>
)
