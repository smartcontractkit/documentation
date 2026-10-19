import path from "node:path"
import fs from "node:fs/promises"
import os from "node:os"
import { describe, expect, test } from "@jest/globals"
import { transformPageBodyToMarkdown } from "@lib/markdown/buildMarkdownArtifact.js"
import { unescapeMarkdown } from "@lib/markdown/formatters.js"
import { extractFrontmatter } from "@lib/markdown/utils.js"
import {
  assembleLlmsDocument,
  generateSolutionLlmsFiles,
  orderPages,
  renderLlmsPageMarkdown,
  selectLlmsTargets,
} from "./generate-llms.js"
import { SOLUTIONS } from "../config/solutions/index.ts"
import { crossChainVaultAdapter } from "../config/solutions/cross-chain-vault-adapter.ts"
import { demoSinglePage } from "../config/solutions/demo-single-page.ts"
import { demoMultiPage } from "../config/solutions/demo-multi-page.ts"
import { collectSolutionPages } from "../utils/solutionPages.js"
import { readSolutionLlmsPages, renderSolutionLlmsDocument } from "../lib/markdown/solutionLlms.js"
import { llmsFilesToValidate, validateLlmsFile } from "./validate-llms.js"
import { SOLUTION_DISCLAIMER } from "../config/solutions/disclaimer.ts"

test("sidebar links order discovered pages without adding a solution to a product export", () => {
  const first = path.resolve("src/content/ccip/first.mdx")
  const second = path.resolve("src/content/ccip/second.mdx")
  const solution = path.resolve("src/content/solutions/example/index.mdx")
  expect(orderPages("ccip", [first, second], [second, solution, second, first])).toEqual([second, first])
})

