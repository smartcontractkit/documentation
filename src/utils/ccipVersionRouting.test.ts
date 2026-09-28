import { describe, expect, test } from "@jest/globals"
import { getCcipChainVersionRedirects, resolveCcipVersionSwitchUrl } from "./ccipVersionRouting.ts"
import { findCrossVersionEquivalentUrl } from "./chainNavigation.ts"
import { CCIP_SIDEBARS, type SectionContent, type SectionEntry } from "~/config/sidebar.ts"
import { getLatestCcipVersionForChain, isChainInCcipVersion } from "~/config/ccipVersions.ts"
import { detectChainFromPath } from "~/stores/chainType.ts"
import type { ChainType } from "~/config/types.ts"

describe("CCIP version chain families", () => {
  test("v2 documents EVM and Canton, v1 documents EVM, Solana, Aptos and TON", () => {
    expect(isChainInCcipVersion("evm", "v2.0")).toBe(true)
    expect(isChainInCcipVersion("canton", "v2.0")).toBe(true)
    expect(isChainInCcipVersion("aptos", "v2.0")).toBe(false)
    expect(isChainInCcipVersion("canton", "v1.6")).toBe(false)
    expect(isChainInCcipVersion("ton", "v1.6")).toBe(true)
  })

  test("each family resolves to the newest version that documents it", () => {
    expect(getLatestCcipVersionForChain("evm")).toBe("v2.0")
    expect(getLatestCcipVersionForChain("canton")).toBe("v2.0")
    expect(getLatestCcipVersionForChain("solana")).toBe("v1.6")
    expect(getLatestCcipVersionForChain("ton")).toBe("v1.6")
  })
})

describe("resolveCcipVersionSwitchUrl", () => {
  test.each([
    ["/ccip/overview", "ccip/v1/overview"],
    ["/ccip/concepts/fees-and-billing", "ccip/v1/billing"],
    ["/ccip/concepts/service-responsibility", "ccip/v1/service-responsibility"],
    ["/ccip/concepts/execution-latency", "ccip/v1/ccip-execution-latency"],
    ["/ccip/concepts/manual-execution", "ccip/v1/concepts/manual-execution"],
    ["/ccip/concepts/architecture/overview", "ccip/v1/concepts/architecture/overview"],
    ["/ccip/evm/service-limits", "ccip/v1/evm/service-limits"],
    ["/ccip/evm/concepts/cross-chain-token/rate-limits/overview", "ccip/v1/concepts/rate-limit-management/overview"],
  ])("EVM %s (v2) ↔ /%s (v1)", (v2Path, v1Url) => {
    expect(resolveCcipVersionSwitchUrl(v2Path, "evm", "v2.0", "v1.6")).toBe(v1Url)
    expect(resolveCcipVersionSwitchUrl(`/${v1Url}`, "evm", "v1.6", "v2.0")).toBe(v2Path.slice(1))
  })

  test("landing pages map to each other's root", () => {
    expect(resolveCcipVersionSwitchUrl("/ccip", "evm", "v2.0", "v1.6")).toBe("ccip/v1")
    expect(resolveCcipVersionSwitchUrl("/ccip/v1", "evm", "v1.6", "v2.0")).toBe("ccip")
  })

  test("pages without a 1:1 counterpart go to the target version's root", () => {
    expect(resolveCcipVersionSwitchUrl("/ccip/concepts/execution-latency/ftf", "evm", "v2.0", "v1.6")).toBe("ccip/v1")
    // v1 "How Rate Limits Work" has no v2 page
    expect(
      resolveCcipVersionSwitchUrl("/ccip/v1/concepts/rate-limit-management/how-rate-limits-work", "evm", "v1.6", "v2.0")
    ).toBe("ccip")
    // No pageId: a same-titled page is not a counterpart
    expect(resolveCcipVersionSwitchUrl("/ccip/v1/evm/tutorials", "evm", "v1.6", "v2.0")).toBe("ccip")
  })

  test("an external app is not a page of the other version", () => {
    // v2 lists the Explorer as https://ccip.chain.link/ with the same pageId as the v1 page
    expect(resolveCcipVersionSwitchUrl("/ccip/v1/tools-resources/ccip-explorer", "evm", "v1.6", "v2.0")).toBe("ccip")
    expect(resolveCcipVersionSwitchUrl("/ccip/v1/evm/tools-resources/token-manager", "evm", "v1.6", "v2.0")).toBe(
      "ccip"
    )
  })

  test("resolves the counterpart for the requested chain family", () => {
    expect(resolveCcipVersionSwitchUrl("/ccip/evm/concepts/best-practices", "aptos", "v2.0", "v1.6")).toBe(
      "ccip/v1/aptos/concepts/best-practices"
    )
    expect(resolveCcipVersionSwitchUrl("/ccip/v1/billing", "canton", "v1.6", "v2.0")).toBe(
      "ccip/concepts/fees-and-billing"
    )
    // v2 test tokens is hidden for Canton
    expect(resolveCcipVersionSwitchUrl("/ccip/v1/test-tokens", "canton", "v1.6", "v2.0")).toBe("ccip")
  })
})

