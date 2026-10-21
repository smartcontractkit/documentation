import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { describe, expect, test } from "@jest/globals"
import { buildMarkdownArtifact } from "@lib/markdown/buildMarkdownArtifact.js"
import { transformMarkdown } from "@lib/markdown/transformMarkdown.js"
import type { MarkdownArtifact } from "@lib/markdown/types.js"
import {
  analyzeSourceMarkdown,
  blockingFindings,
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

  test("full-corpus names the new identity that fails the run", () => {
    const current = finding("unverifiable", "lang=default;new=parse")
    current.reason = "Could not parse expression with acorn"
    expect(blockingFindings("full-corpus", [current], new Set())).toEqual([current])
  })

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
      warnOnly: false,
    })
    expect(determineExitCode("focused", [finding("degraded", "lang=default;transform=fallback")])).toBe(1)
    expect(determineExitCode("focused", [finding("unsupported", "lang=default;diagnostic=1;Widget")])).toBe(1)
  })

  test("--warn-only is accepted with or without --path", () => {
    expect(parseCliArguments(["--warn-only"])).toEqual({ mode: "full-corpus", paths: [], warnOnly: true })
    expect(parseCliArguments(["--path", "cre/example", "--warn-only"])).toEqual({
      mode: "focused",
      paths: ["cre/example"],
      warnOnly: true,
    })
  })

  test.each([
    ["src/content/cre/getting-started/cli-installation/index.mdx", "cre/getting-started/cli-installation"],
    [
      "src/content/cre/getting-started/cli-installation/macos-linux.mdx",
      "cre/getting-started/cli-installation/macos-linux",
    ],
    ["src/content/cre/getting-started/cli-installation/windows.mdx", "cre/getting-started/cli-installation/windows"],
  ])("maps source path %s to production request path", (sourcePath, requestPath) => {
    expect(parseCliArguments(["--path", sourcePath])).toEqual({
      mode: "focused",
      paths: [requestPath],
      warnOnly: false,
    })
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

  test("--warn-only reports blockers but exits 0", async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "markdown-fidelity-"))
    const reportPath = path.join(directory, "report.json")
    try {
      const sourcePath = "src/content/data-streams/reference/report-schema-v11.mdx"
      const blocking = await runMarkdownFidelity(["--path", sourcePath], { reportPath })
      const warned = await runMarkdownFidelity(["--warn-only", "--path", sourcePath], { reportPath })

      expect(blocking.blockers.length).toBeGreaterThan(0)
      expect(blocking.exitCode).toBe(1)
      expect(blocking.warnOnly).toBe(false)
      expect(warned.blockers.length).toBe(blocking.blockers.length)
      expect(warned.exitCode).toBe(0)
      expect(warned.warnOnly).toBe(true)
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
      status: first.status as FidelityException["status"],
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
  test("unknown source expectations preserve component name, repository path, and original line", () => {
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
    ).filter((candidate) => candidate.status === "unverifiable")

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
    ["CCIPSendError", '<CCIPSendError type="unknown" version="v1_6_2" />'],
    ["CCIPEvent", '<CCIPEvent type="onramp-send" version="v9_9_9" />'],
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
    ['<AnyApiCallout callout="usefunctions" />', "Use CRE"],
    ['<CcipCommon callout="senderContractCallout" />', "Best Practices"],
    ['<AceCallout callout="privateBeta" />', "Private Beta"],
    ['<TokenizedEquityFeeds section="tokenizedEquityNote" />', "Tokenized equity feeds"],
    ['<CCIPSendError type="router" version="v1_6_2" />', "0xae236d9c"],
    ['<CCIPEvent type="onramp-send" version="v1_6_3" />', "Internal.EVM2AnyRampMessage"],
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

  test.each([
    [
      '<CCIPEvent type="onramp-send" version="v1_6_3" />',
      "`uint64 indexed destChainSelector`",
      "`uint64 destChainSelector`",
      "uint64 indexed destChainSelector, uint64 indexed sequenceNumber,",
    ],
    ['<CCIPEvent type="onramp-send" version="v1_6_3" />', "`message`", "`payload`", "message"],
    ['<CCIPSendError type="router" version="v1_6_2" />', "`uint64 destChainSelector`", "-", "uint64 destChainSelector"],
  ])("CCIP reference parameters are verified in %s", async (component, rendered, changed, expected) => {
    const markdown = await transformMarkdown(component, path.resolve("src/content/fixture.mdx"))
    const missing = (body: string) =>
      compareSourceToArtifact("fixture", "src/content/fixture.mdx", component, artifact(body)).filter(
        (candidate) => candidate.status === "missing"
      )

    expect(markdown).toContain(rendered)
    expect(missing(markdown)).toEqual([])
    expect(missing(markdown.replace(rendered, changed))).toEqual([expect.objectContaining({ expected })])
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
    const findings = (await checkPath("cre/overview")).filter(
      (candidate) =>
        candidate.sourcePath === "src/content/cre/overview.mdx" &&
        candidate.sourceLine === 71 &&
        candidate.occurrence.includes('"kind":"code"')
    )

    expect(findings.filter((candidate) => !candidate.output)).toHaveLength(4)
    expect(findings.filter((candidate) => candidate.outputs?.includes("txt"))).toHaveLength(2)
    expect(findings.every((candidate) => candidate.status === "present")).toBe(true)
    expect(new Set(findings.map((candidate) => candidate.lang ?? "default"))).toEqual(new Set(["default", "go", "ts"]))
  })

  test("reports an unknown DownloadButton expectation as unverifiable", () => {
    const source = 'Visible\n\n<DownloadButton href="/download">Download the toolkit</DownloadButton>'
    const [unsupported] = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source,
      artifact("Visible")
    ).filter((candidate) => candidate.status === "unverifiable")

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

  test("expects the published CCIP URL, without the latest content directory, in the Source line", async () => {
    const requestPath = "ccip/v2/canton/concepts/key-concepts"
    const sourcePath = "src/content/ccip/v2/canton/concepts/key-concepts.mdx"
    const source = await fs.readFile(sourcePath, "utf8")
    const production = await buildMarkdownArtifact(requestPath)
    if (!production) throw new Error(`Expected production Markdown artifact for ${requestPath}`)
    const sourceFinding = (markdown: string) =>
      compareSourceToArtifact(requestPath, sourcePath, source, { ...production, markdown }).find(
        (candidate) => candidate.name === "Envelope.source"
      )

    expect(production.markdown).toContain("Source: https://docs.chain.link/ccip/canton/concepts/key-concepts")
    expect(sourceFinding(production.markdown)).toMatchObject({ status: "present" })
    expect(
      sourceFinding(production.markdown.replace("docs.chain.link/ccip/canton", "docs.chain.link/ccip/v2/canton"))
    ).toMatchObject({ status: "missing" })
  })

  test("reads one-line tab slots that MDX wraps in a paragraph", async () => {
    const source = [
      "<Tabs>",
      '  <Fragment slot="tab.1">npm</Fragment>',
      '  <Fragment slot="tab.2">yarn</Fragment>',
      '  <Fragment slot="panel.1">',
      "",
      "Run `npm install example`.",
      "",
      "  </Fragment>",
      '  <Fragment slot="panel.2">',
      "",
      "Run `yarn add example`.",
      "",
      "  </Fragment>",
      "</Tabs>",
    ].join("\n")
    const markdown = await transformMarkdown(source, path.resolve("src/content/fixture.mdx"))
    const findings = compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(markdown))

    expect(analyzeSourceMarkdown(source, "src/content/fixture.mdx").diagnostics).toEqual([])
    expect(findings.filter((candidate) => candidate.status !== "present")).toEqual([])
    expect(findings.map((candidate) => candidate.expected)).toEqual(
      expect.arrayContaining(["npm", "yarn", "Run npm install example.", "Run yarn add example."])
    )
    expect(
      compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(markdown.replace("yarn add", "")))
        .filter((candidate) => candidate.status === "missing")
        .map((candidate) => candidate.expected)
    ).toEqual(["Run yarn add example."])
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

describe("card container fidelity", () => {
  const source = (wrapper: string) => `<${wrapper}>
  <GitHubCard title="First repository" href="https://example.com/first" badge="New">
    First repository description.
  </GitHubCard>
  <GitHubCard title="Second repository" href="https://example.com/second">
    Second repository description.
  </GitHubCard>
</${wrapper}>`
  const firstCard = "[First repository](https://example.com/first) New\n\nFirst repository description."
  const secondCard = "[Second repository](https://example.com/second)\n\nSecond repository description."

  test.each(["GitHubCards", "OverviewWrapper"])("inventories cards inside %s", (wrapper) => {
    const findings = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source(wrapper),
      artifact(`${firstCard}\n\n${secondCard}`)
    )

    expect(blockingFindings("focused", findings)).toEqual([])
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "present", expected: "First repository -> https://example.com/first" }),
        expect.objectContaining({ status: "present", expected: "New" }),
        expect.objectContaining({ status: "present", expected: "First repository description." }),
        expect.objectContaining({ status: "present", expected: "Second repository -> https://example.com/second" }),
        expect.objectContaining({ status: "present", expected: "Second repository description." }),
      ])
    )
  })

  test.each(["GitHubCards", "OverviewWrapper"])("detects a missing card inside %s", (wrapper) => {
    const findings = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      source(wrapper),
      artifact(secondCard)
    )

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "missing", expected: "First repository -> https://example.com/first" }),
        expect.objectContaining({ status: "missing", expected: "First repository description." }),
        expect.objectContaining({ status: "present", expected: "Second repository -> https://example.com/second" }),
      ])
    )
  })

  test("reads nested overview and card containers", () => {
    const nested = `<OverviewWrapper>${source("GitHubCards")}</OverviewWrapper>`
    const findings = compareSourceToArtifact(
      "fixture",
      "src/content/fixture.mdx",
      nested,
      artifact(`${firstCard}\n\n${secondCard}`)
    )

    expect(blockingFindings("focused", findings)).toEqual([])
    expect(findings).toContainEqual(
      expect.objectContaining({ status: "present", expected: "First repository -> https://example.com/first" })
    )
  })
})

