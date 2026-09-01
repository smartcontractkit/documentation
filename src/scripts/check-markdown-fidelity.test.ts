import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { describe, expect, test } from "@jest/globals"
import { buildMarkdownArtifact } from "@lib/markdown/buildMarkdownArtifact.js"
import type { MarkdownArtifact } from "@lib/markdown/types.js"
import {
  analyzeSourceMarkdown,
  compareSourceToArtifact,
  checkPath,
  createReport,
  determineExitCode,
  findingIdentity,
  parseCliArguments,
  readStaticExpression,
  inspectSyntheticArtifact,
  runMarkdownFidelity,
  serializeReport,
  type FidelityException,
  type FidelityFinding,
} from "./check-markdown-fidelity.js"

function artifact(markdown: string): MarkdownArtifact {
  return {
    requestPath: "fixture",
    routeKind: "normal",
    transformMode: "normal",
    sourcePath: path.resolve("src/content/fixture.mdx"),
    markdown,
  }
}

function syntheticArtifact(routeKind: "redirect" | "selector", markdown: string): MarkdownArtifact {
  return {
    requestPath: "fixture",
    routeKind,
    transformMode: "normal",
    markdown,
  }
}

function finding(status: FidelityFinding["status"], occurrence: string, sourceLine = 1): FidelityFinding {
  return { path: "fixture", status, occurrence, sourceLine }
}

describe("Markdown fidelity execution modes", () => {
  test("full-corpus accepts a current identity from the baseline", () => {
    const known = finding("missing", "lang=default;fact=1;text=known")
    expect(known.status).toBe("missing")
    expect(determineExitCode("full-corpus", [known], new Set([findingIdentity(known)]))).toBe(0)
  })

  test.each(["missing", "unsupported", "unverifiable", "degraded"] as const)(
    "full-corpus blocks a new %s identity",
    (status) => {
      const current = finding(status, `lang=default;new=${status}`)
      expect(current.status).toBe(status)
      expect(determineExitCode("full-corpus", [current], new Set())).toBe(1)
    }
  )

  test("full-corpus ignores resolved baseline identities and present findings", () => {
    const resolved = finding("missing", "lang=default;fact=1;text=resolved")
    const present = finding("present", "lang=default;fact=1;text=current")
    const baseline = new Set([findingIdentity(resolved)])
    expect(resolved.status).toBe("missing")
    expect(present.status).toBe("present")
    expect(determineExitCode("full-corpus", [], baseline)).toBe(0)
    expect(determineExitCode("full-corpus", [present], baseline)).toBe(0)
  })

  test("focused mode blocks a baseline-listed identity", () => {
    const known = finding("unsupported", "lang=default;diagnostic=known")
    expect(known.status).toBe("unsupported")
    expect(determineExitCode("focused", [known], new Set([findingIdentity(known)]))).toBe(1)
  })

  test("--path is repeatable and blocks on every non-exempt failure", () => {
    expect(parseCliArguments(["--path", "cre/example", "--path", "ccip/example"])).toEqual({
      mode: "focused",
      paths: ["ccip/example", "cre/example"],
    })
    expect(determineExitCode("focused", [finding("degraded", "lang=default;transform=fallback")])).toBe(1)
    expect(determineExitCode("focused", [finding("unsupported", "lang=default;diagnostic=1;Widget")])).toBe(1)
  })

  test.each([
    ["src/content/cre/getting-started/cli-installation/index.mdx", "cre/getting-started/cli-installation"],
    [
      "src/content/cre/getting-started/cli-installation/macos-linux.mdx",
      "cre/getting-started/cli-installation/macos-linux",
    ],
    ["src/content/cre/getting-started/cli-installation/windows.mdx", "cre/getting-started/cli-installation/windows"],
  ])("maps source path %s to production request path", (sourcePath, requestPath) => {
    expect(parseCliArguments(["--path", sourcePath])).toEqual({ mode: "focused", paths: [requestPath] })
  })

  test.each([
    "/Users/example/src/content/cre/page.mdx",
    "../src/content/cre/page.mdx",
    "src/content/../secrets.mdx",
    "src/other/page.mdx",
    "other/page.mdx",
    "src/content/cre/page.txt",
    "src/content/cre/page",
    "cre/example.md",
    "cre/example.md.md",
    "cre/example.mdx",
    "src/content/cre/page.md.md",
    "src/content/cre/page.mdx.md",
  ])("rejects unsafe or unsupported source path %s", (sourcePath) => {
    expect(() => parseCliArguments(["--path", sourcePath])).toThrow(`Invalid Markdown path: ${sourcePath}`)
  })

  test.each([
    ["src/content/cre/getting-started/cli-installation/index.mdx", "cre/getting-started/cli-installation"],
    [
      "src/content/cre/getting-started/cli-installation/macos-linux.mdx",
      "cre/getting-started/cli-installation/macos-linux",
    ],
    ["src/content/cre/getting-started/cli-installation/windows.mdx", "cre/getting-started/cli-installation/windows"],
  ])("checks source path %s through its production artifact", async (sourcePath, requestPath) => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "markdown-fidelity-"))
    const reportPath = path.join(directory, "report.json")
    try {
      const { report } = await runMarkdownFidelity(["--path", sourcePath], { reportPath })

      expect(report.pathCount).toBe(1)
      expect(report.findings.length).toBeGreaterThan(0)
      expect(report.findings.every((candidate) => candidate.path === requestPath)).toBe(true)
      expect(report.findings.some((candidate) => candidate.occurrence === "lang=default;artifact")).toBe(false)
      expect(JSON.parse(await fs.readFile(reportPath, "utf8"))).toMatchObject({ pathCount: 1 })
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })

  test("an exact exception passes and does not cover another occurrence", () => {
    const source = "<UnknownWidget />\n<UnknownWidget />"
    const initial = compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(""))
    const first = initial[0]
    const exception: FidelityException = {
      path: first.path,
      occurrence: first.occurrence,
      status: "unsupported",
      reason: "Known projection gap",
      owner: "docs-platform",
      removalCondition: "Remove when UnknownWidget has a static projection",
    }
    const checked = compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(""), "default", [
      exception,
    ])

    expect(checked[0].exception).toEqual({
      reason: exception.reason,
      owner: exception.owner,
      removalCondition: exception.removalCondition,
    })
    expect(checked[1].exception).toBeUndefined()
    expect(determineExitCode("focused", [checked[0]])).toBe(0)
    expect(determineExitCode("focused", checked)).toBe(1)
  })
})

