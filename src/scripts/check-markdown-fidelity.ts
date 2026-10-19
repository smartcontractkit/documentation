import fs from "node:fs/promises"
import fsSync from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { unified } from "unified"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import { SKIP, visit } from "unist-util-visit"
import type { Node, Parent } from "unist"
import { buildMarkdownArtifact, normalizeMarkdownPath } from "@lib/markdown/buildMarkdownArtifact.js"
import {
  readStaticDefaultImports,
  readStaticJsxSelectorConditions,
  stripHighlighterComments,
} from "@lib/markdown/sourceScanners.js"
import type { DroppedComponent, MarkdownArtifact } from "@lib/markdown/types.js"
import { renderLlmsPageMarkdown } from "../lib/markdown/llms.js"
import { getPageLanguage, extractFrontmatter, shouldIncludeInLanguageFile } from "../lib/markdown/utils.js"
import { LLM_SECTIONS_CONFIG, SUPPORTED_LLM_SECTIONS } from "../config/llms.js"
import { SOLUTIONS } from "../config/solutions/index.ts"
import { markdownFidelityExceptions } from "./markdown-fidelity-exceptions.js"
import { isSunsetDocsPath } from "../config/sunset.js"

const CONTENT_ROOT = path.resolve("src/content")
// One diagnostic for observed drops, missing content, and limits of static verification.
// Source expectations stay independent of the converter.
// The absence of observed drops does not prove fidelity.
// CI writes reports/markdown-fidelity-report.json and keeps known findings visible in the report.
// Weekly, from up-to-date main, run npm run report:markdown-fidelity and open a dedicated
// PR containing only public/reports/component-coverage.json. TXT bundles are never rewritten.
// Refresh known debt after review: npm run check:markdown-fidelity -- --update-baseline.
const DEFAULT_REPORT_PATH = "reports/markdown-fidelity-report.json"
const PUBLIC_REPORT_PATH = "public/reports/component-coverage.json"
const DEFAULT_BASELINE_PATH = fileURLToPath(new URL("./markdown-fidelity-baseline.json", import.meta.url))
const SITE_BASE = "https://docs.chain.link"
const LLMS_DIRECTIVE = "> For the complete documentation index, see [llms.txt](/llms.txt)."

const MARKDOWN_REDIRECT_TARGETS = {
  "ccip/tutorials/cross-chain-tokens": "ccip/tutorials/evm/cross-chain-tokens",
  "chainlink-functions/resources/concepts": "chainlink-functions/resources",
  "cre/getting-started/conclusion": "cre/getting-started",
  "data-streams/getting-started": "data-streams/tutorials/streams-trade/getting-started",
  "data-streams/getting-started-hardhat": "data-streams/tutorials/streams-trade/getting-started-hardhat",
  "data-streams/reference/streams-direct/streams-direct-interface-ws": "data-streams/reference/interface-ws",
  "data-streams/reference/streams-direct/streams-direct-onchain-verification":
    "data-streams/reference/onchain-verification",
} as const

const MARKDOWN_REDIRECT_PATHS = Object.keys(MARKDOWN_REDIRECT_TARGETS)

export type FidelityStatus = "present" | "missing" | "unsupported" | "unverifiable" | "degraded"
export type RunMode = "focused" | "full-corpus"

export interface FidelityException {
  path: string
  occurrence: string
  status: Exclude<FidelityStatus, "present">
  reason: string
  owner: string
  removalCondition: string
}

export interface FidelityFinding {
  path: string
  status: FidelityStatus
  occurrence: string
  sourcePath?: string
  sourceLine: number | null
  sourceText?: string
  lang?: string
  name?: string
  expected?: string
  reason?: string
  exception?: Pick<FidelityException, "reason" | "owner" | "removalCondition">
  servedLine?: number
  servedText?: string
  display?: string
  /** Owning JSX component, when a finding can be attributed to one. */
  component?: string
  /** Omitted for the existing Markdown findings; TXT is checked after its final cleanup. */
  output?: "txt"
  /** Identical Markdown/TXT evidence shares one finding and one baseline identity. */
  outputs?: ("markdown" | "txt")[]
}

export interface ComponentSummary {
  name: string
  /** Lowercase JSX names are HTML elements, kept visible separately from app components. */
  kind: "component" | "html"
  pageCount: number
  pages: string[]
  statuses: Exclude<FidelityStatus, "present">[]
  /** Unique pages per status; a page may appear under more than one status. */
  pagesByStatus: Record<Exclude<FidelityStatus, "present">, number>
}

export interface FidelityReport {
  pathCount: number
  counts: Record<FidelityStatus, number>
  findings: FidelityFinding[]
  components: ComponentSummary[]
}

export interface SourceFact {
  ordinal: number
  kind: "text" | "heading" | "link" | "code" | "anchor" | "image"
  value: string
  url?: string
  depth?: number
  heading?: string
  variant?: string
  line: number
  sourceText: string
  sourcePath?: string
  component?: string
  componentAncestors?: string[]
}

export interface SourceDiagnostic {
  status: "unverifiable"
  ordinal: number
  name: string
  line: number
  sourceText: string
  reason: string
  sourcePath?: string
  component?: string
  componentAncestors?: string[]
}

export interface SourceAnalysis {
  facts: SourceFact[]
  diagnostics: SourceDiagnostic[]
  languages: string[]
}

interface ObservedFact {
  kind: SourceFact["kind"]
  value: string
  url?: string
  depth?: number
  heading?: string
}

interface ObservedAnalysis {
  facts: ObservedFact[]
  residuals: Array<{ name: string; line: number; text: string; reason: string }>
}

type AstRecord = Record<string, unknown>

const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm)
const txtProcessor = unified().use(remarkParse).use(remarkGfm)
const containerElements: Record<string, true> = {
  div: true,
  Fragment: true,
  GitHubCards: true,
  OverviewWrapper: true,
  ol: true,
  li: true,
}
const projectedInlineElements: Record<string, true> = {
  b: true,
  strong: true,
  code: true,
  sub: true,
  span: true,
  br: true,
  nobr: true,
  CopyText: true,
  em: true,
  i: true,
}

const selectorComponents = {
  AnyApiCallout: { astro: "src/features/any-api/common/AnyApiCallout.astro", attribute: "callout" },
  FeedsCommonCallout: { astro: "src/features/feeds/callouts/FeedsCommonCallout.astro", attribute: "callout" },
  ResourcesCallout: { astro: "src/features/resources/callouts/ResourcesCallout.astro", attribute: "callout" },
  DataStreams: { astro: "src/features/data-streams/common/DataStreams.astro", attribute: "section" },
  VrfDeprecation: { astro: "src/features/vrf/VrfDeprecation.astro", attribute: "version" },
  CcipCommon: { astro: "src/features/ccip/CcipCommon.astro", attribute: "callout" },
  Common: { astro: "src/features/chainlink-local/Common.astro", attribute: "callout" },
  AceCallout: { astro: "src/features/ace/callouts/AceCallout.astro", attribute: "callout" },
  CrecCommon: { astro: "src/features/crec/common/CrecCommon.astro", attribute: "callout" },
  Vrf2_5Common: { astro: "src/features/vrf/v2-5/Vrf2_5Common.astro", attribute: "callout" },
  Dta: { astro: "src/features/dta/common/Dta.astro", attribute: "section" },
  TokenizedEquityFeeds: {
    astro: "src/features/tokenized-equity-feeds/common/TokenizedEquityFeeds.astro",
    attribute: "section",
  },
  ContentCommon: { astro: "src/features/common/ContentCommon.astro", attribute: "section" },
} as const

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

type GroupedFact<T> = T & { group?: string; rawValue?: string }

function coalesceTextFacts<T extends { kind: SourceFact["kind"]; value: string }>(facts: GroupedFact<T>[]): T[] {
  const coalesced: GroupedFact<T>[] = []
  for (const fact of facts) {
    const previous = coalesced[coalesced.length - 1]
    if (fact.kind === "text" && fact.group && previous?.kind === "text" && previous.group === fact.group) {
      previous.rawValue = `${previous.rawValue ?? previous.value}${fact.rawValue ?? fact.value}`
      previous.value = normalizeText(previous.rawValue)
      continue
    }
    coalesced.push({ ...fact })
  }
  return coalesced.map((fact) => {
    const result = { ...fact }
    delete result.group
    delete result.rawValue
    return result as T
  })
}

function lineText(lines: string[], line: number): string {
  return lines[line - 1] ?? ""
}

function maskFrontmatter(source: string): string {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) return source
  const lines = source.split(/(?<=\n)/)
  for (let index = 1; index < lines.length; index += 1) {
    if (/^---\s*(?:\r?\n)?$/.test(lines[index])) {
      return lines.map((line, lineIndex) => (lineIndex <= index ? line.replace(/[^\r\n]/g, " ") : line)).join("")
    }
  }
  return source
}

function nodeLine(node: Node): number {
  return node.position?.start.line ?? 1
}

function childrenOf(node: Node): Node[] {
  return Array.isArray((node as Parent).children) ? (node as Parent).children : []
}

function nodeVisibleText(node: Node): string {
  if (node.type === "text" || node.type === "inlineCode") {
    return String((node as Node & { value?: unknown }).value ?? "")
  }
  return childrenOf(node).map(nodeVisibleText).join("")
}

function expressionFrom(value: unknown): AstRecord | null {
  if (!value || typeof value !== "object") return null
  const data = (value as AstRecord).data
  const estree = data && typeof data === "object" ? (data as AstRecord).estree : undefined
  const body = estree && typeof estree === "object" ? (estree as AstRecord).body : undefined
  const statement = Array.isArray(body) ? body[0] : undefined
  const expression = statement && typeof statement === "object" ? (statement as AstRecord).expression : undefined
  return expression && typeof expression === "object" ? (expression as AstRecord) : null
}
function staticImports(tree: Node): Map<string, string> {
  const imports = new Map<string, string>()
  for (const node of childrenOf(tree)) {
    if (node.type !== "mdxjsEsm") continue
    const data = (node as Node & { data?: AstRecord }).data
    const estree = data?.estree as AstRecord | undefined
    const body = estree?.body
    if (!Array.isArray(body)) continue
    for (const statementValue of body) {
      const statement = statementValue as AstRecord
      const source = statement.source as AstRecord | undefined
      if (
        statement.type !== "ImportDeclaration" ||
        typeof source?.value !== "string" ||
        !Array.isArray(statement.specifiers)
      ) {
        continue
      }
      for (const specifierValue of statement.specifiers) {
        const specifier = specifierValue as AstRecord
        const local = specifier.local as AstRecord | undefined
        if (
          (specifier.type === "ImportDefaultSpecifier" || specifier.type === "ImportSpecifier") &&
          typeof local?.name === "string"
        ) {
          imports.set(local.name, source.value)
        }
      }
    }
  }
  return imports
}

function resolveProjectFile(candidate: string): { absolute: string; relative: string } | null {
  try {
    const root = fsSync.realpathSync(process.cwd())
    const absolute = fsSync.realpathSync(path.resolve(candidate))
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) return null
    if (!fsSync.statSync(absolute).isFile()) return null
    return { absolute, relative: path.relative(process.cwd(), absolute).split(path.sep).join("/") }
  } catch {
    return null
  }
}

function sourceLocation(sourcePath: string | undefined): { absolute: string; relative: string } | null {
  if (!sourcePath) return null
  return resolveProjectFile(path.isAbsolute(sourcePath) ? sourcePath : path.resolve(sourcePath))
}

function expressionAttribute(node: Node, name: string): AstRecord | null {
  const attributes = (node as Node & { attributes?: AstRecord[] }).attributes ?? []
  return expressionFrom(attributes.find((candidate) => candidate.name === name)?.value)
}

