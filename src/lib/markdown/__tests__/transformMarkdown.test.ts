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

  it("should handle tables", async () => {
    const markdown = `| Col1 | Col2 |
|------|------|
| A    | B    |`

    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("Col1")
    expect(result).toContain("Col2")
  })

  it.each([
    {
      name: "ClickToZoom",
      component: `<ClickToZoom alt="A" src="/a.jpg" />`,
      projection: "![A](/a.jpg)",
    },
    {
      name: "Address",
      component: `<Address address="0x1234" contractUrl="https://example.test/address" />`,
      projection: "[0x1234](https://example.test/address)",
    },
    {
      name: "Fragment",
      component: `<Fragment>
## Fragment heading

- first
- second
</Fragment>`,
      projection: `## Fragment heading

- first
- second`,
    },
    {
      name: "Accordion",
      component: `<Accordion title="Deploy" number={2}>
- first
- second
</Accordion>`,
      projection: `### 2. Deploy

- first
- second`,
    },
    {
      name: "Tabs",
      component: `<Tabs>
  <Fragment slot="tab.shell">Shell</Fragment>
  <Fragment slot="panel.shell">
\`\`\`sh
npm test
\`\`\`
  </Fragment>
</Tabs>`,
      projection: `### Shell

\`\`\`sh
npm test
\`\`\``,
    },
    {
      name: "PackageManagerTabs",
      component: `<PackageManagerTabs>
  <Fragment slot="yarn">
\`\`\`sh
yarn add
\`\`\`
  </Fragment>
  <Fragment slot="npm">
\`\`\`sh
npm install
\`\`\`
  </Fragment>
</PackageManagerTabs>`,
      projection: `### npm

\`\`\`sh
npm install
\`\`\`

### yarn

\`\`\`sh
yarn add
\`\`\``,
    },
  ])("keeps block siblings around a flow-position $name projection", async ({ component, projection }) => {
    const result = await transformMarkdown(
      `Intro paragraph.

## Heading

${component}

### Sub

Tail.`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Intro paragraph.

## Heading

${projection}

### Sub

Tail.
`)
  })

  it("retains indented Tabs panel content inside a callout", async () => {
    const result = await transformMarkdown(
      `<Aside type="note" title="Install">
    <Tabs>
      <Fragment slot="tab.npm">npm</Fragment>
      <Fragment slot="panel.npm">npm install example</Fragment>
    </Tabs>
</Aside>`,
      "/fake/page.mdx"
    )

    expect(result).toContain("> npm install example")
  })

  it("preserves inline links, code, strong text, and subscript children", async () => {
    const result = await transformMarkdown(
      `Please <a href="https://chain.link/contact">Contact us</a> to talk to an expert.

The field <code>marketStatus</code> matters.

<strong><sub>The bonded amount is credited.</sub></strong>`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Please [Contact us](https://chain.link/contact) to talk to an expert.

The field \`marketStatus\` matters.

**The bonded amount is credited.**
`)
  })

  it("preserves JSX links, code, and lists in table cells", async () => {
    const result = await transformMarkdown(
      `| Key | Value |
| --- | --- |
| <a href="#limit"><code>PerOwner.VaultSecretsLimit</code></a> | Max secrets per owner |
| <ul><li>first</li><li>second</li></ul> | list |`,
      "/fake/page.mdx"
    )

    expect(result).toContain("[`PerOwner.VaultSecretsLimit`](#limit)")
    expect(result).toContain("first; second")
    expect(result).not.toContain("<a")
    expect(result).not.toContain("<ul")
  })

  it("keeps HTML table cell text without collapsing surrounding blocks", async () => {
    const result = await transformMarkdown(
      `Intro paragraph.

## Heading

<div>
  <table>
    <thead>
      <tr>
        <th>Network</th>
        <th>Chain ID</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ethereum Mainnet</td>
        <td><code>1</code></td>
      </tr>
    </tbody>
  </table>
</div>

### Sub

Tail.`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Intro paragraph.

## Heading

Network
Chain ID

Ethereum Mainnet
\`1\`

### Sub

Tail.
`)
    expect(result).not.toContain("<table")
    expect(result).not.toContain("<td")
  })

  it("keeps a flow HTML link without collapsing surrounding blocks", async () => {
    const result = await transformMarkdown(
      `Intro paragraph.

## Heading

<div class="remix-callout">
  <a href="https://example.test">See the code</a>
</div>

### Sub

Tail.`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Intro paragraph.

## Heading

[See the code](https://example.test)

### Sub

Tail.
`)
  })

  it("keeps a flow MDX string expression without collapsing surrounding blocks", async () => {
    const result = await transformMarkdown(
      `Intro paragraph.

## Heading

{" "}

### Sub

Tail.`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Intro paragraph.

## Heading

### Sub

Tail.
`)
  })

  it("keeps static MDX whitespace and string expressions while dropping dynamic expressions", async () => {
    const result = await transformMarkdown(
      `Word{" "}next and {"literal"} end.

Before {runtimeValue} after.`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Word next and literal end.

Before  after.
`)
  })

  it("uses a depth-four Accordion heading", async () => {
    const result = await transformMarkdown(
      `<Accordion title="Deploy the contract" number={2} depth={4}>
Body instructions.
</Accordion>`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`#### 2. Deploy the contract

Body instructions.
`)
  })

  it("projects PageTabs header descriptions only when the header is shown", async () => {
    const withHeader = await transformMarkdown(
      `<PageTabs
  headerTitle="Install"
  headerDescription="Choose an installation path."
  pages={[{ name: "macOS", url: "/macos" }, { name: "Windows", url: "/windows" }]}
/>`,
      "/fake/page.mdx"
    )
    expect(withHeader).toBe(`## Install

Choose an installation path.

- [macOS](/macos)

- [Windows](/windows)
`)

    const withoutHeader = await transformMarkdown(
      `<PageTabs
  showHeader={false}
  headerDescription="Hidden description."
  pages={[{ name: "Only", url: "/only" }]}
/>`,
      "/fake/page.mdx"
    )
    expect(withoutHeader).toBe(`- [Only](/only)
`)
  })

  it("keeps native and ClickToZoom images as Markdown image syntax", async () => {
    const result = await transformMarkdown(
      `![Plain](/plain.png)

<ClickToZoom alt="Zoom" src="/zoom.png" />`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`![Plain](/plain.png)

![Zoom](/zoom.png)
`)
    expect(result).not.toContain("(Image: Plain)")
    expect(result).not.toContain("(Image: Zoom)")
  })

  it("projects PageTabs in source order with grouped labels and first URLs", async () => {
    const result = await transformMarkdown(
      `<PageTabs
  headerTitle="Select your operating system"
  pages={[
    [
      { name: "macOS", url: "/install/macos" },
      { name: "Linux", url: "/install/linux" },
    ],
    { name: "Windows", url: "/install/windows" },
  ]}
/>`,
      "/fake/page.mdx"
    )

    expect(result).toContain("## Select your operating system")
    expect(result).toContain("[macOS / Linux](/install/macos)")
    expect(result).not.toContain("/install/linux")
    expect(result.indexOf("[macOS / Linux]")).toBeLessThan(result.indexOf("[Windows]"))

    const withoutHeader = await transformMarkdown(
      `<PageTabs showHeader={false} pages={[{ name: "Only", url: "/only" }]} />`,
      "/fake/page.mdx"
    )
    expect(withoutHeader).not.toContain("## Guide Versions")
    expect(withoutHeader).toContain("[Only](/only)")
  })

  it("pairs Tabs and TabsContent labels with matching panels", async () => {
    for (const component of ["Tabs", "TabsContent"]) {
      const result = await transformMarkdown(
        `<${component}>
  <Fragment slot="tab.first">First</Fragment>
  <Fragment slot="tab.second">Second</Fragment>
  <Fragment slot="panel.second">Second panel</Fragment>
  <Fragment slot="panel.first">First panel</Fragment>
</${component}>`,
        "/fake/page.mdx"
      )

      expect(result.indexOf("### First")).toBeLessThan(result.indexOf("First panel"))
      expect(result.indexOf("First panel")).toBeLessThan(result.indexOf("### Second"))
      expect(result.indexOf("### Second")).toBeLessThan(result.indexOf("Second panel"))
    }
  })

  it("projects PackageManagerTabs as npm then yarn even when yarn is first", async () => {
    const result = await transformMarkdown(
      `<PackageManagerTabs>
  <Fragment slot="yarn">yarn add example</Fragment>
  <Fragment slot="npm">npm install example</Fragment>
</PackageManagerTabs>`,
      "/fake/page.mdx"
    )

    expect(result.indexOf("### npm")).toBeLessThan(result.indexOf("npm install example"))
    expect(result.indexOf("npm install example")).toBeLessThan(result.indexOf("### yarn"))
    expect(result.indexOf("### yarn")).toBeLessThan(result.indexOf("yarn add example"))
  })

  it("unwraps Fragment content", async () => {
    const result = await transformMarkdown(`<Fragment>Visible **content**</Fragment>`, "/fake/page.mdx")
    expect(result).toContain("Visible **content**")
    expect(result).not.toContain("Fragment")
  })

  it("projects Accordion number, title, and body", async () => {
    const result = await transformMarkdown(
      `<Accordion title="Deploy the contract" number={2}>
Body instructions.
</Accordion>`,
      "/fake/page.mdx"
    )
    expect(result).toContain("### 2. Deploy the contract")
    expect(result).toContain("Body instructions.")
  })

  it("uses an Accordion title slot instead of the title prop", async () => {
    const withTitleSlot = await transformMarkdown(
      `<Accordion title="Ignored prop title" number={3}>
  <Fragment slot="title">Review the deployment</Fragment>
Body remains visible.
</Accordion>`,
      "/fake/page.mdx"
    )
    expect(withTitleSlot).toContain("### 3. Review the deployment")
    expect(withTitleSlot).not.toContain("Ignored prop title")
    expect(withTitleSlot).toContain("Body remains visible.")
  })

  it("projects Address with exact URLs and static truncation", async () => {
    const result = await transformMarkdown(
      `Exact: <Address address="0x1234567890abcdef" contractUrl="https://example.test/address/0x1234567890abcdef?view=code" />
Truncated: <Address address="0x1234567890abcdef" endLength={4} contractUrl="https://example.test/exact" />`,
      "/fake/page.mdx"
    )
    expect(result).toContain("[0x1234567890abcdef](https://example.test/address/0x1234567890abcdef?view=code)")
    expect(result).toContain("[0x1234...cdef](https://example.test/exact)")
  })

  it("projects a block ClickToZoom as an exact Markdown image", async () => {
    const result = await transformMarkdown(
      `<ClickToZoom alt="Architecture diagram" src="/images/architecture.png" />`,
      "/fake/page.mdx"
    )

    expect(result).toBe("![Architecture diagram](/images/architecture.png)\n")
  })

  it("projects an inline ClickToZoom with default alt text", async () => {
    const result = await transformMarkdown(`Before <ClickToZoom src="/images/detail.png" /> after.`, "/fake/page.mdx")

    expect(result).toBe("Before ![Image](/images/detail.png) after.\n")
  })

  it("projects ClickToZoom through the AST with a long repeated attribute value", async () => {
    const repeated = " =".repeat(50_000)
    const result = await transformMarkdown(
      `<ClickToZoom data-value="${repeated}" src="/images/detail.png" alt="Detail" />`,
      "/fake/page.mdx"
    )

    expect(result).toBe("![Detail](/images/detail.png)\n")
  })

  it("projects Aside as a Markdown blockquote", async () => {
    const result = await transformMarkdown(
      `<Aside type="warning" title="Important">
Read the warning.
</Aside>`,
      "/fake/page.mdx"
    )
    expect(result).toContain("> **WARNING: Important**")
    expect(result).toContain("> Read the warning.")
  })

  it("projects an Aside with a long repeated attribute value", async () => {
    const repeated = "a".repeat(100_000)
    const result = await transformMarkdown(
      `<Aside type="note" title="${repeated}">
Body.
</Aside>`,
      "/fake/page.mdx"
    )
    expect(result).toContain(`> **NOTE: ${repeated}**`)
    expect(result).toContain("> Body.")
  })

  it("projects Callout like Aside", async () => {
    const result = await transformMarkdown(
      `<Callout type="caution" title="Check this">
Read the warning.
</Callout>`,
      "/fake/page.mdx"
    )
    expect(result).toContain("> **CAUTION: Check this**")
    expect(result).toContain("> Read the warning.")
  })

  it("projects SchemaFieldsTable from report schema definitions", async () => {
    const result = await transformMarkdown(`<SchemaFieldsTable schema="v2" />`, "/fake/page.mdx")
    expect(result).toContain("| Field")
    expect(result).toContain("`feedId`")
    expect(result).toContain("`price`")
    expect(result).toContain("Time-weighted average price")
  })

  it("projects FeedPage as an official API placeholder without merging flow siblings", async () => {
    const result = await transformMarkdown(
      `Intro paragraph.

## Heading

<FeedPage />

### Sub

Tail.`,
      "/fake/page.mdx"
    )

    expect(result).toBe(`Intro paragraph.

## Heading

Live values such as feed contract addresses are not inlined here. Wait for the official API to obtain current data.

### Sub

Tail.
`)
    expect(result).not.toContain("<FeedPage")
    expect(result).not.toContain("reference-data-directory")
    expect(result).not.toContain("rddUrl")
  })

  it("projects FeedPage with static props as the same official API placeholder", async () => {
    const result = await transformMarkdown(`<FeedPage dataFeedType="rates" />`, "/fake/page.mdx")

    expect(result).toContain(
      "Live values such as feed contract addresses are not inlined here. Wait for the official API to obtain current data."
    )
    expect(result).not.toContain("https://")
  })

  it("projects every static CodeHighlightBlockMulti language when no target is set", async () => {
    const result = await transformMarkdown(
      `<CodeHighlightBlockMulti
  languages={{
    ts: { code: "const answer = 42" },
    go: { code: "package main" },
  }}
/>`,
      "/fake/page.mdx"
    )
    expect(result).toContain("```ts")
    expect(result).toContain("const answer = 42")
    expect(result).toContain("```go")
    expect(result).toContain("package main")
    expect(result.indexOf("```ts")).toBeLessThan(result.indexOf("```go"))

    const selected = await transformMarkdown(
      `<CodeHighlightBlockMulti languages={{ ts: { code: "ts only" }, go: { code: "go only" } }} />`,
      "/fake/page.mdx",
      { targetLanguage: "go" }
    )
    expect(selected).not.toContain("```ts")
    expect(selected).not.toContain("ts only")
    expect(selected).toContain("```go")
    expect(selected).toContain("go only")
  })

  it("removes residual MDX, HTML, ESM, and nonliteral projections", async () => {
    const result = await transformMarkdown(
      `import Unknown from "./Unknown"

Before <Unknown>hidden JSX</Unknown> after.
<span>hidden HTML</span>
{dynamicValue}
<PageTabs pages={dynamicPages} />`,
      "/fake/page.mdx"
    )
    expect(result).toContain("Before")
    expect(result).toContain("after.")
    expect(result).not.toMatch(/<[/A-Za-z]/)
    expect(result).not.toContain("import Unknown")
    expect(result).not.toContain("{dynamicValue}")
    expect(result).not.toContain("dynamicPages")
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
