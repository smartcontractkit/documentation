/**
 * Configuration file for the documentation sidebar navigation structure.
 * This file defines the entire navigation hierarchy for the documentation website.
 */

import { Sections } from "../content.config.ts"
import { SIDEBAR_SECTIONS } from "./sidebarSections.ts"
import { CCIP_SIDEBAR_CONTENT } from "./sidebar/ccip-dynamic.ts"
import type { ChainType } from "./types.js"
import chainlinkLocalV021Contents from "./sidebar/chainlink-local/api-reference/v0_2_1.json" with { type: "json" }
import chainlinkLocalV022Contents from "./sidebar/chainlink-local/api-reference/v0_2_2.json" with { type: "json" }
import chainlinkLocalV023Contents from "./sidebar/chainlink-local/api-reference/v0_2_3.json" with { type: "json" }

/**
 * Represents a single item in the sidebar navigation.
 * Can be either a leaf node (just title and URL) or a parent node with children.
 *
 * @property title - Display text for the navigation item
 * @property url - Target URL for the item (can be undefined for section headers)
 * @property highlightAsCurrent - Optional array of URLs that should highlight this item as current
 * @property children - Optional array of nested navigation items
 * @property isCollapsible - Optional flag to control if a section can be collapsed
 * @property chainTypes - Optional array of chain types this item belongs to (for chain-aware sections like CCIP)
 */
export type SectionContent = {
  title: string
  url?: string
  highlightAsCurrent?: string[]
  children?: SectionContent[]
  isCollapsible?: boolean
  chainTypes?: ChainType[]
}

/**
 * Represents a top-level section in the sidebar.
 * Each section contains a title and an array of navigation items.
 */
export type SectionEntry = {
  section: string
  contents: SectionContent[]
  parentSection?: string
}