function resolveSelectorTarget(
  component: keyof typeof selectorComponents,
  selector: string
): { target?: { absolute: string; relative: string }; reason?: string } {
  const config = selectorComponents[component]
  const astro = resolveProjectFile(config.astro)
  if (!astro) return { reason: `Selector definition ${config.astro} is missing or escapes the project` }
  const source = fsSync.readFileSync(astro.absolute, "utf8")
  const imports = readStaticDefaultImports(source)
  const componentBySelector = readStaticJsxSelectorConditions(source, config.attribute)
  const importedPath = imports.get(componentBySelector.get(selector) ?? "")
  if (!importedPath?.endsWith(".mdx"))
    return { reason: `${component} selector "${selector}" has no static MDX target in ${astro.relative}` }
  const target = resolveProjectFile(path.resolve(path.dirname(astro.absolute), importedPath))
  return target
    ? { target }
    : { reason: `${component} selector "${selector}" target "${importedPath}" is missing or escapes the project` }
}

export function readStaticExpression(node: unknown): { ok: true; value: unknown } | { ok: false; syntax: string } {
  if (!node || typeof node !== "object") return { ok: false, syntax: "missing expression" }
  const expression = node as AstRecord
  const type = String(expression.type ?? "unknown")

  if (type === "Literal") return { ok: true, value: expression.value }

  if (type === "TemplateLiteral") {
    const expressions = expression.expressions
    const quasis = expression.quasis
    if (!Array.isArray(expressions) || expressions.length !== 0 || !Array.isArray(quasis)) {
      return { ok: false, syntax: type }
    }
    return {
      ok: true,
      value: quasis.map((quasi) => String(((quasi as AstRecord).value as AstRecord)?.cooked ?? "")).join(""),
    }
  }

  if (type === "ArrayExpression") {
    if (!Array.isArray(expression.elements)) return { ok: false, syntax: type }
    const values: unknown[] = []
    for (const element of expression.elements) {
      if (!element || (element as AstRecord).type === "SpreadElement") return { ok: false, syntax: "SpreadElement" }
      const result = readStaticExpression(element)
      if (!result.ok) return result
      values.push(result.value)
    }
    return { ok: true, value: values }
  }

  if (type === "ObjectExpression") {
    if (!Array.isArray(expression.properties)) return { ok: false, syntax: type }
    const value: Record<string, unknown> = {}
    for (const propertyValue of expression.properties) {
      const property = propertyValue as AstRecord
      if (property.type !== "Property" || property.computed || property.kind !== "init") {
        return { ok: false, syntax: String(property.type ?? "computed property") }
      }
      const keyNode = property.key as AstRecord
      const key =
        keyNode?.type === "Identifier" ? keyNode.name : keyNode?.type === "Literal" ? keyNode.value : undefined
      if (typeof key !== "string" && typeof key !== "number") return { ok: false, syntax: "non-static key" }
      const result = readStaticExpression(property.value)
      if (!result.ok) return result
      value[String(key)] = result.value
    }
    return { ok: true, value }
  }

  return { ok: false, syntax: type }
}

function staticAttribute(node: Node, name: string): { found: boolean; value?: unknown; syntax?: string } {
  const attributes = (node as Node & { attributes?: AstRecord[] }).attributes ?? []
  const attribute = attributes.find(
    (candidate) => candidate.type !== "mdxJsxExpressionAttribute" && candidate.name === name
  )
  if (!attribute) return { found: false }
  if (typeof attribute.value === "string" || attribute.value == null)
    return { found: true, value: attribute.value ?? true }
  const result = readStaticExpression(expressionFrom(attribute.value))
  return result.ok ? { found: true, value: result.value } : { found: true, syntax: result.syntax }
}

function expressionAttributes(node: Node): Array<{ name: string; syntax: string }> {
  const attributes = (node as Node & { attributes?: AstRecord[] }).attributes ?? []
  const failures: Array<{ name: string; syntax: string }> = []
  for (const attribute of attributes) {
    if (attribute.type === "mdxJsxExpressionAttribute") {
      failures.push({ name: "spread attribute", syntax: "mdxJsxExpressionAttribute" })
      continue
    }
    if (!attribute.value || typeof attribute.value === "string") continue
    const result = readStaticExpression(expressionFrom(attribute.value))
    if (!result.ok) failures.push({ name: String(attribute.name ?? "attribute"), syntax: result.syntax })
  }
  return failures
}

function languageKeys(node: Node): {
  keys: string[]
  codes?: Array<{ key: string; value?: string; identifier?: string }>
  syntax?: string
} {
  const attributes = (node as Node & { attributes?: AstRecord[] }).attributes ?? []
  const attribute = attributes.find((candidate) => candidate.name === "languages")
  const expression = expressionFrom(attribute?.value)
  if (!expression || expression.type !== "ObjectExpression" || !Array.isArray(expression.properties)) {
    return { keys: [], syntax: String(expression?.type ?? "missing languages") }
  }

  const keys: string[] = []
  const codes: Array<{ key: string; value?: string; identifier?: string }> = []
  for (const propertyValue of expression.properties) {
    const property = propertyValue as AstRecord
    const keyNode = property.key as AstRecord
    if (property.type !== "Property" || property.computed || property.kind !== "init") {
      return { keys: [], syntax: String(property.type ?? "computed property") }
    }
    const key = keyNode?.type === "Identifier" ? keyNode.name : keyNode?.type === "Literal" ? keyNode.value : undefined
    if (typeof key !== "string") return { keys: [], syntax: "non-static language key" }

    const value = property.value as AstRecord
    const codeProperty =
      value?.type === "ObjectExpression" && Array.isArray(value.properties)
        ? (value.properties.find((candidate) => {
            const item = candidate as AstRecord
            const candidateKey = item.key as AstRecord
            return (
              item.type === "Property" &&
              !item.computed &&
              item.kind === "init" &&
              (candidateKey?.name === "code" || candidateKey?.value === "code")
            )
          }) as AstRecord | undefined)
        : undefined
    if (!codeProperty) return { keys: [], syntax: "non-static language branch" }
    const codeNode = codeProperty.value as AstRecord
    const staticCode = readStaticExpression(codeNode)
    if (codeNode?.type === "Identifier" && typeof codeNode.name === "string") {
      codes.push({ key, identifier: codeNode.name })
    } else if (staticCode.ok && typeof staticCode.value === "string") {
      codes.push({ key, value: staticCode.value })
    } else {
      return { keys: [], syntax: String(codeNode?.type ?? "non-static code") }
    }
    keys.push(key)
  }
  return { keys: [...new Set(keys)].sort(), codes }
}
type SchemaField = { field: string; type: string; description: string; link?: { label: string; href: string } }

