export const NETWORKS = [
  {
    page: "ethereum",
    title: "Ethereum Data Feeds",
    networkStatusUrl: "https://ethstats.net/",
    networks: [
      {
        name: "Ethereum Mainnet",
        url: "https://etherscan.io/address/%s",
        source: "directory.json",
        networkType: "mainnet",
      },
      {
        name: "Goerli Testnet",
        url: "https://goerli.etherscan.io/address/%s",
        source: "directory-goerli.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "bnb-chain",
    title: "BNB Chain Data Feeds",
    networkStatusUrl: "https://bscscan.freshstatus.io/",
    networks: [
      {
        name: "BNB Chain Mainnet",
        url: "https://bscscan.com/address/%s",
        source: "directory-bsc-mainnet.json",
        networkType: "mainnet",
      },
      {
        name: "BNB Chain Testnet",
        url: "https://testnet.bscscan.com/address/%s",
        source: "directory-bsc-testnet.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "polygon",
    title: "Polygon (Matic) Data Feeds",
    networkStatusUrl: "https://polygon.io/system",
    networks: [
      {
        name: "Polygon Mainnet",
        url: "https://polygonscan.com/address/%s",
        source: "directory-matic-mainnet.json",
        networkType: "mainnet",
      },
      {
        name: "Mumbai Testnet",
        url: "https://mumbai.polygonscan.com/address/%s",
        source: "directory-matic-testnet.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "gnosis-chain",
    title: "Gnosis Chain (xDai) Data Feeds",
    networkStatusUrl: "https://blockscout.com/xdai/mainnet/",
    networks: [
      {
        name: "Gnosis Chain Mainnet",
        url: "https://blockscout.com/poa/xdai/address/%s",
        source: "directory-xdai-mainnet.json",
        networkType: "mainnet",
      },
    ],
  },
  {
    page: "heco-chain",
    title: "HECO Chain Data Feeds",
    networkStatusUrl: "https://hecoinfo.com/",
    networks: [
      {
        name: "HECO Mainnet",
        url: "https://hecoinfo.com/address/%s",
        source: "directory-heco-mainnet.json",
        networkType: "mainnet",
      },
    ],
  },
  {
    page: "avalanche",
    title: "Avalanche Data Feeds",
    networkStatusUrl: "https://status.avax.network/",
    networks: [
      {
        name: "Avalanche Mainnet",
        url: "https://snowtrace.io/address/%s",
        source: "directory-avalanche-mainnet.json",
        networkType: "mainnet",
      },
      {
        name: "Avalanche Testnet",
        url: "https://testnet.snowtrace.io/address/%s",
        source: "directory-avalanche-fuji-testnet.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "fantom",
    title: "Fantom Testnet",
    networkStatusUrl: "https://ftmscan.com/",
    networks: [
      {
        name: "Fantom Mainnet",
        url: "https://ftmscan.com/address/%s",
        source: "directory-fantom-mainnet.json",
        networkType: "mainnet",
      },
      {
        name: "Fantom Testnet",
        url: "https://testnet.ftmscan.com/address/%s",
        source: "directory-fantom-testnet.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "arbitrum",
    title: "Arbitrum Data Feeds",
    networkStatusUrl: "https://arbiscan.freshstatus.io/",
    networks: [
      {
        name: "Arbitrum Mainnet",
        url: "https://arbiscan.io/address/%s",
        source: "directory-ethereum-mainnet-arbitrum-1.json",
        networkType: "mainnet",
      },
      {
        name: "Arbitrum Goerli",
        url: "https://goerli-rollup-explorer.arbitrum.io/address/%s",
        source: "directory-ethereum-testnet-goerli-arbitrum-1.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "harmony",
    title: "Harmony Data Feeds",
    networkStatusUrl: "https://status.harmony.one/",
    networks: [
      {
        name: "Harmony Mainnet",
        url: "https://explorer.harmony.one/#/address/%s",
        source: "directory-harmony-mainnet-0.json",
        networkType: "mainnet",
      },
    ],
  },
  {
    page: "solana",
    title: "Solana Data Feeds",
    networkStatusUrl: "https://status.solana.com/",
    networks: [
      {
        name: "Solana Mainnet",
        url: "https://solscan.io/account/%s",
        source: "directory-solana-mainnet.json",
        networkType: "mainnet",
      },
      {
        name: "Solana Devnet",
        url: "https://solscan.io/account/%s?cluster=devnet",
        source: "directory-solana-devnet.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "optimism",
    title: "Optimism Data Feeds",
    networkStatusUrl: "https://status.optimism.io/",
    networks: [
      {
        name: "Optimism Mainnet",
        url: "https://optimistic.etherscan.io/address/%s",
        source: "directory-ethereum-mainnet-optimism-1.json",
        networkType: "mainnet",
      },
      {
        name: "Optimism Goerli",
        url: "https://goerli-optimism.etherscan.io/address/%s",
        source: "directory-ethereum-testnet-goerli-optimism-1.json",
        networkType: "testnet",
      },
    ],
  },
  {
    page: "moonriver",
    title: "Moonriver Data Feeds",
    networkStatusUrl: "https://moonscan.freshstatus.io/",
    networks: [
      {
        name: "Moonriver Mainnet",
        url: "https://moonriver.moonscan.io/address/%s",
        source: "directory-kusama-mainnet-moonriver.json",
        networkType: "mainnet",
      },
    ],
  },
  {
    page: "moonbeam",
    title: "Moonbeam Data Feeds",
    networkStatusUrl: "https://moonscan.freshstatus.io/",
    networks: [
      {
        name: "Moonbeam Mainnet",
        url: "https://moonscan.io/address/%s",
        source: "directory-polkadot-mainnet-moonbeam.json",
        networkType: "mainnet",
      },
    ],
  },
  {
    page: "metis",
    title: "Metis Data Feeds",
    networkStatusUrl: "https://andromeda-explorer.metis.io/",
    networks: [
      {
        name: "Metis Mainnet",
        url: "https://andromeda-explorer.metis.io/address/%s",
        source: "directory-ethereum-mainnet-andromeda-1.json",
        networkType: "mainnet",
      },
    ],
  },
  {
    page: "klaytn",
    title: "Klaytn Data Feeds",
    networkStatusUrl: "https://status.klaytnapi.com/",
    networks: [
      {
        name: "Klaytn Baobab testnet",
        url: "https://baobab.scope.klaytn.com/account/%s",
        source: "directory-klaytn-testnet-baobab.json",
        networkType: "testnet",
      },
    ],
  },
];
