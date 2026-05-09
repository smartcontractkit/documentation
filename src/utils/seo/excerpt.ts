/**
 * Semantic keyword cluster definition
 */
interface SemanticCluster {
  coreTerms: string[] // Primary concepts (always include if missing)
  synonyms: string[] // Alternative terms (include strategically)
  intentPhrases: string[] // User search phrases (high-value additions)
  modifiers: string[] // Decision-making keywords (selective inclusion)
}

/**
 * Enhance excerpt with path-based keywords for better SEO.
 * Automatically appends relevant semantic clusters based on URL path patterns.
 *
 * @param originalExcerpt - The original excerpt from frontmatter
 * @param pathname - The current page pathname
 * @returns Enhanced excerpt with comprehensive keyword coverage
 */
export function enhanceExcerpt(originalExcerpt: string, pathname: string): string {
  if (!originalExcerpt || !pathname) {
    return originalExcerpt || ""
  }

  // Define semantic keyword clusters for different paths
  const pathKeywordClusters = new Map<string, SemanticCluster>([
    [
      "/ccip/",
      {
        coreTerms: ["bridge", "token bridge", "cross-chain bridge"],
        synonyms: ["crypto bridge", "asset bridge", "blockchain bridge"],
        intentPhrases: ["bridge tokens", "cross-chain transfer"],
        modifiers: ["secure bridge", "fast bridge", "low fees"],
      },
    ],

    // Future expansions:
    // ["/vrf/", {
    //   coreTerms: ["random number generation", "verifiable randomness"],
    //   synonyms: ["blockchain randomness", "cryptographic random"],
    //   intentPhrases: ["generate random numbers", "secure randomness"],
    //   modifiers: ["provably fair", "tamper-proof"]
    // }],
  ])

  let enhancedExcerpt = originalExcerpt

  // Apply semantic keyword enhancement
  for (const [pathPrefix, cluster] of pathKeywordClusters) {
    if (pathname.startsWith(pathPrefix)) {
      enhancedExcerpt = applySEOCluster(enhancedExcerpt, cluster, pathname)
      break // Only apply one cluster per path
    }
  }

  // Clean up and optimize
  return optimizeKeywordString(enhancedExcerpt)
}

/**
 * Apply semantic cluster to excerpt with intelligent selection
 */
function applySEOCluster(excerpt: string, cluster: SemanticCluster, pathname: string): string {
  let enhanced = excerpt
  const lowerExcerpt = excerpt.toLowerCase()

  // 1. Always add missing core terms (critical for classification)
  for (const term of cluster.coreTerms) {
    if (!hasKeywordVariant(lowerExcerpt, term)) {
      enhanced = `${enhanced} ${term}`
    }
  }

  // 2. Add strategic synonyms (avoid keyword stuffing)
  const synonymsToAdd = cluster.synonyms.filter((synonym) => !hasKeywordVariant(lowerExcerpt, synonym)).slice(0, 2) // Limit to 2 synonyms max

  for (const synonym of synonymsToAdd) {
    enhanced = `${enhanced} ${synonym}`
  }

  // 3. Add high-value intent phrases (if tutorial/guide content)
  if (pathname.includes("/tutorial") || pathname.includes("/guide")) {
    const intentToAdd = cluster.intentPhrases.filter((phrase) => !hasKeywordVariant(lowerExcerpt, phrase)).slice(0, 1) // Limit to 1 intent phrase

    for (const intent of intentToAdd) {
      enhanced = `${enhanced} ${intent}`
    }
  }

  // 4. Add selective modifiers based on content type
  if (shouldAddModifiers(pathname)) {
    const modifierToAdd = cluster.modifiers.find((modifier) => !hasKeywordVariant(lowerExcerpt, modifier))

    if (modifierToAdd) {
      enhanced = `${enhanced} ${modifierToAdd}`
    }
  }

  return enhanced
}

/**
 * Check if excerpt contains keyword or its variants
 */
function hasKeywordVariant(lowerExcerpt: string, keyword: string): boolean {
  const keywordParts = keyword.toLowerCase().split(" ")

  // Check for exact phrase
  if (lowerExcerpt.includes(keyword.toLowerCase())) {
    return true
  }

  // Check if all keyword parts exist (different order/spacing)
  return keywordParts.every((part) => lowerExcerpt.includes(part))
}

/**
 * Determine if modifiers should be added based on content context
 */
function shouldAddModifiers(pathname: string): boolean {
  // Add modifiers for comparison/selection content
  return (
    pathname.includes("/tutorial") ||
    pathname.includes("/comparison") ||
    pathname.includes("/guide") ||
    pathname.includes("/best-practices")
  )
}

/**
 * Optimize the final keyword string for SEO
 */
function optimizeKeywordString(keywords: string): string {
  return keywords
    .replace(/\s+/g, " ") // Normalize spaces
    .trim() // Remove leading/trailing spaces
    .substring(0, 500) // Limit total length (SEO best practice)
}
