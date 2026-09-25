/**
 * CCIP Sidebar with Chain Type Metadata
 *
 * This sidebar configuration includes chainTypes annotations for
 * dynamic filtering based on selected blockchain (EVM and Canton for v2).
 *
 * Rules:
 * - No chainTypes = Universal content (shown for all chains)
 * - chainTypes: ['evm'] = EVM-specific content
 * - chainTypes: ['canton'] = Canton-specific content
 */

import type { SectionContent, SectionEntry } from "../sidebar.js"
import evmCcipV200Contents from "./ccip/api-reference/evm/v2_0_0.json" with { type: "json" }

/**
 * CCIP Sidebar Content with Chain Type Annotations
 * chainTypes properties are validated at compile-time via TypeScript
 */
export const CCIP_SIDEBAR_CONTENT: SectionEntry[] = [
  // ─────────────────────────────────────────────────────────────
  // CCIP
  // ─────────────────────────────────────────────────────────────
  {
    section: "CCIP",
    contents: [
      {
        title: "Overview",
        url: "ccip/overview",
        pageId: "what-is-ccip",
        // Hidden for Canton to match production: Canton gets its own getting-started/concepts IA
        chainTypes: ["evm", "solana", "aptos"],
      },
      {
        title: "CCIP Directory",
        url: "ccip/directory",
        pageId: "directory",
        openInNewTab: true,
      },
      // ---------------------------------------------
      // Service Limits
      // ---------------------------------------------
      {
        title: "Service Limits",
        pageId: "ccip-service-limits",
        url: "ccip/evm/service-limits",
        chainTypes: ["evm"],
      },
      // Universal: shown for EVM V2 and Canton V2 (Solana/Aptos/TON are on ccip-v1.ts)
      {
        title: "Release Notes",
        url: "https://dev.chain.link/changelog?product=CCIP",
      },
      {
        title: "Get Started",
        type: "separator",
        chainTypes: ["evm"],
      },
      {
        title: "Get Test Tokens",
        url: "ccip/getting-started/test-tokens",
        pageId: "acquire-test-tokens",
        // Gated to match production (page content covers EVM and Solana faucets)
        chainTypes: ["evm", "solana", "aptos"],
      },
      {
        title: "Send a Cross-Chain Transfer",
        url: "ccip/evm/getting-started",
        chainTypes: ["evm"],
        pageId: "quickstart-evm",
      },
      {
        title: "Getting Started",
        url: "ccip/canton/getting-started",
        chainTypes: ["canton"],
      },
      // Canton-only entries surfaced under CCIP to match public Canton IA
      // (EVM/Solana/Aptos/TON see these under Concepts instead)
      {
        title: "Service Responsibility",
        url: "ccip/concepts/service-responsibility",
        pageId: "ccip-service-responsibility",
        chainTypes: ["canton"],
      },
      {
        title: "Fees & Billing",
        url: "ccip/concepts/fees-and-billing",
        pageId: "ccip-fees-billing",
        chainTypes: ["canton"],
      },
      {
        title: "Develop with CCIP",
        type: "separator",
        // Every entry under this separator is EVM-only
        chainTypes: ["evm"],
      },
      {
        title: "Tools Cheatsheet",
        url: "ccip/evm/getting-started/tools-cheatsheet",
        chainTypes: ["evm"],
        pageId: "tools-cheatsheet",
      },
      {
        title: "Build with AI",
        url: "ccip/getting-started/build-with-ai",
        chainTypes: ["evm"],
        pageId: "ccip-skills",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CONCEPTS
  // ─────────────────────────────────────────────────────────────
  {
    section: "Concepts",
    contents: [
      // ---------------------------------------------
      // Architecture
      // ---------------------------------------------
      {
        title: "Architecture",
        url: "ccip/concepts/architecture/overview",
        // Same page as v1 Concepts > Overview (ccip/v1/concepts/architecture/overview).
        // Not "ccip-architecture": v1 uses that id for the per-chain Onchain Architecture pages.
        pageId: "ccip-concepts-overview",
        // Hidden for Canton to match production: Canton has its own Overview/Key Concepts pages
        chainTypes: ["evm", "solana", "aptos", "ton"],
      },

      // ---------------------------------------------
      // Message Lifecycle
      // ---------------------------------------------
      {
        title: "Message Lifecycle",
        url: "ccip/concepts/message-lifecycle",
        pageId: "ccip-message-lifecycle",
        // Hidden for Canton: content is EVM-flavored (Router.ccipSend, ERC-20, extraArgs)
        chainTypes: ["evm", "solana", "aptos", "ton"],
      },

      // ---------------------------------------------
      // Onchain Architecture - Upgradability
      // ---------------------------------------------

      {
        title: "Contract Upgradeability (EVM)",
        url: "ccip/evm/concepts/upgradability",
        pageId: "ccip-upgradability",
        // Hidden for Canton to match production: Canton has its own Upgradability page
        chainTypes: ["evm"],
      },

      // ---------------------------------------------
      // Execution Latency
      // ---------------------------------------------
      {
        title: "Execution Latency",
        url: "ccip/concepts/execution-latency",
        pageId: "ccip-execution-latency",
        // Hidden for Canton to match production (gating the parent hides the whole subtree)
        chainTypes: ["evm", "solana", "aptos", "ton"],
        children: [
          {
            title: "Finality by Chain",
            url: "ccip/concepts/execution-latency/finality-by-chain",
            pageId: "ccip-finality-by-chain",
          },
          {
            title: "FTF - Overview",
            url: "ccip/concepts/execution-latency/ftf",
            pageId: "ccip-ftf-overview",
          },
          {
            title: "FTF - Token Issuers",
            url: "ccip/concepts/execution-latency/ftf-token-issuers",
            chainTypes: ["evm"],
            pageId: "ccip-ftf-token-issuers",
          },
          {
            title: "FTF - dApps",
            url: "ccip/concepts/execution-latency/ftf-dapps",
            chainTypes: ["evm"],
            pageId: "ccip-ftf-dapp-integrators",
          },
        ],
      },

      // ---------------------------------------------
      // Cross-Chain Token Standard
      // ---------------------------------------------
      {
        title: "Cross-Chain Token Standard",
        url: "ccip/concepts/cross-chain-token",
        pageId: "ccip-ccts",
        // Hidden for Canton to match production: Canton's coverage is its own Token Pools concept page
        chainTypes: ["evm", "solana", "aptos"],
        children: [
          {
            title: "CCT - Overview",
            url: "ccip/concepts/cross-chain-token/overview",
            pageId: "ccip-cct-overview",
          },
          {
            title: "Token Issuer Guide",
            url: "ccip/concepts/cross-chain-token/token-issuer-guide",
            pageId: "ccip-cct-token-issuer-guide",
          },
          {
            title: "Rate Limits",
            url: "ccip/evm/concepts/cross-chain-token/rate-limits",
            pageId: "ccip-cct-rate-limits",
            chainTypes: ["evm"],
            children: [
              {
                title: "Overview",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/overview",
                pageId: "ccip-cct-rate-limits-overview",
                chainTypes: ["evm"],
              },
              {
                title: "Prerequisites and Permissions",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/prerequisites-and-permissions",
                pageId: "ccip-cct-rate-limits-prerequisites-and-permissions",
                chainTypes: ["evm"],
              },
              {
                title: "Inspect Current Rate Limits",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/inspect-current-rate-limits",
                pageId: "ccip-cct-rate-limits-inspect-current-rate-limits",
                chainTypes: ["evm"],
              },
              {
                title: "Token Units and Decimals",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/token-units-and-decimals",
                pageId: "ccip-cct-rate-limits-token-units-and-decimals",
                chainTypes: ["evm"],
              },
              {
                title: "Update Rate Limits",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/update-rate-limits",
                pageId: "ccip-cct-rate-limits-update-rate-limits",
                chainTypes: ["evm"],
              },
              {
                title: "Emergency Actions",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/emergency-actions",
                pageId: "ccip-cct-rate-limits-emergency-actions",
                chainTypes: ["evm"],
              },
              {
                title: "Common Scenarios",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/common-scenarios",
                pageId: "ccip-cct-rate-limits-common-scenarios",
                chainTypes: ["evm"],
              },
              {
                title: "Executing with a Multisig",
                url: "ccip/evm/concepts/cross-chain-token/rate-limits/executing-with-a-multisig",
                pageId: "ccip-cct-rate-limits-executing-with-a-multisig",
                chainTypes: ["evm"],
              },
            ],
          },
          {
            title: "V1 - V2 Migration Guide",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Burn & Mint V1 -> V2",
            url: "ccip/evm/concepts/cross-chain-token/burn-mint-v1-to-v2",
            chainTypes: ["evm"],
            pageId: "ccip-cct-migration-burn-mint-v1-v2",
          },
          {
            title: "Lock & Mint V1 -> V2",
            url: "ccip/evm/concepts/cross-chain-token/lock-mint-v1-to-v2",
            chainTypes: ["evm"],
            pageId: "ccip-cct-migration-lock-mint-v1-v2",
          },
        ],
      },

      // ---------------------------------------------
      // Cross-Chain Verifiers (CCVs)
      // ---------------------------------------------
      {
        title: "Cross-Chain Verifiers",
        url: "ccip/concepts/ccvs",
        pageId: "ccip-ccvs",
        chainTypes: ["evm"],
        children: [
          {
            title: "Overview",
            url: "ccip/concepts/ccvs/overview",
            pageId: "ccip-ccvs-overview",
            chainTypes: ["evm"],
          },
          {
            title: "Verification Models",
            url: "ccip/concepts/ccvs/verification-models",
            pageId: "ccip-ccvs-verification-models",
            chainTypes: ["evm"],
          },
          {
            title: "CCV Interfaces & Guarantees",
            url: "ccip/concepts/ccvs/interface-guarantees",
            pageId: "ccip-ccvs-interface-guarantees",
            chainTypes: ["evm"],
          },
          {
            title: "Trust & Responsibility Model",
            url: "ccip/concepts/ccvs/trust-responsibility-model",
            pageId: "ccip-ccvs-trust-responsibility-model",
            chainTypes: ["evm"],
          },
        ],
      },

      // ---------------------------------------------
      // Fees & Billing
      // ---------------------------------------------
      {
        title: "Fees & Billing",
        url: "ccip/concepts/fees-and-billing",
        pageId: "ccip-fees-billing",
        // Hidden for Canton: Canton surfaces this under the CCIP section to match public IA
        chainTypes: ["evm", "solana", "aptos", "ton"],
      },
      // ---------------------------------------------
      // Service Responsibility
      // ---------------------------------------------
      {
        title: "Service Responsibility",
        pageId: "ccip-service-responsibility",
        url: "ccip/concepts/service-responsibility",
        // Hidden for Canton: Canton surfaces this under the CCIP section to match public IA
        chainTypes: ["evm", "solana", "aptos", "ton"],
      },

      // ---------------------------------------------
      // Manual Execution
      // ---------------------------------------------
      {
        title: "Manual Execution",
        pageId: "ccip-manual-execution",
        url: "ccip/concepts/manual-execution",
        // Hidden for Canton to match production: page is EVM-scoped; Canton has its own manual-execution concept
        chainTypes: ["evm", "solana", "aptos"],
      },

      // ---------------------------------------------
      // Best Practices (EVM)
      // ---------------------------------------------
      {
        title: "Best Practices",
        pageId: "ccip-best-practices-overview",
        url: "ccip/evm/concepts/best-practices",
        chainTypes: ["evm"],
      },

      // ---------------------------------------------
      // Canton — minimal, enterprise-focused IA (independent of other chain families)
      // ---------------------------------------------
      {
        title: "Key Concepts",
        url: "ccip/canton/concepts/key-concepts",
        chainTypes: ["canton"],
      },
      {
        title: "Overview",
        url: "ccip/canton/concepts/overview",
        chainTypes: ["canton"],
      },
      {
        title: "Manual execution",
        url: "ccip/canton/concepts/manual-execution",
        chainTypes: ["canton"],
      },
      {
        title: "Token Pools",
        url: "ccip/canton/concepts/token-pools",
        chainTypes: ["canton"],
      },
      {
        title: "Explicit Disclosure API",
        url: "ccip/canton/concepts/explicit-disclosure",
        chainTypes: ["canton"],
      },
      {
        title: "Upgradability",
        url: "ccip/canton/concepts/upgradability",
        chainTypes: ["canton"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TUTORIALS
  // ─────────────────────────────────────────────────────────────

  {
    section: "Tutorials",
    contents: [
      // ---------------------------------------------------------
      // EVM
      // ---------------------------------------------------------

      {
        title: "Application Developers",
        url: "ccip/evm/tutorials/application-developers",
        chainTypes: ["evm"],
        pageId: "tutorials-application-developers",
        children: [
          {
            title: "Transfer Tokens",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Transfer Tokens",
            url: "ccip/evm/tutorials/application-developers/transfer-tokens-from-contract",
            chainTypes: ["evm"],
            pageId: "transfer-tokens",
          },
          {
            title: "Transfer Messages",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Send a Message",
            url: "ccip/evm/tutorials/application-developers/send-arbitrary-data",
            chainTypes: ["evm"],
            pageId: "send-a-message",
          },
          {
            title: "A → B → A Confirmation Pattern",
            url: "ccip/evm/tutorials/application-developers/send-arbitrary-data-receipt-acknowledgment",
            chainTypes: ["evm"],
            pageId: "confirmation-pattern",
          },
          {
            title: "Transfer Tokens & Messages",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Programmable Token Transfers",
            url: "ccip/evm/tutorials/application-developers/programmable-token-transfers",
            chainTypes: ["evm"],
            pageId: "ptt-transfer-with-data",
          },
          {
            title: "Programmable Token Transfers - Defensive",
            url: "ccip/evm/tutorials/application-developers/programmable-token-transfers-defensive",
            chainTypes: ["evm"],
            pageId: "ptt-defensive-transfers",
          },
          {
            title: "Manual Execution",
            url: "ccip/evm/tutorials/application-developers/manual-execution",
            chainTypes: ["evm"],
            pageId: "manual-execution",
          },
          {
            title: "Transfer USDC with Data",
            url: "ccip/evm/tutorials/application-developers/usdc",
            chainTypes: ["evm"],
            pageId: "ptt-transfer-usdc",
          },
        ],
      },
      {
        title: "Asset Issuers",
        url: "ccip/evm/tutorials/cross-chain-tokens",
        chainTypes: ["evm"],
        pageId: "tutorials-asset-issuers",
        children: [
          {
            title: "Register Your CCT Tokens",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Register from an EOA (Burn & Mint)",
            url: "ccip/evm/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-foundry",
            highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-hardhat"],
            chainTypes: ["evm"],
            pageId: "register-eoa-burn-mint",
          },
          {
            title: "Register from an EOA (Lock & Mint)",
            url: "ccip/evm/tutorials/cross-chain-tokens/register-from-eoa-lock-mint-foundry",
            highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/register-from-eoa-lock-mint-hardhat"],
            chainTypes: ["evm"],
            pageId: "register-eoa-lock-mint",
          },
          // {
          //   title: "Register from a Safe Smart Account",
          //   url: "ccip/evm/tutorials/cross-chain-tokens/register-from-safe-burn-mint-hardhat",
          //   highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/register-from-safe-burn-mint-foundry"],
          //   chainTypes: ["evm"],
          //   pageId: "register-safe-smart-account",
          // },
          {
            title: "Configure Your CCT Tokens",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Set Token Pool Rate Limits",
            url: "ccip/evm/tutorials/cross-chain-tokens/update-rate-limiters-foundry",
            highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/update-rate-limiters-hardhat"],
            chainTypes: ["evm"],
            pageId: "set-token-pool-rate-limits",
          },
          {
            title: "Set Token Transfer Fee Config",
            url: "ccip/evm/tutorials/cross-chain-tokens/set-transfer-fee-config-foundry",
            highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/set-transfer-fee-config-hardhat"],
            chainTypes: ["evm"],
            pageId: "set-token-transfer-fee-config",
          },
          {
            title: "Set Advanced Pool Hooks",
            url: "ccip/evm/tutorials/cross-chain-tokens/set-advanced-pool-hooks-foundry",
            highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/set-advanced-pool-hooks-hardhat"],
            chainTypes: ["evm"],
            pageId: "set-advanced-pool-hooks",
          },
          {
            title: "Migration Guides",
            type: "separator",
            chainTypes: ["evm"],
          },
          {
            title: "Burn & Mint V1 -> V2",
            url: "ccip/evm/tutorials/cross-chain-tokens/migrate-from-v1-to-v2-burn-mint-foundry",
            highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/migrate-from-v1-to-v2-burn-mint-hardhat"],
            chainTypes: ["evm"],
            pageId: "migrate-v1-v2-burn-mint",
          },
          {
            title: "Lock & Mint V1 -> V2",
            url: "ccip/evm/tutorials/cross-chain-tokens/migrate-from-v1-to-v2-lock-mint-foundry",
            chainTypes: ["evm"],
            pageId: "migrate-v1-v2-lock-mint",
          },
          // {
          //   title: "Additional CCT tutorials",
          //   type: "separator",
          //   chainTypes: ["evm"],
          // },
          // {
          //   title: "Configure Additional Networks",
          //   url: "ccip/evm/tutorials/cross-chain-tokens/configure-additional-networks-hardhat",
          //   highlightAsCurrent: ["ccip/evm/tutorials/cross-chain-tokens/configure-additional-networks-foundry"],
          //   chainTypes: ["evm"],
          //   pageId: "configure-additional-networks",
          // },
          // {
          //   title: "Manage Tokens with Token Manager",
          //   url: "ccip/evm/tutorials/token-manager",
          //   highlightAsCurrent: ["ccip/evm/tutorials/token-manager"],
          //   chainTypes: ["evm"],
          //   pageId: "manage-tokens-token-manager",
          // },
        ],
      },

      // {
      //   title: "Advanced",
      //   chainTypes: ["evm"],
      //   pageId: "tutorials-advanced",
      //   children: [

      //     {
      //       title: "Optimizing Gas Limits",
      //       url: "ccip/evm/tutorials/ccipreceive-gaslimit",
      //       chainTypes: ["evm"],
      //       pageId: "optimizing-gas-limits",
      //     },
      //     {
      //       title: "Test CCIP Locally",
      //       url: "ccip/evm/tutorials/test-ccip-locally",
      //       chainTypes: ["evm"],
      //       pageId: "test-ccip-locally",
      //     },
      //     {
      //       title: "Example: Direct Staking",
      //       url: "ccip/evm/tutorials/direct-staking-with-ccip",
      //       chainTypes: ["evm"],
      //       pageId: "direct-staking-lido",
      //     },
      //   ],
      // },

      // ---------------------------------------------------------
      // NETWORK-SPECIFIC (EVM only)
      // ---------------------------------------------------------
      {
        title: "HyperEVM (Network-Specific)",
        chainTypes: ["evm"],
        pageId: "network-specific-hyperevm",
        children: [
          {
            title: "Hyperliquid Integration Guide",
            url: "ccip/evm/tools-resources/network-specific/hyperliquid-integration-guide",
            pageId: "hyperliquid-integration-guide",
          },
          {
            title: "HyperEVM Testnet RPC Guide",
            url: "ccip/evm/tools-resources/network-specific/hyperevm-testnet-rpc",
            pageId: "hyperevm-testnet-rpc-guide",
          },
          {
            title: "HyperEVM Service Limits",
            url: "ccip/evm/service-limits/hyperevm",
            pageId: "hyperevm-service-limits",
          },
        ],
      },

      // ---------------------------------------------------------
      // CANTON
      // ---------------------------------------------------------
      // Canton tutorials — minimal set for initial public release
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/canton/tutorials/cross-chain-tokens",
        chainTypes: ["canton"],
        children: [
          {
            title: "BurnMint Token Pool Deployment",
            url: "ccip/canton/tutorials/cross-chain-tokens/burn-mint-token-pool",
            chainTypes: ["canton"],
          },
          {
            title: "LockRelease Token Pool Deployment",
            url: "ccip/canton/tutorials/cross-chain-tokens/lock-release-token-pool",
            chainTypes: ["canton"],
          },
        ],
      },
      // Canton Source/Destination tutorials reactivated per public #4173 (LINK token finality note).
      {
        title: "Source",
        url: "ccip/canton/tutorials/source",
        chainTypes: ["canton"],
        children: [
          {
            title: "Prerequisites",
            url: "ccip/canton/tutorials/source/prerequisites",
            chainTypes: ["canton"],
          },
          {
            title: "Token Transfers",
            url: "ccip/canton/tutorials/source/token-transfers",
            chainTypes: ["canton"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/canton/tutorials/source/arbitrary-messaging",
            chainTypes: ["canton"],
          },
          {
            title: "Programmable Token Transfers",
            url: "ccip/canton/tutorials/source/programmable-token-transfers",
            chainTypes: ["canton"],
          },
        ],
      },
      {
        title: "Destination",
        url: "ccip/canton/tutorials/destination",
        chainTypes: ["canton"],
        children: [
          {
            title: "Prerequisites",
            url: "ccip/canton/tutorials/destination/prerequisites",
            chainTypes: ["canton"],
          },
          {
            title: "Token Transfers",
            url: "ccip/canton/tutorials/destination/token-transfers",
            chainTypes: ["canton"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/canton/tutorials/destination/arbitrary-messaging",
            chainTypes: ["canton"],
          },
          {
            title: "Programmable Token Transfers",
            url: "ccip/canton/tutorials/destination/programmable-token-transfers",
            chainTypes: ["canton"],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TOOLS & SDKS
  // ─────────────────────────────────────────────────────────────
  {
    section: "Tools and Resources",
    contents: [
      // ---------------------------------------------------------
      // CCIP LOCAL
      // ---------------------------------------------------------
      {
        title: "Chainlink Local",
        url: "ccip/evm/tutorials/test-ccip-locally",
        chainTypes: ["evm"],
        pageId: "test-ccip-locally",
      },
      // ---------------------------------------------------------
      // ONCHAIN INTERFACES / API REFERENCES
      // ---------------------------------------------------------
      {
        title: "Solidity Reference",
        chainTypes: ["evm"],
        pageId: "solidity-interfaces-contracts",
        children: [
          {
            title: "v2.0.0",
            url: "ccip/evm/api-reference/v2.0.0/overview",
            chainTypes: ["evm"],
            pageId: "evm-api-v2-0-0",
            children: evmCcipV200Contents as SectionContent[],
          },
        ],
      },
      // ---------------------------------------------------------
      // OFFCHAIN (UNIVERSAL)
      // ---------------------------------------------------------
      {
        title: "Explorer",
        url: "https://ccip.chain.link/",
        pageId: "ui-explorer",
      },
      {
        title: "Transporter",
        url: "https://www.transporter.io/",
        pageId: "ui-transporter",
        // Hidden for Canton: Transporter does not support the Canton Network
        chainTypes: ["evm"],
      },
      {
        title: "REST API",
        url: "https://docs.chain.link/ccip/tools/api",
        pageId: "rest-api",
      },

      {
        title: "TypeScript SDK",
        url: "https://docs.chain.link/ccip/tools/sdk",
        pageId: "typescript-sdk",
      },

      {
        title: "CLI",
        url: "https://docs.chain.link/ccip/tools/cli",
        pageId: "cli",
      },
    ],
  },
]
