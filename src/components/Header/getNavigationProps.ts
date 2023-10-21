const devHubCategories = [
  {
    label: "Products",
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

const quickStartsProductsNav = {
  trigger: { label: "All Resources", icon: "resources" },
  categories: devHubCategories,
}

const docsProductsNav = {
  trigger: { label: "Docs", icon: "docs" },
  categories: devHubCategories,
}

const docsSubProductsNav = {
  label: "Docs",
  items: [
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
  ],
}
const devHubResourcesUrl = "https://dev.chain.link/resources"

const quickStartsSubProductsNav = {
  label: "QuickStarts",
  items: [
    {
      label: "All Resources",
      href: devHubResourcesUrl + "/",
    },
    {
      label: "Guides",
      href: devHubResourcesUrl + "/guides",
    },
    {
      label: "Courses",
      href: devHubResourcesUrl + "/courses",
    },
    {
      label: "Beginner Tutorials",
      href: devHubResourcesUrl + "/beginner-tutorials",
    },
    {
      label: "Tech Talks",
      href: devHubResourcesUrl + "/tech-talks",
    },
    {
      label: "Documentation",
      href: "https://docs.chain.link",
    },
    {
      label: "QuickStarts",
      href: devHubResourcesUrl + "/quickstarts",
    },
    {
      label: "Case Studies",
      href: devHubResourcesUrl + "/case-studies",
    },
    {
      label: "Blogs",
      href: devHubResourcesUrl + "/blogs",
    },
    {
      label: "Videos",
      href: devHubResourcesUrl + "/videos",
    },
    {
      label: "QuickStarts",
      href: "/quickstarts",
      hideFromDropdown: true,
    },
  ],
}

const quickStartsProps = { productsNav: quickStartsProductsNav, subProductsNav: quickStartsSubProductsNav }
const docsProps = { productsNav: docsProductsNav, subProductsNav: docsSubProductsNav }

export const getNavigationProps = (path: string) => {
  const isQuickStarts = path.startsWith("/quickstarts")

  return isQuickStarts ? quickStartsProps : docsProps
}
