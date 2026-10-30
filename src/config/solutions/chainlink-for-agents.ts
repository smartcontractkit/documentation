import type { Solution } from "./types.ts"

export const chainlinkForAgents: Solution = {
  slug: "chainlink-for-agents",
  title: "Chainlink for Agents",
  description:
    "Give your AI agent access to Chainlink data and onchain workflows, within guardrails and spend limits that you set.",
  products: ["crec", "dataStreams"],
  categories: ["ai-agents", "defi", "crec"],
  repoUrl: "https://github.com/smartcontractkit/chainlink-for-agents",
  datePublished: "2026-10-30",
  nav: [
    { group: "Overview", pages: ["index"] },
    { group: "Guides", pages: ["guides/set-guardrails", "guides/check-price-and-swap"] },
  ],
}
