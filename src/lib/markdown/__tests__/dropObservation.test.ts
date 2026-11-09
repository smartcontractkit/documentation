import path from "node:path"
import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { unified } from "unified"
import { transformMarkdown } from "../transformMarkdown.js"
import { transformPageBodyToMarkdown } from "../buildMarkdownArtifact.js"
import { renderLlmsPageMarkdown } from "../llms.js"
import type { DroppedComponent } from "../types.js"

const PAGE = path.resolve("src/content/cre/fixture.mdx")

afterEach(() => {
  jest.restoreAllMocks()
})

describe("actual transform drop observation", () => {
  test("observes removed subtrees without changing Markdown or retaining their content", async () => {
    const source = "Before.\n\n<Unknown>\n\nLost `inline`.\n\n```ts\nlostCode()\n```\n\n</Unknown>\n\nAfter."
    const drops: DroppedComponent[] = []
    const plain = await transformMarkdown(source, PAGE)
    const observed = await transformMarkdown(source, PAGE, { onDropComponent: (drop) => drops.push(drop) })
    expect(observed).toBe(plain)
    expect(observed).not.toContain("lostCode")
    expect(drops).toEqual([{ name: "Unknown" }])
  })

  test("reports flow and inline removals, including only a removed parent's actual drop", async () => {
    const drops: DroppedComponent[] = []
    await transformMarkdown(
      "Before <Inline /> after.\n\n<Flow />\n\n<Outer>\n\n<Inner>Lost</Inner>\n\n</Outer>",
      PAGE,
      { onDropComponent: (drop) => drops.push(drop) }
    )
    expect(drops.map((drop) => drop.name)).toEqual(["Inline", "Flow", "Outer"])
  })

  test("does not report handled components or JSX inside a code example", async () => {
    const sink = jest.fn()
    await transformMarkdown("<Aside>Kept</Aside>\n\n```mdx\n<Unknown />\n```", PAGE, { onDropComponent: sink })
    expect(sink).not.toHaveBeenCalled()
  })

  test("an observer failure cannot change Markdown or TXT or trigger a retry", async () => {
    const source = "<Unknown>Lost</Unknown>\n\nKept"
    const sink = jest.fn(() => {
      throw new Error("observer failed")
    })
    expect(await transformMarkdown(source, PAGE, { onDropComponent: sink })).toBe(await transformMarkdown(source, PAGE))
    expect(await renderLlmsPageMarkdown(source, PAGE, "cre", undefined, { onDropComponent: sink })).toEqual(
      await renderLlmsPageMarkdown(source, PAGE, "cre")
    )
    expect(sink).toHaveBeenCalledTimes(2)
  })

  test.each([false, true])("discards failed-attempt drops (both attempts fail: %s)", async (bothFail) => {
    const spy = jest.spyOn(Object.getPrototypeOf(unified()), "stringify")
    const fail = () => {
      throw new Error("serialization failed after projection")
    }
    if (bothFail) spy.mockImplementation(fail)
    else spy.mockImplementationOnce(fail)
    const drops: DroppedComponent[] = []
    const rendered = await transformPageBodyToMarkdown("<Unknown>Lost</Unknown>\n\nKept", PAGE, {
      onDropComponent: (drop) => drops.push(drop),
    })
    expect(rendered.transformMode).toBe(bothFail ? "fallback" : "sanitized")
    expect(drops).toEqual(bothFail ? [] : [{ name: "Unknown" }])
  })
})
