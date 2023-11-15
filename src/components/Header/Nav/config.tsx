type LinksConfig = {
  docs?: boolean
  githubUrl?: string
  actionButton?: { label: string; href: string }
}

export type Item = { label: string; icon?: string; href: string }

export type ProductItem = Item & {
  subProducts?: {
    label: string
    items: Item[]
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

export const devHubCategories = [
  {
    items: [
      {
        label: "Home",
        icon: "home",
        href: "https://dev.chain.link/",
        subMenu: {
          label: "Home's subproducts",
          items: [
            { label: "Subproduct 1", href: "https://..." },
            {
              label: "Subproduct 2",
              href: "https://",
            },
          ],
        },
      },
      {
        label: "Docs",
        icon: "docs",
        href: "https://docs.chain.link",
      },
      {
        label: "All Resources",
        icon: "resources",
        href: "https://dev.chain.link/resources",
      },
    ],
  },
  {
    label: "Product Resources",
    items: [
      {
        label: "CCIP",
        icon: "ccip",
        href: "https://dev.chain.link/products/ccip",
      },
      {
        label: "Data",
        icon: "data",
        href: "https://dev.chain.link/products/data",
      },
      {
        label: "Functions",
        icon: "functions",
        href: "https://dev.chain.link/products/functions",
      },
      {
        label: "Automation",
        icon: "automation",
        href: "https://dev.chain.link/products/automation",
      },
      {
        label: "VRF",
        icon: "vrf",
        href: "https://dev.chain.link/products/vrf",
      },
      {
        label: "General",
        icon: "general",
        href: "https://dev.chain.link/products/general",
      },
    ],
  },
]
