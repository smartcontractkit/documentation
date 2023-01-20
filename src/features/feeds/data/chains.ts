import { ChainMetadata } from "../api"

type ChainTags = ("default" | "solana" | "proofOfReserve" | "nftFloorPrice")[]
export interface ChainNetwork {
  name: string
  explorerUrl: string
  networkType: "mainnet" | "testnet"
  rddUrl?: string
  metadata?: ChainMetadata[]
  tags?: ChainTags
}
export interface Chain {
  page: string
  title: string
  img?: string
  networkStatusUrl: string
  networks: ChainNetwork[]
  label?: string
  tags?: ChainTags
}

export const CHAINS: Chain[] = [
  {
    page: "ethereum",
    title: "Ethereum Data Feeds",
    img: "/assets/chains/ethereum.svg",
    networkStatusUrl: "https://ethstats.net/",
    tags: ["default", "proofOfReserve", "nftFloorPrice"],
    networks: [
      {
        name: "Ethereum Mainnet",
        explorerUrl: "https://etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        tags: ["proofOfReserve", "nftFloorPrice"],
      },
      {
        name: "Goerli Testnet",
        explorerUrl: "https://goerli.etherscan.io/address/%s",
        networkType: "testnet",
        tags: ["proofOfReserve", "nftFloorPrice"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-goerli.json",
      },
      {
        name: "Sepolia Testnet",
        explorerUrl: "https://sepolia.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia.json",
      },
    ],
    label: "Ethereum",
  },
  {
    page: "bnb-chain",
    title: "BNB Chain Data Feeds",
    img: "/assets/chains/bnb-chain.svg",
    networkStatusUrl: "https://bscscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "BNB Chain Mainnet",
        explorerUrl: "https://bscscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
      },
      {
        name: "BNB Chain Testnet",
        explorerUrl: "https://testnet.bscscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-testnet.json",
      },
    ],
    label: "BNB Chain",
  },
  {
    page: "polygon",
    title: "Polygon (Matic) Data Feeds",
    label: "Polygon (Matic)",
    img: "/assets/chains/polygon.svg",
    networkStatusUrl: "https://polygon.io/system",
    tags: ["default", "proofOfReserve"],
    networks: [
      {
        name: "Polygon Mainnet",
        explorerUrl: "https://polygonscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      },
      {
        name: "Mumbai Testnet",
        explorerUrl: "https://mumbai.polygonscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-testnet.json",
      },
    ],
  },
  {
    page: "gnosis-chain",
    title: "Gnosis Chain (xDai) Data Feeds",
    img: "/assets/chains/gnosis-chain.svg",
    networkStatusUrl: "https://gnosisscan.io/",
    tags: ["default"],
    networks: [
      {
        name: "Gnosis Chain Mainnet",
        explorerUrl: "https://gnosisscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
      },
    ],
    label: "Gnosis Chain (xDai)",
  },
  {
    page: "avalanche",
    title: "Avalanche Data Feeds",
    img: "/assets/chains/avalanche.svg",
    networkStatusUrl: "https://status.avax.network/",
    tags: ["default", "proofOfReserve"],
    networks: [
      {
        name: "Avalanche Mainnet",
        explorerUrl: "https://snowtrace.io/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
      },
      {
        name: "Avalanche Testnet",
        explorerUrl: "https://testnet.snowtrace.io/address/%s",
        networkType: "testnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-fuji-testnet.json",
      },
    ],
    label: "Avalanche",
  },
  {
    page: "fantom",
    title: "Fantom Testnet",
    label: "Fantom",
    img: "/assets/chains/fantom.svg",
    networkStatusUrl: "https://ftmscan.com/",
    tags: ["default"],
    networks: [
      {
        name: "Fantom Mainnet",
        explorerUrl: "https://ftmscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
      },
      {
        name: "Fantom Testnet",
        explorerUrl: "https://testnet.ftmscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-testnet.json",
      },
    ],
  },
  {
    page: "arbitrum",
    label: "Arbitrum",
    title: "Arbitrum Data Feeds",
    img: "/assets/chains/arbitrum.svg",
    networkStatusUrl: "https://arbiscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "Arbitrum Mainnet",
        explorerUrl: "https://arbiscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
      },
      {
        name: "Arbitrum Goerli",
        explorerUrl: "https://goerli-rollup-explorer.arbitrum.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-arbitrum-1.json",
      },
    ],
  },
  {
    page: "harmony",
    label: "Harmony",
    title: "Harmony Data Feeds",
    img: "/assets/chains/harmony.svg",
    networkStatusUrl: "https://status.harmony.one/",
    tags: ["default"],
    networks: [
      {
        name: "Harmony Mainnet",
        explorerUrl: "https://explorer.harmony.one/#/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-harmony-mainnet-0.json",
      },
    ],
  },
  {
    page: "optimism",
    label: "Optimism",
    title: "Optimism Data Feeds",
    img: "/assets/chains/optimism.svg",
    networkStatusUrl: "https://status.optimism.io/",
    tags: ["default"],
    networks: [
      {
        name: "Optimism Mainnet",
        explorerUrl: "https://optimistic.etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
      },
      {
        name: "Optimism Goerli",
        explorerUrl: "https://goerli-optimism.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-optimism-1.json",
      },
    ],
  },
  {
    page: "moonriver",
    title: "Moonriver Data Feeds",
    label: "Moonriver",
    img: "/assets/chains/moonriver.svg",
    networkStatusUrl: "https://moonscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "Moonriver Mainnet",
        explorerUrl: "https://moonriver.moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
      },
    ],
  },
  {
    page: "moonbeam",
    label: "Moonbeam",
    title: "Moonbeam Data Feeds",
    img: "/assets/chains/moonbeam.svg",
    networkStatusUrl: "https://moonscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "Moonbeam Mainnet",
        explorerUrl: "https://moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
      },
    ],
  },
  {
    page: "metis",
    label: "Metis",
    title: "Metis Data Feeds",
    img: "/assets/chains/metis.svg",
    networkStatusUrl: "https://andromeda-explorer.metis.io/",
    tags: ["default"],
    networks: [
      {
        name: "Metis Mainnet",
        explorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
      },
    ],
  },
  {
    page: "klaytn",
    label: "Klaytn",
    title: "Klaytn Data Feeds",
    img: "/assets/chains/klaytn.svg",
    networkStatusUrl: "https://status.klaytnapi.com/",
    tags: ["default"],
    networks: [
      {
        name: "Klaytn Baobab testnet",
        explorerUrl: "https://baobab.scope.klaytn.com/account/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-klaytn-testnet-baobab.json",
      },
    ],
  },
  {
    page: "starknet",
    label: "StarkNet",
    title: "StarkNet Data Feeds",
    img: "/assets/chains/starknet.svg",
    networkStatusUrl: "https://starknet.io/network/",
    tags: ["default"],
    networks: [
      {
        name: "StarkNet testnet",
        explorerUrl: "https://testnet.starkscan.co/contract/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-starknet-testnet-goerli-1.json",
      },
    ],
  },
]

