import { SubProductsNav, ProductsNav } from "../config.tsx"
import { ProductNavigation as Desktop } from "./Desktop/ProductNavigation.tsx"
import { ProductNavigation as Mobile } from "./Mobile/ProductNavigation.tsx"

type Props = {
  path: string
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
