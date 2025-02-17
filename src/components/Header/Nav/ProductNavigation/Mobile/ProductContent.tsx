import { ProductsNav, SubProducts } from "../../config.tsx"
import { Category } from "./Category.tsx"

type Props = {
  onProductClick: (subProducts: SubProducts) => void
  productsNav: ProductsNav
}

export const ProductContent = ({ onProductClick, productsNav }: Props) => {
  return (
    <>
      {productsNav.categories.map(({ label, items }) => (
        <Category key={label} label={label} items={items} onProductClick={onProductClick} />
      ))}
    </>
  )
}
