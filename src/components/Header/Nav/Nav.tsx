import React from "react"
import { AppName, ProductsNav, SubProductsNav } from "./config"
import { NavBarView } from "./NavBarView"

type SearchProps = React.PropsWithChildren<{ onSuccess?: () => void }>

export type SearchInput = React.ComponentType<SearchProps>

export type NavBarProps =
  // This is for inputs, which on mobile are displayed inside the dropdown menu and on desktop in the navBar
  (
    | { searchInput?: SearchInput; searchTrigger?: never }
    // This is for modals. The trigger is displayed in navbar on both mobile and desktop
    | { searchTrigger?: React.ReactNode; searchInput?: never }
  ) & {
    app: AppName
    path: string
    onHideChange?: (hidden: boolean) => void
    productsNav?: ProductsNav
    subProductsNav?: SubProductsNav
  }

export const Nav = (props: NavBarProps) => {
  const [navMenuOpen, setNavMenuOpen] = React.useState(false)

  return <NavBarView setNavMenuOpen={setNavMenuOpen} isMenuOpen={navMenuOpen} {...props} />
}
