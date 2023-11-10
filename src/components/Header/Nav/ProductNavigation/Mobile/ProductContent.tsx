import React from 'react'
import { AppConfig } from '../../config'
import { Category } from './Category'
import { SubProducts } from './ProductNavigation'

type Props = {
  onProductClick: (subProducts: SubProducts) => void
  appConfig: AppConfig
}

export const ProductContent = ({ onProductClick, appConfig }: Props) => {
  const { categories } = appConfig.productsNav
  return (
    <>
      {categories.map(({ label, items }) => (
        <Category
          key={label}
          label={label}
          items={items}
          onProductClick={onProductClick}
        />
      ))}
    </>
  )
}