function extractStaticInitializer(source: string, declaration: string): string | null {
  const declarationIndex = source.indexOf(declaration)
  const equalsIndex = declarationIndex < 0 ? -1 : source.indexOf("=", declarationIndex + declaration.length)
  const start = equalsIndex < 0 ? -1 : source.slice(equalsIndex + 1).search(/[[{]/) + equalsIndex + 1
  if (declarationIndex < 0 || equalsIndex < 0 || start <= equalsIndex) return null
  const stack: string[] = []
  let quote = ""
  let escaped = false
  for (let index = start; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (character === "\\") escaped = true
      else if (character === quote) quote = ""
      continue
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character
      continue
    }
    if (character === "{" || character === "[") stack.push(character)
    if (character === "}" || character === "]") {
      const expected = character === "}" ? "{" : "["
      if (stack.pop() !== expected) return null
      if (stack.length === 0) return source.slice(start, index + 1)
    }
  }
  return null
}

function parseExpressionSource(source: string): AstRecord | null {
  try {
    const tree = processor.parse(`{${source}}`)
    return expressionFrom(childrenOf(tree)[0])
  } catch {
    return null
  }
}

function schemaFields(schema: string): SchemaField[] | null {
  const dataFile = resolveProjectFile("src/features/feeds/components/reportSchemaData.ts")
  if (!dataFile) return null
  const source = fsSync.readFileSync(dataFile.absolute, "utf8")
  const commonSource = extractStaticInitializer(source, "const COMMON_FIELDS")
  const definitionsSource = extractStaticInitializer(source, "REPORT_SCHEMA_DEFINITIONS")
  const common = commonSource ? readStaticExpression(parseExpressionSource(commonSource)) : null
  const definitions = definitionsSource ? parseExpressionSource(definitionsSource) : null
  if (!common?.ok || !Array.isArray(common.value) || definitions?.type !== "ObjectExpression") return null
  const schemaProperty = Array.isArray(definitions.properties)
    ? (definitions.properties.find((propertyValue) => {
        const property = propertyValue as AstRecord
        const key = property.key as AstRecord | undefined
        return property.type === "Property" && !property.computed && (key?.name === schema || key?.value === schema)
      }) as AstRecord | undefined)
    : undefined
  const schemaValue = schemaProperty?.value as AstRecord | undefined
  const fieldsProperty =
    schemaValue?.type === "ObjectExpression" && Array.isArray(schemaValue.properties)
      ? (schemaValue.properties.find((propertyValue) => {
          const property = propertyValue as AstRecord
          const key = property.key as AstRecord | undefined
          return (
            property.type === "Property" && !property.computed && (key?.name === "fields" || key?.value === "fields")
          )
        }) as AstRecord | undefined)
      : undefined
  const fieldsExpression = fieldsProperty?.value as AstRecord | undefined
  if (fieldsExpression?.type !== "ArrayExpression" || !Array.isArray(fieldsExpression.elements)) return null
  const values: unknown[] = []
  for (const elementValue of fieldsExpression.elements) {
    const element = elementValue as AstRecord
    if (element?.type === "SpreadElement" && (element.argument as AstRecord | undefined)?.name === "COMMON_FIELDS") {
      values.push(...common.value)
      continue
    }
    const parsed = readStaticExpression(element)
    if (!parsed.ok) return null
    values.push(parsed.value)
  }
  if (
    !values.every(
      (value): value is SchemaField =>
        !!value &&
        typeof value === "object" &&
        typeof (value as SchemaField).field === "string" &&
        typeof (value as SchemaField).type === "string" &&
        typeof (value as SchemaField).description === "string" &&
        (!(value as SchemaField).link ||
          (typeof (value as SchemaField).link?.label === "string" &&
            typeof (value as SchemaField).link?.href === "string"))
    )
  ) {
    return null
  }
  return values
}

type CcipReferenceEntry = {
  name: string
  parameters: { kind: "text" | "link"; value: string; url?: string }[]
  errorSelector?: string
  description: string
}

/**
 * Parameters are expected in Solidity syntax ("type indexed name"), comma-separated. A linked type is its own
 * link fact and splits the surrounding cell text, as in the observed Markdown.
 */
function ccipParameterFacts(parameters: AstRecord[]): CcipReferenceEntry["parameters"] | null {
  const facts: CcipReferenceEntry["parameters"] = []
  let text = ""
  for (const [index, parameter] of parameters.entries()) {
    if (typeof parameter?.type !== "string" || typeof parameter.name !== "string") return null
    const name = `${parameter.indexed === true ? "indexed " : ""}${parameter.name}`
    text += index > 0 ? ", " : ""
    if (typeof parameter.typeLink === "string") {
      facts.push({ kind: "text", value: text }, { kind: "link", value: parameter.type, url: parameter.typeLink })
      text = ` ${name}`
    } else {
      text += `${parameter.type} ${name}`
    }
  }
  facts.push({ kind: "text", value: text })
  return facts
}

const ccipReferenceData: Record<
  "CCIPSendError" | "CCIPEvent",
  { kind: string; nameKey: string; files: Record<string, string> }
> = {
  CCIPSendError: {
    kind: "errors",
    nameKey: "error",
    files: {
      erc20: "erc20.json",
      router: "router.json",
      onramp: "onramp.json",
      "rate-limiter": "ratelimiter.json",
      "price-registry": "priceregistry.json",
      pool: "pool.json",
      burnMintERC20: "burnMintERC20.json",
      feequoter: "feequoter.json",
    },
  },
  CCIPEvent: {
    kind: "events",
    nameKey: "event",
    files: {
      "onramp-send": "onramp-send.json",
      "pool-send": "pool-send.json",
      "offramp-receive": "offramp-receive.json",
      "router-receive": "router-receive.json",
      "pool-receive": "pool-receive.json",
    },
  },
}

/** Reads the static JSON behind CCIPSendError and CCIPEvent, independently of the converter. */
function ccipReferenceEntries(
  component: keyof typeof ccipReferenceData,
  type: unknown,
  version: unknown
): CcipReferenceEntry[] | null {
  const config = ccipReferenceData[component]
  const file = typeof type === "string" && Object.hasOwn(config.files, type) ? config.files[type] : undefined
  if (!file || typeof version !== "string" || !/^v\d+_\d+_\d+$/.test(version)) return null
  const data = resolveProjectFile(`src/config/data/ccip/${config.kind}/${version}/${file}`)
  if (!data) return null
  const entries: unknown = JSON.parse(fsSync.readFileSync(data.absolute, "utf8"))
  if (!Array.isArray(entries) || entries.length === 0) return null
  const result: CcipReferenceEntry[] = []
  for (const entry of entries as AstRecord[]) {
    const name = entry?.[config.nameKey]
    const parameters = ccipParameterFacts(Array.isArray(entry?.parameters) ? (entry.parameters as AstRecord[]) : [])
    if (typeof name !== "string" || typeof entry.description !== "string" || !parameters) return null
    result.push({
      name,
      parameters,
      ...(typeof entry.errorSelector === "string" && entry.errorSelector ? { errorSelector: entry.errorSelector } : {}),
      // Descriptions are Markdown; the expectation is their visible text.
      description: normalizeText(nodeVisibleText(processor.parse(entry.description))),
    })
  }
  return result
}

export function analyzeSourceMarkdown(
  source: string,
  sourcePath?: string,
  ancestorPaths: ReadonlySet<string> = new Set()
): SourceAnalysis {
  let tree: Node
  try {
    tree = processor.parse(maskFrontmatter(source))
  } catch (error) {
    return {
      facts: [],
      diagnostics: [
        {
          status: "unverifiable",
          ordinal: 1,
          name: "MDX parse error",
          line: 1,
          sourceText: source.split(/\r?\n/, 1)[0] ?? "",
          reason: error instanceof Error ? error.message : "Raw source could not be parsed",
          ...(sourcePath ? { sourcePath } : {}),
        },
      ],
      languages: [],
    }
  }
  const imports = staticImports(tree)
  const lines = source.split(/\r?\n/)
  const facts: GroupedFact<SourceFact>[] = []
  const diagnostics: SourceDiagnostic[] = []
  const languages = new Set<string>()
  const parentByNode = new WeakMap<Node, Node>()
  const groupByBlock = new WeakMap<Node, number>()
  const segmentByBlock = new WeakMap<Node, number>()
  let groupOrdinal = 0
  let factOrdinal = 0
  let diagnosticOrdinal = 0

  const componentsFor = (node: Node): string[] => {
    const names: string[] = []
    let current: Node | undefined = node
    while (current) {
      const name = (current as Node & { name?: string }).name
      if (name && name !== "Fragment" && !containerElements[name]) names.push(name)
      current = parentByNode.get(current)
    }
    return names
  }

  const inlineBlock = (node: Node): Node | null => {
    let current: Node | undefined = node
    let inlineElement: Node | null = null
    while (current) {
      if (
        (current.type === "mdxJsxFlowElement" || current.type === "mdxJsxTextElement") &&
        projectedInlineElements[String((current as Node & { name?: unknown }).name ?? "")]
      ) {
        inlineElement ??= current
        current = parentByNode.get(current)
        continue
      }
      if (
        current.type === "paragraph" ||
        current.type === "tableCell" ||
        current.type === "mdxJsxFlowElement" ||
        current.type === "mdxJsxTextElement"
      ) {
        return current
      }
      current = parentByNode.get(current)
    }
    return inlineElement
  }

  const textGroup = (node: Node): string | undefined => {
    const block = inlineBlock(node)
    if (!block) return undefined
    let group = groupByBlock.get(block)
    if (group === undefined) {
      group = ++groupOrdinal
      groupByBlock.set(block, group)
    }
    return `${group}:${segmentByBlock.get(block) ?? 0}`
  }

  const breakTextGroup = (node: Node) => {
    const ownBlock = inlineBlock(node)
    const block = ownBlock === node ? inlineBlock(parentByNode.get(node) ?? node) : ownBlock
    if (block) segmentByBlock.set(block, (segmentByBlock.get(block) ?? 0) + 1)
  }

  const addFact = (
    kind: SourceFact["kind"],
    value: string,
    node: Node,
    url?: string,
    depth?: number,
    variant?: string,
    coalesce = false,
    heading?: string
  ) => {
    const normalized = kind === "anchor" ? value : normalizeText(value)
    if (!normalized) {
      if (coalesce) {
        const group = textGroup(node)
        const previous = facts[facts.length - 1]
        if (group && previous?.kind === "text" && previous.group === group) {
          previous.rawValue = `${previous.rawValue ?? previous.value}${value}`
        }
      }
      return
    }
    const line = nodeLine(node)
    const components = componentsFor(node)
    facts.push({
      ordinal: ++factOrdinal,
      component: components[0],
      componentAncestors: components,
      kind,
      value: normalized,
      url,
      depth,
      variant,
      ...(heading === undefined ? {} : { heading }),
      line,
      sourceText: lineText(lines, line),
      ...(sourcePath ? { sourcePath } : {}),
      ...(coalesce ? { group: textGroup(node), rawValue: value } : {}),
    })
  }
  const addDiagnostic = (status: SourceDiagnostic["status"], name: string, node: Node, reason: string) => {
    const line = nodeLine(node)
    const components = componentsFor(node)
    diagnostics.push({
      status,
      ordinal: ++diagnosticOrdinal,
      component: components[0],
      componentAncestors: components,
      name,
      line,
      sourceText: lineText(lines, line),
      reason,
      ...(sourcePath ? { sourcePath } : {}),
    })
  }
  const appendAnalysis = (analysis: SourceAnalysis) => {
    for (const fact of analysis.facts) facts.push({ ...fact, ordinal: ++factOrdinal })
    for (const diagnostic of analysis.diagnostics) diagnostics.push({ ...diagnostic, ordinal: ++diagnosticOrdinal })
    analysis.languages.forEach((language) => languages.add(language))
  }

  const includeMarkdown = (component: string, node: Node, target: { absolute: string; relative: string }) => {
    if (ancestorPaths.has(target.absolute)) {
      addDiagnostic(
        "unverifiable",
        component,
        node,
        `${component} target ${target.relative} forms a static inclusion cycle`
      )
      return
    }
    try {
      const nestedAncestors = new Set(ancestorPaths)
      nestedAncestors.add(target.absolute)
      appendAnalysis(
        analyzeSourceMarkdown(fsSync.readFileSync(target.absolute, "utf8"), target.relative, nestedAncestors)
      )
    } catch (error) {
      addDiagnostic(
        "unverifiable",
        component,
        node,
        `${component} target ${target.relative} could not be read: ${error instanceof Error ? error.message : "unknown error"}`
      )
    }
  }

  const inspect = (root: Node) => {
    visit(root, (node, _index, parent) => {
      if (parent && !parentByNode.has(node)) parentByNode.set(node, parent)
    })
    visit(root, (node) => {
      if (node.type === "heading") {
        const depth = "depth" in node && typeof node.depth === "number" ? node.depth : undefined
        addFact("heading", nodeVisibleText(node), node, undefined, depth)
        visit(node, "link", (link) => {
          addFact("link", nodeVisibleText(link), link, String((link as Node & { url?: unknown }).url ?? ""))
          return SKIP
        })
        return SKIP
      }
      if (node.type === "link") {
        addFact("link", nodeVisibleText(node), node, String((node as Node & { url?: unknown }).url ?? ""))
        return SKIP
      }
      if (node.type === "image") {
        const alt = String((node as Node & { alt?: unknown }).alt ?? "Image") || "Image"
        addFact("image", alt, node, String((node as Node & { url?: unknown }).url ?? ""))
        return SKIP
      }
      if (node.type === "code") {
        addFact("code", String((node as Node & { value?: unknown }).value ?? ""), node)
        return SKIP
      }
      if (node.type === "inlineCode" || node.type === "text") {
        addFact(
          "text",
          String((node as Node & { value?: unknown }).value ?? ""),
          node,
          undefined,
          undefined,
          undefined,
          true
        )
        return
      }
      if (node.type === "html") {
        breakTextGroup(node)
        addDiagnostic("unverifiable", "HTML", node, "Raw HTML is not statically projected")
        return SKIP
      }
      if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
        const raw = String((node as Node & { value?: unknown }).value ?? "").trim()
        if (!raw || /^\/\*[\s\S]*\*\/$/.test(raw)) return SKIP
        const result = readStaticExpression(expressionFrom(node))
        if (result.ok && (typeof result.value === "string" || typeof result.value === "number")) {
          addFact("text", String(result.value), node, undefined, undefined, undefined, true)
        } else {
          breakTextGroup(node)
          addDiagnostic(
            "unverifiable",
            raw,
            node,
            `Dynamic MDX expression (${result.ok ? "non-text value" : result.syntax})`
          )
        }
        return SKIP
      }
      if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return

      const name = String((node as Node & { name?: unknown }).name ?? "")
      if (!name) {
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        return SKIP
      }
      if (name === "DocCards") {
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        return SKIP
      }
      if (name === "DocCard") {
        const title = staticAttribute(node, "title")
        const href = staticAttribute(node, "href")
        if (
          title.syntax ||
          typeof title.value !== "string" ||
          href.syntax ||
          (href.found && typeof href.value !== "string")
        ) {
          addDiagnostic("unverifiable", name, node, "Card title or URL cannot be determined statically")
        } else {
          addFact(
            href.value ? "link" : "text",
            title.value,
            node,
            typeof href.value === "string" && href.value ? href.value : undefined
          )
          const body = nodeVisibleText(node).trim()
          if (body) addFact("text", `: ${body}`, node)
        }
        return SKIP
      }
      if (name === "FeedPage") {
        addDiagnostic("unverifiable", name, node, "FeedPage exports a placeholder; live feed data is not included")
        return SKIP
      }
      if (name === "a") {
        const href = staticAttribute(node, "href")
        if (href.syntax || typeof href.value !== "string") {
          addDiagnostic("unverifiable", name, node, "Link URL cannot be determined statically")
        } else {
          addFact("link", nodeVisibleText(node), node, href.value)
        }
        return SKIP
      }
      if (name === "img") {
        const src = staticAttribute(node, "src")
        const alt = staticAttribute(node, "alt")
        if (src.syntax || typeof src.value !== "string" || alt.syntax) {
          addDiagnostic("unverifiable", name, node, "Image URL or label cannot be determined statically")
        } else {
          addFact("image", typeof alt.value === "string" && alt.value ? alt.value : "Image", node, src.value)
        }
        return SKIP
      }
      if (containerElements[name] || (name === "ul" && node.type === "mdxJsxFlowElement")) {
        if (name === "li") breakTextGroup(node)
        for (const failure of expressionAttributes(node)) {
          addDiagnostic("unverifiable", `${name}.${failure.name}`, node, `Dynamic JSX attribute (${failure.syntax})`)
        }
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        if (name === "li") breakTextGroup(node)
        return SKIP
      }
      if (projectedInlineElements[name] && name !== "CopyText") {
        for (const failure of expressionAttributes(node)) {
          addDiagnostic("unverifiable", `${name}.${failure.name}`, node, `Dynamic JSX attribute (${failure.syntax})`)
        }
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        return SKIP
      }
      if (/^[a-z]/.test(name)) {
        breakTextGroup(node)
        addDiagnostic("unverifiable", name, node, `Raw HTML element ${name} is not statically projected`)
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        breakTextGroup(node)
        return SKIP
      }

      if (name === "Aside" || name === "Callout") {
        for (const failure of expressionAttributes(node)) {
          addDiagnostic("unverifiable", `${name}.${failure.name}`, node, `Dynamic JSX attribute (${failure.syntax})`)
        }
        const type = staticAttribute(node, "type")
        const title = staticAttribute(node, "title")
        if (!type.syntax && !title.syntax) {
          const typeText = typeof type.value === "string" ? type.value.toUpperCase() : "NOTE"
          const titleText = typeof title.value === "string" && title.value ? `: ${title.value}` : ""
          addFact("text", `${typeText}${titleText}`, node)
        }
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        return SKIP
      }

      if (name === "CopyText") {
        const text = staticAttribute(node, "text")
        if (text.syntax || !text.found || typeof text.value !== "string") {
          addDiagnostic("unverifiable", "CopyText.text", node, `Dynamic CopyText text (${text.syntax ?? "missing"})`)
        } else {
          addFact("text", text.value, node, undefined, undefined, undefined, node.type === "mdxJsxTextElement")
        }
        return SKIP
      }

      if (name === "ClickToZoom") {
        const src = staticAttribute(node, "src")
        const alt = staticAttribute(node, "alt")
        if (src.syntax || !src.found || typeof src.value !== "string" || alt.syntax) {
          addDiagnostic(
            "unverifiable",
            "ClickToZoom",
            node,
            `Dynamic image attributes (${src.syntax ?? alt.syntax ?? "missing src"})`
          )
        } else {
          addFact("image", typeof alt.value === "string" && alt.value ? alt.value : "Image", node, src.value)
        }
        return SKIP
      }

      if (name === "Address") {
        const contractUrl = staticAttribute(node, "contractUrl")
        const address = staticAttribute(node, "address")
        const endLength = staticAttribute(node, "endLength")
        if (
          contractUrl.syntax ||
          typeof contractUrl.value !== "string" ||
          address.syntax ||
          (address.found && typeof address.value !== "string") ||
          endLength.syntax ||
          (endLength.found &&
            (typeof endLength.value !== "number" || !Number.isInteger(endLength.value) || endLength.value < 0))
        ) {
          addDiagnostic(
            "unverifiable",
            "Address",
            node,
            `Dynamic address attributes (${contractUrl.syntax ?? address.syntax ?? endLength.syntax ?? "missing contractUrl"})`
          )
        } else {
          const urlTail = contractUrl.value.split("/").pop() ?? contractUrl.value
          const fullDisplay = typeof address.value === "string" ? address.value : urlTail
          const display =
            typeof endLength.value === "number" && endLength.value > 0
              ? `${fullDisplay.slice(0, endLength.value + 2)}...${fullDisplay.slice(-endLength.value)}`
              : fullDisplay
          addFact("link", display, node, contractUrl.value)
        }
        return SKIP
      }

      if (name === "CodeHighlightBlock") {
        const code = staticAttribute(node, "code")
        const title = staticAttribute(node, "title")
        if (title.syntax || (title.found && typeof title.value !== "string")) {
          addDiagnostic(
            "unverifiable",
            "CodeHighlightBlock",
            node,
            `Dynamic title (${title.syntax ?? "invalid static type"})`
          )
        } else if (typeof title.value === "string" && title.value) {
          addFact("text", `Code snippet for ${title.value}:`, node)
        }
        if (typeof code.value === "string") {
          addFact("code", code.value, node)
          return SKIP
        }
        const expression = expressionAttribute(node, "code")
        const identifier =
          expression?.type === "Identifier" && typeof expression.name === "string" ? expression.name : undefined
        const importedPath = identifier ? imports.get(identifier) : undefined
        const location = sourceLocation(sourcePath)
        const target =
          importedPath && location
            ? resolveProjectFile(path.resolve(path.dirname(location.absolute), importedPath.split("?")[0]))
            : null
        if (!target) {
          addDiagnostic(
            "unverifiable",
            "CodeHighlightBlock",
            node,
            `CodeHighlightBlock code target "${importedPath ?? code.syntax ?? "missing"}" could not be statically resolved`
          )
        } else {
          addFact("code", stripHighlighterComments(fsSync.readFileSync(target.absolute, "utf8")), node)
        }
        return SKIP
      }

      if (name === "CodeSample") {
        const src = staticAttribute(node, "src")
        const showButtonOnly = staticAttribute(node, "showButtonOnly")
        if (
          typeof src.value !== "string" ||
          !src.value ||
          showButtonOnly.syntax ||
          (showButtonOnly.found && typeof showButtonOnly.value !== "boolean")
        ) {
          addDiagnostic(
            "unverifiable",
            "CodeSample",
            node,
            `CodeSample path "${typeof src.value === "string" ? src.value : (src.syntax ?? "missing")}" is not statically resolvable`
          )
          return SKIP
        }
        if (showButtonOnly.value === true) {
          addFact(
            "link",
            `Open ${path.basename(src.value)} in Remix`,
            node,
            `https://remix.ethereum.org/#url=https://docs.chain.link/${src.value}`
          )
          return SKIP
        }
        const target = [
          path.resolve("public", src.value),
          path.resolve(src.value),
          path.resolve("src", src.value),
        ].reduce<ReturnType<typeof resolveProjectFile>>(
          (found, candidate) => found ?? resolveProjectFile(candidate),
          null
        )
        if (!target) {
          addDiagnostic(
            "unverifiable",
            "CodeSample",
            node,
            `CodeSample path "${src.value}" is missing or escapes the project`
          )
        } else {
          addFact("code", fsSync.readFileSync(target.absolute, "utf8"), node)
        }
        return SKIP
      }

      if (name in selectorComponents) {
        const component = name as keyof typeof selectorComponents
        const selector = staticAttribute(node, selectorComponents[component].attribute)
        if (typeof selector.value !== "string" || !selector.value) {
          addDiagnostic(
            "unverifiable",
            component,
            node,
            `${component} selector is dynamic or missing (${selector.syntax ?? "missing"})`
          )
          return SKIP
        }
        const resolution = resolveSelectorTarget(component, selector.value)
        if (!resolution.target) {
          addDiagnostic(
            "unverifiable",
            component,
            node,
            resolution.reason ?? `${component} target could not be resolved`
          )
        } else {
          includeMarkdown(component, node, resolution.target)
        }
        return SKIP
      }

      if (name === "SchemaFieldsTable") {
        const schema = staticAttribute(node, "schema")
        const fields = typeof schema.value === "string" ? schemaFields(schema.value) : null
        if (!fields) {
          addDiagnostic(
            "unverifiable",
            "SchemaFieldsTable",
            node,
            typeof schema.value === "string"
              ? `SchemaFieldsTable schema "${schema.value}" could not be read from static schema definitions`
              : `SchemaFieldsTable schema is dynamic or missing (${schema.syntax ?? "missing"})`
          )
          return SKIP
        }
        addFact("text", "Field", node)
        addFact("text", "Type", node)
        addFact("text", "Description", node)
        for (const field of fields) {
          addFact("text", field.field, node)
          addFact("text", field.type, node)
          addFact("text", field.link ? `${field.description} —` : field.description, node)
          if (field.link) addFact("link", field.link.label, node, field.link.href)
        }
        return SKIP
      }
      if (name === "CCIPSendError" || name === "CCIPEvent") {
        const type = staticAttribute(node, "type")
        const version = staticAttribute(node, "version")
        const entries = ccipReferenceEntries(name, type.value, version.value)
        if (!entries) {
          addDiagnostic(
            "unverifiable",
            name,
            node,
            `${name} data could not be read for type "${String(type.value ?? type.syntax)}" and version "${String(version.value ?? version.syntax)}"`
          )
          return SKIP
        }
        addFact("text", name === "CCIPSendError" ? "Error" : "Event", node)
        addFact("text", "Description", node)
        for (const entry of entries) {
          addFact("text", entry.name, node)
          for (const parameter of entry.parameters) addFact(parameter.kind, parameter.value, node, parameter.url)
          if (entry.errorSelector) addFact("text", entry.errorSelector, node)
          addFact("text", entry.description, node)
        }
        return SKIP
      }
      if (name === "Billing") {
        addDiagnostic(
          "unverifiable",
          "Billing",
          node,
          "Billing content depends on imported fee configuration and runtime calculations"
        )
        return SKIP
      }

      if (name === "PageTabs") {
        const pages = staticAttribute(node, "pages")
        const title = staticAttribute(node, "headerTitle")
        const description = staticAttribute(node, "headerDescription")
        const showHeader = staticAttribute(node, "showHeader")
        if (pages.syntax || !pages.found || !Array.isArray(pages.value)) {
          addDiagnostic("unverifiable", "PageTabs.pages", node, `Dynamic PageTabs pages (${pages.syntax ?? "missing"})`)
          return SKIP
        }
        if (
          title.syntax ||
          (title.found && typeof title.value !== "string") ||
          description.syntax ||
          (description.found && typeof description.value !== "string") ||
          showHeader.syntax ||
          (showHeader.found && typeof showHeader.value !== "boolean")
        ) {
          addDiagnostic(
            "unverifiable",
            "PageTabs.header",
            node,
            `Dynamic PageTabs header (${title.syntax ?? description.syntax ?? showHeader.syntax ?? "invalid static type"})`
          )
          return SKIP
        }
        if (showHeader.value !== false) {
          if (!title.found || title.value === true) {
            addFact("heading", "Guide Versions", node, undefined, 2)
          } else if (typeof title.value === "string" && title.value) {
            addFact("heading", title.value, node, undefined, 2)
          }
          if (typeof description.value === "string" && description.value) addFact("text", description.value, node)
        }
        for (const entry of pages.value) {
          const group = Array.isArray(entry) ? entry : [entry]
          if (!group.length || group.some((item) => !item || typeof item !== "object")) {
            addDiagnostic("unverifiable", "PageTabs.pages", node, "PageTabs contains a non-static group")
            continue
          }
          const records = group as Record<string, unknown>[]
          const labels = records.map((item) => item.name).filter((value): value is string => typeof value === "string")
          const firstUrl = records[0].url
          if (labels.length !== records.length || typeof firstUrl !== "string") {
            addDiagnostic("unverifiable", "PageTabs.pages", node, "PageTabs group requires static name and URL values")
            continue
          }
          addFact("link", labels.join(" / "), node, firstUrl)
        }
        return SKIP
      }

      if (name === "Tabs" || name === "TabsContent") {
        const tabs: Array<{ key: string; node: Node }> = []
        const panels: Record<string, Node> = {}
        for (const child of childrenOf(node)) {
          const slot = staticAttribute(child, "slot")
          if (slot.syntax || typeof slot.value !== "string") {
            addDiagnostic("unverifiable", "Tabs.slot", child, `Dynamic tab slot (${slot.syntax ?? "missing"})`)
            continue
          }
          if (slot.value.startsWith("tab.")) tabs.push({ key: slot.value.slice(4), node: child })
          if (slot.value.startsWith("panel.")) panels[slot.value.slice(6)] = child
        }
        for (const tab of tabs) {
          addFact("heading", nodeVisibleText(tab.node), tab.node, undefined, 3)
          const panel = panels[tab.key]
          if (panel) {
            inspect({ type: "root", children: childrenOf(panel) } as Parent)
          } else {
            addDiagnostic("unverifiable", `Tabs.panel.${tab.key}`, tab.node, "Tab has no matching static panel")
          }
        }
        return SKIP
      }

      if (name === "MethodTabs") {
        for (const [slotName, label] of [
          ["ui", "Platform UI"],
          ["api", "API"],
        ]) {
          const panel = childrenOf(node).find((child) => staticAttribute(child, "slot").value === slotName)
          if (!panel) continue
          addFact("text", label, panel)
          inspect({ type: "root", children: childrenOf(panel) } as Parent)
        }
        return SKIP
      }

      if (name === "PackageManagerTabs") {
        const slots: Record<string, Node> = {}
        for (const child of childrenOf(node)) {
          const slot = staticAttribute(child, "slot")
          if (slot.syntax || typeof slot.value !== "string") {
            addDiagnostic(
              "unverifiable",
              "PackageManagerTabs.slot",
              child,
              `Dynamic package slot (${slot.syntax ?? "missing"})`
            )
          } else {
            slots[slot.value] = child
          }
        }
        for (const packageManager of ["npm", "yarn"]) {
          const panel = slots[packageManager]
          if (!panel) continue
          addFact("heading", packageManager, panel, undefined, 3)
          inspect({ type: "root", children: childrenOf(panel) } as Parent)
        }
        return SKIP
      }

      if (name === "GitHubCard") {
        const title = staticAttribute(node, "title")
        const href = staticAttribute(node, "href")
        const badge = staticAttribute(node, "badge")
        if (title.syntax || typeof title.value !== "string" || href.syntax || typeof href.value !== "string") {
          addDiagnostic("unverifiable", name, node, "Dynamic or missing GitHub card title or href")
        } else {
          addFact("link", title.value, node, href.value)
        }
        if (badge.syntax) addDiagnostic("unverifiable", name, node, "Dynamic GitHub card badge")
        else if (typeof badge.value === "string") addFact("text", badge.value, node)
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        return SKIP
      }

      if (name === "Accordion" || name === "AnchoredAccordion") {
        const title = staticAttribute(node, "title")
        const number = staticAttribute(node, "number")
        const depth = staticAttribute(node, "depth")
        let heading: string | undefined
        let level: number | undefined
        if (
          title.syntax ||
          typeof title.value !== "string" ||
          number.syntax ||
          (number.found && typeof number.value !== "number")
        ) {
          addDiagnostic(
            "unverifiable",
            name,
            node,
            `Dynamic accordion heading (${title.syntax ?? number.syntax ?? "missing title"})`
          )
        } else {
          const prefix = number.found ? `${number.value}. ` : ""
          level = depth.value === 4 ? 4 : depth.value === 3 || name === "Accordion" ? 3 : 2
          heading = normalizeText(`${prefix}${title.value}`)
          addFact("heading", heading, node, undefined, level)
        }
        if (name === "AnchoredAccordion") {
          const anchor = staticAttribute(node, "anchorId")
          if (anchor.found && (anchor.syntax || typeof anchor.value !== "string")) {
            addDiagnostic(
              "unverifiable",
              "AnchoredAccordion.anchorId",
              node,
              `Non-static or non-string accordion anchor (${anchor.syntax ?? typeof anchor.value})`
            )
          } else if (typeof anchor.value === "string" && anchor.value && heading !== undefined) {
            addFact("anchor", anchor.value, node, undefined, level, undefined, false, heading)
          }
        }
        inspect({ type: "root", children: childrenOf(node) } as Parent)
        return SKIP
      }

      if (name === "CodeHighlightBlockMulti") {
        const result = languageKeys(node)
        if (result.syntax) {
          addDiagnostic(
            "unverifiable",
            "CodeHighlightBlockMulti.languages",
            node,
            `Dynamic languages (${result.syntax})`
          )
        } else {
          result.keys.forEach((key) => languages.add(key))
          for (const code of result.codes ?? []) {
            if (code.value !== undefined) {
              addFact("code", code.value, node, undefined, undefined, code.key)
              continue
            }
            const importedPath = code.identifier ? imports.get(code.identifier) : undefined
            const location = sourceLocation(sourcePath)
            const target =
              importedPath && location
                ? resolveProjectFile(path.resolve(path.dirname(location.absolute), importedPath.split("?")[0]))
                : null
            if (!target) {
              addDiagnostic(
                "unverifiable",
                `CodeHighlightBlockMulti.languages.${code.key}`,
                node,
                `Imported code identifier "${code.identifier ?? "missing"}" could not be resolved through a contained static import`
              )
              continue
            }
            try {
              addFact(
                "code",
                stripHighlighterComments(fsSync.readFileSync(target.absolute, "utf8")),
                node,
                undefined,
                undefined,
                code.key
              )
            } catch (error) {
              addDiagnostic(
                "unverifiable",
                `CodeHighlightBlockMulti.languages.${code.key}`,
                node,
                `Imported code target ${target.relative} could not be read: ${
                  error instanceof Error ? error.message : "unknown error"
                }`
              )
            }
          }
        }
        return SKIP
      }

      addDiagnostic("unverifiable", name, node, `No static content expectation for component ${name}`)
      return SKIP
    })
  }

  inspect(tree)
  return { facts: coalesceTextFacts(facts), diagnostics, languages: [...languages].sort() }
}