describe("raw source analysis", () => {
  test("unsupported findings preserve component name, repository path, and original line", () => {
    const source = [
      "---",
      "title: Fixture",
      "---",
      "",
      "Visible text",
      "",
      '<UnknownWidget value="x">lost</UnknownWidget>',
    ].join("\n")
    const [unsupported] = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source,
      artifact("Visible text")
    ).filter((candidate) => candidate.status === "unsupported")

    expect(unsupported).toMatchObject({
      name: "UnknownWidget",
      sourcePath: "src/content/fixture.mdx",
      sourceLine: 7,
      sourceText: '<UnknownWidget value="x">lost</UnknownWidget>',
    })
  })

  test("CRE_CLI_VERSION remains unverifiable", () => {
    const source = 'export const CRE_CLI_VERSION = VERSIONS["cre-cli"].LATEST\n\nCurrent version: {CRE_CLI_VERSION}'
    const diagnostics = analyzeSourceMarkdown(source).diagnostics

    expect(diagnostics).toEqual(
      expect.arrayContaining([expect.objectContaining({ status: "unverifiable", name: "CRE_CLI_VERSION", line: 3 })])
    )
  })

  test("allowlists literals, arrays, and objects without executing dynamic syntax", () => {
    expect(
      readStaticExpression({
        type: "ArrayExpression",
        elements: [
          { type: "Literal", value: "go" },
          {
            type: "ObjectExpression",
            properties: [
              {
                type: "Property",
                computed: false,
                kind: "init",
                key: { type: "Identifier", name: "name" },
                value: { type: "Literal", value: "TypeScript" },
              },
            ],
          },
        ],
      })
    ).toEqual({ ok: true, value: ["go", { name: "TypeScript" }] })
    expect(
      readStaticExpression({ type: "CallExpression", callee: { type: "Identifier", name: "sideEffect" } })
    ).toEqual({
      ok: false,
      syntax: "CallExpression",
    })
    expect(readStaticExpression({ type: "MemberExpression" })).toEqual({ ok: false, syntax: "MemberExpression" })
    expect(readStaticExpression({ type: "NewExpression" })).toEqual({ ok: false, syntax: "NewExpression" })
  })

  test("enumerates every static language key without evaluating imported code identifiers", () => {
    const source = [
      "<CodeHighlightBlockMulti languages={{ go: { code: goSource }, ts: { code: tsSource } }} />",
      "<CodeHighlightBlockMulti languages={{ [computed()]: { code: otherSource } }} />",
    ].join("\n")
    const analysis = analyzeSourceMarkdown(source)

    expect(analysis.languages).toEqual(["go", "ts"])
    expect(analysis.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "CodeHighlightBlockMulti.languages", status: "unverifiable" }),
        expect.objectContaining({ name: "CodeHighlightBlockMulti.languages.go", status: "unverifiable" }),
        expect.objectContaining({ name: "CodeHighlightBlockMulti.languages.ts", status: "unverifiable" }),
      ])
    )
  })

  test("code fences containing JSX-like text are ordinary code facts", () => {
    const analysis = analyzeSourceMarkdown("```tsx\n<UnknownWidget>{dangerous()}</UnknownWidget>\n```")

    expect(analysis.diagnostics).toEqual([])
    expect(analysis.facts).toEqual([
      expect.objectContaining({ kind: "code", value: "<UnknownWidget>{dangerous()}</UnknownWidget>" }),
    ])
  })
})

