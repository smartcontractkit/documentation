/**
 * Structured Data Generator
 * 100% Schema.org compliant JSON-LD generation
 *
 * This module generates structured data following Schema.org vocabulary
 * All fields and values comply with Schema.org standards
 */

import type { Metadata, QuickstartsFrontmatter } from "~/content.config.ts"

/**
 * Base URLs - Environment-aware constants
 * These should match the production URLs for structured data consistency
 */
export const DOCS_BASE_URL = "https://docs.chain.link"
export const CHAINLINK_BASE_URL = "https://chain.link"

// Schema.org compliant types
export type SchemaType = "TechArticle" | "HowTo" | "APIReference" | "BreadcrumbList" | "Organization" | "WebSite"

// Schema.org compliant difficulty levels for LearningResource
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced"

// Schema.org compliant audience types
export type AudienceType = "Developer" | "Beginner" | "Professional"

/**
 * Version information interface for API reference pages
 */
export interface VersionInfo {
  version: string
  releaseDate?: string
  isLatest: boolean
  isDeprecated: boolean
  availableVersions?: string[]
  vmType?: string
  canonicalUrl?: string // Override canonical URL for version management
}

/**
 * Base organization data for Chainlink
 * Schema.org Organization type
 */
export const CHAINLINK_ORGANIZATION = {
  "@type": "Organization",
  name: "Chainlink Labs",
  url: CHAINLINK_BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${DOCS_BASE_URL}/images/logo.png`,
    width: 200,
    height: 200,
  },
  sameAs: [
    "https://x.com/chainlink",
    "https://github.com/smartcontractkit",
    "https://discord.com/invite/aSK4zew",
    "https://www.linkedin.com/company/chainlink-labs",
    "https://www.youtube.com/chainlink",
    "https://t.me/chainlinkofficial",
    "https://www.reddit.com/r/Chainlink",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${CHAINLINK_BASE_URL}/support`,
    },
    {
      "@type": "ContactPoint",
      contactType: "technical support",
      email: "security@chain.link",
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "press@chain.link",
    },
  ],
  foundingDate: "2017",
  numberOfEmployees: "501-1000",
} as const

/**
 * Publisher data for documentation
 * Schema.org Organization type
 */
