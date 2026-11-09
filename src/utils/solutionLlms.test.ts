import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import type { APIContext, GetStaticPathsResult } from "astro"
import type { CollectionEntry } from "astro:content"
import { beforeEach, describe, expect, jest, test } from "@jest/globals"
import { ALL_REGISTERED_SOLUTIONS, SOLUTIONS, toPagePath } from "../config/solutions/index.ts"
import { crossChainVaultAdapter } from "../config/solutions/cross-chain-vault-adapter.ts"
import { demoSinglePage } from "../config/solutions/demo-single-page.ts"
import { extractFrontmatter } from "../lib/markdown/utils.js"
import { buildMarkdownArtifact } from "../lib/markdown/buildMarkdownArtifact.js"
import { cleanText, unescapeMarkdown } from "../lib/markdown/formatters.js"
import { SOLUTION_DISCLAIMER } from "../config/solutions/disclaimer.ts"
import { blockingFindings, compareSourceToArtifact } from "../scripts/check-markdown-fidelity.js"
import { generateSolutionLlmsFiles } from "../scripts/generate-llms.js"
import { solutionLlmsOutputPath } from "../lib/markdown/solutionLlms.js"

type SolutionEntry = CollectionEntry<"solutions">
let entries: SolutionEntry[] = []

// Register Astro's virtual module with both Jest's resolver and its ESM loader.
jest.mock("astro:content", () => ({ getCollection: async () => entries }), { virtual: true })
jest.unstable_mockModule("astro:content", () => ({ getCollection: async () => entries }), { virtual: true })
const { GET, getStaticPaths } = await import("../pages/solutions/[slug]/llms-full.txt.js")

async function readEntries(
  slug: string,
  directory = path.resolve("src/content/solutions", slug)
): Promise<SolutionEntry[]> {
  const files = await fs.readdir(directory, { withFileTypes: true })
  const result: SolutionEntry[] = []
  for (const file of files) {
    const filePath = path.join(directory, file.name)
    if (file.isDirectory()) {
      result.push(...(await readEntries(slug, filePath)))
    } else if (/\.mdx?$/.test(file.name) && file.name !== "README.md") {
      const raw = await fs.readFile(filePath, "utf-8")
      const { fmTitle, body } = extractFrontmatter(raw)
      if (!fmTitle) throw new Error(`Missing fixture title: ${filePath}`)
      result.push({
        id: path.relative(path.resolve("src/content/solutions"), filePath).replace(/\.mdx?$/, ""),
        collection: "solutions",
        filePath,
        body,
        data: { title: fmTitle },
      })
    }
  }
  return result
}

const fixtures = (await Promise.all(ALL_REGISTERED_SOLUTIONS.map((solution) => readEntries(solution.slug)))).flat()
// These integration checks convert a complete solution, including imported code samples.
const CORPUS_TEST_TIMEOUT = 30_000

beforeEach(() => {
  // Reverse filesystem order so the endpoint must use the manifest's navigation order.
  entries = [...fixtures].reverse()
})

async function getPaths(): Promise<GetStaticPathsResult> {
  return getStaticPaths({} as Parameters<typeof getStaticPaths>[0])
}

async function getResponse(props: APIContext["props"]): Promise<Response> {
  const response = await GET({ props } as APIContext)
  if (!(response instanceof Response)) throw new Error("Expected a TXT response")
  return response
}

