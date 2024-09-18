import React from "react"
import { ProductItem, SubProducts, SubProductItem } from "../../Header/Nav/config"
import { clsx } from "~/lib"
import styles from "./category.module.css"
import { isMatchedPath } from "../../Header/Nav/isMatchedPath"

type ListItemProps = {
  item: ProductItem
  onProductClick: (subProducts: SubProducts) => void
  currentPath: string
}

const Item = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ item: { label, icon, href, subProducts, divider = false }, onProductClick, currentPath }, forwardedRef) => {
    const itemComponent = (
      <>
        {icon && <img height={20} width={20} src={icon} />}
        <span style={{ flex: 1, textAlign: "start" }} className="text-200">
          {label}
        </span>
      </>
    )

    const handleProductClick = () => {
      const subProductItems = subProducts as unknown as SubProductItem[]
      const mappedSubProducts: SubProducts = {
        label,
        items: subProductItems.map((subProductItem) => ({
          label: subProductItem.label,
          href: subProductItem.href || "#",
          pages: subProductItem.items.map((item) => ({
            label: item.label,
            href: item.href || "/",
            children: item.children || [],
          })),
        })),
      }
      onProductClick(mappedSubProducts)
    }

    return subProducts ? (
      <button
        className={clsx(styles.link, "product-link", {
          [styles.active]: isMatchedPath(currentPath, href),
          [styles.divider]: divider,
        })}
        style={{ marginTop: "var(--space-0x)" }}
        onClick={handleProductClick}
        data-testid="sub-product-navigation-trigger-mobile"
      >
        {itemComponent}
      </button>
    ) : (
      <a className={clsx(styles.link, "product-link")} href={href} ref={forwardedRef}>
        {itemComponent}
      </a>
    )
  }
)

Item.displayName = "Item"

type CategoryProps = {
  label?: string
  items: ProductItem[]
  onProductClick: (subProducts: SubProducts) => void
  currentPath: string
}

export const Category = ({ label, items, onProductClick, currentPath }: CategoryProps) => {
  return (
    <li className={styles.category}>
      {label && <p className={styles.label}>{label}</p>}
      {items.map((item) => (
        <Item key={item.label} {...{ item, onProductClick, currentPath }} />
      ))}
    </li>
  )
}
