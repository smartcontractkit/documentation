import { SubProductsNav, ProductsNav } from "../config"
import { SearchTrigger } from "../NavBar"
import { ProductNavigation as Desktop } from "./Desktop/ProductNavigation"
import { ProductNavigation as Mobile } from "./Mobile/ProductNavigation"

type Props = {
  path: string
  searchTrigger?: SearchTrigger
  setNavMenuOpen: (navMenuOpen: boolean) => void
  productsNav: ProductsNav
  subProductsNav?: SubProductsNav
}

export const ProductNavigation = (props: Props) => (
  <>
    <Desktop {...props} />
    <Mobile searchTrigger={props.searchTrigger} productsNav={props.productsNav} />
  </>
)
