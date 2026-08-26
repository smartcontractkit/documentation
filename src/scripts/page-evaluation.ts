import { randomUUID } from "node:crypto"
import { constants as fsConstants, promises as fs } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  TestSuiteConfigSchema,
  loadApiProvider as loadPromptfooProvider,
  type ApiProvider,
  type EvaluateTestSuite,
} from "promptfoo"
import { z } from "astro/zod"
import { evaluationSchema, type Evaluation } from "../config/evaluation.ts"
import { creReadDataFeedsEval } from "../../evals/cre-read-data-feeds/definition.ts"
import {
  GENERATED_RESPONSE_TOKEN,
  createPromptfooConfig,
  type PromptfooConfigInput,
} from "../../evals/cre-read-data-feeds/promptfooconfig.ts"

const yamlModule = createRequire(import.meta.url)("js-yaml") as { load(source: string): unknown }
const loadYaml = yamlModule.load

const frontmatterSchema = z.object({ title: z.unknown().optional(), evaluation: z.unknown().optional() }).passthrough()
const registrySchema = z.object({ skills: z.array(z.unknown()) }).passthrough()
const registryEntrySchema = z.object({ id: z.unknown(), path: z.unknown().optional() }).passthrough()
const fixtureSchema = z.object({ response: z.string(), grade: z.unknown() }).strict()
const gradeSchema = z
  .object({
    outcomes: z.array(
      z
        .object({
          outcome: z.string(),
          pass: z.boolean(),
          evidence: z.string(),
          reason: z.string(),
        })
        .strict()
    ),
  })
  .strict()

export type EvalDefinition = {
  id: string
  page: string
  task: string
}

type Page = {
  path: string
  source: string
  title?: string
  evaluation?: Evaluation
}

type OutcomeResult = {
  outcome: string
  pass: boolean
  evidence: string
  reason: string
}

export type CliOptions = {
  rootDir?: string
  env?: NodeJS.ProcessEnv
  now?: () => Date
  stdout?: (line: string) => void
  stderr?: (line: string) => void
  definitions?: readonly EvalDefinition[]
  configFactory?: (input: PromptfooConfigInput) => EvaluateTestSuite
  loadProvider?: (id: string) => Promise<ApiProvider>
}

type ParsedCommand =
  | { name: "inventory"; skill?: string }
  | { name: "changed"; paths: string[] }
  | { name: "run"; evalId: string; skillsRepo: string; fixture?: "known-bad" }

const definitions: readonly EvalDefinition[] = [creReadDataFeedsEval]
const hostedProviderPrefixes = [
  "openai:",
  "anthropic:",
  "google:",
  "palm:",
  "vertex:",
  "azure:",
  "azureopenai:",
  "bedrock:",
  "mistral:",
  "groq:",
  "xai:",
  "cohere:",
  "togetherai:",
] as const
const forbiddenProviderCapabilityPattern =
  /(?:^|[:/._-])(?:(?:agents?|assistants?|codex|chatkit)(?=$|[:/._-])|claude(?:[:/._-]+)code|claude(?:[:/._-]+)agent(?:[:/._-]+)sdk)/i
const literalProviderIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/
const evalIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
const evalIdDiagnostic = "expected an eval ID matching /^[A-Za-z0-9][A-Za-z0-9._-]*$/"

function fieldPath(parts: readonly PropertyKey[]): string {
  return parts.reduce<string>((result, part) => {
    if (typeof part === "number") return `${result}[${part}]`
    return result ? `${result}.${String(part)}` : String(part)
  }, "")
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function isEvalId(value: unknown): value is string {
  return typeof value === "string" && evalIdPattern.test(value)
}

function isWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate)
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
}

function errorCode(error: unknown): unknown {
  return typeof error === "object" && error !== null ? Reflect.get(error, "code") : undefined
}

function isHostedProviderId(id: string): boolean {
  if (!literalProviderIdPattern.test(id)) return false
  const hostedPrefix = hostedProviderPrefixes.find((prefix) => id.startsWith(prefix))
  return hostedPrefix !== undefined && !forbiddenProviderCapabilityPattern.test(id.slice(hostedPrefix.length))
}