export const SOLANA_CHAINS: Chain[] = [
  {
    page: "solana",
    title: "Solana Data Feeds",
    networkStatusUrl: "https://status.solana.com/",
    tags: ["solana"],
    networks: [
      {
        name: "Solana Mainnet",
        explorerUrl: "https://solscan.io/account/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
      },
      {
        name: "Solana Devnet",
        explorerUrl: "https://solscan.io/account/%s?cluster=devnet",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-devnet.json",
      },
    ],
  },
]

export const ALL_CHAINS: Chain[] = [
  {
    page: "deprecated",
    title: "All chains",
    img: "/assets/chains/ethereum.svg",
    networkStatusUrl: "https://ethstats.net/",
    tags: ["default", "proofOfReserve", "nftFloorPrice"],
    networks: [
      {
        name: "Ethereum Mainnet",
        explorerUrl: "https://etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        tags: ["proofOfReserve", "nftFloorPrice"],
      },
      {
        name: "Goerli Testnet",
        explorerUrl: "https://goerli.etherscan.io/address/%s",
        networkType: "testnet",
        tags: ["nftFloorPrice"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-goerli.json",
      },
      {
        name: "Sepolia Testnet",
        explorerUrl: "https://sepolia.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia.json",
      },
      {
        name: "BNB Chain Mainnet",
        explorerUrl: "https://bscscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
      },
      {
        name: "BNB Chain Testnet",
        explorerUrl: "https://testnet.bscscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-testnet.json",
      },
      {
        name: "Polygon Mainnet",
        explorerUrl: "https://polygonscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      },
      {
        name: "Mumbai Testnet",
        explorerUrl: "https://mumbai.polygonscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-testnet.json",
      },
      {
        name: "Gnosis Chain Mainnet",
        explorerUrl: "https://gnosisscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
      },
      {
        name: "Avalanche Mainnet",
        explorerUrl: "https://snowtrace.io/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
      },
      {
        name: "Avalanche Testnet",
        explorerUrl: "https://testnet.snowtrace.io/address/%s",
        networkType: "testnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-fuji-testnet.json",
      },
      {
        name: "Fantom Mainnet",
        explorerUrl: "https://ftmscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
      },
      {
        name: "Fantom Testnet",
        explorerUrl: "https://testnet.ftmscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-testnet.json",
      },
      {
        name: "Arbitrum Mainnet",
        explorerUrl: "https://arbiscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
      },
      {
        name: "Arbitrum Goerli",
        explorerUrl: "https://goerli-rollup-explorer.arbitrum.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-arbitrum-1.json",
      },
      {
        name: "Harmony Mainnet",
        explorerUrl: "https://explorer.harmony.one/#/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-harmony-mainnet-0.json",
      },
      {
        name: "Optimism Mainnet",
        explorerUrl: "https://optimistic.etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
      },
      {
        name: "Optimism Goerli",
        explorerUrl: "https://goerli-optimism.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-optimism-1.json",
      },
      {
        name: "Moonriver Mainnet",
        explorerUrl: "https://moonriver.moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
      },
      {
        name: "Moonbeam Mainnet",
        explorerUrl: "https://moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
      },
      {
        name: "Metis Mainnet",
        explorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
      },
      {
        name: "Klaytn Baobab testnet",
        explorerUrl: "https://baobab.scope.klaytn.com/account/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-klaytn-testnet-baobab.json",
      },
      {
        name: "Solana Mainnet",
        explorerUrl: "https://solscan.io/account/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
      },
      {
        name: "Solana Devnet",
        explorerUrl: "https://solscan.io/account/%s?cluster=devnet",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-devnet.json",
      },
    ],
    label: "All",
  },
]
