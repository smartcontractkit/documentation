export type LlmsSectionConfig = {
  root: string
  includeGlobs: string[]
  excludeGlobs?: string[]
  order?: string[]
  languages?: string[] // Supported languages for this section (if applicable)
}

// Central list of sections that expose llms-full.txt or llms-full-[lang].txt
export const SUPPORTED_LLM_SECTIONS = [
  "cre",
  "vrf",
  "ccip",
  "data-feeds",
  "data-streams",
  "dta-technical-standard",
  "datalink",
  "chainlink-functions",
  "chainlink-automation",
  "resources",
  "architecture-overview",
  "getting-started",
  "chainlink-nodes",
  "chainlink-local",
] as const

export type SupportedSection = (typeof SUPPORTED_LLM_SECTIONS)[number]

// Configuration for each section
export const LLM_SECTIONS_CONFIG: Record<SupportedSection, LlmsSectionConfig> = {
  cre: {
    root: "src/content/cre",
    includeGlobs: ["**/*.mdx"],
    languages: ["go", "ts"], // CRE has language-specific files
  },
  vrf: {
    root: "src/content/vrf",
    includeGlobs: ["**/*.mdx"],
  },
  ccip: {
    root: "src/content/ccip",
    includeGlobs: ["**/*.mdx"],
  },
  "data-feeds": {
    root: "src/content/data-feeds",
    includeGlobs: ["**/*.mdx"],
  },
  "data-streams": {
    root: "src/content/data-streams",
    includeGlobs: ["**/*.mdx"],
  },
  "dta-technical-standard": {
    root: "src/content/dta-technical-standard",
    includeGlobs: ["**/*.mdx"],
  },
  datalink: {
    root: "src/content/datalink",
    includeGlobs: ["**/*.mdx"],
  },
  "chainlink-functions": {
    root: "src/content/chainlink-functions",
    includeGlobs: ["**/*.mdx"],
  },
  "chainlink-automation": {
    root: "src/content/chainlink-automation",
    includeGlobs: ["**/*.mdx"],
  },
  resources: {
    root: "src/content/resources",
    includeGlobs: ["**/*.mdx"],
  },
  "architecture-overview": {
    root: "src/content/architecture-overview",
    includeGlobs: ["**/*.mdx"],
  },
  "getting-started": {
    root: "src/content/getting-started",
    includeGlobs: ["**/*.mdx"],
  },
  "chainlink-nodes": {
    root: "src/content/chainlink-nodes",
    includeGlobs: ["**/*.mdx"],
  },
  "chainlink-local": {
    root: "src/content/chainlink-local",
    includeGlobs: ["**/*.mdx"],
  },
}
