import { afterEach, describe, expect, jest, test } from "@jest/globals"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import type { ApiProvider, EvaluateTestSuite } from "promptfoo"
import { runPageEvaluationCli, validateGrade, type CliOptions, type EvalDefinition } from "./page-evaluation.ts"

const evalId = "test-eval"
const pagePath = "src/content/evaluated.mdx"
const skillId = "test-skill"
const outcomes = ["Alpha requirement is covered.", "Beta requirement is covered.", "Gamma requirement is covered."]
const definition: EvalDefinition = { id: evalId, page: pagePath, task: "Answer the bounded task." }
const temporaryRoots: string[] = []
const generatorProviderId = "openai:chat:gpt-4.1"
const graderProviderId = "anthropic:messages:claude-3-5-sonnet-latest"
const providerEnv = {
  PROMPTFOO_WITH_SKILL_PROVIDER: generatorProviderId,
  PROMPTFOO_GRADER_PROVIDER: graderProviderId,
}
const evalIdDiagnostic = "expected an eval ID matching /^[A-Za-z0-9][A-Za-z0-9._-]*$/"
const invalidEvalIds: [string, string][] = [
  ["slash traversal", "group/../../outside"],
  ["leading traversal", "../outside"],
  ["backslash", "group\\name"],
  ["dot-only", "."],
  ["dot-dot", ".."],
  ["whitespace", "group name"],
  ["control", "group\u0000name"],
  ["Unicode", "éval"],
  ["template", ["$", "{EVAL_ID}"].join("")],
  ["path metacharacter", "namespace:eval"],
  ["shell metacharacter", "eval;touch"],
]

type Sandbox = {
  root: string
  skillsRepo: string
  stdout: string[]
  stderr: string[]
  run: (args: readonly string[], overrides?: CliOptions) => Promise<number>
}

async function writeFile(root: string, relativePath: string, content: string): Promise<void> {
  const absolutePath = path.join(root, relativePath)
  await fs.mkdir(path.dirname(absolutePath), { recursive: true })
  await fs.writeFile(absolutePath, content, "utf8")
}

function evaluatedPage(
  input: { title?: string; usableBy?: string[]; skills?: string[]; evals?: string[] } = {}
): string {
  const title = input.title ?? "Evaluated page"
  const usableBy = input.usableBy ?? ["human", "agent"]
  const skills = input.skills ?? [skillId]
  const evals = input.evals ?? [evalId]
  return `---\ntitle: ${JSON.stringify(title)}\nevaluation:\n  evals: ${JSON.stringify(evals)}\n  skills: ${JSON.stringify(skills)}\n  usableBy: ${JSON.stringify(usableBy)}\n  outcomes: ${JSON.stringify(outcomes)}\n---\nComplete MDX body.\n`
}

function fixtureGrade() {
  return {
    outcomes: outcomes.map((outcome, index) => ({
      outcome,
      pass: index < 2,
      evidence: index === 0 ? "Alpha answer." : index === 1 ? "Beta answer." : "Wrong gamma answer.",
      reason: index < 2 ? "The response satisfies this requirement." : "The response gets this requirement wrong.",
    })),
  }
}

async function makeSandbox(): Promise<Sandbox> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "page-evaluation-"))
  temporaryRoots.push(root)
  const skillsRepo = path.join(root, "skills-repo")
  await writeFile(root, pagePath, evaluatedPage())
  await writeFile(
    root,
    "src/content/pilot.mdx",
    `---\ntitle: Pilot\nevaluation:\n  usableBy: [human, agent]\n  outcomes: [Pilot outcome]\n---\nPilot.\n`
  )
  await writeFile(root, "src/content/plain.mdx", `---\ntitle: Plain\n---\nPlain.\n`)
  await writeFile(root, ".gitignore", "evals/runs/\n")
  await writeFile(
    root,
    `evals/${evalId}/fixtures/known-bad.json`,
    `${JSON.stringify({ response: "Alpha answer. Beta answer. Wrong gamma answer.", grade: fixtureGrade() }, null, 2)}\n`
  )
  await writeFile(skillsRepo, "skillbench.yaml", `skills:\n  - id: ${skillId}\n    path: ${skillId}\n`)
  await writeFile(skillsRepo, `${skillId}/SKILL.md`, "# Test skill\n")

  const stdout: string[] = []
  const stderr: string[] = []
  return {
    root,
    skillsRepo,
    stdout,
    stderr,
    run: (args, overrides = {}) =>
      runPageEvaluationCli(args, {
        rootDir: root,
        definitions: [definition],
        stdout: (line) => stdout.push(line),
        stderr: (line) => stderr.push(line),
        ...overrides,
      }),
  }
}

