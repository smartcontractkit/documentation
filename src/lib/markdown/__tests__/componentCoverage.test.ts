import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { unified } from "unified"
import { transformMarkdown } from "../transformMarkdown.js"
import { renderLlmsPageMarkdown } from "../llms.js"
import {
  createComponentCoverageCollector,
  parseComponentCoverageBaseline,
  writeComponentCoverageReport,
} from "../componentCoverage.js"
import type { DroppedComponent } from "../types.js"

const PAGE = path.resolve("src/content/cre/fixture.mdx")
const SECOND_PAGE = path.resolve("src/content/cre/second.mdx")
const options = { baseline: {}, generatedAt: "2026-10-14T06:00:00.000Z" }

afterEach(() => {
  jest.restoreAllMocks()
})

describe("drop observation", () => {
  test("measures text, inline code, and fenced code without changing Markdown", async () => {
    const source = "Before.\n\n<Unknown>\n\nLost `inline`.\n\n```ts\nlostCode()\n```\n\n</Unknown>\n\nAfter."
    const drops: DroppedComponent[] = []
    const plain = await transformMarkdown(source, PAGE)
    const observed = await transformMarkdown(source, PAGE, { onDropComponent: (drop) => drops.push(drop) })
    expect(observed).toBe(plain)
    expect(observed).not.toContain("lostCode")
    expect(drops).toEqual([{ name: "Unknown", approxChars: 22 }])
    expect(JSON.stringify(drops)).not.toContain("lostCode")
  })

  test("reports empty flow and inline drops, and only the executed parent drop", async () => {
    const drops: DroppedComponent[] = []
    await transformMarkdown(
      "Before <Inline /> after.\n\n<Flow />\n\n<Outer>\n\n<Inner>Lost text</Inner>\n\n</Outer>",
      PAGE,
      {
        onDropComponent: (drop) => drops.push(drop),
      }
    )
    expect(drops).toEqual([
      { name: "Inline", approxChars: 0 },
      { name: "Flow", approxChars: 0 },
      { name: "Outer", approxChars: 9 },
    ])
  })

  test("handled components and code literals are not reported", async () => {
    const sink = jest.fn()
    await transformMarkdown("<Aside>Kept</Aside>\n\n```mdx\n<Unknown />\n```", PAGE, { onDropComponent: sink })
    expect(sink).not.toHaveBeenCalled()
  })

  test("a throwing observer neither changes output nor triggers a retry", async () => {
    const source = "<Unknown>Lost</Unknown>\n\nKept"
    const plain = await renderLlmsPageMarkdown(source, PAGE, "cre")
    const sink = jest.fn(() => {
      throw new Error("observer failed")
    })
    const observed = await renderLlmsPageMarkdown(source, PAGE, "cre", undefined, { onPageRendered: sink })
    expect(observed).toEqual(plain)
    expect(observed.transformMode).toBe("normal")
    expect(sink).toHaveBeenCalledTimes(1)
    const dropSink = jest.fn(() => {
      throw new Error("drop observer failed")
    })
    expect(await transformMarkdown(source, PAGE, { onDropComponent: dropSink })).toBe(
      await transformMarkdown(source, PAGE)
    )
    expect(dropSink).toHaveBeenCalledTimes(1)
  })

  test("discards failed-attempt drops and reports the successful retry once", async () => {
    jest.spyOn(Object.getPrototypeOf(unified()), "stringify").mockImplementationOnce(() => {
      throw new Error("serialization failed after projection")
    })
    const sink = jest.fn()
    const rendered = await renderLlmsPageMarkdown("<Unknown>Lost</Unknown>\n\nKept", PAGE, "cre", undefined, {
      onPageRendered: sink,
    })
    expect(rendered.transformMode).toBe("sanitized")
    expect(sink).toHaveBeenCalledTimes(1)
    expect(sink).toHaveBeenCalledWith(PAGE, "sanitized", [{ name: "Unknown", approxChars: 4 }])
  })

  test("emits no phantom drops when both AST attempts fail", async () => {
    jest.spyOn(Object.getPrototypeOf(unified()), "stringify").mockImplementation(() => {
      throw new Error("serialization failed after projection")
    })
    const sink = jest.fn()
    const rendered = await renderLlmsPageMarkdown("<Unknown>Lost</Unknown>\n\nKept", PAGE, "cre", undefined, {
      onPageRendered: sink,
    })
    expect(rendered.transformMode).toBe("fallback")
    expect(sink).toHaveBeenCalledTimes(1)
    expect(sink).toHaveBeenCalledWith(PAGE, "fallback", [])
  })
})

