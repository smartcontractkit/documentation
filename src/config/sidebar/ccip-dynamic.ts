/**
 * CCIP Sidebar with Chain Type Metadata
 *
 * This sidebar configuration includes chainTypes annotations to enable
 * dynamic filtering based on selected blockchain (EVM, Solana, Aptos).
 *
 * Rules:
 * - No chainTypes = Universal content (shown for all chains)
 * - chainTypes: ['evm'] = EVM-specific content
 * - chainTypes: ['solana'] = Solana-specific content
 * - chainTypes: ['aptos'] = Aptos-specific content
 * - chainTypes: ['evm', 'solana'] = Shown for both EVM and Solana
 */

import type { SectionEntry } from "../sidebar.js"
import evmCcipV150Contents from "./ccip/api-reference/evm/v1_5_0.json" with { type: "json" }
import evmCcipV151Contents from "./ccip/api-reference/evm/v1_5_1.json" with { type: "json" }
import evmCcipV160Contents from "./ccip/api-reference/evm/v1_6_0.json" with { type: "json" }
import evmCcipV161Contents from "./ccip/api-reference/evm/v1_6_1.json" with { type: "json" }
import evmCcipV162Contents from "./ccip/api-reference/evm/v1_6_2.json" with { type: "json" }
import evmCcipV163Contents from "./ccip/api-reference/evm/v1_6_3.json" with { type: "json" }
import aptosCcipV160Contents from "./ccip/api-reference/aptos/v1_6_0.json" with { type: "json" }
import svmCcipV160Contents from "./ccip/api-reference/svm/v1_6_0.json" with { type: "json" }

/**
 * CCIP Sidebar Content with Chain Type Annotations
 * chainTypes properties are validated at compile-time via TypeScript
 */
