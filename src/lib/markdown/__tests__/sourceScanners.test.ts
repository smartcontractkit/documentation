import { describe, expect, it } from "@jest/globals"
import {
  readStaticDefaultImports,
  readStaticJsxSelectorConditions,
  removeLeadingMdxFrontmatter,
  stripHighlighterComments,
} from "@lib/markdown/sourceScanners.js"

describe("readStaticDefaultImports", () => {
  it("reads single-line and multiline static default imports", () => {
    const imports = readStaticDefaultImports(`---
import Alpha from "./alpha.mdx"
import $Code
  from
  './code.ts?raw'
import { ignored } from "./named.js"
import "./side-effect.js"
---`)

    expect(Object.fromEntries(imports)).toEqual({
      Alpha: "./alpha.mdx",
      $Code: "./code.ts?raw",
    })
  })

  it("scans repeated unterminated import prefixes deterministically", () => {
    const source = `${'import Broken from "unterminated\n'.repeat(10_000)}import Kept from "./kept.mdx"`

    expect(Object.fromEntries(readStaticDefaultImports(source))).toEqual({ Kept: "./kept.mdx" })
    expect(Object.fromEntries(readStaticDefaultImports(source))).toEqual({ Kept: "./kept.mdx" })
  })
})

describe("readStaticJsxSelectorConditions", () => {
  it("maps static selector values to JSX components", () => {
    const conditions = readStaticJsxSelectorConditions(
      `{callout === "alpha" && <Alpha />}
{callout
  ===
  'beta'
  &&
  <Beta />}`,
      "callout"
    )

    expect(Object.fromEntries(conditions)).toEqual({ alpha: "Alpha", beta: "Beta" })
  })

  it("scans repeated unterminated selector prefixes deterministically", () => {
    const source = `${'{callout === "unterminated\n'.repeat(10_000)}{callout === "kept" && <Kept />}`

    expect(Object.fromEntries(readStaticJsxSelectorConditions(source, "callout"))).toEqual({ kept: "Kept" })
    expect(Object.fromEntries(readStaticJsxSelectorConditions(source, "callout"))).toEqual({ kept: "Kept" })
  })
})

describe("removeLeadingMdxFrontmatter", () => {
  it.each([
    ["LF", "---\ntitle: Example\n---\n\n# Body\n", "\n# Body\n"],
    ["CRLF", "---\r\ntitle: Example\r\n---\r\n# Body\r\n", "# Body\r\n"],
    ["trailing fence whitespace", "---  \ntitle: Example\n--- \n# Body", "# Body"],
  ])("removes leading %s frontmatter without changing body newlines", (_name, source, expected) => {
    expect(removeLeadingMdxFrontmatter(source)).toBe(expected)
  })

  it("preserves missing and unterminated frontmatter", () => {
    expect(removeLeadingMdxFrontmatter("# Body\n---\n")).toBe("# Body\n---\n")
    expect(removeLeadingMdxFrontmatter("---\ntitle: Example")).toBe("---\ntitle: Example")
  })
})

describe("stripHighlighterComments", () => {
  it("removes supported markers while preserving other text and whitespace-only lines", () => {
    const code = `const value = 1 // highlight-line
   
\t// highlight-start
next // regular comment
end   //   highlight-end  `

    expect(stripHighlighterComments(code)).toBe(`const value = 1
   

next // regular comment
end  `)
  })
})