function staticHeadingAnchor(node: Node): string | undefined {
  if (node.type !== "mdxJsxTextElement" || (node as Node & { name?: string }).name !== "a") return undefined
  const attributes = (node as Node & { attributes?: AstRecord[] }).attributes ?? []
  if (
    childrenOf(node).length !== 0 ||
    attributes.length !== 1 ||
    attributes[0].type !== "mdxJsxAttribute" ||
    attributes[0].name !== "id" ||
    typeof attributes[0].value !== "string" ||
    !attributes[0].value
  ) {
    return undefined
  }
  return attributes[0].value
}

function analyzeObservedMarkdown(
  markdown: string,
  expectedAnchors: readonly SourceFact[] = [],
  output?: "txt"
): ObservedAnalysis {
  let tree: Node
  try {
    tree = (output === "txt" ? txtProcessor : processor).parse(markdown)
  } catch (error) {
    return {
      facts: [],
      residuals: [
        {
          name: "Markdown parse error",
          line: 1,
          text: markdown,
          reason: error instanceof Error ? error.message : "Served Markdown could not be parsed",
        },
      ],
    }
  }
  const facts: GroupedFact<ObservedFact>[] = []
  const residuals: ObservedAnalysis["residuals"] = []
  const parentByNode = new WeakMap<Node, Node>()
  const groupByBlock = new WeakMap<Node, number>()
  const segmentByBlock = new WeakMap<Node, number>()
  let groupOrdinal = 0

  visit(tree, (node, _index, parent) => {
    if (parent) parentByNode.set(node, parent)
  })

  const inlineBlock = (node: Node): Node | null => {
    let current: Node | undefined = node
    while (current) {
      if (
        current.type === "paragraph" ||
        current.type === "tableCell" ||
        current.type === "mdxJsxFlowElement" ||
        current.type === "mdxJsxTextElement"
      ) {
        return current
      }
      current = parentByNode.get(current)
    }
    return null
  }

  const textGroup = (node: Node): string | undefined => {
    const block = inlineBlock(node)
    if (!block) return undefined
    let group = groupByBlock.get(block)
    if (group === undefined) {
      group = ++groupOrdinal
      groupByBlock.set(block, group)
    }
    return `${group}:${segmentByBlock.get(block) ?? 0}`
  }

  const breakTextGroup = (node: Node) => {
    const ownBlock = inlineBlock(node)
    const block = ownBlock === node ? inlineBlock(parentByNode.get(node) ?? node) : ownBlock
    if (block) segmentByBlock.set(block, (segmentByBlock.get(block) ?? 0) + 1)
  }

  const addFact = (fact: ObservedFact, node: Node, rawValue?: string) => {
    const group = rawValue === undefined ? undefined : textGroup(node)
    if (fact.kind === "text" && !fact.value && group) {
      const previous = facts[facts.length - 1]
      if (previous?.kind === "text" && previous.group === group) {
        previous.rawValue = `${previous.rawValue ?? previous.value}${rawValue}`
      }
      return
    }
    facts.push({ ...fact, ...(rawValue === undefined ? {} : { group, rawValue }) })
  }

  const exactText = (node: Node): string => {
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    return typeof start === "number" && typeof end === "number"
      ? markdown.slice(start, end)
      : lineText(markdown.split(/\r?\n/), nodeLine(node))
  }

  const isRuntimeNode = (node: Node): boolean =>
    node.type === "html" ||
    node.type === "mdxJsxFlowElement" ||
    node.type === "mdxJsxTextElement" ||
    node.type === "mdxFlowExpression" ||
    node.type === "mdxTextExpression" ||
    node.type === "mdxjsEsm"

  const addResidual = (node: Node) => {
    breakTextGroup(node)
    residuals.push({
      name:
        node.type === "html"
          ? "HTML"
          : node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement"
            ? String((node as Node & { name?: unknown }).name ?? "MDX")
            : node.type,
      line: nodeLine(node),
      text: exactText(node),
      reason: "Served Markdown contains residual runtime syntax",
    })
  }

  visit(tree, (node) => {
    if (node.type === "heading") {
      const value = normalizeText(nodeVisibleText(node))
      const depth = "depth" in node && typeof node.depth === "number" ? node.depth : undefined
      if (value) addFact({ kind: "heading", value, depth }, node)

      const anchors = new Map<Node, string>()
      for (const child of childrenOf(node)) {
        const id = staticHeadingAnchor(child)
        if (
          id !== undefined &&
          expectedAnchors.some(
            (anchor) =>
              anchor.kind === "anchor" && anchor.value === id && anchor.heading === value && anchor.depth === depth
          )
        ) {
          anchors.set(child, id)
        }
      }

      visit(node, (child) => {
        const id = anchors.get(child)
        if (id !== undefined) {
          addFact({ kind: "anchor", value: id, heading: value, depth }, child)
          return SKIP
        }
        if (child.type === "link") {
          const label = normalizeText(nodeVisibleText(child))
          if (label) {
            addFact({ kind: "link", value: label, url: String((child as Node & { url?: unknown }).url ?? "") }, child)
          }
        } else if (isRuntimeNode(child)) {
          addResidual(child)
          return SKIP
        }
      })
      return SKIP
    }
    if (node.type === "link") {
      const value = normalizeText(nodeVisibleText(node))
      if (value) addFact({ kind: "link", value, url: String((node as Node & { url?: unknown }).url ?? "") }, node)
      return SKIP
    }
    if (node.type === "image") {
      const alt = String((node as Node & { alt?: unknown }).alt ?? "Image") || "Image"
      addFact(
        { kind: "image", value: normalizeText(alt), url: String((node as Node & { url?: unknown }).url ?? "") },
        node
      )
      return SKIP
    }
    if (node.type === "code") {
      const value = normalizeText(String((node as Node & { value?: unknown }).value ?? ""))
      if (value) addFact({ kind: "code", value }, node)
      return SKIP
    }
    if (node.type === "inlineCode" || node.type === "text") {
      const raw = String((node as Node & { value?: unknown }).value ?? "")
      const value = normalizeText(raw)
      addFact({ kind: "text", value }, node, raw)
      return
    }
    if (isRuntimeNode(node)) {
      addResidual(node)
      return SKIP
    }
  })

  return { facts: coalesceTextFacts(facts), residuals }
}