async function prepareRunsDirectory(rootReal: string): Promise<string> {
  const evalsPath = path.join(rootReal, "evals")
  const evalsStat = await fs.lstat(evalsPath)
  if (evalsStat.isSymbolicLink() || !evalsStat.isDirectory()) {
    throw new Error("evals: expected a non-symlink directory")
  }
  const evalsReal = await fs.realpath(evalsPath)
  if (!isWithin(rootReal, evalsReal)) throw new Error("evals: real path escapes the repository")

  const runsPath = path.join(evalsReal, "runs")
  try {
    await fs.mkdir(runsPath, { mode: 0o700 })
  } catch (error) {
    if (errorCode(error) !== "EEXIST") throw error
  }
  const runsStat = await fs.lstat(runsPath)
  if (runsStat.isSymbolicLink() || !runsStat.isDirectory()) {
    throw new Error("evals/runs: expected a non-symlink directory")
  }
  const runsReal = await fs.realpath(runsPath)
  if (!isWithin(rootReal, runsReal)) throw new Error("evals/runs: real path escapes the repository")
  return runsReal
}

function safeMdxPath(input: string): string | undefined {
  if (!input || path.isAbsolute(input) || input.includes("\\")) return undefined
  const normalized = path.posix.normalize(input)
  if (
    normalized !== input ||
    normalized === "." ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    path.posix.extname(normalized) !== ".mdx"
  ) {
    return undefined
  }
  return normalized
}

function parseArgs(argv: readonly string[]): { command?: ParsedCommand; errors: string[] } {
  const errors: string[] = []
  const [name, ...args] = argv

  if (name === "inventory") {
    let skill: string | undefined
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] !== "--skill") {
        errors.push(`arguments: unexpected ${args[index]}`)
        continue
      }
      const value = args[++index]
      if (!value || value.startsWith("--")) {
        errors.push("arguments: --skill requires a nonblank ID")
        index -= value?.startsWith("--") ? 1 : 0
      } else if (skill !== undefined) {
        errors.push("arguments: --skill may be supplied only once")
      } else {
        skill = value
      }
    }
    return { command: { name, ...(skill === undefined ? {} : { skill }) }, errors }
  }

  if (name === "changed") {
    const paths: string[] = []
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] !== "--path") {
        errors.push(`arguments: unexpected ${args[index]}`)
        continue
      }
      const start = paths.length
      while (args[index + 1] && !args[index + 1].startsWith("--")) paths.push(args[++index])
      if (paths.length === start) errors.push("arguments: --path requires at least one MDX path")
    }
    if (paths.length === 0 && !errors.some((error) => error.includes("--path requires"))) {
      errors.push("arguments: changed requires --path with at least one MDX path")
    }
    return { command: { name, paths }, errors }
  }

  if (name === "run") {
    let evalId: string | undefined
    let skillsRepo: string | undefined
    let fixture: string | undefined
    for (let index = 0; index < args.length; index += 1) {
      const flag = args[index]
      if (flag !== "--eval" && flag !== "--skills-repo" && flag !== "--fixture") {
        errors.push(`arguments: unexpected ${flag}`)
        continue
      }
      const value = args[++index]
      if (!value || value.startsWith("--")) {
        errors.push(`arguments: ${flag} requires a value`)
        index -= value?.startsWith("--") ? 1 : 0
        continue
      }
      if (flag === "--eval") {
        if (evalId !== undefined) {
          errors.push("arguments: --eval may be supplied only once")
        } else {
          evalId = value
          if (!isEvalId(value)) errors.push(`arguments: --eval: ${evalIdDiagnostic}`)
        }
      } else if (flag === "--skills-repo") {
        if (skillsRepo !== undefined) errors.push("arguments: --skills-repo may be supplied only once")
        else skillsRepo = value
      } else if (fixture !== undefined) {
        errors.push("arguments: --fixture may be supplied only once")
      } else {
        fixture = value
      }
    }
    if (!evalId) errors.push("arguments: run requires --eval <id>")
    if (!skillsRepo) errors.push("arguments: run requires --skills-repo <path>")
    if (fixture !== undefined && fixture !== "known-bad") errors.push(`arguments: unknown fixture ${fixture}`)
    if (!evalId || !skillsRepo || (fixture !== undefined && fixture !== "known-bad")) return { errors }
    return { command: { name, evalId, skillsRepo, ...(fixture ? { fixture } : {}) }, errors }
  }

  errors.push(name ? `arguments: unknown command ${name}` : "arguments: expected inventory, changed, or run")
  return { errors }
}

