import ccipLogo from "../assets/ccip-logo.svg"
import vrfLogo from "../assets/vrf-logo.svg"
import functionsLogo from "../assets/functions-logo.svg"
import automationLogo from "../assets/automation-logo.svg"
import dataFeedsLogo from "../assets/data-feeds-logo.svg"
import dataStreamsLogo from "../assets/data-streams-logo.svg"
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
      ["Overview", "data-feeds"],
      ["Getting Started", "data-feeds/getting-started"],
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
      { id: "celo", title: "Celo" },
      { id: "scroll", title: "Scroll" },
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
      ["Overview", "chainlink-functions"],
      ["Getting Started", "chainlink-functions/getting-started"],
      ["Request Computation", "chainlink-functions/tutorials/simple-computation"],
      ["Call APIs with Query Parameters", "chainlink-functions/tutorials/api-query-parameters"],
      ["Return Custom Data Types", "chainlink-functions/tutorials/api-custom-response"],
      ["POST Data to an API", "chainlink-functions/tutorials/api-post-data"],
      ["Use Secrets in Requests", "chainlink-functions/tutorials/api-use-secrets"],
      ["Architecture", "chainlink-functions/resources/architecture"],
    ],
    chains: [
      { id: "ethereum", title: "Ethereum" },
      { id: "polygon", title: "Polygon" },
      { id: "avalanche", title: "Avalanche" },
    ],
  },
  {
    title: "CCIP",
    description:
      "Connect decentralized applications and transfer tokens across chains using the Chainlink Cross-Chain Interoperability Protocol (CCIP)",
    learnMorelink: "ccip",
    image: ccipLogo,
    links: [
      ["Overview", "ccip"],
      ["Getting Started", "ccip/getting-started"],
      ["Transfer Tokens Between Chains", "ccip/tutorials/cross-chain-tokens"],
      ["Transfer Tokens from an EOA", "ccip/tutorials/cross-chain-tokens-from-eoa"],
      ["Send Arbitrary Data", "ccip/tutorials/send-arbitrary-data"],
      ["CCIP Architecture", "ccip/architecture"],
    ],
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
    title: "Automate Contracts",
    description: "Decentralized, highly reliable, cost-efficient and highly secure automation for smart contracts",
    learnMorelink: "chainlink-automation",
    image: automationLogo,
    links: [
      ["Overview", "chainlink-automation"],
      ["Getting Started", "chainlink-automation/getting-started"],
      ["Time-based Automation", "chainlink-automation/job-scheduler"],
      ["Custom Logic Automation", "chainlink-automation/register-upkeep"],
      ["Manage your Upkeeps", "chainlink-automation/manage-upkeeps"],
      ["Creating Flexible Upkeeps", "chainlink-automation/flexible-upkeeps"],
    ],
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }, { id: "optimism", title: "Optimism" }],
    video: "https://www.youtube.com/watch?v=dj0impNJdls&list=PLVP9aGDn-X0RloqS1uYcuaPSW3GIgoCkg&index=2",
  },
  {
    title: "VRF",
    description: "Verifiable, tamper-proof random number generator for blockchain gaming and NFT projects",
    learnMorelink: "/vrf",
    image: vrfLogo,
    links: [
      ["Overview", "/vrf"],
      ["Getting Started", "/vrf/v2/getting-started"],
      ["Subscription Method", "/vrf/v2/subscription"],
      ["Direct Funding Method", "/vrf/v2/direct-funding"],
      ["Security Considerations", "/vrf/v2/security"],
      ["Best Practices", "/vrf/v2/best-practices"],
    ],
    chains: [...baseChains, { id: "arbitrum", title: "Arbitrum" }],
    video: "https://www.youtube.com/watch?v=JqZWariqh5s&list=PLVP9aGDn-X0QHDyBRvbITizWrRoecR0D8&index=2",
  },
  {
    title: "Data Streams",
    description:
      "Secure and reliable high-frequency market data for ultra-fast derivatives products powered by decentralized and transparent infrastructure.",
    learnMorelink: "data-streams",
    image: dataStreamsLogo,
    links: [
      ["Introduction", "data-streams"],
      ["Getting Started", "data-streams/getting-started"],
      ["Stream IDs", "data-streams/stream-ids"],
      ["Available Schemas", "data-streams/reference/report-schema"],
      ["Interface Reference", "data-streams/reference/interfaces"],
    ],
    chains: [{ id: "arbitrum", title: "Arbitrum" }],
  },
] as ProductCardProps[]