describe("PageTabs occurrence grouping", () => {
  test.each(["index.mdx", "macos-linux.mdx", "windows.mdx"])(
    "three CLI pages PageTabs are present with grouped macOS / Linux then Windows: %s",
    async (fileName) => {
      const sourcePath = path.join("src/content/cre/getting-started/cli-installation", fileName)
      const source = await fs.readFile(sourcePath, "utf8")
      const served = [
        "## Select your operating system",
        "",
        "- [macOS / Linux](/cre/getting-started/cli-installation/macos-linux)",
        "- [Windows](/cre/getting-started/cli-installation/windows)",
      ].join("\n")
      const findings = compareSourceToArtifact(sourcePath, sourcePath, source, artifact(served))
      const pageTabs = findings.filter(
        (candidate) =>
          candidate.expected === "Select your operating system" ||
          candidate.expected === "macOS / Linux -> /cre/getting-started/cli-installation/macos-linux" ||
          candidate.expected === "Windows -> /cre/getting-started/cli-installation/windows"
      )

      expect(pageTabs.map((candidate) => [candidate.status, candidate.expected])).toEqual([
        ["present", "Select your operating system"],
        ["present", "macOS / Linux -> /cre/getting-started/cli-installation/macos-linux"],
        ["present", "Windows -> /cre/getting-started/cli-installation/windows"],
      ])
    }
  )

  test("ordered matching rejects a removed duplicate and swapped links", () => {
    const duplicateSource = "same\n\nsame"
    const duplicateFindings = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      duplicateSource,
      artifact("same")
    )
    expect(duplicateFindings.map((candidate) => candidate.status)).toEqual(["present", "missing"])

    const tabs = `<PageTabs showHeader={false} pages={[{ name: "First", url: "/first" }, { name: "Second", url: "/second" }]} />`
    const swapped = "[Second](/second)\n\n[First](/first)"
    const swappedFindings = compareSourceToArtifact("fixture", "src/content/fixture.mdx", tabs, artifact(swapped))
    expect(swappedFindings.map((candidate) => candidate.status)).toEqual(["present", "missing"])
  })
})

