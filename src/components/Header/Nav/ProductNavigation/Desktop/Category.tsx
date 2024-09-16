import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { SubProductsNavItem } from "../../config"
import { clsx } from "../../utils"
import styles from "./category.module.css"

type ListItemProps = SubProductsNavItem & { className?: string }

type CategoryProps = {
  label?: string
  items: ListItemProps[]
  className?: string
}

const Item = React.forwardRef<HTMLAnchorElement, ListItemProps>(({ label, icon, href, className }, forwardedRef) => (
  <NavigationMenu.Link asChild>
    <a className={clsx(styles.link, className)} href={href} ref={forwardedRef}>
      {icon && <img height={20} width={20} src={`/assets/icons/${icon}-navbar-icon.svg`} />}
      {label}
    </a>
  </NavigationMenu.Link>
))

Item.displayName = "Item"

export const Category = ({ label, items, className }: CategoryProps) => (
  <li className={styles.item}>
    {label && <p className="paragraph-100">{label}</p>}
    {items
      .filter((item) => !item.hideFromDropdown)
      .map((item) => (
        <Item key={item.label} {...item} className={className} />
      ))}
  </li>
)
