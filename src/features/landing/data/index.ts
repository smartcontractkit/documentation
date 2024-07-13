import ccipLogo from "../../../assets/product-logos/ccip-logo.svg"
import vrfLogo from "../../../assets/product-logos/vrf-logo.svg"
import functionsLogo from "../../../assets/product-logos/functions-logo.svg"
import automationLogo from "../../../assets/product-logos/automation-logo.svg"
import dataFeedsLogo from "../../../assets/product-logos/data-feeds-logo.svg"
import ccipShape from "../../../assets/product-logos/ccip-shape.svg"
import vrfShape from "../../../assets/product-logos/vrf-shape.svg"
import functionsShape from "../../../assets/product-logos/functions-shape.svg"
import automationShape from "../../../assets/product-logos/automation-shape.svg"
import dataFeedShape from "../../../assets/product-logos/data-feeds-shape.svg"
import dataStreamsLogo from "../../../assets/product-logos/data-streams-logo.svg"
import dataStreamsShape from "../../../assets/product-logos/data-streams-shape.svg"
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
      { id: "blast", title: "Blast" },
      { id: "wemix", title: "Wemix" },
      { id: "kroma", title: "Kroma" },
      { id: "celo", title: "Celo" },
      { id: "gnosis-chain", title: "Gnosis Chain" },
      { id: "mode", title: "Mode" },
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
      { id: "polygonzkevm", title: "Polygon zkEVM" },
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
    chains: [
      { id: "arbitrum", title: "Arbitrum" },
      { id: "avalanche", title: "Avalanche" },
    ],
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
      { id: "optimism", title: "Optimism" },
      { id: "base", title: "BASE" },
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
      { id: "gnosis-chain", title: "Gnosis Chain" },
    ],
    video: "https://www.youtube.com/watch?v=dj0impNJdls&list=PLVP9aGDn-X0RloqS1uYcuaPSW3GIgoCkg&index=2",
  },
  {
    title: "VRF",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFTs.",
    learnMorelink: "vrf",
    image: vrfLogo,
    shape: vrfShape,
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
    video: "https://www.youtube.com/watch?v=JqZWariqh5s&list=PLVP9aGDn-X0QHDyBRvbITizWrRoecR0D8&index=2",
  },
] as ProductCardProps[]
