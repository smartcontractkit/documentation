import type { Collection } from "~/content.config.ts"

// Base type for version configuration
export interface VersionConfig {
  LATEST: string
  ALL: readonly string[]
  DEPRECATED?: readonly string[]
  RELEASE_DATES: {
    [version: string]: string // ISO date strings
  }
}

// Add VM-specific version configuration type
export interface VMVersionConfig {
  evm: VersionConfig
  svm: VersionConfig
  aptos: VersionConfig
}

// Registry of all product versions
export const VERSIONS = {
  // CCIP Versions
  ccip: {
    // Split versions by VM type
    evm: {
      LATEST: "v1.6.2",
      ALL: ["v1.6.2", "v1.6.1", "v1.6.0", "v1.5.1", "v1.5.0"] as const,
      RELEASE_DATES: {
        "v1.6.2": "2025-10-06T00:00:00Z", // 6 October 2025
        "v1.6.1": "2025-09-08T00:00:00Z", // 8 September 2025
        "v1.6.0": "2025-05-19T00:00:00Z", // 19 May 2025
        "v1.5.0": "2023-10-04T00:00:00Z", // 4 October 2023
        "v1.5.1": "2023-12-04T00:00:00Z", // 4 December 2023
      },
    },
    svm: {
      LATEST: "v1.6.0",
      ALL: ["v1.6.0"] as const,
      RELEASE_DATES: {
        "v1.6.0": "2025-05-19T00:00:00Z", // 19 May 2025
      },
    },
    aptos: {
      LATEST: "v1.6.0",
      ALL: ["v1.6.0"] as const,
      RELEASE_DATES: {
        "v1.6.0": "2025-06-30T00:00:00Z", // 30 June 2025
      },
    },
    // Default for backward compatibility
    get LATEST() {
      return this.evm.LATEST
    },
    get ALL() {
      return this.evm.ALL
    },
    get RELEASE_DATES() {
      return this.evm.RELEASE_DATES
    },
  },
  // Chainlink Local Versions
  "chainlink-local": {
    LATEST: "v0.2.3",
    ALL: ["v0.2.3", "v0.2.2", "v0.2.1"] as const,
    RELEASE_DATES: {
      "v0.2.1": "2024-07-05T00:00:00Z", // 5 July 2024
      "v0.2.2": "2024-10-15T00:00:00Z", // 15 October 2024
      "v0.2.3": "2024-11-30T00:00:00Z", // 30 November 2024
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
  [K in Collection]?: VersionConfig | VMVersionConfig
}

// Re-export for convenience
export type { Collection }
