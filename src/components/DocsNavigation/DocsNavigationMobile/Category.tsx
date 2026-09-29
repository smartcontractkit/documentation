import React from "react"
import { ProductItem } from "../../Header/Nav/config.ts"
import { clsx } from "~/lib/clsx/clsx.ts"
import styles from "./category.module.css"
import { isMatchedPath } from "../../Header/Nav/isMatchedPath.ts"

type ListItemProps = {
  item: ProductItem
  onProductClick: (product: ProductItem) => void
  currentPath: string
}

const Item = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ item, onProductClick, currentPath }, forwardedRef) => {
    const { label, icon, href, subProducts, divider = false } = item
    const itemComponent = (
      <>
        {icon && <img height={20} width={20} src={icon} />}
        <span style={{ flex: 1, textAlign: "start" }} className="text-200">
          {label}
        </span>
      </>
    )

    // The tree for this product is resolved centrally in DocsPickerMobile (CCIP is versioned), so we
    // just hand back the product identity here — never a pre-built static tree.
    return subProducts ? (
      <button
        className={clsx(styles.link, "product-link", {
          [styles.active]: isMatchedPath(currentPath, href),
          [styles.divider]: divider,
        })}
        style={{ marginTop: "var(--space-0x)" }}
        onClick={() => onProductClick(item)}
        data-testid="sub-product-navigation-trigger-mobile"
      >
        {itemComponent}
      </button>
    ) : (
      <a
        className={clsx(styles.link, "product-link")}
        href={href.startsWith("http") ? href : `/${href}`}
        ref={forwardedRef}
      >
        {itemComponent}
      </a>
    )
  }
)

Item.displayName = "Item"

type CategoryProps = {
  label?: string
  items: ProductItem[]
  onProductClick: (product: ProductItem) => void
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
