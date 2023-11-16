const devHubProductsUrl = "https://dev.chain.link/products/"

const docsSubProductsNav = [
  {
    label: "Data Feeds",
    href: "/data-feeds",
  },
  {
    label: "Data Streams",
    href: "/data-streams",
  },
  {
    label: "CCIP",
    href: "/ccip",
  },
  {
    label: "Functions",
    href: "/chainlink-functions",
  },
  {
    label: "VRF",
    href: "/vrf",
  },
  {
    label: "Automation",
    href: "/chainlink-automation",
  },
  {
    label: "Nodes",
    href: "/chainlink-nodes",
  },
  {
    label: "Overview",
    href: "/",
    hideFromDropdown: true,
  },
]

const devHubResourcesUrl = "https://dev.chain.link/resources/"

const quickStartsSubProductsNav = [
  {
    label: "All Resources",
    href: devHubResourcesUrl,
  },
  {
    label: "Guides",
    href: devHubResourcesUrl + "guides",
  },
  {
    label: "Courses",
    href: devHubResourcesUrl + "courses",
  },
  {
    label: "Beginner Tutorials",
    href: devHubResourcesUrl + "beginner-tutorials",
  },
  {
    label: "Tech Talks",
    href: devHubResourcesUrl + "tech-talks",
  },
  {
    label: "Documentation",
    href: "https://docs.chain.link",
  },
  {
    label: "QuickStarts",
    href: devHubResourcesUrl + "quickstarts",
  },
  {
    label: "Case Studies",
    href: devHubResourcesUrl + "case-studies",
  },
  {
    label: "Blogs",
    href: devHubResourcesUrl + "blogs",
  },
  {
    label: "Videos",
    href: devHubResourcesUrl + "videos",
  },
  {
    label: "QuickStarts",
    href: "/quickstarts",
    hideFromDropdown: true,
  },
]

const devHubCategories = [
  {
    label: "Developer Hub",
    items: [
      {
        label: "Home",
        icon: "home",
        href: "https://dev.chain.link/",
      },
      {
        label: "Docs",
        icon: "documentation",
        href: "https://docs.chain.link",
        subProducts: {
          label: "Docs",
          items: docsSubProductsNav,
        },
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
        href: devHubProductsUrl + "ccip",
      },
      {
        label: "Data",
        icon: "data",
        href: devHubProductsUrl + "data",
      },
      {
        label: "Functions",
        icon: "functions",
        href: devHubProductsUrl + "functions",
      },
      {
        label: "Automation",
        icon: "automation",
        href: devHubProductsUrl + "automation",
      },
      {
        label: "VRF",
        icon: "vrf",
        href: devHubProductsUrl + "vrf",
      },
      {
        label: "General",
        icon: "general",
        href: devHubProductsUrl + "general",
      },
    ],
  },
]

const quickStartsProductsNav = {
  trigger: { label: "All Resources", icon: "resources" },
  categories: devHubCategories,
}

const docsProductsNav = {
  trigger: { label: "Docs", icon: "docs" },
  categories: devHubCategories,
}

const quickStartsProps = { productsNav: quickStartsProductsNav, subProductsNav: quickStartsSubProductsNav }
const docsProps = { productsNav: docsProductsNav, subProductsNav: docsSubProductsNav }

export const getNavigationProps = (path: string) => {
  const isQuickStarts = path.startsWith("/quickstarts")

  return isQuickStarts ? quickStartsProps : docsProps
}