/**
 * Main sidebar configuration object.
 * Maps each section identifier to its content structure.
 *
 * Structure:
 * {
 *   dataFeeds: [
 *     {
 *       section: "Section Title",
 *       contents: [
 *         { title: "Page Title", url: "page-url" },
 *         {
 *           title: "Parent Page",
 *           url: "parent-url",
 *           children: [
 *             { title: "Child Page", url: "child-url" }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export const SIDEBAR: Partial<Record<Sections, SectionEntry[]>> = {
  [SIDEBAR_SECTIONS.CRE]: [
    {
      section: "Chainlink CRE",
      contents: [
        {
          title: "About CRE",
          url: "cre",
        },
        {
          title: "Key Terms and Concepts",
          url: "cre/key-terms",
        },
        {
          title: "Service Quotas",
          url: "cre/service-quotas",
        },
        {
          title: "Support & Feedback",
          url: "cre/support-feedback",
        },
        {
          title: "Release Notes",
          url: "cre/release-notes",
        },
      ],
    },
    {
      section: "Getting Started",
      contents: [
        { title: "Overview", url: "cre/getting-started/overview" },
        {
          title: "CLI Installation",
          url: "cre/getting-started/cli-installation",
          children: [
            { title: "macOS / Linux", url: "cre/getting-started/cli-installation/macos-linux" },
            { title: "Windows", url: "cre/getting-started/cli-installation/windows" },
          ],
        },
        {
          title: "Part 1: Project Setup & Simulation",
          url: "cre/getting-started/part-1-project-setup",
          highlightAsCurrent: [
            "cre/getting-started/part-1-project-setup-ts",
            "cre/getting-started/part-1-project-setup-go",
          ],
        },
        {
          title: "Part 2: Fetching Offchain Data",
          url: "cre/getting-started/part-2-fetching-data",
          highlightAsCurrent: [
            "cre/getting-started/part-2-fetching-data-ts",
            "cre/getting-started/part-2-fetching-data-go",
          ],
        },
        {
          title: "Part 3: Reading Onchain",
          url: "cre/getting-started/part-3-reading-onchain-value",
          highlightAsCurrent: [
            "cre/getting-started/part-3-reading-onchain-value-ts",
            "cre/getting-started/part-3-reading-onchain-value-go",
          ],
        },
        {
          title: "Part 4: Writing Onchain",
          url: "cre/getting-started/part-4-writing-onchain",
          highlightAsCurrent: [
            "cre/getting-started/part-4-writing-onchain-ts",
            "cre/getting-started/part-4-writing-onchain-go",
          ],
        },
        { title: "Conclusion & Next Steps", url: "cre/getting-started/conclusion" },
      ],
    },
    {
      section: "Workflow Guides",
      contents: [
        {
          title: "Triggers",
          url: "cre/guides/workflow/using-triggers/overview",
          children: [
            {
              title: "Cron Trigger",
              url: "cre/guides/workflow/using-triggers/cron-trigger",
              highlightAsCurrent: [
                "cre/guides/workflow/using-triggers/cron-trigger-ts",
                "cre/guides/workflow/using-triggers/cron-trigger-go",
              ],
            },
            {
              title: "EVM Log Trigger",
              url: "cre/guides/workflow/using-triggers/evm-log-trigger",
              highlightAsCurrent: [
                "cre/guides/workflow/using-triggers/evm-log-trigger-ts",
                "cre/guides/workflow/using-triggers/evm-log-trigger-go",
              ],
            },
            {
              title: "HTTP Trigger",
              url: "cre/guides/workflow/using-triggers/http-trigger/overview",
              highlightAsCurrent: [
                "cre/guides/workflow/using-triggers/http-trigger/overview-ts",
                "cre/guides/workflow/using-triggers/http-trigger/overview-go",
              ],
              children: [
                {
                  title: "Configuration & Handler",
                  url: "cre/guides/workflow/using-triggers/http-trigger/configuration",
                  highlightAsCurrent: [
                    "cre/guides/workflow/using-triggers/http-trigger/configuration-ts",
                    "cre/guides/workflow/using-triggers/http-trigger/configuration-go",
                  ],
                },
                {
                  title: "Testing in Simulation",
                  url: "cre/guides/workflow/using-triggers/http-trigger/testing-in-simulation",
                },
                {
                  title: "Triggering Deployed Workflows",
                  url: "cre/guides/workflow/using-triggers/http-trigger/triggering-deployed-workflows",
                },
                {
                  title: "Testing deployed workflows with Local JWT Server",
                  url: "cre/guides/workflow/using-triggers/http-trigger/local-testing-tool",
                },
              ],
            },
          ],
        },
        {
          title: "EVM Chain Interactions",
          url: "cre/guides/workflow/using-evm-client/overview",
          highlightAsCurrent: [
            "cre/guides/workflow/using-evm-client/overview-ts",
            "cre/guides/workflow/using-evm-client/overview-go",
          ],
          children: [
            {
              title: "Generating Bindings",
              url: "cre/guides/workflow/using-evm-client/generating-bindings",
            },
            {
              title: "Onchain Read",
              url: "cre/guides/workflow/using-evm-client/onchain-read",
              highlightAsCurrent: [
                "cre/guides/workflow/using-evm-client/onchain-read-ts",
                "cre/guides/workflow/using-evm-client/onchain-read-go",
              ],
            },
            {
              title: "Onchain Write",
              url: "cre/guides/workflow/using-evm-client/onchain-write/overview",
              highlightAsCurrent: [
                "cre/guides/workflow/using-evm-client/onchain-write/overview-ts",
                "cre/guides/workflow/using-evm-client/onchain-write/overview-go",
              ],
              children: [
                {
                  title: "Building Consumer Contracts",
                  url: "cre/guides/workflow/using-evm-client/onchain-write/building-consumer-contracts",
                },
                {
                  title: "Writing Data Onchain",
                  url: "cre/guides/workflow/using-evm-client/onchain-write/writing-data-onchain",
                },
                {
                  title: "Using WriteReportFrom Helpers",
                  url: "cre/guides/workflow/using-evm-client/onchain-write/using-write-report-helpers",
                },
                {
                  title: "Generating Reports: Single Values",
                  url: "cre/guides/workflow/using-evm-client/onchain-write/generating-reports-single-values",
                },
                {
                  title: "Generating Reports: Structs",
                  url: "cre/guides/workflow/using-evm-client/onchain-write/generating-reports-structs",
                },
                {
                  title: "Submitting Reports Onchain",
                  url: "cre/guides/workflow/using-evm-client/onchain-write/submitting-reports-onchain",
                },
              ],
            },
            {
              title: "Supported Networks",
              url: "cre/guides/workflow/using-evm-client/supported-networks",
              highlightAsCurrent: [
                "cre/guides/workflow/using-evm-client/supported-networks-ts",
                "cre/guides/workflow/using-evm-client/supported-networks-go",
              ],
            },
          ],
        },
        {
          title: "API Interactions",
          url: "cre/guides/workflow/using-http-client",
          children: [
            {
              title: "Making GET Requests",
              url: "cre/guides/workflow/using-http-client/get-request",
              highlightAsCurrent: [
                "cre/guides/workflow/using-http-client/get-request-ts",
                "cre/guides/workflow/using-http-client/get-request-go",
              ],
            },
            {
              title: "Making POST Requests",
              url: "cre/guides/workflow/using-http-client/post-request",
              highlightAsCurrent: [
                "cre/guides/workflow/using-http-client/post-request-ts",
                "cre/guides/workflow/using-http-client/post-request-go",
              ],
            },
            {
              title: "Submitting Reports via HTTP",
              url: "cre/guides/workflow/using-http-client/submitting-reports-http",
              highlightAsCurrent: [
                "cre/guides/workflow/using-http-client/submitting-reports-http-ts",
                "cre/guides/workflow/using-http-client/submitting-reports-http-go",
              ],
            },
          ],
        },
        {
          title: "Secrets",
          url: "cre/guides/workflow/secrets",
          children: [
            {
              title: "Using Secrets in Simulation",
              url: "cre/guides/workflow/secrets/using-secrets-simulation",
              highlightAsCurrent: [
                "cre/guides/workflow/secrets/using-secrets-simulation-ts",
                "cre/guides/workflow/secrets/using-secrets-simulation-go",
              ],
            },
            {
              title: "Using Secrets with Deployed Workflows",
              url: "cre/guides/workflow/secrets/using-secrets-deployed",
            },
            {
              title: "Managing Secrets with 1Password",
              url: "cre/guides/workflow/secrets/managing-secrets-1password",
            },
          ],
        },
      ],
    },
    {
      section: "Workflow Operations",
      contents: [
        {
          title: "Simulating Workflows",
          url: "cre/guides/operations/simulating-workflows",
        },
        {
          title: "Deploying Workflows",
          url: "cre/guides/operations/deploying-workflows",
        },
        {
          title: "Activating & Pausing Workflows",
          url: "cre/guides/operations/activating-pausing-workflows",
        },
        {
          title: "Updating Deployed Workflows",
          url: "cre/guides/operations/updating-deployed-workflows",
        },
        {
          title: "Deleting Workflows",
          url: "cre/guides/operations/deleting-workflows",
        },
        {
          title: "Using Multi-sig Wallets",
          url: "cre/guides/operations/using-multisig-wallets",
        },
        {
          title: "Monitoring & Debugging Workflows",
          url: "cre/guides/operations/monitoring-workflows",
        },
      ],
    },
    {
      section: "Account & Organization",
      contents: [
        {
          title: "Account",
          url: "cre/account",
          children: [
            {
              title: "Creating Your Account",
              url: "cre/account/creating-account",
            },
            {
              title: "Logging in with the CLI",
              url: "cre/account/cli-login",
            },
            {
              title: "Managing Authentication",
              url: "cre/account/managing-auth",
            },
          ],
        },
        {
          title: "Organization",
          url: "cre/organization",
          children: [
            {
              title: "Understanding Organizations",
              url: "cre/organization/understanding-organizations",
            },
            {
              title: "Linking Wallet Keys",
              url: "cre/organization/linking-keys",
            },
            {
              title: "Inviting Team Members",
              url: "cre/organization/inviting-members",
            },
          ],
        },
      ],
    },
    {
      section: "Capabilities",
      contents: [
        { title: "Overview", url: "cre/capabilities" },
        { title: "Triggers", url: "cre/capabilities/triggers" },
        { title: "HTTP", url: "cre/capabilities/http" },
        { title: "EVM Read & Write", url: "cre/capabilities/evm-read-write" },
      ],
    },
    {
      section: "Concepts",
      contents: [
        {
          title: "Consensus Computing",
          url: "cre/concepts/consensus-computing",
        },
        {
          title: "Non-Determinism in Workflows",
          url: "cre/concepts/non-determinism",
          highlightAsCurrent: ["cre/concepts/non-determinism-go", "cre/concepts/non-determinism-ts"],
        },
        {
          title: "Time in CRE",
          url: "cre/concepts/time-in-cre",
        },
        {
          title: "Random in CRE",
          url: "cre/concepts/random-in-cre",
        },
        {
          title: "TypeScript Runtime Environment",
          url: "cre/concepts/typescript-wasm-runtime",
        },
      ],
    },
    {
      section: "Templates",
      contents: [
        {
          title: "Overview",
          url: "cre/templates",
        },
        {
          title: "Custom Data Feed Template",
          url: "cre/templates/running-demo-workflow",
          highlightAsCurrent: ["cre/templates/running-demo-workflow-ts", "cre/templates/running-demo-workflow-go"],
        },
      ],
    },
    {
      section: "Demos",
      contents: [
        {
          title: "AI-Powered Prediction Market",
          url: "cre/demos/prediction-market",
        },
      ],
    },
    {
      section: "Reference",
      contents: [
        {
          title: "Project Configuration",
          url: "cre/reference/project-configuration",
          highlightAsCurrent: ["cre/reference/project-configuration-ts", "cre/reference/project-configuration-go"],
        },
        {
          title: "CLI Reference",
          url: "cre/reference/cli",
          children: [
            { title: "Authentication", url: "cre/reference/cli/authentication" },
            {
              title: "Project Setup",
              url: "cre/reference/cli/project-setup",
              highlightAsCurrent: ["cre/reference/cli/project-setup-ts", "cre/reference/cli/project-setup-go"],
            },
            { title: "Account Management", url: "cre/reference/cli/account" },
            { title: "Workflow Commands", url: "cre/reference/cli/workflow" },
            { title: "Secrets Management", url: "cre/reference/cli/secrets" },
            { title: "Utilities", url: "cre/reference/cli/utilities" },
          ],
        },
        {
          title: "SDK Reference",
          url: "cre/reference/sdk/overview",
          highlightAsCurrent: ["cre/reference/sdk/overview-ts", "cre/reference/sdk/overview-go"],
          children: [
            {
              title: "Core SDK",
              url: "cre/reference/sdk/core",
              highlightAsCurrent: ["cre/reference/sdk/core-ts", "cre/reference/sdk/core-go"],
            },
            {
              title: "Triggers",
              url: "cre/reference/sdk/triggers/overview",
              highlightAsCurrent: ["cre/reference/sdk/triggers/overview-ts", "cre/reference/sdk/triggers/overview-go"],
              children: [
                {
                  title: "Cron Trigger",
                  url: "cre/reference/sdk/triggers/cron-trigger",
                  highlightAsCurrent: [
                    "cre/reference/sdk/triggers/cron-trigger-ts",
                    "cre/reference/sdk/triggers/cron-trigger-go",
                  ],
                },
                {
                  title: "HTTP Trigger",
                  url: "cre/reference/sdk/triggers/http-trigger",
                  highlightAsCurrent: [
                    "cre/reference/sdk/triggers/http-trigger-ts",
                    "cre/reference/sdk/triggers/http-trigger-go",
                  ],
                },
                {
                  title: "EVM Log Trigger",
                  url: "cre/reference/sdk/triggers/evm-log-trigger",
                  highlightAsCurrent: [
                    "cre/reference/sdk/triggers/evm-log-trigger-ts",
                    "cre/reference/sdk/triggers/evm-log-trigger-go",
                  ],
                },
              ],
            },
            {
              title: "EVM Client",
              url: "cre/reference/sdk/evm-client",
              highlightAsCurrent: ["cre/reference/sdk/evm-client-ts", "cre/reference/sdk/evm-client-go"],
            },
            {
              title: "HTTP Client",
              url: "cre/reference/sdk/http-client",
              highlightAsCurrent: ["cre/reference/sdk/http-client-ts", "cre/reference/sdk/http-client-go"],
            },
            {
              title: "Consensus & Aggregation",
              url: "cre/reference/sdk/consensus",
              highlightAsCurrent: ["cre/reference/sdk/consensus-ts", "cre/reference/sdk/consensus-go"],
            },
          ],
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.DATA_FEEDS]: [
    {
      section: "Chainlink Data Feeds",
      contents: [
        {
          title: "Overview",
          url: "data-feeds",
        },
        {
          title: "Getting Started",
          url: "data-feeds/getting-started",
        },
        {
          title: "Developer Responsibilities",
          url: "data-feeds/developer-responsibilities",
        },
        {
          title: "Price Feeds",
          url: "data-feeds/price-feeds",
        },
        {
          title: "SmartData",
          url: "data-feeds/smartdata",
          children: [
            {
              title: "Multiple-Variable Response (MVR) Feeds",
              url: "data-feeds/mvr-feeds",
            },
          ],
        },
        {
          title: "Smart Value Recapture (SVR) Feeds",
          url: "data-feeds/svr-feeds",
        },
        {
          title: "Rate and Volatility Feeds",
          url: "data-feeds/rates-feeds",
        },
        {
          title: "L2 Sequencer Uptime Feeds",
          url: "data-feeds/l2-sequencer-feeds",
        },
        {
          title: "Flags Contract Registry",
          url: "data-feeds/contract-registry",
        },
        {
          title: "Release Notes",
          url: "https://dev.chain.link/changelog?product=Data+Feeds",
        },
      ],
    },
    {
      section: "Feed Addresses",
      contents: [
        {
          title: "Price Feeds",
          url: "data-feeds/price-feeds/addresses",
        },
        {
          title: "U.S. Government Macroeconomic Data Feeds",
          url: "data-feeds/us-government-macroeconomic/addresses",
        },
        {
          title: "SmartData Feeds",
          url: "data-feeds/smartdata/addresses",
        },
        {
          title: "Rate and Volatility Feeds",
          url: "data-feeds/rates-feeds/addresses",
        },
        {
          title: "Selecting Quality Data Feeds",
          url: "data-feeds/selecting-data-feeds",
        },
      ],
    },
    {
      section: "Ethereum and EVM Guides",
      contents: [
        {
          title: "Using Data Feeds",
          url: "data-feeds/using-data-feeds",
        },
        {
          title: "Using MVR Feeds",
          url: "data-feeds/mvr-feeds/guides",
          children: [
            {
              title: "Using MVR Feeds on EVM Chains (Solidity)",
              url: "data-feeds/mvr-feeds/guides/evm-solidity",
            },
            {
              title: "Using MVR Feeds with ethers.js (JS)",
              url: "data-feeds/mvr-feeds/guides/ethersjs",
            },
            {
              title: "Using MVR Feeds with Viem (TS)",
              url: "data-feeds/mvr-feeds/guides/viem",
            },
          ],
        },
        {
          title: "Getting Historical Data",
          url: "data-feeds/historical-data",
        },
        {
          title: "Using ENS with Data Feeds",
          url: "data-feeds/ens",
        },
      ],
    },
    {
      section: "Aptos Guides",
      contents: [
        {
          title: "Data Feeds on Aptos",
          url: "data-feeds/aptos",
        },
      ],
    },
    {
      section: "Solana Guides",
      contents: [
        {
          title: "Data Feeds on Solana",
          url: "data-feeds/solana",
        },
        {
          title: "Using Data Feeds Offchain",
          url: "data-feeds/solana/using-data-feeds-off-chain",
        },
        {
          title: "Using Data Feeds Onchain",
          url: "data-feeds/solana/using-data-feeds-solana",
        },
      ],
    },
    {
      section: "Starknet Guides",
      contents: [
        {
          title: "Data Feeds on Starknet",
          url: "data-feeds/starknet",
        },
        {
          title: "Starknet Foundry Guides",
          url: "data-feeds/starknet/tutorials/snfoundry/",
          children: [
            {
              title: "Read Data from Chainlink Data Feeds (Offchain)",
              url: "data-feeds/starknet/tutorials/snfoundry/read-data",
            },
            {
              title: "Deploy and interact with a Consumer Contract (Onchain)",
              url: "data-feeds/starknet/tutorials/snfoundry/consumer-contract",
            },
            {
              title: "Experiment on a Devnet",
              url: "data-feeds/starknet/tutorials/snfoundry/sn-devnet-rs",
            },
          ],
        },
      ],
    },
    {
      section: "Tron Guides",
      contents: [
        {
          title: "Data Feeds on Tron",
          url: "data-feeds/tron",
        },
      ],
    },
    {
      section: "API Reference",
      contents: [
        {
          title: "Data Feeds API Reference",
          url: "data-feeds/api-reference",
        },
        {
          title: "MVR Feeds API Reference",
          url: "data-feeds/mvr-feeds/api-reference",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview?parent=dataFeeds",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts?parent=dataFeeds",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link?parent=dataFeeds",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract?parent=dataFeeds",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project?parent=dataFeeds",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks?parent=dataFeeds",
        },
        {
          title: "Chainlink Oracle Platform",
          url: "oracle-platform/overview?parent=dataFeeds",
          children: [
            {
              title: "Data Standard",
              url: "oracle-platform/data-standard?parent=dataFeeds",
            },
            {
              title: "Interoperability Standard",
              url: "oracle-platform/interoperability-standard?parent=dataFeeds",
            },
            {
              title: "Compliance Standard",
              url: "oracle-platform/compliance-standard?parent=dataFeeds",
            },
            {
              title: "Privacy Standard",
              url: "oracle-platform/privacy-standard?parent=dataFeeds",
            },
          ],
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview?parent=dataFeeds",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model?parent=dataFeeds",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model?parent=dataFeeds",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting?parent=dataFeeds",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications?parent=dataFeeds",
          children: [
            { title: "Getting Help", url: "resources/getting-help?parent=dataFeeds" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources?parent=dataFeeds" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration?parent=dataFeeds",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink?parent=dataFeeds",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.DATA_STREAMS]: [
    {
      section: "Chainlink Data Streams",
      contents: [
        {
          title: "Overview",
          url: "data-streams",
        },
        {
          title: "Developer Responsibilities",
          url: "data-streams/developer-responsibilities",
        },
        {
          title: "Supported Networks",
          url: "data-streams/supported-networks",
        },
        {
          title: "Billing",
          url: "data-streams/billing",
        },
        {
          title: "Release Notes",
          url: "https://dev.chain.link/changelog?product=Data+Streams",
        },
      ],
    },
    {
      section: "Streams & Report Schemas",
      contents: [
        {
          title: "Overview",
          url: "data-streams/reference/report-schema-overview",
        },
        {
          title: "Cryptocurrency",
          url: "data-streams/crypto-streams",
          children: [
            {
              title: "Report Schema v3 (Crypto Advanced)",
              url: "data-streams/reference/report-schema-v3",
            },
            {
              title: "Report Schema v3 (DEX State Price)",
              url: "data-streams/reference/report-schema-v3-dex",
            },
          ],
        },
        {
          title: "Exchange Rate",
          url: "data-streams/exchange-rate-streams",
          children: [
            {
              title: "Report Schema v7 (Redemption Rates)",
              url: "data-streams/reference/report-schema-v7",
            },
          ],
        },
        {
          title: "Real World Asset (RWA)",
          url: "data-streams/rwa-streams",
          children: [
            {
              title: "Report Schema v8 (RWA Standard)",
              url: "data-streams/reference/report-schema-v8",
            },
            {
              title: "Report Schema v11 (RWA Advanced)",
              url: "data-streams/reference/report-schema-v11",
            },
          ],
        },
        {
          title: "Net Asset Value (NAV)",
          url: "data-streams/nav-streams",
          children: [
            {
              title: "Report Schema v9 (NAV)",
              url: "data-streams/reference/report-schema-v9",
            },
          ],
        },
        {
          title: "Tokenized Asset",
          url: "data-streams/backed-streams",
          children: [
            {
              title: "Report Schema v10 (Tokenized Asset)",
              url: "data-streams/reference/report-schema-v10",
            },
          ],
        },
        {
          title: "Market Hours",
          url: "data-streams/market-hours",
        },
      ],
    },
    {
      section: "Tutorials",
      contents: [
        {
          title: "Overview",
          url: "data-streams/tutorials/overview",
        },
        {
          title: "Fetch and decode reports",
          url: "data-streams/tutorials/go-sdk-fetch",
          highlightAsCurrent: ["data-streams/tutorials/rust-sdk-fetch", "data-streams/tutorials/ts-sdk-fetch"],
        },
        {
          title: "Stream and decode reports (WebSocket)",
          url: "data-streams/tutorials/go-sdk-stream",
          highlightAsCurrent: ["data-streams/tutorials/rust-sdk-stream", "data-streams/tutorials/ts-sdk-stream"],
        },
        {
          title: "Verify report data (EVM)",
          url: "data-streams/tutorials/evm-onchain-report-verification",
        },
        {
          title: "Verify report data (Solana)",
          url: "data-streams/tutorials/solana-onchain-report-verification",
          highlightAsCurrent: ["data-streams/tutorials/solana-offchain-report-verification"],
        },
      ],
    },
    {
      section: "Concepts",
      contents: [
        {
          title: "Architecture",
          url: "data-streams/architecture",
        },
        {
          title: "Best Practices",
          url: "data-streams/concepts/best-practices",
        },
        {
          title: "Liquidity-Weighted Bid and Ask prices",
          url: "data-streams/concepts/liquidity-weighted-prices",
        },
        {
          title: "DEX State Price Streams",
          url: "data-streams/concepts/dex-state-price-streams",
        },
      ],
    },
    {
      section: "Reference",
      contents: [
        {
          title: "Overview",
          url: "data-streams/reference/overview",
        },
        {
          title: "Data Streams Reference",
          url: "data-streams/reference/data-streams-api",
          children: [
            {
              title: "Authentication",
              url: "data-streams/reference/data-streams-api/authentication",
              children: [
                {
                  title: "JavaScript examples",
                  url: "data-streams/reference/data-streams-api/authentication/javascript-examples",
                },
                {
                  title: "TypeScript examples",
                  url: "data-streams/reference/data-streams-api/authentication/typescript-examples",
                },
                {
                  title: "Go examples",
                  url: "data-streams/reference/data-streams-api/authentication/go-examples",
                },
                {
                  title: "Rust examples",
                  url: "data-streams/reference/data-streams-api/authentication/rust-examples",
                },
              ],
            },
            {
              title: "API Reference",
              url: "data-streams/reference/data-streams-api/interface-api",
            },
            {
              title: "WebSocket Reference",
              url: "data-streams/reference/data-streams-api/interface-ws",
            },
            {
              title: "SDK References",
              url: "data-streams/reference/data-streams-api/go-sdk",
              highlightAsCurrent: [
                "data-streams/reference/data-streams-api/rust-sdk",
                "data-streams/reference/data-streams-api/ts-sdk",
              ],
            },
            {
              title: "Onchain report verification (EVM chains)",
              url: "data-streams/reference/data-streams-api/onchain-verification",
            },
          ],
        },
        {
          title: "Candlestick API",
          url: "data-streams/reference/candlestick-api",
        },
      ],
    },
    {
      section: "Streams Trade",
      contents: [
        {
          title: "Overview",
          url: "data-streams/streams-trade",
        },
        {
          title: "Getting Started",
          url: "data-streams/tutorials/streams-trade/getting-started",
          highlightAsCurrent: ["data-streams/tutorials/streams-trade/getting-started-hardhat"],
        },
        {
          title: "Handle StreamsLookup errors",
          url: "data-streams/tutorials/streams-trade/streams-trade-lookup-error-handler",
        },
        {
          title: "Reference (Interfaces)",
          url: "data-streams/streams-trade/interfaces",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview?parent=dataStreams",
          children: [
            {
              title: "Deploy Your First Smart Contract",
              url: "getting-started/deploy-your-first-contract?parent=dataStreams",
            },
          ],
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts?parent=dataStreams",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link?parent=dataStreams",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract?parent=dataStreams",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project?parent=dataStreams",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks?parent=dataStreams",
        },
        {
          title: "Chainlink Oracle Platform",
          url: "oracle-platform/overview?parent=dataStreams",
          children: [
            {
              title: "Data Standard",
              url: "oracle-platform/data-standard?parent=dataStreams",
            },
            {
              title: "Interoperability Standard",
              url: "oracle-platform/interoperability-standard?parent=dataStreams",
            },
            {
              title: "Compliance Standard",
              url: "oracle-platform/compliance-standard?parent=dataStreams",
            },
            {
              title: "Privacy Standard",
              url: "oracle-platform/privacy-standard?parent=dataStreams",
            },
          ],
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview?parent=dataStreams",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model?parent=dataStreams",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model?parent=dataStreams",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting?parent=dataStreams",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications?parent=dataStreams",
          children: [
            { title: "Getting Help", url: "resources/getting-help?parent=dataStreams" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources?parent=dataStreams" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration?parent=dataStreams",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink?parent=dataStreams",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.AUTOMATION]: [
    {
      section: "Chainlink Automation",
      contents: [
        {
          title: "Overview",
          url: "chainlink-automation",
        },
        {
          title: "Getting Started",
          url: "chainlink-automation/overview/getting-started",
        },
        {
          title: "Billing and Costs",
          url: "chainlink-automation/overview/automation-economics",
        },
        {
          title: "Supported Networks",
          url: "chainlink-automation/overview/supported-networks",
        },
        {
          title: "Best Practices",
          url: "chainlink-automation/concepts/best-practice",
        },
        {
          title: "Service Limits",
          url: "chainlink-automation/overview/service-limits",
        },
        {
          title: "Migrate to Automation v2.1",
          url: "chainlink-automation/guides/migrate-to-v2",
        },
        {
          title: "Release Notes",
          url: "https://dev.chain.link/changelog?product=Automation",
        },
      ],
    },
    {
      section: "Guides",
      contents: [
        {
          title: "Create Automation-Compatible Contracts",
          url: "chainlink-automation/guides/compatible-contracts",
        },
        {
          title: "Access Data Streams Using Automation",
          url: "chainlink-automation/guides/streams-lookup",
        },
        {
          title: "Register Time-Based Upkeeps",
          url: "chainlink-automation/guides/job-scheduler",
        },
        {
          title: "Register Custom Logic Upkeeps",
          url: "chainlink-automation/guides/register-upkeep",
        },
        {
          title: "Register Log Trigger Upkeeps",
          url: "chainlink-automation/guides/log-trigger",
        },
        {
          title: "Register Upkeeps Programmatically",
          url: "chainlink-automation/guides/register-upkeep-in-contract",
        },
        {
          title: "Secure Upkeeps Using the Forwarder",
          url: "chainlink-automation/guides/forwarder",
        },
        {
          title: "Create Flexible, Secure, and Low-Cost Smart Contracts",
          url: "chainlink-automation/guides/flexible-upkeeps",
        },
        {
          title: "Manage your Upkeeps",
          url: "chainlink-automation/guides/manage-upkeeps",
        },
        {
          title: "Set a gas price threshold on your upkeep",
          url: "chainlink-automation/guides/gas-price-threshold",
        },
        {
          title: "Using the StreamsLookup error handler",
          url: "chainlink-automation/guides/streams-lookup-error-handler",
        },
      ],
    },
    {
      section: "Concepts",
      contents: [
        {
          title: "Concepts",
          url: "chainlink-automation/concepts/automation-concepts",
        },
        {
          title: "Architecture",
          url: "chainlink-automation/concepts/automation-architecture",
        },
      ],
    },
    {
      section: "Reference",
      contents: [
        {
          title: "Contracts",
          url: "chainlink-automation/reference/automation-contracts",
        },
        {
          title: "Interfaces",
          url: "chainlink-automation/reference/automation-interfaces",
        },
        {
          title: "Troubleshooting and Debugging",
          url: "chainlink-automation/reference/debugging-errors",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview?parent=automation",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts?parent=automation",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link?parent=automation",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract?parent=automation",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project?parent=automation",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks?parent=automation",
        },
        {
          title: "Chainlink Oracle Platform",
          url: "oracle-platform/overview?parent=automation",
          children: [
            {
              title: "Data Standard",
              url: "oracle-platform/data-standard?parent=automation",
            },
            {
              title: "Interoperability Standard",
              url: "oracle-platform/interoperability-standard?parent=automation",
            },
            {
              title: "Compliance Standard",
              url: "oracle-platform/compliance-standard?parent=automation",
            },
            {
              title: "Privacy Standard",
              url: "oracle-platform/privacy-standard?parent=automation",
            },
          ],
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview?parent=automation",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model?parent=automation",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model?parent=automation",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting?parent=automation",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications?parent=automation",
          children: [
            { title: "Getting Help", url: "resources/getting-help?parent=automation" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources?parent=automation" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration?parent=automation",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink?parent=automation",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.CHAINLINK_FUNCTIONS]: [
    {
      section: "Chainlink Functions",
      contents: [
        {
          title: "Overview",
          url: "chainlink-functions",
        },
        {
          title: "Getting Started",
          url: "chainlink-functions/getting-started",
        },
        {
          title: "Supported Networks",
          url: "chainlink-functions/supported-networks",
        },
        {
          title: "Service Limits",
          url: "chainlink-functions/resources/service-limits",
        },
        {
          title: "Service Responsibility",
          url: "chainlink-functions/service-responsibility",
        },
        {
          title: "Billing",
          url: "chainlink-functions/resources/billing",
        },
        {
          title: "Release Notes",
          url: "https://dev.chain.link/changelog?product=Functions",
        },
      ],
    },
    {
      section: "Guides",
      contents: [
        {
          title: "Simple Computation",
          url: "chainlink-functions/tutorials/simple-computation",
        },
        {
          title: "Call an API",
          url: "chainlink-functions/tutorials/api-query-parameters",
        },
        {
          title: "POST Data to an API",
          url: "chainlink-functions/tutorials/api-post-data",
        },
        {
          title: "Using DON-hosted Secrets in Requests",
          url: "chainlink-functions/tutorials/api-use-secrets",
        },
        {
          title: "Using Imports with Functions",
          url: "chainlink-functions/tutorials/importing-packages",
        },
        {
          title: "Return multiple responses and decode them in your smart contract",
          url: "chainlink-functions/tutorials/abi-decoding",
        },
        {
          title: "Offchain secrets - Using Gists",
          url: "chainlink-functions/tutorials/api-use-secrets-gist",
        },
        {
          title: "Offchain secrets - Other methods",
          url: "chainlink-functions/tutorials/api-use-secrets-offchain",
        },
        {
          title: "Call Multiple Data Sources",
          url: "chainlink-functions/tutorials/api-multiple-calls",
        },
        {
          title: "Encode request data off-chain",
          url: "chainlink-functions/tutorials/encode-request-offchain",
        },
        {
          title: "Automate your Functions (Time-based Automation)",
          url: "chainlink-functions/tutorials/automate-functions",
        },
        {
          title: "Automate your Functions (Custom Logic Automation)",
          url: "chainlink-functions/tutorials/automate-functions-custom-logic",
        },
      ],
    },
    {
      section: "Concepts",
      contents: [
        {
          title: "Architecture",
          url: "chainlink-functions/resources/architecture",
        },
        {
          title: "Secrets Management",
          url: "chainlink-functions/resources/secrets",
        },
        {
          title: "Simulate your Functions",
          url: "chainlink-functions/resources/simulation",
        },
        {
          title: "Managing Subscriptions",
          url: "chainlink-functions/resources/subscriptions",
        },
      ],
    },
    {
      section: "API Reference",
      contents: [
        {
          title: "FunctionsClient",
          url: "chainlink-functions/api-reference/functions-client",
        },
        {
          title: "FunctionsRequest library",
          url: "chainlink-functions/api-reference/functions-request",
        },
        {
          title: "JavaScript source code",
          url: "chainlink-functions/api-reference/javascript-source",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview?parent=chainlinkFunctions",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts?parent=chainlinkFunctions",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link?parent=chainlinkFunctions",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract?parent=chainlinkFunctions",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project?parent=chainlinkFunctions",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks?parent=chainlinkFunctions",
        },
        {
          title: "Chainlink Oracle Platform",
          url: "oracle-platform/overview?parent=chainlinkFunctions",
          children: [
            {
              title: "Data Standard",
              url: "oracle-platform/data-standard?parent=chainlinkFunctions",
            },
            {
              title: "Interoperability Standard",
              url: "oracle-platform/interoperability-standard?parent=chainlinkFunctions",
            },
            {
              title: "Compliance Standard",
              url: "oracle-platform/compliance-standard?parent=chainlinkFunctions",
            },
            {
              title: "Privacy Standard",
              url: "oracle-platform/privacy-standard?parent=chainlinkFunctions",
            },
          ],
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview?parent=chainlinkFunctions",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model?parent=chainlinkFunctions",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model?parent=chainlinkFunctions",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting?parent=chainlinkFunctions",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications?parent=chainlinkFunctions",
          children: [
            { title: "Getting Help", url: "resources/getting-help?parent=chainlinkFunctions" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources?parent=chainlinkFunctions" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration?parent=chainlinkFunctions",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink?parent=chainlinkFunctions",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.VRF]: [
    {
      section: "Chainlink VRF v2.5",
      contents: [
        {
          title: "Overview",
          url: "vrf",
        },
        {
          title: "Getting Started",
          url: "vrf/v2-5/getting-started",
        },
        {
          title: "Migrating from V2",
          url: "vrf/v2-5/migration-from-v2",
        },
        {
          title: "Migrating from V1",
          url: "vrf/v2-5/migration-from-v1",
        },
        {
          title: "Supported Networks",
          url: "vrf/v2-5/supported-networks",
        },
        {
          title: "Security Considerations",
          url: "vrf/v2-5/security",
        },
        {
          title: "Best Practices",
          url: "vrf/v2-5/best-practices",
        },
        {
          title: "Billing",
          url: "vrf/v2-5/billing",
        },
        {
          title: "Release Notes",
          url: "https://dev.chain.link/changelog?product=VRF",
        },
      ],
    },
    {
      section: "Learn VRF V2.5",
      contents: [
        {
          title: "Introduction to subscription",
          url: "vrf/v2-5/overview/subscription",
        },
        {
          title: "Introduction to direct funding",
          url: "vrf/v2-5/overview/direct-funding",
        },
        {
          title: "Arbitrum gas estimation with VRF",
          url: "vrf/v2-5/arbitrum-cost-estimation",
        },
      ],
    },
    {
      section: "Build with VRF 2.5",
      contents: [
        {
          title: "Create and manage subscriptions",
          url: "vrf/v2-5/subscription/create-manage",
        },
        {
          title: "Get a random number with subscription",
          url: "vrf/v2-5/subscription/get-a-random-number",
        },
        {
          title: "Test locally with a subscription mock contract",
          url: "vrf/v2-5/subscription/test-locally",
        },
        {
          title: "Get a random number with direct funding",
          url: "vrf/v2-5/direct-funding/get-a-random-number",
        },
      ],
    },
    {
      section: "VRF V2 [DEPRECATED]",
      contents: [
        {
          title: "VRF V2 Subscription Method",
          url: "vrf/v2/subscription",
        },
        {
          title: "VRF V2 Direct Funding Method",
          url: "vrf/v2/direct-funding",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview?parent=vrf",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts?parent=vrf",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link?parent=vrf",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract?parent=vrf",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project?parent=vrf",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks?parent=vrf",
        },
        {
          title: "Chainlink Oracle Platform",
          url: "oracle-platform/overview?parent=vrf",
          children: [
            {
              title: "Data Standard",
              url: "oracle-platform/data-standard?parent=vrf",
            },
            {
              title: "Interoperability Standard",
              url: "oracle-platform/interoperability-standard?parent=vrf",
            },
            {
              title: "Compliance Standard",
              url: "oracle-platform/compliance-standard?parent=vrf",
            },
            {
              title: "Privacy Standard",
              url: "oracle-platform/privacy-standard?parent=vrf",
            },
          ],
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview?parent=vrf",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model?parent=vrf",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model?parent=vrf",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting?parent=vrf",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications?parent=vrf",
          children: [
            { title: "Getting Help", url: "resources/getting-help?parent=vrf" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources?parent=vrf" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration?parent=vrf",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink?parent=vrf",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.CCIP]: CCIP_SIDEBAR_CONTENT,

  [SIDEBAR_SECTIONS.CHAINLINK_LOCAL]: [
    {
      section: "Chainlink Local",
      contents: [
        {
          title: "Overview",
          url: "chainlink-local",
        },
        {
          title: "Architecture",
          url: "chainlink-local/learn/architecture",
        },
        {
          title: "Contributing",
          url: "chainlink-local/learn/contributing",
        },
      ],
    },
    {
      section: "Build - CCIP",
      contents: [
        {
          title: "Foundry",
          url: "chainlink-local/build/ccip/foundry",
          children: [
            {
              title: "Using the CCIP Local Simulator",
              url: "chainlink-local/build/ccip/foundry/local-simulator",
            },
            {
              title: "Using the CCIP Local Simulator in forked environments",
              url: "chainlink-local/build/ccip/foundry/local-simulator-fork",
            },
            {
              title: "Using the CCIP Local Simulator to fork mainnets",
              url: "chainlink-local/build/ccip/foundry/forking-mainnets",
            },
            {
              title: "CCT - getCCIPAdmin() token with Burn and Mint Pool in forked environments",
              url: "chainlink-local/build/ccip/foundry/cct-burn-and-mint-fork",
            },
            {
              title: "CCT - owner() token with Lock and Release Pool in forked environments",
              url: "chainlink-local/build/ccip/foundry/cct-lock-and-release-fork",
            },
          ],
        },
        {
          title: "Hardhat",
          url: "chainlink-local/build/ccip/hardhat",
          children: [
            {
              title: "Using the CCIP Local Simulator",
              url: "chainlink-local/build/ccip/hardhat/local-simulator",
            },
            {
              title: "Using the CCIP Local Simulator in forked environments",
              url: "chainlink-local/build/ccip/hardhat/local-simulator-fork",
            },
          ],
        },
        {
          title: "Remix IDE",
          url: "chainlink-local/build/ccip/remix",
          children: [
            {
              title: "Using the CCIP Local Simulator",
              url: "chainlink-local/build/ccip/remix/local-simulator",
            },
          ],
        },
      ],
    },
    {
      section: "API Reference",
      contents: [
        {
          title: "Overview",
          url: "chainlink-local/api-reference",
        },
        {
          title: "v0.2.3 (Latest)",
          url: "chainlink-local/api-reference/v0.2.3",
          isCollapsible: true,
          children: chainlinkLocalV023Contents,
        },
        {
          title: "v0.2.2",
          url: "chainlink-local/api-reference/v0.2.2",
          isCollapsible: true,
          children: chainlinkLocalV022Contents,
        },
        {
          title: "v0.2.1",
          url: "chainlink-local/api-reference/v0.2.1",
          isCollapsible: true,
          children: chainlinkLocalV021Contents,
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.NODE_OPERATORS]: [
    {
      section: "Chainlink Nodes",
      contents: [
        {
          title: "Overview",
          url: "chainlink-nodes",
        },
        {
          title: "Run a Chainlink Node",
          url: "chainlink-nodes/v1/running-a-chainlink-node",
        },
        {
          title: "Configuring Nodes",
          url: "chainlink-nodes/configuring-nodes",
          children: [
            {
              title: "Node Config (TOML)",
              url: "chainlink-nodes/v1/node-config",
            },
            {
              title: "Secrets Config (TOML)",
              url: "chainlink-nodes/v1/secrets-config",
            },
          ],
        },
        {
          title: "Using Roles and Access Control",
          url: "chainlink-nodes/v1/roles-and-access",
        },
        {
          title: "System Requirements",
          url: "chainlink-nodes/resources/requirements",
        },
        {
          title: "Release Notes",
          url: "https://dev.chain.link/changelog?product=Nodes",
        },
      ],
    },
    {
      section: "Guides",
      contents: [
        {
          title: "Fulfilling Requests",
          url: "chainlink-nodes/v1/fulfilling-requests",
        },
        {
          title: "Using Forwarder Contracts",
          url: "chainlink-nodes/v1/using-forwarder",
        },
        {
          title: "Running an Ethereum Client",
          url: "chainlink-nodes/resources/run-an-ethereum-client",
        },
        {
          title: "Connecting to a Remote Database",
          url: "chainlink-nodes/resources/connecting-to-a-remote-database",
        },
        {
          title: "Enabling HTTPS Connections",
          url: "chainlink-nodes/resources/enabling-https-connections",
        },
        {
          title: "Performing System Maintenance",
          url: "chainlink-nodes/resources/performing-system-maintenance",
        },
        {
          title: "Optimizing EVM Performance",
          url: "chainlink-nodes/resources/evm-performance-configuration",
        },
        {
          title: "Security and Operation Best Practices",
          url: "chainlink-nodes/resources/best-security-practices",
        },
        { title: "Miscellaneous", url: "chainlink-nodes/resources/miscellaneous" },
      ],
    },
    {
      section: "Contract Reference",
      contents: [
        {
          title: "Operator",
          url: "chainlink-nodes/contracts/operator",
        },
        {
          title: "Operator Factory",
          url: "chainlink-nodes/contracts/operatorfactory",
        },
        {
          title: "Forwarder",
          url: "chainlink-nodes/contracts/forwarder",
        },
        {
          title: "Receiver",
          url: "chainlink-nodes/contracts/receiver",
        },
        {
          title: "Ownership",
          url: "chainlink-nodes/contracts/ownership",
        },
        {
          title: "Contract Addresses",
          url: "chainlink-nodes/contracts/addresses",
        },
      ],
    },
    {
      section: "Job and Task Reference",
      contents: [
        {
          title: "Migrating to v2 Jobs",
          url: "chainlink-nodes/oracle-jobs/migration-v1-v2",
        },
        {
          title: "Jobs",
          url: "chainlink-nodes/oracle-jobs/jobs",
          children: [
            {
              title: "Job Types",
              url: "chainlink-nodes/oracle-jobs/all-jobs",
            },
          ],
        },
        {
          url: "chainlink-nodes/oracle-jobs/tasks",
          title: "Tasks",
          children: [
            {
              title: "Task Types",
              url: "chainlink-nodes/oracle-jobs/all-tasks",
            },
          ],
        },
      ],
    },
    {
      section: "External Initiators",
      contents: [
        {
          title: "Introduction",
          url: "chainlink-nodes/external-initiators/external-initiators-introduction",
        },
        {
          title: "Building External Initiators",
          url: "chainlink-nodes/external-initiators/building-external-initiators",
        },
        {
          title: "Adding External Initiators to Nodes",
          url: "chainlink-nodes/external-initiators/external-initiators-in-nodes",
        },
      ],
    },
    {
      section: "Connect to Any API",
      contents: [
        {
          title: "Overview",
          url: "any-api/introduction",
        },
        {
          title: "Getting Started",
          url: "any-api/getting-started",
        },
        {
          title: "Make a GET Request",
          url: "any-api/get-request/introduction",
          children: [
            {
              title: "Single Word Response",
              url: "any-api/get-request/examples/single-word-response",
            },
            {
              title: "Multi-Variable Responses",
              url: "any-api/get-request/examples/multi-variable-responses",
            },
            {
              title: "Array Response",
              url: "any-api/get-request/examples/array-response",
            },
            {
              title: "Large Responses",
              url: "any-api/get-request/examples/large-responses",
            },
            {
              title: "Existing Job Request",
              url: "any-api/get-request/examples/existing-job-request",
            },
          ],
        },
        {
          title: "Find Existing Jobs",
          url: "any-api/find-oracle",
        },
        {
          title: "Testnet Oracles",
          url: "any-api/testnet-oracles",
        },
        {
          title: "API Reference",
          url: "any-api/api-reference",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.GLOBAL]: [
    {
      section: "General Documentation",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks",
        },
        {
          title: "Chainlink Oracle Platform",
          url: "oracle-platform/overview",
          children: [
            {
              title: "Data Standard",
              url: "oracle-platform/data-standard",
            },
            {
              title: "Interoperability Standard",
              url: "oracle-platform/interoperability-standard",
            },
            {
              title: "Compliance Standard",
              url: "oracle-platform/compliance-standard",
            },
            {
              title: "Privacy Standard",
              url: "oracle-platform/privacy-standard",
            },
          ],
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications",
          children: [
            { title: "Getting Help", url: "resources/getting-help" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.LEGACY]: [
    {
      section: "VRF V2 Subscription Method [DEPRECATED]",
      contents: [
        {
          title: "Migrate to VRF V2.5",
          url: "vrf/v2-5/migration-from-v2",
        },
        {
          title: "Introduction",
          url: "vrf/v2/subscription",
        },
        {
          title: "Get a Random Number",
          url: "vrf/v2/subscription/examples/get-a-random-number",
        },
        {
          title: "Programmatic Subscription",
          url: "vrf/v2/subscription/examples/programmatic-subscription",
        },
        {
          title: "Test Locally Using a Mock Contract",
          url: "vrf/v2/subscription/examples/test-locally",
        },
        {
          title: "Subscription Manager UI",
          url: "vrf/v2/subscription/ui",
        },
        {
          title: "Supported Networks",
          url: "vrf/v2/subscription/supported-networks",
        },
        {
          title: "V2 Billing",
          url: "vrf/v2/estimating-costs",
        },
      ],
    },
    {
      section: "VRF V2 Direct Funding Method [DEPRECATED]",
      contents: [
        {
          title: "Migrate to VRF V2.5",
          url: "vrf/v2-5/migration-from-v2",
        },
        {
          title: "Introduction",
          url: "vrf/v2/direct-funding",
        },
        {
          title: "Get a Random Number",
          url: "vrf/v2/direct-funding/examples/get-a-random-number",
        },
        {
          title: "Test Locally Using a Mock Contract",
          url: "vrf/v2/direct-funding/examples/test-locally",
        },
        {
          title: "Supported Networks",
          url: "vrf/v2/direct-funding/supported-networks",
        },
        {
          title: "V2 Billing",
          url: "vrf/v2/estimating-costs",
        },
      ],
    },
    {
      section: "VRF v1 [DEPRECATED]",
      contents: [
        { title: "Introduction to Chainlink VRF", url: "vrf/v1/introduction" },
        {
          title: "Get a Random Number",
          url: "vrf/v1/examples/get-a-random-number",
        },
        { title: "Security Considerations", url: "vrf/v1/security" },
        { title: "Best Practices", url: "vrf/v1/best-practices" },
        { title: "Supported Networks", url: "vrf/v1/supported-networks" },
        { title: "API Reference", url: "vrf/v1/api-reference" },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.DTA_TECHNICAL_STANDARD]: [
    {
      section: "DTA Technical Standard",
      contents: [
        {
          title: "About DTA",
          url: "dta-technical-standard",
        },
        {
          title: "How It Works",
          url: "dta-technical-standard/how-it-works",
        },
        {
          title: "Actors",
          url: "dta-technical-standard/actors",
        },
      ],
    },
    {
      section: "Concepts",
      contents: [
        {
          title: "Architecture",
          url: "dta-technical-standard/concepts/architecture",
        },
        {
          title: "Payment Modes",
          url: "dta-technical-standard/concepts/payment-modes",
        },
        {
          title: "Request Lifecycle",
          url: "dta-technical-standard/concepts/request-lifecycle",
        },
      ],
    },
    {
      section: "Reference",
      contents: [
        {
          title: "Glossary",
          url: "dta-technical-standard/reference/glossary",
        },
      ],
    },
  ],
  [SIDEBAR_SECTIONS.DATALINK]: [
    {
      section: "DataLink",
      contents: [
        {
          title: "Overview",
          url: "datalink",
        },
        {
          title: "Data Quality, Responsibility & Trust Model",
          url: "datalink/data-quality-responsibility",
        },
        {
          title: "Billing",
          url: "datalink/billing",
        },
      ],
    },
    {
      section: "Provider Catalog",
      contents: [
        {
          title: "DataLink Providers",
          url: "datalink/provider-catalog",
        },
      ],
    },
    {
      section: "Pull Delivery",
      contents: [
        {
          title: "Overview",
          url: "datalink/pull-delivery/overview",
        },
        {
          title: "Supported Networks",
          url: "datalink/pull-delivery/supported-networks",
          children: [
            {
              title: "Verifier Proxy Addresses",
              url: "datalink/pull-delivery/verifier-proxy-addresses",
            },
          ],
        },
        {
          title: "Tutorials",
          url: "datalink/pull-delivery/tutorials",
          children: [
            {
              title: "Fetch and Decode reports",
              url: "datalink/pull-delivery/tutorials/fetch-decode/api-go",
              highlightAsCurrent: ["datalink/pull-delivery/tutorials/fetch-decode/api-rust"],
            },
            {
              title: "Stream and Decode reports (WebSocket)",
              url: "datalink/pull-delivery/tutorials/stream-decode/ws-go",
              highlightAsCurrent: ["datalink/pull-delivery/tutorials/stream-decode/ws-rust"],
            },
            {
              title: "Verify report data (EVM)",
              url: "datalink/pull-delivery/tutorials/onchain-verification-evm",
            },
          ],
        },
        {
          title: "Architecture",
          url: "datalink/pull-delivery/architecture",
        },
        {
          title: "Reference",
          url: "datalink/pull-delivery/reference",
          children: [
            {
              title: "API, SDKs, Onchain Verification",
              url: "datalink/pull-delivery/reference/api-sdk-onchain-verification",
            },
          ],
        },
      ],
    },
    {
      section: "Push Delivery",
      contents: [
        {
          title: "Overview",
          url: "datalink/push-delivery/overview",
        },
        {
          title: "Tutorials",
          url: "datalink/push-delivery/tutorials",
          children: [
            {
              title: "Using DataLink Feeds",
              url: "datalink/push-delivery/tutorials/using-datalink-feeds",
            },
          ],
        },
        {
          title: "Architecture",
          url: "datalink/push-delivery/architecture",
        },
        {
          title: "API Reference",
          url: "datalink/push-delivery/api-reference",
        },
      ],
    },
  ],
}
