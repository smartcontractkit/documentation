export type AppName =
  | "Automation"
  | "Faucets"
  | "PegSwap"
  | "VRF"
  | "Staking"
  | "CCIP"
  | "Functions"
  | "InternalApps"
  | "Data"
  | "Docs"
  | "PoR"

type NavTab = {
  label: string
  href: string
}

type NavTabConfig = { navTabs?: NavTab[] }

type LinksConfig = {
  docs?: boolean
  githubUrl?: string
  actionButton?: { label: string; href: string }
}

export type Item = { label: string; icon?: string; href: string }

export type ProductItem = Item & {
  subProducts?: {
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

export type SubProductsNav = {
  label: string
  items: SubProductsNavItem[]
}

export type AppConfig = {
  logo: {
    productIcon: string
    href: string
    ecosystemIcon: "chainlink" | "developerHub"
  }
  productsNav: ProductsNav
  subProductsNav?: SubProductsNav
} & LinksConfig &
  NavTabConfig

type Config = Record<AppName, AppConfig>

export const devHubCategories = [
  {
    items: [
      {
        label: "Home",
        icon: "ccip",
        href: "https://dev.chain.link/",
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

export const productCategories = [
  {
    label: "Products",
    items: [
      {
        label: "Automation",
        icon: "automation",
        href: "https://automation.chain.link/",
      },

      {
        label: "CCIP",
        icon: "ccip",
        href: "https://ccip.chain.link/",
      },
      {
        label: "Data",
        icon: "data",
        href: "https://data.chain.link/",
      },
      {
        label: "Functions",
        icon: "functions",
        href: "https://functions.chain.link/",
      },
      {
        label: "Proof of Reserve",
        icon: "por",
        href: "https://chain.link/proof-of-reserve",
      },
      {
        label: "VRF",
        icon: "vrf",
        href: "https://vrf.chain.link/",
      },
    ],
  },
  {
    label: "Utilities",
    items: [
      {
        label: "Faucets",
        icon: "faucets",
        href: "https://faucets.chain.link/",
      },
      {
        label: "Pegswap",
        icon: "pegswap",
        href: "https://pegswap.chain.link/",
      },
    ],
  },
  {
    label: "Economics",
    items: [
      {
        label: "Staking",
        icon: "staking",
        href: "https://staking.chain.link/",
        subProducts: {
          label: "Staking",
          items: [
            { label: "Overview", href: "https://staking.chain.link/" },
            {
              label: "Eligibility",
              href: "https://staking.chain.link/eligibility",
            },
          ],
        },
      },
    ],
  },
]

export const config: Config = {
  Automation: {
    logo: {
      productIcon: "automation",
      href: "https://automation.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "Automation", icon: "automation" },
      categories: productCategories,
    },
  },
  CCIP: {
    logo: {
      productIcon: "ccip",
      href: "https://ccip.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "CCIP", icon: "ccip" },
      categories: productCategories,
    },
    navTabs: [
      { label: "Overview", href: "/" },
      { label: "Lane Statuses", href: "/status" },
    ],
  },
  Data: {
    logo: {
      productIcon: "data",
      href: "https://data.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "Data", icon: "data" },
      categories: productCategories,
    },
    actionButton: {
      href: "https://chain.link/contact?ref_id=datafeeds",
      label: "Request data",
    },
  },
  Functions: {
    logo: {
      productIcon: "functions",
      href: "https://functions.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "Functions", icon: "functions" },
      categories: productCategories,
    },
    navTabs: [
      { label: "Subscriptions", href: "/" },
      { label: "Playground", href: "/playground" },
    ],
  },
  PoR: {
    logo: {
      productIcon: "por",
      href: "https://chain.link/proof-of-reserve",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "Proof of Reserve", icon: "por" },
      categories: productCategories,
    },
  },
  VRF: {
    logo: {
      productIcon: "vrf",
      href: "https://vrf.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "VRF", icon: "vrf" },
      categories: productCategories,
    },
  },
  Faucets: {
    logo: {
      productIcon: "faucets",
      href: "https://faucets.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "Faucets", icon: "faucets" },
      categories: productCategories,
    },
  },
  PegSwap: {
    logo: {
      productIcon: "pegswap",
      href: "https://pegswap.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "PegSwap", icon: "pegswap" },
      categories: productCategories,
    },
  },

  Staking: {
    logo: {
      productIcon: "staking",
      href: "https://staking.chain.link/",
      ecosystemIcon: "chainlink",
    },
    productsNav: {
      trigger: { label: "Staking", icon: "staking" },
      categories: productCategories,
    },
    navTabs: [
      { label: "Overview", href: "/" },
      { label: "Eligibility", href: "/eligibility" },
    ],
  },
  InternalApps: {
    logo: { productIcon: "faucets", href: "/", ecosystemIcon: "chainlink" },
    productsNav: {
      trigger: { label: "Faucets", icon: "faucets" },
      categories: productCategories,
    },
  },
  Docs: {
    logo: {
      productIcon: "devhub",
      href: "https://dev.chain.link",
      ecosystemIcon: "chainlink",
    },
    githubUrl: "https://github.com/smartcontractkit/documentation",
    productsNav: {
      trigger: { label: "Docs", icon: "docs" },
      categories: devHubCategories,
    },
  },
}
