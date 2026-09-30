/**
 * Extract semantic entities for Schema.org about/mentions properties
 * Provides stronger signals than keywords alone by declaring specific entities
 */

export interface SemanticEntity {
  "@type": string
  name: string
  description?: string
  sameAs?: string[] // URLs to authoritative sources
}

export interface EntityAnalysis {
  about: SemanticEntity[] // Primary topics the content is about
}

// Path and title words that are acronyms. Naive title case turns "ccip" into "Ccip"
// and "cre" into "Cre". Google shows those schema names in search results.
const ACRONYM_LABELS: Record<string, string> = {
  abi: "ABI",
  ace: "ACE",
  ai: "AI",
  apac: "APAC",
  api: "API",
  apis: "APIs",
  aws: "AWS",
  ccip: "CCIP",
  cct: "CCT",
  cctp: "CCTP",
  ccv: "CCV",
  ccvs: "CCVs",
  clf: "CLF",
  cli: "CLI",
  cre: "CRE",
  crec: "CREC",
  dex: "DEX",
  don: "DON",
  dta: "DTA",
  ens: "ENS",
  eoa: "EOA",
  erc20: "ERC20",
  eth: "ETH",
  evm: "EVM",
  ftf: "FTF",
  http: "HTTP",
  kv: "KV",
  mvr: "MVR",
  nft: "NFT",
  por: "PoR",
  rmn: "RMN",
  rwa: "RWA",
  sdk: "SDK",
  svm: "SVM",
  svr: "SVR",
  ton: "TON",
  tron: "TRON",
  ts: "TS",
  ui: "UI",
  usdc: "USDC",
  vrf: "VRF",
  ws: "WS",
}

export function formatLabelWord(word: string): string {
  const known = ACRONYM_LABELS[word.toLowerCase()]
  if (known) return known
  // Keep a title token that is already all caps, such as "DON" or "USDC".
  if (word.length > 1 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Analyze content to extract relevant entities for stronger SEO signals
 */
export function extractContentEntities(excerpt: string, pathname: string, title?: string): EntityAnalysis {
  const entities: EntityAnalysis = {
    about: [],
  }

  // Parse title for direct about entities (simple approach)
  if (title) {
    const titleWords = title
      .replace(/[^\w\s]/g, " ") // Remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 2) // Remove short words

    // Add title-based about entities
    for (const word of titleWords) {
      const key = word.toLowerCase()
      if (!["the", "and", "with", "for", "how", "tutorial", "guide"].includes(key)) {
        entities.about.push({
          "@type": "Thing",
          name: formatLabelWord(word),
          description: `Content about ${key}`,
        })
      }
    }
  }

  // Focus only on title-based about entities for stronger, maintainable SEO

  // No mentions extraction - focus on about entities for stronger signals
  return entities
}

/**
 * Convert space-separated keywords to comma-separated format for better SEO
 */
export function formatKeywordsForSEO(keywords: string): string {
  if (!keywords) return ""

  // Split on spaces, remove duplicates, rejoin with commas
  const keywordArray = keywords
    .split(/\s+/)
    .filter((keyword) => keyword.length > 2) // Remove very short words
    .filter((keyword, index, array) => array.indexOf(keyword) === index) // Remove duplicates

  return keywordArray.join(", ")
}

/**
 * Generate enhanced Schema.org properties with entities and formatted keywords
 */
export function generateEnhancedSchemaProperties(
  baseProperties: Record<string, unknown>,
  excerpt: string,
  pathname: string,
  title?: string
): Record<string, unknown> {
  const entities = extractContentEntities(excerpt, pathname, title)
  const formattedKeywords = formatKeywordsForSEO(excerpt)

  return {
    ...baseProperties,

    // Enhanced keywords (comma-separated for better parsing)
    ...(formattedKeywords && {
      keywords: formattedKeywords,
    }),

    // Primary topics (what the content is fundamentally about)
    ...(entities.about.length > 0 && {
      about: entities.about.length === 1 ? entities.about[0] : entities.about,
    }),
  }
}
