import { describe, expect, it } from "@jest/globals"
import { SIDEBAR, SIDEBAR_WITH_SUNSET_PRODUCTS } from "./sidebar.js"
import {
  SUNSET_PAGES_STAY_IN_SITEMAP,
  isSunsetContentFile,
  isSunsetDocsPath,
  isSunsetSidebarSection,
} from "./sunset.js"

describe("sunset docs paths", () => {
  it.each([
    "/chainlink-functions",
    "/chainlink-functions/",
    "/chainlink-functions/getting-started",
    "chainlink-automation/overview/supported-networks",
    "https://docs.chain.link/chainlink-automation/llms-full.txt",
    "/quickstarts/time-based-upkeep",
    "/quickstarts/functions-demo-app?parent=automation",
    "/vrf/v1",
    "/vrf/v1/introduction",
    "/vrf/v2",
    "/vrf/v2/subscription",
    "/vrf/v2/subscription/ui#pending",
    "https://docs.chain.link/vrf/v2/direct-funding",
  ])("hides %s", (pathname) => {
    expect(isSunsetDocsPath(pathname)).toBe(true)
  })

  it.each([
    "/",
    "/cre",
    "/vrf",
    "/vrf/v2-5/getting-started",
    "/vrf/v2-5/migration-from-v2",
    "/vrf/v2-5/migration-from-v1",
    "/vrf/v25",
    "vrf/v2-extra",
    "/quickstarts/vrf-mystery-box",
    "/quickstarts/vrf-enabled-lootbox-pack",
    "/quickstarts/chainlink-demo-app",
    "/quickstarts/circuit-breaker",
    "/chainlink-local",
    "chainlink-functions-extra",
  ])("keeps %s", (pathname) => {
    expect(isSunsetDocsPath(pathname)).toBe(false)
  })

  it("hides the product sidebars and their content files", () => {
    expect(isSunsetSidebarSection("automation")).toBe(true)
    expect(isSunsetSidebarSection("chainlinkFunctions")).toBe(true)
    expect(isSunsetSidebarSection("vrf")).toBe(false)
    expect(isSunsetSidebarSection("legacy")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/chainlink-functions/getting-started.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/eth-balance-monitor.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/vrf/v1/introduction.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/vrf/v2/subscription/ui.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/vrf/v2-5/getting-started.mdx")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/vrf/index.mdx")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/circuit-breaker.mdx")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/vrf-mystery-box.mdx")).toBe(false)
  })

  it("keeps the product trees for their own pages and keeps the pages in the sitemap", () => {
    expect(SIDEBAR.automation).toBeUndefined()
    expect(SIDEBAR.chainlinkFunctions).toBeUndefined()
    expect(SIDEBAR.vrf?.length).toBeGreaterThan(0)

    const automationTitles = SIDEBAR_WITH_SUNSET_PRODUCTS.automation?.flatMap((group) =>
      group.contents.map((item) => item.title)
    )
    const functionsTitles = SIDEBAR_WITH_SUNSET_PRODUCTS.chainlinkFunctions?.flatMap((group) =>
      group.contents.map((item) => item.title)
    )

    expect(automationTitles).toContain("Cancel an Upkeep and Withdraw Funds")
    expect(functionsTitles).toContain("Cancel a Subscription and Withdraw Funds")
    expect(SUNSET_PAGES_STAY_IN_SITEMAP).toBe(true)
  })

  it("drops the deprecated VRF v2 block and keeps the v2.5 migration links", () => {
    const vrfSections = SIDEBAR.vrf?.map((group) => group.section) ?? []
    const vrfTitles = SIDEBAR.vrf?.flatMap((group) => group.contents.map((item) => item.title)) ?? []
    const legacySections = SIDEBAR.legacy?.map((group) => group.section) ?? []

    expect(vrfSections).not.toContain("VRF V2 [DEPRECATED]")
    expect(vrfTitles).toContain("Migrating from V2")
    expect(vrfTitles).toContain("Migrating from V1")
    expect(vrfTitles).not.toContain("VRF V2 Subscription Method")
    expect(vrfTitles).not.toContain("VRF V2 Direct Funding Method")
    expect(legacySections).toContain("VRF V2 Subscription Method [DEPRECATED]")
    expect(legacySections).toContain("VRF V2 Direct Funding Method [DEPRECATED]")
    expect(legacySections).toContain("VRF v1 [DEPRECATED]")
  })
})
