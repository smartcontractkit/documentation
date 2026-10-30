import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { transformPageBodyToMarkdown } from "../lib/markdown/buildMarkdownArtifact.js"
import { renderLlmsPageMarkdown } from "../lib/markdown/llms.js"
import type { DroppedComponent, MarkdownArtifact } from "../lib/markdown/types.js"
import {
  blockingFindings,
  baselineFromFindings,
  checkPath,
  compareSourceToArtifact,
  componentInventory,
  createReport,
  findingIdentity,
  formatFocusedFindings,
  formatJobSummary,
  parseCliArguments,
  publishComponentInventory,
  runMarkdownFidelity,
  serializeReport,
} from "./check-markdown-fidelity.js"

const PAGE = path.resolve("src/content/ace/fixture.mdx")
const SOURCE_PATH = "src/content/ace/fixture.mdx"
const GENERATED_AT = "2026-10-19T00:00:00.000Z"

afterEach(() => {
  jest.restoreAllMocks()
})

async function check(source: string, output?: "txt") {
  const drops: DroppedComponent[] = []
  const options = { onDropComponent: (drop: DroppedComponent) => drops.push(drop) }
  const rendered = output
    ? await renderLlmsPageMarkdown(source, PAGE, "ace", undefined, options)
    : await transformPageBodyToMarkdown(source, PAGE, options)
  const artifact: MarkdownArtifact = { ...rendered, requestPath: "ace/fixture", routeKind: "normal" }
  return {
    artifact,
    drops,
    findings: compareSourceToArtifact("ace/fixture", SOURCE_PATH, source, artifact, "default", [], { drops, output }),
  }
}

describe.each([undefined, "txt"] as const)("component evidence in %s output", (output) => {
  test("supported cards have independent title, URL and body expectations", async () => {
    const source = '<DocCards>\n<DocCard title="Useful guide" href="/ace">\nRead the guide.\n</DocCard>\n</DocCards>'
    const { artifact, drops, findings } = await check(source, output)
    expect(artifact.markdown).toContain("[Useful guide](/ace): Read the guide.")
    expect(drops).toEqual([])
    expect(findings.every((finding) => finding.status === "present")).toBe(true)
    const broken = compareSourceToArtifact(
      "ace/fixture",
      SOURCE_PATH,
      source,
      { ...artifact, markdown: "- [Useful guide](/wrong): Read the guide." },
      "default",
      [],
      { output }
    )
    expect(broken).toContainEqual(
      expect.objectContaining({ status: "missing", component: "DocCard", expected: "Useful guide -> /ace" })
    )
  })

  test("inline CopyText joins the surrounding paragraph without false positives", async () => {
    const { findings } = await check('Copy <CopyText text="Important text" /> now.', output)
    expect(findings.every((finding) => finding.status === "present")).toBe(true)
  })

  test.each([
    ["CopyText", '<CopyText text="Important text" />'],
    ["img", '<img src="/images/important.png" alt="Important diagram" />'],
    ["em", "Before <em>important words</em> after."],
  ])("reports %s from actual removals, including prop-only content", async (name, source) => {
    const { findings } = await check(source, output)
    expect(findings).toContainEqual(expect.objectContaining({ status: "unsupported", component: name }))
    expect(findings.filter((finding) => finding.status === "unsupported")).toHaveLength(1)
  })

  test("a dynamic placeholder remains unverifiable even without an observed drop", async () => {
    const { drops, findings } = await check("<FeedPage />", output)
    expect(drops).toEqual([])
    expect(findings).toContainEqual(expect.objectContaining({ status: "unverifiable", component: "FeedPage" }))
    expect(findings.some((finding) => finding.status === "unsupported")).toBe(false)
  })

  test("valid images are checked by URL as well as label", async () => {
    const source = "![Important diagram](/images/important.png)"
    const { artifact, findings } = await check(source, output)
    expect(findings.every((finding) => finding.status === "present")).toBe(true)
    const broken = compareSourceToArtifact(
      "ace/fixture",
      SOURCE_PATH,
      source,
      { ...artifact, markdown: "![Important diagram](/wrong.png)" },
      "default",
      [],
      { output }
    )
    expect(broken.some((finding) => finding.status === "missing")).toBe(true)
  })
})