describe("solution CLI exports", () => {
  test("includes all published solutions by default and supports solution-only and product-only selection", () => {
    const published = SOLUTIONS.filter((solution) => !solution.hidden)
    expect(selectLlmsTargets().solutions).toEqual(published)
    expect(selectLlmsTargets().sections).toContain("ccip")
    expect(selectLlmsTargets("solutions")).toEqual({ sections: [], solutions: published })
    expect(selectLlmsTargets(`solutions/${crossChainVaultAdapter.slug}`)).toEqual({
      sections: [],
      solutions: [crossChainVaultAdapter],
    })
    expect(selectLlmsTargets("ccip")).toEqual({ sections: ["ccip"], solutions: [] })
    expect(() => selectLlmsTargets(`solutions/${demoSinglePage.slug}`)).toThrow("Unknown or hidden solution")
    expect(() => selectLlmsTargets("solutions/does-not-exist")).toThrow("Unknown or hidden solution")
    expect(
      llmsFilesToValidate()
        .filter((file) => file.solution)
        .map((file) => file.solution)
    ).toEqual(published)
    expect(llmsFilesToValidate().find((file) => file.label === "cre-go")?.path).toContain("llms-full-go.txt")
  })

  test.each([demoSinglePage, demoMultiPage])(
    "writes $slug only when published, including its complete page set",
    async (fixture) => {
      const directory = await fs.mkdtemp(path.join(os.tmpdir(), "solution-llms-cli-"))
      try {
        expect(await generateSolutionLlmsFiles([fixture], directory)).toEqual([])
        expect(await fs.readdir(directory)).toEqual([])
        const published = { ...fixture, hidden: false }
        const reports = await generateSolutionLlmsFiles([published], directory)
        const document = await fs.readFile(path.join(directory, fixture.slug, "llms-full.txt"), "utf8")
        const pageCount = fixture.nav?.flatMap((group) => group.pages).length ?? 1
        expect(reports).toHaveLength(1)
        expect(reports[0].pagesProcessed).toBe(pageCount)
        expect(reports[0].bytes).toBe(Buffer.byteLength(document))
        expect(document.match(/^Source: /gm)).toHaveLength(pageCount)
        expect(document.match(/^## Disclaimer$/gm)).toHaveLength(pageCount)
        expect(document).toContain(`[${SOLUTION_DISCLAIMER.termsLabel}](${SOLUTION_DISCLAIMER.termsUrl})`)
        expect(
          await validateLlmsFile({
            path: path.join(directory, fixture.slug, "llms-full.txt"),
            label: fixture.slug,
            maxBytes: 5_000_000,
            solution: published,
          })
        ).toEqual({ errors: [], warnings: [] })
      } finally {
        await fs.rm(directory, { recursive: true, force: true })
      }
    }
  )

  test("validates real generated pages and detects missing pages, duplicates, and incomplete disclaimers", async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "solution-llms-validation-"))
    try {
      await generateSolutionLlmsFiles([crossChainVaultAdapter], directory)
      const file = {
        path: path.join(directory, crossChainVaultAdapter.slug, "llms-full.txt"),
        label: crossChainVaultAdapter.slug,
        maxBytes: 5_000_000,
        solution: crossChainVaultAdapter,
      }
      const document = await fs.readFile(file.path, "utf8")
      expect(await validateLlmsFile(file)).toEqual({ errors: [], warnings: [] })
      const headers = [...document.matchAll(/^# [^\n]+\nSource: [^\n]+\n/gm)]
      expect(headers).toHaveLength(10)
      await fs.writeFile(file.path, document.slice(headers[1].index), "utf8")
      expect((await validateLlmsFile(file)).errors).toContain(
        `${file.label}: solution pages are missing, duplicated, or out of navigation order`
      )
      await fs.writeFile(file.path, document + document.slice(headers[0].index, headers[1].index), "utf8")
      expect((await validateLlmsFile(file)).errors).toContain(
        `${file.label}: solution pages are missing, duplicated, or out of navigation order`
      )
      await fs.writeFile(file.path, document.replace(SOLUTION_DISCLAIMER.afterTerms, ""), "utf8")
      expect((await validateLlmsFile(file)).errors.some((error) => error.includes("complete disclaimer missing"))).toBe(
        true
      )
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  }, 30_000)

  test("discovers MD/MDX pages without treating the generated TXT or README as solution pages", async () => {
    const pages = await readSolutionLlmsPages(crossChainVaultAdapter)
    expect(pages).toHaveLength(10)
    expect(pages.every((page) => page.filePath?.endsWith(".mdx"))).toBe(true)
  })

  test("rejects ambiguous sources and navigation that would omit or duplicate content", async () => {
    const slug = crossChainVaultAdapter.slug
    const first = { id: `${slug}/index`, data: { title: "First" } }
    const second = { id: `${slug}/second`, data: { title: "Second" } }
    expect(() => collectSolutionPages(slug, [first, { ...first, id: slug }])).toThrow("more than one source")
    await expect(
      renderSolutionLlmsDocument({ ...crossChainVaultAdapter, nav: undefined }, [first, second])
    ).rejects.toThrow("declares no")
    await expect(renderSolutionLlmsDocument({ ...crossChainVaultAdapter, nav: undefined }, [second])).rejects.toThrow(
      "has no landing page"
    )
    await expect(
      renderSolutionLlmsDocument(
        { ...crossChainVaultAdapter, nav: [{ group: "Pages", pages: ["index", "index", "second"] }] },
        [first, second]
      )
    ).rejects.toThrow("more than once")
    await expect(
      renderSolutionLlmsDocument({ ...crossChainVaultAdapter, nav: [{ group: "Pages", pages: ["index"] }] }, [
        first,
        second,
      ])
    ).rejects.toThrow("not listed in the nav")
    await expect(
      renderSolutionLlmsDocument(
        { ...crossChainVaultAdapter, nav: [{ group: "Pages", pages: ["index", "missing"] }] },
        [first, second]
      )
    ).rejects.toThrow("but no page exists")
  })
})

describe("renderLlmsPageMarkdown", () => {
  test("preserves explicit accordion anchors through the shared transform and TXT cleanup", async () => {
    const raw = `---
title: "Deploy the adapter"
---

[Fund the adapter](#fund-the-adapter)

<AnchoredAccordion title="Set the return format and fund the adapter" number={4} depth={3} anchorId="fund-the-adapter">
Fund the adapter before sending a request.
</AnchoredAccordion>

<AnchoredAccordion title="Escaped id" anchorId={${JSON.stringify('a&"<>\\_b')}}>
Keep this content too.
</AnchoredAccordion>`
    const absFile = path.resolve("src/content/ccip/accordion-anchors.mdx")
    const rendered = await renderLlmsPageMarkdown(raw, absFile, "ccip")

    expect(rendered.transformMode).toBe("normal")
    expect(rendered.markdown).toContain("[Fund the adapter](#fund-the-adapter)")
    expect(rendered.markdown).toContain(
      '### 4. Set the return format and fund the adapter <a id="fund-the-adapter"></a>'
    )
    expect(rendered.markdown).toContain('## Escaped id <a id="a&amp;&quot;&lt;&gt;&#92;_b"></a>')
    expect(rendered.markdown).toContain("Fund the adapter before sending a request.")
    expect(rendered.markdown).toContain("Keep this content too.")
  })

  test("uses the same page body as the Markdown route", async () => {
    const raw = `---
title: "Shared page"
metadata:
  lastModified: "2024-01-02"
---

![Plain](/plain.png)

<Aside type="note">
Keep this fact.
</Aside>
`
    const absFile = path.resolve("src/content/ccip/shared-page.mdx")
    const rendered = await renderLlmsPageMarkdown(raw, absFile, "ccip")
    const { body } = extractFrontmatter(raw)
    const transformed = await transformPageBodyToMarkdown(body, absFile, {
      siteBase: "https://docs.chain.link",
    })

    expect(rendered.transformMode).toBe("normal")
    expect(rendered.markdown.startsWith("# Shared page\n")).toBe(true)
    expect(rendered.markdown).toContain("Source: https://docs.chain.link/ccip/shared-page")
    expect(rendered.markdown).toContain("Last Updated: 2024-01-02")
    expect(rendered.markdown.endsWith(unescapeMarkdown(transformed.markdown).trim())).toBe(true)
    expect(rendered.markdown).toContain("![Plain](/plain.png)")
    expect(rendered.markdown).toContain("Keep this fact.")
    expect(rendered.markdown).not.toContain("(Image: Plain)")
  })
})

describe("assembleLlmsDocument", () => {
  const disclaimer = [
    "> **CAUTION: Educational Example Disclaimer**",
    ">",
    '> Do not use the code in this example in a production environment without completing your own audits. This template is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.',
  ].join("\n")
  const otherDisclaimer = [
    "> **CAUTION: Disclaimer**",
    ">",
    '> This guide is an example. Do not use the code in this example in a production environment. This template is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.',
  ].join("\n")

  function page(title: string, block = disclaimer): string {
    return `# ${title}\n\nIntro.\n\n${block}\n\nAfter.\n`
  }

  test("keeps the first copy of each disclaimer where it appears and drops later copies", () => {
    const document = assembleLlmsDocument([page("One"), page("Two", otherDisclaimer), page("Three")])
    const firstPage = document.slice(document.indexOf("# One"), document.indexOf("# Two"))
    const secondPage = document.slice(document.indexOf("# Two"), document.indexOf("# Three"))
    const thirdPage = document.slice(document.indexOf("# Three"))

    expect(document.startsWith("# One\n")).toBe(true)
    expect(firstPage).toContain("Educational Example Disclaimer")
    expect(secondPage).toContain("This guide is an example.")
    expect(thirdPage).not.toContain("Educational Example Disclaimer")
    expect(thirdPage).toContain("Intro.")
    expect(thirdPage).toContain("After.")
    expect(document.match(/Educational Example Disclaimer/g)).toHaveLength(1)
    expect(document.match(/This guide is an example\./g)).toHaveLength(1)
  })

  test("preserves a disclaimer on every solution page when deduplication is disabled", () => {
    const document = assembleLlmsDocument([page("One"), page("Two")], { deduplicateDisclaimers: false })
    expect(document.match(/Educational Example Disclaimer/g)).toHaveLength(2)
    expect(document.slice(document.indexOf("# Two"))).toContain(disclaimer)
  })

  test("keeps a different repeated callout and a disclaimer inside a code fence", () => {
    const note = "> **NOTE: Authentication required**\n>\n> Log in first."
    const fenced = [
      "```md",
      "> Do not use the code in this example in a production environment without completing your own audits.",
      "```",
    ].join("\n")
    const document = assembleLlmsDocument([
      `${page("One")}\n${note}\n\n${fenced}\n`,
      `${page("Two")}\n${note}\n\n${fenced}\n`,
    ])

    expect(document.match(/Authentication required/g)).toHaveLength(2)
    expect(document.match(/```md/g)).toHaveLength(2)
    expect(document.match(/Educational Example Disclaimer/g)).toHaveLength(1)
    expect(document.indexOf("Educational Example Disclaimer")).toBeGreaterThan(document.indexOf("# One"))
    expect(document.indexOf("Educational Example Disclaimer")).toBeLessThan(document.indexOf("# Two"))
  })

  test("drops a repeated copy of the updated education aside", () => {
    const updated = [
      "> **CAUTION: Educational Example Disclaimer**",
      ">",
      '> Please note, this page contains community examples only. This code represents an example of using a Chainlink product or service, and is intended for demonstration and educational purposes only. It is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. Each party intending to use this example code does so entirely at their own risk.',
    ].join("\n")
    const document = assembleLlmsDocument([page("One", updated), page("Two", updated)])
    const secondPage = document.slice(document.indexOf("# Two"))

    expect(document.match(/community examples only/g)).toHaveLength(1)
    expect(secondPage).not.toContain("community examples only")
    expect(secondPage).toContain("After.")
  })

  test("keeps a repeated product notice that is not a code-example disclaimer", () => {
    const notice = [
      "> **NOTE**",
      ">",
      '> Chainlink Functions is offered "AS IS" and "AS AVAILABLE" without conditions or warranties of any kind. Neither Chainlink Labs nor Chainlink node operators are responsible for unintended outputs from Functions.',
    ].join("\n")
    const document = assembleLlmsDocument([page("One", notice), page("Two", notice)])

    expect(document.match(/unintended outputs from Functions/g)).toHaveLength(2)
  })
})
