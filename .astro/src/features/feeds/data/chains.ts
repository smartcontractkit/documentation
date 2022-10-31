import { ChainMetadata } from "../api"

export interface Chain {
  page: string
  title: string
  img?: string
  networkStatusUrl: string
  networks: ChainNetwork[]
  label?: string
  tags?: ChainTags
}

export interface ChainNetwork {
  name: string
  explorerUrl: string
  source: string
  networkType: "mainnet" | "testnet"
  rddUrl?: string
  metadata?: ChainMetadata[]
  tags?: ChainTags
}

type ChainTags = ("default" | "solana" | "proofOfReserve" | "nftFloorPrice")[]

export const CHAINS: Chain[] = [
  {
    page: "ethereum",
    title: "Ethereum Data Feeds",
    img: "/images/logos/ethereum.svg",
    networkStatusUrl: "https://ethstats.net/",
    tags: ["default", "proofOfReserve", "nftFloorPrice"],
    networks: [
      {
        name: "Ethereum Mainnet",
        explorerUrl: "https://etherscan.io/address/%s",
        source: "directory.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        tags: ["proofOfReserve"],
      },
      {
        name: "Goerli Testnet",
        explorerUrl: "https://goerli.etherscan.io/address/%s",
        source: "directory-goerli.json",
        networkType: "testnet",
        tags: ["nftFloorPrice"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-goerli.json",
      },
    ],
    label: "Ethereum",
  },
  {
    page: "bnb-chain",
    title: "BNB Chain Data Feeds",
    img: "/images/logos/bnb-chain.svg",
    networkStatusUrl: "https://bscscan.freshstatus.io/",
    tags: ["default", "proofOfReserve"],
    networks: [
      {
        name: "BNB Chain Mainnet",
        explorerUrl: "https://bscscan.com/address/%s",
        source: "directory-bsc-mainnet.json",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
      },
      {
        name: "BNB Chain Testnet",
        explorerUrl: "https://testnet.bscscan.com/address/%s",
        source: "directory-bsc-testnet.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-bsc-testnet.json",
      },
    ],
    label: "BNB Chain",
  },
  {
    page: "polygon",
    title: "Polygon (Matic) Data Feeds",
    label: "Polygon (Matic)",
    img: "/images/logos/polygon.svg",
    networkStatusUrl: "https://polygon.io/system",
    tags: ["default", "proofOfReserve"],
    networks: [
      {
        name: "Polygon Mainnet",
        explorerUrl: "https://polygonscan.com/address/%s",
        source: "directory-matic-mainnet.json",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      },
      {
        name: "Mumbai Testnet",
        explorerUrl: "https://mumbai.polygonscan.com/address/%s",
        source: "directory-matic-testnet.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-matic-testnet.json",
      },
    ],
  },
  {
    page: "gnosis-chain",
    title: "Gnosis Chain (xDai) Data Feeds",
    img: "/images/logos/gnosis-chain.svg",
    networkStatusUrl: "https://gnosisscan.io/",
    tags: ["default"],
    networks: [
      {
        name: "Gnosis Chain Mainnet",
        explorerUrl: "https://gnosisscan.io/address/%s",
        source: "directory-xdai-mainnet.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
      },
    ],
    label: "Gnosis Chain (xDai)",
  },
  {
    page: "heco-chain",
    title: "HECO Chain Data Feeds",
    img: "/images/logos/heco.svg",
    networkStatusUrl: "https://hecoinfo.com/",
    tags: ["default"],
    networks: [
      {
        name: "HECO Mainnet",
        explorerUrl: "https://hecoinfo.com/address/%s",
        source: "directory-heco-mainnet.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-heco-mainnet.json",
      },
    ],
    label: "HECO Chain",
  },
  {
    page: "avalanche",
    title: "Avalanche Data Feeds",
    img: "/images/logos/avalanche.svg",
    networkStatusUrl: "https://status.avax.network/",
    tags: ["default", "proofOfReserve"],
    networks: [
      {
        name: "Avalanche Mainnet",
        explorerUrl: "https://snowtrace.io/address/%s",
        source: "directory-avalanche-mainnet.json",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
      },
      {
        name: "Avalanche Testnet",
        explorerUrl: "https://testnet.snowtrace.io/address/%s",
        source: "directory-avalanche-fuji-testnet.json",
        networkType: "testnet",
        tags: ["proofOfReserve"],
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-avalanche-fuji-testnet.json",
      },
    ],
    label: "Avalanche",
  },
  {
    page: "fantom",
    title: "Fantom Testnet",
    label: "Fantom",
    img: "/images/logos/fantom.svg",
    networkStatusUrl: "https://ftmscan.com/",
    tags: ["default"],
    networks: [
      {
        name: "Fantom Mainnet",
        explorerUrl: "https://ftmscan.com/address/%s",
        source: "directory-fantom-mainnet.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
      },
      {
        name: "Fantom Testnet",
        explorerUrl: "https://testnet.ftmscan.com/address/%s",
        source: "directory-fantom-testnet.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-fantom-testnet.json",
      },
    ],
  },
  {
    page: "arbitrum",
    label: "Arbitrum",
    title: "Arbitrum Data Feeds",
    img: "/images/logos/arbitrum.svg",
    networkStatusUrl: "https://arbiscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "Arbitrum Mainnet",
        explorerUrl: "https://arbiscan.io/address/%s",
        source: "directory-ethereum-mainnet-arbitrum-1.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
      },
      {
        name: "Arbitrum Goerli",
        explorerUrl: "https://goerli-rollup-explorer.arbitrum.io/address/%s",
        source: "directory-ethereum-testnet-goerli-arbitrum-1.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-arbitrum-1.json",
      },
    ],
  },
  {
    page: "harmony",
    label: "Harmony",
    title: "Harmony Data Feeds",
    img: "/images/logos/harmony.svg",
    networkStatusUrl: "https://status.harmony.one/",
    tags: ["default"],
    networks: [
      {
        name: "Harmony Mainnet",
        explorerUrl: "https://explorer.harmony.one/#/address/%s",
        source: "directory-harmony-mainnet-0.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-harmony-mainnet-0.json",
      },
    ],
  },
  {
    page: "optimism",
    label: "Optimism",
    title: "Optimism Data Feeds",
    img: "/images/logos/optimism.svg",
    networkStatusUrl: "https://status.optimism.io/",
    tags: ["default"],
    networks: [
      {
        name: "Optimism Mainnet",
        explorerUrl: "https://optimistic.etherscan.io/address/%s",
        source: "directory-ethereum-mainnet-optimism-1.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
      },
      {
        name: "Optimism Goerli",
        explorerUrl: "https://goerli-optimism.etherscan.io/address/%s",
        source: "directory-ethereum-testnet-goerli-optimism-1.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-goerli-optimism-1.json",
      },
    ],
  },
  {
    page: "moonriver",
    title: "Moonriver Data Feeds",
    label: "Moonriver",
    img: "/images/logos/moonriver.svg",
    networkStatusUrl: "https://moonscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "Moonriver Mainnet",
        explorerUrl: "https://moonriver.moonscan.io/address/%s",
        source: "directory-kusama-mainnet-moonriver.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
      },
    ],
  },
  {
    page: "moonbeam",
    label: "Moonbeam",
    title: "Moonbeam Data Feeds",
    img: "/images/logos/moonbeam.svg",
    networkStatusUrl: "https://moonscan.freshstatus.io/",
    tags: ["default"],
    networks: [
      {
        name: "Moonbeam Mainnet",
        explorerUrl: "https://moonscan.io/address/%s",
        source: "directory-polkadot-mainnet-moonbeam.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
      },
    ],
  },
  {
    page: "metis",
    label: "Metis",
    title: "Metis Data Feeds",
    img: "/images/logos/metis.png",
    networkStatusUrl: "https://andromeda-explorer.metis.io/",
    tags: ["default"],
    networks: [
      {
        name: "Metis Mainnet",
        explorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        source: "directory-ethereum-mainnet-andromeda-1.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
      },
    ],
  },
  {
    page: "klaytn",
    label: "Klaytn",
    title: "Klaytn Data Feeds",
    img: "/images/logos/klaytn.svg",
    networkStatusUrl: "https://status.klaytnapi.com/",
    tags: ["default"],
    networks: [
      {
        name: "Klaytn Baobab testnet",
        explorerUrl: "https://baobab.scope.klaytn.com/account/%s",
        source: "directory-klaytn-testnet-baobab.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-klaytn-testnet-baobab.json",
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
        source: "directory-solana-mainnet.json",
        networkType: "mainnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
      },
      {
        name: "Solana Devnet",
        explorerUrl: "https://solscan.io/account/%s?cluster=devnet",
        source: "directory-solana-devnet.json",
        networkType: "testnet",
        rddUrl:
          "https://reference-data-directory.vercel.app/feeds-solana-devnet.json",
      },
    ],
  },
]
