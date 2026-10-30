import { describe, expect, it } from "@jest/globals"
import { SIDEBAR_WITH_SUNSET_PRODUCTS } from "../../sidebar.ts"
import { SIDEBAR_SECTIONS } from "../../sidebarSections.ts"
import type { SectionContent } from "../../sidebar.ts"

/** Products whose sidebars include the shared Account & Organization section. */
const PRODUCTS = {
  [SIDEBAR_SECTIONS.CRE]: "Workflow Operations",
  [SIDEBAR_SECTIONS.ACE]: "Getting Started",
  [SIDEBAR_SECTIONS.CREC]: "Getting Started",
  [SIDEBAR_SECTIONS.DATA_STREAMS]: "Chainlink Data Streams",
} as const

function platformSection(product: keyof typeof PRODUCTS) {
  const entries = SIDEBAR_WITH_SUNSET_PRODUCTS[product] ?? []
  return entries.find((entry) => entry.section === "Account & Organization")
}

function requirePlatformSection(product: keyof typeof PRODUCTS) {
  const section = platformSection(product)
  if (!section) throw new Error(`Missing Account & Organization section for ${product}`)
  return section
}

function urls(items: SectionContent[]): string[] {
  return items.flatMap((item) => [...(item.url ? [item.url] : []), ...(item.children ? urls(item.children) : [])])
}

function titles(items: SectionContent[]): string[] {
  return items.flatMap((item) => [item.title, ...(item.children ? titles(item.children) : [])])
}

describe("Account & Organization sidebar placement", () => {
  it.each(Object.entries(PRODUCTS))("places the section directly after %s's setup section", (product, after) => {
    const entries = SIDEBAR_WITH_SUNSET_PRODUCTS[product as keyof typeof PRODUCTS] ?? []
    const sectionTitles = entries.map((entry) => entry.section)

    expect(sectionTitles.indexOf("Account & Organization")).toBe(sectionTitles.indexOf(after) + 1)
  })

  it.each(Object.keys(PRODUCTS))("scopes every platform link to %s", (product) => {
    const section = requirePlatformSection(product as keyof typeof PRODUCTS)

    const links = urls(section.contents)
    expect(links.length).toBeGreaterThan(0)
    expect(links.every((url) => url.startsWith("chainlink-platform/") && url.includes(`?parent=${product}`))).toBe(true)
  })

  it("omits API Keys for Data Streams", () => {
    const section = requirePlatformSection(SIDEBAR_SECTIONS.DATA_STREAMS)
    expect(titles(section.contents)).not.toContain("API Keys")
  })

  it("keeps API Keys for CRE, ACE, and CRE Connect", () => {
    for (const product of [SIDEBAR_SECTIONS.CRE, SIDEBAR_SECTIONS.ACE, SIDEBAR_SECTIONS.CREC]) {
      const section = requirePlatformSection(product)
      expect(titles(section.contents)).toContain("API Keys")
    }
  })
})