export const CHAINLINK_PUBLISHER = {
  "@type": "Organization",
  name: "Chainlink Documentation",
  url: DOCS_BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${DOCS_BASE_URL}/images/logo.png`,
    width: 200,
    height: 200,
  },
  parentOrganization: CHAINLINK_ORGANIZATION,
} as const

/**
 * Content type detection from URL patterns
 */
export function detectContentType(pathname: string): {
  schemaType: SchemaType
  isLearningResource: boolean
  category: string
} {
  const path = pathname.toLowerCase()

  if (path.includes("/quickstarts/")) {
    return {
      schemaType: "HowTo",
      isLearningResource: true,
      category: "Quickstart",
    }
  }

  if (path.includes("/tutorials/") || path.includes("/getting-started")) {
    return {
      schemaType: "HowTo",
      isLearningResource: true,
      category: "Tutorial",
    }
  }

  if (path.includes("/api-reference/")) {
    return {
      schemaType: "APIReference",
      isLearningResource: false,
      category: "API Reference",
    }
  }

  if (path.includes("/concepts/") || path.includes("/architecture/")) {
    return {
      schemaType: "TechArticle",
      isLearningResource: true,
      category: "Concept",
    }
  }

  // Default to TechArticle
  return {
    schemaType: "TechArticle",
    isLearningResource: false,
    category: "Documentation",
  }
}

/**
 * Extract difficulty level from content
 * Returns Schema.org compliant difficulty levels
 */
export function extractDifficulty(excerpt?: string, pathname?: string): DifficultyLevel {
  const content = (excerpt || pathname || "").toLowerCase()

  if (content.includes("beginner") || content.includes("getting-started") || content.includes("introduction")) {
    return "Beginner"
  }

  if (content.includes("advanced") || content.includes("complex") || content.includes("expert")) {
    return "Advanced"
  }

  return "Intermediate"
}

/**
 * Extract programming languages from content
 * Returns Schema.org compliant programming language names
 */
export function extractProgrammingLanguages(excerpt?: string, pathname?: string): string[] {
  const content = (excerpt || pathname || "").toLowerCase()
  const languages: string[] = []

  if (content.includes("solidity") || content.includes(".sol")) {
    languages.push("Solidity")
  }

  if (content.includes("javascript") || content.includes("js")) {
    languages.push("JavaScript")
  }

  if (content.includes("typescript") || content.includes("ts")) {
    languages.push("TypeScript")
  }

  if (content.includes("python") || content.includes("py")) {
    languages.push("Python")
  }

  if (content.includes("rust") || content.includes("rs")) {
    languages.push("Rust")
  }

  if (content.includes("go") || content.includes("golang")) {
    languages.push("Go")
  }

  if (content.includes("move") && (content.includes("aptos") || content.includes("sui"))) {
    languages.push("Move")
  }

  if (content.includes("tolk")) {
    languages.push("Tolk")
  }

  return languages
}

/**
 * Extract programming model from content based on detected languages and platforms
 * Returns Schema.org compliant programming model
 */
export function extractProgrammingModel(excerpt?: string, pathname?: string): string {
  const content = (excerpt || pathname || "").toLowerCase()
  const languages = extractProgrammingLanguages(excerpt, pathname)

  // Platform-specific models
  if (content.includes("evm") || content.includes("ethereum") || languages.includes("Solidity")) {
    return "Ethereum Virtual Machine"
  }

  if (content.includes("svm") || content.includes("solana") || content.includes("anchor")) {
    return "Solana Virtual Machine"
  }

  if (content.includes("aptos") || content.includes("move")) {
    return "Aptos Move"
  }

  if (content.includes("sui")) {
    return "Sui Move"
  }

  // Language-specific models
  if (languages.includes("JavaScript") || languages.includes("TypeScript")) {
    return "JavaScript Runtime"
  }

  if (languages.includes("Python")) {
    return "Python Runtime"
  }

  if (languages.includes("Rust")) {
    return "Native Compiled"
  }

  if (languages.includes("Go")) {
    return "Native Compiled"
  }

  // Default fallback
  return "Smart Contract"
}

/**
 * Generate Schema.org compliant additionalProperty array for technical metadata
 * Converts non-standard properties to Schema.org PropertyValue format
 */
export function generateTechnicalProperties(
  programmingModel: string,
  targetPlatform: string,
  programmingLanguages?: string[]
): object[] {
  const properties: object[] = []

  // Add programming model as additional property
  if (programmingModel) {
    properties.push({
      "@type": "PropertyValue",
      name: "Programming Model",
      value: programmingModel,
      description: "The programming model or runtime environment used",
    })
  }

  // Add target platform as additional property
  if (targetPlatform) {
    properties.push({
      "@type": "PropertyValue",
      name: "Target Platform",
      value: targetPlatform,
      description: "The target platform or blockchain ecosystem",
    })
  }

  // Add programming languages as additional properties
  if (programmingLanguages && programmingLanguages.length > 0) {
    programmingLanguages.forEach((language) => {
      properties.push({
        "@type": "PropertyValue",
        name: "Programming Language",
        value: language,
        description: "Programming language used in the content",
      })
    })
  }

  return properties
}

/**
 * Detect Chainlink product from pathname
 * Maps pathname to product keys used in productChainLinks
 */
export function detectChainlinkProduct(pathname?: string): string | null {
  if (!pathname) return null

  const path = pathname.toLowerCase()

  // Map pathnames to productChainLinks keys
  if (path.includes("/ccip/")) return "CCIP"
  if (path.includes("/data-feeds/")) return "Data Feeds"
  if (path.includes("/data-streams/")) return "Data Streams"
  if (path.includes("/chainlink-functions/")) return "Functions"
  if (path.includes("/chainlink-automation/")) return "Automation"
  if (path.includes("/vrf/")) return "VRF"

  return null
}

/**
 * Detect multiple Chainlink products from quickstart frontmatter
 * Maps products array to productChainLinks keys
 */
export function detectQuickstartProducts(products?: string[]): string[] {
  if (!products || products.length === 0) return []

  const productMap: Record<string, string> = {
    ccip: "CCIP",
    feeds: "Data Feeds",
    "data-feeds": "Data Feeds",
    "data-streams": "Data Streams",
    functions: "Functions",
    automation: "Automation",
    vrf: "VRF",
  }

  return products.map((product) => productMap[product.toLowerCase()]).filter(Boolean)
}

/**
 * Extract target platform from metadata content
 * Returns Schema.org compliant target platform
 */
export function extractTargetPlatform(excerpt?: string, pathname?: string): string {
  const content = (excerpt || pathname || "").toLowerCase()

  // Check metadata for specific blockchain platforms
  if (content.includes("ethereum") || content.includes("evm")) {
    return "Ethereum Virtual Machine"
  }

  if (content.includes("solana") || content.includes("svm")) {
    return "Solana Virtual Machine"
  }

  if (content.includes("aptos")) {
    return "Aptos"
  }

  if (content.includes("sui")) {
    return "Sui"
  }

  if (content.includes("ton")) {
    return "TON"
  }

  // Default fallback
  return "Blockchain"
}

/**
 * Parse duration string to ISO 8601 format
 * Schema.org requires ISO 8601 duration format (PT30M, PT1H, etc.)
 */
export function parseTimeToISO8601(timeString?: string): string | undefined {
  if (!timeString) return undefined

  const time = timeString.toLowerCase()

  // Match patterns like "30 minutes", "1 hour", "2 hours 30 minutes"
  const hourMatch = time.match(/(\d+)\s*(?:hour|hr)s?/)
  const minuteMatch = time.match(/(\d+)\s*(?:minute|min)s?/)

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0

  if (hours === 0 && minutes === 0) {
    // Default to 15 minutes if no time specified
    return "PT15M"
  }

  let duration = "PT"
  if (hours > 0) duration += `${hours}H`
  if (minutes > 0) duration += `${minutes}M`

  return duration
}

/**
 * Extract tools and prerequisites from content
 */
export function extractToolsAndPrerequisites(
  excerpt?: string,
  pathname?: string
): {
  tools: string[]
  prerequisites: string[]
} {
  const content = (excerpt || pathname || "").toLowerCase()

  const tools: string[] = []
  const prerequisites: string[] = []

  // Common development tools
  const toolMap = {
    hardhat: "Hardhat",
    remix: "Remix IDE",
    metamask: "MetaMask",
    foundry: "Foundry",
    web3: "Web3.js",
    ethers: "Ethers.js",
    viem: "Viem",
  }

  Object.entries(toolMap).forEach(([key, value]) => {
    if (content.includes(key)) {
      tools.push(value)
    }
  })

  // Common prerequisites
  const prereqMap = {
    node: "Node.js",
    npm: "npm",
    yarn: "Yarn",
    git: "Git",
    wallet: "Cryptocurrency Wallet",
  }

  Object.entries(prereqMap).forEach(([key, value]) => {
    if (content.includes(key)) {
      prerequisites.push(value)
    }
  })

  return { tools, prerequisites }
}

/**
 * Generate breadcrumb list from pathname
 * Schema.org BreadcrumbList type
 */
export function generateBreadcrumbList(pathname: string, baseUrl: string): object {
  const parts = pathname.split("/").filter(Boolean)
  const breadcrumbs: object[] = []

  // Add home
  breadcrumbs.push({
    "@type": "ListItem",
    position: 1,
    name: "Documentation",
    item: baseUrl,
  })

  // Add each path segment
  let currentPath = ""
  parts.forEach((part, index) => {
    currentPath += `/${part}`
    breadcrumbs.push({
      "@type": "ListItem",
      position: index + 2,
      name: formatBreadcrumbName(part),
      item: `${baseUrl}${currentPath}`,
    })
  })

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  }
}

/**
 * Format breadcrumb names for display
 */
function formatBreadcrumbName(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Generate main TechArticle structured data
 * 100% Schema.org compliant
 */
export function generateTechArticle(
  metadata: Metadata | undefined,
  title: string,
  canonicalURL: URL,
  pathname: string
): object {
  const { isLearningResource, category } = detectContentType(pathname)
  const difficulty = extractDifficulty(metadata?.excerpt, pathname)
  const product = detectChainlinkProduct(pathname)
  const programmingModel = extractProgrammingModel(metadata?.excerpt, pathname)
  const targetPlatform = extractTargetPlatform(metadata?.excerpt, pathname)
  const programmingLanguages = extractProgrammingLanguages(metadata?.excerpt, pathname)

  // Generate Schema.org compliant technical properties
  const technicalProperties = generateTechnicalProperties(programmingModel, targetPlatform, programmingLanguages)

  const baseArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: metadata?.title || title,
    description: metadata?.description,
    url: canonicalURL.toString(),
    author: CHAINLINK_ORGANIZATION,
    publisher: CHAINLINK_PUBLISHER,
    datePublished: metadata?.datePublished || new Date().toISOString(),
    dateModified: metadata?.lastModified || new Date().toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    genre: category,
    image: {
      "@type": "ImageObject",
      url: metadata?.image
        ? metadata.image.startsWith("http")
          ? metadata.image
          : `${DOCS_BASE_URL}${metadata.image}`
        : `${DOCS_BASE_URL}/images/logo.png`,
      width: 1200,
      height: 630,
    },
    ...(metadata?.excerpt && {
      keywords: metadata.excerpt,
    }),
    // Schema.org compliant technical properties using additionalProperty
    ...(technicalProperties.length > 0 && {
      additionalProperty: technicalProperties,
    }),
    // Add technical article specific properties with product info
    about: {
      "@type": "Thing",
      name: product ? `${product} Development` : "Blockchain Development",
      description: product
        ? `Smart contract and blockchain development using Chainlink ${product}`
        : "Smart contract and blockchain development using Chainlink",
    },
    // Add Chainlink product mention for better topical SEO
    ...(product && {
      mentions: [
        {
          "@type": "Thing",
          name: product,
          description: `Chainlink ${product}`,
        },
      ],
    }),
  }

  // Add LearningResource properties if applicable
  if (isLearningResource) {
    return {
      ...baseArticle,
      "@type": ["TechArticle", "LearningResource"],
      name: metadata?.title || title, // Required for LearningResource
      educationalLevel: difficulty,
      teaches: product ? `${category} for ${product}` : category,
      learningResourceType: category,
      audience: {
        "@type": "Audience",
        audienceType: difficulty === "Beginner" ? "Beginner" : "Developer",
      },
    }
  }

  return baseArticle
}

/**
 * Generate HowTo structured data for tutorials
 * 100% Schema.org compliant
 */
export function generateHowTo(
  metadata: Metadata | undefined,
  title: string,
  canonicalURL: URL,
  pathname: string,
  estimatedTime?: string,
  steps?: { name: string; slug: string }[]
): object {
  const difficulty = extractDifficulty(metadata?.excerpt, pathname)
  const { tools, prerequisites } = extractToolsAndPrerequisites(metadata?.excerpt, pathname)
  const duration = parseTimeToISO8601(estimatedTime)
  const product = detectChainlinkProduct(pathname)
  const programmingModel = extractProgrammingModel(metadata?.excerpt, pathname)
  const targetPlatform = extractTargetPlatform(metadata?.excerpt, pathname)
  const programmingLanguages = extractProgrammingLanguages(metadata?.excerpt, pathname)

  // Generate Schema.org compliant technical properties
  const technicalProperties = generateTechnicalProperties(programmingModel, targetPlatform, programmingLanguages)

  return {
    "@context": "https://schema.org",
    "@type": ["HowTo", "TechArticle"],
    name: metadata?.title || title,
    headline: metadata?.title || title, // Required for TechArticle
    description: metadata?.description,
    url: canonicalURL.toString(),
    author: CHAINLINK_ORGANIZATION,
    publisher: CHAINLINK_PUBLISHER,
    datePublished: metadata?.datePublished || new Date().toISOString(),
    dateModified: metadata?.lastModified || new Date().toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    ...(duration && { totalTime: duration }),
    image: {
      "@type": "ImageObject",
      url: metadata?.image
        ? metadata.image.startsWith("http")
          ? metadata.image
          : `${DOCS_BASE_URL}${metadata.image}`
        : `${DOCS_BASE_URL}/images/logo.png`,
      width: 1200,
      height: 630,
    },
    ...(metadata?.excerpt && {
      keywords: metadata.excerpt,
    }),
    ...(tools.length > 0 && {
      tool: tools.map((tool) => ({
        "@type": "HowToTool",
        name: tool,
      })),
    }),
    ...(prerequisites.length > 0 && {
      supply: prerequisites.map((prereq) => ({
        "@type": "HowToSupply",
        name: prereq,
      })),
    }),
    ...(steps && steps.length > 0
      ? {
          step: steps.map((s) => ({
            "@type": "HowToStep",
            name: s.name,
            url: `${canonicalURL.toString()}#${s.slug}`,
          })),
        }
      : {}),
    // LearningResource properties
    educationalLevel: difficulty,
    teaches: `How to ${(metadata?.title || title).toLowerCase()}`,
    learningResourceType: "Tutorial",
    audience: {
      "@type": "Audience",
      audienceType: difficulty === "Beginner" ? "Beginner" : "Developer",
    },
    // Schema.org compliant technical properties using additionalProperty
    ...(technicalProperties.length > 0 && {
      additionalProperty: technicalProperties,
    }),
    about: {
      "@type": "Thing",
      name: product ? `${product} Development` : "Smart Contract Development",
      description: product
        ? `Building decentralized applications with Chainlink ${product}`
        : "Building decentralized applications with Chainlink",
    },
    // Add Chainlink product mention for better topical SEO
    ...(product && {
      mentions: [
        {
          "@type": "Thing",
          name: product,
          description: `Chainlink ${product}`,
        },
      ],
    }),
  }
}

