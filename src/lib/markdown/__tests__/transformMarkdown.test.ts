/**
 * Tests for markdown transformation
 */

import { describe, it, expect } from "@jest/globals"
import { transformMarkdown } from "@lib/markdown/transformMarkdown.js"
import { extractFrontmatter, titleCase, getPageLanguage } from "@lib/markdown/utils.js"

describe("transformMarkdown", () => {
  it("should transform basic markdown", async () => {
    const markdown = `# Hello World

This is a test.

\`\`\`javascript
console.log("test")
\`\`\`
`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("# Hello World")
    expect(result).toContain("This is a test")
    expect(result).toContain("```javascript")
  })

  it("should handle code blocks", async () => {
    const markdown = `\`\`\`solidity
contract Test {
  // comment
}
\`\`\`
`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("```solidity")
    expect(result).toContain("contract Test")
  })

  it("should preserve links", async () => {
    const markdown = `[Link text](/some/path)`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("[Link text](/some/path)")
  })

  it("should preserve DocCards as markdown links", async () => {
    const markdown = `<DocCards>
  <DocCard title="Programmable Token Transfers" href="/ccip/evm/tutorials/programmable-token-transfers">
    Send tokens across chains.
  </DocCard>
  <DocCard title="Send Arbitrary Data" href="/ccip/evm/tutorials/send-arbitrary-data">
    Send data between contracts.
  </DocCard>
</DocCards>`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")

    expect(result).toContain("[Programmable Token Transfers](/ccip/evm/tutorials/programmable-token-transfers)")
    expect(result).toContain("Send tokens across chains.")
    expect(result).toContain("[Send Arbitrary Data](/ccip/evm/tutorials/send-arbitrary-data)")
    expect(result).toContain("Send data between contracts.")
  })

  it("should handle tables", async () => {
    const markdown = `| Col1 | Col2 |
|------|------|
| A    | B    |`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("Col1")
    expect(result).toContain("Col2")
  })
})

describe("extractFrontmatter", () => {
  it("should extract title from frontmatter", () => {
    const raw = `---
title: "Test Page"
---

Content here`

    const result = extractFrontmatter(raw)
    expect(result.fmTitle).toBe("Test Page")
    expect(result.body).toContain("Content here")
  })

  it("should handle missing frontmatter", () => {
    const raw = `Content without frontmatter`

    const result = extractFrontmatter(raw)
    expect(result.fmTitle).toBeUndefined()
    expect(result.body).toBe(raw)
  })

  it("should extract sdkLang from frontmatter", () => {
    const raw = `---
title: "Test"
sdkLang: "go"
---

Content`

    const result = extractFrontmatter(raw)
    expect(result.sdkLang).toBe("go")
  })
})

describe("titleCase", () => {
  it("should convert to title case", () => {
    expect(titleCase("hello-world")).toBe("Hello World")
    expect(titleCase("test_file")).toBe("Test File")
    expect(titleCase("already Title")).toBe("Already Title")
  })
})

describe("getPageLanguage", () => {
  it("should detect language from filename", () => {
    expect(getPageLanguage("/path/to/file-go.mdx")).toBe("go")
    expect(getPageLanguage("/path/to/file-ts.mdx")).toBe("ts")
  })

  it("should return frontmatter language if present", () => {
    expect(getPageLanguage("/path/to/file.mdx", "typescript")).toBe("typescript")
  })

  it("should return null for common files", () => {
    expect(getPageLanguage("/path/to/file.mdx")).toBeNull()
  })
})
