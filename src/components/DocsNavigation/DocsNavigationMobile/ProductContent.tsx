import { ProductsNav, ProductItem } from "../../Header/Nav/config.tsx"
import { Category } from "./Category.tsx"

type Props = {
  onProductClick: (product: ProductItem) => void
  productsNav: ProductsNav
  currentPath: string
}

export const ProductContent = ({ onProductClick, productsNav, currentPath }: Props) => {
  return (
    <>
      {productsNav.categories.map(({ label, items }) => (
        <Category key={label} label={label} items={items} onProductClick={onProductClick} currentPath={currentPath} />
      ))}
    </>
  )
}