/**
 * Generate APIReference structured data
 * 100% Schema.org compliant with optional version information
 */
export function generateAPIReference(
  metadata: Metadata | undefined,
  title: string,
  canonicalURL: URL,
  pathname: string,
  versionInfo?: VersionInfo
): object {
  const programmingModel = extractProgrammingModel(metadata?.excerpt, pathname)
  const targetPlatform = extractTargetPlatform(metadata?.excerpt, pathname)
  const programmingLanguages = extractProgrammingLanguages(metadata?.excerpt, pathname)
  const product = detectChainlinkProduct(pathname)

  // Use provided version info or extract from metadata/pathname
  const versionMatch = pathname.match(/v(\d+\.\d+\.\d+)/)
  const version = versionInfo?.version || metadata?.version || (versionMatch ? versionMatch[1] : undefined)
  const releaseDate = versionInfo?.releaseDate

  // Use version-specific canonical URL if provided (for proper version SEO)
  const resolvedCanonicalUrl = (versionInfo?.canonicalUrl || canonicalURL.toString()).replace(/\/+$/, "")

  // Schema.org compliant technical properties
  const technicalProperties = generateTechnicalProperties(programmingModel, targetPlatform, programmingLanguages)

  return {
    "@context": "https://schema.org",
    "@type": ["APIReference", "TechArticle"],
    name: metadata?.title || title,
    headline: metadata?.title || title, // Required for TechArticle
    description: metadata?.description,
    url: resolvedCanonicalUrl,
    author: CHAINLINK_ORGANIZATION,
    publisher: CHAINLINK_PUBLISHER,
    datePublished: releaseDate || metadata?.datePublished || new Date().toISOString(),
    dateModified: releaseDate || metadata?.lastModified || new Date().toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    genre: "API Reference",
    image: {
      "@type": "ImageObject",
      url: metadata?.image
        ? metadata.image.startsWith("http")
          ? metadata.image
          : `${DOCS_BASE_URL}${metadata.image}`
        : `${DOCS_BASE_URL}/images/logo.png`,
      width: 1200,
      height: 630,
    },
    ...(metadata?.excerpt && {
      keywords: metadata.excerpt,
    }),
    // Schema.org compliant technical properties using additionalProperty
    ...(technicalProperties.length > 0 && {
      additionalProperty: technicalProperties,
    }),
    about: {
      "@type": "Thing",
      name: product ? `Chainlink ${product}` : "Chainlink Protocol",
      description: product
        ? `${product} - Decentralized oracle network for smart contracts`
        : "Decentralized oracle network for smart contracts",
    },
    // Add Chainlink product mention for better topical SEO
    ...(product && {
      mentions: [
        {
          "@type": "Thing",
          name: product,
          description: `Chainlink ${product}`,
        },
      ],
    }),

    // Add version-specific structured data if available
    ...(versionInfo && {
      version,
      isPartOf: {
        "@type": "SoftwareApplication",
        name: product ? `Chainlink ${product}` : "Chainlink Protocol",
        description: product
          ? `${product} - Decentralized oracle network for smart contracts`
          : "Decentralized oracle network for smart contracts",
        operatingSystem: "Blockchain",
        applicationCategory: "DeveloperApplication",
        url: `${DOCS_BASE_URL}/${product?.toLowerCase()}/api-reference/`,
        ...(releaseDate && {
          datePublished: releaseDate,
          dateModified: releaseDate,
        }),
        // Use only valid Schema.org properties for SoftwareApplication
        softwareVersion: version,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": resolvedCanonicalUrl,
      },
    }),
  }
}

