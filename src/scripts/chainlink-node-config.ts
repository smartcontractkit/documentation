import { mkdir, readFile, writeFile } from "fs/promises"
import path, { normalize } from "path"
import { format, resolveConfig } from "prettier"
import fetch from "node-fetch"

const CONFIG = {
  LATEST_RELEASE_URL: "https://api.github.com/repos/smartcontractkit/chainlink/releases/latest",
  RAW_CONTENT_BASE_URL: "https://raw.githubusercontent.com/smartcontractkit/chainlink",
  REQUEST_TIMEOUT_MS: 5000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  MIN_SOURCE_LENGTH: 1000,
  REPORT_PATH: "reports/node-config-sync.json",
} as const

type SyncTarget = {
  sourcePath: string
  targetPath: string
  title: string
  generatedFrom: string
  seeAlsoLabel: string
  seeAlsoHref: string
}

const SYNC_TARGETS: SyncTarget[] = [
  {
    sourcePath: "docs/CONFIG.md",
    targetPath: "src/content/chainlink-nodes/v1/node-config.mdx",
    title: "Node Config (TOML)",
    generatedFrom: "docs/*.toml",
    seeAlsoLabel: "Secrets Config",
    seeAlsoHref: "/chainlink-nodes/v1/secrets-config",
  },
  {
    sourcePath: "docs/SECRETS.md",
    targetPath: "src/content/chainlink-nodes/v1/secrets-config.mdx",
    title: "Secrets Config (TOML)",
    generatedFrom: "docs/secrets.toml",
    seeAlsoLabel: "Node Config",
    seeAlsoHref: "/chainlink-nodes/v1/node-config",
  },
]

const EXAMPLE_HEADING = "## Example"

class SyncError extends Error {
  constructor(
    message: string,
    public readonly inner?: Error
  ) {
    super(message)
    this.name = "SyncError"
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchTextWithRetry = async (url: string): Promise<string> => {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "chainlink-node-config-sync" },
      })
      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.text()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < CONFIG.MAX_RETRIES) {
        await delay(CONFIG.RETRY_DELAY_MS * attempt) // Exponential backoff
        continue
      }
    }
  }

  throw new SyncError(`Failed to fetch ${url} after ${CONFIG.MAX_RETRIES} attempts`, lastError)
}

const validateSource = (content: string, sourcePath: string): void => {
  if (!content.startsWith("[//]: # (Documentation generated from docs/")) {
    throw new SyncError(`Unexpected head of ${sourcePath}: missing generated docs marker`)
  }

  if (!content.includes(`\n${EXAMPLE_HEADING}`)) {
    throw new SyncError(`Unexpected content of ${sourcePath}: missing "${EXAMPLE_HEADING}" heading`)
  }

  if (content.length < CONFIG.MIN_SOURCE_LENGTH) {
    throw new SyncError(`Unexpected content of ${sourcePath}: too small (${content.length} bytes)`)
  }
}

const normalizeQuotes = (content: string): string => content.replace(/[’‘]/g, "'").replace(/[“”]/g, '"')

// Escape MDX-significant characters in prose lines so the generated markdown compiles.
// Inline code spans (backticks) are literal and must stay untouched; code fences are
// handled by the caller.
const escapeProseLine = (line: string): string =>
  line
    .split("`")
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/</g, "&lt;").replace(/\{/g, "\\{").replace(/\}/g, "\\}")))
    .join("`")

const transformToMdx = (source: string, target: SyncTarget, tag: string): string => {
  const exampleIndex = source.indexOf(`\n${EXAMPLE_HEADING}`)
  if (exampleIndex === -1) {
    throw new SyncError(`Missing "${EXAMPLE_HEADING}" heading in ${target.sourcePath}`)
  }

  const headerLines = source
    .slice(0, exampleIndex)
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim()
      return !trimmed.startsWith("[//]: #") && !trimmed.startsWith("See also [")
    })
    .map(escapeProseLine)
  while (headerLines.length && headerLines[0].trim() === "") headerLines.shift()
  while (headerLines.length && headerLines[headerLines.length - 1].trim() === "") headerLines.pop()

  let inFence = false
  const bodyLines = source
    .slice(exampleIndex)
    .split("\n")
    .map((line) => {
      if (line.trimStart().startsWith("```")) {
        inFence = !inFence
        return line
      }
      if (inFence) {
        return line
      }
      const escaped = escapeProseLine(line)
      const admonition = escaped.match(/^:([a-z_]+):\s*(.*)$/)
      if (!admonition) {
        return escaped
      }
      if (admonition[1] !== "warning") {
        throw new SyncError(
          `Unknown admonition ":${admonition[1]}:" in ${target.sourcePath}. Extend the transform in this script.`
        )
      }
      return `<Aside type="caution">${admonition[2]}</Aside>`
    })

  const body = normalizeQuotes(bodyLines.join("\n"))
  const usesAsides = body.includes("<Aside")

  const preamble = [
    "---",
    "section: nodeOperator",
    "date: Last Modified",
    `title: "${target.title}"`,
    "---",
    "",
    ...(usesAsides ? ['import { Aside } from "@components"', ""] : []),
    `[//]: # "Documentation generated from ${target.generatedFrom} in smartcontractkit/chainlink@${tag} - DO NOT EDIT."`,
    "",
    ...headerLines,
    "",
    `See also: [${target.seeAlsoLabel}](${target.seeAlsoHref})`,
    "",
  ].join("\n")

  return preamble + body
}

type ReleaseResponse = { tag_name?: string }

const main = async (): Promise<void> => {
  const releaseJson = await fetchTextWithRetry(CONFIG.LATEST_RELEASE_URL)
  const release = JSON.parse(releaseJson) as ReleaseResponse
  if (!release.tag_name) {
    throw new SyncError(`Could not determine latest release tag from ${CONFIG.LATEST_RELEASE_URL}`)
  }
  const tag = release.tag_name

  const changedFiles: string[] = []

  for (const target of SYNC_TARGETS) {
    const source = await fetchTextWithRetry(`${CONFIG.RAW_CONTENT_BASE_URL}/${tag}/${target.sourcePath}`)
    validateSource(source, target.sourcePath)

    const targetPath = normalize(target.targetPath)
    const prettierConfig = (await resolveConfig(targetPath)) ?? {}
    const content = await format(transformToMdx(source, target, tag), {
      ...prettierConfig,
      parser: "mdx",
    })

    const current = await readFile(targetPath, "utf8").catch(() => "")
    if (current === content) {
      console.log(`${target.targetPath} is up to date`)
      continue
    }
    await writeFile(targetPath, content)
    changedFiles.push(target.targetPath)
    console.log(`Updated ${target.targetPath}`)
  }

  const report = { tag, changed: changedFiles.length > 0, changedFiles }
  await mkdir(normalize(path.dirname(CONFIG.REPORT_PATH)), { recursive: true })
  await writeFile(normalize(CONFIG.REPORT_PATH), await format(JSON.stringify(report), { parser: "json" }))
  console.log(`Sync report written to ${CONFIG.REPORT_PATH}: source ${tag}, ${changedFiles.length} file(s) changed`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
