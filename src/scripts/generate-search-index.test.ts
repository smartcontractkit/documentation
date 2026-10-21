import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { describe, expect, test } from "@jest/globals"
import {
  createSearchEntries,
  generateSearchIndex,
  readSearchPageExports,
  type SearchPage,
} from "./generate-search-index.js"

const headings = [
  { depth: 2, slug: "first", text: "First" },
  { depth: 3, slug: "second", text: "Second" },
]
const page: SearchPage = {
  frontmatter: { title: "Example", section: "ccip", metadata: { description: "Summary" } },
  headings,
  file: "/repo/src/content/ccip/v2/example.mdx",
  url: "src/content/ccip/v2/example.mdx",
}

describe("search index metadata", () => {
  test("reads compiler metadata without executing component imports or module code", () => {
    const compiled = `
      import Component from "./a-component-that-does-not-exist.js";
      throw new Error("This module must not be evaluated");
      export const frontmatter = ${JSON.stringify(page.frontmatter)};
      export function getHeadings() { return ${JSON.stringify(headings)}; }
      export const file = ${JSON.stringify(page.file)};
      export const url = ${JSON.stringify(page.url)};
      export default function Content() { return Component(); }
    `
    expect(readSearchPageExports(compiled)).toEqual(page)
  })

  test("fails on dynamic metadata instead of executing it or producing a partial index", () => {
    expect(() =>
      readSearchPageExports(`
        export const frontmatter = loadFrontmatter();
        export function getHeadings() { return []; }
        export const file = "example.mdx";
        export const url = "example";
      `)
    ).toThrow("Non-literal CallExpression")
    expect(() => readSearchPageExports("export default function Content() {}")).toThrow("Missing search metadata")
  })
})

describe("existing search record contract", () => {
  test("preserves the complete headings on each raw fragment, field order, and canonical CCIP URL", () => {
    const source = "---\ntitle: Example\n---\n\nIntro\n\n## First\nBody\n\n### Second\nMore"
    expect(createSearchEntries(page, source)).toEqual(
      ["---\ntitle: Example\n---\n\nIntro", "## First\nBody", "### Second\nMore"].map((content) => ({
        title: "Example",
        headings,
        url: "/ccip/example",
        section: "ccip",
        description: "Summary",
        content,
      }))
    )
    expect(Object.keys(createSearchEntries(page, source)[0])).toEqual([
      "title",
      "headings",
      "url",
      "section",
      "description",
      "content",
    ])
  })

  test("keeps the old empty preamble and undefined-field JSON behavior", () => {
    const entries = createSearchEntries({ ...page, frontmatter: {}, url: undefined }, "## First\nBody")
    expect(entries.map((entry) => entry.content)).toEqual(["", "## First\nBody"])
    expect(JSON.parse(JSON.stringify(entries[0]))).toEqual({ headings, content: "" })
  })

  test("omits a null description exactly like the old generator", () => {
    const entries = createSearchEntries({ ...page, frontmatter: { metadata: { description: null } } }, "Content")
    expect(JSON.parse(JSON.stringify(entries[0]))).toEqual({ headings, url: "/ccip/example", content: "Content" })
  })

  test.each([
    { ...page, frontmatter: { ...page.frontmatter, draft: true } },
    { ...page, frontmatter: { ...page.frontmatter, metadata: { noindex: true } } },
    { ...page, file: "/repo/src/content/chainlink-functions/example.mdx" },
    { ...page, file: "/repo/src/content/quickstarts/automation-station.mdx" },
  ])("preserves draft, noindex, and sunset exclusions", (excluded) => {
    expect(createSearchEntries(excluded, "Content")).toEqual([])
  })
})

describe("standalone search index generation", () => {
  test("matches MDX discovery and sorting and writes the existing JSON envelope", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "search-index-test-"))
    try {
      const directory = path.join(root, "src/content/ccip/v2")
      await fs.mkdir(directory, { recursive: true })
      for (const name of ["b.mdx", "a.mdx", ".hidden.mdx", "ignored.md"]) {
        await fs.writeFile(path.join(directory, name), `Content ${name}`)
      }
      const visited: string[] = []
      const output = path.join(root, "public/search-index.json")
      const stats = await generateSearchIndex({
        root,
        output,
        compile: async (_source, file) => {
          const name = path.basename(file)
          visited.push(name)
          return { ...page, file, url: `src/content/ccip/v2/${name}` }
        },
      })
      const expected = {
        index: ["a.mdx", "b.mdx"].map((name) => ({
          title: "Example",
          headings,
          url: `/ccip/${name.replace(".mdx", "")}`,
          section: "ccip",
          description: "Summary",
          content: `Content ${name}`,
        })),
      }
      expect(visited).toEqual(["a.mdx", "b.mdx"])
      expect(await fs.readFile(output, "utf8")).toBe(JSON.stringify(expected, null, 2))
      expect(stats).toEqual({ pages: 2, entries: 2, bytes: Buffer.byteLength(JSON.stringify(expected, null, 2)) })
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  test("leaves the last complete index intact if a source cannot be compiled", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "search-index-failure-"))
    try {
      await fs.mkdir(path.join(root, "src/content"), { recursive: true })
      await fs.mkdir(path.join(root, "public"))
      await fs.writeFile(path.join(root, "src/content/example.mdx"), "Source")
      const output = path.join(root, "public/search-index.json")
      const previous = '{"index":[{"title":"Previous complete index"}]}'
      await fs.writeFile(output, previous)
      await expect(
        generateSearchIndex({
          root,
          output,
          compile: async () => {
            throw new Error("Invalid MDX")
          },
        })
      ).rejects.toThrow("Invalid MDX")
      expect(await fs.readFile(output, "utf8")).toBe(previous)
      expect(await fs.readdir(path.dirname(output))).toEqual(["search-index.json"])
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
