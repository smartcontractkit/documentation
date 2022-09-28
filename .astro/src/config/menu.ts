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
    { text: "EVM Chains", link: "#", section: "ethereum" },
    { text: "Solana", link: "/solana/overview", section: "solana" },
    { text: "Node Operators", link: "#", section: "nodeOperator" },
  ],
}
