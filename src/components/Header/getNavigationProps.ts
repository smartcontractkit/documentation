import ccipLogo from "../../assets/product-logos/ccip-logo.svg"
import vrfLogo from "../../assets/product-logos/vrf-logo.svg"
import functionsLogo from "../../assets/product-logos/functions-logo.svg"
import automationLogo from "../../assets/product-logos/automation-logo.svg"
import dataFeedsLogo from "../../assets/product-logos/data-feeds-logo.svg"
import dataStreamsLogo from "../../assets/product-logos/data-streams-logo.svg"
import nodesLogo from "../../assets/product-logos/general-logo.svg"

const docsSubProductsNav = [
  {
    label: "Data Feeds",
    href: "/data-feeds",
    icon: dataFeedsLogo.src,
  },
  {
    label: "Data Streams",
    href: "/data-streams",
    icon: dataStreamsLogo.src,
  },
  {
    label: "CCIP",
    href: "/ccip",
    icon: ccipLogo.src,
  },
  {
    label: "Functions",
    href: "/chainlink-functions",
    icon: functionsLogo.src,
  },
  {
    label: "Automation",
    href: "/chainlink-automation",
    icon: automationLogo.src,
  },
  {
    label: "VRF",
    href: "/vrf",
    icon: vrfLogo.src,
  },
  {
    label: "Chainlink Nodes",
    href: "/chainlink-nodes",
    icon: nodesLogo.src,
  },
  {
    label: "Documentation",
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
    label: "Documentation",
    items: [
      {
        label: "Data Feeds",
        href: "/data-feeds",
        icon: dataFeedsLogo.src,
      },
      {
        label: "Data Streams",
        href: "/data-streams",
        icon: dataStreamsLogo.src,
      },
      {
        label: "CCIP",
        href: "/ccip",
        icon: ccipLogo.src,
      },
      {
        label: "Functions",
        href: "/chainlink-functions",
        icon: functionsLogo.src,
      },
      {
        label: "Automation",
        href: "/chainlink-automation",
        icon: automationLogo.src,
      },
      {
        label: "VRF",
        href: "/vrf",
        icon: vrfLogo.src,
      },
      {
        label: "Chainlink Nodes",
        href: "/chainlink-nodes",
        icon: nodesLogo.src,
      },
    ],
  },
  {
    label: "Other Resources",
    items: [
      {
        label: "Developer Hub",
        href: "https://dev.chain.link",
        external: true,
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
