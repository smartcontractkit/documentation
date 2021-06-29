export const NETWORKS = [
  {
    page: "ethereum-addresses",
    title: "Ethereum Price Feeds",
    networks: [
      {
        name: "Ethereum Mainnet",
        url: "https://etherscan.io/address/",
        source: "directory.json",
      },
      {
        name: "Kovan Testnet",
        url: "https://kovan.etherscan.io/address/",
        source: "directory-kovan.json",
      },
      {
        name: "Rinkeby Testnet",
        url: "https://rinkeby.etherscan.io/address/",
        source: "directory-rinkeby.json",
      },
    ],
  },
  {
    page: "binance-smart-chain-addresses-price",
    title: "Binance Smart Chain Price Feeds",
    networks: [
      {
        name: "BSC Mainnet",
        url: "https://bscscan.com/address/",
        source: "directory-bsc-mainnet.json",
      },
      {
        name: "BSC Testnet",
        url: "https://testnet.bscscan.com/address/",
        source: "directory-bsc-testnet.json",
      },
    ],
  },
  {
    page: "matic-addresses",
    title: "Polygon (Matic) Price Feeds",
    networks: [
      {
        name: "Polygon Mainnet",
        url: "https://explorer-mainnet.maticvigil.com/address/",
        source: "directory-matic-mainnet.json",
      },
      {
        name: "Mumbai Testnet",
        url: "https://explorer-mumbai.maticvigil.com/address/",
        source: "directory-matic-testnet.json",
      },
    ],
  },
  {
    page: "xdai-price-feeds",
    title: "xDai Price Feeds",
    networks: [
      {
        name: "xDai Mainnet",
        url: "https://blockscout.com/poa/xdai/address/",
        source: "directory-xdai-mainnet.json",
      },
    ],
  },
  {
    page: "huobi-eco-chain-price-feeds",
    title: "Huobi Eco Chain Price Feeds",
    networks: [
      {
        name: "Huobi Mainnet",
        url: "https://hecoinfo.com/address/",
        source: "directory-heco-mainnet.json",
      },
    ],
  },
  {
    page: "avalanche-price-feeds",
    title: "Avalanche Price Feeds",
    networks: [
      {
        name: "Avalanche Testnet",
        url: "https://testnet.avascan.info/blockchain/c/address/",
        source: "directory-avalanche-fuji-testnet.json",
      },
    ],
  },
  {
    page: "fantom-price-feeds",
    title: "Fantom Testnet",
    networks: [
      {
        name: "Fantom Testnet",
        url: "https://explorer.testnet.fantom.network/address/",
        source: "directory-fantom-testnet.json",
      },
    ],
  },
];
