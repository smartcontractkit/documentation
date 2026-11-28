import { SUNSET_DOC_ROOTS } from "./sunset.js"

export type LlmsSectionConfig = {
  root: string
  includeGlobs: string[]
  excludeGlobs?: string[]
  order?: string[]
  languages?: string[] // Supported languages for this section (if applicable)
  maxBytes?: number // Optional size ceiling for larger complete corpora; other sections use the validator default.
}

// Central list of sections that expose llms-full.txt or llms-full-[lang].txt
export const SUPPORTED_LLM_SECTIONS = [
  ...SUNSET_DOC_ROOTS,
  "ace",
  "cre",
  "crec",
  "vrf",
  "ccip",
  "data-feeds",
  "data-streams",
  "dta-technical-standard",
  "datalink",
  "resources",
  "architecture-overview",
  "getting-started",
  "chainlink-nodes",
  "chainlink-local",
] as const

export type SupportedSection = (typeof SUPPORTED_LLM_SECTIONS)[number]

// Configuration for each section
export const LLM_SECTIONS_CONFIG: Record<SupportedSection, LlmsSectionConfig> = {
  "any-api": { root: "src/content/any-api", includeGlobs: ["**/*.mdx"] },
  "chainlink-automation": { root: "src/content/chainlink-automation", includeGlobs: ["**/*.mdx"] },
  "chainlink-functions": { root: "src/content/chainlink-functions", includeGlobs: ["**/*.mdx"] },
  "vrf/v1": { root: "src/content/vrf/v1", includeGlobs: ["**/*.mdx"] },
  "vrf/v2": { root: "src/content/vrf/v2", includeGlobs: ["**/*.mdx"] },
  ace: {
    root: "src/content/ace",
    includeGlobs: ["**/*.mdx"],
  },
  cre: {
    root: "src/content/cre",
    includeGlobs: ["**/*.mdx"],
    languages: ["go", "ts"], // CRE has language-specific files
  },
  crec: {
    root: "src/content/crec",
    includeGlobs: ["**/*.mdx"],
  },
  vrf: {
    root: "src/content/vrf",
    includeGlobs: ["**/*.mdx"],
  },
  ccip: {
    root: "src/content/ccip",
    includeGlobs: ["**/*.mdx"],
    // Preserving all ordered-list and accordion content in the v1/v2 corpus exceeds the default 5 MB limit.
    maxBytes: 8_000_000,
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