export const CCIP_SIDEBAR_CONTENT: SectionEntry[] = [
  {
    section: "CCIP",
    contents: [
      {
        title: "Overview",
        url: "ccip",
        // Universal - no chainTypes
      },
      {
        title: "Getting Started",
        url: "ccip/getting-started/evm",
        chainTypes: ["evm"],
      },
      {
        title: "Getting Started",
        url: "ccip/getting-started/svm",
        chainTypes: ["solana"],
      },
      {
        title: "Getting Started",
        url: "ccip/getting-started/aptos",
        chainTypes: ["aptos"],
      },
      {
        title: "CCIP Directory",
        url: "ccip/directory",
        // Universal
        children: [
          {
            title: "Mainnet",
            url: "ccip/directory/mainnet",
          },
          {
            title: "Testnet",
            url: "ccip/directory/testnet",
          },
        ],
      },
      {
        title: "Service Limits",
        url: "ccip/service-limits/evm",
        chainTypes: ["evm"],
      },
      {
        title: "Service Limits",
        url: "ccip/service-limits/svm",
        chainTypes: ["solana"],
      },
      {
        title: "Service Limits",
        url: "ccip/service-limits/aptos",
        chainTypes: ["aptos"],
      },
      {
        title: "Service Responsibility",
        url: "ccip/service-responsibility",
      },
      {
        title: "Execution Latency",
        url: "ccip/ccip-execution-latency",
      },
      {
        title: "Billing",
        url: "ccip/billing",
      },
      {
        title: "Release Notes",
        url: "https://dev.chain.link/changelog?product=CCIP",
      },
    ],
  },
  {
    section: "Concepts",
    contents: [
      {
        title: "Overview",
        url: "ccip/concepts/architecture/overview",
        // Universal
      },
      {
        title: "Key Concepts",
        url: "ccip/concepts/architecture/key-concepts",
        // Universal
      },
      {
        title: "Onchain Architecture",
        url: "ccip/concepts/architecture/onchain/evm",
        chainTypes: ["evm"],
        children: [
          {
            title: "Overview",
            url: "ccip/concepts/architecture/onchain/evm/overview",
            chainTypes: ["evm"],
          },
          {
            title: "Components",
            url: "ccip/concepts/architecture/onchain/evm/components",
            chainTypes: ["evm"],
          },
          {
            title: "Upgradability",
            url: "ccip/concepts/architecture/onchain/evm/upgradability",
            chainTypes: ["evm"],
          },
        ],
      },
      {
        title: "Onchain Architecture",
        url: "ccip/concepts/architecture/onchain/svm",
        chainTypes: ["solana"],
        children: [
          {
            title: "Overview",
            url: "ccip/concepts/architecture/onchain/svm/overview",
            chainTypes: ["solana"],
          },
          {
            title: "Components",
            url: "ccip/concepts/architecture/onchain/svm/components",
            chainTypes: ["solana"],
          },
          {
            title: "Upgradability",
            url: "ccip/concepts/architecture/onchain/svm/upgradability",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Onchain Architecture",
        url: "ccip/concepts/architecture/onchain/aptos",
        chainTypes: ["aptos"],
        children: [
          {
            title: "Overview",
            url: "ccip/concepts/architecture/onchain/aptos/overview",
            chainTypes: ["aptos"],
          },
          {
            title: "Components",
            url: "ccip/concepts/architecture/onchain/aptos/components",
            chainTypes: ["aptos"],
          },
          {
            title: "Upgradability",
            url: "ccip/concepts/architecture/onchain/aptos/upgradability",
            chainTypes: ["aptos"],
          },
        ],
      },
      {
        title: "Offchain Architecture",
        url: "ccip/concepts/architecture/offchain/overview",
        // Universal
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/concepts/cross-chain-token",
        children: [
          {
            title: "Overview",
            url: "ccip/concepts/cross-chain-token/overview",
            // Universal
          },
          {
            title: "Tokens",
            url: "ccip/concepts/cross-chain-token/evm/tokens",
            chainTypes: ["evm"],
          },
          {
            title: "Token Pools",
            url: "ccip/concepts/cross-chain-token/evm/token-pools",
            chainTypes: ["evm"],
          },
          {
            title: "Architecture",
            url: "ccip/concepts/cross-chain-token/evm/architecture",
            chainTypes: ["evm"],
          },
          {
            title: "Registration and Administration",
            url: "ccip/concepts/cross-chain-token/evm/registration-administration",
            chainTypes: ["evm"],
          },
          {
            title: "Upgradability",
            url: "ccip/concepts/cross-chain-token/evm/upgradability",
            chainTypes: ["evm"],
          },
          {
            title: "Architecture",
            url: "ccip/concepts/cross-chain-token/svm/architecture",
            chainTypes: ["solana"],
          },
          {
            title: "Tokens",
            url: "ccip/concepts/cross-chain-token/svm/tokens",
            chainTypes: ["solana"],
          },
          {
            title: "Token Pools",
            url: "ccip/concepts/cross-chain-token/svm/token-pools",
            chainTypes: ["solana"],
          },
          {
            title: "Integration Guide",
            url: "ccip/concepts/cross-chain-token/svm/integration-guide",
            chainTypes: ["solana"],
          },
          {
            title: "Registration and Administration",
            url: "ccip/concepts/cross-chain-token/svm/registration-administration",
            chainTypes: ["solana"],
          },
          {
            title: "Upgradability",
            url: "ccip/concepts/cross-chain-token/svm/upgradability",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Manual execution",
        url: "ccip/concepts/manual-execution",
        // Universal
      },
      // NEW: Rate Limit Management folder + children (Universal)
      {
        title: "Rate Limit Management",
        children: [
          {
            title: "Overview",
            url: "ccip/concepts/rate-limit-management/overview",
            // Universal
          },
          {
            title: "How Rate Limits Work",
            url: "ccip/concepts/rate-limit-management/how-rate-limits-work",
            // Universal
          },
          {
            title: "Prerequisites and Permissions",
            url: "ccip/concepts/rate-limit-management/prerequisites-and-permissions",
            // Universal
          },
          {
            title: "Inspect Current Rate Limits",
            url: "ccip/concepts/rate-limit-management/inspect-current-rate-limits",
            // Universal
          },
          {
            title: "Token Units and Decimals",
            url: "ccip/concepts/rate-limit-management/token-units-and-decimals",
            // Universal
          },
          {
            title: "Update Rate Limits",
            url: "ccip/concepts/rate-limit-management/update-rate-limits",
            // Universal
          },
          {
            title: "Emergency Actions",
            url: "ccip/concepts/rate-limit-management/emergency-actions",
            // Universal
          },
          {
            title: "Common Scenarios",
            url: "ccip/concepts/rate-limit-management/common-scenarios",
            // Universal
          },
          {
            title: "Executing with a Multisig",
            url: "ccip/concepts/rate-limit-management/executing-with-a-multisig",
            // Universal
          },
        ],
      },
      {
        title: "Best Practices",
        url: "ccip/concepts/best-practices/evm",
        chainTypes: ["evm"],
      },
      {
        title: "Best Practices",
        url: "ccip/concepts/best-practices/svm",
        chainTypes: ["solana"],
      },
      {
        title: "Best Practices",
        url: "ccip/concepts/best-practices/aptos",
        chainTypes: ["aptos"],
      },
    ],
  },
  {
    section: "Tutorials",
    contents: [
      {
        title: "Acquire Test Tokens",
        url: "ccip/test-tokens",
        // Universal
      },
      {
        title: "Offchain",
        url: "ccip/tutorials/offchain",
        // Universal - supports all chain families
      },
      {
        title: "Transfer Tokens",
        url: "ccip/tutorials/evm/transfer-tokens-from-contract",
        chainTypes: ["evm"],
      },
      {
        title: "Transfer Tokens with Data",
        url: "ccip/tutorials/evm/programmable-token-transfers",
        chainTypes: ["evm"],
      },
      {
        title: "Transfer Tokens with Data - Defensive Example",
        url: "ccip/tutorials/evm/programmable-token-transfers-defensive",
        chainTypes: ["evm"],
      },
      {
        title: "Using the Token Manager",
        url: "ccip/tutorials/evm/token-manager",
        chainTypes: ["evm"],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/tutorials/evm/cross-chain-tokens",
        chainTypes: ["evm"],
        children: [
          {
            title: "Using Remix IDE",
            chainTypes: ["evm"],
            children: [
              {
                title: "Deploy and Register from an EOA",
                url: "ccip/tutorials/evm/cross-chain-tokens/register-from-eoa-remix",
                chainTypes: ["evm"],
              },
            ],
          },
          {
            title: "Using Hardhat / Foundry",
            chainTypes: ["evm"],
            children: [
              {
                title: "Register from an EOA (Burn & Mint)",
                url: "ccip/tutorials/evm/cross-chain-tokens/register-from-eoa-burn-mint-hardhat",
                highlightAsCurrent: ["ccip/tutorials/evm/cross-chain-tokens/register-from-eoa-burn-mint-foundry"],
                chainTypes: ["evm"],
              },
              {
                title: "Register from an EOA (Lock & Mint)",
                url: "ccip/tutorials/evm/cross-chain-tokens/register-from-eoa-lock-mint-hardhat",
                highlightAsCurrent: ["ccip/tutorials/evm/cross-chain-tokens/register-from-eoa-lock-mint-foundry"],
                chainTypes: ["evm"],
              },
              {
                title: "Set Token Pool rate limits",
                url: "ccip/tutorials/evm/cross-chain-tokens/update-rate-limiters-hardhat",
                highlightAsCurrent: ["ccip/tutorials/evm/cross-chain-tokens/update-rate-limiters-foundry"],
                chainTypes: ["evm"],
              },
              {
                title: "Register from a Safe Smart Account (Burn & Mint)",
                url: "ccip/tutorials/evm/cross-chain-tokens/register-from-safe-burn-mint-hardhat",
                chainTypes: ["evm"],
              },
              {
                title: "Configure Additional Networks",
                url: "ccip/tutorials/evm/cross-chain-tokens/configure-additional-networks-hardhat",
                highlightAsCurrent: ["ccip/tutorials/evm/cross-chain-tokens/configure-additional-networks-foundry"],
                chainTypes: ["evm"],
              },
            ],
          },
        ],
      },
      {
        title: "Test CCIP Locally",
        url: "ccip/tutorials/evm/test-ccip-locally",
        chainTypes: ["evm"],
      },
      {
        title: "Transfer USDC with Data",
        url: "ccip/tutorials/evm/usdc",
        chainTypes: ["evm"],
      },
      {
        title: "Send Arbitrary Data",
        url: "ccip/tutorials/evm/send-arbitrary-data",
        chainTypes: ["evm"],
      },
      {
        title: "Send Arbitrary Data and Receive Transfer Confirmation: A -> B -> A",
        url: "ccip/tutorials/evm/send-arbitrary-data-receipt-acknowledgment",
        chainTypes: ["evm"],
      },
      {
        title: "Manual Execution",
        url: "ccip/tutorials/evm/manual-execution",
        chainTypes: ["evm"],
      },
      {
        title: "Optimizing Gas Limit Settings in CCIP Messages",
        url: "ccip/tutorials/evm/ccipreceive-gaslimit",
        chainTypes: ["evm"],
      },
      {
        title: "Implement CCIP Receiver",
        url: "ccip/tutorials/svm/receivers",
        chainTypes: ["solana"],
      },
      {
        title: "Source",
        url: "ccip/tutorials/svm/source",
        chainTypes: ["solana"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/tutorials/svm/source/build-messages",
            chainTypes: ["solana"],
          },
          {
            title: "Prerequisites",
            url: "ccip/tutorials/svm/source/prerequisites",
            chainTypes: ["solana"],
          },
          {
            title: "Token Transfers",
            url: "ccip/tutorials/svm/source/token-transfers",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Destination",
        url: "ccip/tutorials/svm/destination",
        chainTypes: ["solana"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/tutorials/svm/destination/build-messages",
            chainTypes: ["solana"],
          },
          {
            title: "Token Transfers",
            url: "ccip/tutorials/svm/destination/token-transfers",
            chainTypes: ["solana"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/tutorials/svm/destination/arbitrary-messaging",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/tutorials/svm/cross-chain-tokens",
        chainTypes: ["solana"],
        children: [
          {
            title: "BurnMint: Direct Mint Authority Transfer",
            url: "ccip/tutorials/svm/cross-chain-tokens/direct-mint-authority",
            chainTypes: ["solana"],
          },
          {
            title: "BurnMint: SPL Token Multisig Tutorial",
            url: "ccip/tutorials/svm/cross-chain-tokens/spl-token-multisig-tutorial",
            chainTypes: ["solana"],
          },
          {
            title: "BurnMint: Production Multisig Governance",
            url: "ccip/tutorials/svm/cross-chain-tokens/production-multisig-tutorial",
            chainTypes: ["solana"],
          },
          {
            title: "LockRelease: Production Governance",
            url: "ccip/tutorials/svm/cross-chain-tokens/lock-release-multisig",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Implement CCIP Receiver",
        url: "ccip/tutorials/aptos/receivers",
        chainTypes: ["aptos"],
      },
      {
        title: "Source",
        url: "ccip/tutorials/aptos/source",
        chainTypes: ["aptos"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/tutorials/aptos/source/build-messages",
            chainTypes: ["aptos"],
          },
          {
            title: "Prerequisites",
            url: "ccip/tutorials/aptos/source/prerequisites",
            chainTypes: ["aptos"],
          },
          {
            title: "Token Transfers",
            url: "ccip/tutorials/aptos/source/token-transfers",
            chainTypes: ["aptos"],
          },
        ],
      },
      {
        title: "Destination",
        url: "ccip/tutorials/aptos/destination",
        chainTypes: ["aptos"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/tutorials/aptos/destination/build-messages",
            chainTypes: ["aptos"],
          },
          {
            title: "Prerequisites",
            url: "ccip/tutorials/aptos/destination/prerequisites",
            chainTypes: ["aptos"],
          },
          {
            title: "Token Transfers",
            url: "ccip/tutorials/aptos/destination/token-transfers",
            chainTypes: ["aptos"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/tutorials/aptos/destination/arbitrary-messaging",
            chainTypes: ["aptos"],
          },
          {
            title: "Programmable Token Transfers",
            url: "ccip/tutorials/aptos/destination/programmable-token-transfers",
            chainTypes: ["aptos"],
          },
        ],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/tutorials/aptos/cross-chain-tokens",
        chainTypes: ["aptos"],
      },
    ],
  },
  {
    section: "Tools and Resources",
    contents: [
      {
        title: "CCIP Explorer",
        url: "ccip/tools-resources/ccip-explorer",
        // Universal
      },
      {
        title: "Token Manager",
        url: "ccip/tools-resources/token-manager",
        chainTypes: ["evm"],
      },
      {
        title: "Network Specific",
        url: "ccip/tools-resources/network-specific",
        chainTypes: ["evm"],
        children: [
          {
            title: "Hyperliquid Integration Guide",
            url: "ccip/tools-resources/network-specific/hyperliquid-integration-guide",
            chainTypes: ["evm"],
          },
          {
            title: "HyperEVM Testnet RPC Guide",
            url: "ccip/tools-resources/network-specific/hyperevm-testnet-rpc",
            chainTypes: ["evm"],
          },
          {
            title: "HyperEVM Service Limits",
            url: "ccip/service-limits/evm/hyperevm",
            chainTypes: ["evm"],
          },
        ],
      },
      {
        title: "API Reference",
        url: "ccip/api-reference/evm",
        chainTypes: ["evm"],
        children: [
          // {
          //   title: "v1.6.3 (Latest)",
          //   url: "ccip/api-reference/evm/v1.6.3",
          //   isCollapsible: true,
          //   children: evmCcipV163Contents,
          // },
          // {
          //   title: "v1.6.2",
          //   url: "ccip/api-reference/evm/v1.6.2",
          //   isCollapsible: true,
          //   children: evmCcipV162Contents,
          // },
          {
            title: "v1.6.1 (Latest)",
            url: "ccip/api-reference/evm/v1.6.1",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV161Contents,
          },
          {
            title: "v1.6.0",
            url: "ccip/api-reference/evm/v1.6.0",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV160Contents,
          },
          {
            title: "v1.5.1",
            url: "ccip/api-reference/evm/v1.5.1",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV151Contents,
          },
          {
            title: "v1.5.0",
            url: "ccip/api-reference/evm/v1.5.0",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV150Contents,
          },
        ],
      },
      {
        title: "API Reference",
        url: "ccip/api-reference/svm",
        chainTypes: ["solana"],
        children: [
          {
            title: "v1.6.0",
            url: "ccip/api-reference/svm/v1.6.0",
            isCollapsible: true,
            chainTypes: ["solana"],
            children: svmCcipV160Contents,
          },
        ],
      },
      {
        title: "API Reference",
        url: "ccip/api-reference/aptos",
        chainTypes: ["aptos"],
        children: [
          {
            title: "v1.6.0",
            url: "ccip/api-reference/aptos/v1.6.0",
            isCollapsible: true,
            chainTypes: ["aptos"],
            children: aptosCcipV160Contents,
          },
        ],
      },
      {
        title: "CCIP SDK & CLI",
        url: "ccip/tools-resources/ccip-tools",
        // Universal
      },
      {
        title: "Cross-chain Examples",
        url: "ccip/examples",
        // Universal
      },
    ],
  },
]
