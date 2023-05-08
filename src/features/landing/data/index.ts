import vrfLogo from "../assets/vrf-logo.svg"
import functionsLogo from "../assets/functions-logo.svg"
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
    learnMorelink: "data-feeds",
    image: dataFeedsLogo,
    links: [
      ["Introduction", "data-feeds"],
      ["Price Feeds", "data-feeds/price-feeds"],
      ["Proof of Reserve Feeds", "data-feeds/proof-of-reserve"],
      ["NFT Floor Pricing Feeds", "data-feeds/nft-floor-price"],
      ["Rate and Volatility Feeds", "data-feeds/rates-feeds"],
    ],
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
    links: [
      ["Introduction", "chainlink-functions"],
      ["Getting Started", "chainlink-functions/getting-started"],
      ["Request Computation", "chainlink-functions/tutorials/simple-computation"],
      ["Call APIs with Query Parameters", "chainlink-functions/tutorials/api-query-parameters"],
      ["POST Data to an API", "chainlink-functions/tutorials/api-post-data"],
      ["Use Secrets in Requests", "chainlink-functions/tutorials/api-use-secrets"],
      ["Add Functions to Your Project", "chainlink-functions/resources/add-functions-to-projects"],
      ["Architecture", "chainlink-functions/resources/architecture"],
    ],
    chains: [
      { id: "ethereum", title: "Ethereum" },
      { id: "polygon", title: "Polygon" },
      { id: "avalanche", title: "Avalanche" },
    ],
  },
  {
    title: "Automate Contracts",
    description: "Decentralized, highly reliable, cost-efficient and highly secure automation for smart contracts",
    learnMorelink: "chainlink-automation/introduction",
    image: automationLogo,
    links: [
      ["Introduction", "chainlink-automation/introduction"],
      ["Time-based Automation", "chainlink-automation/job-scheduler"],
      ["Custom Logic Automation", "chainlink-automation/register-upkeep"],
      ["Create Compatible Contracts", "chainlink-automation/compatible-contracts"],
      ["Manage your Upkeeps", "chainlink-automation/manage-upkeeps"],
      ["Creating Flexible Upkeeps", "chainlink-automation/flexible-upkeeps"],
    ],
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
    video: "https://www.youtube.com/watch?v=dj0impNJdls&list=PLVP9aGDn-X0RloqS1uYcuaPSW3GIgoCkg&index=2",
  },
  {
    title: "VRF v2",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFT projects",
    learnMorelink: "/vrf/v2/introduction",
    image: vrfLogo,
    links: [
      ["Introduction", "/vrf/v2/introduction"],
      ["Subscription Method", "/vrf/v2/subscription"],
      ["Direct Funding Method", "/vrf/v2/direct-funding"],
      ["Security Considerations", "/vrf/v2/security"],
      ["Best Practices", "/vrf/v2/best-practices"],
    ],
    chains: [...baseChains],
    video: "https://www.youtube.com/watch?v=JqZWariqh5s&list=PLVP9aGDn-X0QHDyBRvbITizWrRoecR0D8&index=2",
  },
  {
    title: "External API Calls",
    description: "Request and receive data from any API using the Chainlink contract library",
    learnMorelink: "/any-api/introduction",
    image: externalApiLogo,
    links: [
      ["Introduction", "/any-api/introduction"],
      ["Make a GET Request", "/any-api/get-request/introduction"],
      ["Find Existing Jobs", "/any-api/find-oracle"],
      ["API Reference", "/any-api/api-reference"],
    ],
    chains: [
      ...baseChains,
      { id: "arbitrum", title: "Arbitrum" },
      { id: "optimism", title: "Optimism" },
      { id: "gnosis-chain", title: "Gnosis Chain" },
      { id: "harmony", title: "Harmony" },
      { id: "metis", title: "Metis" },
      { id: "moonbeam", title: "Moonbeam" },
      { id: "moonriver", title: "Moonriver" },
    ],
  },
] as ProductCardProps[]
