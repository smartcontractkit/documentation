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
  showMegaMenu: () => void
  isMegamenuOpen: boolean
  exitMegamenu: () => void
}

export const ProductNavigation = (props: Props) => (
  <>
    <Desktop {...props} />
    <Mobile />
  </>
)
