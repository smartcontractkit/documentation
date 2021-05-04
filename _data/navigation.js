module.exports = {
  navigation: {
    nodeOperator: [
      {
        section: 'NODE OPERATORS',
        contents: [
          { url: 'node-operator-overview', title: 'Overview' },
          {
            url: 'running-a-chainlink-node',
            title: 'Running a Chainlink Node',
          },
          { url: 'fulfilling-requests', title: 'Fulfilling Requests' },
          {
            url: 'run-an-ethereum-client',
            title: 'Run an Ethereum Client',
          },
          {
            url: 'performing-system-maintenance',
            title: 'Performing System Maintenance',
          },
          {
            url: 'connecting-to-a-remote-database',
            title: 'Connecting to a Remote Database',
          },
          {
            url: 'configuration-variables',
            title: 'Configuration Variables',
          },
          {
            url: 'enabling-https-connections',
            title: 'Enabling HTTPS Connections',
          },
          { url: 'miscellaneous', title: 'Miscellaneous' },
          {
            url: 'best-security-practices',
            title: 'Best Security and Operating Practices',
          },
          { url: 'fluxaggregator-uses', title: 'FluxAggregator Uses' },
        ],
      },
      {
        section: 'ORACLE JOBS',
        contents: [
          { url: 'job-specifications', title: 'Job Specifications' },
          { url: 'adapters', title: 'Core Adapters' },
          { url: 'initiators', title: 'Initiators' },
        ],
      },
      {
        section: 'EXTERNAL ADAPTERS',
        contents: [
          { url: 'external-adapters', title: 'Introduction' },
          {
            url: 'contract-creators',
            title: 'External Adapters in Solidity',
          },
          { url: 'developers', title: 'Building External Adapters' },
          {
            url: 'node-operators',
            title: 'Bridges: Adding External Adapters to Nodes',
          },
        ],
      },
      {
        section: 'EXTERNAL INITIATORS',
        contents: [
          {
            url: 'external-initiators-introduction',
            title: 'Introduction',
          },
          {
            url: 'building-external-initiators',
            title: 'Building External Initiators',
          },
          {
            url: 'external-initiators-in-nodes',
            title: 'Adding External Initiators to Nodes',
          },
        ],
      },
    ],
    smartContract: [
      {
        section: 'INTRODUCTION',
        contents: [
          {
            title: 'Tutorials',
            url: 'tutorials',
            children: [
              {
                title: 'Beginners - The Basics',
                url: 'beginners-tutorial',
              },
              {
                title: 'Intermediates - Random Numbers',
                url: 'intermediates-tutorial',
              },
              {
                title: 'Advanced - API Calls',
                url: 'advanced-tutorial',
              },
            ],
          },
          {
            title: 'Architecture Overview',
            url: 'architecture-overview',
            children: [
              {
                title: 'Basic Request Model',
                url: 'architecture-request-model',
              },
              {
                title: 'Decentralized Data Model',
                url:
                  'architecture-decentralized-model',
              },
              {
                title: 'Off-Chain Reporting',
                url: 'off-chain-reporting',
              },
            ],
          },
        ],
      },
      {
        section: 'USING PRICE FEEDS',
        contents: [
          {
            title: 'Introduction to Price Feeds',
            url: 'using-chainlink-reference-contracts',
          },
          { title: 'Get the Latest Price', url: 'get-the-latest-price' },
          { title: 'Historical Price Data', url: 'historical-price-data' },
          {
            title: 'API Reference',
            url: 'price-feeds-api-reference',
            children: [],
          },
          {
            title: 'Contract Addresses',
            url: 'reference-contracts',
            children: [
              { title: 'ENS', url: 'ens' },
              {
                title: 'Ethereum Price Feeds',
                url: 'ethereum-addresses',
              },
              {
                title: 'Binance Smart Chain Price Feeds',
                url:
                  'binance-smart-chain-addresses',
              },
              {
                title: 'Polygon (Matic) Price Feeds',
                url: 'matic-addresses',
              },
              {
                title: 'xDai Price Feeds',
                url: 'xdai-price-feeds',
              },
              {
                title: 'Huobi Eco Chain Price Feeds',
                url: 'huobi-eco-chain-price-feeds',
              },
            ],
          },
        ],
      },
      {
        section: 'USING RANDOMNESS',
        contents: [
          { title: 'Introduction to Chainlink VRF', url: 'chainlink-vrf' },
          { title: 'Get a Random Number', url: 'get-a-random-number' },
          { title: 'API Reference', url: 'chainlink-vrf-api-reference' },
          { title: 'Contract Addresses', url: 'vrf-contracts' },
        ],
      },
      {
        section: 'USING ANY API',
        contents: [
          {
            title: 'Introduction to Using Any API',
            url: 'request-and-receive-data',
          },
          { title: 'Make a GET Request', url: 'make-a-http-get-request' },
          {
            title: 'Make an Existing Job Request',
            url: 'existing-job-request',
          },
          { title: 'Find Existing Jobs', url: 'listing-services' },
          { title: 'API Reference', url: 'chainlink-framework' },
          {
            title: 'Contract Addresses',
            url: 'decentralized-oracles-ethereum-mainnet',
          },
        ],
      },
      {
        section: 'DEVELOPER REFERENCE',
        contents: [
          {
            title: 'Install Instructions',
            url: 'create-a-chainlinked-project',
          },
          { title: 'LINK Token Contracts', url: 'link-token-contracts' },
          {
            title: 'Developer Communications',
            url: 'developer-communications',
          },
          { title: 'Hackathon Resources', url: 'hackathon-resources' },
          {
            title: 'User Guides',
            url: 'user-guides',
            children: [
              {
                title: 'Install, configure & fund MetaMask',
                url: 'install-metamask',
              },
              {
                title: 'Acquire testnet LINK',
                url: 'acquire-link',
              },
              {
                title: 'Deploy your first contract',
                url: 'deploy-your-first-contract',
              },
              {
                title: 'Fund your contract',
                url: 'fund-your-contract',
              },
              {
                title: 'Use your first contract!',
                url: 'use-your-first-contract',
              },
            ],
          },
        ],
      },
      {
        section: 'DATA PROVIDER NODES',
        contents: [
          {
            title: 'Introduction to Data Provider Nodes',
            url: 'data-provider-nodes'
          },
          {
            title: 'Data Provider Nodes List',
            url: 'data-provider-nodes-list'
          }
        ],
      },
    ],
  },
}