describe("source-less artifact fidelity", () => {
  test("redirects require the exact current link and inspect their target page", async () => {
    const requestPath = "data-streams/reference/streams-direct/streams-direct-interface-ws"
    const targetPath = "data-streams/reference/interface-ws"
    const correct = inspectSyntheticArtifact(
      requestPath,
      syntheticArtifact("redirect", `[${targetPath}](/${targetPath}.md)`)
    )
    const wrong = inspectSyntheticArtifact(requestPath, syntheticArtifact("redirect", `[${targetPath}](/wrong.md)`))
    const empty = inspectSyntheticArtifact(requestPath, syntheticArtifact("redirect", ""))

    expect(correct.targetPaths).toEqual([targetPath])
    expect(correct.findings).toEqual([
      expect.objectContaining({
        status: "present",
        occurrence: `lang=default;synthetic=redirect;${targetPath} -> /${targetPath}.md`,
        sourceLine: null,
      }),
    ])
    expect(wrong.findings[0]).toMatchObject({ status: "missing", sourceLine: null })
    expect(empty.findings[0]).toMatchObject({ status: "missing", sourceLine: null })

    const evaluated = await checkPath(requestPath)
    expect(evaluated.some((candidate) => candidate.path === targetPath)).toBe(true)
  })

  test("CRE selectors require both exact entries and inspect both target pages", async () => {
    const requestPath = "cre/reference/sdk/evm-client"
    const goPath = `${requestPath}-go`
    const tsPath = `${requestPath}-ts`
    const correct = inspectSyntheticArtifact(
      requestPath,
      syntheticArtifact("selector", `- Go: /${goPath}.md\n- TypeScript: /${tsPath}.md`)
    )
    const wrong = inspectSyntheticArtifact(
      requestPath,
      syntheticArtifact("selector", `- Go: /wrong.md\n- TypeScript: /${tsPath}.md`)
    )
    const empty = inspectSyntheticArtifact(requestPath, syntheticArtifact("selector", ""))

    expect(correct.targetPaths).toEqual([goPath, tsPath])
    expect(correct.findings.map((candidate) => candidate.status)).toEqual(["present", "present"])
    expect(wrong.findings.map((candidate) => candidate.status)).toEqual(["missing", "present"])
    expect(empty.findings.map((candidate) => candidate.status)).toEqual(["missing", "missing"])

    const evaluated = await checkPath(requestPath)
    const evaluatedPaths = new Set(evaluated.map((candidate) => candidate.path))
    expect(evaluatedPaths.has(goPath)).toBe(true)
    expect(evaluatedPaths.has(tsPath)).toBe(true)
  })
})

