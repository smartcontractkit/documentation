import React from 'react'
import { AppName, ProductsNav } from '../config'
import { SubProductsNav } from '../config'
import { SearchInput } from '../NavBar'
import { ProductNavigation as Desktop } from './Desktop/ProductNavigation'
import { ProductNavigation as Mobile } from './Mobile/ProductNavigation'

type Props = {
  app: AppName
  path: string
  SearchInput?: SearchInput
  setNavMenuOpen: (navMenuOpen: boolean) => void
  productsNav?: ProductsNav
  subProductsNav?: SubProductsNav
}

export const ProductNavigation = (props: Props) => (
  <>
    <Desktop {...props} />
    <Mobile app={props.app} SearchInput={props.SearchInput} />
  </>
)
