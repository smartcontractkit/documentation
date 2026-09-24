import type { ChainType, CcipVersion } from "./types.js"

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
  /**
   * Chain families documented in this version. Single source of truth for which
   * (chain family, version) pairs exist: the version toggle, the chain selector, the
   * "Switch to latest" banner and the page-load guard (CcipVersionGuard.astro) all derive
   * from it. When a version gains docs for a chain family, add the family here.
   */
  chainTypes: readonly ChainType[]
}

export const CCIP_VERSION_CONFIGS: Record<CcipVersion, CcipVersionConfig> = {
  "v2.0": {
    id: "v2.0",
    displayName: "v2.0",
    toggleLabel: "v2",
    urlPrefix: "",
    contentDirPrefix: "v2",
    isLatest: true,
    chainTypes: ["evm", "canton"],
  },
  "v1.6": {
    id: "v1.6",
    displayName: "v1.6",
    toggleLabel: "v1",
    urlPrefix: "v1",
    contentDirPrefix: "v1",
    isLatest: false,
    // Canton was ported out of v1 entirely; its docs exist only in v2.
    chainTypes: ["evm", "solana", "aptos", "ton"],
  },
}

export const CCIP_VERSIONS: CcipVersion[] = ["v2.0", "v1.6"]

export const LATEST_CCIP_VERSION: CcipVersion = "v2.0"

/** Whether `version` has docs for the `chain` family. */
export function isChainInCcipVersion(chain: ChainType, version: CcipVersion): boolean {
  return CCIP_VERSION_CONFIGS[version]?.chainTypes.includes(chain) ?? false
}

/** The newest version that documents `chain`, or null if none does. */
export function getLatestCcipVersionForChain(chain: ChainType): CcipVersion | null {
  return CCIP_VERSIONS.find((version) => isChainInCcipVersion(chain, version)) ?? null
}

/** Root (landing) URL of a version, without a leading slash: "ccip" or "ccip/v1". */
export function getCcipVersionRootUrl(version: CcipVersion): string {
  const prefix = CCIP_VERSION_CONFIGS[version].urlPrefix
  return prefix ? `ccip/${prefix}` : "ccip"
}

/** On-disk content directory for the latest CCIP version (e.g. "v2"). Single knob for future version bumps. */
export const LATEST_CCIP_CONTENT_DIR = CCIP_VERSION_CONFIGS[LATEST_CCIP_VERSION].contentDirPrefix

export const CCIP_VERSION_STORAGE_KEY = "chainlink-docs-ccip-version"

export const CCIP_VERSION_TOGGLE_ENABLED = true
