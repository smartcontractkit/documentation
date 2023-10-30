import ccipLogo from "../assets/ccip-logo.svg"
import vrfLogo from "../assets/vrf-logo.svg"
import functionsLogo from "../assets/functions-logo.svg"
import automationLogo from "../assets/automation-logo.svg"
import dataFeedsLogo from "../assets/data-feeds-logo.svg"
import nodeLogo from "../assets/node-logo.svg"
import ccipShape from "../assets/ccip-shape.svg"
import vrfShape from "../assets/vrf-shape.svg"
import functionsShape from "../assets/functions-shape.svg"
import automationShape from "../assets/automation-shape.svg"
import dataFeedShape from "../assets/data-feeds-shape.svg"
import nodeShape from "../assets/node-shape.svg"
import { ProductCardProps } from "../components/ProductCard"

const baseChains = [
  { id: "ethereum", title: "Ethereum" },
  { id: "avalanche", title: "Avalanche" },
  { id: "bnb-chain", title: "BNB Chain" },
  { id: "fantom", title: "Fantom" },
  { id: "polygon", title: "Polygon" },
]

export const evmProducts = [
  {
    title: "CCIP",
    description:
      "Connect decentralized applications and transfer tokens across chains using the Chainlink Cross-Chain Interoperability Protocol (CCIP)",
    learnMorelink: "ccip",
    image: ccipLogo,
    shape: ccipShape,
    chains: [
      { id: "ethereum", title: "Ethereum" },
      { id: "polygon", title: "Polygon" },
      { id: "avalanche", title: "Avalanche" },
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "bnb-chain", title: "BNB Chain" },
      { id: "base", title: "BASE" },
    ],
  },
  {
    title: "Market and Data Feeds",
    description: "Decentralized and high-quality data for DeFi, sports, weather, and more.",
    learnMorelink: "data-feeds",
    image: dataFeedsLogo,
    shape: dataFeedShape,
    chains: [
      ...baseChains,
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "gnosis-chain", title: "Gnosis Chain" },
      { id: "harmony", title: "Harmony" },
      { id: "metis", title: "Metis" },
      { id: "moonbeam", title: "Moonbeam" },
      { id: "moonriver", title: "Moonriver" },
      { id: "base", title: "BASE" },
      { id: "celo", title: "Celo" },
      { id: "scroll", title: "Scroll" },
      { id: "linea", title: "Linea" },
      { id: "starknet", title: "StarkNet" },
      { id: "solana", title: "Solana" },
    ],
    video: "https://www.youtube.com/watch?v=e75kwGzvtnI&list=PLVP9aGDn-X0QwJVbQvuKr-zrh2_DV5M6J&index=45",
  },
  {
    title: "Chainlink Functions",
    description:
      "Connect smart contracts to a trust-minimized compute infrastructure running on a decentralized oracle network",
    learnMorelink: "chainlink-functions",
    image: functionsLogo,
    shape: functionsShape,
    chains: [
      { id: "ethereum", title: "Ethereum" },
      { id: "polygon", title: "Polygon" },
      { id: "avalanche", title: "Avalanche" },
    ],
  },
  {
    title: "Automate Contracts",
    description: "Decentralized, highly reliable, cost-efficient and highly secure automation for smart contracts",
    learnMorelink: "chainlink-automation",
    image: automationLogo,
    shape: automationShape,
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }, { id: "optimism", title: "Optimism" }],
    video: "https://www.youtube.com/watch?v=dj0impNJdls&list=PLVP9aGDn-X0RloqS1uYcuaPSW3GIgoCkg&index=2",
  },
  {
    title: "VRF",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFT projects",
    learnMorelink: "/vrf",
    image: vrfLogo,
    shape: vrfShape,
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
    video: "https://www.youtube.com/watch?v=JqZWariqh5s&list=PLVP9aGDn-X0QHDyBRvbITizWrRoecR0D8&index=2",
  },
  {
    title: "Nodes",
    description: "Securing the Chainlink Network, giving developers access to real-world data and services.",
    learnMorelink: "chainlink-nodes",
    image: nodeLogo,
    shape: nodeShape,
    chains: [{ id: "arbitrum", title: "Arbitrum" }],
  },
] as ProductCardProps[]
