/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedChainType, setChainType } from "~/stores/chainType.js"
import { CHAIN_TYPE_CONFIGS, CCIP_SUPPORTED_CHAINS } from "~/config/chainTypes.js"
import { CCIP_SIDEBAR_CONTENT } from "~/config/sidebar/ccip-dynamic.js"
import { findEquivalentPageUrlWithFallback } from "~/utils/chainNavigation.js"
import {
  addCcipVersionToSidebarUrl,
  getCcipVersionFromPathname,
  stripCcipVersionFromPathname,
} from "~/utils/ccipVersionToggle.js"
import type { ChainType } from "~/config/types.js"
import { CcipVersionToggle } from "~/components/CCIP/VersionToggle/CcipVersionToggle.js"
import { SidebarDropdown, type DropdownItem } from "../SidebarDropdown/index.js"

/**
 * Chain Type Dropdown Selector Component
 *
 * Allows users to filter CCIP documentation by blockchain type (EVM, Solana, Aptos).
 * Uses a dropdown design that scales well with many chain types.
 *
 * Features:
 * - Scalable dropdown design (works with 10+ chains)
 * - Smart navigation: automatically switches to equivalent page for selected chain
 * - Sidebar-driven: uses sidebar config as source of truth for navigation
 * - Reactive UI based on nanostore state
 * - Google Analytics tracking
 * - Keyboard accessible (ARIA compliant)
 * - Click-outside to close
 * - Mobile responsive
 *
 * Behavior:
 * - If equivalent page exists for target chain → Navigate to it
 * - If no equivalent page → Update filter state only (sidebar filters content)
 */
export function ChainTypeSelector() {
  const activeChain = useStore(selectedChainType)

  const handleSelect = (chainId: string) => {
    const chainType = chainId as ChainType
    setChainType(chainType)

    const currentPathname = window.location.pathname
    const currentVersion = getCcipVersionFromPathname(currentPathname) ?? "v2.0"

    // Strip version before matching against CCIP_SIDEBAR_CONTENT (which is stored unversioned)
    const versionlessPathname = stripCcipVersionFromPathname(currentPathname)

    // Find target URL with intelligent fallback: exact match → parent → section root
    const targetUrl = findEquivalentPageUrlWithFallback(versionlessPathname, chainType, CCIP_SIDEBAR_CONTENT)
    const versionedTargetUrl = addCcipVersionToSidebarUrl(targetUrl, currentVersion)

    window.location.href = `/${versionedTargetUrl}`
  }

  // Convert chain configs to dropdown items format
  const chainItems: DropdownItem[] = CCIP_SUPPORTED_CHAINS.map((chainId) => {
    const config = CHAIN_TYPE_CONFIGS[chainId]
    return {
      id: chainId,
      label: config.displayName,
      icon: config.icon,
      description: config.description,
    }
  })

  return (
    <SidebarDropdown
      label="Chain Family"
      items={chainItems}
      selectedId={activeChain}
      onSelect={handleSelect}
      triggerId="chain-type-selector-trigger"
      ariaLabel="Select blockchain type"
      rightSlot={<CcipVersionToggle />}
    />
  )
}
