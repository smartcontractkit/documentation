import path from "node:path"
import { describe, expect, test } from "@jest/globals"
import { transformPageBodyToMarkdown } from "@lib/markdown/buildMarkdownArtifact.js"
import { unescapeMarkdown } from "@lib/markdown/formatters.js"
import { extractFrontmatter } from "@lib/markdown/utils.js"
import { assembleLlmsDocument, renderLlmsPageMarkdown } from "./generate-llms.js"

describe("renderLlmsPageMarkdown", () => {
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
