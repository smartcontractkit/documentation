import { ProductsNav, SubProducts } from "../../config"
import { Category } from "./Category"

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
