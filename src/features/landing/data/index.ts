import ccipLogo from "../assets/ccip-logo.svg"
import vrfLogo from "../assets/vrf-logo.svg"
import functionsLogo from "../assets/functions-logo.svg"
import automationLogo from "../assets/automation-logo.svg"
import dataFeedsLogo from "../assets/data-feeds-logo.svg"
import ccipShape from "../assets/ccip-shape.svg"
import vrfShape from "../assets/vrf-shape.svg"
import functionsShape from "../assets/functions-shape.svg"
import automationShape from "../assets/automation-shape.svg"
import dataFeedShape from "../assets/data-feeds-shape.svg"
import dataStreamsLogo from "../assets/data-streams-logo.svg"
import dataStreamsShape from "../assets/data-streams-shape.svg"
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
    description: "Global standard for building secure cross-chain applications.",
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
    title: "Data Feeds",
    description: "Decentralized and high-quality data for DeFi, sports, weather, and more.",
    learnMorelink: "data-feeds",
    image: dataFeedsLogo,
    shape: dataFeedShape,
    chains: [
      ...baseChains,
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "gnosis-chain", title: "Gnosis Chain" },
      { id: "metis", title: "Metis" },
      { id: "moonbeam", title: "Moonbeam" },
      { id: "moonriver", title: "Moonriver" },
      { id: "base", title: "BASE" },
      { id: "celo", title: "Celo" },
      { id: "polygonzkevm", title: "Polgyon zkEVM" },
      { id: "scroll", title: "Scroll" },
      { id: "linea", title: "Linea" },
      { id: "zksync", title: "zkSync" },
      { id: "starknet", title: "StarkNet" },
      { id: "solana", title: "Solana" },
    ],
    video: "https://www.youtube.com/watch?v=e75kwGzvtnI&list=PLVP9aGDn-X0QwJVbQvuKr-zrh2_DV5M6J&index=45",
  },
  {
    title: "Data Streams",
    description: "Secure and reliable high-frequency market data for ultra-fast derivatives products.",
    learnMorelink: "data-streams",
    image: dataStreamsLogo,
    shape: dataStreamsShape,
    links: [
      ["Introduction", "data-streams"],
      ["Getting Started", "data-streams/getting-started"],
      ["Stream IDs", "data-streams/stream-ids"],
      ["Available Schemas", "data-streams/reference/report-schema"],
      ["Interface Reference", "data-streams/reference/interfaces"],
    ],
    chains: [{ id: "arbitrum", title: "Arbitrum" }],
  },
  {
    title: "Functions",
    description: "Serverless developer platform that can fetch data from any API and run custom compute.",
    learnMorelink: "chainlink-functions",
    image: functionsLogo,
    shape: functionsShape,
    chains: [
      { id: "ethereum", title: "Ethereum" },
      { id: "polygon", title: "Polygon" },
      { id: "avalanche", title: "Avalanche" },
      { id: "arbitrum", title: "Arbitrum" },
    ],
  },
  {
    title: "Automation",
    description: "Reliable, high-performance, decentralized automation for smart contracts.",
    learnMorelink: "chainlink-automation",
    image: automationLogo,
    shape: automationShape,
    chains: [
      ...baseChains,
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "base", title: "BASE" },
    ],
    video: "https://www.youtube.com/watch?v=dj0impNJdls&list=PLVP9aGDn-X0RloqS1uYcuaPSW3GIgoCkg&index=2",
  },
  {
    title: "VRF",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFTs.",
    learnMorelink: "/vrf",
    image: vrfLogo,
    shape: vrfShape,
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
    video: "https://www.youtube.com/watch?v=JqZWariqh5s&list=PLVP9aGDn-X0QHDyBRvbITizWrRoecR0D8&index=2",
  },
] as ProductCardProps[]