afterEach(async () => {
  jest.restoreAllMocks()
  await Promise.all(temporaryRoots.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })))
})

describe("inventory and changed selection", () => {
  test("inventories enrolled pages in stable path order with every required field", async () => {
    const sandbox = await makeSandbox()

    await expect(sandbox.run(["inventory"])).resolves.toBe(0)

    expect(sandbox.stderr).toEqual([])
    expect(sandbox.stdout.map((line) => JSON.parse(line))).toEqual([
      {
        path: pagePath,
        title: "Evaluated page",
        evals: [evalId],
        skills: [skillId],
        usableBy: ["human", "agent"],
        outcomes,
      },
      {
        path: "src/content/pilot.mdx",
        title: "Pilot",
        evals: [],
        skills: [],
        usableBy: ["human", "agent"],
        outcomes: ["Pilot outcome"],
      },
    ])
  })

  test("uses an exact case-sensitive skill filter and succeeds with no unmatched rows", async () => {
    const sandbox = await makeSandbox()

    await expect(sandbox.run(["inventory", "--skill", skillId])).resolves.toBe(0)
    expect(sandbox.stdout).toHaveLength(1)

    sandbox.stdout.length = 0
    await expect(sandbox.run(["inventory", "--skill", skillId.toUpperCase()])).resolves.toBe(0)
    expect(sandbox.stdout).toEqual([])
  })

  test("changed prints only safe supplied paths in repeatable order and labels unannotated pages", async () => {
    const sandbox = await makeSandbox()

    await expect(
      sandbox.run(["changed", "--path", "src/content/plain.mdx", pagePath, "src/content/plain.mdx"])
    ).resolves.toBe(0)

    expect(sandbox.stdout.map((line) => JSON.parse(line))).toEqual([
      { path: "src/content/plain.mdx", status: "not enrolled" },
      {
        path: pagePath,
        title: "Evaluated page",
        evals: [evalId],
        skills: [skillId],
        usableBy: ["human", "agent"],
        outcomes,
      },
      { path: "src/content/plain.mdx", status: "not enrolled" },
    ])
    sandbox.stdout.length = 0
    await expect(sandbox.run(["changed", "--path", "../escape.mdx"])).resolves.toBe(1)
    expect(sandbox.stdout).toEqual([])
  })
})

test("run rejects unknown and ambiguous eval selection before calls or writes", async () => {
  const sandbox = await makeSandbox()
  const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()
  const fixtureArgs = ["--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"]

  await expect(sandbox.run(["run", "--eval", "unknown", ...fixtureArgs], { loadProvider })).resolves.toBe(1)
  await writeFile(sandbox.root, "src/content/duplicate.mdx", evaluatedPage({ title: "Duplicate" }))
  await expect(sandbox.run(["run", "--eval", evalId, ...fixtureArgs], { loadProvider })).resolves.toBe(1)

  expect(loadProvider).not.toHaveBeenCalled()
  expect(sandbox.stdout).toEqual([])
  expect(sandbox.stderr.join("\n")).toContain("unknown eval ID")
  expect(sandbox.stderr.join("\n")).toContain("ambiguous page declaration")
  await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
})

