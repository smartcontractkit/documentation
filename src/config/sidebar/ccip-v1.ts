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
export const CCIP_V16_SIDEBAR_CONTENT: SectionEntry[] = [
  {
    section: "CCIP",
    contents: [
      {
        title: "Overview",
        url: "ccip",
        chainTypes: ["evm", "solana", "aptos"],
      },
      {
        title: "Getting Started",
        url: "ccip/v1/evm/getting-started",
        pageId: "quickstart-evm",
        chainTypes: ["evm"],
      },
      {
        title: "Getting Started",
        url: "ccip/v1/svm/getting-started",
        pageId: "getting-started",
        chainTypes: ["solana"],
      },
      {
        title: "Getting Started",
        url: "ccip/v1/aptos/getting-started",
        pageId: "getting-started",
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
        url: "ccip/v1/evm/service-limits",
        pageId: "ccip-service-limits-overview",
        chainTypes: ["evm"],
      },
      {
        title: "Service Limits",
        url: "ccip/v1/svm/service-limits",
        pageId: "ccip-service-limits-overview",
        chainTypes: ["solana"],
      },
      {
        title: "Service Limits",
        url: "ccip/v1/aptos/service-limits",
        pageId: "ccip-service-limits-overview",
        chainTypes: ["aptos"],
      },
      {
        title: "Service Limits",
        url: "ccip/v1/ton/service-limits",
        chainTypes: ["ton"],
      },
      {
        title: "Service Responsibility",
        url: "ccip/v1/service-responsibility",
        pageId: "ccip-service-responsibility-overview",
      },
      {
        title: "Execution Latency",
        url: "ccip/v1/ccip-execution-latency",
        pageId: "ccip-execution-latency-overview",
        chainTypes: ["evm", "solana", "aptos", "ton"],
      },
      {
        title: "Billing",
        url: "ccip/v1/billing",
        pageId: "ccip-fees-billing-overview",
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
        url: "ccip/v1/concepts/architecture/overview",
        pageId: "ccip-concepts-overview",
        chainTypes: ["evm", "solana", "aptos"],
      },
      {
        title: "Overview",
        url: "ccip/v1/ton/concepts/architecture/overview",
        pageId: "ccip-concepts-overview",
        chainTypes: ["ton"],
      },
      {
        title: "Key Concepts",
        url: "ccip/v1/concepts/architecture/key-concepts",
        pageId: "ccip-architecture-overview",
        chainTypes: ["evm", "solana", "aptos"],
      },
      {
        title: "Key Concepts",
        url: "ccip/v1/ton/concepts/architecture/key-concepts",
        pageId: "ccip-architecture-overview",
        chainTypes: ["ton"],
      },
      {
        title: "Onchain Architecture",
        url: "ccip/v1/evm/concepts/architecture/onchain",
        pageId: "ccip-architecture-overview",
        chainTypes: ["evm"],
        children: [
          {
            title: "Overview",
            url: "ccip/v1/evm/concepts/architecture/onchain/overview",
            pageId: "ccip-architecture-overview",
            chainTypes: ["evm"],
          },
          {
            title: "Components",
            url: "ccip/v1/evm/concepts/architecture/onchain/components",
            pageId: "ccip-architecture-overview",
            chainTypes: ["evm"],
          },
          {
            title: "Upgradability",
            url: "ccip/v1/evm/concepts/architecture/onchain/upgradability",
            pageId: "ccip-architecture-overview",
            chainTypes: ["evm"],
          },
        ],
      },
      {
        title: "Onchain Architecture",
        url: "ccip/v1/svm/concepts/architecture/onchain",
        pageId: "ccip-architecture",
        chainTypes: ["solana"],
        children: [
          {
            title: "Overview",
            url: "ccip/v1/svm/concepts/architecture/onchain/overview",
            pageId: "ccip-architecture-overview",
            chainTypes: ["solana"],
          },
          {
            title: "Components",
            url: "ccip/v1/svm/concepts/architecture/onchain/components",
            pageId: "ccip-architecture-overview",
            chainTypes: ["solana"],
          },
          {
            title: "Upgradability",
            url: "ccip/v1/svm/concepts/architecture/onchain/upgradability",
            pageId: "ccip-architecture-overview",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Onchain Architecture",
        url: "ccip/v1/aptos/concepts/architecture/onchain",
        pageId: "ccip-architecture",
        chainTypes: ["aptos"],
        children: [
          {
            title: "Overview",
            url: "ccip/v1/aptos/concepts/architecture/onchain/overview",
            pageId: "ccip-architecture-overview",
            chainTypes: ["aptos"],
          },
          {
            title: "Components",
            url: "ccip/v1/aptos/concepts/architecture/onchain/components",
            pageId: "ccip-architecture-overview",
            chainTypes: ["aptos"],
          },
          {
            title: "Upgradability",
            url: "ccip/v1/aptos/concepts/architecture/onchain/upgradability",
            pageId: "ccip-architecture-overview",
            chainTypes: ["aptos"],
          },
        ],
      },
      {
        title: "Onchain Architecture",
        url: "ccip/v1/ton/concepts/architecture/onchain",
        pageId: "ccip-architecture",
        chainTypes: ["ton"],
        children: [
          {
            title: "Overview",
            url: "ccip/v1/ton/concepts/architecture/onchain/overview",
            pageId: "ccip-architecture-overview",
            chainTypes: ["ton"],
          },
          {
            title: "Components",
            url: "ccip/v1/ton/concepts/architecture/onchain/components",
            pageId: "ccip-architecture-overview",
            chainTypes: ["ton"],
          },
          {
            title: "Upgradability",
            url: "ccip/v1/ton/concepts/architecture/onchain/upgradability",
            pageId: "ccip-architecture-overview",
            chainTypes: ["ton"],
          },
        ],
      },
      {
        title: "Offchain Architecture",
        url: "ccip/v1/concepts/architecture/offchain/overview",
        pageId: "ccip-architecture-overview",
        chainTypes: ["evm", "solana", "aptos", "ton"],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/v1/concepts/cross-chain-token",
        pageId: "ccip-ccts",
        chainTypes: ["evm", "solana", "aptos"],
        children: [
          {
            title: "Overview",
            url: "ccip/v1/concepts/cross-chain-token/overview",
            pageId: "ccip-cct-overview",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Tokens",
            url: "ccip/v1/evm/concepts/cross-chain-token/tokens",
            pageId: "ccip-cct-overview",
            chainTypes: ["evm"],
          },
          {
            title: "Token Pools",
            url: "ccip/v1/evm/concepts/cross-chain-token/token-pools",
            pageId: "ccip-cct-overview",
            chainTypes: ["evm"],
          },
          {
            title: "Architecture",
            url: "ccip/v1/evm/concepts/cross-chain-token/architecture",
            pageId: "ccip-cct-evm-architecture",
            chainTypes: ["evm"],
          },
          {
            title: "Registration and Administration",
            url: "ccip/v1/evm/concepts/cross-chain-token/registration-administration",
            pageId: "ccip-cct-token-issuer-guide",
            chainTypes: ["evm"],
          },
          {
            title: "Upgradability",
            url: "ccip/v1/evm/concepts/cross-chain-token/upgradability",
            pageId: "ccip-cct-evm-technical-reference",
            chainTypes: ["evm"],
          },
          {
            title: "Architecture",
            url: "ccip/v1/svm/concepts/cross-chain-token/architecture",
            pageId: "ccip-cct-overview",
            chainTypes: ["solana"],
          },
          {
            title: "Tokens",
            url: "ccip/v1/svm/concepts/cross-chain-token/tokens",
            pageId: "ccip-cct-overview",
            chainTypes: ["solana"],
          },
          {
            title: "Token Pools",
            url: "ccip/v1/svm/concepts/cross-chain-token/token-pools",
            pageId: "ccip-cct-overview",
            chainTypes: ["solana"],
          },
          {
            title: "Token Mint Authority",
            url: "ccip/v1/svm/concepts/cross-chain-token/token-mint-authority",
            pageId: "ccip-cct-token-mint-authority",
            chainTypes: ["solana"],
          },
          {
            title: "Integration Guide",
            url: "ccip/v1/svm/concepts/cross-chain-token/integration-guide",
            pageId: "ccip-cct-token-issuer-guide",
            chainTypes: ["solana"],
          },
          {
            title: "Registration and Administration",
            url: "ccip/v1/svm/concepts/cross-chain-token/registration-administration",
            pageId: "ccip-cct-token-issuer-guide",
            chainTypes: ["solana"],
          },
          {
            title: "Upgradability",
            url: "ccip/v1/svm/concepts/cross-chain-token/upgradability",
            pageId: "ccip-cct-overview",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Manual execution",
        url: "ccip/v1/concepts/manual-execution",
        pageId: "concepts-manual-execution",
        chainTypes: ["evm", "solana", "aptos"],
      },
      {
        title: "Manual execution",
        url: "ccip/v1/ton/concepts/manual-execution",
        pageId: "concepts-manual-execution",
        chainTypes: ["ton"],
      },
      // Rate Limit Management folder + children. Gated to EVM/Solana/Aptos to match
      // production: TON and Canton have no rate-limit docs of their own.
      {
        title: "Rate Limit Management",
        chainTypes: ["evm", "solana", "aptos"],
        children: [
          {
            title: "Overview",
            url: "ccip/v1/concepts/rate-limit-management/overview",
            pageId: "ccip-rlm-overview",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "How Rate Limits Work",
            url: "ccip/v1/concepts/rate-limit-management/how-rate-limits-work",
            pageId: "ccip-rlm-how-it-works",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Prerequisites and Permissions",
            url: "ccip/v1/concepts/rate-limit-management/prerequisites-and-permissions",
            pageId: "ccip-rlm-prerequisites",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Inspect Current Rate Limits",
            url: "ccip/v1/concepts/rate-limit-management/inspect-current-rate-limits",
            pageId: "ccip-rlm-inspect",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Token Units and Decimals",
            url: "ccip/v1/concepts/rate-limit-management/token-units-and-decimals",
            pageId: "ccip-rlm-token-units",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Update Rate Limits",
            url: "ccip/v1/concepts/rate-limit-management/update-rate-limits",
            pageId: "ccip-rlm-update",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Emergency Actions",
            url: "ccip/v1/concepts/rate-limit-management/emergency-actions",
            pageId: "ccip-rlm-emergency",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Common Scenarios",
            url: "ccip/v1/concepts/rate-limit-management/common-scenarios",
            pageId: "ccip-rlm-scenarios",
            chainTypes: ["evm", "solana", "aptos"],
          },
          {
            title: "Executing with a Multisig",
            url: "ccip/v1/concepts/rate-limit-management/executing-with-a-multisig",
            pageId: "ccip-rlm-multisig",
            chainTypes: ["evm", "solana", "aptos"],
          },
        ],
      },
      {
        title: "Best Practices",
        url: "ccip/v1/evm/concepts/best-practices",
        pageId: "ccip-best-practices-overview",
        chainTypes: ["evm"],
      },
      {
        title: "Best Practices",
        url: "ccip/v1/svm/concepts/best-practices",
        pageId: "ccip-best-practices-overview",
        chainTypes: ["solana"],
      },
      {
        title: "Best Practices",
        url: "ccip/v1/aptos/concepts/best-practices",
        pageId: "ccip-best-practices-overview",
        chainTypes: ["aptos"],
      },
      {
        title: "Best Practices",
        url: "ccip/v1/ton/concepts/best-practices",
        pageId: "ccip-best-practices-overview",
        chainTypes: ["ton"],
      },
    ],
  },
  {
    section: "Tutorials",
    contents: [
      {
        title: "Overview",
        url: "ccip/v1/evm/tutorials",
        chainTypes: ["evm"],
      },
      {
        title: "Overview",
        url: "ccip/v1/svm/tutorials",
        chainTypes: ["solana"],
      },
      {
        title: "Overview",
        url: "ccip/v1/aptos/tutorials",
        chainTypes: ["aptos"],
      },
      {
        title: "Overview",
        url: "ccip/v1/ton/tutorials",
        chainTypes: ["ton"],
      },
      {
        title: "Acquire Test Tokens",
        url: "ccip/v1/test-tokens",
        pageId: "acquire-test-tokens",
        // Universal
      },
      {
        title: "Transfer Tokens",
        url: "ccip/v1/evm/tutorials/transfer-tokens-from-contract",
        pageId: "transfer-tokens",
        chainTypes: ["evm"],
      },
      {
        title: "Transfer Tokens with Data",
        url: "ccip/v1/evm/tutorials/programmable-token-transfers",
        pageId: "ptt-transfer-with-data",
        chainTypes: ["evm"],
      },
      {
        title: "Transfer Tokens with Data - Defensive Example",
        url: "ccip/v1/evm/tutorials/programmable-token-transfers-defensive",
        pageId: "ptt-defensive-transfers",
        chainTypes: ["evm"],
      },
      {
        title: "Using the Token Manager",
        url: "ccip/v1/evm/tutorials/token-manager",
        pageId: "manage-tokens-token-manager",
        chainTypes: ["evm"],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/v1/evm/tutorials/cross-chain-tokens",
        pageId: "create-cct",
        chainTypes: ["evm"],
        children: [
          {
            title: "Using Remix IDE",
            chainTypes: ["evm"],
            children: [
              {
                title: "Deploy and Register from an EOA",
                url: "ccip/v1/evm/tutorials/cross-chain-tokens/register-from-eoa-remix",
                pageId: "deploy-register-eoa-remix",
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
                url: "ccip/v1/evm/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-hardhat",
                pageId: "register-eoa-burn-mint",
                highlightAsCurrent: ["ccip/v1/evm/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-foundry"],
                chainTypes: ["evm"],
              },
              {
                title: "Register from an EOA (Lock & Mint)",
                url: "ccip/v1/evm/tutorials/cross-chain-tokens/register-from-eoa-lock-mint-hardhat",
                pageId: "register-eoa-lock-mint",
                highlightAsCurrent: ["ccip/v1/evm/tutorials/cross-chain-tokens/register-from-eoa-lock-mint-foundry"],
                chainTypes: ["evm"],
              },
              {
                title: "Set Token Pool rate limits",
                url: "ccip/v1/evm/tutorials/cross-chain-tokens/update-rate-limiters-hardhat",
                pageId: "set-token-pool-rate-limits",
                highlightAsCurrent: ["ccip/v1/evm/tutorials/cross-chain-tokens/update-rate-limiters-foundry"],
                chainTypes: ["evm"],
              },
              {
                title: "Register from a Safe Smart Account (Burn & Mint)",
                url: "ccip/v1/evm/tutorials/cross-chain-tokens/register-from-safe-burn-mint-hardhat",
                pageId: "register-safe-smart-account",
                chainTypes: ["evm"],
              },
              {
                title: "Configure Additional Networks",
                url: "ccip/v1/evm/tutorials/cross-chain-tokens/configure-additional-networks-hardhat",
                pageId: "configure-additional-networks",
                highlightAsCurrent: ["ccip/v1/evm/tutorials/cross-chain-tokens/configure-additional-networks-foundry"],
                chainTypes: ["evm"],
              },
            ],
          },
        ],
      },
      {
        title: "Test CCIP Locally",
        url: "ccip/v1/evm/tutorials/test-ccip-locally",
        pageId: "test-ccip-locally",
        chainTypes: ["evm"],
      },
      {
        title: "Transfer USDC with Data",
        url: "ccip/v1/evm/tutorials/usdc",
        pageId: "ptt-transfer-usdc",
        chainTypes: ["evm"],
      },
      {
        title: "Send Arbitrary Data",
        url: "ccip/v1/evm/tutorials/send-arbitrary-data",
        pageId: "send-a-message",
        chainTypes: ["evm"],
      },
      {
        title: "Send Arbitrary Data and Receive Transfer Confirmation: A -> B -> A",
        url: "ccip/v1/evm/tutorials/send-arbitrary-data-receipt-acknowledgment",
        pageId: "confirmation-pattern",
        chainTypes: ["evm"],
      },
      {
        title: "Manual Execution",
        url: "ccip/v1/evm/tutorials/manual-execution",
        pageId: "manual-execution",
        chainTypes: ["evm"],
      },
      {
        title: "Optimizing Gas Limit Settings in CCIP Messages",
        url: "ccip/v1/evm/tutorials/ccipreceive-gaslimit",
        pageId: "optimizing-gas-limits",
        chainTypes: ["evm"],
      },
      {
        title: "Implement CCIP Receiver",
        url: "ccip/v1/svm/tutorials/receivers",
        pageId: "tutorials-receivers",
        chainTypes: ["solana"],
      },
      {
        title: "Source",
        url: "ccip/v1/svm/tutorials/source",
        pageId: "tutorials-source",
        chainTypes: ["solana"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/v1/svm/tutorials/source/build-messages",
            pageId: "tutorials-source-build-messages",
            chainTypes: ["solana"],
          },
          {
            title: "Prerequisites",
            url: "ccip/v1/svm/tutorials/source/prerequisites",
            pageId: "tutorials-source-prerequisites",
            chainTypes: ["solana"],
          },
          {
            title: "Token Transfers",
            url: "ccip/v1/svm/tutorials/source/token-transfers",
            pageId: "tutorials-source-token-transfers",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Destination",
        url: "ccip/v1/svm/tutorials/destination",
        pageId: "tutorials-destination",
        chainTypes: ["solana"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/v1/svm/tutorials/destination/build-messages",
            pageId: "tutorials-destination-build-messages",
            chainTypes: ["solana"],
          },
          {
            title: "Token Transfers",
            url: "ccip/v1/svm/tutorials/destination/token-transfers",
            pageId: "tutorials-destination-token-transfers",
            chainTypes: ["solana"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/v1/svm/tutorials/destination/arbitrary-messaging",
            pageId: "tutorials-destination-arbitrary-messaging",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/v1/svm/tutorials/cross-chain-tokens",
        pageId: "create-cct",
        chainTypes: ["solana"],
        children: [
          {
            title: "BurnMint: Direct Mint Authority Transfer",
            url: "ccip/v1/svm/tutorials/cross-chain-tokens/direct-mint-authority",
            pageId: "tutorials-cct-direct-mint-authority",
            chainTypes: ["solana"],
          },
          {
            title: "BurnMint: SPL Token Multisig Tutorial",
            url: "ccip/v1/svm/tutorials/cross-chain-tokens/spl-token-multisig-tutorial",
            pageId: "tutorials-cct-spl-token-multisig",
            chainTypes: ["solana"],
          },
          {
            title: "BurnMint: Production Multisig Governance",
            url: "ccip/v1/svm/tutorials/cross-chain-tokens/production-multisig-tutorial",
            pageId: "tutorials-cct-production-multisig",
            chainTypes: ["solana"],
          },
          {
            title: "LockRelease: Production Governance",
            url: "ccip/v1/svm/tutorials/cross-chain-tokens/lock-release-multisig",
            pageId: "tutorials-cct-lock-release-multisig",
            chainTypes: ["solana"],
          },
        ],
      },
      {
        title: "Implement CCIP Receiver",
        url: "ccip/v1/aptos/tutorials/receivers",
        pageId: "tutorials-receivers",
        chainTypes: ["aptos"],
      },
      {
        title: "Source",
        url: "ccip/v1/aptos/tutorials/source",
        pageId: "tutorials-source",
        chainTypes: ["aptos"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/v1/aptos/tutorials/source/build-messages",
            pageId: "tutorials-source-build-messages",
            chainTypes: ["aptos"],
          },
          {
            title: "Prerequisites",
            url: "ccip/v1/aptos/tutorials/source/prerequisites",
            pageId: "tutorials-source-prerequisites",
            chainTypes: ["aptos"],
          },
          {
            title: "Token Transfers",
            url: "ccip/v1/aptos/tutorials/source/token-transfers",
            pageId: "tutorials-source-token-transfers",
            chainTypes: ["aptos"],
          },
        ],
      },
      {
        title: "Destination",
        url: "ccip/v1/aptos/tutorials/destination",
        pageId: "tutorials-destination",
        chainTypes: ["aptos"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/v1/aptos/tutorials/destination/build-messages",
            pageId: "tutorials-destination-build-messages",
            chainTypes: ["aptos"],
          },
          {
            title: "Prerequisites",
            url: "ccip/v1/aptos/tutorials/destination/prerequisites",
            pageId: "tutorials-destination-prerequisites",
            chainTypes: ["aptos"],
          },
          {
            title: "Token Transfers",
            url: "ccip/v1/aptos/tutorials/destination/token-transfers",
            pageId: "tutorials-destination-token-transfers",
            chainTypes: ["aptos"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/v1/aptos/tutorials/destination/arbitrary-messaging",
            pageId: "tutorials-destination-arbitrary-messaging",
            chainTypes: ["aptos"],
          },
          {
            title: "Programmable Token Transfers",
            url: "ccip/v1/aptos/tutorials/destination/programmable-token-transfers",
            pageId: "tutorials-destination-programmable-token-transfers",
            chainTypes: ["aptos"],
          },
        ],
      },
      {
        title: "Cross-Chain Token (CCT)",
        url: "ccip/v1/aptos/tutorials/cross-chain-tokens",
        pageId: "create-cct",
        chainTypes: ["aptos"],
      },
      {
        title: "Implement CCIP Receiver",
        url: "ccip/v1/ton/tutorials/receivers",
        pageId: "tutorials-receivers",
        chainTypes: ["ton"],
      },
      {
        title: "Source",
        url: "ccip/v1/ton/tutorials/source",
        pageId: "tutorials-source",
        chainTypes: ["ton"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/v1/ton/tutorials/source/build-messages",
            pageId: "tutorials-source-build-messages",
            chainTypes: ["ton"],
          },
          {
            title: "Prerequisites",
            url: "ccip/v1/ton/tutorials/source/prerequisites",
            pageId: "tutorials-source-prerequisites",
            chainTypes: ["ton"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/v1/ton/tutorials/source/arbitrary-messaging",
            pageId: "tutorials-source-arbitrary-messaging",
            chainTypes: ["ton"],
          },
        ],
      },
      {
        title: "Destination",
        url: "ccip/v1/ton/tutorials/destination",
        pageId: "tutorials-destination",
        chainTypes: ["ton"],
        children: [
          {
            title: "Build CCIP Messages",
            url: "ccip/v1/ton/tutorials/destination/build-messages",
            pageId: "tutorials-destination-build-messages",
            chainTypes: ["ton"],
          },
          {
            title: "Prerequisites",
            url: "ccip/v1/ton/tutorials/destination/prerequisites",
            pageId: "tutorials-destination-prerequisites",
            chainTypes: ["ton"],
          },
          {
            title: "Arbitrary Messaging",
            url: "ccip/v1/ton/tutorials/destination/arbitrary-messaging",
            pageId: "tutorials-destination-arbitrary-messaging",
            chainTypes: ["ton"],
          },
        ],
      },
    ],
  },
  {
    section: "Tools and Resources",
    contents: [
      {
        title: "CCIP Explorer",
        url: "ccip/v1/tools-resources/ccip-explorer",
        pageId: "ui-explorer",
        // Universal
      },
      {
        title: "Token Manager",
        url: "ccip/v1/evm/tools-resources/token-manager",
        pageId: "ui-token-manager",
        chainTypes: ["evm"],
      },
      {
        title: "Network Specific",
        url: "ccip/v1/evm/tools-resources/network-specific",
        pageId: "tools-network-specific",
        chainTypes: ["evm"],
        children: [
          {
            title: "Hyperliquid Integration Guide",
            url: "ccip/v1/evm/tools-resources/network-specific/hyperliquid-integration-guide",
            pageId: "hyperliquid-integration-guide",
            chainTypes: ["evm"],
          },
          {
            title: "HyperEVM Testnet RPC Guide",
            url: "ccip/v1/evm/tools-resources/network-specific/hyperevm-testnet-rpc",
            pageId: "hyperevm-testnet-rpc-guide",
            chainTypes: ["evm"],
          },
          {
            title: "Tempo Integration Guide",
            url: "ccip/v1/evm/tools-resources/network-specific/tempo-integration-guide",
            chainTypes: ["evm"],
          },

          {
            title: "HyperEVM Service Limits",
            url: "ccip/v1/evm/service-limits/hyperevm",
            pageId: "hyperevm-service-limits",
            chainTypes: ["evm"],
          },
        ],
      },
      {
        title: "Solidity Interfaces & Contracts",
        url: "ccip/v1/evm/api-reference",
        pageId: "solidity-interfaces-contracts",
        chainTypes: ["evm"],
        children: [
          // {
          //   title: "v1.6.3 (Latest)",
          //   url: "ccip/v1/evm/api-reference/v1.6.3",
          //   isCollapsible: true,
          //   children: evmCcipV163Contents,
          // },
          // {
          //   title: "v1.6.2",
          //   url: "ccip/v1/evm/api-reference/v1.6.2",
          //   isCollapsible: true,
          //   children: evmCcipV162Contents,
          // },
          {
            title: "v1.6.1 (Latest)",
            url: "ccip/v1/evm/api-reference/v1.6.1",
            pageId: "evm-api-v2-0-0-overview",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV161Contents,
          },
          {
            title: "v1.6.0",
            url: "ccip/v1/evm/api-reference/v1.6.0",
            pageId: "evm-api-v2-0-0-overview",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV160Contents,
          },
          {
            title: "v1.5.1",
            url: "ccip/v1/evm/api-reference/v1.5.1",
            pageId: "evm-api-v2-0-0-overview",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV151Contents,
          },
          {
            title: "v1.5.0",
            url: "ccip/v1/evm/api-reference/v1.5.0",
            pageId: "evm-api-v2-0-0-overview",
            isCollapsible: true,
            chainTypes: ["evm"],
            children: evmCcipV150Contents,
          },
        ],
      },
      {
        title: "SVM Program Interfaces",
        url: "ccip/v1/svm/api-reference",
        pageId: "tools-api-reference",
        chainTypes: ["solana"],
        children: [
          {
            title: "v1.6.0",
            url: "ccip/v1/svm/api-reference/v1.6.0",
            pageId: "tools-api-svm-v160",
            isCollapsible: true,
            chainTypes: ["solana"],
            children: svmCcipV160Contents,
          },
        ],
      },
      {
        title: "Move Modules Interface",
        url: "ccip/v1/aptos/api-reference",
        pageId: "tools-api-reference",
        chainTypes: ["aptos"],
        children: [
          {
            title: "v1.6.0",
            url: "ccip/v1/aptos/api-reference/v1.6.0",
            pageId: "tools-api-aptos-v160",
            isCollapsible: true,
            chainTypes: ["aptos"],
            children: aptosCcipV160Contents,
          },
        ],
      },
      {
        title: "API Reference",
        url: "ccip/v1/ton/api-reference",
        pageId: "tools-api-reference",
        chainTypes: ["ton"],
        children: [
          {
            title: "v1.6.0",
            url: "ccip/v1/ton/api-reference/v1.6.0",
            pageId: "tools-api-ton-v160",
            chainTypes: ["ton"],
          },
          {
            title: "TON Starter Kit Helpers",
            url: "ccip/v1/ton/api-reference/starter-kit-helpers",
            pageId: "tools-api-ton-starter-kit-helpers",
            chainTypes: ["ton"],
          },
        ],
      },
      {
        title: "CCIP API, SDK & CLI",
        url: "https://docs.chain.link/ccip/tools",
        // Universal
      },
      {
        title: "Cross-chain Examples",
        url: "ccip/v1/examples",
        pageId: "tools-examples",
        // Universal
      },
    ],
  },
]
