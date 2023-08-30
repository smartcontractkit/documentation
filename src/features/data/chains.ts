import { ChainMetadata } from "./api"

type ChainTags = ("default" | "proofOfReserve" | "nftFloorPrice" | "rates")[]
export interface ChainNetwork {
  name: string
  blockExplorerUrl: string
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
  label: string
  tags?: ChainTags
  supportedFeatures: ("vrfSubscription" | "vrfDirectFunding" | "feeds")[]
}

export const CHAINS: Chain[] = [
  {
    page: "ethereum",
    title: "Data Feeds",
    img: "/assets/chains/ethereum.svg",
    networkStatusUrl: "https://ethstats.dev/",
    tags: ["default", "proofOfReserve", "nftFloorPrice", "rates"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Ethereum Mainnet",
        blockExplorerUrl: "https://etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        tags: ["proofOfReserve", "nftFloorPrice"],
      },
      {
        name: "Sepolia Testnet",
        blockExplorerUrl: "https://sepolia.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia.json",
        tags: ["rates"],
      },
      {
        name: "Goerli Testnet",
        blockExplorerUrl: "https://goerli.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-goerli.json",
        tags: ["proofOfReserve", "nftFloorPrice"],
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
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "BNB Chain Mainnet",
        blockExplorerUrl: "https://bscscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
      },
      {
        name: "BNB Chain Testnet",
        blockExplorerUrl: "https://testnet.bscscan.com/address/%s",
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
    tags: ["default", "proofOfReserve", "nftFloorPrice", "rates"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Polygon Mainnet",
        blockExplorerUrl: "https://polygonscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
        tags: ["proofOfReserve"],
      },
      {
        name: "Mumbai Testnet",
        blockExplorerUrl: "https://mumbai.polygonscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-testnet.json",
        tags: ["nftFloorPrice", "rates"],
      },
    ],
  },
  {
    page: "gnosis-chain",
    title: "Gnosis Chain (xDai) Data Feeds",
    img: "/assets/chains/gnosis-chain.svg",
    networkStatusUrl: "https://gnosisscan.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Gnosis Chain Mainnet",
        blockExplorerUrl: "https://gnosisscan.io/address/%s",
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
    tags: ["default", "proofOfReserve", "rates"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Avalanche Mainnet",
        blockExplorerUrl: "https://snowtrace.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
        tags: ["proofOfReserve"],
      },
      {
        name: "Avalanche Testnet",
        blockExplorerUrl: "https://testnet.snowtrace.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-fuji-testnet.json",
        tags: ["proofOfReserve", "rates"],
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
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Fantom Mainnet",
        blockExplorerUrl: "https://ftmscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
      },
      {
        name: "Fantom Testnet",
        blockExplorerUrl: "https://testnet.ftmscan.com/address/%s",
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
    tags: ["default", "rates", "nftFloorPrice"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Arbitrum Mainnet",
        blockExplorerUrl: "https://arbiscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
        tags: ["nftFloorPrice"],
      },
      {
        name: "Arbitrum Goerli",
        blockExplorerUrl: "https://goerli-rollup-explorer.arbitrum.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-arbitrum-1.json",
        tags: ["rates"],
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
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Harmony Mainnet",
        blockExplorerUrl: "https://explorer.harmony.one/#/address/%s",
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
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Optimism Mainnet",
        blockExplorerUrl: "https://optimistic.etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
      },
      {
        name: "Optimism Goerli",
        blockExplorerUrl: "https://goerli-optimism.etherscan.io/address/%s",
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
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Moonriver Mainnet",
        blockExplorerUrl: "https://moonriver.moonscan.io/address/%s",
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
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Moonbeam Mainnet",
        blockExplorerUrl: "https://moonscan.io/address/%s",
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
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Metis Mainnet",
        blockExplorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
      },
    ],
  },
  {
    page: "base",
    label: "BASE",
    title: "BASE Data Feeds",
    img: "/assets/chains/base.svg",
    networkStatusUrl: "https://goerli.basescan.org",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "BASE Mainnet",
        blockExplorerUrl: "https://basescan.org/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-base-1.json",
      },
      {
        name: "BASE Goerli testnet",
        blockExplorerUrl: "https://goerli.basescan.org/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-base-1.json",
      },
    ],
  },
  {
    page: "celo",
    label: "Celo",
    title: "Celo Data Feeds",
    img: "/assets/chains/celo.svg",
    networkStatusUrl: "https://stats.celo.org/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Celo mainnet",
        blockExplorerUrl: "https://explorer.celo.org/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-celo-mainnet.json",
      },
      {
        name: "Celo Alfajores testnet",
        blockExplorerUrl: "https://explorer.celo.org/alfajores/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-celo-testnet-alfajores.json",
      },
    ],
  },
  {
    page: "starknet",
    label: "StarkNet",
    title: "StarkNet Data Feeds",
    img: "/assets/chains/starknet.svg",
    networkStatusUrl: "https://testnet.starkscan.co/stats",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "StarkNet testnet",
        blockExplorerUrl: "https://testnet.starkscan.co/contract/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-starknet-testnet-goerli-1.json",
      },
    ],
  },
  {
    page: "solana",
    label: "Solana",
    title: "Solana Data Feeds",
    img: "/assets/chains/solana.svg",
    networkStatusUrl: "https://status.solana.com/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Solana Mainnet",
        blockExplorerUrl: "https://solscan.io/account/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
      },
      {
        name: "Solana Devnet",
        blockExplorerUrl: "https://solscan.io/account/%s?cluster=devnet",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-devnet.json",
      },
    ],
  },
]

// All mainnet feeds. Used for deprecated feeds.
export const ALL_CHAINS: Chain[] = [
  {
    page: "deprecated",
    title: "All chains",
    img: "/assets/chains/ethereum.svg",
    networkStatusUrl: "https://ethstats.dev/",
    tags: ["default", "proofOfReserve", "nftFloorPrice"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Ethereum Mainnet",
        blockExplorerUrl: "https://etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        tags: ["proofOfReserve", "nftFloorPrice"],
      },
      {
        name: "BNB Chain Mainnet",
        blockExplorerUrl: "https://bscscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
      },
      {
        name: "Polygon Mainnet",
        blockExplorerUrl: "https://polygonscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      },
      {
        name: "Gnosis Chain Mainnet",
        blockExplorerUrl: "https://gnosisscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
      },
      {
        name: "Avalanche Mainnet",
        blockExplorerUrl: "https://snowtrace.io/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
      },
      {
        name: "Fantom Mainnet",
        blockExplorerUrl: "https://ftmscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
      },
      {
        name: "Arbitrum Mainnet",
        blockExplorerUrl: "https://arbiscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
      },
      {
        name: "Harmony Mainnet",
        blockExplorerUrl: "https://explorer.harmony.one/#/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-harmony-mainnet-0.json",
      },
      {
        name: "Optimism Mainnet",
        blockExplorerUrl: "https://optimistic.etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
      },
      {
        name: "Moonriver Mainnet",
        blockExplorerUrl: "https://moonriver.moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
      },
      {
        name: "Moonbeam Mainnet",
        blockExplorerUrl: "https://moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
      },
      {
        name: "Metis Mainnet",
        blockExplorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
      },
      {
        name: "Solana Mainnet",
        blockExplorerUrl: "https://solscan.io/account/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
      },
    ],
    label: "All",
  },
]
