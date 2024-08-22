import ccipLogo from "../../assets/product-logos/ccip-logo.svg"
import vrfLogo from "../../assets/product-logos/vrf-logo.svg"
import functionsLogo from "../../assets/product-logos/functions-logo.svg"
import automationLogo from "../../assets/product-logos/automation-logo.svg"
import dataFeedsLogo from "../../assets/product-logos/data-feeds-logo.svg"
import dataStreamsLogo from "../../assets/product-logos/data-streams-logo.svg"
import generalLogo from "../../assets/product-logos/general-logo.svg"
import nodesLogo from "../../assets/product-logos/node-logo.svg"
import quickstartLogo from "../../assets/product-logos/quickstart-logo.svg"
import { SIDEBAR as sidebar } from "../../config/sidebar.ts"

interface Page {
  label: string
  href: string
  children?: Page[]
}

const mapContents = (contents: any[]): Page[] => {
  return contents.map((page) => {
    const label = page.title || "No Label"
    const href = page.url || "#"

    const pageWithChildren: Page = {
      label,
      href,
    }

    if (page.children && Array.isArray(page.children)) {
      pageWithChildren.children = mapContents(page.children)
    }

    return pageWithChildren
  })
}

const getSubProducts = (sectionData) => {
  const structuredData = sectionData.map((item) => ({
    label: item.section,
    items: mapContents(item.contents),
  }))
  return structuredData
}

const desktopSubProductsNav = [
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
  { label: "Chainlink Local", href: "/chainlink-local", icon: quickstartLogo.src },
  {
    label: "Quickstarts",
    href: "/quickstarts",
    icon: quickstartLogo.src,
  },
  {
    label: "Documentation",
    href: "/",
    hideFromDropdown: true,
  },
]

const docsSections = [
  {
    label: "Documentation",
    items: [
      {
        label: "Data Feeds",
        href: "/data-feeds",
        icon: dataFeedsLogo.src,
        subProducts: getSubProducts(sidebar.dataFeeds),
      },
      {
        label: "Data Streams",
        href: "/data-streams",
        icon: dataStreamsLogo.src,
        subProducts: getSubProducts(sidebar.dataStreams),
      },
      {
        label: "CCIP",
        href: "/ccip",
        icon: ccipLogo.src,
        subProducts: getSubProducts(sidebar.ccip),
      },
      {
        label: "Functions",
        href: "/chainlink-functions",
        icon: functionsLogo.src,
        subProducts: getSubProducts(sidebar.chainlinkFunctions),
      },
      {
        label: "Automation",
        href: "/chainlink-automation",
        icon: automationLogo.src,
        subProducts: getSubProducts(sidebar.automation),
      },
      {
        label: "VRF",
        href: "/vrf",
        icon: vrfLogo.src,
        subProducts: getSubProducts(sidebar.vrf),
      },
      {
        label: "Chainlink Nodes",
        href: "/chainlink-nodes",
        icon: nodesLogo.src,
        subProducts: getSubProducts(sidebar.nodeOperator),
      },
      {
        label: "Chainlink Local",
        href: "/chainlink-local",
        icon: quickstartLogo.src,
        subProducts: getSubProducts(sidebar.chainlinkLocal),
      },
      {
        label: "General",
        href: "/resources",
        icon: generalLogo.src,
        subProducts: getSubProducts(sidebar.global),
      },
      {
        label: "Quickstarts",
        href: "/quickstarts",
        icon: quickstartLogo.src,
      },
    ],
  },
]

/*
  {
    label: "Learning Resources",
    items: [
      {
        label: "Developer Hub",
        icon: nodesLogo.src,
        href: "https://dev.chain.link",
        external: true,
      },
  ]
  }
*/

const desktopProductsNav = {
  trigger: { label: "Docs", icon: "docs" },
  categories: docsSections,
}

const docsProps = { productsNav: desktopProductsNav, subProductsNav: desktopSubProductsNav }

export const getNavigationProps = (path: string) => {
  return docsProps
}