describe("component coverage aggregation", () => {
  test("keeps separate maxima of occurrences and characters between Go/TS renders", () => {
    const collector = createComponentCoverageCollector()
    collector.observers.onPageRendered?.(PAGE, "normal", [
      { name: "Widget", approxChars: 2 },
      { name: "Widget", approxChars: 3 },
    ])
    collector.observers.onPageRendered?.(PAGE, "sanitized", [{ name: "Widget", approxChars: 20 }])
    collector.observers.onPageRendered?.(SECOND_PAGE, "normal", [{ name: "Widget", approxChars: 4 }])
    const report = collector.report(options)
    expect(report.components).toEqual([
      { name: "Widget", pageCount: 2, instances: 3, approxChars: 24, pages: ["cre/fixture.mdx", "cre/second.mdx"] },
    ])
    expect(report.pagesProcessed).toBe(2)
    expect(report.transformModes).toMatchObject({ normal: 2, sanitized: 1 })
  })

  test("repeated source components are counted once across actual Go/TS renders", async () => {
    const collector = createComponentCoverageCollector()
    for (const language of ["go", "ts"]) {
      await renderLlmsPageMarkdown(
        "<Unknown>First</Unknown>\n\n<Unknown>Second</Unknown>",
        PAGE,
        "cre",
        language,
        collector.observers
      )
    }
    const report = collector.report(options)
    expect(report.components[0]).toMatchObject({ pageCount: 1, instances: 2, approxChars: 11 })
    expect(report.pagesProcessed).toBe(1)
    expect(report.transformModes.normal).toBe(1)
  })

  test("reports names outside a justified baseline", () => {
    const baseline = parseComponentCoverageBaseline({ Existing: "Reviewed interactive-only content" })
    const collector = createComponentCoverageCollector()
    collector.observers.onPageRendered?.(PAGE, "normal", [
      { name: "Existing", approxChars: 0 },
      { name: "New", approxChars: 0 },
    ])
    expect(collector.report({ ...options, baseline }).newSinceBaseline).toEqual(["New"])
    expect(parseComponentCoverageBaseline({})).toEqual({})
    for (const invalid of [[], null, { "": "reason" }, { Existing: "" }, { Existing: 1 }]) {
      expect(() => parseComponentCoverageBaseline(invalid)).toThrow()
    }
  })

  test("a failed atomic replacement preserves the previous public report and cleans up the temporary file", async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "component-coverage-write-"))
    try {
      const output = path.join(directory, "component-coverage.json")
      await fs.writeFile(output, "previous public report")
      jest.spyOn(fs, "rename").mockRejectedValueOnce(new Error("rename failed"))
      await expect(
        writeComponentCoverageReport(createComponentCoverageCollector().report(options), output)
      ).rejects.toThrow("rename failed")
      expect(await fs.readFile(output, "utf8")).toBe("previous public report")
      expect(await fs.readdir(directory)).toEqual(["component-coverage.json"])
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })

  test("sorts by affected pages then name and writes deterministic data", async () => {
    const entries = [
      {
        page: PAGE,
        drops: [
          { name: "Zeta", approxChars: 1 },
          { name: "Alpha", approxChars: 0 },
          { name: "Big", approxChars: 999 },
        ],
      },
      {
        page: SECOND_PAGE,
        drops: [
          { name: "Zeta", approxChars: 0 },
          { name: "Alpha", approxChars: 0 },
        ],
      },
    ]
    const reports = [entries, [...entries].reverse()].map((ordered) => {
      const collector = createComponentCoverageCollector()
      for (const { page, drops } of ordered) collector.observers.onPageRendered?.(page, "normal", drops)
      return collector.report(options)
    })
    expect(reports[0]).toEqual(reports[1])
    expect(reports[0].components.map(({ name }) => name)).toEqual(["Alpha", "Zeta", "Big"])
    expect(reports[0].generatedAt).toBe(options.generatedAt)
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "component-coverage-"))
    try {
      const output = path.join(directory, "report.json")
      await writeComponentCoverageReport(reports[0], output)
      expect(await fs.readFile(output, "utf8")).toBe(JSON.stringify(reports[1], null, 2) + "\n")
    } finally {
      await fs.rm(directory, { recursive: true, force: true })
    }
  })
})