test.each(invalidEvalIds)(
  "rejects %s eval IDs from arguments and definitions before discovery or output",
  async (_case, invalidEvalId) => {
    const sandbox = await makeSandbox()
    const configFactory = jest.fn(() => {
      throw new Error("config must not load")
    })
    const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()
    const options = { env: providerEnv, configFactory, loadProvider }

    await expect(
      sandbox.run(["run", "--eval", invalidEvalId, "--skills-repo", sandbox.skillsRepo], {
        ...options,
        definitions: [definition],
      })
    ).resolves.toBe(1)
    expect(sandbox.stderr).toEqual([`ERROR arguments: --eval: ${evalIdDiagnostic}`])

    sandbox.stderr.length = 0
    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
        ...options,
        definitions: [definition, { ...definition, id: invalidEvalId }],
      })
    ).resolves.toBe(1)

    expect(sandbox.stderr).toEqual([`ERROR definitions[1].id: ${evalIdDiagnostic}`])
    expect(configFactory).not.toHaveBeenCalled()
    expect(loadProvider).not.toHaveBeenCalled()
    expect(sandbox.stdout).toEqual([])
    await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
  }
)

test("agent-ineligible runs finish complete preflight without calls, rows, or writes", async () => {
  const sandbox = await makeSandbox()
  await writeFile(sandbox.root, pagePath, evaluatedPage({ usableBy: ["human"] }))
  const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()

  await expect(
    sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"], {
      loadProvider,
    })
  ).resolves.toBe(1)

  expect(loadProvider).not.toHaveBeenCalled()
  expect(sandbox.stdout).toEqual([])
  expect(sandbox.stderr.join("\n")).toContain(`${pagePath} evaluation.usableBy`)
  await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
})

describe("skill registry preflight", () => {
  test.each([
    ["missing", `skills: []\n`, "is missing from skillbench.yaml"],
    [
      "duplicate",
      `skills:\n  - { id: ${skillId}, path: one }\n  - { id: ${skillId}, path: two }\n`,
      "is duplicated in skillbench.yaml",
    ],
    ["escape", `skills:\n  - { id: ${skillId}, path: ../outside }\n`, "registry path escapes"],
    ["missing SKILL", `skills:\n  - { id: ${skillId}, path: empty-skill }\n`, "root SKILL.md is missing"],
  ])("rejects %s before calls", async (_name, registry, expected) => {
    const sandbox = await makeSandbox()
    await writeFile(sandbox.skillsRepo, "skillbench.yaml", registry)
    if (expected.includes("root SKILL"))
      await fs.mkdir(path.join(sandbox.skillsRepo, "empty-skill"), { recursive: true })
    const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"], {
        loadProvider,
      })
    ).resolves.toBe(1)

    expect(loadProvider).not.toHaveBeenCalled()
    expect(sandbox.stdout).toEqual([])
    expect(sandbox.stderr.join("\n")).toContain(`${pagePath} evaluation.skills[0]`)
    expect(sandbox.stderr.join("\n")).toContain(expected)
    await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
  })
})

describe("contained page and skill files", () => {
  test("rejects a page whose final path is a symlink escaping the repository", async () => {
    const sandbox = await makeSandbox()
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), "page-evaluation-outside-"))
    temporaryRoots.push(outside)
    const outsidePage = path.join(outside, "outside.mdx")
    await fs.writeFile(outsidePage, evaluatedPage(), "utf8")
    await fs.rm(path.join(sandbox.root, pagePath))
    await fs.symlink(outsidePage, path.join(sandbox.root, pagePath))

    await expect(sandbox.run(["changed", "--path", pagePath])).resolves.toBe(1)

    expect(sandbox.stdout).toEqual([])
    expect(sandbox.stderr).toEqual([`ERROR ${pagePath}: real path escapes the repository`])
  })

  test("rejects a directory where a regular page file is required", async () => {
    const sandbox = await makeSandbox()
    await fs.rm(path.join(sandbox.root, pagePath))
    await fs.mkdir(path.join(sandbox.root, pagePath))

    await expect(sandbox.run(["changed", "--path", pagePath])).resolves.toBe(1)

    expect(sandbox.stdout).toEqual([])
    expect(sandbox.stderr).toEqual([`ERROR ${pagePath}: not a file`])
  })

  test("rejects a root SKILL.md symlink escaping the registered skill directory", async () => {
    const sandbox = await makeSandbox()
    const rootSkill = path.join(sandbox.skillsRepo, skillId, "SKILL.md")
    const outsideSkill = path.join(sandbox.skillsRepo, "outside-SKILL.md")
    await fs.writeFile(outsideSkill, "# Outside skill\n", "utf8")
    await fs.rm(rootSkill)
    await fs.symlink(outsideSkill, rootSkill)

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"])
    ).resolves.toBe(1)

    expect(sandbox.stdout).toEqual([])
    expect(sandbox.stderr).toEqual([
      `ERROR ${pagePath} evaluation.skills[0]: root SKILL.md is missing or escapes the registered skill directory`,
    ])
  })

  test("rejects a directory where a regular root SKILL.md file is required", async () => {
    const sandbox = await makeSandbox()
    const rootSkill = path.join(sandbox.skillsRepo, skillId, "SKILL.md")
    await fs.rm(rootSkill)
    await fs.mkdir(rootSkill)

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"])
    ).resolves.toBe(1)

    expect(sandbox.stdout).toEqual([])
    expect(sandbox.stderr).toEqual([
      `ERROR ${pagePath} evaluation.skills[0]: root SKILL.md is missing or escapes the registered skill directory`,
    ])
  })
})