async function readPage(rootReal: string, relativePath: string): Promise<{ page?: Page; errors: string[] }> {
  const errors: string[] = []
  const safePath = safeMdxPath(relativePath)
  if (!safePath) return { errors: [`${relativePath || "<empty>"}: expected a safe repository-relative .mdx path`] }

  const absolutePath = path.resolve(rootReal, safePath)
  if (!isWithin(rootReal, absolutePath)) return { errors: [`${safePath}: path escapes the repository`] }

  let realPath: string
  let source: string
  try {
    realPath = await fs.realpath(absolutePath)
    if (!isWithin(rootReal, realPath)) return { errors: [`${safePath}: real path escapes the repository`] }
    if (!(await fs.stat(realPath)).isFile()) return { errors: [`${safePath}: not a file`] }
    source = await fs.readFile(realPath, "utf8")
  } catch (error) {
    return { errors: [`${safePath}: ${message(error)}`] }
  }

  const opening = /^---[ \t]*\r?\n/.exec(source)
  if (!opening) return { page: { path: safePath, source }, errors }
  const rest = source.slice(opening[0].length)
  const closing = /^---[ \t]*\r?$/m.exec(rest)
  if (!closing) return { errors: [`${safePath} frontmatter: missing closing ---`] }

  let parsedYaml: unknown
  try {
    parsedYaml = loadYaml(rest.slice(0, closing.index))
  } catch (error) {
    return { errors: [`${safePath} frontmatter: ${message(error)}`] }
  }
  const checkedFrontmatter = frontmatterSchema.safeParse(parsedYaml)
  if (!checkedFrontmatter.success) return { errors: [`${safePath} frontmatter: expected a YAML mapping`] }
  const frontmatter = checkedFrontmatter.data

  const hasEvaluation = Object.prototype.hasOwnProperty.call(frontmatter, "evaluation")
  const title = typeof frontmatter.title === "string" ? frontmatter.title.trim() : undefined
  if (hasEvaluation && !title) errors.push(`${safePath} title: expected a nonblank string`)

  let evaluation: Evaluation | undefined
  if (hasEvaluation) {
    const result = evaluationSchema.safeParse(frontmatter.evaluation)
    if (result.success) evaluation = result.data
    else {
      for (const issue of result.error.issues) {
        const suffix = fieldPath(issue.path)
        errors.push(`${safePath} evaluation${suffix ? `.${suffix}` : ""}: ${issue.message}`)
      }
    }
  }

  return {
    page: { path: safePath, source, ...(title ? { title } : {}), ...(evaluation ? { evaluation } : {}) },
    errors,
  }
}

async function discoverMdx(rootReal: string): Promise<{ paths: string[]; errors: string[] }> {
  const contentRoot = path.join(rootReal, "src", "content")
  const paths: string[] = []
  const errors: string[] = []

  async function walk(directory: string): Promise<void> {
    let entries
    try {
      entries = await fs.readdir(directory, { withFileTypes: true })
    } catch (error) {
      errors.push(`${path.relative(rootReal, directory)}: ${message(error)}`)
      return
    }
    entries.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) await walk(absolute)
      else if (entry.isFile() && entry.name.endsWith(".mdx"))
        paths.push(path.relative(rootReal, absolute).split(path.sep).join("/"))
    }
  }

  await walk(contentRoot)
  return { paths, errors }
}

async function loadPages(rootReal: string, paths: readonly string[]): Promise<{ pages: Page[]; errors: string[] }> {
  const pages: Page[] = []
  const errors: string[] = []
  for (const mdxPath of paths) {
    const result = await readPage(rootReal, mdxPath)
    errors.push(...result.errors)
    if (result.page) pages.push(result.page)
  }
  return { pages, errors }
}