function factMatches(source: SourceFact, observed: ObservedFact): boolean {
  return (
    source.kind === observed.kind &&
    source.value === observed.value &&
    (source.kind !== "heading" || source.depth === observed.depth) &&
    (source.kind !== "anchor" || (source.depth === observed.depth && source.heading === observed.heading)) &&
    ((source.kind !== "link" && source.kind !== "image") || source.url === observed.url)
  )
}
function frontmatterTitle(source: string): { title?: string; line: number } {
  if (!source.startsWith("---")) return { line: 1 }
  const end = source.indexOf("\n---", 3)
  if (end < 0) return { line: 1 }
  const frontmatter = source.slice(3, end)
  const match = /^\s*title:\s*"?(.+?)"?\s*$/m.exec(frontmatter)
  if (!match) return { line: 1 }
  const line = source.slice(0, 3 + (match.index ?? 0)).split(/\r?\n/).length
  return { title: match[1], line }
}

function expectedCanonicalSource(
  requestPath: string,
  sourcePath: string,
  routeKind: MarkdownArtifact["routeKind"]
): string {
  if (routeKind === "special") return `${SITE_BASE}/${requestPath}`
  const relative = sourcePath
    .split(path.sep)
    .join("/")
    .replace(/^.*?src\/content\//, "")
  const section = requestPath.split("/")[0]
  let slug = sourceRoute(relative)
  if (!slug.startsWith(section)) slug = `${section}/${slug}`
  return `${SITE_BASE}/${slug}`
}

function inspectNormalEnvelope(
  requestPath: string,
  sourcePath: string,
  source: string,
  artifact: MarkdownArtifact,
  servedLines: string[],
  lang: string,
  exceptions: readonly FidelityException[]
): FidelityFinding[] {
  const frontmatter = frontmatterTitle(source)
  const expectedTitle = frontmatter.title || path.basename(sourcePath, path.extname(sourcePath))
  const expectedSource = expectedCanonicalSource(requestPath, sourcePath, artifact.routeKind)
  const directiveLine = servedLines[2]?.startsWith("Last Updated: ") ? 4 : 3
  const fields = [
    { name: "title", expected: `# ${expectedTitle}`, actual: servedLines[0], sourceLine: frontmatter.line },
    { name: "source", expected: `Source: ${expectedSource}`, actual: servedLines[1], sourceLine: null },
    { name: "directive", expected: LLMS_DIRECTIVE, actual: servedLines[directiveLine], sourceLine: null },
  ] as const

  return fields.map((field) => {
    const present = field.actual === field.expected
    return withException(
      {
        path: requestPath,
        status: present ? "present" : "missing",
        occurrence: `lang=${lang};envelope=${JSON.stringify({ field: field.name, expected: field.expected })};duplicate=1`,
        sourcePath,
        sourceLine: field.sourceLine,
        ...(field.sourceLine === null ? {} : { sourceText: lineText(source.split(/\r?\n/), field.sourceLine) }),
        ...(lang === "default" ? {} : { lang }),
        name: `Envelope.${field.name}`,
        expected: field.expected,
        ...(present ? {} : { reason: `Normal artifact envelope ${field.name} is missing or changed` }),
        display: shortValue(field.expected),
      },
      exceptions
    )
  })
}

function shortValue(value: string): string {
  return value.length <= 80 ? value : `${value.slice(0, 77)}...`
}

function factSemantic(fact: SourceFact): string {
  return JSON.stringify({
    kind: fact.kind,
    value: fact.value,
    ...(fact.url === undefined ? {} : { url: fact.url }),
    ...(fact.depth === undefined ? {} : { depth: fact.depth }),
    ...(fact.heading === undefined ? {} : { heading: fact.heading }),
  })
}

function occurrenceForFact(fact: SourceFact, lang: string, duplicate: number): string {
  return `lang=${lang};fact=${factSemantic(fact)};duplicate=${duplicate}`
}

function diagnosticSemantic(diagnostic: Pick<SourceDiagnostic, "name" | "reason">): string {
  return JSON.stringify({ component: diagnostic.name, reason: diagnostic.reason })
}

function occurrenceForDiagnostic(diagnostic: SourceDiagnostic, lang: string, duplicate: number): string {
  return `lang=${lang};diagnostic=${diagnosticSemantic(diagnostic)};duplicate=${duplicate}`
}

function residualSemantic(residual: ObservedAnalysis["residuals"][number]): string {
  return JSON.stringify({ component: residual.name, reason: residual.reason, servedText: residual.text })
}

export function withException(finding: FidelityFinding, exceptions: readonly FidelityException[]): FidelityFinding {
  if (finding.status === "present") return finding
  const exception = exceptions.find(
    (candidate) =>
      candidate.path === finding.path &&
      candidate.occurrence === finding.occurrence &&
      candidate.status === finding.status &&
      candidate.reason.trim().length > 0 &&
      candidate.owner.trim().length > 0 &&
      candidate.removalCondition.trim().length > 0
  )
  return exception
    ? {
        ...finding,
        exception: {
          reason: exception.reason,
          owner: exception.owner,
          removalCondition: exception.removalCondition,
        },
      }
    : finding
}

export function compareSourceToArtifact(
  requestPath: string,
  sourcePath: string,
  source: string,
  artifact: MarkdownArtifact,
  lang = "default",
  exceptions: readonly FidelityException[] = markdownFidelityExceptions,
  observation: { drops?: readonly DroppedComponent[]; output?: "txt"; analysis?: SourceAnalysis } = {}
): FidelityFinding[] {
  const analysis = observation.analysis ?? analyzeSourceMarkdown(source, sourcePath)
  const servedLines = artifact.markdown.split(/\r?\n/)
  const directiveIndex = servedLines.findIndex((line) => line === LLMS_DIRECTIVE)
  const txtHeaderEnd =
    observation.output && servedLines[0]?.startsWith("# ") && servedLines[1]?.startsWith("Source: ")
      ? servedLines.findIndex((line, index) => index > 1 && line === "")
      : -1
  const servedLineOffset = observation.output ? Math.max(0, txtHeaderEnd + 1) : Math.max(0, directiveIndex + 1)
  const servedBody = servedLines.slice(servedLineOffset).join("\n")
  const observed = analyzeObservedMarkdown(
    servedBody,
    analysis.facts.filter((fact) => fact.kind === "anchor"),
    observation.output
  )
  const findings: FidelityFinding[] =
    !observation.output && artifact.sourcePath && !path.isAbsolute(artifact.sourcePath)
      ? inspectNormalEnvelope(requestPath, sourcePath, source, artifact, servedLines, lang, exceptions)
      : []
  const droppedNames = new Set(observation.drops?.map((drop) => drop.name))
  let observedIndex = 0
  const presentFactDuplicates = new Map<string, number>()
  const missingFactDuplicates = new Map<string, number>()
  const diagnosticDuplicates = new Map<string, number>()
  const residualDuplicates = new Map<string, number>()

  for (const fact of analysis.facts.filter(
    (candidate) => lang === "default" || !candidate.variant || candidate.variant === lang
  )) {
    const semantic = factSemantic(fact)
    let matchedAt = -1
    for (let index = observedIndex; index < observed.facts.length; index += 1) {
      if (factMatches(fact, observed.facts[index])) {
        matchedAt = index
        break
      }
    }
    const duplicateMap = matchedAt >= 0 ? presentFactDuplicates : missingFactDuplicates
    const duplicate = (duplicateMap.get(semantic) ?? 0) + 1
    duplicateMap.set(semantic, duplicate)
    const component = fact.componentAncestors?.find((name) => droppedNames.has(name)) ?? fact.component
    const finding: FidelityFinding = {
      ...(matchedAt >= 0 ? {} : { reason: "Expected source fact is missing from served Markdown" }),
      path: requestPath,
      status: matchedAt >= 0 ? "present" : "missing",
      occurrence: occurrenceForFact(fact, lang, duplicate),
      sourcePath: fact.sourcePath ?? sourcePath,
      sourceLine: fact.line,
      sourceText: fact.sourceText,
      ...(lang === "default" ? {} : { lang }),
      ...(component ? { component } : {}),
      expected: fact.kind === "link" || fact.kind === "image" ? `${fact.value} -> ${fact.url}` : fact.value,
      display: shortValue(fact.kind === "link" || fact.kind === "image" ? `${fact.value} -> ${fact.url}` : fact.value),
    }
    findings.push(withException(finding, exceptions))
    if (matchedAt >= 0) observedIndex = matchedAt + 1
  }

  for (const name of [...droppedNames].sort()) {
    findings.push(
      withException(
        {
          path: requestPath,
          status: "unsupported",
          occurrence: `lang=${lang};dropped=${name}`,
          sourcePath,
          sourceLine: null,
          ...(lang === "default" ? {} : { lang }),
          name,
          component: name,
          reason: "Component subtree was removed by the actual transform",
        },
        exceptions
      )
    )
  }

  for (const diagnostic of analysis.diagnostics) {
    const ancestors = diagnostic.componentAncestors ?? (diagnostic.component ? [diagnostic.component] : [])
    if (ancestors.some((name) => droppedNames.has(name))) continue
    const semantic = diagnosticSemantic(diagnostic)
    const duplicate = (diagnosticDuplicates.get(semantic) ?? 0) + 1
    diagnosticDuplicates.set(semantic, duplicate)
    findings.push(
      withException(
        {
          path: requestPath,
          status: diagnostic.status,
          occurrence: occurrenceForDiagnostic(diagnostic, lang, duplicate),
          sourcePath: diagnostic.sourcePath ?? sourcePath,
          sourceLine: diagnostic.line,
          sourceText: diagnostic.sourceText,
          ...(lang === "default" ? {} : { lang }),
          name: diagnostic.name,
          ...(diagnostic.component ? { component: diagnostic.component } : {}),
          reason: diagnostic.reason,
        },
        exceptions
      )
    )
  }

  observed.residuals.forEach((residual) => {
    const semantic = residualSemantic(residual)
    const duplicate = (residualDuplicates.get(semantic) ?? 0) + 1
    residualDuplicates.set(semantic, duplicate)
    findings.push(
      withException(
        {
          path: requestPath,
          status: "unverifiable",
          occurrence: `lang=${lang};residual=${semantic};duplicate=${duplicate}`,
          sourcePath,
          sourceLine: null,
          ...(lang === "default" ? {} : { lang }),
          name: residual.name,
          reason: residual.reason,
          servedLine: residual.line + servedLineOffset,
          servedText: residual.text,
          display: shortValue(residual.text),
        },
        exceptions
      )
    )
  })

  return observation.output ? findings.map((finding) => ({ ...finding, output: observation.output })) : findings
}

export function findingIdentity(finding: FidelityFinding): string {
  return JSON.stringify({
    path: finding.path,
    status: finding.status,
    language: finding.lang ?? "default",
    occurrence: finding.occurrence,
    ...(finding.output ? { output: finding.output } : {}),
    ...(finding.name === undefined ? {} : { component: finding.name }),
    ...(finding.expected === undefined ? {} : { expected: finding.expected }),
    ...(finding.reason === undefined ? {} : { reason: finding.reason }),
    ...(finding.servedText === undefined ? {} : { servedText: finding.servedText }),
  })
}

export function blockingFindings(
  mode: RunMode,
  findings: readonly FidelityFinding[],
  baselineIdentities: ReadonlySet<string> = new Set()
): FidelityFinding[] {
  return findings.filter(
    (finding) =>
      finding.status !== "present" &&
      !finding.exception &&
      (mode === "focused" || !baselineIdentities.has(findingIdentity(finding)))
  )
}

export function determineExitCode(
  mode: RunMode,
  findings: readonly FidelityFinding[],
  baselineIdentities: ReadonlySet<string> = new Set()
): 0 | 1 {
  return blockingFindings(mode, findings, baselineIdentities).length > 0 ? 1 : 0
}

async function loadBaseline(baselinePath = DEFAULT_BASELINE_PATH): Promise<ReadonlySet<string>> {
  const baseline: unknown = JSON.parse(await fs.readFile(baselinePath, "utf8"))
  if (
    typeof baseline !== "object" ||
    baseline === null ||
    !("version" in baseline) ||
    baseline.version !== 1 ||
    !("identities" in baseline) ||
    !Array.isArray(baseline.identities) ||
    !baseline.identities.every((identity) => typeof identity === "string")
  ) {
    throw new Error("Invalid Markdown fidelity baseline")
  }
  return new Set(baseline.identities)
}

/** Known debt only: findings stay in reports; reviewed intentional losses use exceptions. */
export function baselineFromFindings(findings: readonly FidelityFinding[]) {
  return {
    version: 1,
    identities: [
      ...new Set(findings.filter((finding) => finding.status !== "present" && !finding.exception).map(findingIdentity)),
    ].sort(),
  }
}

function compareFinding(left: FidelityFinding, right: FidelityFinding): number {
  const leftIdentity = findingIdentity(left)
  const rightIdentity = findingIdentity(right)
  return leftIdentity < rightIdentity ? -1 : leftIdentity > rightIdentity ? 1 : 0
}

export function createReport(pathCount: number, findings: readonly FidelityFinding[]): FidelityReport {
  const counts: Record<FidelityStatus, number> = {
    present: 0,
    missing: 0,
    unsupported: 0,
    unverifiable: 0,
    degraded: 0,
  }
  findings.forEach((finding) => {
    counts[finding.status] += 1
  })
  const grouped = new Map<
    string,
    { pages: Set<string>; byStatus: Record<Exclude<FidelityStatus, "present">, Set<string>> }
  >()
  for (const finding of findings) {
    if (!finding.component || finding.status === "present") continue
    const entry = grouped.get(finding.component) ?? {
      pages: new Set<string>(),
      byStatus: {
        unsupported: new Set<string>(),
        missing: new Set<string>(),
        unverifiable: new Set<string>(),
        degraded: new Set<string>(),
      },
    }
    const page = finding.sourcePath ?? finding.path
    entry.pages.add(page)
    entry.byStatus[finding.status].add(page)
    grouped.set(finding.component, entry)
  }
  const components: ComponentSummary[] = [...grouped].map(([name, entry]) => ({
    name,
    kind: /^[a-z]/.test(name) ? "html" : "component",
    pageCount: entry.pages.size,
    pages: [...entry.pages].sort(),
    statuses: (Object.keys(entry.byStatus) as ComponentSummary["statuses"])
      .filter((status) => entry.byStatus[status].size > 0)
      .sort(),
    pagesByStatus: {
      unsupported: entry.byStatus.unsupported.size,
      missing: entry.byStatus.missing.size,
      unverifiable: entry.byStatus.unverifiable.size,
      degraded: entry.byStatus.degraded.size,
    },
  }))
  components.sort(
    (a, b) =>
      b.pagesByStatus.unsupported - a.pagesByStatus.unsupported ||
      b.pagesByStatus.missing - a.pagesByStatus.missing ||
      b.pageCount - a.pageCount ||
      (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
  )
  return { pathCount, counts, findings: [...findings].sort(compareFinding), components }
}

export function serializeReport(report: FidelityReport, options: { omitPresent?: boolean } = {}): string {
  const serialized = options.omitPresent
    ? { ...report, omittedPresent: true, findings: report.findings.filter((finding) => finding.status !== "present") }
    : report
  return `${JSON.stringify(serialized, null, 2)}\n`
}

function cliRequestPath(value: string): string | null {
  if (path.isAbsolute(value) || value.includes("\\")) return null
  const segments = value.split("/")
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) return null

  if (value.startsWith("src/content/")) {
    if (!/\.(?:md|mdx)$/i.test(value)) return null
    const withoutExtension = value.replace(/\.(?:md|mdx)$/i, "")
    if (/\.(?:md|mdx)$/i.test(withoutExtension)) return null
    const relativePath = value.slice("src/content/".length)
    return normalizeMarkdownPath(sourceRoute(relativePath))
  }

  if (value === "src/content" || value.startsWith("src/") || /\.(?:md|mdx)$/i.test(value)) return null
  return normalizeMarkdownPath(value)
}

export function parseCliArguments(argv: readonly string[]): {
  mode: RunMode
  paths: string[]
  warnOnly: boolean
  publish?: boolean
  updateBaseline?: boolean
  omitPresent?: boolean
} {
  const paths: string[] = []
  let warnOnly = false
  let publish = false
  let updateBaseline = false
  let omitPresent = false
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--update-baseline") {
      updateBaseline = true
      continue
    }
    if (argv[index] === "--omit-present") {
      omitPresent = true
      continue
    }
    if (argv[index] === "--publish") {
      publish = true
      continue
    }
    if (argv[index] === "--warn-only") {
      warnOnly = true
      continue
    }
    if (argv[index] !== "--path") throw new Error(`Unknown argument: ${argv[index]}`)
    const value = argv[index + 1]
    if (!value || value.startsWith("--")) throw new Error("--path requires a value")
    const normalized = cliRequestPath(value)
    if (!normalized) throw new Error(`Invalid Markdown path: ${value}`)
    paths.push(normalized)
    index += 1
  }
  if (publish && paths.length) throw new Error("--publish requires a full-corpus check")
  if (updateBaseline && paths.length) throw new Error("--update-baseline requires a full-corpus check")
  const flags = {
    ...(publish ? { publish: true } : {}),
    ...(updateBaseline ? { updateBaseline: true } : {}),
    ...(omitPresent ? { omitPresent: true } : {}),
  }
  return paths.length
    ? { mode: "focused", paths: [...new Set(paths)].sort(), warnOnly, ...flags }
    : { mode: "full-corpus", paths: [], warnOnly, ...flags }
}

