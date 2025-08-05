/**
 * Structured Data Generator
 * 100% Schema.org compliant JSON-LD generation
 *
 * This module generates structured data following Schema.org vocabulary
 * All fields and values comply with Schema.org standards
 */

import type { Metadata, QuickstartsFrontmatter } from "~/content.config.ts"

// Schema.org compliant types
export type SchemaType = "TechArticle" | "HowTo" | "APIReference" | "BreadcrumbList" | "Organization" | "WebSite"

// Schema.org compliant difficulty levels for LearningResource
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced"

// Schema.org compliant audience types
export type AudienceType = "Developer" | "Beginner" | "Professional"

/**
 * Base organization data for Chainlink
 * Schema.org Organization type
 */
export const CHAINLINK_ORGANIZATION = {
  "@type": "Organization",
  name: "Chainlink Labs",
  url: "https://chain.link",
  logo: {
    "@type": "ImageObject",
    url: "https://docs.chain.link/images/logo.png",
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
      url: "https://chain.link/support",
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
  url: "https://docs.chain.link",
  logo: {
    "@type": "ImageObject",
    url: "https://docs.chain.link/images/logo.png",
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

  return languages
}

/**
 * Extract blockchain networks from content
 */
export function extractNetworks(excerpt?: string, pathname?: string): string[] {
  const content = (excerpt || pathname || "").toLowerCase()
  const networks: string[] = []

  const networkMap = {
    ethereum: "Ethereum",
    polygon: "Polygon",
    arbitrum: "Arbitrum",
    optimism: "Optimism",
    base: "Base",
    avalanche: "Avalanche",
    bsc: "BNB Smart Chain",
    solana: "Solana",
    svm: "Solana",
  }

  Object.entries(networkMap).forEach(([key, value]) => {
    if (content.includes(key)) {
      networks.push(value)
    }
  })

  return [...new Set(networks)] // Remove duplicates
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
    truffle: "Truffle",
    ganache: "Ganache",
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
  const programmingLanguages = extractProgrammingLanguages(metadata?.excerpt, pathname)
  const networks = extractNetworks(metadata?.excerpt, pathname)

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
          : `https://docs.chain.link${metadata.image}`
        : "https://docs.chain.link/images/logo.png",
      width: 1200,
      height: 630,
    },
    ...(metadata?.excerpt && {
      keywords: metadata.excerpt,
    }),
    ...(programmingLanguages.length > 0 && {
      programmingLanguage: programmingLanguages,
    }),
    // Add technical article specific properties
    about: {
      "@type": "Thing",
      name: "Blockchain Development",
      description: "Smart contract and blockchain development using Chainlink",
    },
  }

  // Add LearningResource properties if applicable
  if (isLearningResource) {
    return {
      ...baseArticle,
      "@type": ["TechArticle", "LearningResource"],
      name: metadata?.title || title, // Required for LearningResource
      educationalLevel: difficulty,
      teaches: networks.length > 0 ? `${category} for ${networks.join(", ")}` : category,
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
  estimatedTime?: string
): object {
  const difficulty = extractDifficulty(metadata?.excerpt, pathname)
  const { tools, prerequisites } = extractToolsAndPrerequisites(metadata?.excerpt, pathname)
  const duration = parseTimeToISO8601(estimatedTime)
  const programmingLanguages = extractProgrammingLanguages(metadata?.excerpt, pathname)

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
          : `https://docs.chain.link${metadata.image}`
        : "https://docs.chain.link/images/logo.png",
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
    // LearningResource properties
    educationalLevel: difficulty,
    teaches: `How to ${(metadata?.title || title).toLowerCase()}`,
    learningResourceType: "Tutorial",
    audience: {
      "@type": "Audience",
      audienceType: difficulty === "Beginner" ? "Beginner" : "Developer",
    },
    ...(programmingLanguages.length > 0 && {
      programmingLanguage: programmingLanguages,
    }),
    about: {
      "@type": "Thing",
      name: "Smart Contract Development",
      description: "Building decentralized applications with Chainlink",
    },
  }
}

/**
 * Generate APIReference structured data
 * 100% Schema.org compliant
 */
export function generateAPIReference(
  metadata: Metadata | undefined,
  title: string,
  canonicalURL: URL,
  pathname: string
): object {
  const programmingLanguages = extractProgrammingLanguages(metadata?.excerpt, pathname)

  // Extract version from metadata or pathname
  const versionMatch = pathname.match(/v(\d+\.\d+\.\d+)/)
  const version = metadata?.version || (versionMatch ? versionMatch[1] : undefined)

  return {
    "@context": "https://schema.org",
    "@type": ["APIReference", "TechArticle"],
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
    genre: "API Reference",
    ...(version && { version }),
    image: {
      "@type": "ImageObject",
      url: metadata?.image
        ? metadata.image.startsWith("http")
          ? metadata.image
          : `https://docs.chain.link${metadata.image}`
        : "https://docs.chain.link/images/logo.png",
      width: 1200,
      height: 630,
    },
    ...(metadata?.excerpt && {
      keywords: metadata.excerpt,
    }),
    ...(programmingLanguages.length > 0 && {
      programmingLanguage: programmingLanguages,
    }),
    programmingModel: "Smart Contract",
    targetPlatform: "Blockchain",
    about: {
      "@type": "SoftwareApplication",
      name: "Chainlink Protocol",
      description: "Decentralized oracle network for smart contracts",
    },
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
  pathname: string
): object {
  const difficulty = extractDifficulty(frontmatter.excerpt, pathname)
  const duration = parseTimeToISO8601(frontmatter.time)
  const programmingLanguages = extractProgrammingLanguages(frontmatter.excerpt, pathname)
  const { tools, prerequisites } = extractToolsAndPrerequisites(
    frontmatter.excerpt + " " + (frontmatter.requires || ""),
    pathname
  )

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
      url: `https://docs.chain.link/images/quickstarts/feature/${frontmatter.image}`,
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
    // LearningResource properties
    educationalLevel: difficulty,
    teaches: `How to ${frontmatter.title.toLowerCase()}`,
    learningResourceType: "Quickstart",
    audience: {
      "@type": "Audience",
      audienceType: difficulty === "Beginner" ? "Beginner" : "Developer",
    },
    ...(programmingLanguages.length > 0 && {
      programmingLanguage: programmingLanguages,
    }),
    about: {
      "@type": "Thing",
      name: "Smart Contract Development",
      description: "Building decentralized applications with Chainlink",
    },
    // Quickstart-specific properties
    genre: "Quickstart Guide",
    ...(frontmatter.githubSourceCodeUrl && {
      codeRepository: frontmatter.githubSourceCodeUrl,
    }),
    // Products/tags
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
  estimatedTime?: string
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
  estimatedTime?: string
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
      generateQuickstartHowTo(metadataOrFrontmatter as QuickstartsFrontmatter, title, canonicalURL, pathname)
    )
  } else {
    // Handle regular content
    const metadata = metadataOrFrontmatter as Metadata | undefined
    const { schemaType } = detectContentType(pathname)

    // Generate main content structured data based on type
    switch (schemaType) {
      case "HowTo":
        structuredData.push(generateHowTo(metadata, title, canonicalURL, pathname, estimatedTime))
        break
      case "APIReference":
        structuredData.push(generateAPIReference(metadata, title, canonicalURL, pathname))
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