function duplicateEvalErrors(pages: readonly Page[]): string[] {
  const declarations = new Map<string, string[]>()
  for (const page of pages) {
    page.evaluation?.evals?.forEach((id, index) => {
      const locations = declarations.get(id) ?? []
      locations.push(`${page.path} evaluation.evals[${index}]`)
      declarations.set(id, locations)
    })
  }
  return [...declarations.entries()].flatMap(([id, locations]) =>
    locations.length > 1 ? locations.map((location) => `${location}: duplicate eval ID ${id}`) : []
  )
}

function inventoryRow(page: Page) {
  return {
    path: page.path,
    title: page.title,
    evals: page.evaluation?.evals ?? [],
    skills: page.evaluation?.skills ?? [],
    usableBy: page.evaluation?.usableBy ?? [],
    outcomes: page.evaluation?.outcomes ?? [],
  }
}

function validateDefinitions(items: readonly EvalDefinition[]): string[] {
  const errors: string[] = []
  items.forEach((definition, index) => {
    if (!isEvalId(definition.id)) {
      errors.push(`definitions[${index}].id: ${evalIdDiagnostic}`)
    }
    if (typeof definition.page !== "string" || !safeMdxPath(definition.page)) {
      errors.push(`definitions[${index}].page: expected a safe repository-relative .mdx path`)
    }
    if (typeof definition.task !== "string" || !definition.task.trim()) {
      errors.push(`definitions[${index}].task: expected a nonblank string`)
    }
  })
  return errors
}

async function loadSkillRoots(
  skillsRepo: string,
  page: Page | undefined,
  errors: string[]
): Promise<{ contents: string[] }> {
  const contents: string[] = []
  let repoReal: string
  try {
    repoReal = await fs.realpath(skillsRepo)
    if (!(await fs.stat(repoReal)).isDirectory()) throw new Error("not a directory")
  } catch (error) {
    errors.push(`--skills-repo ${skillsRepo}: ${message(error)}`)
    return { contents }
  }

  let parsedRegistry: unknown
  try {
    parsedRegistry = loadYaml(await fs.readFile(path.join(repoReal, "skillbench.yaml"), "utf8"))
  } catch (error) {
    errors.push(`${skillsRepo}/skillbench.yaml: ${message(error)}`)
    return { contents }
  }
  const checkedRegistry = registrySchema.safeParse(parsedRegistry)
  if (!checkedRegistry.success) {
    errors.push(`${skillsRepo}/skillbench.yaml skills: expected an array`)
    return { contents }
  }

  const entries = checkedRegistry.data.skills.flatMap((entry) => {
    const checkedEntry = registryEntrySchema.safeParse(entry)
    return checkedEntry.success ? [checkedEntry.data] : []
  })
  for (const [index, id] of (page?.evaluation?.skills ?? []).entries()) {
    const field = `${page?.path} evaluation.skills[${index}]`
    const matches = entries.filter((entry) => entry.id === id)
    if (matches.length === 0) {
      errors.push(`${field}: skill ${id} is missing from skillbench.yaml`)
      continue
    }
    if (matches.length > 1) {
      errors.push(`${field}: skill ${id} is duplicated in skillbench.yaml`)
      continue
    }
    const skillPath = matches[0].path
    if (typeof skillPath !== "string" || !skillPath.trim()) {
      errors.push(`${field}: registry path must be a nonblank string`)
      continue
    }

    const resolved = path.resolve(repoReal, skillPath)
    if (!isWithin(repoReal, resolved)) {
      errors.push(`${field}: registry path escapes the supplied skills repository`)
      continue
    }

    let skillReal: string
    try {
      skillReal = await fs.realpath(resolved)
    } catch {
      errors.push(`${field}: registered skill directory does not exist`)
      continue
    }
    if (!isWithin(repoReal, skillReal)) {
      errors.push(`${field}: registered skill real path escapes the supplied skills repository`)
      continue
    }

    const rootSkill = path.join(skillReal, "SKILL.md")
    try {
      const rootSkillReal = await fs.realpath(rootSkill)
      if (!isWithin(skillReal, rootSkillReal) || !(await fs.stat(rootSkillReal)).isFile()) {
        throw new Error("not a contained file")
      }
      contents.push(await fs.readFile(rootSkillReal, "utf8"))
    } catch {
      errors.push(`${field}: root SKILL.md is missing or escapes the registered skill directory`)
    }
  }
  return { contents }
}

