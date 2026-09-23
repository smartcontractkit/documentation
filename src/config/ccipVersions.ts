import type { CcipVersion } from "./types.js"

/**
 * Metadata for each CCIP version
 * Used for UI rendering, URL resolution, and state management
 */
export interface CcipVersionConfig {
  id: CcipVersion
  displayName: string
  toggleLabel: string
  urlPrefix: string // Empty string for latest, "v1" for older
  contentDirPrefix: string // on-disk dir under src/content/ccip (e.g. "v2", "v1")
  isLatest: boolean
}

export const CCIP_VERSION_CONFIGS: Record<CcipVersion, CcipVersionConfig> = {
  "v2.0": {
    id: "v2.0",
    displayName: "v2.0",
    toggleLabel: "v2",
    urlPrefix: "",
    contentDirPrefix: "v2",
    isLatest: true,
  },
  "v1.6": {
    id: "v1.6",
    displayName: "v1.6",
    toggleLabel: "v1",
    urlPrefix: "v1",
    contentDirPrefix: "v1",
    isLatest: false,
  },
}

export const CCIP_VERSIONS: CcipVersion[] = ["v2.0", "v1.6"]

export const LATEST_CCIP_VERSION: CcipVersion = "v2.0"

/** On-disk content directory for the latest CCIP version (e.g. "v2"). Single knob for future version bumps. */
export const LATEST_CCIP_CONTENT_DIR = CCIP_VERSION_CONFIGS[LATEST_CCIP_VERSION].contentDirPrefix

export const CCIP_VERSION_STORAGE_KEY = "chainlink-docs-ccip-version"

export const CCIP_VERSION_TOGGLE_ENABLED = true
