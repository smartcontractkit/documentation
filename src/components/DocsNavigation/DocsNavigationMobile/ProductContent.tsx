import { ProductsNav, SubProducts } from "../../Header/Nav/config.tsx"
import { Category } from "./Category.tsx"

type Props = {
  onProductClick: (subProducts: SubProducts) => void
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