async function outputIsIgnored(rootReal: string): Promise<string | undefined> {
  try {
    const lines = (await fs.readFile(path.join(rootReal, ".gitignore"), "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
    if (lines.includes("evals/runs/") || lines.includes("/evals/runs/")) return undefined
    return ".gitignore: evals/runs/ must be ignored"
  } catch (error) {
    return `.gitignore: ${message(error)}`
  }
}

function significantWords(text: string): Set<string> {
  const ignored: Record<string, true> = {
    about: true,
    against: true,
    every: true,
    from: true,
    into: true,
    only: true,
    response: true,
    their: true,
    these: true,
    those: true,
    through: true,
    using: true,
    value: true,
    values: true,
    with: true,
  }
  return new Set((text.toLowerCase().match(/[a-z0-9-]{5,}/g) ?? []).filter((word) => !ignored[word]))
}

export function validateGrade(value: unknown, response: string, outcomes: readonly string[]): OutcomeResult[] {
  let grade: unknown = value
  if (typeof value === "string") {
    try {
      grade = JSON.parse(value)
    } catch (error) {
      throw new Error(`grader output is not strict JSON: ${message(error)}`)
    }
  }
  const checkedGrade = gradeSchema.safeParse(grade)
  if (!checkedGrade.success)
    throw new Error(`grader output has an invalid shape: ${checkedGrade.error.issues[0]?.message}`)
  if (checkedGrade.data.outcomes.length !== outcomes.length) {
    throw new Error(`grader outcomes must contain exactly ${outcomes.length} results`)
  }

  return checkedGrade.data.outcomes.map((item, index) => {
    const field = `grader outcomes[${index}]`
    if (item.outcome !== outcomes[index]) throw new Error(`${field}.outcome: must exactly match the source outcome`)
    if (item.pass && !item.evidence) {
      throw new Error(`${field}.evidence: passing outcomes require an exact response quote`)
    }
    if (item.evidence && !item.evidence.trim()) {
      throw new Error(`${field}.evidence: expected an exact response quote or an empty string`)
    }
    if (item.evidence && !response.includes(item.evidence)) {
      throw new Error(`${field}.evidence: must be an exact response quote`)
    }
    if (!item.evidence && response.trim()) {
      const responseWords = significantWords(response)
      if ([...significantWords(outcomes[index])].some((word) => responseWords.has(word))) {
        throw new Error(`${field}.evidence: may be empty only when the response has no relevant text`)
      }
    }
    if (!item.reason.trim() || item.reason.length > 240 || /[\r\n]/.test(item.reason)) {
      throw new Error(`${field}.reason: expected short nonblank plain text`)
    }
    return { outcome: item.outcome, pass: item.pass, evidence: item.evidence, reason: item.reason }
  })
}

function configPrompts(config: EvaluateTestSuite): { generator?: string; grader?: string; errors: string[] } {
  const errors: string[] = []
  const generator = config.prompts.length === 1 && typeof config.prompts[0] === "string" ? config.prompts[0] : undefined
  if (!generator) errors.push("promptfoo config prompts: expected exactly one string generator prompt")

  let grader: string | undefined
  if (Array.isArray(config.tests) && config.tests.length === 1) {
    const test = config.tests[0]
    if (
      typeof test === "object" &&
      test !== null &&
      "assert" in test &&
      Array.isArray(test.assert) &&
      test.assert.length === 1
    ) {
      const assertion = test.assert[0]
      if (
        typeof assertion === "object" &&
        assertion !== null &&
        "type" in assertion &&
        assertion.type === "llm-rubric" &&
        "value" in assertion &&
        typeof assertion.value === "string"
      ) {
        grader = assertion.value
      }
    }
  }
  if (!grader || !grader.includes(GENERATED_RESPONSE_TOKEN)) {
    errors.push("promptfoo config tests[0].assert[0]: expected one llm-rubric containing GENERATED_RESPONSE_TOKEN")
  }
  return { generator, grader, errors }
}

async function executeRun(
  command: Extract<ParsedCommand, { name: "run" }>,
  rootReal: string,
  options: Required<
    Pick<CliOptions, "env" | "now" | "stdout" | "stderr" | "definitions" | "configFactory" | "loadProvider">
  >
): Promise<number> {
  const errors = validateDefinitions(options.definitions)
  if (errors.length) {
    errors.forEach((error) => options.stderr(`ERROR ${error}`))
    return 1
  }
  const discovery = await discoverMdx(rootReal)
  errors.push(...discovery.errors)
  const loaded = await loadPages(rootReal, discovery.paths)
  errors.push(...loaded.errors, ...duplicateEvalErrors(loaded.pages))

  const matchingDefinitions = options.definitions.filter((definition) => definition.id === command.evalId)
  if (matchingDefinitions.length === 0) errors.push(`--eval ${command.evalId}: unknown eval ID`)
  if (matchingDefinitions.length > 1) errors.push(`--eval ${command.evalId}: ambiguous eval definition`)

  const matchingPages = loaded.pages.filter((page) => page.evaluation?.evals?.includes(command.evalId))
  if (matchingPages.length === 0) errors.push(`--eval ${command.evalId}: no page declares this eval ID`)
  if (matchingPages.length > 1) errors.push(`--eval ${command.evalId}: ambiguous page declaration`)
  const definition = matchingDefinitions.length === 1 ? matchingDefinitions[0] : undefined
  const page = matchingPages.length === 1 ? matchingPages[0] : undefined

  if (definition && page && definition.page !== page.path) {
    const index = page.evaluation?.evals?.indexOf(command.evalId) ?? 0
    errors.push(`${page.path} evaluation.evals[${index}]: definition points to ${definition.page}`)
  }
  if (page && !page.evaluation?.usableBy.includes("agent")) {
    errors.push(`${page.path} evaluation.usableBy: run requires agent usability`)
  }
  if (page && !page.evaluation?.outcomes.length) {
    errors.push(`${page.path} evaluation.outcomes: run requires at least one outcome`)
  }

  const skillRoots = await loadSkillRoots(path.resolve(rootReal, command.skillsRepo), page, errors)
  const ignoreError = await outputIsIgnored(rootReal)
  if (ignoreError) errors.push(ignoreError)

  let fixture: { response: string; grade: unknown } | undefined
  let outcomeResults: OutcomeResult[] | undefined
  let generatorPrompt: string | undefined
  let graderPrompt: string | undefined
  let generatorId: string | undefined
  let graderId: string | undefined

  if (command.fixture) {
    try {
      const parsedFixture: unknown = JSON.parse(
        await fs.readFile(path.join(rootReal, "evals", command.evalId, "fixtures", `${command.fixture}.json`), "utf8")
      )
      const checkedFixture = fixtureSchema.safeParse(parsedFixture)
      if (!checkedFixture.success || !("grade" in checkedFixture.data)) {
        errors.push(`${command.fixture} fixture: expected response and grade`)
      } else {
        const { response: fixtureResponse, grade: fixtureGrade } = checkedFixture.data
        fixture = { response: fixtureResponse, grade: fixtureGrade }
        if (page) {
          try {
            outcomeResults = validateGrade(fixtureGrade, fixtureResponse, page.evaluation?.outcomes ?? [])
          } catch (error) {
            errors.push(`${command.fixture} fixture: ${message(error)}`)
          }
        }
      }
    } catch (error) {
      errors.push(`${command.fixture} fixture: ${message(error)}`)
    }
  } else {
    generatorId = options.env.PROMPTFOO_WITH_SKILL_PROVIDER?.trim()
    graderId = options.env.PROMPTFOO_GRADER_PROVIDER?.trim()
    if (!generatorId) errors.push("PROMPTFOO_WITH_SKILL_PROVIDER: expected a nonblank provider ID")
    if (!graderId) errors.push("PROMPTFOO_GRADER_PROVIDER: expected a nonblank provider ID")
    if (generatorId && graderId && generatorId === graderId) {
      errors.push("provider IDs: generator and grader must be distinct")
    }
    if (generatorId && !isHostedProviderId(generatorId)) {
      errors.push("PROMPTFOO_WITH_SKILL_PROVIDER: expected an approved hosted native provider ID")
    }
    if (graderId && !isHostedProviderId(graderId)) {
      errors.push("PROMPTFOO_GRADER_PROVIDER: expected an approved hosted native provider ID")
    }

    if (
      definition &&
      page &&
      generatorId &&
      graderId &&
      isHostedProviderId(generatorId) &&
      isHostedProviderId(graderId)
    ) {
      let config: EvaluateTestSuite | undefined
      try {
        config = options.configFactory({
          pageMdx: page.source,
          rootSkill: skillRoots.contents.join("\n\n"),
          task: definition.task,
          outcomes: page.evaluation?.outcomes ?? [],
          generatorProvider: generatorId,
          graderProvider: graderId,
        })
      } catch (error) {
        errors.push(`promptfoo config: ${message(error)}`)
      }
      if (config) {
        const checked = TestSuiteConfigSchema.safeParse(config)
        if (!checked.success) {
          for (const issue of checked.error.issues) {
            errors.push(`promptfoo config${issue.path.length ? `.${fieldPath(issue.path)}` : ""}: ${issue.message}`)
          }
        } else {
          const prompts = configPrompts(config)
          errors.push(...prompts.errors)
          generatorPrompt = prompts.generator
          graderPrompt = prompts.grader
        }
      }
    }
  }

  if (errors.length) {
    errors.forEach((error) => options.stderr(`ERROR ${error}`))
    return 1
  }

  let runsReal: string
  try {
    runsReal = await prepareRunsDirectory(rootReal)
  } catch (error) {
    options.stderr(`ERROR ${message(error)}`)
    return 1
  }

  let response: string
  let providers: { generator: string | null; grader: string | null }
  let providerCalls: number

  if (fixture && outcomeResults) {
    response = fixture.response
    providers = { generator: null, grader: null }
    providerCalls = 0
  } else {
    if (!generatorId || !graderId || !generatorPrompt || !graderPrompt || !page) {
      options.stderr("ERROR runner: incomplete real-run preflight")
      return 1
    }
    const settled = await Promise.allSettled([options.loadProvider(generatorId), options.loadProvider(graderId)])
    const providerErrors = settled.flatMap((result, index) =>
      result.status === "rejected" ? [`${index === 0 ? "generator" : "grader"} provider could not be loaded`] : []
    )
    if (providerErrors.length || settled[0].status !== "fulfilled" || settled[1].status !== "fulfilled") {
      providerErrors.forEach((error) => options.stderr(`ERROR ${error}`))
      return 1
    }
    const generator = settled[0].value
    const grader = settled[1].value
    let resolvedGenerator: string
    let resolvedGrader: string
    try {
      resolvedGenerator = generator.id()
      resolvedGrader = grader.id()
    } catch {
      options.stderr("ERROR provider identity could not be resolved")
      return 1
    }
    if (!resolvedGenerator.trim() || !resolvedGrader.trim() || resolvedGenerator === resolvedGrader) {
      options.stderr("ERROR provider identity: generator and grader must resolve to distinct nonblank IDs")
      return 1
    }

    let generated
    try {
      generated = await generator.callApi(generatorPrompt)
    } catch {
      options.stderr("ERROR generator provider call failed")
      return 1
    }
    if (generated.error) {
      options.stderr("ERROR generator provider returned an error")
      return 1
    }
    if (typeof generated.output !== "string") {
      options.stderr("ERROR generator provider: expected string output")
      return 1
    }
    response = generated.output

    let graded
    try {
      const prompt = graderPrompt.replaceAll(GENERATED_RESPONSE_TOKEN, response)
      graded = await grader.callApi(prompt)
    } catch {
      options.stderr("ERROR grader provider call failed")
      return 1
    }
    if (graded.error) {
      options.stderr("ERROR grader provider returned an error")
      return 1
    }
    if (typeof graded.output !== "string") {
      options.stderr("ERROR grader provider: expected string output")
      return 1
    }
    try {
      outcomeResults = validateGrade(graded.output, response, page?.evaluation?.outcomes ?? [])
    } catch (error) {
      options.stderr(`ERROR grader provider: ${message(error)}`)
      return 1
    }
    providers = { generator: resolvedGenerator, grader: resolvedGrader }
    providerCalls = 2
  }

  if (!page?.evaluation || !outcomeResults) {
    options.stderr("ERROR runner: incomplete completed run")
    return 1
  }
  const selectedPage = page
  const selectedEvaluation = page.evaluation
  const timestamp = `${options.now().toISOString().slice(0, 19).replace(/[-:]/g, "")}Z`
  const outputFlags =
    fsConstants.O_WRONLY |
    fsConstants.O_CREAT |
    fsConstants.O_EXCL |
    (typeof fsConstants.O_NOFOLLOW === "number" ? fsConstants.O_NOFOLLOW : 0)
  let record
  let relativeOutput
  for (;;) {
    const runId = `${timestamp}-${command.evalId}-${randomUUID()}`
    record = {
      schemaVersion: 1,
      runId,
      kind: command.fixture ? "fixture" : "model",
      evalId: command.evalId,
      page: selectedPage.path,
      skills: selectedEvaluation.skills ?? [],
      usableBy: selectedEvaluation.usableBy,
      outcomes: selectedEvaluation.outcomes,
      providers,
      response,
      outcomeResults,
      overallPass: outcomeResults.every((outcome) => outcome.pass),
      providerCalls,
    }
    relativeOutput = `evals/runs/${runId}.json`
    try {
      await fs.writeFile(path.join(runsReal, `${runId}.json`), `${JSON.stringify(record, null, 2)}\n`, {
        encoding: "utf8",
        flag: outputFlags,
        mode: 0o600,
      })
      break
    } catch (error) {
      if (errorCode(error) !== "EEXIST" && errorCode(error) !== "ELOOP") throw error
    }
  }
  const passed = record.outcomeResults.filter((outcome) => outcome.pass).length
  options.stdout(
    `${record.overallPass ? "PASS" : "FAIL"} ${record.evalId} ${passed}/${record.outcomeResults.length} ${relativeOutput}`
  )
  return 0
}

export async function runPageEvaluationCli(argv: readonly string[], options: CliOptions = {}): Promise<number> {
  const stdout = options.stdout ?? console.log
  const stderr = options.stderr ?? console.error
  const parsed = parseArgs(argv)
  if (parsed.errors.length || !parsed.command) {
    parsed.errors.forEach((error) => stderr(`ERROR ${error}`))
    return 1
  }

  let rootReal: string
  try {
    rootReal = await fs.realpath(options.rootDir ?? process.cwd())
  } catch (error) {
    stderr(`ERROR repository: ${message(error)}`)
    return 1
  }

  try {
    if (parsed.command.name === "run") {
      return await executeRun(parsed.command, rootReal, {
        env: options.env ?? process.env,
        now: options.now ?? (() => new Date()),
        stdout,
        stderr,
        definitions: options.definitions ?? definitions,
        configFactory: options.configFactory ?? createPromptfooConfig,
        loadProvider: options.loadProvider ?? loadPromptfooProvider,
      })
    }

    let paths: string[]
    const errors: string[] = []
    if (parsed.command.name === "inventory") {
      const discovery = await discoverMdx(rootReal)
      paths = discovery.paths
      errors.push(...discovery.errors)
    } else {
      paths = parsed.command.paths
      paths.forEach((mdxPath) => {
        if (!safeMdxPath(mdxPath)) errors.push(`${mdxPath || "<empty>"}: expected a safe repository-relative .mdx path`)
      })
    }

    const loaded = await loadPages(
      rootReal,
      paths.filter((mdxPath) => safeMdxPath(mdxPath))
    )
    errors.push(...loaded.errors)
    if (parsed.command.name === "inventory") errors.push(...duplicateEvalErrors(loaded.pages))
    if (errors.length) {
      errors.forEach((error) => stderr(`ERROR ${error}`))
      return 1
    }

    if (parsed.command.name === "inventory") {
      const skill = parsed.command.skill
      loaded.pages
        .filter((page) => page.evaluation && (!skill || page.evaluation.skills?.includes(skill)))
        .forEach((page) => stdout(JSON.stringify(inventoryRow(page))))
    } else {
      loaded.pages.forEach((page) =>
        stdout(JSON.stringify(page.evaluation ? inventoryRow(page) : { path: page.path, status: "not enrolled" }))
      )
    }
    return 0
  } catch (error) {
    stderr(`ERROR ${message(error)}`)
    return 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runPageEvaluationCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code
  })
}
