export const NETWORKS = [
  {
    page: "ethereum-addresses",
    title: "Ethereum Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Ethereum Mainnet",
        url: "https://etherscan.io/address/%s",
        source: "directory.json",
      },
      {
        name: "Kovan Testnet",
        url: "https://kovan.etherscan.io/address/%s",
        source: "directory-kovan.json",
      },
      {
        name: "Rinkeby Testnet",
        url: "https://rinkeby.etherscan.io/address/%s",
        source: "directory-rinkeby.json",
      },
    ],
  },
  {
    page: "bnb-chain-addresses-price",
    title: "BNB Chain Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "BNB Chain Mainnet",
        url: "https://bscscan.com/address/%s",
        source: "directory-bsc-mainnet.json",
      },
      {
        name: "BNB Chain Testnet",
        url: "https://testnet.bscscan.com/address/%s",
        source: "directory-bsc-testnet.json",
      },
    ],
  },
  {
    page: "matic-addresses",
    title: "Polygon (Matic) Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Polygon Mainnet",
        url: "https://polygonscan.com/address/%s",
        source: "directory-matic-mainnet.json",
      },
      {
        name: "Mumbai Testnet",
        url: "https://mumbai.polygonscan.com/address/%s",
        source: "directory-matic-testnet.json",
      },
    ],
  },
  {
    page: "data-feeds-gnosis-chain",
    title: "Gnosis Chain (xDai) Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Gnosis Chain Mainnet",
        url: "https://blockscout.com/poa/xdai/address/%s",
        source: "directory-xdai-mainnet.json",
      },
    ],
  },
  {
    page: "huobi-eco-chain-price-feeds",
    title: "HECO Chain Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "HECO Mainnet",
        url: "https://hecoinfo.com/address/%s",
        source: "directory-heco-mainnet.json",
      },
    ],
  },
  {
    page: "avalanche-price-feeds",
    title: "Avalanche Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Avalanche Mainnet",
        url: "https://snowtrace.io/address/%s",
        source: "directory-avalanche-mainnet.json",
      },
      {
        name: "Avalanche Testnet",
        url: "https://testnet.snowtrace.io/address/%s",
        source: "directory-avalanche-fuji-testnet.json",
      },
    ],
  },
  {
    page: "fantom-price-feeds",
    title: "Fantom Testnet",
    feedType: "Proxy",
    networks: [
      {
        name: "Fantom Mainnet",
        url: "https://ftmscan.com/address/%s",
        source: "directory-fantom-mainnet.json",
      },
      {
        name: "Fantom Testnet",
        url: "https://testnet.ftmscan.com/address/%s",
        source: "directory-fantom-testnet.json",
      },
    ],
  },
  {
    page: "arbitrum-price-feeds",
    title: "Arbitrum Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Arbitrum Mainnet",
        url: "https://arbiscan.io/address/%s",
        source: "directory-ethereum-mainnet-arbitrum-1.json",
      },
      {
        name: "Arbitrum Rinkeby",
        url: "https://rinkeby-explorer.arbitrum.io/address/%s",
        source: "directory-ethereum-testnet-rinkeby-arbitrum-1.json",
      },
    ],
  },
  {
    page: "harmony-price-feeds",
    title: "Harmony Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Harmony Mainnet",
        url: "https://explorer.harmony.one/#/address/%s",
        source: "directory-harmony-mainnet-0.json",
      },
      {
        name: "Harmony Testnet",
        url: "https://explorer.testnet.harmony.one/#/address/%s",
        source: "directory-harmony-testnet-shard-0.json",
      },
    ],
  },
  {
    page: "data-feeds-solana",
    title: "Solana Data Feeds",
    feedType: "Account",
    networks: [
      {
        name: "Solana Devnet",
        url: "https://solscan.io/account/%s?cluster=devnet",
        source: "directory-solana-devnet.json",
      },
    ],
  },
  {
    page: "optimism-price-feeds",
    title: "Optimism Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Optimism Mainnet",
        url: "https://optimistic.etherscan.io/address/%s",
        source: "directory-ethereum-mainnet-optimism-1.json",
      },
      {
        name: "Optimism Kovan",
        url: "https://kovan-optimistic.etherscan.io/address/%s",
        source: "directory-ethereum-testnet-kovan-optimism-1.json",
      },
    ],
  },
  {
    page: "data-feeds-moonriver",
    title: "Moonriver Data Feeds",
    feedType: "Proxy",
    networks: [
      {
        name: "Moonriver Mainnet",
        url: "https://moonriver.moonscan.io/address/%s",
        source: "directory-kusama-mainnet-moonriver.json",
      },
    ],
  }
];
