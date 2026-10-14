import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals"
import { LLM_SECTIONS_CONFIG } from "../config/llms.js"
import { SOLUTIONS } from "../config/solutions/index.ts"

const REPO_ROOT = process.cwd()
const GENERATOR = path.join(REPO_ROOT, "src/scripts/generate-llms.ts")
const LOADER = path.join(REPO_ROOT, "node_modules/tsx/dist/loader.mjs")
let directory: string

beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "component-coverage-cli-"))
  for (const dir of ["src/content/ace", "src/scripts", "reports", "public/reports"]) {
    await fs.mkdir(path.join(directory, dir), { recursive: true })
  }
  await fs.writeFile(path.join(directory, "src/content/ace/fixture.mdx"), "<Unknown>Lost</Unknown>")
  await fs.writeFile(path.join(directory, "src/scripts/component-coverage-baseline.json"), "{}")
  await fs.writeFile(path.join(directory, "public/reports/component-coverage.json"), "stale")
})

afterEach(async () => {
  await fs.rm(directory, { recursive: true, force: true })
})

function run(args: string[], env: Record<string, string> = {}) {
  return spawnSync(process.execPath, ["--import", LOADER, GENERATOR, ...args], {
    cwd: directory,
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_ACTIONS: "",
      GITHUB_STEP_SUMMARY: "",
      TSX_TSCONFIG_PATH: path.join(REPO_ROOT, "tsconfig.json"),
      ...env,
    },
    timeout: 20_000,
  })
}

async function prepareFullCorpus() {
  for (const config of Object.values(LLM_SECTIONS_CONFIG)) {
    await fs.mkdir(path.join(directory, config.root), { recursive: true })
  }
  for (const solution of SOLUTIONS.filter((entry) => !entry.hidden)) {
    await fs.cp(
      path.join(REPO_ROOT, "src/content/solutions", solution.slug),
      path.join(directory, "src/content/solutions", solution.slug),
      {
        recursive: true,
        filter: (file) => !file.endsWith("llms-full.txt"),
      }
    )
  }
}

describe("component coverage CLI", () => {
  test("coverage-only publishes directly from the full corpus without writing bundles or the LLM report", async () => {
    await prepareFullCorpus()
    const bundle = path.join(directory, "src/content/ace/llms-full.txt")
    const llmsReport = path.join(directory, "reports/llms-report.json")
    await fs.writeFile(bundle, "existing bundle")
    await fs.writeFile(llmsReport, "existing report")
    const result = run(["--coverage-only"])
    expect(result.status).toBe(0)
    const report = JSON.parse(await fs.readFile(path.join(directory, "public/reports/component-coverage.json"), "utf8"))
    expect(report.pagesProcessed).toBeGreaterThan(1)
    expect(report.components.find((entry: { name: string }) => entry.name === "Unknown")).toMatchObject({
      instances: 1,
      approxChars: 4,
    })
    expect(await fs.readFile(bundle, "utf8")).toBe("existing bundle")
    expect(await fs.readFile(llmsReport, "utf8")).toBe("existing report")
    const bundles = (await fs.readdir(path.join(directory, "src/content"), { recursive: true })).filter((file) =>
      /llms-full.*\.txt$/.test(file)
    )
    expect(bundles).toEqual(["ace/llms-full.txt"])
    await expect(fs.access(path.join(directory, "reports/component-coverage.json"))).rejects.toThrow()
  }, 30_000)

  test("normal generation writes an ignored report and non-blocking CI warnings with a job summary", async () => {
    const summary = path.join(directory, "summary.md")
    const result = run(["--section", "ace"], {
      GITHUB_ACTIONS: "true",
      GITHUB_STEP_SUMMARY: summary,
    })
    expect(result.status).toBe(0)
    expect(result.stdout + result.stderr).toContain("::warning::")
    expect(await fs.readFile(summary, "utf8")).toContain("Unknown")
    const report = JSON.parse(await fs.readFile(path.join(directory, "reports/component-coverage.json"), "utf8"))
    expect(report.newSinceBaseline).toEqual(["Unknown"])
    expect(report.components[0]).toMatchObject({ name: "Unknown", instances: 1, approxChars: 4 })
    expect(await fs.readFile(path.join(directory, "public/reports/component-coverage.json"), "utf8")).toBe("stale")
  })

  test("coverage generation failure exits unsuccessfully and preserves the previous public report", async () => {
    await fs.rm(path.join(directory, "src/content/ace"), { recursive: true })
    await fs.writeFile(path.join(directory, "src/content/ace"), "not a directory")
    const result = run(["--coverage-only"])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("ENOTDIR")
    expect(await fs.readFile(path.join(directory, "public/reports/component-coverage.json"), "utf8")).toBe("stale")
  })

  test.each(["--section", "--pages", "--report"])(
    "rejects a missing value for %s before generating files",
    async (flag) => {
      const result = run([flag])
      expect(result.status).toBe(1)
      expect(result.stderr).toContain("requires a value")
      await expect(fs.access(path.join(directory, "src/content/ace/llms-full.txt"))).rejects.toThrow()
    }
  )

  test.each([
    ["--section", "unknown-product"],
    ["--unknown-option"],
    ["--coverage-only", "--section", "ace"],
    ["--coverage-only", "--pages", "pages.json"],
    ["--coverage-only", "--report", "report.json"],
  ])("rejects invalid CLI arguments %j", async (...args) => {
    expect(run(args).status).toBe(1)
    await expect(fs.access(path.join(directory, "src/content/ace/llms-full.txt"))).rejects.toThrow()
  })
})