describe("real-run provider and config preflight", () => {
  test("rejects missing or identical environment provider IDs before loading providers", async () => {
    const sandbox = await makeSandbox()
    const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
        env: {
          PROMPTFOO_WITH_SKILL_PROVIDER: generatorProviderId,
          PROMPTFOO_GRADER_PROVIDER: generatorProviderId,
        },
        loadProvider,
      })
    ).resolves.toBe(1)

    expect(loadProvider).not.toHaveBeenCalled()
    expect(sandbox.stdout).toEqual([])
    expect(sandbox.stderr.join("\n")).toContain("generator and grader must be distinct")
  })

  test.each([
    ["OpenAI", "openai:chat:gpt-4.1"],
    ["Anthropic", "anthropic:messages:claude-3-5-sonnet-latest"],
    ["Google Gemini", "google:gemini-2.5-pro"],
    ["Google PaLM", "palm:chat-bison"],
    ["Vertex", "vertex:chat:gemini-2.5-pro"],
    ["Azure", "azure:chat:gpt-4.1"],
    ["Azure OpenAI", "azureopenai:chat:gpt-4.1"],
    ["Bedrock", "bedrock:anthropic.claude-3-5-sonnet"],
    ["Mistral", "mistral:mistral-large-latest"],
    ["Groq", "groq:llama-3.3-70b-versatile"],
    ["xAI", "xai:grok-4"],
    ["Cohere", "cohere:chat:command-r-plus"],
    ["Together", "togetherai:meta-llama/Llama-3.3-70B-Instruct-Turbo"],
  ])("allows the hosted native %s selector to reach provider loading", async (_provider, generatorId) => {
    const sandbox = await makeSandbox()
    const graderId = generatorId === graderProviderId ? generatorProviderId : graderProviderId
    const loadProvider = jest.fn(async () => {
      throw new Error("expected test load failure")
    })

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
        env: { PROMPTFOO_WITH_SKILL_PROVIDER: generatorId, PROMPTFOO_GRADER_PROVIDER: graderId },
        loadProvider,
      })
    ).resolves.toBe(1)

    expect(loadProvider).toHaveBeenCalledTimes(2)
  })

  test.each([
    ["exec", "exec:node evil.js"],
    ["file JavaScript", "file://evil.js"],
    ["JavaScript", "javascript:evil.js"],
    ["Python", "python:evil.py"],
    ["Ruby", "ruby:evil.rb"],
    ["Go", "golang:evil.go"],
    ["package", "package:evil-provider"],
    ["Docker", "docker:evil-image"],
    ["MCP", "mcp:evil-server"],
    ["browser", "browser"],
    ["HTTP", "https://evil.example/v1/chat"],
    ["WebSocket", "wss://evil.example/socket"],
    ["local agent", "openinterpreter:gpt-4"],
    ["OpenAI local agent", "openai:codex:gpt-5"],
    ["Anthropic local agent", "anthropic:claude-code"],
    ["Anthropic Claude Code startsWith alias", "anthropic:claude-codefoo"],
    ["Azure hosted agent", "azure:foundry-agent:evil"],
    ["OpenAI hosted agent", "openai:assistant:evil"],
    ["Azure OpenAI assistant alias", "azureopenai:assistant:evil"],
    ["Azure OpenAI Foundry agent alias", "azureopenai:foundry-agent:evil"],
    ["Bedrock agents alias", "bedrock:agents:evil"],
    ["uppercase assistants capability", "openai:future/ASSISTANTS.model"],
    ["mixed-separator ChatKit capability", "google:future/CHATKIT-model"],
    ["mixed-separator Claude Code capability", "anthropic:future/CLAUDE_CODE.model"],
    ["mixed-separator Claude Agent SDK capability", "bedrock:future/CLAUDE.Agent_SDK/model"],
    ["future hosted-family agent alias", "mistral:future/agent/model"],
    ["future hosted-family codex alias", "vertex:future/codex/model"],
    ["Nunjucks quoted default bypass", 'anthropic:{{"claude-code"|default("env.X")}}'],
    ["Nunjucks environment template", "openai:{{ env.PROVIDER }}"],
    ["shell-style interpolation", ["openai:$", "{MODEL}"].join("")],
    ["percent encoding", "openai:gpt%2D4"],
    ["query syntax", "openai:gpt-4?mode=agent"],
    ["fragment syntax", "openai:gpt-4#agent"],
    ["backslash separator", "openai:gpt\\agent"],
    ["whitespace", "openai:gpt 4"],
    ["control character", "openai:gpt\n4"],
    ["Unicode separator", "openai:gpt–4"],
    ["arbitrary endpoint", "webhook:https://evil.example/hook"],
    ["unknown", "unapproved:model"],
  ])("rejects the untrusted %s selector before config or provider loading", async (_kind, generatorId) => {
    const sandbox = await makeSandbox()
    const configFactory = jest.fn(() => {
      throw new Error("config must not load")
    })
    const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
        env: { PROMPTFOO_WITH_SKILL_PROVIDER: generatorId, PROMPTFOO_GRADER_PROVIDER: graderProviderId },
        configFactory,
        loadProvider,
      })
    ).resolves.toBe(1)

    expect(configFactory).not.toHaveBeenCalled()
    expect(loadProvider).not.toHaveBeenCalled()
    await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
  })

  test("safe-parses the generated Promptfoo config before loading providers", async () => {
    const sandbox = await makeSandbox()
    const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()
    const invalidConfig = {} as EvaluateTestSuite

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
        env: providerEnv,
        configFactory: () => invalidConfig,
        loadProvider,
      })
    ).resolves.toBe(1)

    expect(loadProvider).not.toHaveBeenCalled()
    expect(sandbox.stderr.join("\n")).toContain("promptfoo config")
    await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
  })

  test("provider load and resolved-identity failures make zero API calls", async () => {
    const sandbox = await makeSandbox()
    const callApi = jest.fn<ApiProvider["callApi"]>()
    const failingLoader = jest.fn(async () => {
      throw new Error("load failed")
    })
    const args = ["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo]

    await expect(sandbox.run(args, { env: providerEnv, loadProvider: failingLoader })).resolves.toBe(1)
    expect(callApi).not.toHaveBeenCalled()

    const sameProvider: ApiProvider = { id: () => "resolved-same", callApi }
    const sameLoader = jest.fn(async () => sameProvider)
    await expect(sandbox.run(args, { env: providerEnv, loadProvider: sameLoader })).resolves.toBe(1)
    expect(callApi).not.toHaveBeenCalled()
  })
})

