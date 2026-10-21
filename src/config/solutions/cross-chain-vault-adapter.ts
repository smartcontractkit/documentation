import type { Solution } from "./types.ts"

export const crossChainVaultAdapter: Solution = {
  slug: "cross-chain-vault-adapter",
  title: "Cross-Chain Vault Adapter",
  description:
    "A CCIP adapter that lets users on other chains deposit into and redeem from your existing ERC-4626 vault, while vault accounting stays on the hub chain, the chain where the vault and the adapter are deployed.",
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
