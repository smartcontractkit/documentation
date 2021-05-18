module.exports = {
  navigation: {
    nodeOperator: [
      {
        section: 'NODE OPERATORS',
        contents: [
          { url: '/docs/node-operator-overview/', title: 'Overview' },
          {
            url: '/docs/running-a-chainlink-node/',
            title: 'Running a Chainlink Node',
          },
          { url: '/docs/fulfilling-requests/', title: 'Fulfilling Requests' },
          {
            url: '/docs/run-an-ethereum-client/',
            title: 'Run an Ethereum Client',
          },
          {
            url: '/docs/performing-system-maintenance/',
            title: 'Performing System Maintenance',
          },
          {
            url: '/docs/connecting-to-a-remote-database/',
            title: 'Connecting to a Remote Database',
          },
          {
            url: '/docs/configuration-variables/',
            title: 'Configuration Variables',
          },
          {
            url: '/docs/enabling-https-connections/',
            title: 'Enabling HTTPS Connections',
          },
          { url: '/docs/miscellaneous/', title: 'Miscellaneous' },
          {
            url: '/docs/best-security-practices/',
            title: 'Best Security and Operating Practices',
          },
          { url: '/docs/fluxaggregator-uses/', title: 'FluxAggregator Uses' },
        ],
      },
      {
        section: 'ORACLE JOBS',
        contents: [
          { url: '/docs/job-specifications/', title: 'Job Specifications' },
          { url: '/docs/adapters/', title: 'Core Adapters' },
          { url: '/docs/initiators/', title: 'Initiators' },
        ],
      },
      {
        section: 'EXTERNAL ADAPTERS',
        contents: [
          { url: '/docs/external-adapters/', title: 'Introduction' },
          {
            url: '/docs/contract-creators/',
            title: 'External Adapters in Solidity',
          },
          { url: '/docs/developers/', title: 'Building External Adapters' },
          {
            url: '/docs/node-operators/',
            title: 'Bridges: Adding External Adapters to Nodes',
          },
        ],
      },
      {
        section: 'EXTERNAL INITIATORS',
        contents: [
          {
            url: '/docs/external-initiators-introduction/',
            title: 'Introduction',
          },
          {
            url: '/docs/building-external-initiators/',
            title: 'Building External Initiators',
          },
          {
            url: '/docs/external-initiators-in-nodes/',
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
            url: '/docs/tutorials/',
            children: [
              {
                title: 'Beginners - The Basics',
                url: '/docs/beginners-tutorial/',
              },
              {
                title: 'Intermediates - Random Numbers',
                url: '/docs/intermediates-tutorial/',
              },
              {
                title: 'Advanced - API Calls',
                url: '/docs/advanced-tutorial/',
              },
            ],
          },
          {
            title: 'Architecture Overview',
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
        ],
      },
      {
        section: 'USING PRICE FEEDS',
        contents: [
          {
            title: 'Introduction to Price Feeds',
            url: '/docs/using-chainlink-reference-contracts/',
          },
          { title: 'Get the Latest Price', url: '/docs/get-the-latest-price/' },
          { title: 'Historical Price Data', url: '/docs/historical-price-data/' },
          {
            title: 'API Reference',
            url: '/docs/price-feeds-api-reference/',
          },
          {
            title: 'Contract Addresses',
            url: '/docs/reference-contracts/',
            children: [
              { title: 'ENS', url: '/docs/ens/' },
              {
                title: 'Ethereum Price Feeds',
                url: '/docs/ethereum-addresses/',
              },
              {
                title: 'Binance Smart Chain Price Feeds',
                url:
                  '/docs/binance-smart-chain-addresses/',
              },
              {
                title: 'Polygon (Matic) Price Feeds',
                url: '/docs/matic-addresses/',
              },
              {
                title: 'xDai Price Feeds',
                url: '/docs/xdai-price-feeds/',
              },
              {
                title: 'Huobi Eco Chain Price Feeds',
                url: '/docs/huobi-eco-chain-price-feeds/',
              },
              {
                title: 'Avalanche Price Feeds',
                url: '/docs/avalanche-price-feeds/',
              },
            ],
          },
        ],
      },
      {
        section: 'USING RANDOMNESS',
        contents: [
          { title: 'Introduction to Chainlink VRF', url: '/docs/chainlink-vrf/' },
          { title: 'Get a Random Number', url: '/docs/get-a-random-number/' },
          { title: 'API Reference', url: '/docs/chainlink-vrf-api-reference/' },
          { title: 'Security Considerations', url: '/docs/vrf-security-considerations/' },
          { title: 'Contract Addresses', url: '/docs/vrf-contracts/' },
        ],
      },
      {
        section: 'USING CHAINLINK KEEPERS',
        contents: [
          { title: 'Introduction', url: '/docs/chainlink-keepers/introduction/' },
          { title: 'Making Compatible Contracts', url: '/docs/chainlink-keepers/compatible-contracts/' },
          { title: 'Register Upkeep for a Contract', url: '/docs/chainlink-keepers/register-upkeep/' },
          { title: 'Network Overview', url: '/docs/chainlink-keepers/overview/' },
        ],
      },
      {
        section: 'USING ANY API',
        contents: [
          {
            title: 'Introduction to Using Any API',
            url: '/docs/request-and-receive-data/',
          },
          { title: 'Make a GET Request', url: '/docs/make-a-http-get-request/' },
          {
            title: 'Make an Existing Job Request',
            url: '/docs/existing-job-request/',
          },
          { title: 'Find Existing Jobs', url: '/docs/listing-services/' },
          { title: 'API Reference', url: '/docs/chainlink-framework/' },
          {
            title: 'Contract Addresses',
            url: '/docs/decentralized-oracles-ethereum-mainnet/',
          },
        ],
      },
      {
        section: 'DEVELOPER REFERENCE',
        contents: [
          {
            title: 'Install Instructions',
            url: '/docs/create-a-chainlinked-project/',
          },
          { title: 'LINK Token Contracts', url: '/docs/link-token-contracts/' },
          {
            title: 'Developer Communications',
            url: '/docs/developer-communications/',
          },
          { title: 'Hackathon Resources', url: '/docs/hackathon-resources/' },
          {
            title: 'User Guides',
            url: '/docs/user-guides/',
            children: [
              {
                title: 'Install, configure & fund MetaMask',
                url: '/docs/install-metamask/',
              },
              {
                title: 'Acquire testnet LINK',
                url: '/docs/acquire-link/',
              },
              {
                title: 'Deploy your first contract',
                url: '/docs/deploy-your-first-contract/',
              },
              {
                title: 'Fund your contract',
                url: '/docs/fund-your-contract/',
              },
              {
                title: 'Use your first contract!',
                url: '/docs/use-your-first-contract/',
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
            url: '/docs/data-provider-nodes'
          },
          {
            title: 'Data Provider Nodes List',
            url: '/docs/data-provider-nodes-list'
          }
        ],
      },
    ],
  },
}
