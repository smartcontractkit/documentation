import type { Collection } from "src/content/config"

// Base type for version configuration
export interface VersionConfig {
  LATEST: string
  ALL: readonly string[]
  DEPRECATED?: readonly string[]
  RELEASE_DATES: {
    [version: string]: string // ISO date strings
  }
}

// Registry of all product versions
export const VERSIONS = {
  // CCIP Versions
  ccip: {
    LATEST: "v1.5.1",
    ALL: ["v1.5.1", "v1.5.0"] as const,
    RELEASE_DATES: {
      "v1.5.0": "2023-10-04T00:00:00Z", // 4 October 2023
      "v1.5.1": "2023-12-04T00:00:00Z", // 4 December 2023
    },
  },
  // Add new products here following the same pattern
  // example: {
  //   LATEST: "v1.0.0",
  //   ALL: ["v1.0.0", "v0.9.0"] as const,
  //   RELEASE_DATES: {
  //     "v1.0.0": "2023-12-01T00:00:00Z",
  //     "v0.9.0": "2023-11-01T00:00:00Z"
  //   }
  // }
} as const

// Type helpers
export type ProductVersions = {
  [K in Collection]?: VersionConfig
}

export type CCIPVersion = (typeof VERSIONS.ccip.ALL)[number]

// Re-export for convenience
export type { Collection }
