/**
 * Defines all available sidebar sections in the documentation.
 * These constants are used to:
 * 1. Type-check sidebar configurations
 * 2. Map content to specific sections
 * 3. Handle parent/child relationships between sections
 */
export const SIDEBAR_SECTIONS = {
  CRE: "cre",
  DATA_FEEDS: "dataFeeds",
  DTA_TECHNICAL_STANDARD: "dta-technical-standard",
  DATA_STREAMS: "dataStreams",
  DATALINK: "dataLink",
  CCIP: "ccip",
  CHAINLINK_FUNCTIONS: "chainlinkFunctions",
  CHAINLINK_LOCAL: "chainlinkLocal",
  NODE_OPERATORS: "nodeOperator",
  VRF: "vrf",
  AUTOMATION: "automation",
  ARCHITECTURE: "architecture",
  ORACLE: "oracle",
  RESOURCES: "resources",
  LEGACY: "legacy",
  GLOBAL: "global",
} as const

export type SidebarSection = (typeof SIDEBAR_SECTIONS)[keyof typeof SIDEBAR_SECTIONS]

/**
 * Converts SIDEBAR_SECTIONS values to a tuple type for Zod schema validation
 * This ensures all sections are properly typed throughout the application
 */
export const sectionValues = Object.values(SIDEBAR_SECTIONS) as [string, ...string[]]