describe("findCrossVersionEquivalentUrl", () => {
  const source: SectionEntry[] = [
    {
      section: "S",
      contents: [
        { title: "Page", url: "ccip/v1/page", pageId: "page" },
        { title: "Explorer", url: "ccip/v1/explorer", pageId: "explorer" },
        { title: "Untagged", url: "ccip/v1/untagged" },
        {
          title: "Hardhat",
          url: "ccip/v1/hardhat",
          pageId: "tool",
          highlightAsCurrent: ["ccip/v1/foundry"],
        },
      ],
    },
  ]

  test("a child of a parent hidden for the chain is not a match", () => {
    const target: SectionEntry[] = [
      {
        section: "S",
        contents: [
          { title: "Gated", chainTypes: ["evm"], children: [{ title: "Page", url: "ccip/evm-only", pageId: "page" }] },
          { title: "Page", url: "ccip/page", pageId: "page", chainTypes: ["canton"] },
        ],
      },
    ]
    expect(findCrossVersionEquivalentUrl("/ccip/v1/page", "evm", source, target)).toBe("ccip/evm-only")
    expect(findCrossVersionEquivalentUrl("/ccip/v1/page", "canton", source, target)).toBe("ccip/page")
    expect(findCrossVersionEquivalentUrl("/ccip/v1/page", "solana", source, target)).toBeNull()
  })

  test("matches by pageId only, never by title, and skips external targets", () => {
    const target: SectionContent[] = [
      { title: "Untagged", url: "ccip/untagged" },
      { title: "Explorer", url: "https://ccip.chain.link/", pageId: "explorer" },
    ]
    const targetSidebar: SectionEntry[] = [{ section: "S", contents: target }]
    expect(findCrossVersionEquivalentUrl("/ccip/v1/untagged", "evm", source, targetSidebar)).toBeNull()
    expect(findCrossVersionEquivalentUrl("/ccip/v1/explorer", "evm", source, targetSidebar)).toBeNull()
  })

  test("keeps the highlightAsCurrent variant the reader is on", () => {
    const target: SectionEntry[] = [
      {
        section: "S",
        contents: [{ title: "Hardhat", url: "ccip/hardhat", pageId: "tool", highlightAsCurrent: ["ccip/foundry"] }],
      },
    ]
    expect(findCrossVersionEquivalentUrl("/ccip/v1/foundry/", "evm", source, target)).toBe("ccip/foundry")
    expect(findCrossVersionEquivalentUrl("/ccip/v1/hardhat", "evm", source, target)).toBe("ccip/hardhat")
  })
})

describe("getCcipChainVersionRedirects", () => {
  test("v2 landing sends v1-only families to the v1 landing", () => {
    const expected = { solana: "/ccip/v1", aptos: "/ccip/v1", ton: "/ccip/v1" }
    expect(getCcipChainVersionRedirects("/ccip")).toEqual(expected)
    expect(getCcipChainVersionRedirects("/ccip/")).toEqual(expected)
  })

  test("v1 landing sends Canton to the v2 landing", () => {
    expect(getCcipChainVersionRedirects("/ccip/v1")).toEqual({ canton: "/ccip" })
  })

  test("chainless pages redirect to the counterpart, otherwise to the root", () => {
    expect(getCcipChainVersionRedirects("/ccip/concepts/fees-and-billing")).toEqual({
      solana: "/ccip/v1/billing",
      aptos: "/ccip/v1/billing",
      ton: "/ccip/v1/billing",
    })
    // v1 Overview is not shown for TON
    expect(getCcipChainVersionRedirects("/ccip/overview")).toEqual({
      solana: "/ccip/v1/overview",
      aptos: "/ccip/v1/overview",
      ton: "/ccip/v1",
    })
    expect(getCcipChainVersionRedirects("/ccip/v1/billing")).toEqual({ canton: "/ccip/concepts/fees-and-billing" })
  })

  test.each([
    "/ccip/evm/concepts/best-practices",
    "/ccip/canton/getting-started",
    "/ccip/v1/aptos/getting-started",
    "/ccip/v1/svm/tutorials",
    "/ccip/directory/mainnet",
    "/data-feeds",
    "/resources/chainlink-developer-agent-skills",
  ])("%s never redirects (URL names the chain, or page is versionless / not CCIP)", (path) => {
    expect(getCcipChainVersionRedirects(path)).toBeNull()
  })

  test("targets never redirect again for the same chain family (no loops, no self-redirects)", () => {
    const urls = new Set<string>(["/ccip", "/ccip/v1"])
    const collect = (items: SectionContent[]) => {
      for (const item of items) {
        if (item.url && !/^https?:/.test(item.url)) urls.add(`/${item.url.replace(/^\/+/, "")}`)
        if (item.children) collect(item.children)
      }
    }
    Object.values(CCIP_SIDEBARS).forEach((sidebar) => sidebar.forEach((section) => collect(section.contents)))

    let checked = 0
    for (const url of urls) {
      if (detectChainFromPath(url) !== null) continue
      const redirects = getCcipChainVersionRedirects(url) ?? {}
      for (const [chain, target] of Object.entries(redirects) as [ChainType, string][]) {
        checked++
        expect(target).not.toBe(url)
        expect(getCcipChainVersionRedirects(target)?.[chain]).toBeUndefined()
      }
    }
    expect(checked).toBeGreaterThan(20)
  })
})