describe("content-bearing component fidelity", () => {
  test("static CodeHighlightBlock and CodeSample content cannot disappear", () => {
    const codeHighlight = '<CodeHighlightBlock title="fixture.ts" code={"const answer = 42"} />'
    const codeHighlightCorrect = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      codeHighlight,
      artifact("Code snippet for fixture.ts:\n\n```ts\nconst answer = 42\n```")
    )
    const codeHighlightDropped = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      codeHighlight,
      artifact("")
    )
    const codeSample = '<CodeSample src="samples/APIRequests/APIConsumer.sol" showButtonOnly />'
    const codeSampleLink =
      "[Open APIConsumer.sol in Remix](https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/APIConsumer.sol)"

    expect(codeHighlightCorrect.map((candidate) => candidate.status)).toEqual(["present", "present"])
    expect(codeHighlightDropped.map((candidate) => candidate.status)).toEqual(["missing", "missing"])
    expect(
      compareSourceToArtifact("fixture", "src/content/fixture.mdx", codeSample, artifact(codeSampleLink)).map(
        (candidate) => candidate.status
      )
    ).toEqual(["present"])
    expect(compareSourceToArtifact("fixture", "src/content/fixture.mdx", codeSample, artifact(""))[0]).toMatchObject({
      status: "missing",
      sourcePath: "src/content/fixture.mdx",
      sourceLine: 1,
    })
  })
  test("static SchemaFieldsTable facts are checked and the current projection passes", async () => {
    const source = '<SchemaFieldsTable schema="v2" />'
    const analysis = analyzeSourceMarkdown(source, "src/content/fixture.mdx")

    expect(analysis.diagnostics).toEqual([])
    expect(analysis.facts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "text", value: "Field" }),
        expect.objectContaining({ kind: "text", value: "feedId" }),
        expect.objectContaining({ kind: "text", value: "price" }),
      ])
    )
    expect(
      compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact("")).some(
        (candidate) => candidate.status === "missing"
      )
    ).toBe(true)

    const current = (await checkPath("data-streams/reference/report-schema-v2")).filter(
      (candidate) =>
        candidate.sourcePath === "src/content/data-streams/reference/report-schema-v2.mdx" &&
        candidate.sourceLine === 27
    )
    expect(current.length).toBeGreaterThan(3)
    expect(current.every((candidate) => candidate.status === "present")).toBe(true)
  })

  test.each([
    ["CodeHighlightBlock", "<CodeHighlightBlock code={runtimeCode} />"],
    ["CodeSample", "<CodeSample src={runtimePath} />"],
    ["AnyApiCallout", '<AnyApiCallout callout="not-a-callout" />'],
    ["CcipCommon", '<CcipCommon callout="not-a-callout" />'],
    ["SchemaFieldsTable", '<SchemaFieldsTable schema="unknown" />'],
    ["Billing", "<Billing />"],
  ])("%s unresolved content is blocking with component, path, and line", (name, component) => {
    const source = `Visible\n\n${component}`
    const [diagnostic] = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source,
      artifact("Visible")
    ).filter((candidate) => candidate.status === "unverifiable")

    expect(diagnostic).toMatchObject({
      name,
      sourcePath: "src/content/fixture.mdx",
      sourceLine: 3,
      sourceText: component,
    })
    expect(JSON.parse(findingIdentity(diagnostic))).toMatchObject({
      path: "fixture",
      status: "unverifiable",
      language: "default",
      component: name,
      reason: diagnostic.reason,
    })
  })

  test.each([
    ['<AnyApiCallout callout="usefunctions" />', "Use Chainlink Functions"],
    ['<CcipCommon callout="senderContractCallout" />', "Best Practices"],
  ])("static selector content is independently inventoried: %s", (component, expectedFragment) => {
    const analysis = analyzeSourceMarkdown(component, "src/content/fixture.mdx")

    expect(analysis.diagnostics).toEqual([])
    expect(analysis.facts.some((fact) => fact.value.includes(expectedFragment))).toBe(true)
    expect(
      compareSourceToArtifact("fixture", "src/content/fixture.mdx", component, artifact("")).some(
        (candidate) => candidate.status === "missing"
      )
    ).toBe(true)
  })
})

describe("linked heading fidelity", () => {
  test("compares the nested destination without duplicating heading text", () => {
    const source = "# [Current guide](/current)"
    const correct = compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(source))
    const changed = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source,
      artifact("# [Current guide](/changed)")
    )
    const analysis = analyzeSourceMarkdown(source)

    expect(analysis.facts.map((fact) => [fact.kind, fact.value])).toEqual([
      ["heading", "Current guide"],
      ["link", "Current guide"],
    ])
    expect(correct.map((candidate) => candidate.status)).toEqual(["present", "present"])
    expect(changed.map((candidate) => candidate.status)).toEqual(["present", "missing"])
    expect(changed[1]).toMatchObject({
      expected: "Current guide -> /current",
      sourcePath: "src/content/fixture.mdx",
      sourceLine: 1,
    })
  })
})

