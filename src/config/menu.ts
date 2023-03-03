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
    { text: "EVM Chains", link: "/ethereum", section: "ethereum" },
    { text: "Solana", link: "/solana", section: "solana" },
    {
      text: "Functions",
      link: "/chainlink-functions",
      section: "chainlinkFunctions",
    },
    {
      text: "Node Operators",
      link: "/chainlink-nodes",
      section: "nodeOperator",
    },
  ],
}
