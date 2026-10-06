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
    "/any-api",
    "/any-api/introduction",
    "/any-api/get-request/examples/single-word-response",
    "/chainlink-nodes/external-initiators/external-initiators-introduction",
    "/chainlink-nodes/external-initiators/building-external-initiators",
    "/chainlink-nodes/job-specs/direct-request-get-uint256",
    "/chainlink-nodes/job-specs/multi-word-job",
    "https://docs.chain.link/chainlink-nodes/job-specs/direct-request-existing-job",
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
    "/chainlink-nodes",
    "/chainlink-nodes/oracle-jobs/jobs",
    "/chainlink-nodes/oracle-jobs/all-jobs",
    "/chainlink-nodes/v1/fulfilling-requests",
    "/any-api-extra",
  ])("keeps %s", (pathname) => {
    expect(isSunsetDocsPath(pathname)).toBe(false)
  })

  it("hides the product sidebars and their content files", () => {
    expect(isSunsetSidebarSection("automation")).toBe(true)
    expect(isSunsetSidebarSection("chainlinkFunctions")).toBe(true)
    expect(isSunsetSidebarSection("vrf")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/chainlink-functions/getting-started.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/eth-balance-monitor.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/any-api/introduction.mdx")).toBe(true)
    expect(
      isSunsetContentFile("/repo/src/content/chainlink-nodes/external-initiators/building-external-initiators.mdx")
    ).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/chainlink-nodes/job-specs/direct-request-get-bool.mdx")).toBe(true)
    expect(isSunsetContentFile("/repo/src/content/quickstarts/circuit-breaker.mdx")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/chainlink-nodes/oracle-jobs/all-jobs.mdx")).toBe(false)
    expect(isSunsetContentFile("/repo/src/content/chainlink-nodes/oracle-jobs/jobs.mdx")).toBe(false)
  })

  it("removes Any API and external initiators from the Nodes menu and keeps OCR jobs", () => {
    const sectionNames = SIDEBAR.nodeOperator?.map((group) => group.section) ?? []
    const urls = SIDEBAR.nodeOperator?.flatMap((group) => group.contents.map((item) => item.url)) ?? []

    expect(sectionNames).not.toContain("Connect to Any API")
    expect(sectionNames).not.toContain("External Initiators")
    expect(sectionNames).toContain("Job and Task Reference")
    expect(urls).toContain("chainlink-nodes/oracle-jobs/jobs")
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
})
