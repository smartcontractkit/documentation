/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedChainType, setChainType, detectChainFromPath } from "~/stores/chainType.js"
import { selectedCcipVersion, detectVersionFromPath } from "~/stores/ccipVersion.js"
import { CHAIN_TYPE_CONFIGS, CCIP_SUPPORTED_CHAINS, CANTON_DOCS_FALLBACK_URL } from "~/config/chainTypes.js"
import { CCIP_SIDEBARS } from "~/config/sidebar.js"
import { LATEST_CCIP_VERSION, getLatestCcipVersionForChain, isChainInCcipVersion } from "~/config/ccipVersions.js"
import { findEquivalentPageUrl, findEquivalentPageUrlWithFallback, findSectionForUrl } from "~/utils/chainNavigation.js"
import { resolveCcipVersionSwitchUrl } from "~/utils/ccipVersionRouting.js"
import type { ChainType } from "~/config/types.js"
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
 * - Version-aware: uses the current version's sidebar config for navigation
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
  const activeVersion = useStore(selectedCcipVersion)

  const handleSelect = (chainId: string) => {
    const chainType = chainId as ChainType

    // Persist the selection first so v1 can read it on load.
    setChainType(chainType)

    const pathname = window.location.pathname.replace(/\/$/, "")

    // Any CCIP route that is NOT v1 is treated as v2/canonical.
    const isOnV2CcipRoute = pathname === "/ccip" || (pathname.startsWith("/ccip/") && !pathname.startsWith("/ccip/v1"))

    /**
     * The chosen family has no docs in this page's version (Solana/Aptos/TON on a v2 page, Canton
     * on a v1 page): move to the newest version that documents it, landing on this page's 1:1
     * counterpart there, otherwise on that version's root. Same resolver as the version toggle
     * and the page-load guard, so the three always agree.
     */
    const pageVersion = detectVersionFromPath(pathname)
    const chainVersion = getLatestCcipVersionForChain(chainType)
    if (pageVersion && chainVersion && !isChainInCcipVersion(chainType, pageVersion)) {
      window.location.href = `/${resolveCcipVersionSwitchUrl(pathname, chainType, pageVersion, chainVersion)}`
      return
    }

    /**
     * Canton within v2. Canton is v2-only (its docs were ported out of v1 entirely); selecting it on
     * a v1 page is handled by the cross-version branch above.
     *
     * Resolution order:
     *   1. Exact equivalent in the v2 sidebar: universal pages and Canton pages
     *      resolve to themselves, EVM pages to a Canton counterpart if one exists.
     *   2. On a v2 route, a page that is not in the sidebar at all and is either
     *      chainless (the /ccip landing, hub index pages) or already a Canton page
     *      stays put; the stored selection drives the sidebar, as on production.
     *   3. Otherwise (chain-specific page with no Canton counterpart) land on the
     *      CANTON_DOCS_FALLBACK_URL hub.
     */
    if (chainType === "canton") {
      const v2Sidebar = CCIP_SIDEBARS[LATEST_CCIP_VERSION]
      const canonicalRel = pathname.replace(/^\/+/, "")

      const exact = findEquivalentPageUrl(
        pathname,
        chainType,
        v2Sidebar,
        isOnV2CcipRoute ? undefined : CCIP_SIDEBARS[activeVersion]
      )

      const detectedChain = detectChainFromPath(pathname)
      const staysOnUnlistedPage =
        isOnV2CcipRoute &&
        !findSectionForUrl(canonicalRel, v2Sidebar) &&
        (detectedChain === null || detectedChain === chainType)

      const target = exact ?? (staysOnUnlistedPage ? canonicalRel : CANTON_DOCS_FALLBACK_URL)

      window.location.href = `/${target}`
      return
    }

    // Default behavior (current version sidebar → equivalent page lookup)
    const currentSidebar = CCIP_SIDEBARS[activeVersion]
    const targetUrl = findEquivalentPageUrlWithFallback(window.location.pathname, chainType, currentSidebar)

    window.location.href = `/${targetUrl}`
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
    />
  )
}