describe("solution component fidelity", () => {
  const source = `<ol><li>First item.</li><li>Second item.</li></ol>

<AnchoredAccordion title="Deploy" number={2} depth={3}>

\`\`\`bash
forge create ExampleVault
\`\`\`

<GitHubCard title="Repository" href="https://example.com/repo">
Repository description.
</GitHubCard>

</AnchoredAccordion>`
  const complete =
    "1. First item.\n2. Second item.\n\n### 2. Deploy\n\n```bash\nforge create ExampleVault\n```\n\n[Repository](https://example.com/repo)\n\nRepository description."

  test("checks ordered lists, anchored accordion bodies, and GitHub cards independently", () => {
    const findings = compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(complete))
    expect(findings.length).toBeGreaterThan(5)
    expect(blockingFindings("focused", findings)).toEqual([])
  })

  test("detects missing commands inside an anchored accordion", () => {
    const missing = complete.replace("```bash\nforge create ExampleVault\n```", "")
    const findings = compareSourceToArtifact("fixture", "src/content/fixture.mdx", source, artifact(missing))
    expect(findings).toContainEqual(
      expect.objectContaining({ status: "missing", expected: "forge create ExampleVault" })
    )
  })
})

describe("explicit anchored accordion IDs", () => {
  const title = "4. Set the return format and fund the adapter"
  const source = (attribute = 'anchorId="fund-the-adapter"', component = "AnchoredAccordion") =>
    `<${component} title="Set the return format and fund the adapter" number={4} depth={3} ${attribute}>

Fund the adapter. [Return to this step](#fund-the-adapter).

</${component}>`
  const output = (anchor = '<a id="fund-the-adapter"></a>') =>
    `### ${title}${anchor ? ` ${anchor}` : ""}\n\nFund the adapter. [Return to this step](#fund-the-adapter).`
  const compare = (input: string, markdown: string) =>
    compareSourceToArtifact("fixture", "src/content/fixture.mdx", input, artifact(markdown))

  test("inventories the exact anchor together with its heading and depth", () => {
    const analysis = analyzeSourceMarkdown(source())
    expect(analysis.facts).toContainEqual(
      expect.objectContaining({ kind: "anchor", value: "fund-the-adapter", heading: title, depth: 3 })
    )
    const findings = compare(source(), output())
    expect(blockingFindings("focused", findings)).toEqual([])
    expect(findings).toContainEqual(expect.objectContaining({ status: "present", expected: "fund-the-adapter" }))
  })

  test.each(['anchorId={"fund-the-adapter"}', "anchorId={`fund-the-adapter`}"])(
    "reads a static expression ID: %s",
    (attribute) => {
      expect(blockingFindings("focused", compare(source(attribute), output()))).toEqual([])
    }
  )

  test.each(["", '<a id="wrong-step"></a>'])("detects a missing or changed ID: %s", (anchor) => {
    const findings = compare(source(), output(anchor))
    expect(findings).toContainEqual(expect.objectContaining({ status: "missing", expected: "fund-the-adapter" }))
    expect(findings).toContainEqual(expect.objectContaining({ status: "present", expected: title }))
    expect(findings).toContainEqual(
      expect.objectContaining({ status: "present", expected: "Return to this step -> #fund-the-adapter" })
    )
  })

  test.each([
    `${output("")}\n\n### Another step <a id="fund-the-adapter"></a>`,
    `${output("")}\n\n## ${title} <a id="fund-the-adapter"></a>`,
    `${output("")}\n\n<a id="fund-the-adapter"></a>`,
  ])("rejects an ID placed on another heading or outside a heading", (markdown) => {
    const findings = compare(source(), markdown)
    expect(findings).toContainEqual(expect.objectContaining({ status: "missing", expected: "fund-the-adapter" }))
    expect(findings).toContainEqual(
      expect.objectContaining({ status: "unverifiable", reason: "Served Markdown contains residual runtime syntax" })
    )
  })

  test("decodes escaped attribute characters without changing the ID", () => {
    const id = 'deploy&"quoted"<adapter>\\_safe'
    const input = source(`anchorId={${JSON.stringify(id)}}`)
    const markdown = output('<a id="deploy&amp;&quot;quoted&quot;&lt;adapter&gt;&#92;_safe"></a>')
    const findings = compare(input, markdown)
    expect(blockingFindings("focused", findings)).toEqual([])
    expect(findings).toContainEqual(expect.objectContaining({ status: "present", expected: id }))
  })

  test.each(["anchorId={runtimeId}", "anchorId={getId()}", "anchorId={42}", "anchorId={null}", "anchorId"])(
    "reports an unverifiable ID without losing the heading or body: %s",
    (attribute) => {
      const findings = compare(source(attribute), output(""))
      expect(findings).toContainEqual(
        expect.objectContaining({ status: "unverifiable", name: "AnchoredAccordion.anchorId" })
      )
      expect(findings).toContainEqual(expect.objectContaining({ status: "present", expected: title }))
      expect(findings).toContainEqual(expect.objectContaining({ status: "present", expected: "Fund the adapter." }))
      expect(analyzeSourceMarkdown(source(attribute)).facts.some((fact) => fact.kind === "anchor")).toBe(false)
    }
  )

  test.each(["", 'anchorId=""', 'anchorId={""}'])("does not invent an ID for %s", (attribute) => {
    expect(blockingFindings("focused", compare(source(attribute), output("")))).toEqual([])
    expect(analyzeSourceMarkdown(source(attribute)).facts.some((fact) => fact.kind === "anchor")).toBe(false)
  })

  test("keeps ordinary Accordion behavior unchanged", () => {
    expect(
      blockingFindings("focused", compare(source('anchorId="fund-the-adapter"', "Accordion"), output("")))
    ).toEqual([])
    expect(
      analyzeSourceMarkdown(source('anchorId="fund-the-adapter"', "Accordion")).facts.some(
        (fact) => fact.kind === "anchor"
      )
    ).toBe(false)
  })

  test.each([
    '<a id="fund-the-adapter" href="https://example.com"></a>',
    '<a id="fund-the-adapter" onClick={runtimeHandler}></a>',
    '<a id="fund-the-adapter">Visible runtime content</a>',
    '<a id={"fund-the-adapter"}></a>',
    '<a id="fund-the-adapter" {...runtimeProps}></a>',
  ])("does not exempt unsafe or unrelated anchor HTML: %s", (anchor) => {
    const findings = compare(source(), output(anchor))
    expect(findings).toContainEqual(expect.objectContaining({ status: "missing", expected: "fund-the-adapter" }))
    expect(findings).toContainEqual(
      expect.objectContaining({ status: "unverifiable", reason: "Served Markdown contains residual runtime syntax" })
    )
  })

  test.each(['<a id="unrelated"></a>', "<UnknownWidget />", "{runtimeValue}"])(
    "reports unexpected runtime syntax inside an ordinary heading: %s",
    (runtime) => {
      const findings = compare("## Visible heading", `## Visible heading ${runtime}`)
      expect(findings).toContainEqual(
        expect.objectContaining({ status: "unverifiable", reason: "Served Markdown contains residual runtime syntax" })
      )
    }
  )
})