/**
 * Generate WebSite structured data for the main site
 * 100% Schema.org compliant
 */
export function generateWebSite(baseUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Chainlink Documentation",
    alternateName: "Chainlink Docs",
    url: baseUrl,
    description: "Official documentation for Chainlink, the decentralized oracle network",
    publisher: CHAINLINK_PUBLISHER,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Documentation Sections",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          url: `${baseUrl}/data-feeds`,
          name: "Data Feeds",
        },
        {
          "@type": "ListItem",
          position: 2,
          url: `${baseUrl}/ccip`,
          name: "Cross-Chain Interoperability Protocol (CCIP)",
        },
        {
          "@type": "ListItem",
          position: 3,
          url: `${baseUrl}/chainlink-automation`,
          name: "Chainlink Automation",
        },
        {
          "@type": "ListItem",
          position: 4,
          url: `${baseUrl}/vrf`,
          name: "Verifiable Random Function (VRF)",
        },
        {
          "@type": "ListItem",
          position: 5,
          url: `${baseUrl}/chainlink-functions`,
          name: "Chainlink Functions",
        },
      ],
    },
  }
}

/**
 * Generate HowTo structured data for quickstarts
 * 100% Schema.org compliant with quickstart-specific properties
 */
export function generateQuickstartHowTo(
  frontmatter: QuickstartsFrontmatter,
  title: string,
  canonicalURL: URL,
  pathname: string,
  steps?: { name: string; slug: string }[]
): object {
  const difficulty = extractDifficulty(frontmatter.excerpt, pathname)
  const duration = parseTimeToISO8601(frontmatter.time)
  const { tools, prerequisites } = extractToolsAndPrerequisites(
    frontmatter.excerpt + " " + (frontmatter.requires || ""),
    pathname
  )

  // Detect products from curated quickstart metadata
  const detectedProducts = detectQuickstartProducts(frontmatter.products)
  const primaryProduct = detectedProducts.length > 0 ? detectedProducts[0] : null

  // Add requires to prerequisites if not already detected
  if (frontmatter.requires) {
    const requires = frontmatter.requires
    if (!prerequisites.some((p) => requires.toLowerCase().includes(p.toLowerCase()))) {
      prerequisites.push(requires)
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": ["HowTo", "TechArticle"],
    name: frontmatter.title,
    headline: frontmatter.title, // Required for TechArticle
    description: frontmatter.description,
    url: canonicalURL.toString(),
    author: CHAINLINK_ORGANIZATION,
    publisher: CHAINLINK_PUBLISHER,
    datePublished: frontmatter.datePublished || new Date().toISOString(),
    dateModified: frontmatter.lastModified || new Date().toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    ...(duration && { totalTime: duration }),
    image: {
      "@type": "ImageObject",
      url: `${DOCS_BASE_URL}/images/quickstarts/feature/${frontmatter.image}`,
      width: 1200,
      height: 630,
    },
    ...(frontmatter.excerpt && {
      keywords: frontmatter.excerpt,
    }),
    ...(tools.length > 0 && {
      tool: tools.map((tool) => ({
        "@type": "HowToTool",
        name: tool,
      })),
    }),
    ...(prerequisites.length > 0 && {
      supply: prerequisites.map((prereq) => ({
        "@type": "HowToSupply",
        name: prereq,
      })),
    }),
    ...(steps && steps.length > 0
      ? {
          step: steps.map((s) => ({
            "@type": "HowToStep",
            name: s.name,
            url: `${canonicalURL.toString()}#${s.slug}`,
          })),
        }
      : {}),
    // LearningResource properties
    educationalLevel: difficulty,
    teaches: `How to ${frontmatter.title.toLowerCase()}`,
    learningResourceType: "Quickstart",
    audience: {
      "@type": "Audience",
      audienceType: difficulty === "Beginner" ? "Beginner" : "Developer",
    },
    // Note: programmingLanguage removed for LearningResource compatibility
    about: {
      "@type": "Thing",
      name: primaryProduct ? `${primaryProduct} Development` : "Smart Contract Development",
      description: primaryProduct
        ? `Building decentralized applications with Chainlink ${primaryProduct}`
        : "Building decentralized applications with Chainlink",
    },
    // Quickstart-specific properties
    genre: "Quickstart Guide",
    ...(frontmatter.githubSourceCodeUrl && {
      workExample: {
        "@type": "SoftwareSourceCode",
        name: `${frontmatter.title} - Source Code`,
        description: "Complete source code and examples for this tutorial",
        codeRepository: frontmatter.githubSourceCodeUrl,
        url: frontmatter.githubSourceCodeUrl,
      },
    }),
    // Add Chainlink product mentions for better topical SEO
    ...(frontmatter.products && {
      mentions: frontmatter.products.map((product) => ({
        "@type": "Thing",
        name: product === "general" ? "Chainlink" : product.toUpperCase(),
      })),
    }),
  }
}

/**
 * Main function to generate all structured data for a page
 * Returns array of Schema.org compliant objects
 * Supports both regular content and quickstarts
 */
export function generateStructuredData(
  metadata: Metadata | undefined,
  title: string,
  canonicalURL: URL,
  pathname: string,
  estimatedTime?: string,
  versionInfo?: VersionInfo,
  steps?: { name: string; slug: string }[]
): object[]

export function generateStructuredData(
  frontmatter: QuickstartsFrontmatter,
  title: string,
  canonicalURL: URL,
  pathname: string
): object[]

export function generateStructuredData(
  metadataOrFrontmatter: Metadata | QuickstartsFrontmatter | undefined,
  title: string,
  canonicalURL: URL,
  pathname: string,
  estimatedTime?: string,
  versionInfo?: VersionInfo,
  steps?: { name: string; slug: string }[]
): object[] {
  const structuredData: object[] = []

  // Generate breadcrumbs for all pages except home
  if (pathname !== "/") {
    structuredData.push(generateBreadcrumbList(pathname, canonicalURL.origin))
  }

  // Check if this is a quickstart by checking for quickstart-specific properties
  const isQuickstart = metadataOrFrontmatter && "time" in metadataOrFrontmatter && "products" in metadataOrFrontmatter

  if (isQuickstart) {
    // Handle quickstarts
    structuredData.push(
      generateQuickstartHowTo(metadataOrFrontmatter as QuickstartsFrontmatter, title, canonicalURL, pathname, steps)
    )
  } else {
    // Handle regular content
    const metadata = metadataOrFrontmatter as Metadata | undefined
    const { schemaType } = detectContentType(pathname)

    // Generate main content structured data based on type
    switch (schemaType) {
      case "HowTo":
        structuredData.push(generateHowTo(metadata, title, canonicalURL, pathname, estimatedTime, steps))
        break
      case "APIReference":
        structuredData.push(generateAPIReference(metadata, title, canonicalURL, pathname, versionInfo))
        break
      case "TechArticle":
      default:
        structuredData.push(generateTechArticle(metadata, title, canonicalURL, pathname))
        break
    }
  }

  // Add WebSite structured data for homepage
  if (pathname === "/") {
    structuredData.push(generateWebSite(canonicalURL.origin))
  }

  return structuredData
}
