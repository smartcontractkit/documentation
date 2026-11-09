import type { Solution } from "./types.ts"

export const predictionMarketResolutionEngine: Solution = {
  slug: "prediction-market-resolution-engine",
  title: "Prediction Market Resolution Engine",
  description:
    "A Chainlink-managed service that resolves prediction markets once independent data providers agree on the outcome, executed on a decentralized oracle network.",
  products: ["cre"],
  categories: ["prediction-markets"],
  nav: [
    {
      group: "Overview",
      pages: [
        "index",
        "overview/how-it-works",
        "overview/supported-markets",
        "overview/trust-and-failure-handling",
        "overview/outcome-delivery",
      ],
    },
    {
      group: "Tutorial",
      pages: ["tutorial/before-you-begin", "tutorial/list-markets", "tutorial/track-event-status"],
    },
    {
      group: "Reference",
      pages: ["reference/market-registry-api", "reference/lifecycle", "reference/glossary"],
    },
  ],
}