describe("solution llms-full.txt", () => {
  test("creates a route for every published solution and keeps hidden fixtures private", async () => {
    const paths = await getPaths()
    expect(paths.map((route) => route.params.slug).sort()).toEqual(SOLUTIONS.map((solution) => solution.slug).sort())
    for (const solution of ALL_REGISTERED_SOLUTIONS.filter((solution) => solution.hidden)) {
      expect(paths.some((route) => route.params.slug === solution.slug)).toBe(false)
    }
  })

  test(
    "includes every Cross-Chain Vault Adapter page once, in navigation order, with code and callouts",
    async () => {
      const paths = await getPaths()
      const route = paths.find((route) => route.params.slug === crossChainVaultAdapter.slug)
      if (!route) throw new Error("Missing Cross-Chain Vault Adapter route")
      const response = await getResponse(route.props ?? {})
      const document = await response.text()

      expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8")
      const sourceUrls = [...document.matchAll(/^Source: (https:\/\/docs\.chain\.link\/solutions\/\S+)$/gm)].map(
        (match) => match[1]
      )
      expect(sourceUrls).toEqual(
        (crossChainVaultAdapter.nav ?? [])
          .flatMap((group) => group.pages)
          .map((pageId) => `https://docs.chain.link${toPagePath(crossChainVaultAdapter.slug, pageId)}`)
      )
      expect(new Set(sourceUrls).size).toBe(sourceUrls.length)
      expect(document).toContain("What the adapter does")
      expect(document).toContain("```solidity")
      expect(document).toContain("Message payload")
      expect(document).toContain("/images/solutions/cross-chain-vault-adapter/at-a-glance.svg")
      expect(document).not.toMatch(/^import /m)
      expect(document).not.toContain("<Aside")
      expect(document).not.toContain("<ClickToZoom")
      expect(document).not.toContain("Demo: Single Page Solution")
    },
    CORPUS_TEST_TIMEOUT
  )

  test("generates a single-page document without requiring navigation", async () => {
    // Publish the fixture in memory to exercise automatic route discovery too.
    const singlePageSolution = { ...demoSinglePage, hidden: false }
    SOLUTIONS.push(singlePageSolution)
    try {
      const route = (await getPaths()).find((route) => route.params.slug === singlePageSolution.slug)
      if (!route) throw new Error("Missing single-page solution route")
      const response = await getResponse(route.props ?? {})
      const document = await response.text()
      expect(document.match(/^Source: /gm)).toHaveLength(1)
      expect(document).toContain(`Source: https://docs.chain.link/solutions/${demoSinglePage.slug}`)
      expect(document).toContain(`# ${demoSinglePage.title}`)
      expect(document.match(/^## Disclaimer$/gm)).toHaveLength(1)
      expect(cleanText(document)).toContain(cleanText(SOLUTION_DISCLAIMER.beforeTerms))
      expect(document).toContain(`[${SOLUTION_DISCLAIMER.termsLabel}](${SOLUTION_DISCLAIMER.termsUrl})`)
      expect(document).not.toContain("Source: https://docs.chain.link/solutions/cross-chain-vault-adapter")
    } finally {
      SOLUTIONS.splice(SOLUTIONS.indexOf(singlePageSolution), 1)
    }
  })

  test("fails generation when a page referenced by navigation is missing", async () => {
    entries = entries.filter((entry) => entry.id !== `${crossChainVaultAdapter.slug}/reference/factory-contract`)
    await expect(getPaths()).rejects.toThrow('nav references "reference/factory-contract" but no page exists')
  })

  test.each(SOLUTIONS)(
    "$title: checks every TXT page against its source and its Markdown export",
    async (solution) => {
      const route = (await getPaths()).find((route) => route.params.slug === solution.slug)
      if (!route) throw new Error(`Missing solution route: ${solution.slug}`)
      const document = await (await getResponse(route.props ?? {})).text()
      // The standalone CLI reads files; Astro reads the collection. Their complete TXT must still match.
      const directory = await fs.mkdtemp(path.join(os.tmpdir(), "solution-llms-parity-"))
      try {
        await generateSolutionLlmsFiles([solution], directory)
        expect(await fs.readFile(solutionLlmsOutputPath(solution.slug, directory), "utf8")).toBe(document)
        expect(await fs.readFile(solutionLlmsOutputPath(solution.slug), "utf8")).toBe(document)
      } finally {
        await fs.rm(directory, { recursive: true, force: true })
      }
      const headers = [...document.matchAll(/^# [^\n]+\nSource: https:\/\/docs\.chain\.link\/(solutions\/[^\n]+)\n/gm)]
      const pages = entries.filter((entry) => entry.id.startsWith(`${solution.slug}/`) || entry.id === solution.slug)
      expect(headers).toHaveLength(pages.length)
      const disclaimer =
        SOLUTION_DISCLAIMER.beforeTerms +
        ` [${SOLUTION_DISCLAIMER.termsLabel}](${SOLUTION_DISCLAIMER.termsUrl})` +
        SOLUTION_DISCLAIMER.afterTerms

      for (let index = 0; index < headers.length; index++) {
        const requestPath = headers[index][1]
        const page = document.slice(headers[index].index, headers[index + 1]?.index ?? document.length).trim()
        const artifact = await buildMarkdownArtifact(requestPath)
        if (!artifact?.sourcePath) throw new Error(`Missing Markdown source: ${requestPath}`)
        expect(artifact.transformMode).toBe("normal")
        const sourcePath = path.resolve("src/content", artifact.sourcePath)
        const raw = await fs.readFile(sourcePath, "utf8")
        const findings = compareSourceToArtifact(requestPath, sourcePath, raw, {
          ...artifact,
          sourcePath,
          markdown: page,
        })
        expect(blockingFindings("focused", findings)).toEqual([])
        const markdownBody = artifact.markdown.split(
          "> For the complete documentation index, see [llms.txt](/llms.txt).\n"
        )[1]
        expect(page).toContain(unescapeMarkdown(markdownBody).trim())
        expect(page.match(/^## Disclaimer$/gm)).toHaveLength(1)
        expect(cleanText(page)).toContain(cleanText(disclaimer))
        expect(page).toContain(`[${SOLUTION_DISCLAIMER.termsLabel}](${SOLUTION_DISCLAIMER.termsUrl})`)
      }
      expect(document.match(/^## Disclaimer$/gm)).toHaveLength(pages.length)
      expect(document).toContain(solution.description)
      if (solution.repoUrl) expect(document).toContain(`[View on GitHub](${solution.repoUrl})`)
    },
    CORPUS_TEST_TIMEOUT
  )
})
