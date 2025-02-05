import { Sections } from "../content/config"
import ccipV150Contents from "./sidebar/ccip/api-reference/v1_5_0.json"
import ccipV151Contents from "./sidebar/ccip/api-reference/v1_5_1.json"
import chainlinkLocalV021Contents from "./sidebar/chainlink-local/api-reference/v0_2_1.json"
import chainlinkLocalV022Contents from "./sidebar/chainlink-local/api-reference/v0_2_2.json"
import chainlinkLocalV023Contents from "./sidebar/chainlink-local/api-reference/v0_2_3.json"

export type SectionContent = {
  title: string
  url: string
  highlightAsCurrent?: string[]
  children?: SectionContent[]
  isCollapsible?: boolean
}
type SectionEntry = {
  section: string
  contents: SectionContent[]
}

export const SIDEBAR: Partial<Record<Sections, SectionEntry[]>> = {
  dataFeeds: [
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
        },
        {
          title: "Rate and Volatility Feeds",
          url: "data-feeds/rates-feeds",
        },
        {
          title: "L2 Sequencer Uptime Feeds",
          url: "data-feeds/l2-sequencer-feeds",
        },
      ],
    },
    {
      section: "Feed Addresses",
      contents: [
        {
          title: "Price Feed Addresses",
          url: "data-feeds/price-feeds/addresses",
        },
        {
          title: "SmartData Feed Addresses",
          url: "data-feeds/smartdata/addresses",
        },
        {
          title: "Rate and Volatility Feed Addresses",
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
          title: "Getting Historical Data",
          url: "data-feeds/historical-data",
        },
        {
          title: "Using Feed Registry",
          url: "data-feeds/feed-registry",
        },
        {
          title: "Using ENS with Data Feeds",
          url: "data-feeds/ens",
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
      section: "Aptos Guides",
      contents: [
        {
          title: "Data Feeds on Aptos",
          url: "data-feeds/aptos",
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
          title: "Feed Registry API Reference",
          url: "data-feeds/feed-registry/feed-registry-functions",
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
  dataStreams: [
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
          title: "Billing",
          url: "data-streams/billing",
        },
        {
          title: "Release Notes",
          url: "data-streams/release-notes",
        },
      ],
    },
    {
      section: "Streams & Report Schemas",
      contents: [
        {
          title: "Cryptocurrency Streams",
          url: "data-streams/crypto-streams",
          children: [
            {
              title: "Report Schema v3",
              url: "data-streams/reference/report-schema",
            },
          ],
        },
        {
          title: "Real World Asset (RWA) Streams",
          url: "data-streams/rwa-streams",
          children: [
            {
              title: "Report Schema v4",
              url: "data-streams/reference/report-schema-v4",
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
      section: "Streams Trade",
      contents: [
        {
          title: "Overview",
          url: "data-streams/streams-trade",
        },
        {
          title: "Getting Started",
          url: "data-streams/getting-started",
          highlightAsCurrent: ["data-streams/getting-started-hardhat"],
        },
        {
          title: "Handle StreamsLookup errors",
          url: "data-streams/tutorials/streams-trade/streams-trade-lookup-error-handler",
        },
      ],
    },
    {
      section: "Streams Direct",
      contents: [
        {
          title: "Overview",
          url: "data-streams/streams-direct",
        },
        {
          title: "Fetch and decode reports",
          url: "data-streams/tutorials/streams-direct/streams-direct-api-go",
          highlightAsCurrent: [
            "data-streams/tutorials/streams-direct/streams-direct-api-rust",
            "data-streams/tutorials/streams-direct/streams-direct-api-rwa-go",
            "data-streams/tutorials/streams-direct/streams-direct-api-rwa-rust",
          ],
        },
        {
          title: "Stream and decode reports (WebSocket)",
          url: "data-streams/tutorials/streams-direct/streams-direct-ws-go",
          highlightAsCurrent: [
            "data-streams/tutorials/streams-direct/streams-direct-ws-rust",
            "data-streams/tutorials/streams-direct/streams-direct-ws-rwa-go",
            "data-streams/tutorials/streams-direct/streams-direct-ws-rwa-rust",
          ],
        },
        {
          title: "Verify report data (EVM)",
          url: "data-streams/tutorials/streams-direct/evm-onchain-report-verification",
        },
        {
          title: "Verify report data (Solana)",
          url: "data-streams/tutorials/streams-direct/solana-onchain-report-verification",
          highlightAsCurrent: ["data-streams/tutorials/streams-direct/solana-offchain-report-verification"],
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
          title: "Liquidity-Weighted Bid and Ask prices",
          url: "data-streams/concepts/liquidity-weighted-prices",
        },
      ],
    },
    {
      section: "Reference",
      contents: [
        {
          title: "Streams Trade",
          url: "data-streams/reference/streams-trade-interface",
        },
        {
          title: "Streams Direct",
          url: "data-streams/reference/streams-direct",
          children: [
            {
              title: "REST API",
              url: "data-streams/reference/streams-direct/streams-direct-interface-api",
            },
            {
              title: "WebSocket",
              url: "data-streams/reference/streams-direct/streams-direct-interface-ws",
            },
            {
              title: "SDK References",
              url: "data-streams/reference/streams-direct/streams-direct-go-sdk",
              highlightAsCurrent: ["data-streams/reference/streams-direct/streams-direct-rust-sdk"],
            },
            {
              title: "Onchain report verification (EVM chains)",
              url: "data-streams/reference/streams-direct/streams-direct-onchain-verification",
            },
          ],
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
  automation: [
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
          title: "Release Notes",
          url: "chainlink-automation/overview/automation-release-notes",
        },
        {
          title: "Migrate to Automation v2.1",
          url: "chainlink-automation/guides/migrate-to-v2",
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
  chainlinkFunctions: [
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
          url: "chainlink-functions/resources/release-notes",
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
  vrf: [
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
          url: "vrf/release-notes",
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
      section: "VRF V2 [Legacy]",
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
  ccip: [
    {
      section: "Chainlink CCIP",
      contents: [
        {
          title: "Overview",
          url: "ccip",
        },
        {
          title: "Getting Started",
          url: "ccip/getting-started",
        },
        {
          title: "CCIP Directory",
          url: "ccip/directory",
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
          url: "ccip/service-limits",
        },
        {
          title: "Service Responsibility",
          url: "ccip/service-responsibility",
        },
        {
          title: "Execution Latency",
          url: "ccip/concepts/ccip-execution-latency",
        },
        {
          title: "Billing",
          url: "ccip/billing",
        },
        {
          title: "Release Notes",
          url: "ccip/release-notes",
        },
      ],
    },
    {
      section: "Guides",
      contents: [
        {
          title: "Using the CCIP JavaScript SDK",
          url: "ccip/ccip-javascript-sdk",
        },
        {
          title: "Transfer Tokens",
          url: "ccip/tutorials/transfer-tokens-from-contract",
        },
        {
          title: "Transfer Tokens with Data",
          url: "ccip/tutorials/programmable-token-transfers",
        },
        {
          title: "Transfer Tokens with Data - Defensive Example",
          url: "ccip/tutorials/programmable-token-transfers-defensive",
        },
        {
          title: "Using the Token Manager",
          url: "ccip/tutorials/token-manager",
        },
        {
          title: "Cross-Chain Token (CCT) standard",
          url: "ccip/tutorials/cross-chain-tokens",
          children: [
            {
              title: "Deploy and Register Using Remix IDE",
              url: "ccip/tutorials/cross-chain-tokens/register-from-eoa-remix",
            },
            {
              title: "Register from an EOA (Burn & Mint)",
              url: "ccip/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-hardhat",
              highlightAsCurrent: ["ccip/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-foundry"],
            },
            {
              title: "Register from an EOA (Lock & Mint)",
              url: "ccip/tutorials/cross-chain-tokens/register-from-eoa-lock-mint-hardhat",
              highlightAsCurrent: ["ccip/tutorials/cross-chain-tokens/register-from-eoa-lock-mint-foundry"],
            },
            {
              title: "Set Token Pool rate limits",
              url: "ccip/tutorials/cross-chain-tokens/update-rate-limiters-hardhat",
              highlightAsCurrent: ["ccip/tutorials/cross-chain-tokens/update-rate-limiters-foundry"],
            },
            {
              title: "Register from a Safe Smart Account (Burn & Mint)",
              url: "ccip/tutorials/cross-chain-tokens/register-from-safe-burn-mint-hardhat",
            },
          ],
        },
        {
          title: "Test CCIP Locally",
          url: "ccip/tutorials/test-ccip-locally",
        },
        {
          title: "Offchain",
          url: "ccip/tutorials/offchain",
          children: [
            {
              title: "Transfer Tokens between EOAs",
              url: "ccip/tutorials/transfer-tokens-from-eoa",
            },
            {
              title: "Checking CCIP Message Status",
              url: "ccip/tutorials/get-status-offchain",
            },
          ],
        },
        {
          title: "Transfer USDC with Data",
          url: "ccip/tutorials/usdc",
        },
        {
          title: "Send Arbitrary Data",
          url: "ccip/tutorials/send-arbitrary-data",
        },
        {
          title: "Send Arbitrary Data and Receive Transfer Confirmation: A -> B -> A",
          url: "ccip/tutorials/send-arbitrary-data-receipt-acknowledgment",
        },
        {
          title: "Manual Execution",
          url: "ccip/tutorials/manual-execution",
        },
        {
          title: "Optimizing Gas Limit Settings in CCIP Messages",
          url: "ccip/tutorials/ccipreceive-gaslimit",
        },
        {
          title: "Acquire Test Tokens",
          url: "ccip/test-tokens",
        },
      ],
    },
    {
      section: "Concepts",
      contents: [
        {
          title: "Conceptual Overview",
          url: "ccip/concepts",
        },
        {
          title: "Architecture",
          url: "ccip/architecture",
        },
        {
          title: "Cross-Chain Token (CCT) standard",
          url: "ccip/concepts/cross-chain-tokens",
        },
        {
          title: "Manual execution",
          url: "ccip/concepts/manual-execution",
        },
        {
          title: "Best Practices",
          url: "ccip/best-practices",
        },
      ],
    },
    {
      section: "API Reference",
      contents: [
        {
          title: "Overview",
          url: "ccip/api-reference",
        },
        {
          title: "v1.5.1 (Latest)",
          url: "ccip/api-reference/v1.5.1",
          isCollapsible: true,
          children: ccipV151Contents,
        },
        {
          title: "v1.5.0",
          url: "ccip/api-reference/v1.5.0",
          isCollapsible: true,
          children: ccipV150Contents,
        },
      ],
    },
    {
      section: "Examples",
      contents: [
        {
          title: "Cross-chain dApps and Tools",
          url: "ccip/examples",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Smart Contract Overview",
          url: "getting-started/conceptual-overview?parent=ccip",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts?parent=ccip",
          children: [
            {
              title: "Acquire testnet LINK",
              url: "resources/acquire-link?parent=ccip",
            },
            {
              title: "Fund Your Contracts",
              url: "resources/fund-your-contract?parent=ccip",
            },
          ],
        },
        {
          title: "Starter Kits and Frameworks",
          url: "resources/create-a-chainlinked-project?parent=ccip",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks?parent=ccip",
        },
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview?parent=ccip",
          children: [
            {
              title: "Basic Request Model",
              url: "architecture-overview/architecture-request-model?parent=ccip",
            },
            {
              title: "Decentralized Data Model",
              url: "architecture-overview/architecture-decentralized-model?parent=ccip",
            },
            {
              title: "Offchain Reporting",
              url: "architecture-overview/off-chain-reporting?parent=ccip",
            },
          ],
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications?parent=ccip",
          children: [
            { title: "Getting Help", url: "resources/getting-help?parent=ccip" },
            { title: "Hackathon Resources", url: "resources/hackathon-resources?parent=ccip" },
          ],
        },
        {
          title: "Integrating EVM Networks",
          url: "resources/network-integration?parent=ccip",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink?parent=ccip",
        },
      ],
    },
  ],
  chainlinkLocal: [
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
  nodeOperator: [
    {
      section: "Chainlink Nodes",
      contents: [
        {
          title: "Overview",
          url: "chainlink-nodes",
        },
        {
          title: "Release Notes",
          url: "chainlink-nodes/node-versions",
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
  global: [
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
  legacy: [
    {
      section: "VRF V2 Subscription Method [Legacy]",
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
      section: "VRF V2 Direct Funding Method [Legacy]",
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
}
