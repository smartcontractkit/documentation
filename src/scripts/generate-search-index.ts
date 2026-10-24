#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { parse, type Expression } from "acorn"
import { glob } from "tinyglobby"
import type { MarkdownHeading } from "astro"
import type { Plugin, PluginOption } from "vite"
import { canonicalizeCcipUrlPath } from "../lib/ccip/contentPathMapping.js"
import { isSunsetContentFile } from "../config/sunset.js"
import { splitTextByHeadings } from "./split-text-by-headings.js"

type StaticValue = string | number | boolean | null | undefined | StaticValue[] | { [key: string]: StaticValue }
type Frontmatter = Record<string, StaticValue>

export type SearchPage = {
  frontmatter: Frontmatter
  headings: MarkdownHeading[]
  file: string
  url?: string
}

type SearchEntry = {
  title: StaticValue
  headings: MarkdownHeading[]
  url: string | undefined
  section: StaticValue
  description: StaticValue
  content: string
}

export type SearchPageCompiler = (source: string, file: string) => Promise<SearchPage>

function isRecord(value: StaticValue): value is Frontmatter {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Read only literal metadata exports; never evaluate MDX or load its component imports. */
function staticValue(node: Expression): StaticValue {
  if (node.type === "Literal" && !node.regex && !node.bigint) return node.value as StaticValue
  if (node.type === "Identifier" && node.name === "undefined") return undefined
  if (node.type === "UnaryExpression" && node.operator === "-" && node.argument.type === "Literal") {
    if (typeof node.argument.value === "number") return -node.argument.value
  }
  if (node.type === "ArrayExpression") {
    return node.elements.map((element) => {
      if (!element || element.type === "SpreadElement") throw new Error("Non-literal array in MDX metadata")
      return staticValue(element)
    })
  }
  if (node.type === "ObjectExpression") {
    return Object.fromEntries(
      node.properties.map((property) => {
        if (property.type !== "Property" || property.computed || property.method || property.kind !== "init") {
          throw new Error("Non-literal object in MDX metadata")
        }
        const key =
          property.key.type === "Identifier"
            ? property.key.name
            : property.key.type === "Literal"
              ? String(property.key.value)
              : undefined
        if (key === undefined) throw new Error("Non-literal key in MDX metadata")
        return [key, staticValue(property.value as Expression)]
      })
    )
  }
  throw new Error(`Non-literal ${node.type} in MDX metadata`)
}

export function readSearchPageExports(code: string): SearchPage {
  const program = parse(code, { ecmaVersion: "latest", sourceType: "module" })
  const values = new Map<string, StaticValue>()
  for (const statement of program.body) {
    if (statement.type !== "ExportNamedDeclaration") continue
    const declaration = statement.declaration
    if (declaration?.type === "VariableDeclaration") {
      for (const variable of declaration.declarations) {
        if (
          variable.id.type === "Identifier" &&
          ["frontmatter", "file", "url"].includes(variable.id.name) &&
          variable.init
        ) {
          values.set(variable.id.name, staticValue(variable.init))
        }
      }
    } else if (declaration?.type === "FunctionDeclaration" && declaration.id?.name === "getHeadings") {
      const body = declaration.body.body
      if (body.length !== 1 || body[0].type !== "ReturnStatement" || !body[0].argument) {
        throw new Error("Expected a literal getHeadings export from the Astro MDX compiler")
      }
      values.set("headings", staticValue(body[0].argument))
    }
  }
  const frontmatter = values.get("frontmatter")
  const headings = values.get("headings")
  const file = values.get("file")
  const url = values.get("url")
  if (!isRecord(frontmatter) || !Array.isArray(headings) || typeof file !== "string" || !values.has("url")) {
    throw new Error("Missing search metadata exports from the Astro MDX compiler")
  }
  if (url !== undefined && typeof url !== "string") throw new Error("Expected a string MDX URL")
  return { frontmatter, headings: headings as unknown as MarkdownHeading[], file, url }
}

async function flattenPlugins(options: PluginOption[]): Promise<Plugin[]> {
  const result: Plugin[] = []
  for (const option of options) {
    const plugin = await option
    if (Array.isArray(plugin)) result.push(...(await flattenPlugins(plugin)))
    else if (plugin) result.push(plugin)
  }
  return result
}

/** Reuse the app's resolved Astro/MDX hooks, including its Markdown plugins and URL exports. */
export async function createSearchPageCompiler(root: string): Promise<SearchPageCompiler> {
  const { getViteConfig } = await import("astro/config")
  const config = await getViteConfig({}, { root, logLevel: "error" })({ command: "build", mode: "production" })
  const plugins = await flattenPlugins(config.plugins ?? [])
  const transforms = ["@mdx-js/rollup", "@astrojs/mdx-postprocess"].map((name) => {
    const plugin = plugins.find((plugin) => plugin.name === name)
    if (!plugin?.transform) throw new Error(`Configured MDX compiler hook not found: ${name}`)
    return typeof plugin.transform === "function" ? plugin.transform : plugin.transform.handler
  })
  return async (source, file) => {
    let code = source
    for (const transform of transforms) {
      // These MDX compilation hooks do not resolve or execute imported components.
      // Vite's environment API: MDX post-processing reads `this.environment.name` to compile for the server
      const context = { environment: { name: "ssr" } } as unknown as ThisParameterType<typeof transform>
      const result = await transform.call(context, code, file, { ssr: true })
      if (typeof result === "string") code = result
      else if (result) code = result.code
    }
    return readSearchPageExports(code)
  }
}

export function createSearchEntries(page: SearchPage, source: string): SearchEntry[] {
  const { title, section, metadata } = page.frontmatter
  if (page.frontmatter.draft || isSunsetContentFile(page.file) || (isRecord(metadata) && metadata.noindex)) return []
  let url = page.url?.replace("src/content", "").replace(".mdx", "")
  if (url) url = canonicalizeCcipUrlPath(url)
  return splitTextByHeadings(source).map((content) => ({
    title,
    headings: page.headings,
    url,
    section,
    description: isRecord(metadata) ? (metadata.description ?? undefined) : undefined,
    content,
  }))
}

export async function generateSearchIndex(
  options: {
    root?: string
    output?: string
    compile?: SearchPageCompiler
  } = {}
): Promise<{ pages: number; entries: number; bytes: number }> {
  const root = path.resolve(options.root ?? process.cwd())
  const output = path.resolve(options.output ?? path.join(root, "public/search-index.json"))
  const compile = options.compile ?? (await createSearchPageCompiler(root))
  // Match Vite's import.meta.glob discovery and ordering used by the former Astro page.
  const files = (
    await glob("src/content/**/*.mdx", {
      cwd: root,
      absolute: true,
      dot: false,
      expandDirectories: false,
      ignore: ["**/node_modules/**"],
    })
  ).sort()
  const index: SearchEntry[] = []
  let pages = 0
  for (const file of files) {
    const source = await fs.readFile(file, "utf8")
    const page = await compile(source, file)
    const entries = createSearchEntries(page, source)
    if (entries.length > 0) pages++
    index.push(...entries)
  }
  const document = JSON.stringify({ index }, null, 2)
  await fs.mkdir(path.dirname(output), { recursive: true })
  const temporary = `${output}.${process.pid}.tmp`
  try {
    await fs.writeFile(temporary, document)
    await fs.rename(temporary, output)
  } finally {
    await fs.rm(temporary, { force: true })
  }
  return { pages, entries: index.length, bytes: Buffer.byteLength(document) }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { output: { type: "string" } } })
  const start = performance.now()
  generateSearchIndex({ output: values.output })
    .then((stats) => {
      const peakMiB = (process.resourceUsage().maxRSS / 1024).toFixed(0)
      console.log(
        `[search-index] ${stats.entries} fragments from ${stats.pages} pages → ${values.output ?? "public/search-index.json"} ` +
          `(${(stats.bytes / 1_000_000).toFixed(1)} MB, ${((performance.now() - start) / 1000).toFixed(1)}s, ` +
          `Node peak RSS ${peakMiB} MiB)`
      )
    })
    .catch((error: unknown) => {
      console.error("[search-index] Generation failed:", error)
      process.exitCode = 1
    })
}