test("a checker expectation gap is never labelled as an observed removal", () => {
  const findings = compareSourceToArtifact("ace/fixture", SOURCE_PATH, "<FutureWidget />", {
    requestPath: "ace/fixture",
    routeKind: "normal",
    transformMode: "normal",
    markdown: "Useful generated text",
  })
  expect(findings).toContainEqual(expect.objectContaining({ status: "unverifiable", component: "FutureWidget" }))
  expect(findings.some((finding) => finding.status === "unsupported")).toBe(false)
})

test("a TXT metadata title cannot conceal a missing body heading", async () => {
  const source = "---\ntitle: Useful guide\n---\n\n# Useful guide"
  const { artifact } = await check(source, "txt")
  const findings = compareSourceToArtifact(
    "ace/fixture",
    SOURCE_PATH,
    source,
    { ...artifact, markdown: "# Useful guide\nSource: https://docs.chain.link/ace/fixture\n\n" },
    "default",
    [],
    { output: "txt" }
  )
  expect(findings).toContainEqual(expect.objectContaining({ status: "missing", expected: "Useful guide" }))
})

test("content lost with a removed parent is attributed to that parent", () => {
  const source = '<MethodTabs>\n<Fragment slot="ui">\n<ClickToZoom src="/image.png" />\n</Fragment>\n</MethodTabs>'
  const findings = compareSourceToArtifact(
    "ace/fixture",
    SOURCE_PATH,
    source,
    {
      requestPath: "ace/fixture",
      routeKind: "normal",
      transformMode: "normal",
      markdown: "",
    },
    "default",
    [],
    { drops: [{ name: "MethodTabs" }] }
  )
  expect(findings).toContainEqual(
    expect.objectContaining({ status: "missing", component: "MethodTabs", expected: "Image -> /image.png" })
  )
  expect(createReport(1, findings).components.map((component) => component.name)).toEqual(["MethodTabs"])
})

test("unvisited children do not emit diagnostics when the real transform drops their parent", async () => {
  const { drops, findings } = await check(
    'Before <MethodTabs><Fragment slot="ui"><Aside title={runtimeTitle}>Note</Aside></Fragment></MethodTabs> after.'
  )
  expect(drops).toEqual([{ name: "MethodTabs" }])
  expect(findings).toContainEqual(expect.objectContaining({ status: "unsupported", component: "MethodTabs" }))
  expect(findings.some((finding) => finding.name === "Aside.title")).toBe(false)
  expect(findings.some((finding) => finding.component === "Aside")).toBe(false)
})

test("the public inventory deduplicates pages across languages and formats and keeps baseline debt visible", () => {
  const findings = ["go", "ts"].flatMap((lang) =>
    [undefined, "txt"].map((output) => ({
      path: "cre/fixture",
      sourcePath: SOURCE_PATH,
      sourceLine: null,
      status: "unsupported" as const,
      occurrence: `lang=${lang};dropped=Widget`,
      lang,
      component: "Widget",
      name: "Widget",
      ...(output ? { output: output as "txt" } : {}),
    }))
  )
  const baseline = new Set(findings.map(findingIdentity))
  const report = createReport(1, findings)
  expect(report.components).toEqual([
    {
      name: "Widget",
      kind: "component",
      pageCount: 1,
      pages: [SOURCE_PATH],
      statuses: ["unsupported"],
      pagesByStatus: { unsupported: 1, missing: 0, unverifiable: 0, degraded: 0 },
    },
  ])
  const inventory = componentInventory(report, blockingFindings("full-corpus", findings, baseline), GENERATED_AT)
  expect(inventory.schemaVersion).toBe(2)
  expect(inventory.newSinceBaseline).toEqual([])
  expect(inventory.components).toHaveLength(1)
  expect(componentInventory(report, findings, GENERATED_AT).newSinceBaseline).toEqual(["Widget"])
  expect(serializeReport(report)).toBe(serializeReport(createReport(1, [...findings].reverse())))
})

