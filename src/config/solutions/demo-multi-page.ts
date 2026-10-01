import type { Solution } from "./types.ts"

export const demoMultiPage: Solution = {
  slug: "demo-multi-page",
  title: "Demo: Multi Page Solution",
  description:
    "Fixture proving the multi-page layout: grouped left navigation, and a solution appearing in two product sidebars.",
  products: ["ccip", "dataStreams"],
  categories: ["demo", "cross-chain"],
  datePublished: "2026-09-08",
  nav: [
    { group: "Overview", pages: ["index", "overview/how-it-works"] },
    { group: "Guides", pages: ["guides/first-guide", "guides/second-guide"] },
    { group: "Reference", pages: ["reference/parameters", "reference/limitations"] },
  ],
  repoUrl: "https://github.com/chainlink/demo-multi-page",
  hidden: true,
}
