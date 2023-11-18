import React from "react"
import { ProductsNav, SubProductsNav } from "./config"
import { NavBarView } from "./NavBarView"

export type SearchTrigger = React.ReactNode

export type NavBarProps = {
  searchTrigger?: SearchTrigger
  path: string
  onHideChange?: (hidden: boolean) => void
  productsNav: ProductsNav
  subProductsNav: SubProductsNav
}

export const NavBar = (props: NavBarProps) => {
  const { path, searchTrigger, onHideChange } = props
  const [navMenuOpen, setNavMenuOpen] = React.useState(false)

  return (
    <NavBarView
      setNavMenuOpen={setNavMenuOpen}
      isMenuOpen={navMenuOpen}
      path={path}
      searchTrigger={searchTrigger}
      onHideChange={onHideChange}
      productsNav={props.productsNav}
      subProductsNav={props.subProductsNav}
    />
  )
}
