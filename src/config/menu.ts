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
      text: "Data Feeds",
      link: "/data-feeds",
      section: "dataFeeds",
    },
    {
      text: "VRF",
      link: "/vrf/v2/introduction",
      section: "vrf",
    },
    {
      text: "Automation",
      link: "/chainlink-automation/introduction",
      section: "automation",
    },
    {
      text: "CCIP",
      link: "/ccip",
      section: "ccip",
    },
    {
      text: "Functions",
      link: "/chainlink-functions",
      section: "chainlinkFunctions",
    },
    {
      text: "Nodes",
      link: "/chainlink-nodes",
      section: "nodeOperator",
    },
  ],
}
