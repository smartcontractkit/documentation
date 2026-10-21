import { expect, test, describe } from "@jest/globals"
import { extractContentEntities, formatLabelWord } from "./entities.ts"
import { generateBreadcrumbList } from "../structuredData.ts"

function breadcrumbNames(pathname: string): string[] {
  const data = generateBreadcrumbList(pathname, "https://docs.chain.link") as {
    itemListElement: { name: string }[]
  }
  return data.itemListElement.map((item) => item.name)
}

describe("formatLabelWord", () => {
  test("keeps product acronyms uppercase", () => {
    expect(formatLabelWord("ccip")).toBe("CCIP")
    expect(formatLabelWord("cre")).toBe("CRE")
    expect(formatLabelWord("CCIP")).toBe("CCIP")
    expect(formatLabelWord("CRE")).toBe("CRE")
  })

  test("still title-cases ordinary words", () => {
    expect(formatLabelWord("getting")).toBe("Getting")
    expect(formatLabelWord("started")).toBe("Started")
  })

  test("keeps an all-caps title token that is not in the map", () => {
    expect(formatLabelWord("DON")).toBe("DON")
  })
})

describe("search result labels", () => {
  test("breadcrumb names use CCIP and CRE", () => {
    expect(breadcrumbNames("/ccip/getting-started")).toEqual(["Documentation", "CCIP", "Getting Started"])
    expect(breadcrumbNames("/cre/overview")).toEqual(["Documentation", "CRE", "Overview"])
    expect(breadcrumbNames("/ccip/api-reference/evm")).toEqual(["Documentation", "CCIP", "API Reference", "EVM"])
  })

  test("title entities keep CCIP and CRE", () => {
    const ccip = extractContentEntities("", "/ccip", "Chainlink CCIP - Cross-Chain Interoperability Protocol")
    expect(ccip.about.map((entity) => entity.name)).toContain("CCIP")
    expect(ccip.about.map((entity) => entity.name)).not.toContain("Ccip")

    const cre = extractContentEntities("", "/cre", "Chainlink Runtime Environment (CRE)")
    expect(cre.about.map((entity) => entity.name)).toContain("CRE")
    expect(cre.about.map((entity) => entity.name)).not.toContain("Cre")
  })
})
