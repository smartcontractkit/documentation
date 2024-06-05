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
        subProducts: {
          label: "Data Feeds",
          href: "/data-feeds",
          items: sidebar.dataFeeds?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "Data Streams",
        href: "/data-streams",
        icon: dataStreamsLogo.src,
        subProducts: {
          label: "Data Streams",
          href: "/data-streams",
          items: sidebar.dataStreams?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "CCIP",
        href: "/ccip",
        icon: ccipLogo.src,
        subProducts: {
          label: "CCIP",
          href: "/ccip",
          items: sidebar.ccip?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "Functions",
        href: "/chainlink-functions",
        icon: functionsLogo.src,
        subProducts: {
          label: "Functions",
          href: "/chainlink-functions",
          items: sidebar.chainlinkFunctions?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "Automation",
        href: "/chainlink-automation",
        icon: automationLogo.src,
        subProducts: {
          label: "Automation",
          href: "/chainlink-automation",
          items: sidebar.automation?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "VRF",
        href: "/vrf",
        icon: vrfLogo.src,
        subProducts: {
          label: "VRF",
          href: "/vrf",
          items: sidebar.vrf?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "Chainlink Nodes",
        href: "/chainlink-nodes",
        icon: nodesLogo.src,
        subProducts: {
          label: "Chainlink Nodes",
          href: "/chainlink-nodes",
          items: sidebar.nodeOperator?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
      },
      {
        label: "General",
        href: "/resources",
        icon: generalLogo.src,
        subProducts: {
          label: "General",
          href: "/resources",
          items: sidebar.global?.map((item) => ({
            label: item.section,
            pages: item.contents.map((page) => ({
              label: page.title,
              href: page.url,
            })),
          })),
        },
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
