import { ProductItem } from "../../config"
import { Category } from "./Category"
import styles from "./productContent.module.css"

type Props = { categories: { label?: string; items: ProductItem[] }[] }

export const ProductContent = ({ categories }: Props) => (
  <div className={styles.content}>
    <ul>
      {categories.map(({ label, items }) => (
        <Category key={label} label={label} items={items} className="product-link" />
      ))}
    </ul>
  </div>
)