test("inventory counts overlapping statuses by unique page, distinguishes HTML and prioritizes drops", () => {
  const finding = { path: "ace/fixture", sourcePath: SOURCE_PATH, sourceLine: null, occurrence: "fixture" }
  const report = createReport(3, [
    { ...finding, component: "Widget", status: "unsupported" },
    { ...finding, component: "Widget", status: "missing" },
    { ...finding, component: "Widget", status: "missing", output: "txt" },
    { ...finding, component: "div", status: "unverifiable" },
    { ...finding, sourcePath: "other.mdx", component: "div", status: "unverifiable" },
  ])
  expect(report.components[0]).toMatchObject({
    name: "Widget",
    kind: "component",
    pageCount: 1,
    pagesByStatus: { unsupported: 1, missing: 1, unverifiable: 0, degraded: 0 },
  })
  expect(report.components[1]).toMatchObject({
    name: "div",
    kind: "html",
    pageCount: 2,
    pagesByStatus: { unverifiable: 2 },
  })
})

test("the CI summary lists only new evidence, including new pages of an existing component", () => {
  const known = {
    path: "ace/old",
    sourcePath: "old.mdx",
    sourceLine: null,
    occurrence: "known",
    component: "Widget",
    status: "unsupported" as const,
  }
  const fresh = { ...known, path: "ace/new", sourcePath: "new.mdx", occurrence: "new" }
  const unattributed = { path: "ace/unknown", sourceLine: null, occurrence: "missing", status: "missing" as const }
  const report = createReport(3, [known, fresh, unattributed])
  const summary = formatJobSummary(report, [fresh, unattributed])
  expect(summary).toContain("2 new finding(s) across 1 component/HTML types")
  expect(summary).toContain("1 finding(s) without component attribution")
  expect(summary).toContain("new.mdx")
  expect(summary).not.toContain("old.mdx")
  expect(formatJobSummary(report, [])).toContain("0 new finding(s)")
  expect(formatJobSummary(report, [])).not.toContain("Widget")
})

test("omitting present evidence preserves counts and does not change baseline identities", () => {
  const findings = [
    { path: "fixture", sourceLine: null, occurrence: "ok", status: "present" as const },
    { path: "fixture", sourceLine: null, occurrence: "missing", status: "missing" as const },
    {
      path: "fixture",
      sourceLine: null,
      occurrence: "allowed",
      status: "unsupported" as const,
      exception: { reason: "reviewed", owner: "docs", removalCondition: "static projection" },
    },
  ]
  const report = createReport(1, findings)
  const compact = JSON.parse(serializeReport(report, { omitPresent: true }))
  expect(compact).toMatchObject({ omittedPresent: true, counts: { present: 1, missing: 1, unsupported: 1 } })
  expect(compact.findings).toHaveLength(2)
  expect(report.findings).toHaveLength(3)
  expect(baselineFromFindings(findings)).toEqual({ version: 1, identities: [findingIdentity(findings[1])] })
  expect(baselineFromFindings([...findings, findings[1]].reverse())).toEqual(baselineFromFindings(findings))
})

test("focused terminal details include evidence and formats with a bounded listing", () => {
  const findings = Array.from({ length: 51 }, (_, index) => ({
    path: "ace/fixture",
    sourcePath: SOURCE_PATH,
    sourceLine: index + 1,
    component: "Widget",
    status: "missing" as const,
    occurrence: String(index),
    expected: "lost content",
    output: "txt" as const,
  }))
  const details = formatFocusedFindings(findings)
  expect(details).toContain(`[missing] ${SOURCE_PATH}:1 (Widget) [txt]: lost content`)
  expect(details).toContain("1 more finding(s)")
  expect(details).not.toContain(`${SOURCE_PATH}:51`)
})

test("baseline refresh requires a full corpus", () => {
  expect(() => parseCliArguments(["--path", "ace/fixture", "--update-baseline"])).toThrow("full-corpus")
  expect(parseCliArguments(["--update-baseline", "--omit-present"])).toMatchObject({
    mode: "full-corpus",
    updateBaseline: true,
    omitPresent: true,
  })
})

