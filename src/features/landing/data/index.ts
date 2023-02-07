import vrfLogo from "../assets/vrf-logo.svg"
import automationLogo from "../assets/automation-logo.svg"
import dataFeedsLogo from "../assets/data-feeds-logo.svg"
import externalApiLogo from "../assets/external-api-logo.svg"
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
    title: "Data Feeds",
    description: "Decentralized and high-quality data feeds for DeFi, Reserves, NFTs, sports, weather, and more",
    learnMorelink: "data-feeds/",
    image: dataFeedsLogo,
    links: [
      ["Introduction to Data Feeds", "data-feeds/"],
      ["Price Feeds", "data-feeds/price-feeds/"],
      ["Proof of Reserve Feeds", "data-feeds/proof-of-reserve/"],
      ["NFT Floor Pricing Feeds", "data-feeds/nft-floor-price/"],
    ],
    chains: [
      ...baseChains,
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "gnosis-chain", title: "Gnosis Chain" },
      { id: "harmony", title: "Harmony" },
      { id: "klaytn", title: "Klaytn" },
      { id: "metis", title: "Metis" },
      { id: "moonbeam", title: "Moonbeam" },
      { id: "moonriver", title: "Moonriver" },
      { id: "starknet", title: "StarkNet" },
      { id: "solana", title: "Solana" },
    ],
    video: "https://www.youtube.com/watch?v=hw9f84DnTK4&list=PLVP9aGDn-X0Qr4TuqPFNQdqbI735tdPat",
  },
  {
    title: "Automate Contracts",
    description: "Decentralized, highly reliable, cost-efficient and highly secure automation for smart contracts",
    learnMorelink: "chainlink-automation/introduction/",
    image: automationLogo,
    links: [
      ["Introduction to Chainlink Automation", "chainlink-automation/introduction/"],
      ["Time-based Automation", "chainlink-automation/job-scheduler/"],
      ["Custom Logic Automation", "chainlink-automation/register-upkeep/"],
      ["Create Compatible Contracts", "chainlink-automation/compatible-contracts/"],
      ["Manage your Upkeeps", "chainlink-automation/manage-upkeeps/"],
      ["Creating Flexible Upkeeps", "chainlink-automation/flexible-upkeeps/"],
    ],
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
    video: "https://www.youtube.com/watch?v=xL96sTwQ5Ho&list=PLVP9aGDn-X0RloqS1uYcuaPSW3GIgoCkg",
  },
  {
    title: "VRF v2",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFT projects",
    learnMorelink: "/vrf/v2/introduction/",
    image: vrfLogo,
    links: [
      ["Introduction to Chainlink VRF v2", "/vrf/v2/introduction/"],
      ["VRF v2 - Subscription Method", "/vrf/v2/subscription/"],
      ["VRF v2 - Direct Funding Method", "/vrf/v2/direct-funding/"],
      ["Security Considerations", "/vrf/v2/security/"],
      ["Best Practices", "/vrf/v2/best-practices/"],
    ],
    chains: [...baseChains, { id: "klaytn", title: "Klaytn" }],
    video: "https://www.youtube.com/watch?v=rpQCKoRvyR4&list=PLVP9aGDn-X0QHDyBRvbITizWrRoecR0D8",
  },
  {
    title: "External API Calls",
    description: "Request and receive data from any API using the Chainlink contract library",
    learnMorelink: "/any-api/introduction/",
    image: externalApiLogo,
    links: [
      ["Introduction to Using Any API", "/any-api/introduction/"],
      ["Make a GET Request", "/any-api/get-request/introduction/"],
      ["Find Existing Jobs", "/any-api/find-oracle/"],
      ["API Reference", "/any-api/api-reference/"],
    ],
    chains: [
      ...baseChains,
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "gnosis-chain", title: "Gnosis Chain" },
      { id: "harmony", title: "Harmony" },
      { id: "klaytn", title: "Klaytn" },
      { id: "metis", title: "Metis" },
      { id: "moonbeam", title: "Moonbeam" },
      { id: "moonriver", title: "Moonriver" },
    ],
  },
] as ProductCardProps[]