function sourceRoute(relativePath: string): string {
  const withoutExtension = relativePath
    .replace(/\.(?:md|mdx)$/i, "")
    .split(path.sep)
    .join("/")
  return withoutExtension.endsWith("/index") ? withoutExtension.slice(0, -"/index".length) : withoutExtension
}

export async function collectCorpusPaths(contentRoot = CONTENT_ROOT): Promise<string[]> {
  const routes = new Set<string>([...MARKDOWN_REDIRECT_PATHS, "cre-templates"])

  const walk = async (directory: string): Promise<void> => {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    entries.sort((left, right) => left.name.localeCompare(right.name))
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
      } else if (/\.(?:md|mdx)$/i.test(entry.name) && !/^llms-full/i.test(entry.name)) {
        routes.add(sourceRoute(path.relative(contentRoot, absolute)))
      }
    }
  }

  await walk(contentRoot)
  for (const route of [...routes]) {
    if (route.startsWith("cre/") && (route.endsWith("-go") || route.endsWith("-ts"))) {
      routes.add(route.slice(0, -3))
    }
  }
  return [...routes].filter((route) => !isSunsetDocsPath(route)).sort()
}

function safeSourcePath(sourcePath: string): { absolute: string; relative: string } | null {
  const absolute = path.isAbsolute(sourcePath) ? path.resolve(sourcePath) : path.resolve(CONTENT_ROOT, sourcePath)
  if (absolute !== CONTENT_ROOT && !absolute.startsWith(`${CONTENT_ROOT}${path.sep}`)) return null
  return { absolute, relative: path.relative(process.cwd(), absolute).split(path.sep).join("/") }
}