test("checks unordered lists inside callouts without requiring artificial separators", () => {
  const source = `<Aside type="caution" title="Important">
<ul>
<li>
First requirement.
</li>
<li>
Second requirement.
</li>
</ul>
</Aside>`
  const output = "> **CAUTION: Important**\n>\n> - First requirement.\n> - Second requirement."
  expect(
    blockingFindings("focused", compareSourceToArtifact("fixture", "fixture.mdx", source, artifact(output)))
  ).toEqual([])
})

test.each(["ol", "ul"])("coalesces projected inline HTML in %s items before a repeated later value", (list) => {
  const source = `<Aside type="note">
<${list}>
<li>Foundry scripts default to <strong>400,000</strong> gas unless you set{" "}
  <code>GAS_LIMIT</code><br /> (and fall back if estimation fails).</li>
<li>Test all scenarios before deployment.</li>
</${list}>
</Aside>

## Before you begin

Follow the <b>required</b> steps and keep <span>all</span> values in <nobr>one place</nobr> for chain<sub>1</sub>.

## Later reference

\`GAS_LIMIT\``
  const marker = list === "ol" ? "1." : "-"
  const nextMarker = list === "ol" ? "2." : "-"
  const output = `> **NOTE**
>
> ${marker} Foundry scripts default to **400,000** gas unless you set \`GAS_LIMIT\` (and fall back if estimation fails).
> ${nextMarker} Test all scenarios before deployment.

## Before you begin

Follow the **required** steps and keep all values in one place for chain1.

## Later reference

\`GAS_LIMIT\``

  const findings = compareSourceToArtifact("fixture", "fixture.mdx", source, artifact(output))
  expect(blockingFindings("focused", findings)).toEqual([])
  expect(findings).toContainEqual(expect.objectContaining({ status: "present", expected: "Before you begin" }))
  const missing = compareSourceToArtifact(
    "fixture",
    "fixture.mdx",
    source,
    artifact(output.replace("Test all scenarios before deployment.", ""))
  )
  expect(missing).toContainEqual(
    expect.objectContaining({ status: "missing", expected: "Test all scenarios before deployment." })
  )
})

