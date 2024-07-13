import ccipLogo from "../assets/products/ccip-logo.svg"
import vrfLogo from "../assets/products/vrf-logo.svg"
import functionsLogo from "../assets/products/functions-logo.svg"
import automationLogo from "../assets/products/automation-logo.svg"
import dataFeedsLogo from "../assets/products/data-feeds-logo.svg"
import dataStreamsLogo from "../assets/products/data-streams-logo.svg"

export interface ProductData {
  learnMorelink: string
  logo: { src: string }
  chains: Record<string, string>
}

export interface ProductChainLinks {
  [key: string]: ProductData | { [chainId: string]: string }
}

export const productChainLinks: ProductChainLinks = {
  CCIP: {
    learnMorelink: "ccip",
    logo: ccipLogo,
    chains: {
      arbitrum: "/ccip/supported-networks/v1_2_0/mainnet#arbitrum-mainnet",
      avalanche: "/ccip/supported-networks/v1_2_0/mainnet#avalanche-mainnet",
      "bnb-chain": "/ccip/supported-networks/v1_2_0/mainnet#bnb-chain-mainnet",
      celo: "/ccip/supported-networks/v1_2_0/mainnet#celo-mainnet",
      "gnosis-chain": "/ccip/supported-networks/v1_2_0/mainnet#gnosis-mainnet",
      base: "/ccip/supported-networks/v1_2_0/mainnet#base-mainnet",
      blast: "/ccip/supported-networks/v1_2_0/mainnet#blast-mainnet",
      ethereum: "/ccip/supported-networks/v1_2_0/mainnet#ethereum-mainnet",
      kroma: "/ccip/supported-networks/v1_2_0/mainnet#kroma-mainnet",
      optimism: "/ccip/supported-networks/v1_2_0/mainnet#optimism-mainnet",
      polygon: "/ccip/supported-networks/v1_2_0/mainnet#polygon-mainnet",
      wemix: "/ccip/supported-networks/v1_2_0/mainnet#wemix-mainnet",
      mode: "/ccip/supported-networks/v1_2_0/mainnet#mode-mainnet",
    },
  },
  "Data Feeds": {
    learnMorelink: "data-feeds",
    logo: dataFeedsLogo,
    chains: {
      arbitrum: "/data-feeds/price-feeds/addresses?network=arbitrum",
      avalanche: "/data-feeds/price-feeds/addresses?network=avalanche",
      base: "/data-feeds/price-feeds/addresses?network=base",
      "bnb-chain": "/data-feeds/price-feeds/addresses?network=bnb-chain",
      celo: "/data-feeds/price-feeds/addresses?network=celo",
      ethereum: "/data-feeds/price-feeds/addresses?network=ethereum",
      fantom: "/data-feeds/price-feeds/addresses?network=fantom",
      "gnosis-chain": "/data-feeds/price-feeds/addresses?network=gnosis-chain",
      linea: "/data-feeds/price-feeds/addresses?network=linea",
      metis: "/data-feeds/price-feeds/addresses?network=metis",
      moonbeam: "/data-feeds/price-feeds/addresses?network=moonbeam",
      moonriver: "/data-feeds/price-feeds/addresses?network=moonriver",
      optimism: "/data-feeds/price-feeds/addresses?network=optimism",
      polygonzkevm: "/data-feeds/price-feeds/addresses?network=polygonzkevm",
      polygon: "/data-feeds/price-feeds/addresses?network=polygon",
      scroll: "/data-feeds/price-feeds/addresses?network=scroll",
      solana: "/data-feeds/price-feeds/addresses?network=solana",
      starknet: "/data-feeds/price-feeds/addresses?network=starknet",
      zksync: "/data-feeds/price-feeds/addresses?network=zksync",
    },
  },
  "Data Streams": {
    learnMorelink: "data-streams",
    logo: dataStreamsLogo,
    chains: {
      arbitrum: "/data-streams/stream-ids",
      avalanche: "/data-streams/stream-ids",
    },
  },
  Functions: {
    learnMorelink: "chainlink-functions",
    logo: functionsLogo,
    chains: {
      arbitrum: "/chainlink-functions/supported-networks#arbitrum",
      avalanche: "/chainlink-functions/supported-networks#avalanche",
      base: "/chainlink-functions/supported-networks#base",
      ethereum: "/chainlink-functions/supported-networks#ethereum",
      optimism: "/chainlink-functions/supported-networks#optimism",
      polygon: "/chainlink-functions/supported-networks#polygon",
    },
  },
  Automation: {
    learnMorelink: "chainlink-automation",
    logo: automationLogo,
    chains: {
      arbitrum: "/chainlink-automation/overview/supported-networks#arbitrum",
      avalanche: "/chainlink-automation/overview/supported-networks#avalanche-mainnet",
      base: "/chainlink-automation/overview/supported-networks#base",
      "bnb-chain": "/chainlink-automation/overview/supported-networks#bnb-chain",
      ethereum: "/chainlink-automation/overview/supported-networks#ethereum",
      fantom: "/chainlink-automation/overview/supported-networks#fantom",
      "gnosis-chain": "/chainlink-automation/overview/supported-networks#gnosis-chain-xdai",
      optimism: "/chainlink-automation/overview/supported-networks#optimism",
      polygon: "/chainlink-automation/overview/supported-networks#polygon-matic",
    },
  },
  VRF: {
    learnMorelink: "vrf",
    logo: vrfLogo,
    chains: {
      arbitrum: "/vrf/v2-5/supported-networks#arbitrum-mainnet",
      avalanche: "/vrf/v2-5/supported-networks#avalanche-mainnet",
      "bnb-chain": "/vrf/v2-5/supported-networks#bnb-chain",
      ethereum: "/vrf/v2-5/supported-networks#ethereum-mainnet",
      fantom: "/vrf/v2/subscription/supported-networks#fantom-mainnet",
      polygon: "/vrf/v2-5/supported-networks#polygon-matic-mainnet",
    },
  },
  linkTokenContracts: {
    arbitrum: "/resources/link-token-contracts#arbitrum",
    avalanche: "/resources/link-token-contracts#avalanche",
    base: "/resources/link-token-contracts#base",
    "bnb-chain": "/resources/link-token-contracts#bnb-chain",
    blast: "/resources/link-token-contracts#blast",
    celo: "/resources/link-token-contracts#celo",
    ethereum: "/resources/link-token-contracts#ethereum",
    fantom: "/resources/link-token-contracts#fantom",
    "gnosis-chain": "/resources/link-token-contracts#gnosis-chain-xdai",
    kroma: "/resources/link-token-contracts#kroma",
    linea: "/resources/link-token-contracts#linea",
    metis: "/resources/link-token-contracts#metis",
    mode: "/resources/link-token-contracts#mode",
    moonbeam: "/resources/link-token-contracts#moonbeam",
    moonriver: "/resources/link-token-contracts#moonriver",
    optimism: "/resources/link-token-contracts#optimism",
    polygonzkevm: "/resources/link-token-contracts#polygon-zkevm",
    polygon: "/resources/link-token-contracts#polygon-matic",
    scroll: "/resources/link-token-contracts#scroll",
    solana: "/resources/link-token-contracts#solana",
    wemix: "/resources/link-token-contracts#wemix",
    zksync: "/resources/link-token-contracts#zksync",
  },
}

export const chainNames: Record<string, string> = {
  arbitrum: "Arbitrum",
  avalanche: "Avalanche",
  base: "Base",
  "bnb-chain": "BNB Chain",
  celo: "Celo",
  ethereum: "Ethereum",
  fantom: "Fantom",
  "gnosis-chain": "Gnosis Chain",
  kroma: "Kroma",
  linea: "Linea",
  metis: "Metis",
  moonbeam: "Moonbeam",
  moonriver: "Moonriver",
  optimism: "Optimism",
  polygonzkevm: "Polygon zkEVM",
  polygon: "Polygon",
  scroll: "Scroll",
  solana: "Solana",
  starknet: "Starknet",
  wemix: "Wemix",
  zksync: "zkSync",
  mode: "Mode",
  blast: "Blast",
}
