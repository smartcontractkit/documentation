/**
 * Tests for markdown transformation
 */

import { describe, it, expect } from "@jest/globals"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { transformMarkdown, transformPageToMarkdown } from "@lib/markdown/transformMarkdown.js"
import { unescapeMarkdown } from "@lib/markdown/formatters.js"
import { extractFrontmatter, titleCase, getPageLanguage } from "@lib/markdown/utils.js"

async function transformFixturePage(relativePath: string): Promise<{ source: string; result: string }> {
  const pagePath = path.resolve(relativePath)
  const raw = await readFile(pagePath, "utf-8")
  const { body } = extractFrontmatter(raw)

  return {
    source: body,
    result: await transformPageToMarkdown(body, pagePath),
  }
}

function expectEveryTabLabelToBePreserved(source: string, result: string): void {
  const normalizedResult = unescapeMarkdown(result)
  const labels = [...source.matchAll(/<Fragment slot="tab\.[^"]+">([\s\S]*?)<\/Fragment>/g)].map((match) =>
    match[1].replace(/<[^>]+>/g, "").trim()
  )
  const requiredOccurrences = new Map<string, number>()

  expect(labels.length).toBeGreaterThan(0)

  for (const label of labels) {
    requiredOccurrences.set(label, (requiredOccurrences.get(label) || 0) + 1)
  }

  for (const [label, required] of requiredOccurrences) {
    const token = `**${label}**`
    const actual = normalizedResult.split(token).length - 1
    if (actual < required) {
      throw new Error(`Expected tab label "${label}" ${required} time(s), but found ${actual}`)
    }
  }
}

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

  it("should handle tables", async () => {
    const markdown = `| Col1 | Col2 |
|------|------|
| A    | B    |`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("Col1")
    expect(result).toContain("Col2")
  })

  it("should serialize every Tabs panel with its label", async () => {
    const markdown = `<Tabs client:visible>
<Fragment slot="tab.1">Starter kit</Fragment>
<Fragment slot="tab.2">Manual</Fragment>
<Fragment slot="panel.1">

Starter-kit instructions

</Fragment>
<Fragment slot="panel.2">

Manual instructions

</Fragment>
</Tabs>`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")

    expect(result).toContain("**Starter kit**")
    expect(result).toContain("Starter-kit instructions")
    expect(result).toContain("**Manual**")
    expect(result).toContain("Manual instructions")
  })

  it("should serialize TabsContent and process components nested in its panels", async () => {
    const markdown = `<TabsContent client:visible>
<Fragment slot="tab.1">web3.js</Fragment>
<Fragment slot="panel.1">
<CodeSample src="samples/DataFeeds/PriceConsumerV3.js" />
</Fragment>
</TabsContent>`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")

    expect(result).toContain("**web3.js**")
    expect(result).toContain('const Web3 = require("web3")')
  })

  it("should preserve a panel whose label is missing", async () => {
    const markdown = `<Tabs>
<Fragment slot="panel.manual">

Manual instructions

</Fragment>
</Tabs>`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")

    expect(result).toContain("**Option manual**")
    expect(result).toContain("Manual instructions")
  })
})

describe("page-level markdown integration", () => {
  it("preserves both deployment tabs from the Canton LockRelease guide", async () => {
    const { source, result } = await transformFixturePage(
      "src/content/ccip/tutorials/canton/cross-chain-tokens/lock-release-token-pool.mdx"
    )

    expectEveryTabLabelToBePreserved(source, result)
    expect(result).toContain("## Step 1 — Deploy the LockRelease Token Pool")
    expect(result).toContain("**Starter kit**")
    expect(result).toContain("npm run cct:deploy-lock-release --")
    expect(result).toContain("**Manual**")
    expect(result).toMatch(/\| `instanceId`\s+\| Unique string, e\.g\. `acme-eur-lr-pool`\s+\|/)
    expect(result).toMatch(/\| `deps`\s+\| `tokenAdminRegistry`, `rmnRemote`, `feeQuoter`\s+\|/)
    expect(result).toContain("After creation, pool address: `{instanceId}@{poolOwner}`.")
  })

  it("preserves every tab from the production multisig tutorial", async () => {
    const { source, result } = await transformFixturePage(
      "src/content/ccip/tutorials/svm/cross-chain-tokens/production-multisig-tutorial.mdx"
    )

    expectEveryTabLabelToBePreserved(source, result)
    expect(result).toContain("npx env-enc view")
    expect(result).toContain("PRIVATE_KEY = <redacted>")
    expect(result).toContain("ccip-cli send \\")
    expect(result).toContain("RLMaxCapacityExceeded")
    expect(result).toContain("TokenMaxCapacityExceeded")
  })

  it("preserves both JavaScript examples from the Data Feeds guide", async () => {
    const { source, result } = await transformFixturePage("src/content/data-feeds/using-data-feeds.mdx")

    expectEveryTabLabelToBePreserved(source, result)
    expect(result).toContain('const Web3 = require("web3")')
    expect(result).toContain(
      'const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia")'
    )
    expect(result.match(/DO NOT USE THIS CODE IN PRODUCTION/g)?.length).toBeGreaterThanOrEqual(2)
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