test("real run uses each native provider once, replaces the exported response token, and writes stable model JSON", async () => {
  const sandbox = await makeSandbox()
  await writeFile(sandbox.skillsRepo, `${skillId}/references/secret.md`, "MUST NOT LOAD")
  const response = "Alpha answer. Beta answer. Gamma answer."
  const grade = {
    outcomes: outcomes.map((outcome, index) => ({
      outcome,
      pass: true,
      evidence: `${index === 0 ? "Alpha" : index === 1 ? "Beta" : "Gamma"} answer.`,
      reason: "The response satisfies this requirement.",
    })),
  }
  const generatorCall = jest.fn<ApiProvider["callApi"]>(async () => ({ output: response }))
  const graderCall = jest.fn<ApiProvider["callApi"]>(async () => ({ output: JSON.stringify(grade) }))
  const generator: ApiProvider = { id: () => "resolved-generator", callApi: generatorCall }
  const grader: ApiProvider = { id: () => "resolved-grader", callApi: graderCall }
  const loadProvider = jest.fn(async (id: string) => (id === generatorProviderId ? generator : grader))

  await expect(
    sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
      env: providerEnv,
      now: () => new Date("2026-08-26T12:00:00Z"),
      loadProvider,
    })
  ).resolves.toBe(0)

  expect(loadProvider).toHaveBeenCalledTimes(2)
  expect(generatorCall).toHaveBeenCalledTimes(1)
  expect(graderCall).toHaveBeenCalledTimes(1)
  expect(generatorCall.mock.calls[0][0]).toContain(evaluatedPage())
  expect(generatorCall.mock.calls[0][0]).toContain("# Test skill\n")
  expect(generatorCall.mock.calls[0][0]).not.toContain("MUST NOT LOAD")
  expect(graderCall.mock.calls[0][0]).toContain(response)
  expect(graderCall.mock.calls[0][0]).not.toContain("__GENERATED_RESPONSE__")
  const [runFile] = await fs.readdir(path.join(sandbox.root, "evals/runs"))
  expect(runFile).toMatch(new RegExp(`^20260826T120000Z-${evalId}-[0-9a-f-]{36}\\.json$`))
  const record = JSON.parse(await fs.readFile(path.join(sandbox.root, "evals/runs", runFile), "utf8"))
  expect(record.runId).toBe(runFile.slice(0, -5))
  expect(record.kind).toBe("model")
  expect(record.providers).toEqual({ generator: "resolved-generator", grader: "resolved-grader" })
  expect(record.providerCalls).toBe(2)
  expect(record.overallPass).toBe(true)
})

