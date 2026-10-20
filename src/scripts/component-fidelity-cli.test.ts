import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { afterEach, beforeEach, expect, test } from "@jest/globals"

const ROOT = process.cwd()
const CHECKER = path.join(ROOT, "src/scripts/check-markdown-fidelity.ts")
const LOADER = path.join(ROOT, "node_modules/tsx/dist/loader.mjs")
let directory: string

beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "component-fidelity-cli-"))
  await fs.mkdir(path.join(directory, "src/content/ace"), { recursive: true })
  await fs.mkdir(path.join(directory, "public/reports"), { recursive: true })
  await fs.writeFile(path.join(directory, "src/content/ace/fixture.mdx"), "<Unknown>Lost</Unknown>")
  await fs.writeFile(path.join(directory, "src/content/ace/llms-full.txt"), "unchanged TXT")
  await fs.writeFile(path.join(directory, "public/reports/component-coverage.json"), "previous report")
})

afterEach(async () => fs.rm(directory, { recursive: true, force: true }))

function run(args: string[]) {
  return spawnSync(process.execPath, ["--import", LOADER, CHECKER, ...args], {
    cwd: directory,
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_ACTIONS: "",
      GITHUB_STEP_SUMMARY: "",
      TSX_TSCONFIG_PATH: path.join(ROOT, "tsconfig.json"),
    },
    timeout: 30_000,
  })
}

test("publishes the full inventory from the fidelity findings without rewriting TXT files", async () => {
  const result = run(["--publish", "--warn-only", "--omit-present"])
  expect(result.stderr).not.toContain("Error:")
  expect(result.status).toBe(0)
  const report = JSON.parse(await fs.readFile(path.join(directory, "reports/markdown-fidelity-report.json"), "utf8"))
  const inventory = JSON.parse(
    await fs.readFile(path.join(directory, "public/reports/component-coverage.json"), "utf8")
  )
  expect(inventory.schemaVersion).toBe(2)
  expect(report.omittedPresent).toBe(true)
  expect(report.counts.present).toBeGreaterThan(0)
  expect(report.findings.some((finding: { status: string }) => finding.status === "present")).toBe(false)
  expect(inventory.components).toEqual(report.components)
  expect(inventory.components).toContainEqual(
    expect.objectContaining({ name: "Unknown", pageCount: 1, statuses: ["unsupported"] })
  )
  expect(report.findings.filter((finding: { component?: string }) => finding.component === "Unknown")).toEqual([
    expect.objectContaining({ outputs: ["markdown", "txt"] }),
  ])
  expect(await fs.readFile(path.join(directory, "src/content/ace/llms-full.txt"), "utf8")).toBe("unchanged TXT")
  await expect(fs.access(path.join(directory, "reports/component-coverage.json"))).rejects.toThrow()
})

test("a failed corpus read exits with 1 and preserves the previous public file", async () => {
  await fs.rm(path.join(directory, "src/content"), { recursive: true })
  const result = run(["--publish", "--warn-only"])
  expect(result.status).toBe(1)
  expect(await fs.readFile(path.join(directory, "public/reports/component-coverage.json"), "utf8")).toBe(
    "previous report"
  )
})

test("a focused run leaves the public inventory intact", async () => {
  const result = run(["--path", "ace/fixture", "--warn-only"])
  expect(result.status).toBe(0)
  expect(result.stdout).toContain("[unsupported]")
  expect(result.stdout).toContain("(Unknown)")
  expect(result.stdout).toContain("Component subtree was removed")
  expect(await fs.readFile(path.join(directory, "public/reports/component-coverage.json"), "utf8")).toBe(
    "previous report"
  )
  expect(await fs.readFile(path.join(directory, "src/content/ace/llms-full.txt"), "utf8")).toBe("unchanged TXT")
})
