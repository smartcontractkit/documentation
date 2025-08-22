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
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 2) // Remove short words

    // Add title-based about entities
    for (const word of titleWords) {
      if (!["the", "and", "with", "for", "how", "tutorial", "guide"].includes(word)) {
        entities.about.push({
          "@type": "Thing",
          name: word.charAt(0).toUpperCase() + word.slice(1),
          description: `Content about ${word}`,
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