describe("semantic fact boundaries and identities", () => {
  test("coalesces adjacent inline text on both sides of comparison", () => {
    const source = "Install the **CRE CLI** now."
    const analysis = analyzeSourceMarkdown(source)
    const findings = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source,
      artifact("Install the CRE CLI now.")
    )

    expect(analysis.facts.map((fact) => [fact.kind, fact.value])).toEqual([["text", "Install the CRE CLI now."]])
    expect(findings.map((candidate) => candidate.status)).toEqual(["present"])
  })

  test("keeps the real CLI dynamic expression as a text boundary", async () => {
    const source = await fs.readFile("src/content/cre/reference/cli/index.mdx", "utf8")
    const analysis = analyzeSourceMarkdown(source, "src/content/cre/reference/cli/index.mdx")
    const line18 = analysis.facts.filter((fact) => fact.line === 18 && fact.kind === "text").map((fact) => fact.value)
    const line19 = analysis.facts.filter((fact) => fact.line === 19 && fact.kind === "text").map((fact) => fact.value)

    expect(line18).toContain(
      "To ensure compatibility with the guides and examples in this documentation, please use version"
    )
    expect(line19).toContain(
      "of the CRE CLI. You can check your installed version by running cre version. Refer to the"
    )
    expect([...line18, ...line19].some((value) => value.includes("version of the CRE CLI"))).toBe(false)
  })

  test("blank lines and inserted distinct present facts do not change a loss identity", () => {
    const original = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "Visible\n\nLost",
      artifact("Visible")
    ).find((candidate) => candidate.status === "missing")
    const blankLineInserted = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "Visible\n\n\nLost",
      artifact("Visible")
    ).find((candidate) => candidate.status === "missing")
    const presentFactInserted = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "Inserted\n\nLost",
      artifact("Inserted")
    ).find((candidate) => candidate.status === "missing")
    const withoutInsertedFact = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "Lost",
      artifact("")
    ).find((candidate) => candidate.status === "missing")

    if (!original || !blankLineInserted || !presentFactInserted || !withoutInsertedFact) {
      throw new Error("Expected missing findings")
    }
    expect(findingIdentity(original)).toBe(findingIdentity(blankLineInserted))
    expect(findingIdentity(presentFactInserted)).toBe(findingIdentity(withoutInsertedFact))
  })

  test("long losses with a common display prefix retain distinct full identities", () => {
    const prefix = "same-prefix-".repeat(10)
    const findings = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      `${prefix}alpha\n\n${prefix}beta`,
      artifact("")
    )
    const identities = findings.map(findingIdentity)

    expect(findings.map((candidate) => candidate.display)).toEqual([
      expect.stringMatching(/\.\.\.$/),
      expect.stringMatching(/\.\.\.$/),
    ])
    expect(new Set(identities).size).toBe(2)
    expect(identities[0]).toContain(`${prefix}alpha`)
    expect(identities[1]).toContain(`${prefix}beta`)
  })

  test("residual findings retain exact served syntax and served line", () => {
    const served = "Visible\n\n<Widget answer={runtimeValue} />"
    const [residual] = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "Visible",
      artifact(served)
    ).filter((candidate) => candidate.occurrence.includes(";residual="))
    const identity = JSON.parse(findingIdentity(residual))

    expect(residual).toMatchObject({
      status: "unverifiable",
      name: "Widget",
      reason: "Served Markdown contains residual runtime syntax",
      servedLine: 3,
      servedText: "<Widget answer={runtimeValue} />",
    })
    expect(residual.occurrence).toContain('"servedText":"<Widget answer={runtimeValue} />"')
    expect(identity.servedText).toBe("<Widget answer={runtimeValue} />")
  })

  test("globally scheduled or visited synthetic targets are not emitted recursively", async () => {
    const requestPath = "cre/reference/sdk/evm-client"
    const goPath = `${requestPath}-go`
    const tsPath = `${requestPath}-ts`
    const scheduled = await checkPath(requestPath, {
      globallyScheduledPaths: new Set([requestPath, goPath, tsPath]),
    })
    const visited = await checkPath(requestPath, {
      globallyScheduledPaths: new Set([requestPath]),
      globallyVisitedPaths: new Set([goPath, tsPath]),
    })

    expect(new Set(scheduled.map((candidate) => candidate.path))).toEqual(new Set([requestPath]))
    expect(new Set(visited.map((candidate) => candidate.path))).toEqual(new Set([requestPath]))
    expect(new Set(scheduled.map(findingIdentity)).size).toBe(scheduled.length)
    expect(new Set(visited.map(findingIdentity)).size).toBe(visited.length)
  })
})

