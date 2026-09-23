/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedCcipVersion, setCcipVersion } from "~/stores/ccipVersion.js"
import { selectedChainType } from "~/stores/chainType.js"
import { LATEST_CCIP_VERSION, CCIP_VERSION_CONFIGS } from "~/config/ccipVersions.js"
import { CCIP_SIDEBARS } from "~/config/sidebar.js"
import { findEquivalentPageUrlWithFallback } from "~/utils/chainNavigation.js"
import styles from "./CcipVersionBanner.module.css"

export function CcipVersionBanner() {
  const activeVersion = useStore(selectedCcipVersion)
  const activeChain = useStore(selectedChainType)
  const latestConfig = CCIP_VERSION_CONFIGS[LATEST_CCIP_VERSION]

  const isLatest = activeVersion === LATEST_CCIP_VERSION
  const isEvm = activeChain === "evm"

  // If you're on the latest, no banner.
  if (isLatest) return null

  // Only EVM surfaces a "switch to latest" CTA. Other chain families (Solana/Aptos/TON/etc.)
  // previously rendered a version warning banner here; that banner has been removed per product
  // feedback, so those families render nothing.
  const showSwitchCta = isEvm
  if (!showSwitchCta) return null

  const handleSwitchToLatest = () => {
    const rawPath = window.location.pathname
    const path = rawPath.replace(/\/+$/, "") // normalize

    const ccipIdx = path.indexOf("/ccip")
    const prefix = ccipIdx > 0 ? path.slice(0, ccipIdx) : ""

    // Match CCIP landing variants (root, index, overview, versioned root)
    const isCcipLanding = /\/ccip(\/(v1|v2))?(\/(index|overview))?$/.test(path)

    if (isCcipLanding) {
      setCcipVersion(LATEST_CCIP_VERSION)
      window.location.href = `${prefix}/ccip`
      return
    }

    setCcipVersion(LATEST_CCIP_VERSION)

    const sourceSidebar = CCIP_SIDEBARS[activeVersion]
    const targetSidebar = CCIP_SIDEBARS[LATEST_CCIP_VERSION]

    const targetUrl = findEquivalentPageUrlWithFallback(rawPath, activeChain, targetSidebar, sourceSidebar)

    window.location.href = `/${targetUrl.replace(/\/+$/, "")}`
  }

  return (
    <div className={styles.switchCta}>
      <button type="button" className={styles.switchLink} onClick={handleSwitchToLatest}>
        Switch to latest ({latestConfig.displayName}) →
      </button>
    </div>
  )
}
