/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedCcipVersion, setCcipVersion } from "~/stores/ccipVersion.js"
import { selectedChainType } from "~/stores/chainType.js"
import { CANTON_DOCS_FALLBACK_URL } from "~/config/chainTypes.js"
import { CCIP_VERSION_CONFIGS, CCIP_VERSIONS, LATEST_CCIP_VERSION } from "~/config/ccipVersions.js"
import { CCIP_SIDEBARS } from "~/config/sidebar.js"
import { findEquivalentPageUrlWithFallback } from "~/utils/chainNavigation.js"
import type { CcipVersion } from "~/config/types.js"
import styles from "./CcipVersionToggle.module.css"

/**
 * Segmented toggle for switching between CCIP versions.
 *
 * Guarantees:
 * - canonical → /ccip/...
 * - v1*       → /ccip/v1/...
 * - Root always resolves to index.md (never overview.mdx)
 */
export function CcipVersionToggle() {
  const activeVersion = useStore(selectedCcipVersion)
  const activeChain = useStore(selectedChainType)

  const isV1 = (v: CcipVersion) => String(v).startsWith("v1")

  /**
   * ─────────────────────────────────────────────────────────────────────────────
   * TEMP: Version-availability guards per chain family.
   *
   * Context:
   * v2 currently supports EVM and Canton; every other chain family is v1-only,
   * and Canton is v2-only (its docs were ported out of v1 entirely).
   * - Switching v1 + (Solana/Aptos/TON) → v2 is disabled: it would silently
   *   change the chain context to EVM, which is confusing.
   * - Switching v2 + Canton → v1 is disabled: Canton has no v1 docs.
   *
   * Removal Checklist (when v2 supports Solana/Aptos/TON):
   *   1. Remove this comment block.
   *   2. Delete `disableSwitchToLatest` (keep `disableSwitchToV1` while any
   *      chain family remains single-version).
   *   3. Remove the corresponding guard inside `handleVersionSwitch`.
   *   4. Remove the corresponding `disabled` / `aria-disabled` / `title` logic.
   * ─────────────────────────────────────────────────────────────────────────────
   */
  const disableSwitchToLatest = isV1(activeVersion) && activeChain !== "evm" && activeChain !== "canton"
  const disableSwitchToV1 = !isV1(activeVersion) && activeChain === "canton"

  /**
   * Normalize equivalent URL to enforce version prefix rules
   * and ensure root resolves to index.md.
   */
  function normalizeCcipPath(targetUrl: string, version: CcipVersion) {
    const targetIsV1 = isV1(version)

    if (!targetUrl) return targetIsV1 ? "ccip/v1" : "ccip"

    // Remove origin, query, hash; strip leading slashes
    let path = targetUrl
      .replace(/^https?:\/\/[^/]+/i, "")
      .split("#")[0]
      .split("?")[0]
      .replace(/^\/+/, "")

    // If not a CCIP route, force version root
    if (!path.startsWith("ccip")) {
      return targetIsV1 ? "ccip/v1" : "ccip"
    }

    // Strip existing version prefix to get canonical "ccip/..."
    // This handles both "/ccip/v1/..." and "/ccip/v1.6/..."-style inputs if they ever appear.
    path = path.replace(/^ccip\/v1[^/]*(\/|$)/, "ccip$1")

    // Force index resolution instead of overview page
    // Canonical root: ccip
    // v1 root: ccip/v1
    if (path === "ccip/overview" || path === "ccip/overview/") {
      return targetIsV1 ? "ccip/v1" : "ccip"
    }

    if (targetIsV1) {
      if (path === "ccip" || path === "ccip/") return "ccip/v1"
      return path.replace(/^ccip\//, "ccip/v1/").replace(/\/+$/, "")
    }

    // canonical
    return path.replace(/\/+$/, "")
  }

  const handleVersionSwitch = (version: CcipVersion) => {
    if (version === activeVersion) return

    // Defence-in-depth: block switching to canonical (v2) when on v1 + v1-only chain,
    // and block switching to v1 when on v2 + Canton (Canton has no v1 docs).
    if (disableSwitchToLatest && version === LATEST_CCIP_VERSION) return
    if (disableSwitchToV1 && isV1(version)) return

    const sourceSidebar = CCIP_SIDEBARS[activeVersion]
    const targetSidebar = CCIP_SIDEBARS[version]

    const equivalent =
      findEquivalentPageUrlWithFallback(window.location.pathname, activeChain, targetSidebar, sourceSidebar) ||
      window.location.pathname

    let normalizedTarget = normalizeCcipPath(equivalent, version)

    // Canton has no v1 pages. When switching to latest with Canton selected and the
    // resolver could not land on a Canton page, go to Canton's getting-started so the
    // sidebar has content for the selected chain.
    if (activeChain === "canton" && version === LATEST_CCIP_VERSION && !normalizedTarget.startsWith("ccip/canton/")) {
      normalizedTarget = CANTON_DOCS_FALLBACK_URL
    }

    setCcipVersion(version)
    window.location.assign(`/${normalizedTarget}`)
  }

  return (
    <div className={styles.toggle} role="radiogroup" aria-label="Select CCIP version">
      <span className={styles.label}>Version</span>
      <div className={styles.buttons}>
        {CCIP_VERSIONS.map((versionId) => {
          const config = CCIP_VERSION_CONFIGS[versionId]
          const isActive = versionId === activeVersion

          // Disable the canonical/latest option on v1 + v1-only chains,
          // and the v1 option on v2 + Canton (v2-only chain).
          const isLatest = versionId === LATEST_CCIP_VERSION
          const isDisabled = (disableSwitchToLatest && isLatest) || (disableSwitchToV1 && isV1(versionId))
          const disabledTitle = isLatest
            ? "This chain family is currently supported only in v1"
            : "This chain family is currently supported only in v2"

          return (
            <button
              key={versionId}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              title={isDisabled ? disabledTitle : undefined}
              className={`${styles.option} ${isActive ? styles.active : ""} ${isDisabled ? styles.disabled : ""}`}
              onClick={() => handleVersionSwitch(versionId)}
            >
              {config.toggleLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
