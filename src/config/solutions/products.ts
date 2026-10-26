import type { Sections } from "../../content.config.ts"

/**
 * Sidebar-section key to display label and product landing page.
 * Extend this when a solution declares a product that is not listed yet:
 * a missing entry means the badge silently disappears.
 */
export const SOLUTION_PRODUCTS: Record<string, { label: string; href: string }> = {
  ace: { label: "ACE", href: "/ace" },
  ccip: { label: "CCIP", href: "/ccip" },
  cre: { label: "CRE", href: "/cre" },
  crec: { label: "CRE Connect", href: "/crec" },
  dataFeeds: { label: "Data Feeds", href: "/data-feeds" },
  dataStreams: { label: "Data Streams", href: "/data-streams" },
  dataLink: { label: "DataLink", href: "/datalink" },
  chainlinkFunctions: { label: "Functions", href: "/chainlink-functions" },
  automation: { label: "Automation", href: "/chainlink-automation" },
  vrf: { label: "VRF", href: "/vrf" },
}

export function productLabel(key: Sections): string {
  return SOLUTION_PRODUCTS[key]?.label ?? key
}
