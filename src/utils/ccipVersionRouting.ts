import type { ChainType, CcipVersion } from "~/config/types.js"
import { CCIP_SIDEBARS } from "~/config/sidebar.js"
import { CCIP_SUPPORTED_CHAINS } from "~/config/chainTypes.js"
import { getCcipVersionRootUrl, getLatestCcipVersionForChain, isChainInCcipVersion } from "~/config/ccipVersions.js"
import { detectChainFromPath } from "~/stores/chainType.js"
import { detectVersionFromPath } from "~/stores/ccipVersion.js"
import { findCrossVersionEquivalentUrl } from "~/utils/chainNavigation.js"

/**
 * Where to land when moving the current page to another CCIP version: the page's 1:1 counterpart
 * for the chain family (shared sidebar `pageId`), otherwise the target version's root. There is
 * deliberately no section-level fallback.
 *
 * Shared by the version toggle, the "Switch to latest" banner, the chain selector (when the chosen
 * family is documented in another version) and the page-load guard, so all four always agree.
 *
 * @returns URL without a leading slash, e.g. "ccip/v1/billing" or "ccip"
 */
export function resolveCcipVersionSwitchUrl(
  pathname: string,
  chain: ChainType,
  fromVersion: CcipVersion,
  toVersion: CcipVersion
): string {
  const counterpart = findCrossVersionEquivalentUrl(
    pathname,
    chain,
    CCIP_SIDEBARS[fromVersion],
    CCIP_SIDEBARS[toVersion]
  )
  return counterpart ?? getCcipVersionRootUrl(toVersion)
}

/**
 * Redirects the page-load guard (CcipVersionGuard.astro) applies on `pathname`, keyed by the
 * chain family stored in localStorage.
 *
 * A CCIP page takes its version from the URL but, when the URL has no chain segment, its chain
 * family from localStorage. That can produce a pair with no docs: Aptos, Solana or TON on a v2 page,
 * or Canton on a v1 page. Each such family is sent to the newest version that documents it. Pages
 * whose URL names a chain, and versionless shared pages (Directory, API reference hub), never need one.
 *
 * @returns chain family → absolute target path, or null when no stored family needs a redirect
 */
export function getCcipChainVersionRedirects(pathname: string): Partial<Record<ChainType, string>> | null {
  const path = pathname.replace(/\/+$/, "") || "/"
  if (path !== "/ccip" && !path.startsWith("/ccip/")) return null
  if (detectChainFromPath(path) !== null) return null

  const version = detectVersionFromPath(path)
  if (!version) return null

  const redirects: Partial<Record<ChainType, string>> = {}
  for (const chain of CCIP_SUPPORTED_CHAINS) {
    if (isChainInCcipVersion(chain, version)) continue
    const targetVersion = getLatestCcipVersionForChain(chain)
    if (!targetVersion) continue
    redirects[chain] = `/${resolveCcipVersionSwitchUrl(path, chain, version, targetVersion)}`
  }
  return Object.keys(redirects).length > 0 ? redirects : null
}
