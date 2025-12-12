/**
 * @file src/scripts/ccip/generate-token-report.ts
 * @description Script to generate a report of CCIP tokens added per quarter.
 *
 * This script scans the git history of the token configuration files to determine
 * when each token was added. It then generates a markdown report grouping
 * the tokens by the quarter of their introduction.
 */

import fs from "fs"
import path from "path"
import { execFileSync } from "child_process"
import pino from "pino"
import { TokensConfig, LanesConfig, Environment, Version } from "../../config/data/ccip/types.js"
import { loadReferenceData } from "../../config/data/ccip/data.js"

// ==============================
// CONFIGURATION
// ==============================

const SCRIPT_VERSION = "1.0.0"
const ENVIRONMENT = Environment.Mainnet
const VERSION = Version.V1_2_0
const START_DATE = new Date("2024-01-01")
const OUTPUT_DIR = ".tmp"
const OUTPUT_FILE = path.join(OUTPUT_DIR, "tokens-by-quarter.md")

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
})

// ==============================
// HELPER FUNCTIONS
// ==============================

/**
 * Generate paths for the source files based on environment and version.
 */
function generateSourcePaths(environment: Environment, version: Version): { TOKENS_PATH: string; LANES_PATH: string } {
  const formatVersion = (v: string): string => `v${v.replace(/\./g, "_")}`
  const VERSION_PATH = formatVersion(version)
  const BASE_PATH = `src/config/data/ccip/${VERSION_PATH}/${environment}`
  return {
    TOKENS_PATH: `${BASE_PATH}/tokens.json`,
    LANES_PATH: `${BASE_PATH}/lanes.json`,
  }
}

/**
 * Get file content from git history for a specific date.
 */
function getFileFromGitHistory(filePath: string, date: string): string | null {
  try {
    const commitHash = execFileSync(
      "git",
      ["log", `--before=${date}T23:59:59`, "-n", "1", "--format=%H", "--", filePath],
      {
        encoding: "utf8",
      }
    ).trim()

    if (!commitHash) {
      logger.warn({ filePath, date }, "No commit found for file before specified date")
      return null
    }

    return execFileSync("git", ["show", `${commitHash}:${filePath}`], { encoding: "utf8" })
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error), filePath, date },
      `Error getting file ${filePath} from git history`
    )
    return null
  }
}

/**
 * Build a map of token support across chains and lanes.
 */
function buildTokenSupportMap(tokensData: TokensConfig, lanesData: LanesConfig): Record<string, { lanes: string[] }> {
  const tokenSupport: Record<string, { lanes: string[] }> = {}

  Object.keys(tokensData).forEach((tokenSymbol) => {
    tokenSupport[tokenSymbol] = { lanes: [] }
  })

  Object.keys(lanesData).forEach((sourceChain) => {
    Object.keys(lanesData[sourceChain]).forEach((destChain) => {
      const lane = `${sourceChain}-to-${destChain}`
      const supportedTokens = lanesData[sourceChain][destChain].supportedTokens || []
      if (Array.isArray(supportedTokens)) {
        supportedTokens.forEach((tokenSymbol) => {
          if (tokenSupport[tokenSymbol]) {
            tokenSupport[tokenSymbol].lanes.push(lane)
          }
        })
      }
    })
  })

  return tokenSupport
}

/**
 * Gets the set of supported token symbols at a specific date.
 */
async function getSupportedTokensAtDate(date: string, tokensPath: string, lanesPath: string): Promise<Set<string>> {
  const tokensContent = getFileFromGitHistory(tokensPath, date)
  const lanesContent = getFileFromGitHistory(lanesPath, date)

  if (!tokensContent || !lanesContent) {
    return new Set()
  }

  try {
    const tokensData = JSON.parse(tokensContent) as TokensConfig
    const lanesData = JSON.parse(lanesContent) as LanesConfig
    const tokenSupportMap = buildTokenSupportMap(tokensData, lanesData)

    const supportedTokens = Object.keys(tokenSupportMap).filter(
      (token) => tokenSupportMap[token] && tokenSupportMap[token].lanes.length > 0
    )

    return new Set(supportedTokens)
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error), date },
      "Failed to parse historical token data."
    )
    return new Set()
  }
}

/**
 * Gets the token name from the token symbol.
 */