describe("final projection and envelope regressions", () => {
  test("checks imported CodeHighlightBlockMulti branches on a current production page", async () => {
    const findings = (await checkPath("cre")).filter(
      (candidate) =>
        candidate.sourcePath === "src/content/cre/index.mdx" &&
        candidate.sourceLine === 70 &&
        candidate.occurrence.includes('"kind":"code"')
    )

    expect(findings.length).toBe(4)
    expect(findings.every((candidate) => candidate.status === "present")).toBe(true)
    expect(new Set(findings.map((candidate) => candidate.lang ?? "default"))).toEqual(new Set(["default", "go", "ts"]))
  })

  test("reports DownloadButton as an unsupported visible component", () => {
    const source = 'Visible\n\n<DownloadButton href="/download">Download the toolkit</DownloadButton>'
    const [unsupported] = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source,
      artifact("Visible")
    ).filter((candidate) => candidate.status === "unsupported")

    expect(unsupported).toMatchObject({
      name: "DownloadButton",
      sourcePath: "src/content/fixture.mdx",
      sourceLine: 3,
      sourceText: '<DownloadButton href="/download">Download the toolkit</DownloadButton>',
    })
  })

  test("requires the exact production title, Source URL, and llms.txt directive", async () => {
    const requestPath = "cre/getting-started/cli-installation"
    const sourcePath = "src/content/cre/getting-started/cli-installation/index.mdx"
    const source = await fs.readFile(sourcePath, "utf8")
    const production = await buildMarkdownArtifact(requestPath)
    expect(production).not.toBeNull()
    if (!production) throw new Error(`Expected production Markdown artifact for ${requestPath}`)

    const envelope = compareSourceToArtifact(requestPath, sourcePath, source, production).filter((candidate) =>
      candidate.name?.startsWith("Envelope.")
    )
    expect(envelope.map((candidate) => [candidate.name, candidate.status])).toEqual([
      ["Envelope.title", "present"],
      ["Envelope.source", "present"],
      ["Envelope.directive", "present"],
    ])

    const mutations = [
      ["Envelope.title", production.markdown.replace(/^# .+$/m, "# Changed title")],
      ["Envelope.source", production.markdown.replace(/^Source: .+$/m, "Source: https://example.test/changed")],
      [
        "Envelope.directive",
        production.markdown.replace(
          "> For the complete documentation index, see [llms.txt](/llms.txt).",
          "> Documentation index removed."
        ),
      ],
    ] as const
    for (const [name, markdown] of mutations) {
      const [finding] = compareSourceToArtifact(requestPath, sourcePath, source, { ...production, markdown }).filter(
        (candidate) => candidate.name === name
      )
      expect(finding).toMatchObject({ status: "missing", name })
    }
  })

  test("numbers unchanged missing duplicates independently from identical present copies", () => {
    const original = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "same\n\nsame",
      artifact("same")
    ).find((candidate) => candidate.status === "missing")
    const withPresentCopy = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      "same\n\nsame\n\nsame",
      artifact("same\n\nsame")
    ).find((candidate) => candidate.status === "missing")

    expect(original).toBeDefined()
    expect(withPresentCopy).toBeDefined()
    if (!original || !withPresentCopy) throw new Error("Expected one unchanged missing duplicate in both comparisons")
    expect(original.occurrence).toContain(";duplicate=1")
    expect(withPresentCopy.occurrence).toContain(";duplicate=1")
    expect(findingIdentity(withPresentCopy)).toBe(findingIdentity(original))
  })
})

describe("stable report JSON", () => {
  test("is sorted, timestamp-free, and contains no score", () => {
    const second = finding("unsupported", "lang=default;diagnostic=2;Second", 20)
    const first = finding("missing", "lang=default;fact=1;text=First", 10)
    const left = serializeReport(createReport(2, [second, first]))
    const right = serializeReport(createReport(2, [first, second]))

    expect(left).toBe(right)
    expect(left).not.toContain("score")
    expect(left).not.toContain("timestamp")
    expect(JSON.parse(left)).toMatchObject({
      pathCount: 2,
      counts: { present: 0, missing: 1, unsupported: 1, unverifiable: 0, degraded: 0 },
    })
  })
})
