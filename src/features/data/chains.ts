import { ChainMetadata } from "./api"

type ChainTags = ("default" | "proofOfReserve" | "rates" | "streams")[]
export interface ChainNetwork {
  name: string
  explorerUrl: string
  networkType: "mainnet" | "testnet"
  rddUrl?: string
  queryString: string
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

export const getNetworkFromQueryString = (
  queryString: string
): { chain: Chain | null; chainNetwork: ChainNetwork | null } => {
  const chain = CHAINS.find((chain) => chain.networks.some((network) => network.queryString === queryString))
  if (!chain) return { chain: null, chainNetwork: null }
  const chainNetwork = chain.networks.filter((network) => network.queryString === queryString)[0]
  return { chain, chainNetwork }
}

export const CHAINS: Chain[] = [
  {
    page: "ethereum",
    title: "Data Feeds",
    img: "/assets/chains/ethereum.svg",
    networkStatusUrl: "https://ethstats.dev/",
    tags: ["default", "proofOfReserve", "rates"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Ethereum Mainnet",
        explorerUrl: "https://etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        queryString: "ethereum-mainnet",
        tags: ["proofOfReserve"],
      },
      {
        name: "Sepolia Testnet",
        explorerUrl: "https://sepolia.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia.json",
        queryString: "ethereum-sepolia",
        tags: ["rates"],
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
        explorerUrl: "https://bscscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
        queryString: "bnb-mainnet",
      },
      {
        name: "BNB Chain Testnet",
        explorerUrl: "https://testnet.bscscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-testnet.json",
        queryString: "bnb-testnet",
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
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Polygon Mainnet",
        explorerUrl: "https://polygonscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
        queryString: "polygon-mainnet",
        tags: ["proofOfReserve"],
      },
      {
        name: "Amoy Testnet",
        explorerUrl: "https://amoy.polygonscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-polygon-testnet-amoy.json",
        queryString: "polygon-amoy",
        tags: ["proofOfReserve"],
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
        explorerUrl: "https://gnosisscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
        queryString: "gnosis-mainnet",
      },
    ],
    label: "Gnosis Chain (xDai)",
  },
  {
    page: "avalanche",
    title: "Avalanche Data Feeds",
    img: "/assets/chains/avalanche.svg",
    networkStatusUrl: "https://status.avax.network/",
    tags: ["default", "proofOfReserve", "rates", "streams"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Avalanche Mainnet",
        explorerUrl: "https://snowtrace.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
        queryString: "avalanche-mainnet",
        tags: ["proofOfReserve", "streams"],
      },
      {
        name: "Avalanche Testnet",
        explorerUrl: "https://testnet.snowtrace.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-fuji-testnet.json",
        queryString: "avalanche-fuji",
        tags: ["proofOfReserve", "rates", "streams"],
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
        explorerUrl: "https://ftmscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
        queryString: "fantom-mainnet",
      },
      {
        name: "Fantom Testnet",
        explorerUrl: "https://testnet.ftmscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-testnet.json",
        queryString: "fantom-testnet",
      },
    ],
  },
  {
    page: "arbitrum",
    label: "Arbitrum",
    title: "Arbitrum Data Feeds",
    img: "/assets/chains/arbitrum.svg",
    networkStatusUrl: "https://arbiscan.freshstatus.io/",
    tags: ["default", "rates", "streams", "proofOfReserve"],
    supportedFeatures: ["vrfSubscription", "vrfDirectFunding", "feeds"],
    networks: [
      {
        name: "Arbitrum Mainnet",
        explorerUrl: "https://arbiscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
        queryString: "arbitrum-mainnet",
        tags: ["streams", "proofOfReserve"],
      },
      {
        name: "Arbitrum Sepolia",
        explorerUrl: "https://sepolia.arbiscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia-arbitrum-1.json",
        queryString: "arbitrum-sepolia",
        tags: ["rates", "streams"],
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
        explorerUrl: "https://optimistic.etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
        queryString: "optimism-mainnet",
      },
      {
        name: "Optimism Sepolia",
        explorerUrl: "https://sepolia-optimism.etherscan.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia-optimism-1.json",
        queryString: "optimism-sepolia",
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
        explorerUrl: "https://moonriver.moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
        queryString: "moonriver-mainnet",
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
        explorerUrl: "https://moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
        queryString: "moonbeam-mainnet",
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
        explorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
        queryString: "metis-mainnet",
      },
    ],
  },
  {
    page: "base",
    label: "Base",
    title: "Base Data Feeds",
    img: "/assets/chains/base.svg",
    networkStatusUrl: "https://basescan.statuspage.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Base Mainnet",
        explorerUrl: "https://basescan.org/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-base-1.json",
        queryString: "base-mainnet",
      },
      {
        name: "Base Sepolia testnet",
        explorerUrl: "https://sepolia.basescan.org/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia-base-1.json",
        queryString: "base-sepolia",
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
        name: "Celo Mainnet",
        explorerUrl: "https://explorer.celo.org/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-celo-mainnet.json",
        queryString: "celo-mainnet",
      },
      {
        name: "Celo Alfajores testnet",
        explorerUrl: "https://explorer.celo.org/alfajores/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-celo-testnet-alfajores.json",
        queryString: "celo-alfajores",
      },
    ],
  },
  {
    page: "scroll",
    label: "Scroll",
    title: "Scroll Data Feeds",
    img: "/assets/chains/scroll.svg",
    networkStatusUrl: "https://status.scroll.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Scroll Mainnet",
        explorerUrl: "https://scrollscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-scroll-1.json",
        queryString: "scroll-mainnet",
      },
      {
        name: "Scroll Sepolia testnet",
        explorerUrl: "https://sepolia-blockscout.scroll.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia-scroll-1.json",
        queryString: "scroll-sepolia",
      },
    ],
  },
  {
    page: "linea",
    label: "Linea",
    title: "Linea Data Feeds",
    img: "/assets/chains/linea.svg",
    networkStatusUrl: "https://linea.statuspage.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Linea Mainnet",
        explorerUrl: "https://lineascan.build/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-linea-1.json",
        queryString: "linea-mainnet",
      },
    ],
  },
  {
    page: "zksync",
    label: "zkSync",
    title: "zkSync Data Feeds",
    img: "/assets/chains/zksync.svg",
    networkStatusUrl: "https://explorer.zksync.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "zkSync Era Mainnet",
        explorerUrl: "https://explorer.zksync.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-zksync-1.json",
        queryString: "zksync-mainnet",
      },
      {
        name: "zkSync Sepolia testnet",
        explorerUrl: "https://sepolia.explorer.zksync.io/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia-zksync-1.json",
        queryString: "zksync-sepolia-testnet",
      },
    ],
  },
  {
    page: "polygonzkevm",
    label: "Polygon zkEVM",
    title: "Polygon zkEVM",
    img: "/assets/chains/polygonzkevm.svg",
    networkStatusUrl: "https://polygonscan.freshstatus.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Polygon zkEVM Mainnet",
        explorerUrl: "https://zkevm.polygonscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-polygon-zkevm-1.json",
        queryString: "polygon-zkevm-mainnet",
      },
      {
        name: "Polygon zkEVM Cardona Testnet",
        explorerUrl: "https://cardona-zkevm.polygonscan.com/address/%s",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-testnet-sepolia-polygon-zkevm-1.json",
        queryString: "polygon-zkevm-testnet",
      },
    ],
  },
  {
    page: "starknet",
    label: "Starknet",
    title: "StarkNet Data Feeds",
    img: "/assets/chains/starknet.svg",
    networkStatusUrl: "https://status.starknet.io/",
    tags: ["default"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Starknet Mainnet",
        explorerUrl: "https://starkscan.co/contract/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-starknet-1.json",
        queryString: "starknet-mainnet",
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
        explorerUrl: "https://solscan.io/account/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
        queryString: "solana-mainnet",
      },
      {
        name: "Solana Devnet",
        explorerUrl: "https://solscan.io/account/%s?cluster=devnet",
        networkType: "testnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-devnet.json",
        queryString: "solana-devnet",
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
    tags: ["default", "proofOfReserve"],
    supportedFeatures: ["feeds"],
    networks: [
      {
        name: "Ethereum Mainnet",
        explorerUrl: "https://etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-mainnet.json",
        queryString: "ethereum-mainnet",
        tags: ["proofOfReserve"],
      },
      {
        name: "BNB Chain Mainnet",
        explorerUrl: "https://bscscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-bsc-mainnet.json",
        queryString: "bnb-mainnet",
      },
      {
        name: "Polygon Mainnet",
        explorerUrl: "https://polygonscan.com/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
        queryString: "polygon-mainnet",
      },
      {
        name: "Gnosis Chain Mainnet",
        explorerUrl: "https://gnosisscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json",
        queryString: "gnosis-mainnet",
      },
      {
        name: "Avalanche Mainnet",
        explorerUrl: "https://snowtrace.io/address/%s",
        networkType: "mainnet",
        tags: ["proofOfReserve"],
        rddUrl: "https://reference-data-directory.vercel.app/feeds-avalanche-mainnet.json",
        queryString: "avalanche-mainnet",
      },
      {
        name: "Fantom Mainnet",
        explorerUrl: "https://ftmscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-fantom-mainnet.json",
        queryString: "fantom-mainnet",
      },
      {
        name: "Arbitrum Mainnet",
        explorerUrl: "https://arbiscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-arbitrum-1.json",
        queryString: "arbitrum-mainnet",
      },
      {
        name: "Optimism Mainnet",
        explorerUrl: "https://optimistic.etherscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-optimism-1.json",
        queryString: "optimism-mainnet",
      },
      {
        name: "Moonriver Mainnet",
        explorerUrl: "https://moonriver.moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-polkadot-mainnet-moonbeam.json",
        queryString: "moonriver-mainnet",
      },
      {
        name: "Moonbeam Mainnet",
        explorerUrl: "https://moonscan.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-kusama-mainnet-moonriver.json",
        queryString: "moonbeam-mainnet",
      },
      {
        name: "Metis Mainnet",
        explorerUrl: "https://andromeda-explorer.metis.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-andromeda-1.json",
        queryString: "metis-mainnet",
      },
      {
        name: "Base Mainnet",
        explorerUrl: "https://basescan.org/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-base-1.json",
        queryString: "base-mainnet",
      },
      {
        name: "Celo Mainnet",
        explorerUrl: "https://explorer.celo.org/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-celo-mainnet.json",
        queryString: "celo-mainnet",
      },
      {
        name: "Scroll Mainnet",
        explorerUrl: "https://scrollscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-scroll-1.json",
        queryString: "scroll-mainnet",
      },
      {
        name: "Linea Mainnet",
        explorerUrl: "https://lineascan.build/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-linea-1.json",
        queryString: "linea-mainnet",
      },
      {
        name: "zkSync Era Mainnet",
        explorerUrl: "https://explorer.zksync.io/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-zksync-1.json",
        queryString: "zksync-mainnet",
      },
      {
        name: "Polygon zkEVM Mainnet",
        explorerUrl: "https://zkevm.polygonscan.com/address/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-ethereum-mainnet-polygon-zkevm-1.json",
        queryString: "polygon-zkevm-mainnet",
      },
      {
        name: "Solana Mainnet",
        explorerUrl: "https://solscan.io/account/%s",
        networkType: "mainnet",
        rddUrl: "https://reference-data-directory.vercel.app/feeds-solana-mainnet.json",
        queryString: "solana-mainnet",
      },
    ],
    label: "All",
  },
]
