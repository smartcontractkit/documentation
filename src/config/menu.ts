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
      text: "Functions",
      link: "/chainlink-functions",
      section: "chainlinkFunctions",
    },
    {
      text: "CCIP",
      link: "/ccip",
      section: "ccip",
    },
    {
      text: "Automation",
      link: "/chainlink-automation",
      section: "automation",
    },
    {
      text: "VRF",
      link: "/vrf",
      section: "vrf",
    },
    {
      text: "Data Streams",
      link: "/data-streams",
      section: "dataStreams",
    },
    {
      text: "Nodes",
      link: "/chainlink-nodes",
      section: "nodeOperator",
    },
  ],
}
