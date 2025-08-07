/**
 * CCIP Directory Structured Data Generator
 * 100% Schema.org compliant JSON-LD generation for CCIP directory pages
 */

import { Environment } from "../config/data/ccip/index.js"
import type { Network } from "../config/data/ccip/index.js"

const DOCS_BASE_URL = "https://docs.chain.link"

/**
 * Generate DataCatalog structured data for CCIP directory landing pages
 * @see https://schema.org/DataCatalog
 */
export function generateDirectoryStructuredData(
  environment: Environment,
  networks: Network[],
  tokens: string[],
  canonicalURL: string
): object[] {
  const environmentText = environment === Environment.Mainnet ? "Mainnet" : "Testnet"

  const structuredData: object[] = []

  // DataCatalog for the directory itself
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: `CCIP Network Directory - ${environmentText}`,
    description: `Real-time status and information for Chainlink Cross-Chain Interoperability Protocol networks on ${environmentText}`,
    url: canonicalURL,
    provider: {
      "@type": "Organization",
      name: "Chainlink Labs",
      url: "https://chain.link",
    },
    dataset: networks.map((network) => ({
      "@type": "Dataset",
      name: `${network.name} CCIP Network Data`,
      description: `Cross-chain interoperability data for ${network.name} including supported tokens and active lanes`,
      url: `${DOCS_BASE_URL}/ccip/directory/${environment}/chain/${network.chain}`,
      provider: {
        "@type": "Organization",
        name: "Chainlink Labs",
      },
    })),
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "en",
  })

  // BreadcrumbList for navigation
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Documentation",
        item: DOCS_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "CCIP",
        item: `${DOCS_BASE_URL}/ccip`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Directory",
        item: `${DOCS_BASE_URL}/ccip/directory`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: environmentText,
        item: canonicalURL,
      },
    ],
  })

  return structuredData
}

/**
 * Generate Service structured data for individual chain pages
 * @see https://schema.org/Service
 */
export function generateChainStructuredData(
  network: Network,
  environment: Environment,
  tokenCount: number,
  laneCount: number,
  canonicalURL: string
): object[] {
  const environmentText = environment === Environment.Mainnet ? "Mainnet" : "Testnet"

  const structuredData: object[] = []

  // Service for the blockchain network
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${network.name} CCIP Network`,
    description: `Cross-chain interoperability service for ${network.name} blockchain on ${environmentText}`,
    url: canonicalURL,
    serviceType: "Blockchain Interoperability Protocol",
    provider: {
      "@type": "Organization",
      name: "Chainlink Labs",
      url: "https://chain.link",
    },
    areaServed: {
      "@type": "Place",
      name: "Global",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: network.explorer?.baseUrl || canonicalURL,
      name: `${network.name} Network Explorer`,
    },
    category: "Cryptocurrency",
    audience: {
      "@type": "Audience",
      audienceType: "Developers",
    },
  })

  // BreadcrumbList for chain page navigation
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Documentation",
        item: DOCS_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "CCIP",
        item: `${DOCS_BASE_URL}/ccip`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Directory",
        item: `${DOCS_BASE_URL}/ccip/directory`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: environmentText,
        item: `${DOCS_BASE_URL}/ccip/directory/${environment}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: network.name,
        item: canonicalURL,
      },
    ],
  })

  return structuredData
}

/**
 * Generate FinancialProduct structured data for token pages
 * @see https://schema.org/FinancialProduct
 */
export function generateTokenStructuredData(
  token: string,
  environment: Environment,
  chainCount: number,
  canonicalURL: string
): object[] {
  const environmentText = environment === Environment.Mainnet ? "Mainnet" : "Testnet"

  const structuredData: object[] = []

  // FinancialProduct for the token
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${token} Cross-Chain Token`,
    description: `${token} cryptocurrency token with cross-chain transfer capabilities via Chainlink CCIP on ${environmentText}`,
    url: canonicalURL,
    category: "Cryptocurrency",
    provider: {
      "@type": "Organization",
      name: "Chainlink Labs",
      url: "https://chain.link",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Cryptocurrency Traders",
    },
    feesAndCommissionsSpecification: "Variable fees based on destination network and token transfer mechanism",
  })

  // BreadcrumbList for token page navigation
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Documentation",
        item: DOCS_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "CCIP",
        item: `${DOCS_BASE_URL}/ccip`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Directory",
        item: `${DOCS_BASE_URL}/ccip/directory`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: environmentText,
        item: `${DOCS_BASE_URL}/ccip/directory/${environment}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: token,
        item: canonicalURL,
      },
    ],
  })

  return structuredData
}

/**
 * Generate Service structured data for decommissioned chain pages
 * @see https://schema.org/Service
 */
export function generateDecommissionedChainStructuredData(
  network: { name: string; chain: string; chainSelector: string; logo: string },
  environment: Environment,
  canonicalURL: string
): object[] {
  const environmentText = environment === Environment.Mainnet ? "Mainnet" : "Testnet"

  const structuredData: object[] = []

  // Service for the decommissioned blockchain network
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${network.name} CCIP Network (Decommissioned)`,
    description: `Decommissioned cross-chain interoperability service for ${network.name} blockchain on ${environmentText}. Historical data remains accessible.`,
    url: canonicalURL,
    serviceType: "Blockchain Interoperability Protocol",
    provider: {
      "@type": "Organization",
      name: "Chainlink Labs",
      url: "https://chain.link",
    },
    areaServed: {
      "@type": "Place",
      name: "Global",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://ccip.chain.link/",
      name: "CCIP Explorer - Historical Data",
    },
    category: "Cryptocurrency",
    audience: {
      "@type": "Audience",
      audienceType: "Developers",
    },
    serviceOutput: {
      "@type": "Thing",
      name: "Historical Transaction Data",
      description: "Access to historical cross-chain transaction records",
    },
  })

  // BreadcrumbList for decommissioned chain page navigation
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Documentation",
        item: DOCS_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "CCIP",
        item: `${DOCS_BASE_URL}/ccip`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Directory",
        item: `${DOCS_BASE_URL}/ccip/directory`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: environmentText,
        item: `${DOCS_BASE_URL}/ccip/directory/${environment}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: `${network.name} (Decommissioned)`,
        item: canonicalURL,
      },
    ],
  })

  return structuredData
}
