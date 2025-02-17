export const SIDEBAR_SECTIONS = {
  DATA_FEEDS: "dataFeeds",
  DATA_STREAMS: "dataStreams",
  CCIP: "ccip",
  CHAINLINK_FUNCTIONS: "chainlinkFunctions",
  CHAINLINK_LOCAL: "chainlinkLocal",
  NODE_OPERATORS: "nodeOperator",
  VRF: "vrf",
  AUTOMATION: "automation",
  ARCHITECTURE: "architecture",
  RESOURCES: "resources",
  LEGACY: "legacy",
  GLOBAL: "global",
} as const

export type SidebarSection = (typeof SIDEBAR_SECTIONS)[keyof typeof SIDEBAR_SECTIONS]

// Get values and cast as tuple type for zod
export const sectionValues = Object.values(SIDEBAR_SECTIONS) as [string, ...string[]]
