type LinksConfig = {
  docs?: boolean
  githubUrl?: string
  actionButton?: { label: string; href: string }
}

export type Item = { label: string; icon?: string; href: string }

export type Page = {
  label: string
  href: string
}

export type ProductItem = Item & {
  subProducts?: {
    label: string
    items?: { label: string; href?: string; pages?: Page[] }[]
  }
}

export type ProductsNav = {
  trigger: { label: string; icon: string }
  categories: {
    label?: string
    items: ProductItem[]
  }[]
}

export type SubProductsNavItem = {
  label: string
  icon?: string
  href: string
  hideFromDropdown?: boolean
}

export type SubProductsNav = SubProductsNavItem[]

export type AppConfig = {
  logo: {
    productIcon: string
    href: string
    ecosystemIcon: "chainlink" | "developerHub"
  }
  productsNav: ProductsNav
  subProductsNav?: SubProductsNav
} & LinksConfig