export function inspectSyntheticArtifact(
  requestPath: string,
  artifact: MarkdownArtifact,
  exceptions: readonly FidelityException[] = markdownFidelityExceptions
): { findings: FidelityFinding[]; targetPaths: string[] } {
  const finding = (
    status: "present" | "missing" | "unverifiable",
    occurrence: string,
    expected: string,
    reason?: string
  ) =>
    withException(
      {
        path: requestPath,
        status,
        occurrence,
        sourceLine: null,
        expected,
        ...(reason ? { reason } : {}),
      },
      exceptions
    )

  if (artifact.routeKind === "redirect") {
    const target = (MARKDOWN_REDIRECT_TARGETS as Record<string, string>)[requestPath]
    if (!target) {
      return {
        findings: [
          finding(
            "unverifiable",
            "lang=default;synthetic=redirect;configuration",
            requestPath,
            "Redirect route has no independent checker target"
          ),
        ],
        targetPaths: [],
      }
    }
    const label = target
    const url = `/${target}.md`
    const observed = analyzeObservedMarkdown(artifact.markdown)
    const present = observed.facts.some((fact) => fact.kind === "link" && fact.value === label && fact.url === url)
    return {
      findings: [
        finding(
          present ? "present" : "missing",
          `lang=default;synthetic=redirect;${label} -> ${url}`,
          `${label} -> ${url}`,
          present ? undefined : "Redirect artifact does not contain its exact current target link"
        ),
      ],
      targetPaths: [target],
    }
  }

  if (artifact.routeKind === "selector") {
    const targets = [`${requestPath}-go`, `${requestPath}-ts`]
    const labels = ["Go", "TypeScript"]
    const lines = artifact.markdown.split(/\r?\n/).map((line) => line.trim())
    return {
      findings: targets.map((target, index) => {
        const expectedLine = `- ${labels[index]}: /${target}.md`
        const present = lines.includes(expectedLine)
        return finding(
          present ? "present" : "missing",
          `lang=default;synthetic=selector;${labels[index]} -> /${target}.md`,
          `${labels[index]} -> /${target}.md`,
          present ? undefined : `Selector artifact is missing exact entry "${expectedLine}"`
        )
      }),
      targetPaths: targets,
    }
  }

  return {
    findings: [
      finding(
        "unverifiable",
        `lang=default;synthetic=${artifact.routeKind};source`,
        requestPath,
        "Source-less artifact has no independent fidelity contract"
      ),
    ],
    targetPaths: [],
  }
}

