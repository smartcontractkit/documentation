/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedCcipVersion, setCcipVersion } from "~/stores/ccipVersion.js"
import { selectedChainType } from "~/stores/chainType.js"
import { LATEST_CCIP_VERSION, CCIP_VERSION_CONFIGS, isChainInCcipVersion } from "~/config/ccipVersions.js"
import { resolveCcipVersionSwitchUrl } from "~/utils/ccipVersionRouting.js"
import styles from "./CcipVersionBanner.module.css"

export function CcipVersionBanner() {
  const activeVersion = useStore(selectedCcipVersion)
  const activeChain = useStore(selectedChainType)
  const latestConfig = CCIP_VERSION_CONFIGS[LATEST_CCIP_VERSION]

  const isLatest = activeVersion === LATEST_CCIP_VERSION

  // If you're on the latest, no banner.
  if (isLatest) return null

  // Only chain families documented in the latest version get a "switch to latest" CTA (today: EVM;
  // Canton never renders on v1). Solana/Aptos/TON previously rendered a version warning banner
  // here; that banner has been removed per product feedback, so those families render nothing.
  const showSwitchCta = isChainInCcipVersion(activeChain, LATEST_CCIP_VERSION)
  if (!showSwitchCta) return null

  // Same destination as the version toggle's latest button: 1:1 counterpart, otherwise the root.
  const handleSwitchToLatest = () => {
    const target = resolveCcipVersionSwitchUrl(
      window.location.pathname,
      activeChain,
      activeVersion,
      LATEST_CCIP_VERSION
    )

    setCcipVersion(LATEST_CCIP_VERSION)
    window.location.href = `/${target}`
  }

  return (
    <div className={styles.switchCta}>
      <button type="button" className={styles.switchLink} onClick={handleSwitchToLatest}>
        Switch to latest ({latestConfig.displayName}) →
      </button>
    </div>
  )
}
