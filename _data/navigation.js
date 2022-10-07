module.exports = {
  navigation: {
    gettingStarted: [
      {
        section: 'Getting Started',
        contents: [
          {
            title: 'Overview',
            url: '/docs/conceptual-overview/',
          },
          {
            title: 'Deploy Your First Contract',
            url: '/docs/deploy-your-first-contract/',
          },
          {
            title: 'Consuming Data Feeds',
            url: '/docs/consuming-data-feeds/',
          },
          {
            title: 'Get Random Numbers',
            url: '/docs/intermediates-tutorial/',
          },
          {
            title: 'API Calls',
            url: '/docs/advanced-tutorial/',
          },
        ],
      },
      {
        section: 'Resources',
        contents: [
          {
            title: 'Videos and Tutorials',
            url: '/docs/other-tutorials/',
          },
        ],
      },
      {
        section: 'Next Steps',
        contents: [
          {
            title: 'Chainlink Architecture',
            url: '/docs/architecture-overview/',
          },
          {
            title: 'Data Feeds',
            url: '/docs/data-feeds/',
          },
          {
            title: 'Chainlink VRF',
            url: '/docs/vrf/v2/introduction/',
          },
          {
            title: 'Chainlink Automation',
            url: '/docs/chainlink-automation/introduction/',
          },
          {
            title: 'Connect to Public API Data',
            url: '/docs/any-api/introduction/',
          },
          {
            title: 'Run a Chainlink Node',
            url: '/chainlink-nodes/',
          },
        ],
      },
    ],
    ethereum: [
      {
        section: 'Overview',
        contents: [
          {
            title: 'Chainlink Architecture',
            url: '/docs/architecture-overview/',
            children: [
              {
                title: 'Basic Request Model',
                url: '/docs/architecture-request-model/',
              },
              {
                title: 'Decentralized Data Model',
                url: '/docs/architecture-decentralized-model/',
              },
              {
                title: 'Off-Chain Reporting',
                url: '/docs/off-chain-reporting/',
              },
            ],
          },
          {
            title: 'Ethereum Proof-of-Stake Merge',
            url: '/docs/ethereum-proof-of-stake-merge/',
          },
        ],
      },
      {
        section: 'DATA FEEDS',
        contents: [
          {
            title: 'Introduction to Data Feeds',
            url: '/docs/data-feeds/',
          },
          {
            title: 'Price Feeds',
            url: '/docs/data-feeds/price-feeds/',
            children: [
              {
                title: 'Historical Price Data',
                url: '/docs/data-feeds/price-feeds/historical-data/',
              },
              {
                title: 'Price Feeds API Reference',
                url: '/docs/data-feeds/price-feeds/api-reference/',
              },
              {
                title: 'Contract Addresses',
                url: '/docs/data-feeds/price-feeds/addresses/',
              },
            ],
          },
          {
            title: 'Proof of Reserve Feeds',
            url: '/docs/data-feeds/proof-of-reserve/',
            children: [
              {
                title: 'Contract Addresses',
                url: '/docs/data-feeds/proof-of-reserve/addresses/',
              },
            ],
          },
          {
            title: 'NFT Floor Pricing Feeds',
            url: '/docs/data-feeds/nft-floor-price/',
            children: [
              {
                title: 'Contract Addresses',
                url: '/docs/data-feeds/nft-floor-price/addresses/',
              },
            ],
          },
          {
            title: 'L2 Sequencer Uptime Feeds',
            url: '/docs/data-feeds/l2-sequencer-feeds/',
          },
          {
            title: 'Using ENS with Data Feeds',
            url: '/docs/data-feeds/ens/',
          },
          {
            title: 'Feed Registry',
            url: '/docs/data-feeds/feed-registry/',
            children: [
              {
                title: 'Feed Registry API Reference',
                url: '/docs/data-feeds/feed-registry/feed-registry-functions/',
              },
            ],
          },
          {
            title: 'Selecting Data Feeds',
            url: '/docs/data-feeds/selecting-data-feeds/',
          },
        ],
      },
      {
        section: 'USING RANDOMNESS',

        contents: [
          {
            title: 'Introduction to Chainlink VRF',
            url: '/docs/vrf/v2/introduction/',
          },
          {
            title: 'Subscription Method',
            url: '/docs/vrf/v2/subscription/',
            children: [
              {
                title: 'Get a Random Number',
                url: '/docs/vrf/v2/subscription/examples/get-a-random-number/',
              },
              {
                title: 'Programmatic Subscription',
                url: '/docs/vrf/v2/subscription/examples/programmatic-subscription/',
              },
              {
                title: 'Subscription Manager UI',
                url: '/docs/vrf/v2/subscription/ui/',
              },
              {
                title: 'Supported Networks',
                url: '/docs/vrf/v2/subscription/supported-networks/',
              },
              {
                title: 'Migrating from VRF v1',
                url: '/docs/vrf/v2/subscription/migration-from-v1/',
              },
            ],
          },
          {
            title: 'Direct Funding Method',
            url: '/docs/vrf/v2/direct-funding/',
            children: [
              {
                title: 'Get a Random Number',
                url: '/docs/vrf/v2/direct-funding/examples/get-a-random-number/',
              },
              {
                title: 'Supported Networks',
                url: '/docs/vrf/v2/direct-funding/supported-networks/',
              },
              {
                title: 'Migrating from VRF v1',
                url: '/docs/vrf/v2/direct-funding/migration-from-v1/',
              },
            ],
          },
          {
            title: 'Security Considerations',
            url: '/docs/vrf/v2/security/',
          },
          {
            title: 'Best Practices',
            url: '/docs/vrf/v2/best-practices/',
          },
        ],
      },
      {
        section: 'Connect to any API',
        contents: [
          {
            title: 'Introduction to Using Any API',
            url: '/docs/any-api/introduction/',
          },
          {
            title: 'Make a GET Request',
            url: '/docs/any-api/get-request/introduction/',
            children: [
              {
                title: 'Single Word Response',
                url: '/docs/any-api/get-request/examples/single-word-response/',
              },
              {
                title: 'Multi-Variable Responses',
                url: '/docs/any-api/get-request/examples/multi-variable-responses/',
              },
              {
                title: 'Array Response',
                url: '/docs/any-api/get-request/examples/api-array-response/',
              },
              {
                title: 'Large Responses',
                url: '/docs/any-api/get-request/examples/large-responses/',
              },
              {
                title: 'Existing Job Request',
                url: '/docs/any-api/get-request/examples/existing-job-request/',
              },
            ],
          },
          {
            title: 'Find Existing Jobs',
            url: '/docs/any-api/find-oracle/',
          },
          {
            title: 'Testnet Oracles',
            url: '/docs/any-api/testnet-oracles/',
          },
          {
            title: 'Data Provider Nodes',
            url: '/docs/any-api/data-providers/introduction/',
          },
          {
            title: 'API Reference',
            url: '/docs/any-api/api-reference/',
          },
        ],
      },
      {
        section: 'AUTOMATE CONTRACTS',
        contents: [
          {
            title: 'Introduction to Chainlink Automation',
            url: '/docs/chainlink-automation/introduction/',
          },
          {
            title: 'Time-based Automation',
            url: '/docs/chainlink-automation/job-scheduler/',
          },
          {
            title: 'Custom Logic Automation',
            url: '/docs/chainlink-automation/register-upkeep/',
          },
          {
            title: 'Create Compatible Contracts',
            url: '/docs/chainlink-automation/compatible-contracts/',
          },

          {
            title: 'Manage your Upkeeps',
            url: '/docs/chainlink-automation/manage-upkeeps/',
          },
          {
            title: 'Creating Flexible Upkeeps',
            url: '/docs/chainlink-automation/flexible-upkeeps/',
          },
          {
            title: 'Example Contracts',
            url: '/docs/chainlink-automation/util-overview/',
            children: [
              {
                title: 'EthBalanceMonitor',
                url: '/docs/chainlink-automation/utility-contracts/',
              },
            ],
          },
          {
            title: 'Automation Architecture',
            url: '/docs/chainlink-automation/overview/',
          },
          {
            title: 'Supported Networks',
            url: '/docs/chainlink-automation/supported-networks/',
          },
          {
            title: 'Automation Pricing',
            url: '/docs/chainlink-automation/automation-economics/',
          },
          {
            title: 'Automation Release Notes',
            url: '/docs/chainlink-automation/automation-release-notes/',
          },
          {
            title: 'FAQs',
            url: '/docs/chainlink-automation/faqs/',
          },
        ],
      },
      {
        section: 'Resources',
        contents: [
          {
            title: 'Videos and Tutorials',
            url: '/docs/other-tutorials/',
          },
          {
            title: 'Acquire testnet LINK',
            url: '/docs/acquire-link/',
          },
          {
            title: 'Fund Your Contracts',
            url: '/docs/fund-your-contract/',
          },
          {
            title: 'Install Frameworks',
            url: '/docs/create-a-chainlinked-project/',
          },
          {
            title: 'LINK Token Contracts',
            url: '/docs/link-token-contracts/',
          },
          {
            title: 'Developer Communications',
            url: '/docs/developer-communications/',
          },
          {
            title: 'Getting Help',
            url: '/docs/getting-help/',
          },
          {
            title: 'Hackathon Resources',
            url: '/docs/hackathon-resources/',
          },
          {
            title: 'Contributing to Chainlink',
            url: '/docs/contributing-to-chainlink/',
          },
        ],
      },
    ],
    solana: [
      {
        section: 'Solana',
        contents: [
          {
            title: 'Overview',
            url: '/docs/solana/',
          },
        ],
      },
      {
        section: 'Data Feeds',
        contents: [
          {
            title: 'Using Data Feeds Off-Chain',
            url: '/docs/solana/using-data-feeds-off-chain/',
          },
          {
            title: 'Using Data Feeds On-Chain',
            url: '/docs/solana/using-data-feeds-solana/',
          },
          {
            title: 'Data Feed Addresses',
            url: '/docs/solana/data-feeds-solana/',
          },
        ],
      },
      {
        section: 'Resources',
        contents: [
          {
            title: 'Getting Help',
            url: '/docs/getting-help/',
          },
          {
            title: 'Selecting Data Feeds',
            url: '/docs/data-feeds/selecting-data-feeds/',
          },
          {
            title: 'Contributing to Chainlink',
            url: '/docs/contributing-to-chainlink/',
          },
        ],
      },
    ],
    nodeOperator: [
      {
        section: 'NODE OPERATORS',
        contents: [
          {
            title: 'Node Versions',
            url: '/docs/node-versions/',
          },
          {
            title: 'Running a Chainlink Node',
            url: '/docs/running-a-chainlink-node/',
            children: [
              {
                title: 'Run an Ethereum Client',
                url: '/docs/run-an-ethereum-client/',
              },
            ],
          },
          {
            title: 'Fulfilling Requests',
            url: '/docs/fulfilling-requests/',
          },
          {
            title: 'Performing System Maintenance',
            url: '/docs/performing-system-maintenance/',
          },
          {
            title: 'Connecting to a Remote Database',
            url: '/docs/connecting-to-a-remote-database/',
          },
          {
            title: 'Configuring Nodes',
            url: '/docs/configuration-variables/',
          },
          {
            title: 'Enabling HTTPS Connections',
            url: '/docs/enabling-https-connections/',
          },
          {
            title: 'Security and Operation Best Practices',
            url: '/docs/best-security-practices/',
          },
          {
            title: 'Optimizing EVM Performance',
            url: '/docs/evm-performance-configuration/',
          },
          {
            title: 'Best Practices for Nodes on AWS',
            url: '/docs/best-practices-aws/',
          },
          {
            title: 'Miscellaneous',
            url: '/docs/miscellaneous/',
          },
        ],
      },
      {
        section: 'ORACLE JOBS',
        contents: [
          {
            title: 'Migrating to v2 Jobs',
            url: '/docs/jobs/migration-v1-v2/',
          },
          {
            title: 'Jobs',
            url: '/docs/jobs/',
            children: [
              {
                title: 'Cron',
                url: '/docs/jobs/types/cron/',
              },
              {
                title: 'Direct Request',
                url: '/docs/jobs/types/direct-request/',
              },
              {
                title: 'Flux Monitor',
                url: '/docs/jobs/types/flux-monitor/',
              },
              {
                title: 'Keeper',
                url: '/docs/jobs/types/keeper/',
              },
              {
                title: 'Off-chain Reporting',
                url: '/docs/jobs/types/offchain-reporting/',
              },
              {
                title: 'Webhook',
                url: '/docs/jobs/types/webhook/',
              },
            ],
          },
          {
            url: '/docs/tasks/',
            title: 'Tasks',
            children: [
              {
                title: 'Job Pipelines',
                url: '/docs/jobs/task-types/pipelines/',
              },
              {
                title: 'HTTP',
                url: '/docs/jobs/task-types/http/',
              },
              {
                title: 'Bridge',
                url: '/docs/jobs/task-types/bridge/',
              },
              {
                title: 'JSON Parse',
                url: '/docs/jobs/task-types/jsonparse/',
              },
              {
                title: 'CBOR Parse',
                url: '/docs/jobs/task-types/cborparse/',
              },
              {
                title: 'ETH ABI Decode',
                url: '/docs/jobs/task-types/eth-abi-decode/',
              },
              {
                title: 'ETH ABI Decode Log',
                url: '/docs/jobs/task-types/eth-abi-decode-log/',
              },
              {
                title: 'ETH ABI Encode',
                url: '/docs/jobs/task-types/eth-abi-encode/',
              },
              {
                title: 'ETH Call',
                url: '/docs/jobs/task-types/eth-call/',
              },
              {
                title: 'ETH Tx',
                url: '/docs/jobs/task-types/eth-tx/',
              },
              {
                title: 'Multiply',
                url: '/docs/jobs/task-types/multiply/',
              },
              {
                title: 'Divide',
                url: '/docs/jobs/task-types/divide/',
              },
              {
                title: 'Any',
                url: '/docs/jobs/task-types/any/',
              },
              {
                title: 'Mean',
                url: '/docs/jobs/task-types/mean/',
              },
              {
                title: 'Median',
                url: '/docs/jobs/task-types/median/',
              },
              {
                title: 'Mode',
                url: '/docs/jobs/task-types/mode/',
              },
              {
                title: 'Sum',
                url: '/docs/jobs/task-types/sum/',
              },
              {
                title: 'Hex Decode',
                url: '/docs/jobs/task-types/hexdecode/',
              },
              {
                title: 'Hex Encode',
                url: '/docs/jobs/task-types/hexencode/',
              },
              {
                title: 'Base64 Decode',
                url: '/docs/jobs/task-types/base64decode/',
              },
              {
                title: 'Base64 Encode',
                url: '/docs/jobs/task-types/base64encode/',
              },
              {
                title: 'Uppercase',
                url: '/docs/jobs/task-types/uppercase/',
              },
              {
                title: 'Lowercase',
                url: '/docs/jobs/task-types/lowercase/',
              },
            ],
          },
        ],
      },
      {
        section: 'EXTERNAL ADAPTERS',
        contents: [
          {
            title: 'Introduction',
            url: '/docs/external-adapters/',
          },
          {
            title: 'External Adapters in Solidity',
            url: '/docs/contract-creators/',
          },
          {
            title: 'Building External Adapters',
            url: '/docs/developers/',
          },
          {
            title: 'Bridges: Adding External Adapters to Nodes',
            url: '/docs/node-operators/',
          },
        ],
      },
      {
        section: 'EXTERNAL INITIATORS',
        contents: [
          {
            title: 'Introduction',
            url: '/docs/external-initiators-introduction/',
          },
          {
            title: 'Building External Initiators',
            url: '/docs/building-external-initiators/',
          },
          {
            title: 'Adding External Initiators to Nodes',
            url: '/docs/external-initiators-in-nodes/',
          },
        ],
      },
    ],
    legacy: [
      {
        section: 'VRF v1 [DEPRECATED]',
        contents: [
          {
            title: 'Introduction to Chainlink VRF',
            url: '/docs/vrf/v1/introduction/',
          },
          {
            title: 'Get a Random Number',
            url: '/docs/vrf/v1/examples/get-a-random-number/',
          },
          {
            title: 'Security Considerations',
            url: '/docs/vrf/v1/security/',
          },
          {
            title: 'Best Practices',
            url: '/docs/vrf/v1/best-practices/',
          },
          {
            title: 'Supported Networks',
            url: '/docs/vrf/v1/supported-networks/',
          },
          {
            title: 'API Reference',
            url: '/docs/vrf/v1/api-reference/',
          },
        ],
      },
      {
        section: 'v1 JSON JOBS [REMOVED]',
        contents: [
          {
            title: 'Job Specifications',
            url: '/docs/job-specifications/',
          },
          {
            title: 'Core Adapters',
            url: '/docs/core-adapters/',
          },
          {
            title: 'Initiators',
            url: '/docs/initiators/',
          },
        ],
      },
    ],
  },
};