test("checks the Data Feeds JSX-space callout and detects a missing inline code value", () => {
  const source = `<Aside type="caution" title="Important">
<ul>
<li>Searchers must not exceed the allowed{" "}
  <code>SolverGasLimit</code>. Query <code>getSolverGasLimit</code> on the{" "}
  <code>DappControl</code> contract.</li>
</ul>
</Aside>`
  const output =
    "> **CAUTION: Important**\n>\n> - Searchers must not exceed the allowed `SolverGasLimit`. Query `getSolverGasLimit` on the `DappControl` contract."

  expect(
    blockingFindings("focused", compareSourceToArtifact("fixture", "fixture.mdx", source, artifact(output)))
  ).toEqual([])
  const incomplete = output.replace("`SolverGasLimit`", "")
  expect(
    compareSourceToArtifact("fixture", "fixture.mdx", source, artifact(incomplete)).some(
      (finding) => finding.status === "missing" && finding.expected?.includes("SolverGasLimit")
    )
  ).toBe(true)
})

test("keeps dynamic inline HTML attributes unverifiable while checking emphasis text", () => {
  const source = "Keep <strong title={runtimeTitle}>this fact</strong> and <em>unprojected emphasis</em>."
  const analysis = analyzeSourceMarkdown(source, "fixture.mdx")
  expect(analysis.diagnostics).toEqual(
    expect.arrayContaining([expect.objectContaining({ status: "unverifiable", name: "strong.title" })])
  )
})