function getTokenName(tokenSymbol: string, tokensData: TokensConfig): string {
  const tokenDetails = tokensData[tokenSymbol]
  if (!tokenDetails) return tokenSymbol
  const sampleChain = Object.keys(tokenDetails)[0]
  return sampleChain && tokenDetails[sampleChain] ? tokenDetails[sampleChain].name || tokenSymbol : tokenSymbol
}

// ==============================
// MAIN SCRIPT LOGIC
// ==============================

/**
 * Generates and writes the token report.
 */
async function generateReport() {
  logger.info(`Starting token report generation (v${SCRIPT_VERSION})`)
  logger.info(`Environment: ${ENVIRONMENT}, Version: ${VERSION}`)

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
  }

  const { TOKENS_PATH, LANES_PATH } = generateSourcePaths(ENVIRONMENT, VERSION)
  const { tokensReferenceData: currentTokensData } = loadReferenceData({ environment: ENVIRONMENT, version: VERSION })

  const reportData: Record<
    string,
    {
      tokens: string[]
      startDate: string
      endDate: string
    }
  > = {}
  const allTokensFound = new Set<string>()

  // Use UTC dates to avoid timezone issues.
  let currentDate = new Date(START_DATE.toISOString().split("T")[0] + "T00:00:00Z")
  const now = new Date()

  while (currentDate <= now) {
    const year = currentDate.getUTCFullYear()
    // getUTCMonth() is 0-indexed (0-11), so we can calculate the quarter directly.
    const quarter = Math.floor(currentDate.getUTCMonth() / 3) + 1
    const quarterKey = `Q${quarter}-${year}`

    const startOfQuarter = new Date(Date.UTC(year, (quarter - 1) * 3, 1))
    const endOfQuarter = new Date(Date.UTC(year, quarter * 3, 0)) // Day 0 of next month is last day of current month

    const dateForGit = endOfQuarter > now ? now : endOfQuarter
    const dateStringForGit = dateForGit.toISOString().split("T")[0]

    logger.info(`Processing ${quarterKey} (up to ${dateStringForGit})...`)

    const tokensAtEndOfQuarter = await getSupportedTokensAtDate(dateStringForGit, TOKENS_PATH, LANES_PATH)
    const newTokens = new Set([...tokensAtEndOfQuarter].filter((x) => !allTokensFound.has(x)))

    if (newTokens.size > 0) {
      const newSortedTokens = Array.from(newTokens).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
      reportData[quarterKey] = {
        tokens: newSortedTokens,
        startDate: startOfQuarter.toISOString().split("T")[0],
        endDate: endOfQuarter.toISOString().split("T")[0],
      }
      newTokens.forEach((token) => allTokensFound.add(token))
    }

    // Move to the first day of the next quarter in UTC
    currentDate = new Date(Date.UTC(year, quarter * 3, 1))
  }

  // Generate Markdown report
  let reportContent = `# CCIP Tokens Added by Quarter\n\n`
  reportContent += `*Report generated on: ${new Date().toUTCString()}*\n`
  reportContent += `*Environment: ${ENVIRONMENT}, Version: ${VERSION}*\n\n`

  const sortedQuarters = Object.keys(reportData).sort((a, b) => {
    const [aQ, aY] = a.split("-")
    const [bQ, bY] = b.split("-")
    if (aY !== bY) return Number(aY) - Number(bY)
    return Number(aQ.substring(1)) - Number(bQ.substring(1))
  })

  for (const quarter of sortedQuarters) {
    const { tokens, startDate, endDate } = reportData[quarter]
    reportContent += `## ${quarter} (${tokens.length} tokens)\n\n`
    reportContent += `*Period: ${startDate} to ${endDate}*\n\n`
    for (const tokenSymbol of tokens) {
      const tokenName = getTokenName(tokenSymbol, currentTokensData)
      reportContent += `- **${tokenSymbol}**: ${tokenName}\n`
    }
    reportContent += `\n`
  }

  fs.writeFileSync(OUTPUT_FILE, reportContent)
  logger.info(`Report successfully generated at ${OUTPUT_FILE}`)
}

// ==============================
// EXECUTION
// ==============================

generateReport().catch((err) => {
  logger.error(err, "An unexpected error occurred while generating the report.")
  process.exit(1)
})
