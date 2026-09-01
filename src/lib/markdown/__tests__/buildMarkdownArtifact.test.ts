import { describe, expect, it } from "@jest/globals"
import {
  buildMarkdownArtifact,
  normalizeMarkdownPath,
  transformPageBodyToMarkdown,
} from "@lib/markdown/buildMarkdownArtifact.js"

describe("buildMarkdownArtifact", () => {
  it.each([
    ["cre/getting-started/cli-installation", "normal"],
    ["cre-templates", "special"],
    ["cre/reference/sdk/evm-client", "selector"],
    ["data-streams/getting-started", "redirect"],
  ])("classifies %s as %s", async (requestPath, routeKind) => {
    const artifact = await buildMarkdownArtifact(requestPath)

    expect(artifact).not.toBeNull()
    expect(artifact?.requestPath).toBe(normalizeMarkdownPath(requestPath))
    expect(artifact?.routeKind).toBe(routeKind)
  })

  it("rejects path escapes", async () => {
    expect(normalizeMarkdownPath("../outside")).toBeNull()
    await expect(buildMarkdownArtifact("../outside")).resolves.toBeNull()
  })

  it("trims long leading and trailing slash runs", () => {
    const slashes = "/".repeat(100_000)

    expect(normalizeMarkdownPath(`${slashes}cre/getting-started${slashes}`)).toBe("cre/getting-started")
  })

  it("accepts an existing extensionless production request path", async () => {
    await expect(buildMarkdownArtifact("cre/getting-started/cli-installation")).resolves.toMatchObject({
      requestPath: "cre/getting-started/cli-installation",
      routeKind: "normal",
    })
  })

  it.each([".md", ".md.md", ".mdx"])("rejects a leftover %s extension", async (extension) => {
    await expect(buildMarkdownArtifact(`cre/getting-started/cli-installation${extension}`)).resolves.toBeNull()
  })

  it.each([
    "cre/getting-started/cli-installation",
    "cre/getting-started/cli-installation/macos-linux",
    "cre/getting-started/cli-installation/windows",
  ])("projects the ordered operating system selector for %s", async (requestPath) => {
    const artifact = await buildMarkdownArtifact(requestPath)
    const markdown = artifact?.markdown ?? ""
    const macosLinux = "[macOS / Linux](/cre/getting-started/cli-installation/macos-linux)"
    const windows = "[Windows](/cre/getting-started/cli-installation/windows)"

    expect(markdown).toContain("## Select your operating system")
    expect(markdown).toContain(macosLinux)
    expect(markdown).toContain(windows)
    expect(markdown.indexOf(macosLinux)).toBeLessThan(markdown.indexOf(windows))
  })

  it.each([
    {
      lang: "typescript",
      hasTypeScript: true,
      hasGo: false,
      hasTitles: false,
    },
    {
      lang: "GO",
      hasTypeScript: false,
      hasGo: true,
      hasTitles: false,
    },
    {
      lang: "python",
      hasTypeScript: true,
      hasGo: true,
      hasTitles: true,
    },
    {
      lang: undefined,
      hasTypeScript: true,
      hasGo: true,
      hasTitles: true,
    },
  ])(
    "applies public lang=$lang selection without losing unknown or absent language branches",
    async ({ lang, hasTypeScript, hasGo, hasTitles }) => {
      const artifact = await buildMarkdownArtifact("cre/guides/workflow/secrets", lang === undefined ? {} : { lang })
      const markdown = artifact?.markdown ?? ""

      expect(markdown.includes('const secret = runtime.getSecret({ id: "API_KEY" }).result()')).toBe(hasTypeScript)
      expect(markdown.includes('secret, err := runtime.GetSecret(&pb.SecretRequest{Id: "API_KEY"}).Await()')).toBe(
        hasGo
      )
      expect(markdown.includes("### Retrieving Secrets (TypeScript)")).toBe(hasTitles)
      expect(markdown.includes("### Retrieving Secrets (Go)")).toBe(hasTitles)
    }
  )
})

describe("transformPageBodyToMarkdown", () => {
  it("retains titled branches when a recognized target has no matching component key", async () => {
    const result = await transformPageBodyToMarkdown(
      `<CodeHighlightBlockMulti
  languages={{
    go: { code: "package main", title: "Go only" },
  }}
/>`,
      "/virtual/language-fallback.mdx",
      { targetLanguage: "typescript" }
    )

    expect(result.transformMode).toBe("normal")
    expect(result.markdown).toBe(`### Go only

\`\`\`go
package main
\`\`\`
`)
  })

  it("reports the normal transform branch", async () => {
    const result = await transformPageBodyToMarkdown("# Kept", "/virtual/normal.mdx")

    expect(result.transformMode).toBe("normal")
    expect(result.markdown).toContain("# Kept")
  })

  it("reports the sanitized retry branch", async () => {
    const body = `export async function load() {
  return @
}

# Kept`
    const result = await transformPageBodyToMarkdown(body, "/virtual/sanitized.mdx")

    expect(result.transformMode).toBe("sanitized")
    expect(result.markdown).toContain("# Kept")
    expect(result.markdown).not.toContain("return @")
  })

  it("reports the fallback branch", async () => {
    const body = `# Kept

{`
    const result = await transformPageBodyToMarkdown(body, "/virtual/fallback.mdx")

    expect(result).toEqual({
      transformMode: "fallback",
      markdown: body,
    })
  })

  it("strips component tags in the fallback branch", async () => {
    const result = await transformPageBodyToMarkdown(
      `<Wrapper data-label="a = b"><Callout />Visible</Wrapper>
{`,
      "/virtual/fallback-components.mdx"
    )

    expect(result).toEqual({
      transformMode: "fallback",
      markdown: `Visible
{`,
    })
  })

  it("preserves a long unterminated repeated component prefix in the fallback branch", async () => {
    const body = `${"<A".repeat(10_000)}
{`
    const result = await transformPageBodyToMarkdown(body, "/virtual/fallback-malformed-components.mdx")

    expect(result).toEqual({
      transformMode: "fallback",
      markdown: body,
    })
  })

  it("reports the deprecating feeds replacement branch", async () => {
    const result = await transformPageBodyToMarkdown("ignored", "/virtual/data-feeds/deprecating-feeds.mdx")

    expect(result.transformMode).toBe("replacement")
    expect(result.markdown).toContain("## Deprecated Feeds")
  })
})