test("provider errors and non-string output are rejected without a run file", async () => {
  const sandbox = await makeSandbox()
  let generatorFails = true
  const graderCall = jest.fn(async () => ({ output: 42 }))
  const generatorCall = jest.fn(async () =>
    generatorFails ? { error: "secret provider detail" } : { output: "Alpha answer." }
  )
  const generator: ApiProvider = { id: () => "resolved-generator", callApi: generatorCall }
  const grader: ApiProvider = { id: () => "resolved-grader", callApi: graderCall }
  const loadProvider = jest.fn(async (id: string) => (id === generatorProviderId ? generator : grader))
  const args = ["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo]
  const options = {
    env: providerEnv,
    loadProvider,
  }

  await expect(sandbox.run(args, options)).resolves.toBe(1)
  expect(generatorCall).toHaveBeenCalledTimes(1)
  expect(graderCall).not.toHaveBeenCalled()
  expect(sandbox.stderr.join("\n")).not.toContain("secret provider detail")

  generatorFails = false
  await expect(sandbox.run(args, options)).resolves.toBe(1)
  expect(generatorCall).toHaveBeenCalledTimes(2)
  expect(graderCall).toHaveBeenCalledTimes(1)
  expect(sandbox.stdout).toEqual([])
  expect(sandbox.stderr.join("\n")).toContain("grader provider: expected string output")
  expect(await fs.readdir(path.join(sandbox.root, "evals/runs"))).toEqual([])
})

test("strict grade validation rejects malformed shape, source drift, bad evidence, and bad reasons", () => {
  const response = "Alpha evidence. Beta evidence."
  const valid = {
    outcomes: [
      { outcome: "Alpha requirement", pass: true, evidence: "Alpha evidence.", reason: "Alpha passes." },
      { outcome: "Beta requirement", pass: true, evidence: "Beta evidence.", reason: "Beta passes." },
    ],
  }
  const invalid: unknown[] = [
    "```json\n{}\n```",
    { ...valid, extra: true },
    { outcomes: valid.outcomes.slice(0, 1) },
    { outcomes: [...valid.outcomes].reverse() },
    { outcomes: [{ ...valid.outcomes[0], extra: true }, valid.outcomes[1]] },
    { outcomes: [{ ...valid.outcomes[0], pass: "yes" }, valid.outcomes[1]] },
    { outcomes: [{ ...valid.outcomes[0], evidence: "not quoted" }, valid.outcomes[1]] },
    { outcomes: [{ ...valid.outcomes[0], evidence: "" }, valid.outcomes[1]] },
    { outcomes: [{ ...valid.outcomes[0], reason: "   " }, valid.outcomes[1]] },
  ]

  expect(validateGrade(JSON.stringify(valid), response, ["Alpha requirement", "Beta requirement"])).toEqual(
    valid.outcomes
  )
  invalid.forEach((grade) =>
    expect(() => validateGrade(grade, response, ["Alpha requirement", "Beta requirement"])).toThrow()
  )
  const irrelevantFailure = {
    outcomes: [{ outcome: "Alpha requirement", pass: false, evidence: "", reason: "No relevant text is present." }],
  }
  expect(validateGrade(irrelevantFailure, "Nothing useful.", ["Alpha requirement"])).toEqual(irrelevantFailure.outcomes)
  expect(() =>
    validateGrade(
      { outcomes: [{ ...irrelevantFailure.outcomes[0], pass: true, reason: "Claims success without evidence." }] },
      "Nothing useful.",
      ["Alpha requirement"]
    )
  ).toThrow("passing outcomes require an exact response quote")
})

test("known-bad fixture keeps a dotted and underscored eval ID literal inside runs", async () => {
  const sandbox = await makeSandbox()
  const safeEvalId = "test.eval_v1"
  const safeDefinition = { ...definition, id: safeEvalId }
  await writeFile(sandbox.root, pagePath, evaluatedPage({ evals: [safeEvalId] }))
  await writeFile(
    sandbox.root,
    `evals/${safeEvalId}/fixtures/known-bad.json`,
    `${JSON.stringify({ response: "Alpha answer. Beta answer. Wrong gamma answer.", grade: fixtureGrade() }, null, 2)}\n`
  )
  const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()
  const now = new Date("2026-08-26T12:00:00.999Z")

  await expect(
    sandbox.run(["run", "--eval", safeEvalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"], {
      definitions: [safeDefinition],
      now: () => now,
      loadProvider,
    })
  ).resolves.toBe(0)

  expect(loadProvider).not.toHaveBeenCalled()
  expect(sandbox.stderr).toEqual([])
  expect(sandbox.stdout).toHaveLength(1)
  const runsPath = path.join(sandbox.root, "evals/runs")
  const [runFile] = await fs.readdir(runsPath)
  const prefix = `20260826T120000Z-${safeEvalId}-`
  expect(runFile.slice(0, prefix.length)).toBe(prefix)
  expect(runFile.slice(prefix.length)).toMatch(/^[0-9a-f-]{36}\.json$/)
  expect(sandbox.stdout[0]).toBe(`FAIL ${safeEvalId} 2/3 evals/runs/${runFile}`)
  const runPath = path.join(runsPath, runFile)
  expect(path.dirname(runPath)).toBe(runsPath)
  const record = JSON.parse(await fs.readFile(runPath, "utf8"))
  expect(record).toEqual({
    schemaVersion: 1,
    runId: runFile.slice(0, -5),
    kind: "fixture",
    evalId: safeEvalId,
    page: pagePath,
    skills: [skillId],
    usableBy: ["human", "agent"],
    outcomes,
    providers: { generator: null, grader: null },
    response: "Alpha answer. Beta answer. Wrong gamma answer.",
    outcomeResults: fixtureGrade().outcomes,
    overallPass: false,
    providerCalls: 0,
  })
  expect((await fs.stat(runPath)).mode & 0o777).toBe(0o600)
})

describe("run output path safety", () => {
  test.each(["evals", "evals/runs"])("rejects a symlinked %s directory before provider loading", async (component) => {
    const sandbox = await makeSandbox()
    const componentPath = path.join(sandbox.root, component)
    const targetPath = path.join(sandbox.root, `${component.replace("/", "-")}-target`)
    if (component === "evals") {
      await fs.rename(componentPath, targetPath)
    } else {
      await fs.mkdir(targetPath)
    }
    await fs.symlink(targetPath, componentPath, "dir")
    const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
        env: providerEnv,
        loadProvider,
      })
    ).resolves.toBe(1)

    expect(loadProvider).not.toHaveBeenCalled()
    expect(sandbox.stderr.join("\n")).toContain("expected a non-symlink directory")
  })

  test.each(["evals", "evals/runs"])(
    "rejects a non-directory %s component before provider loading",
    async (component) => {
      const sandbox = await makeSandbox()
      const componentPath = path.join(sandbox.root, component)
      if (component === "evals") await fs.rm(componentPath, { recursive: true })
      await fs.writeFile(componentPath, "not a directory", "utf8")
      const loadProvider = jest.fn<(id: string) => Promise<ApiProvider>>()

      await expect(
        sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo], {
          env: providerEnv,
          loadProvider,
        })
      ).resolves.toBe(1)

      expect(loadProvider).not.toHaveBeenCalled()
      expect(sandbox.stderr.join("\n")).toContain("expected a non-symlink directory")
    }
  )

  test("does not follow or overwrite a symlink placed at the final output path", async () => {
    const sandbox = await makeSandbox()
    const targetPath = path.join(sandbox.root, "must-not-change.txt")
    await fs.writeFile(targetPath, "unchanged", "utf8")
    const originalWriteFile = fs.writeFile.bind(fs)
    let linkedPath: string | undefined
    const writeSpy = jest.spyOn(fs, "writeFile").mockImplementationOnce(async (file, data, options) => {
      if (typeof file !== "string") throw new Error("expected a string output path")
      linkedPath = file
      await fs.symlink(targetPath, file)
      return originalWriteFile(file, data, options)
    })

    await expect(
      sandbox.run(["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"], {
        now: () => new Date("2026-08-26T12:00:00Z"),
      })
    ).resolves.toBe(0)

    expect(writeSpy).toHaveBeenCalledTimes(2)
    expect(await fs.readFile(targetPath, "utf8")).toBe("unchanged")
    if (!linkedPath) throw new Error("expected the attempted output path")
    expect((await fs.lstat(linkedPath)).isSymbolicLink()).toBe(true)
    expect(await fs.readdir(path.join(sandbox.root, "evals/runs"))).toHaveLength(2)
  })

  test("same-time runs use distinct IDs and never overwrite the first record", async () => {
    const sandbox = await makeSandbox()
    const args = ["run", "--eval", evalId, "--skills-repo", sandbox.skillsRepo, "--fixture", "known-bad"]
    const now = () => new Date("2026-08-26T12:00:00Z")

    await expect(sandbox.run(args, { now })).resolves.toBe(0)
    await expect(sandbox.run(args, { now })).resolves.toBe(0)

    const runFiles = await fs.readdir(path.join(sandbox.root, "evals/runs"))
    expect(runFiles).toHaveLength(2)
    expect(new Set(runFiles).size).toBe(2)
    await Promise.all(
      runFiles.map(async (runFile) => {
        const record = JSON.parse(await fs.readFile(path.join(sandbox.root, "evals/runs", runFile), "utf8"))
        expect(record.runId).toBe(runFile.slice(0, -5))
      })
    )
  })
})

test("frontmatter preflight collects exact field errors and emits no rows or files", async () => {
  const sandbox = await makeSandbox()
  await writeFile(
    sandbox.root,
    pagePath,
    `---\ntitle: Broken\nevaluation:\n  evals: [${evalId}]\n  skills: [${skillId}, "  "]\n  usableBy: [agent]\n  outcomes: ["  "]\n---\nBroken.\n`
  )

  await expect(sandbox.run(["inventory"])).resolves.toBe(1)

  expect(sandbox.stdout).toEqual([])
  expect(sandbox.stderr.join("\n")).toContain(`${pagePath} evaluation.skills[1]`)
  expect(sandbox.stderr.join("\n")).toContain(`${pagePath} evaluation.outcomes[0]`)
  await expect(fs.access(path.join(sandbox.root, "evals/runs"))).rejects.toThrow()
})