test("an explicit full refresh records known debt and the next check has no new findings", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fidelity-baseline-"))
  try {
    const options = {
      baselinePath: path.join(directory, "baseline.json"),
      reportPath: path.join(directory, "report.json"),
      contentRoot: path.join(directory, "content"),
    }
    await fs.mkdir(options.contentRoot)
    const refreshed = await runMarkdownFidelity(["--update-baseline", "--omit-present"], options)
    expect(refreshed.exitCode).toBe(0)
    const baseline = JSON.parse(await fs.readFile(options.baselinePath, "utf8"))
    expect(baseline.identities.length).toBeGreaterThan(0)
    expect(baseline).toEqual(baselineFromFindings(refreshed.report.findings))
    const checked = await runMarkdownFidelity([], options)
    expect(checked.blockers).toEqual([])
    expect(checked.report.counts).toEqual(refreshed.report.counts)
    expect(checked.report.counts.missing + checked.report.counts.unverifiable).toBeGreaterThan(0)
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})

test("a failed baseline replacement preserves the previous baseline", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fidelity-baseline-"))
  try {
    const options = {
      baselinePath: path.join(directory, "baseline.json"),
      reportPath: path.join(directory, "report.json"),
      contentRoot: path.join(directory, "content"),
    }
    await fs.mkdir(options.contentRoot)
    await fs.writeFile(options.baselinePath, "previous baseline")
    jest.spyOn(fs, "rename").mockRejectedValueOnce(new Error("rename failed"))
    await expect(runMarkdownFidelity(["--update-baseline"], options)).rejects.toThrow("rename failed")
    expect(await fs.readFile(options.baselinePath, "utf8")).toBe("previous baseline")
    expect((await fs.readdir(directory)).filter((name) => name.endsWith(".tmp"))).toEqual([])
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})

test("a page-check error prevents an explicit baseline refresh even in warning mode", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fidelity-baseline-"))
  try {
    const options = {
      baselinePath: path.join(directory, "baseline.json"),
      reportPath: path.join(directory, "report.json"),
      contentRoot: path.join(directory, "content"),
    }
    await fs.mkdir(path.join(options.contentRoot, "ace/getting-started"), { recursive: true })
    await fs.writeFile(
      path.join(options.contentRoot, "ace/getting-started/account-setup.mdx"),
      "placeholder for discovery"
    )
    await fs.writeFile(options.baselinePath, "previous baseline")
    const readFile = fs.readFile.bind(fs)
    jest.spyOn(fs, "readFile").mockImplementation((...args: Parameters<typeof fs.readFile>) => {
      if (String(args[0]) === path.resolve("src/content/ace/getting-started/account-setup.mdx"))
        return Promise.reject(new Error("fixture read failed"))
      return readFile(...args)
    })
    await expect(runMarkdownFidelity(["--update-baseline", "--warn-only"], options)).rejects.toThrow(
      "page check(s) failed"
    )
    expect(await fs.readFile(options.baselinePath, "utf8")).toBe("previous baseline")
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})

test("a failed public replacement preserves the previous file and removes its temporary file", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fidelity-publish-"))
  try {
    const output = path.join(directory, "component-coverage.json")
    await fs.writeFile(output, "previous report")
    jest.spyOn(fs, "rename").mockRejectedValueOnce(new Error("rename failed"))
    await expect(
      publishComponentInventory(componentInventory(createReport(0, []), [], GENERATED_AT), output)
    ).rejects.toThrow("rename failed")
    expect(await fs.readFile(output, "utf8")).toBe("previous report")
    expect(await fs.readdir(directory)).toEqual(["component-coverage.json"])
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})

test("partial checks cannot replace the full public report", () => {
  expect(() => parseCliArguments(["--path", "ace/fixture", "--publish"])).toThrow("full-corpus")
  expect(() => parseCliArguments(["--unknown-option"])).toThrow("Unknown argument")
})

test("the reviewed policy widget omission remains visible with its explicit exception", async () => {
  const findings = await checkPath("ace/guides/policy-manager/manage-policies")
  const widget = findings.find((finding) => finding.component === "PolicyInstanceBuilder")
  expect(widget).toMatchObject({
    status: "unsupported",
    outputs: ["markdown", "txt"],
    exception: { reason: expect.stringContaining("Interactive builder intentionally omitted") },
  })
  expect(blockingFindings("focused", widget ? [widget] : [])).toEqual([])
  expect(findings.some((finding) => finding.component === "MethodTabs" && finding.status !== "present")).toBe(false)
})
