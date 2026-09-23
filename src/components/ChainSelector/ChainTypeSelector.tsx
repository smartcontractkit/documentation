/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedChainType, setChainType, detectChainFromPath } from "~/stores/chainType.js"
import { selectedCcipVersion } from "~/stores/ccipVersion.js"
import { CHAIN_TYPE_CONFIGS, CCIP_SUPPORTED_CHAINS, CANTON_DOCS_FALLBACK_URL } from "~/config/chainTypes.js"
import { CCIP_SIDEBARS } from "~/config/sidebar.js"
import { LATEST_CCIP_VERSION } from "~/config/ccipVersions.js"
import { findEquivalentPageUrl, findEquivalentPageUrlWithFallback, findSectionForUrl } from "~/utils/chainNavigation.js"
import type { ChainType } from "~/config/types.js"
import { SidebarDropdown, type DropdownItem } from "../SidebarDropdown/index.js"
import ccipV1Sidebar from "~/generated/ccipV1Sidebar.json" with { type: "json" }

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
     * Canton is v2-only (its docs were ported out of v1 entirely), so Canton
     * selections always resolve against the v2 sidebar, whether the user is on
     * a v1 or a v2 route.
     *
     * Resolution order:
     *   1. Exact equivalent in the v2 sidebar: universal pages and Canton pages
     *      resolve to themselves, EVM pages to a Canton counterpart if one exists.
     *   2. On a v2 route, a page that is not in the sidebar at all and is either
     *      chainless (the /ccip landing, hub index pages) or already a Canton page
     *      stays put; the stored selection drives the sidebar, as on production.
     *   3. Otherwise (chain-specific page with no Canton counterpart, or any v1 page)
     *      land on Canton's getting-started page.
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

    /**
     * ─────────────────────────────────────────────────────────────────────────────
     * TEMP: v2 Solana/Aptos Routing Bridge (REMOVE WHEN v2 SUPPORTS NON-EVM)
     *
     * NOTE: Canton never reaches this block — it is v2-only and handled by the
     * early return above.
     *
     * Purpose:
     * v2 currently supports EVM and Canton only. When a user selects Solana or
     * Aptos (or TON) while on a v2 (/ccip) route, we:
     *   1. Persist chainType
     *   2. Resolve the equivalent page using a frozen v1 sidebar snapshot
     *   3. Hard-redirect to the v1 path
     *
     * This preserves equivalent-page behavior without coupling to the dynamic
     * v1 sidebar runtime.
     *
     * Removal Checklist (when v2 adds Solana/Aptos):
     *   1. Delete this entire conditional block.
     *   2. Remove:
     *        import ccipV1Sidebar from "~/generated/ccipV1Sidebar.json"
     *   3. Delete file:
     *        src/generated/ccipV1Sidebar.json
     *   4. Re-enable version toggle switching logic if previously restricted.
     *   5. Remove Solana/Aptos banner conditionals that mention v1-only support.
     *
     * After removal, default resolver behavior will work across versions.
     * ─────────────────────────────────────────────────────────────────────────────
     */
    if (isOnV2CcipRoute && chainType !== "evm") {
      const sourceSidebar = CCIP_SIDEBARS[activeVersion]

      const resolvedRaw = findEquivalentPageUrlWithFallback(
        window.location.pathname,
        chainType,
        ccipV1Sidebar as any,
        sourceSidebar
      )

      const resolvedStr = String(resolvedRaw || "")

      // If resolver falls back to generic v1 overview, treat it as "no equivalent"
      // and send to the v1 landing instead.
      const resolved =
        resolvedStr === "ccip/v1/overview" || resolvedStr === "/ccip/v1/overview" ? "ccip/v1" : resolvedStr || "ccip/v1"

      const normalized = String(resolved)
        .replace(/^https?:\/\/[^/]+/i, "")
        .split("#")[0]
        .split("?")[0]
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")

      // If resolver already returned a v1 path, keep it.
      // If it returned canonical ccip/... (no v1), add the v1 prefix.
      const v1Path = normalized.startsWith("ccip/v1")
        ? normalized
        : normalized.startsWith("ccip/")
          ? normalized.replace(/^ccip\//, "ccip/v1/")
          : "ccip/v1"

      window.location.href = `/${v1Path}`
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
