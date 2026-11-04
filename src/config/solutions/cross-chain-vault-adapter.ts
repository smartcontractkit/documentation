import type { Solution } from "./types.ts"

export const crossChainVaultAdapter: Solution = {
  slug: "cross-chain-vault-adapter",
  title: "Cross-Chain Vault Adapter",
  description:
    "Open your existing vault to users on other chains, so they can deposit and withdraw without bridging or switching networks.",
  products: ["ccip"],
  categories: ["cross-chain", "vaults"],
  repoUrl: "https://github.com/smartcontractkit/cross-chain-vault-adapters",
  nav: [
    { group: "Overview", pages: ["index", "overview/how-it-works", "overview/failures-and-recovery"] },
    {
      group: "Guides",
      pages: [
        "guides/deploy-the-vault",
        "guides/deploy-the-adapter",
        "guides/deposit-from-source-chain",
        "guides/redeem-from-source-chain",
      ],
    },
    {
      group: "Reference",
      pages: ["reference/limitations", "reference/adapter-contract", "reference/factory-contract"],
    },
  ],
}
