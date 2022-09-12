import vrfLogo from "../assets/vrf-logo.svg"
import keeprsLogo from "../assets/keepers-logo.svg"
import dataFeedsLogo from "../assets/data-feeds-logo.svg"
import externalApiLogo from "../assets/external-api-logo.svg"
import { ProductCardProps } from "../components/ProductCard"

const baseChains = ["avalanche", "bnb-chain", "ethereum", "fantom", "polygon"]
const extraChains = [
  "heco",
  "arbitrum",
  "optimism",
  "gnosis-chain",
  "moonbeam",
  "moonriver",
]
export const evmProducts = [
  {
    title: "Market and Data Feeds",
    description:
      "Decentralized and high-quality data feeds for DeFi, sports, weather, and more",
    learnMorelink: "",
    image: dataFeedsLogo,
    links: [
      ["Introduction to Data Feeds", "#"],
      ["Using Data Feeds", "#"],
      ["Historical Price Data", "#"],
      ["API Reference", "#"],
    ],
    chains: [...baseChains, ...extraChains],
  },
  {
    title: "Keepers",
    description:
      "Decentralized, highly reliable, cost-efficient and highly secure automation for smart contracts",
    learnMorelink: "",
    image: keeprsLogo,
    links: [
      ["Introduction to Chainlink Keepers", "#"],
      ["Register an Upkeep", "#"],
      ["Job Scheduler", "#"],
      ["Manage your Upkeeps", "#"],
    ],
    chains: [...baseChains],
  },
  {
    title: "VRF",
    description:
      "Verifiable, tamper-proof random number generator for blockchain gaming and NFT projects",
    learnMorelink: "",
    image: vrfLogo,
    links: [
      ["Introduction to Chainlink VRF", "#"],
      ["Get a Random Number", "#"],
      ["Contract Addresses", "#"],
      ["Security Considerations", "#"],
    ],
    chains: [...baseChains],
  },
  {
    title: "External API Calls",
    description:
      "Request and receive data from any API using the Chainlink contract library",
    learnMorelink: "/any-api/introduction/",
    image: externalApiLogo,
    links: [
      ["Introduction to Using Any API", "/any-api/introduction/"],
      ["Make a GET Request", "/any-api/get-request/introduction/"],
      ["Find Existing Jobs", "/any-api/find-oracle/"],
      ["API Reference", "/any-api/api-reference/"],
    ],
    chains: [...baseChains, ...extraChains],
  },
] as ProductCardProps[]

export const solanaProducts = [
  {
    title: "Market and Data Feeds",
    description:
      "Decentralized and high-quality data feeds for DeFi, sports, weather, and more",
    learnMorelink: "",
    image: dataFeedsLogo,
    links: [
      ["Using Data Feeds Off-Chain", "#"],
      ["Using Data Feeds On-Chain", "#"],
      ["Solana Data Feeds Addresses", "#"],
    ],
    chains: [...baseChains, ...extraChains],
  },
] as ProductCardProps[]
