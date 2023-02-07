type LanguageKey = string
type MenuItem = {
  text: string
  link: string
  section: string
}
type MenuItems = Record<LanguageKey, MenuItem[]>

export const MENU: MenuItems = {
  en: [
    {
      text: "Getting Started",
      link: "/getting-started/conceptual-overview",
      section: "gettingStarted",
    },
    {
      text: "Data Feeds",
      link: "/data-feeds/",
      section: "dataFeeds",
    },
    {
      text: "VRF",
      link: "/vrf/",
      section: "vrf",
    },
    {
      text: "Automation",
      link: "/chainlink-automation/introduction/",
      section: "automation",
    },
    {
      text: "Node Operators",
      link: "/chainlink-nodes",
      section: "nodeOperator",
    },
  ],
}