async function checkPathInternal(
  requestPath: string,
  ancestorPaths: ReadonlySet<string>,
  globallyScheduledPaths?: ReadonlySet<string>,
  globallyVisitedPaths?: Set<string>
): Promise<FidelityFinding[]> {
  if (isSunsetDocsPath(requestPath)) return []

  globallyVisitedPaths?.add(requestPath)
  const nextAncestors = new Set(ancestorPaths)
  nextAncestors.add(requestPath)
  const defaultDrops: DroppedComponent[] = []
  const defaultArtifact = await buildMarkdownArtifact(requestPath, {
    onDropComponent: (drop) => defaultDrops.push(drop),
  })
  if (!defaultArtifact) {
    return [
      withException(
        {
          path: requestPath,
          status: "missing",
          occurrence: "lang=default;artifact",
          sourceLine: null,
          reason: "No Markdown artifact was built",
        },
        markdownFidelityExceptions
      ),
    ]
  }

  const degraded = (artifact: MarkdownArtifact, lang: string): FidelityFinding[] => {
    if (artifact.transformMode === "normal") return []
    const artifactSource = artifact.sourcePath ? safeSourcePath(artifact.sourcePath)?.relative : undefined
    return [
      withException(
        {
          path: requestPath,
          status: "degraded",
          occurrence: `lang=${lang};transform=${artifact.transformMode}`,
          sourcePath: artifactSource,
          sourceLine: null,
          ...(lang === "default" ? {} : { lang }),
          reason: `${artifact.routeKind} route used ${artifact.transformMode} output`,
        },
        markdownFidelityExceptions
      ),
    ]
  }

  if (!defaultArtifact.sourcePath) {
    const inspection = inspectSyntheticArtifact(requestPath, defaultArtifact)
    const findings = [...degraded(defaultArtifact, "default"), ...inspection.findings]
    for (const targetPath of inspection.targetPaths) {
      if (nextAncestors.has(targetPath)) {
        findings.push(
          withException(
            {
              path: requestPath,
              status: "unverifiable",
              occurrence: `lang=default;synthetic-target-cycle=${targetPath}`,
              sourceLine: null,
              name: targetPath,
              reason: "Synthetic route target evaluation forms a cycle",
            },
            markdownFidelityExceptions
          )
        )
      } else if (!globallyScheduledPaths?.has(targetPath) && !globallyVisitedPaths?.has(targetPath)) {
        findings.push(
          ...(await checkPathInternal(targetPath, nextAncestors, globallyScheduledPaths, globallyVisitedPaths))
        )
      }
    }
    return findings
  }
  const sourceLocation = safeSourcePath(defaultArtifact.sourcePath)
  if (!sourceLocation) {
    return [
      withException(
        {
          path: requestPath,
          status: "unverifiable",
          occurrence: "lang=default;source-path",
          sourceLine: null,
          name: defaultArtifact.sourcePath,
          reason: "Artifact source path escapes src/content",
        },
        markdownFidelityExceptions
      ),
    ]
  }

  const source = await fs.readFile(sourceLocation.absolute, "utf8")
  const analysis = analyzeSourceMarkdown(source, sourceLocation.relative)
  const variants = ["default", ...analysis.languages]
  const findings: FidelityFinding[] = []
  for (const lang of variants) {
    const drops: DroppedComponent[] = lang === "default" ? defaultDrops : []
    const artifact =
      lang === "default"
        ? defaultArtifact
        : await buildMarkdownArtifact(requestPath, { lang, onDropComponent: (drop) => drops.push(drop) })
    if (!artifact) {
      findings.push(
        withException(
          {
            path: requestPath,
            status: "missing",
            occurrence: `lang=${lang};artifact`,
            sourcePath: sourceLocation.relative,
            sourceLine: null,
            ...(lang === "default" ? {} : { lang }),
            reason: "No Markdown artifact was built for static language variant",
          },
          markdownFidelityExceptions
        )
      )
      continue
    }
    findings.push(...degraded(artifact, lang))
    findings.push(
      ...compareSourceToArtifact(
        requestPath,
        sourceLocation.relative,
        source,
        artifact,
        lang,
        markdownFidelityExceptions,
        { drops, analysis }
      )
    )
  }

  const relative = path.relative(CONTENT_ROOT, sourceLocation.absolute).split(path.sep).join("/")
  const [section, solutionSlug] = relative.split("/")
  const config = LLM_SECTIONS_CONFIG[section as keyof typeof LLM_SECTIONS_CONFIG]
  const exported =
    (SUPPORTED_LLM_SECTIONS as readonly string[]).includes(section) ||
    (section === "solutions" && SOLUTIONS.some((solution) => !solution.hidden && solution.slug === solutionSlug))
  if (exported) {
    const markdownByIdentity = new Map(findings.map((finding) => [findingIdentity(finding), finding]))
    const pageLanguage = getPageLanguage(sourceLocation.absolute, extractFrontmatter(source).sdkLang)
    const languages = config?.languages?.filter((language) => shouldIncludeInLanguageFile(pageLanguage, language)) ?? [
      undefined,
    ]
    for (const language of languages) {
      const drops: DroppedComponent[] = []
      const rendered = await renderLlmsPageMarkdown(source, sourceLocation.absolute, section, language, {
        onDropComponent: (drop) => drops.push(drop),
      })
      const artifact: MarkdownArtifact = { ...rendered, requestPath, routeKind: defaultArtifact.routeKind }
      const txtFindings = [
        ...degraded(artifact, language ?? "default").map((finding) => ({ ...finding, output: "txt" as const })),
        ...compareSourceToArtifact(
          requestPath,
          sourceLocation.relative,
          source,
          artifact,
          language ?? "default",
          markdownFidelityExceptions,
          { drops, output: "txt", analysis }
        ),
      ]
      for (const finding of txtFindings) {
        const sameMarkdown = markdownByIdentity.get(findingIdentity({ ...finding, output: undefined }))
        if (sameMarkdown) sameMarkdown.outputs = ["markdown", "txt"]
        else findings.push(finding)
      }
    }
  }
  return findings
}

export async function checkPath(
  requestPath: string,
  options: { globallyScheduledPaths?: ReadonlySet<string>; globallyVisitedPaths?: Set<string> } = {}
): Promise<FidelityFinding[]> {
  return checkPathInternal(requestPath, new Set(), options.globallyScheduledPaths, options.globallyVisitedPaths)
}

/** Public v2 inventory for docs-agent-score. Statuses are evidence, not a coverage score.
 * Pages are unique source paths; findings can cover both Markdown/TXT and language variants.
 * pagesByStatus counts unique pages per status; counts may overlap. kind separates HTML.
 * Observed drops sort first. No observed drop does not establish that rendering is correct.
 * Baseline findings remain visible. newSinceBaseline means a component has a new finding.
 */
export function componentInventory(
  report: FidelityReport,
  blockers: readonly FidelityFinding[],
  generatedAt = new Date().toISOString()
) {
  return {
    schemaVersion: 2 as const,
    generatedAt,
    pathCount: report.pathCount,
    counts: report.counts,
    components: report.components,
    newSinceBaseline: [
      ...new Set(blockers.flatMap((finding) => (finding.component ? [finding.component] : []))),
    ].sort(),
  }
}

export async function publishComponentInventory(
  inventory: ReturnType<typeof componentInventory>,
  outputPath = PUBLIC_REPORT_PATH
): Promise<void> {
  await writeJsonAtomically(outputPath, inventory)
}

async function writeJsonAtomically(outputPath: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const temporaryPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.${process.pid}.tmp`)
  try {
    await fs.writeFile(temporaryPath, JSON.stringify(value, null, 2) + "\n", "utf8")
    await fs.rename(temporaryPath, outputPath)
  } finally {
    await fs.rm(temporaryPath, { force: true }).catch(() => {
      // Cleanup must not replace the original write error.
    })
  }
}

export async function runMarkdownFidelity(
  argv: readonly string[],
  options: { reportPath?: string; contentRoot?: string; baselinePath?: string } = {}
): Promise<{ report: FidelityReport; exitCode: 0 | 1; blockers: FidelityFinding[]; warnOnly: boolean }> {
  const parsed = parseCliArguments(argv)
  const baselinePath = options.baselinePath ?? DEFAULT_BASELINE_PATH
  let baselineIdentities =
    parsed.mode === "full-corpus" && !parsed.updateBaseline ? await loadBaseline(baselinePath) : new Set<string>()
  const paths = parsed.mode === "focused" ? parsed.paths : await collectCorpusPaths(options.contentRoot)
  const findings: FidelityFinding[] = []
  let checkerErrors = 0
  const globallyScheduledPaths = parsed.mode === "full-corpus" ? new Set(paths) : undefined
  const globallyVisitedPaths = parsed.mode === "full-corpus" ? new Set<string>() : undefined
  for (const requestPath of paths) {
    try {
      findings.push(...(await checkPathInternal(requestPath, new Set(), globallyScheduledPaths, globallyVisitedPaths)))
    } catch (error) {
      checkerErrors++
      const reason = (error instanceof Error ? error.message : "Checker failed").split(process.cwd()).join(".")
      findings.push(
        withException(
          {
            path: requestPath,
            status: "unverifiable",
            occurrence: "lang=default;checker-error",
            sourceLine: null,
            reason,
          },
          markdownFidelityExceptions
        )
      )
    }
  }
  const report = createReport(paths.length, findings)
  const reportPath = options.reportPath ?? DEFAULT_REPORT_PATH
  await fs.mkdir(path.dirname(reportPath), { recursive: true })
  await fs.writeFile(reportPath, serializeReport(report, { omitPresent: parsed.omitPresent }), "utf8")
  if (checkerErrors && (parsed.updateBaseline || parsed.publish)) {
    throw new Error(`Baseline and public report unchanged: ${checkerErrors} page check(s) failed`)
  }
  if (parsed.updateBaseline) {
    const baseline = baselineFromFindings(report.findings)
    await writeJsonAtomically(baselinePath, baseline)
    baselineIdentities = new Set(baseline.identities)
  }
  const blockers = blockingFindings(parsed.mode, report.findings, baselineIdentities)
  if (parsed.publish) {
    await publishComponentInventory(componentInventory(report, blockers))
  }
  return {
    report,
    exitCode: parsed.warnOnly || blockers.length === 0 ? 0 : 1,
    blockers,
    warnOnly: parsed.warnOnly,
  }
}

export function formatFocusedFindings(findings: readonly FidelityFinding[]): string {
  const issues = findings.filter((finding) => finding.status !== "present")
  const rows = issues.slice(0, 50).map((finding) => {
    const location = `${finding.sourcePath ?? finding.path}${finding.sourceLine === null ? "" : `:${finding.sourceLine}`}`
    const evidence = finding.expected ?? finding.reason ?? finding.display ?? finding.occurrence
    return `[${finding.status}] ${location}${finding.component ? ` (${finding.component})` : ""}${finding.lang ? ` [${finding.lang}]` : ""} [${finding.outputs?.join(", ") ?? finding.output ?? "markdown"}]${finding.exception ? " [excepted]" : ""}: ${shortValue(evidence)}`
  })
  if (issues.length > rows.length)
    rows.push(`… ${issues.length - rows.length} more finding(s) in ${DEFAULT_REPORT_PATH}`)
  return rows.join("\n") || "No non-present findings."
}

export function formatJobSummary(report: FidelityReport, blockers: readonly FidelityFinding[]): string {
  const components = createReport(report.pathCount, blockers).components
  const rows = components
    .map(
      (component) =>
        `- **${component.name}** (${component.kind}; ${component.statuses.join(", ")}): ${component.pages.map((page) => `\`${page}\``).join(", ")}`
    )
    .join("\n")
  const unattributed = blockers.filter((finding) => !finding.component).length
  return `\n### Markdown and TXT fidelity\n\n${report.pathCount} routes checked; ${blockers.length} new finding(s) across ${components.length} component/HTML types${unattributed ? `; ${unattributed} finding(s) without component attribution` : ""}.\n\n${rows || "No new component findings."}\n\nInspect the new pages and evidence in the JSON artifact. Fix a handler for observed drops or missing content; review unverifiable content. Baseline findings remain visible as existing debt, not approved losses. Accept an intentional omission only with a justified entry in src/scripts/markdown-fidelity-exceptions.ts.\n`
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  const parsed = parseCliArguments(argv)
  const { report, exitCode, blockers, warnOnly } = await runMarkdownFidelity(argv)
  const counts = Object.entries(report.counts)
    .map(([status, count]) => `${status}=${count}`)
    .join(" ")
  console.log(`Markdown fidelity: paths=${report.pathCount} ${counts}`)
  if (parsed.updateBaseline)
    console.log(
      `Updated Markdown fidelity baseline: ${baselineFromFindings(report.findings).identities.length} known finding(s); existing debt remains visible in reports.`
    )
  if (parsed.mode === "focused") console.log(formatFocusedFindings(report.findings))
  if (blockers.length > 0) {
    const names = [...new Set(blockers.flatMap((finding) => (finding.component ? [finding.component] : [])))].sort()
    const message = `Markdown fidelity found ${blockers.length} new finding(s)${names.length ? ` involving ${names.join(", ")}` : ""}. Check ${DEFAULT_REPORT_PATH} for affected pages. Add or fix a Markdown handler for an observed drop or missing content; review unverifiable content and record justified exceptions in src/scripts/markdown-fidelity-exceptions.ts.`
    console.error(message)
    if (warnOnly && process.env.GITHUB_ACTIONS === "true")
      console.error(`::warning::${message.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A")}`)
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    await fs
      .appendFile(process.env.GITHUB_STEP_SUMMARY, formatJobSummary(report, blockers))
      .catch((error) => console.warn(`Job summary unavailable: ${error instanceof Error ? error.message : error}`))
  }
  process.exitCode = exitCode
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
