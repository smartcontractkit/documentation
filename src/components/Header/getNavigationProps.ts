import creLogo from "../../assets/product-logos/cre-logo.svg"
import ccipLogo from "../../assets/product-logos/ccip-logo.svg"
import vrfLogo from "../../assets/product-logos/vrf-logo.svg"
import functionsLogo from "../../assets/product-logos/functions-logo.svg"
import automationLogo from "../../assets/product-logos/automation-logo.svg"
import dataFeedsLogo from "../../assets/product-logos/data-feeds-logo.svg"
import dataStreamsLogo from "../../assets/product-logos/data-streams-logo.svg"
import dtaLogo from "../../assets/product-logos/dta-logo.svg"
import dataLinkLogo from "../../assets/product-logos/datalink-logo.svg"
import chainlinkLocal from "../../assets/product-logos/chainlink-local.svg"
import generalLogo from "../../assets/product-logos/general-logo.svg"
import nodesLogo from "../../assets/product-logos/node-logo.svg"
import quickstartLogo from "../../assets/product-logos/quickstart-logo.svg"
import { SIDEBAR as sidebar } from "../../config/sidebar.ts"
import type { ChainType } from "../../config/types.js"
import { propagateChainTypes } from "../../utils/chainType.js"

interface Page {
  label: string
  href: string
  sdkLang?: string
  chainTypes?: ChainType[]
  type?: "separator"
  children?: Page[]
}

interface SidebarContent {
  title?: string
  url?: string
  highlightAsCurrent?: string[]
  chainTypes?: ChainType[]
  type?: "separator"
  children?: SidebarContent[]
}

const mapContents = (contents: SidebarContent[], pageSdkLangMap: Map<string, string>): Page[] => {
  return contents.map((page) => {
    const label = page.title || "No Label"
    const href = page.url || "#"
    const sdkLang = page.url ? pageSdkLangMap.get(page.url) : undefined

    const pageWithChildren: Page = {
      label,
      href,
      ...(sdkLang && { sdkLang }),
      ...(page.chainTypes && { chainTypes: page.chainTypes }),
      ...(page.highlightAsCurrent && { highlightAsCurrent: page.highlightAsCurrent }),
      ...(page.type && { type: page.type }),
    }

    if (page.children && Array.isArray(page.children)) {
      pageWithChildren.children = mapContents(page.children, pageSdkLangMap)
    }

    return pageWithChildren
  })
}

const getSubProducts = (sectionData, pageSdkLangMap: Map<string, string>) => {
  const structuredData = sectionData.map((item) => {
    // Propagate chainTypes from parent to children for consistent filtering
    const contentsWithPropagatedChainTypes = propagateChainTypes(item.contents)
    return {
      label: item.section,
      items: mapContents(contentsWithPropagatedChainTypes, pageSdkLangMap),
    }
  })
  return structuredData
}

const desktopSubProductsNav = [
  {
    label: "CRE",
    href: "/cre",
    icon: creLogo.src,
    col: 1,
  },
  {
    label: "Data Feeds",
    href: "/data-feeds",
    icon: dataFeedsLogo.src,
    col: 1,
  },
  {
    label: "Data Streams",
    href: "/data-streams",
    icon: dataStreamsLogo.src,
    col: 1,
  },
  {
    label: "DTA",
    href: "/dta-technical-standard",
    icon: dtaLogo.src,
    col: 1,
  },
  {
    label: "DataLink",
    href: "/datalink",
    icon: dataLinkLogo.src,
    col: 1,
  },
  {
    label: "CCIP",
    href: "/ccip",
    icon: ccipLogo.src,
    col: 1,
  },
  {
    label: "Functions",
    href: "/chainlink-functions",
    icon: functionsLogo.src,
    col: 1,
  },
  {
    label: "VRF",
    href: "/vrf",
    icon: vrfLogo.src,
    col: 1,
  },
  {
    label: "Automation",
    href: "/chainlink-automation",
    icon: automationLogo.src,
    col: 1,
  },
  {
    label: "Chainlink Local",
    href: "/chainlink-local",
    icon: chainlinkLocal.src,
    col: 2,
  },
  {
    label: "Nodes",
    href: "/chainlink-nodes",
    icon: nodesLogo.src,
    col: 2,
  },
  {
    label: "Quickstarts",
    href: "/quickstarts",
    icon: quickstartLogo.src,
    col: 2,
  },
  {
    label: "Documentation",
    href: "/",
    hideFromDropdown: true,
    col: 2,
  },
  {
    label: "General",
    href: "/getting-started",
    icon: generalLogo.src,
    col: 2,
  },
  {
    label: "General",
    href: "/resources",
    icon: generalLogo.src,
    col: 2,
    hideFromDropdown: true,
  },
]

const getDocsSections = (pageSdkLangMap: Map<string, string>) => [
  {
    label: "Documentation",
    items: [
      {
        label: "CRE",
        href: "/cre",
        icon: creLogo.src,
        subProducts: getSubProducts(sidebar.cre, pageSdkLangMap),
      },
      {
        label: "Data Feeds",
        href: "/data-feeds",
        icon: dataFeedsLogo.src,
        subProducts: getSubProducts(sidebar.dataFeeds, new Map()),
      },
      {
        label: "Data Streams",
        href: "/data-streams",
        icon: dataStreamsLogo.src,
        subProducts: getSubProducts(sidebar.dataStreams, new Map()),
      },
      {
        label: "DataLink",
        href: "/datalink",
        icon: dataLinkLogo.src,
        subProducts: getSubProducts(sidebar.dataLink, new Map()),
      },
      {
        label: "CCIP",
        href: "/ccip",
        icon: ccipLogo.src,
        subProducts: getSubProducts(sidebar.ccip, new Map()),
      },
      {
        label: "Functions",
        href: "/chainlink-functions",
        icon: functionsLogo.src,
        subProducts: getSubProducts(sidebar.chainlinkFunctions, new Map()),
      },
      {
        label: "VRF",
        href: "/vrf",
        icon: vrfLogo.src,
        subProducts: getSubProducts(sidebar.vrf, new Map()),
      },
      {
        label: "Automation",
        href: "/chainlink-automation",
        icon: automationLogo.src,
        subProducts: getSubProducts(sidebar.automation, new Map()),
        divider: true,
      },
      {
        label: "Chainlink Local",
        href: "/chainlink-local",
        icon: chainlinkLocal.src,
        subProducts: getSubProducts(sidebar.chainlinkLocal, new Map()),
      },
      {
        label: "Nodes",
        href: "/chainlink-nodes",
        icon: nodesLogo.src,
        subProducts: getSubProducts(sidebar.nodeOperator, new Map()),
      },
      {
        label: "Quickstarts",
        href: "/quickstarts",
        icon: quickstartLogo.src,
      },
      {
        label: "General",
        href: "/resources",
        icon: generalLogo.src,
        subProducts: getSubProducts(sidebar.global, new Map()),
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
        href: "https://dev.chain.Link",
        external: true,
      },
  ]
  }
*/

export const getNavigationProps = (pageSdkLangMap: Map<string, string> = new Map()) => {
  const docsSections = getDocsSections(pageSdkLangMap)

  const desktopProductsNav = {
    trigger: { label: "Docs", icon: "docs" },
    categories: docsSections,
  }

  const docsProps = { productsNav: desktopProductsNav, subProductsNav: desktopSubProductsNav }

  return docsProps
}
