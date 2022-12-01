export const SIDEBAR = {
  gettingStarted: [
    {
      section: "Getting Started",
      contents: [
        { title: "Overview", url: "getting-started/conceptual-overview" },
        {
          title: "Deploy Your First Contract",
          url: "getting-started/deploy-your-first-contract",
        },
        {
          title: "Consuming Data Feeds",
          url: "getting-started/consuming-data-feeds",
        },
        {
          title: "Get Random Numbers",
          url: "getting-started/intermediates-tutorial",
        },
        { title: "API Calls", url: "getting-started/advanced-tutorial" },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Videos and Tutorials",
          url: "getting-started/other-tutorials",
        },
      ],
    },
    {
      section: "Next Steps",
      contents: [
        {
          title: "Chainlink Architecture",
          url: "architecture-overview/architecture-overview",
        },
        {
          title: "Data Feeds",
          url: "data-feeds/",
        },
        { title: "Chainlink VRF", url: "vrf/v2/introduction" },
        {
          title: "Chainlink Automation",
          url: "chainlink-automation/introduction/",
        },
        { title: "Connect to Public API Data", url: "any-api/introduction" },
        {
          title: "Run a Chainlink Node",
          url: "chainlink-nodes/running-a-chainlink-node",
        },
      ],
    },
  ],
  ethereum: [
    {
      section: "Overview",
      contents: [
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
              title: "Off-Chain Reporting",
              url: "architecture-overview/off-chain-reporting",
            },
          ],
        },
      ],
    },
    {
      section: "DATA FEEDS",
      contents: [
        {
          title: "Introduction to Data Feeds",
          url: "data-feeds",
        },
        {
          title: "Price Feeds",
          url: "data-feeds/price-feeds",
          children: [
            {
              title: "Historical Price Data",
              url: "data-feeds/price-feeds/historical-data",
            },
            {
              title: "Price Feeds API Reference",
              url: "data-feeds/price-feeds/api-reference",
            },
            {
              title: "Contract Addresses",
              url: "data-feeds/price-feeds/addresses",
            },
          ],
        },
        {
          title: "Proof of Reserve Feeds",
          url: "data-feeds/proof-of-reserve",
          children: [
            {
              title: "Contract Addresses",
              url: "data-feeds/proof-of-reserve/addresses",
            },
          ],
        },
        {
          title: "NFT Floor Pricing Feeds",
          url: "data-feeds/nft-floor-price",
          children: [
            {
              title: "Contract Addresses",
              url: "data-feeds/nft-floor-price/addresses",
            },
          ],
        },
        {
          title: "L2 Sequencer Uptime Feeds",
          url: "data-feeds/l2-sequencer-feeds",
        },
        {
          title: "Using ENS with Data Feeds",
          url: "data-feeds/ens",
        },
        {
          title: "Feed Registry",
          url: "data-feeds/feed-registry",
          children: [
            {
              title: "Feed Registry API Reference",
              url: "data-feeds/feed-registry/feed-registry-functions",
            },
          ],
        },
        {
          title: "Selecting Data Feeds",
          url: "data-feeds/selecting-data-feeds",
        },
      ],
    },
    {
      section: "USING RANDOMNESS",

      contents: [
        {
          title: "Introduction to Chainlink VRF",
          url: "vrf/v2/introduction",
        },
        {
          title: "Subscription Method",
          url: "vrf/v2/subscription",
          children: [
            {
              title: "Get a Random Number",
              url: "vrf/v2/subscription/examples/get-a-random-number",
            },
            {
              title: "Programmatic Subscription",
              url: "vrf/v2/subscription/examples/programmatic-subscription",
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
              title: "Migrating from VRF v1",
              url: "vrf/v2/subscription/migration-from-v1",
            },
          ],
        },
        {
          title: "Direct Funding Method",
          url: "vrf/v2/direct-funding",
          children: [
            {
              title: "Get a Random Number",
              url: "vrf/v2/direct-funding/examples/get-a-random-number",
            },
            {
              title: "Supported Networks",
              url: "vrf/v2/direct-funding/supported-networks",
            },
            {
              title: "Migrating from VRF v1",
              url: "vrf/v2/direct-funding/migration-from-v1",
            },
          ],
        },
        {
          title: "Security Considerations",
          url: "vrf/v2/security",
        },
        {
          title: "Best Practices",
          url: "vrf/v2/best-practices",
        },
      ],
    },
    {
      section: "Connect to any API",
      contents: [
        { title: "Introduction to Using Any API", url: "any-api/introduction" },
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
        { title: "Find Existing Jobs", url: "any-api/find-oracle" },
        { title: "Testnet Oracles", url: "any-api/testnet-oracles" },
        {
          title: "Data Provider Nodes",
          url: "any-api/data-providers/introduction",
        },
        { title: "API Reference", url: "any-api/api-reference" },
      ],
    },
    {
      section: "AUTOMATE CONTRACTS",
      contents: [
        {
          title: "Introduction to Chainlink Automation",
          url: "chainlink-automation/introduction/",
        },
        {
          title: "Time-based Automation",
          url: "chainlink-automation/job-scheduler/",
        },
        {
          title: "Custom Logic Automation",
          url: "chainlink-automation/register-upkeep/",
        },
        {
          title: "Create Compatible Contracts",
          url: "chainlink-automation/compatible-contracts/",
        },

        {
          title: "Manage your Upkeeps",
          url: "chainlink-automation/manage-upkeeps/",
        },
        {
          title: "Creating Flexible Upkeeps",
          url: "chainlink-automation/flexible-upkeeps/",
        },
        {
          title: "Example Contracts",
          url: "chainlink-automation/util-overview/",
          children: [
            {
              title: "EthBalanceMonitor",
              url: "chainlink-automation/utility-contracts/",
            },
          ],
        },
        {
          title: "Automation Architecture",
          url: "chainlink-automation/overview/",
        },
        {
          title: "Supported Networks",
          url: "chainlink-automation/supported-networks/",
        },
        {
          title: "Automation Pricing",
          url: "chainlink-automation/automation-economics/",
        },
        {
          title: "Automation Release Notes",
          url: "chainlink-automation/automation-release-notes/",
        },
        {
          title: "FAQs",
          url: "chainlink-automation/faqs/",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        {
          title: "Videos and Tutorials",
          url: "getting-started/other-tutorials",
        },
        { title: "Acquire testnet LINK", url: "resources/acquire-link" },
        { title: "Fund Your Contracts", url: "resources/fund-your-contract" },
        {
          title: "Install Frameworks",
          url: "resources/create-a-chainlinked-project",
        },
        {
          title: "LINK Token Contracts",
          url: "resources/link-token-contracts",
        },
        {
          title: "Bridges and Associated Risks",
          url: "resources/bridge-risks",
        },
        {
          title: "Developer Communications",
          url: "resources/developer-communications",
        },
        { title: "Getting Help", url: "resources/getting-help" },
        { title: "Hackathon Resources", url: "resources/hackathon-resources" },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink",
        },
      ],
    },
  ],
  solana: [
    {
      section: "Solana",
      contents: [{ title: "Overview", url: "solana/overview" }],
    },
    {
      section: "Data Feeds",
      contents: [
        {
          title: "Using Data Feeds Off-Chain",
          url: "solana/data-feeds/using-data-feeds-off-chain",
        },
        {
          title: "Using Data Feeds On-Chain",
          url: "solana/data-feeds/using-data-feeds-solana",
        },
        {
          title: "Data Feed Addresses",
          url: "solana/data-feeds/data-feeds-solana",
        },
      ],
    },
    {
      section: "Resources",
      contents: [
        { title: "Getting Help", url: "resources/getting-help" },
        {
          title: "Selecting Data Feeds",
          url: "data-feeds/selecting-data-feeds",
        },
        {
          title: "Contributing to Chainlink",
          url: "resources/contributing-to-chainlink",
        },
      ],
    },
  ],
  nodeOperator: [
    {
      section: "NODE OPERATORS",
      contents: [
        { title: "Node Versions", url: "chainlink-nodes/node-versions" },
        {
          title: "Running a Chainlink Node",
          url: "chainlink-nodes/running-a-chainlink-node",
          children: [
            {
              title: "Run an Ethereum Client",
              url: "chainlink-nodes/run-an-ethereum-client",
            },
          ],
        },
        {
          title: "Fulfilling Requests",
          url: "chainlink-nodes/fulfilling-requests",
        },
        {
          title: "Performing System Maintenance",
          url: "chainlink-nodes/performing-system-maintenance",
        },
        {
          title: "Connecting to a Remote Database",
          url: "chainlink-nodes/connecting-to-a-remote-database",
        },
        {
          title: "Configuring Nodes",
          url: "chainlink-nodes/configuration-variables",
        },
        {
          title: "Enabling HTTPS Connections",
          url: "chainlink-nodes/enabling-https-connections",
        },
        {
          title: "Security and Operation Best Practices",
          url: "chainlink-nodes/best-security-practices",
        },
        {
          title: "Optimizing EVM Performance",
          url: "chainlink-nodes/evm-performance-configuration",
        },
        {
          title: "Best Practices for Nodes on AWS",
          url: "chainlink-nodes/best-practices-aws",
        },
        { title: "Miscellaneous", url: "chainlink-nodes/miscellaneous" },
      ],
    },
    {
      section: "ORACLE JOBS",
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
              title: "Cron",
              url: "chainlink-nodes/oracle-jobs/job-types/cron",
            },
            {
              title: "Direct Request",
              url: "chainlink-nodes/oracle-jobs/job-types/direct_request",
            },
            {
              title: "Flux Monitor",
              url: "chainlink-nodes/oracle-jobs/job-types/flux_monitor",
            },
            {
              title: "Keeper",
              url: "chainlink-nodes/oracle-jobs/job-types/keeper",
            },
            {
              title: "Off-chain Reporting",
              url: "chainlink-nodes/oracle-jobs/job-types/offchain_reporting",
            },
            {
              title: "Webhook",
              url: "chainlink-nodes/oracle-jobs/job-types/webhook",
            },
          ],
        },
        {
          url: "chainlink-nodes/oracle-jobs/task-types/tasks",
          title: "Tasks",
          children: [
            {
              title: "Job Pipelines",
              url: "chainlink-nodes/oracle-jobs/task-types/pipelines",
            },
            {
              title: "HTTP",
              url: "chainlink-nodes/oracle-jobs/task-types/task_http",
            },
            {
              title: "Bridge",
              url: "chainlink-nodes/oracle-jobs/task-types/task_bridge",
            },
            {
              title: "JSON Parse",
              url: "chainlink-nodes/oracle-jobs/task-types/task_jsonparse",
            },
            {
              title: "CBOR Parse",
              url: "chainlink-nodes/oracle-jobs/task-types/task_cborparse",
            },
            {
              title: "ETH ABI Decode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_eth_abi_decode",
            },
            {
              title: "ETH ABI Decode Log",
              url: "chainlink-nodes/oracle-jobs/task-types/task_eth_abi_decode_log",
            },
            {
              title: "ETH ABI Encode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_eth_abi_encode",
            },
            {
              title: "ETH Call",
              url: "chainlink-nodes/oracle-jobs/task-types/task_eth_call",
            },
            {
              title: "ETH Tx",
              url: "chainlink-nodes/oracle-jobs/task-types/task_eth_tx",
            },
            {
              title: "Multiply",
              url: "chainlink-nodes/oracle-jobs/task-types/task_multiply",
            },
            {
              title: "Divide",
              url: "chainlink-nodes/oracle-jobs/task-types/task_divide",
            },
            {
              title: "Any",
              url: "chainlink-nodes/oracle-jobs/task-types/task_any",
            },
            {
              title: "Mean",
              url: "chainlink-nodes/oracle-jobs/task-types/task_mean",
            },
            {
              title: "Median",
              url: "chainlink-nodes/oracle-jobs/task-types/task_median",
            },
            {
              title: "Mode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_mode",
            },
            {
              title: "Sum",
              url: "chainlink-nodes/oracle-jobs/task-types/task_sum",
            },
            {
              title: "Less Than",
              url: "chainlink-nodes/oracle-jobs/task-types/task_lessthan",
            },
            {
              title: "Length",
              url: "chainlink-nodes/oracle-jobs/task-types/task_length",
            },
            {
              title: "Hex Decode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_hexdecode",
            },
            {
              title: "Hex Encode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_hexencode",
            },
            {
              title: "Base64 Decode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_base64decode",
            },
            {
              title: "Base64 Encode",
              url: "chainlink-nodes/oracle-jobs/task-types/task_base64encode",
            },
            {
              title: "Uppercase",
              url: "chainlink-nodes/oracle-jobs/task-types/task_uppercase",
            },
            {
              title: "Lowercase",
              url: "chainlink-nodes/oracle-jobs/task-types/task_lowercase",
            },
          ],
        },
      ],
    },
    {
      section: "EXTERNAL ADAPTERS",
      contents: [
        {
          title: "Introduction",
          url: "chainlink-nodes/external-adapters/external-adapters",
        },
        {
          title: "External Adapters in Solidity",
          url: "chainlink-nodes/external-adapters/contract-creators",
        },
        {
          title: "Building External Adapters",
          url: "chainlink-nodes/external-adapters/developers",
        },
        {
          title: "Bridges: Adding External Adapters to Nodes",
          url: "chainlink-nodes/external-adapters/node-operators",
        },
      ],
    },
    {
      section: "EXTERNAL INITIATORS",
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
  ],
  legacy: [
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
    {
      section: "v1 JSON JOBS [REMOVED]",
      contents: [
        {
          title: "Job Specifications",
          url: "chainlink-nodes/oracle-jobs/v1/job-specifications",
        },
        {
          title: "Core Adapters",
          url: "chainlink-nodes/oracle-jobs/v1/adapters",
        },
        {
          title: "Initiators",
          url: "chainlink-nodes/oracle-jobs/v1/initiators",
        },
      ],
    },
  ],
}
