// Helper function to normalize technology names for icon paths
export const normalizeTechnologyName = (technology: string): string => {
  // Map of special cases for technology names
  const specialCases: Record<string, string> = {
    ETHEREUM: "ethereum",
    BNB: "bnb-chain",
    AVALANCHE: "avalanche",
    POLYGON: "polygon",
    POLYGON_ZKEVM: "polygonzkevm",
    ARBITRUM: "arbitrum",
    OPTIMISM: "optimism",
    GNOSIS: "gnosis-chain",
    FANTOM: "fantom",
    CELO: "celo",
    BASE: "base",
    LINEA: "linea",
    ZKSYNC: "zksync",
    SCROLL: "scroll",
    MANTLE: "mantle",
    METIS: "metis",
    KROMA: "kroma",
    BLAST: "blast",
    MODE: "mode",
    RONIN: "ronin",
    WEMIX: "wemix",
    SONEIUM: "soneium",
    ASTAR: "astar",
    ZIRCUIT: "zircuit",
    BSQUARED: "bsquared",
    SHIBARIUM: "shibarium",
    SONIC: "sonic",
    BOB: "bob",
    OP: "optimism", // Special case for Functions page
  }

  // Check if we have a special case for this technology
  if (specialCases[technology]) {
    return specialCases[technology]
  }

  // Default: convert to lowercase and replace underscores with hyphens
  return technology.toLowerCase().replace(/[_ ]/g, "-")
}
