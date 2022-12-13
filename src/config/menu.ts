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
    { text: "Services", link: "/ethereum", section: "ethereum" },
    {
      text: "Node Operators",
      link: "/chainlink-nodes",
      section: "nodeOperator",
    },
  ],
}
