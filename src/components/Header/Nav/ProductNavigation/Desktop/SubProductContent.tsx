import React from 'react'
import { SubProductsNav } from '../../config'
import { Category } from './Category'

export const SubProductContent = ({ label, items }: SubProductsNav) => (
  <ul
    style={{
      display: 'flex',
      flexDirection: 'column',
      margin: '0',
      listStyle: 'none',
      padding: 'var(--space-6x)',
      width: '323px',
    }}
  >
    <Category
      key={label}
      label={label}
      items={items}
      className="subproduct-link"
    />
  </ul>
)
