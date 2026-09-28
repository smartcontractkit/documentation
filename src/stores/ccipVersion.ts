import { atom } from "nanostores"
import type { CcipVersion } from "~/config/types.js"
import { LATEST_CCIP_VERSION, CCIP_VERSION_STORAGE_KEY, CCIP_VERSION_CONFIGS } from "~/config/ccipVersions.js"

export const selectedCcipVersion = atom<CcipVersion>(LATEST_CCIP_VERSION)

export function initializeCcipVersion(): void {
  if (typeof window === "undefined") return

  const detected = detectVersionFromPath(window.location.pathname)
  if (detected) {
    selectedCcipVersion.set(detected)
    localStorage.setItem(CCIP_VERSION_STORAGE_KEY, detected)
    return
  }

  const stored = localStorage.getItem(CCIP_VERSION_STORAGE_KEY) as CcipVersion | null
  if (stored && CCIP_VERSION_CONFIGS[stored]) {
    selectedCcipVersion.set(stored)
    return
  }

  selectedCcipVersion.set(LATEST_CCIP_VERSION)
}

export function setCcipVersion(version: CcipVersion): void {
  selectedCcipVersion.set(version)

  if (typeof window !== "undefined") {
    localStorage.setItem(CCIP_VERSION_STORAGE_KEY, version)
  }
}

/**
 * Version a CCIP URL belongs to, or null for versionless shared routes (and non-CCIP URLs).
 * Exported so version routing (src/utils/ccipVersionRouting.ts) uses the same rule as the store.
 */
export function detectVersionFromPath(pathname: string): CcipVersion | null {
  // URL is the source of truth for CCIP version/chain routing.
  //
  // Canonical rule:
  // - Any CCIP route under `/ccip/*` that is NOT `/ccip/v1/...` and NOT a truly
  //   versionless shared route initializes as the latest version (v2).
  //
  // Shared/versionless routes (preserve localStorage context):
  // - `/ccip/api-reference` (portal/index page)
  // - `/ccip/directory/*` (directory is shared by v1 and v2)
  const path = pathname.replace(/\/+$/, "") || "/"
  const ccipIdx = path.indexOf("/ccip")
  if (ccipIdx === -1) return null

  const ccipPath = path.slice(ccipIdx)

  if (ccipPath === "/ccip/api-reference") return null
  if (ccipPath === "/ccip/directory" || ccipPath.startsWith("/ccip/directory/")) return null

  for (const [versionId, config] of Object.entries(CCIP_VERSION_CONFIGS)) {
    if (
      config.urlPrefix &&
      (ccipPath.includes(`/ccip/${config.urlPrefix}/`) || ccipPath.endsWith(`/ccip/${config.urlPrefix}`))
    ) {
      return versionId as CcipVersion
    }
  }

  // Any CCIP route that isn't explicitly v1 is treated as canonical (latest).
  if (ccipPath === "/ccip" || ccipPath.startsWith("/ccip/")) {
    if (ccipPath === "/ccip/v1" || ccipPath.startsWith("/ccip/v1/")) {
      return null
    }
    return LATEST_CCIP_VERSION
  }

  return null
}
