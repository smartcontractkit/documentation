/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedCcipVersion, setCcipVersion } from "~/stores/ccipVersion.js"
import { selectedChainType } from "~/stores/chainType.js"
import { CCIP_VERSION_CONFIGS, CCIP_VERSIONS, isChainInCcipVersion } from "~/config/ccipVersions.js"
import { resolveCcipVersionSwitchUrl } from "~/utils/ccipVersionRouting.js"
import type { CcipVersion } from "~/config/types.js"
import styles from "./CcipVersionToggle.module.css"

/**
 * Segmented toggle for switching between CCIP versions.
 *
 * Guarantees:
 * - Switching lands on the current page's 1:1 counterpart in the other version, otherwise on that
 *   version's root (canonical → /ccip, v1 → /ccip/v1). See resolveCcipVersionSwitchUrl.
 * - A version with no docs for the selected chain family is disabled whichever version is active:
 *   v2 for Solana/Aptos/TON, v1 for Canton. Driven by CCIP_VERSION_CONFIGS[version].chainTypes, so a
 *   chain family gaining v2 docs only needs that list updated.
 */
export function CcipVersionToggle() {
  const activeVersion = useStore(selectedCcipVersion)
  const activeChain = useStore(selectedChainType)

  // e.g. "v1" for Aptos, "v2" for Canton
  const versionsWithChain = CCIP_VERSIONS.filter((v) => isChainInCcipVersion(activeChain, v))
    .map((v) => CCIP_VERSION_CONFIGS[v].toggleLabel)
    .join(" and ")

  const handleVersionSwitch = (version: CcipVersion) => {
    if (version === activeVersion) return
    // Defence-in-depth: the button is disabled too.
    if (!isChainInCcipVersion(activeChain, version)) return

    const target = resolveCcipVersionSwitchUrl(window.location.pathname, activeChain, activeVersion, version)

    setCcipVersion(version)
    window.location.assign(`/${target}`)
  }

  return (
    <div className={styles.toggle} role="radiogroup" aria-label="Select CCIP version">
      <span className={styles.label}>Version</span>
      <div className={styles.buttons}>
        {CCIP_VERSIONS.map((versionId) => {
          const config = CCIP_VERSION_CONFIGS[versionId]
          const isActive = versionId === activeVersion
          const isDisabled = !isChainInCcipVersion(activeChain, versionId)

          return (
            <button
              key={versionId}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              title={isDisabled ? `This chain family is currently supported only in ${versionsWithChain}` : undefined}
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
