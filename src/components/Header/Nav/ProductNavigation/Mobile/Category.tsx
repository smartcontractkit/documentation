import React from "react"
import { ProductItem } from "../../config"
import { clsx } from "../../utils"
import { CaretRightIcon } from "./CaretRightIcon"
import styles from "./category.module.css"
import { SubProducts } from "./ProductNavigation"

type ListItemProps = {
  item: ProductItem
  onProductClick: (subProducts: SubProducts) => void
}

const Item = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ item: { label, icon, href, subProducts }, onProductClick }, forwardedRef) => {
    const itemComponent = (
      <>
        {icon && <img height={24} width={24} src={`/assets/icons/${icon}-navbar-icon.svg`} />}
        <span style={{ flex: 1, textAlign: "start" }} className="text-300">
          {label}
        </span>
      </>
    )
    return subProducts ? (
      <button
        className={clsx(styles.link, "product-link")}
        style={{ marginTop: "var(--space-0x)" }}
        onClick={() => onProductClick(subProducts)}
        data-testid="sub-product-navigation-trigger-mobile"
      >
        {itemComponent}
        <CaretRightIcon />
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
}

export const Category = ({ label, items, onProductClick }: CategoryProps) => {
  return (
    <li className={styles.category}>
      {label && <p className={styles.label}>{label}</p>}
      {items.map((item) => (
        <Item key={item.label} {...{ item, onProductClick }} />
      ))}
    </li>
  )
}
