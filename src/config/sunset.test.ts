import { describe, expect, it } from "@jest/globals"
import { isSunsetContentFile, isSunsetDocsPath, isSunsetSidebarSection } from "./sunset.js"

describe("sunset docs paths", () => {
  it.each([
    "/chainlink-functions",
    "/chainlink-functions/",
    "/chainlink-functions/getting-started",
    "chainlink-automation/overview/supported-networks",
    "https://docs.chain.link/chainlink-automation/llms-full.txt",
    "/quickstarts/time-based-upkeep",
    "/quickstarts/functions-demo-app?parent=automation",
  ])("hides %s", (pathname) => {
    expect(isSunsetDocsPath(pathname)).toBe(true)
  })

  it.each([
    "/",
    "/cre",
    "/vrf/v2-5/getting-started",
    "/quickstarts/vrf-mystery-box",
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
    expect(isSunsetContentFile("/repo/src/content/chainlink-functions/getting-started.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/eth-balance-monitor.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/circuit-breaker.mdx")).toBe(false)
  })
})
