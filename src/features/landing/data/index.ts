import ccipLogo from "../assets/ccip-logo.svg"
import vrfLogo from "../assets/vrf-logo.svg"
import functionsLogo from "../assets/functions-logo.svg"
import automationLogo from "../assets/automation-logo.svg"
import dataLogo from "../assets/data-feeds-logo.svg"
import generalLogo from "../assets/general-logo.svg"
import ccipShape from "../assets/ccip-shape.svg"
import vrfShape from "../assets/vrf-shape.svg"
import functionsShape from "../assets/functions-shape.svg"
import automationShape from "../assets/automation-shape.svg"
import dataShape from "../assets/data-feeds-shape.svg"
import generalShape from "../assets/general-shape.svg"
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
    title: "Data",
    description: "Decentralized and high-quality feeds for DeFi, sports, weather, and more.",
    learnMorelink: "data-feeds",
    image: dataLogo,
    shape: dataShape,
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
    ],
  },
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
    title: "Automation",
    description: "Reliable, high-performance, decentralized automation for smart contracts.",
    learnMorelink: "chainlink-automation",
    image: automationLogo,
    shape: automationShape,
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }, { id: "optimism", title: "Optimism" }],
  },
  {
    title: "VRF",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFTs.",
    learnMorelink: "/vrf",
    image: vrfLogo,
    shape: vrfShape,
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
  },
  {
    title: "General",
    description: "The industry-standard Web3 services platform connecting people, businesses, and data.",
    learnMorelink: "data-streams",
    image: generalLogo,
    shape: generalShape,
    chains: [],
  },
] as ProductCardProps[]
