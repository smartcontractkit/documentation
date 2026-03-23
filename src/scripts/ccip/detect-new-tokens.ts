/**
 * @file detect-new-tokens.ts
 * @description CCIP Token Detection Script
 *
 * This script analyzes the CCIP configuration files to detect newly supported tokens.
 * It works by comparing the current state of token support with a historical state,
 * either from git history or a previously saved state file.
 *
 * Key functionalities:
 * - Loads current token configurations from reference data
 * - Retrieves historical token support information
 * - Identifies newly supported tokens and tokens with reduced support
 * - Generates changelog entries for new tokens
 * - Logs detailed information about token support changes
 *
 * The script is designed to be run as part of CI/CD processes to automatically
 * detect when new tokens are added to the CCIP configuration.
 *
 * @version 1.0.0
 */

// cSpell:ignore delisted Delisted lookback LOOKBACK Lookback
import fs from "fs"
import { execFileSync } from "child_process"
import pino from "pino"
import type { TokensConfig, LanesConfig, ChainsConfig } from "../../config/data/ccip/types.ts"
import { Environment, Version } from "../../config/data/ccip/types.ts"
import { loadReferenceData } from "../../config/data/ccip/data.ts"
import { getTokenIconUrl } from "../../features/utils/index.ts"
import { randomUUID } from "crypto"
import os from "os"
import fetch from "node-fetch"
import prettier from "prettier"

// ==============================
// TYPE DEFINITIONS
// ==============================

/** Interface for command line arguments */
interface CliArgs {
  help: boolean
  environment: Environment
  version: Version
  lookbackDays: number
}

/** Structure to hold file paths for the script */
interface ScriptPaths {
  /** Path to tokens configuration file */
  TOKENS_PATH: string
  /** Path to lanes configuration file */
  LANES_PATH: string
  /** Path to chains configuration file */
  CHAINS_PATH: string
}

/** Mapping of token symbols to their chain and lane support */
type TokenSupportMap = Record<
  string,
  {
    chains: string[]
    lanes: string[]
  }
>

/** Information about newly supported tokens */
type NewlySupportedToken = {
  /** Whether this token is completely new (vs. just expanded support) */
  isNewToken: boolean
  /** New chains that now support this token */
  newChains: string[]
  /** New lanes that now support this token */
  newLanes: string[]
}

/** Information about tokens with reduced support */
type ReducedSupportToken = {
  /** Whether the token has been completely delisted */
  isCompletelyDelisted: boolean
  /** Chains from which the token was removed */
  removedChains: string[]
  /** Lanes from which the token was removed */
  removedLanes: string[]
}

/** Record of tokens with newly added support */
type NewlySupportedTokens = Record<string, NewlySupportedToken>

/** Record of tokens with reduced support */
type ReducedSupportTokens = Record<string, ReducedSupportToken>

/** Network information for changelog */
type NetworkInfo = {
  displayName: string
  iconUrl: string
}

/** Type for a changelog entry */
type ChangelogEntry = {
  category: string
  date: string
  description: string
  relatedTokens: Array<{
    assetName: string
    baseAsset: string
    url: string
    iconUrl: string | undefined
  }>
  title: string
  topic: string
}

/** Structure of the changelog file */
type Changelog = {
  networks: Record<string, NetworkInfo>
  data: ChangelogEntry[]
}

/** Result of generating a changelog entry */
type ChangelogResult = {
  changelogPath: string
  entriesCount: number
  newEntry: ChangelogEntry
}

/** Token information with name and URLs */
interface TokenInfo {
  /** Symbol of the token */
  symbol: string
  /** Name of the token */
  name: string
  /** URL for token documentation */
  documentationUrl: string
  /** URL for token icon */
  iconUrl: string | undefined
}

/** Extended token information for tokens with expanded support */
interface ExpandedTokenInfo extends TokenInfo {
  /** New chains that now support this token */
  newChains: string[]
  /** New lanes that now support this token */
  newLanes: string[]
}

/** Structure for token detection results */
interface TokenDetails {
  /** Whether any new tokens were found */
  newTokensFound: boolean
  /** Timestamp of the detection */
  timestamp: string
  /** List of completely new tokens */
  completelyNewTokens: TokenInfo[]
  /** List of tokens with expanded support */
  expandedSupportTokens: ExpandedTokenInfo[]
  /** URL validation results */
  urlValidation?: {
    /** Whether all URLs are valid */
    allValid: boolean
    /** List of URL validation failures */
    failures: Array<{
      /** Symbol of the token */
      token: string
      /** URL that failed validation */
      url: string
      /** HTTP status code of the failure */
      status?: number
      /** Type of URL (documentation or icon) */
      type: string
      /** Error message if any */
      error?: string
    }>
  }
}

// ==============================
// CONSTANTS
// ==============================

/** Script version - update when making significant changes */
const SCRIPT_VERSION = "1.0.0"

/** Default number of days to look back in git history */
const DEFAULT_LOOKBACK_DAYS = 8

/** Default environment to use */
const DEFAULT_ENVIRONMENT = Environment.Mainnet

/** Default version to use */
const DEFAULT_VERSION = Version.V1_2_0

/** Default log level */
const DEFAULT_LOG_LEVEL = "INFO"

/** URL constants */
const URL_CONSTANTS = {
  /** Template URL for token documentation */
  DOC_URL_TEMPLATE: "https://docs.chain.link/ccip/directory/mainnet/token/",
}

/** Paths for temporary and output files */
const FILE_PATHS = {
  /** Directory for temporary files */
  TEMP_DIR: "temp",
  /** Path to save the previous token state */
  PREVIOUS_STATE: "temp/previousTokensState.json",
  /** Path to the changelog file */
  CHANGELOG: "public/changelog.json",
  /** Flag file to indicate new tokens were found */
  NEW_TOKENS_FLAG: "temp/NEW_TOKENS_FOUND.json",
}

// ==============================
// CONFIGURATION
// ==============================

// Generate a unique request ID for this execution
const REQUEST_ID = randomUUID()

// Get hostname for better traceability
const HOSTNAME = os.hostname()

// ==============================
// CLI ARGUMENTS HANDLING
// ==============================

/**
 * Parse and validate command line arguments
 *
 * @returns {CliArgs} Parsed and validated arguments
 */
function parseCliArguments(): CliArgs {
  const args = process.argv.slice(2)

  // Initialize with default values
  const result: CliArgs = {
    help: false,
    environment: DEFAULT_ENVIRONMENT,
    version: DEFAULT_VERSION,
    lookbackDays: DEFAULT_LOOKBACK_DAYS,
  }

  // Check for help flag
  const helpArgIndex = args.findIndex((arg) => arg === "--help" || arg === "-h")
  if (helpArgIndex >= 0) {
    result.help = true
    return result
  }

  // Parse environment argument
  const envArgIndex = args.findIndex((arg) => arg === "--env" || arg === "-e")
  if (envArgIndex >= 0 && args[envArgIndex + 1]) {
    const envArg = args[envArgIndex + 1]
    const validEnvironments = Object.values(Environment)

    if (!validEnvironments.includes(envArg as Environment)) {
      logger.error(
        {
          providedEnvironment: envArg,
          validEnvironments,
        },
        "Invalid environment provided"
      )
      console.error(`Invalid environment: ${envArg}. Valid values are: ${validEnvironments.join(", ")}`)
      process.exit(1)
    }

    logger.info({ environment: envArg }, "Environment specified via command line")
    result.environment = envArg as Environment
  }

  // Parse version argument
  const versionArgIndex = args.findIndex((arg) => arg === "--version" || arg === "-v")
  if (versionArgIndex >= 0 && args[versionArgIndex + 1]) {
    const versionArg = args[versionArgIndex + 1]
    const validVersions = Object.values(Version)

    if (!validVersions.includes(versionArg as Version)) {
      logger.error(
        {
          providedVersion: versionArg,
          validVersions,
        },
        "Invalid version provided"
      )
      console.error(`Invalid version: ${versionArg}. Valid values are: ${validVersions.join(", ")}`)
      process.exit(1)
    }

    logger.info({ version: versionArg }, "Version specified via command line")
    result.version = versionArg as Version
  }

  // Parse lookback days argument
  const lookbackArgIndex = args.findIndex((arg) => arg === "--lookback" || arg === "-l")
  if (lookbackArgIndex >= 0 && args[lookbackArgIndex + 1]) {
    const lookbackArg = args[lookbackArgIndex + 1]
    const days = parseInt(lookbackArg, 10)

    if (isNaN(days) || days <= 0) {
      logger.error(
        {
          providedLookbackDays: lookbackArg,
        },
        "Invalid lookback days provided"
      )
      console.error(`Invalid lookback days: ${lookbackArg}. Must be a positive integer.`)
      process.exit(1)
    }

    logger.info({ lookbackDays: days }, "Lookback days specified via command line")
    result.lookbackDays = days
  }

  return result
}

/**
 * Display help message to the user
 */
function displayHelpMessage(): void {
  logger.info("Help command requested")

  console.log(`CCIP Token Detection Script
Usage: npx tsx --require tsconfig-paths/register src/scripts/ccip/detect-new-tokens.ts [options]
Options:
  -h, --help               Show this help message and exit
  -e, --env <environment>  Specify environment (default: ${DEFAULT_ENVIRONMENT})
                           Valid values: ${Object.values(Environment).join(", ")}
  -v, --version <version>  Specify version (default: ${DEFAULT_VERSION})
                           Valid values: ${Object.values(Version).join(", ")}
  -l, --lookback <days>    Specify git history lookback in days (default: ${DEFAULT_LOOKBACK_DAYS})
Examples:
  # Run with default settings (${DEFAULT_ENVIRONMENT}, ${DEFAULT_VERSION}, ${DEFAULT_LOOKBACK_DAYS} days lookback)
  npx tsx --require tsconfig-paths/register src/scripts/ccip/detect-new-tokens.ts
  
  # Run with testnet environment
  npx tsx --require tsconfig-paths/register src/scripts/ccip/detect-new-tokens.ts --env testnet
  
  # Run with 30 days lookback
  npx tsx --require tsconfig-paths/register src/scripts/ccip/detect-new-tokens.ts --lookback 30
  `)
}

// ==============================
// LOGGING CONFIGURATION
// ==============================

/** Custom log levels mapping to Pino levels */
const LOG_LEVEL_MAP = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
  TRACE: "trace",
} as const

/**
 * Configure Pino logger with standardized format and context
 */
const logger = pino({
  level: LOG_LEVEL_MAP[(process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL) as keyof typeof LOG_LEVEL_MAP] || "info",
  formatters: {
    level: (label) => {
      // Convert Pino level back to our uppercase format
      const upperLabel = label.toUpperCase() as keyof typeof LOG_LEVEL_MAP
      return { level: upperLabel }
    },
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  messageKey: "msg",
  // Add base properties to all logs
  base: {
    requestId: REQUEST_ID,
    scriptVersion: SCRIPT_VERSION,
    hostname: HOSTNAME,
  },
})

// ==============================
// HELPER FUNCTIONS
// ==============================

/**
 * Counts the total number of lanes in the lanes reference data
 *
 * @param {LanesConfig} lanesReferenceData - Lanes configuration
 * @returns {number} The total number of lanes (source-destination pairs)
 */
function countTotalLanes(lanesReferenceData: LanesConfig): number {
  let laneCount = 0

  // Each source chain can have multiple destination chains
  Object.keys(lanesReferenceData).forEach((sourceChain) => {
    laneCount += Object.keys(lanesReferenceData[sourceChain]).length
  })

  return laneCount
}

/**
 * Gets the token name from the token symbol and reference data
 *
 * @param {string} tokenSymbol - Symbol of the token
 * @param {TokensConfig} tokensData - Token reference data
 * @returns {string} The name of the token, or the symbol if name not found
 */
function getTokenName(tokenSymbol: string, tokensData: TokensConfig): string {
  // Get token details from the tokens data
  const tokenDetails = tokensData[tokenSymbol]

  if (!tokenDetails) {
    logger.warn({ tokenSymbol }, "Token details not found in reference data")
    return tokenSymbol
  }

  const availableChains = Object.keys(tokenDetails)
  if (availableChains.length === 0) {
    logger.warn({ tokenSymbol }, "No chains found for token")
    return tokenSymbol
  }

  const sampleChain = availableChains[0]
  const chainTokenData = tokenDetails[sampleChain]

  if (!chainTokenData) {
    logger.warn({ tokenSymbol, sampleChain }, "Chain token data not found")
    return tokenSymbol
  }

  return chainTokenData.name || tokenSymbol
}

/**
 * Validates URLs for tokens to ensure they are accessible
 *
 * @param {TokenInfo[]} tokenInfos - Array of token information objects with URLs
 * @returns {Promise<{
 *   allValid: boolean,
 *   failures: Array<{
 *     token: string,
 *     url: string,
 *     status?: number,
 *     type: string,
 *     error?: string
 *   }>
 * }>} Validation result object
 */
async function validateTokenUrls(tokenInfos: TokenInfo[]): Promise<{
  allValid: boolean
  failures: Array<{
    token: string
    url: string
    status?: number
    type: string
    error?: string
  }>
}> {
  const urlValidationResults = {
    allValid: true,
    failures: [] as Array<{
      token: string
      url: string
      status?: number
      type: string
      error?: string
    }>,
  }

  logger.info({ tokenCount: tokenInfos.length }, "Starting URL validation for tokens")

  for (const tokenInfo of tokenInfos) {
    const { symbol, documentationUrl, iconUrl } = tokenInfo

    try {
      logger.debug({ token: symbol, documentationUrl, iconUrl }, "Validating URLs for token")

      // Validate doc URL
      try {
        const docResponse = await fetch(documentationUrl, { method: "HEAD" })

        if (!docResponse.ok) {
          urlValidationResults.allValid = false
          urlValidationResults.failures.push({
            token: symbol,
            url: documentationUrl,
            status: docResponse.status,
            type: "documentation",
          })
          logger.warn(
            { token: symbol, url: documentationUrl, status: docResponse.status },
            "Documentation URL validation failed"
          )
        }
      } catch (docError) {
        urlValidationResults.allValid = false
        urlValidationResults.failures.push({
          token: symbol,
          url: documentationUrl,
          type: "documentation",
          error: docError instanceof Error ? docError.message : String(docError),
        })
        logger.warn(
          {
            token: symbol,
            url: documentationUrl,
            error: docError instanceof Error ? docError.message : String(docError),
          },
          "Documentation URL validation error"
        )
      }

      // Validate icon URL if it's defined
      if (iconUrl) {
        try {
          const iconResponse = await fetch(iconUrl, { method: "HEAD" })

          if (!iconResponse.ok) {
            urlValidationResults.allValid = false
            urlValidationResults.failures.push({
              token: symbol,
              url: iconUrl,
              status: iconResponse.status,
              type: "icon",
            })
            logger.warn({ token: symbol, url: iconUrl, status: iconResponse.status }, "Icon URL validation failed")
          }
        } catch (iconError) {
          urlValidationResults.allValid = false
          urlValidationResults.failures.push({
            token: symbol,
            url: iconUrl,
            type: "icon",
            error: iconError instanceof Error ? iconError.message : String(iconError),
          })
          logger.warn(
            { token: symbol, url: iconUrl, error: iconError instanceof Error ? iconError.message : String(iconError) },
            "Icon URL validation error"
          )
        }
      } else {
        logger.warn({ token: symbol }, "No icon URL available for token")
      }
    } catch (error) {
      urlValidationResults.allValid = false
      urlValidationResults.failures.push({
        token: symbol,
        url: "multiple",
        type: "general",
        error: error instanceof Error ? error.message : String(error),
      })
      logger.error(
        { token: symbol, error: error instanceof Error ? error.message : String(error) },
        "URL validation general error"
      )
    }
  }

  logger.info(
    {
      tokensValidated: tokenInfos.length,
      allValid: urlValidationResults.allValid,
      failureCount: urlValidationResults.failures.length,
    },
    "URL validation completed"
  )

  return urlValidationResults
}

// ==============================
// ENTRY POINT
// ==============================

/**
 * Main entry point for the script that handles CLI parsing and starts the main process
 */
async function run(): Promise<void> {
  // Log all command line arguments at the beginning
  logger.info(
    {
      args: process.argv,
    },
    "Script initialized with command line arguments"
  )

  // Parse command line arguments
  const cliArgs = parseCliArguments()

  // Show help message if requested
  if (cliArgs.help) {
    displayHelpMessage()
    process.exit(0)
  }

  // Ensure temp directory exists
  ensureDirectoryExists(FILE_PATHS.TEMP_DIR)

  // Clean up any existing flag file from previous runs
  if (fs.existsSync(FILE_PATHS.NEW_TOKENS_FLAG)) {
    fs.unlinkSync(FILE_PATHS.NEW_TOKENS_FLAG)
    logger.debug("Removed existing new tokens flag from previous run")
  }

  // Generate paths based on environment and version
  const paths = generateSourcePaths(cliArgs.environment, cliArgs.version)

  // Start the main detection process
  await main(cliArgs.environment, cliArgs.version, cliArgs.lookbackDays, paths)
}

/**
 * Ensures a directory exists, creating it if necessary
 *
 * @param {string} dirPath - Path to the directory
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    logger.debug(`Created directory: ${dirPath}`)
  }
}

// ==============================
// PATHS AND FILE MANAGEMENT
// ==============================

/**
 * Generate paths for the source files based on environment and version
 *
 * @param {Environment} environment - Environment to use (mainnet, testnet, etc.)
 * @param {Version} version - Version to use
 * @returns {ScriptPaths} Paths for the script's source files
 */
function generateSourcePaths(environment: Environment, version: Version): ScriptPaths {
  // Helper function to format version for path (e.g., "1.2.0" to "v1_2_0")
  const formatVersion = (version: string): string => `v${version.replace(/\./g, "_")}`

  const VERSION_PATH = formatVersion(version)
  const BASE_PATH = `src/config/data/ccip/${VERSION_PATH}/${environment}`

  return {
    TOKENS_PATH: `${BASE_PATH}/tokens.json`,
    LANES_PATH: `${BASE_PATH}/lanes.json`,
    CHAINS_PATH: `${BASE_PATH}/chains.json`,
  }
}

// ==============================
// MAIN FUNCTION
// ==============================

/**
 * Main function to detect new tokens
 * - Loads current configuration
 * - Retrieves historical state for comparison
 * - Identifies newly supported and removed tokens
 * - Generates changelog entries for new tokens
 *
 * @param {Environment} environment - Environment to use (mainnet, testnet, etc.)
 * @param {Version} version - Version to use
 * @param {number} lookbackDays - Number of days to look back in git history
 * @param {ScriptPaths} paths - Paths to the source files
 * @returns {Promise<void>} A promise that resolves when the process is complete
 * @throws {Error} If there is a fatal error during execution
 */
async function main(
  environment: Environment,
  version: Version,
  lookbackDays: number,
  paths: ScriptPaths
): Promise<void> {
  const startTime = Date.now()
  logger.info("Starting CCIP token detection")

  // Log configuration
  logger.info(
    {
      environment,
      version,
      lookbackDays,
      paths,
    },
    "Configuration"
  )

  try {
    // Load current configuration
    const currentConfig = await loadCurrentConfiguration(environment, version, paths)

    // Get previous token support information
    const { previousTokenSupport, previousStateSource } = await retrievePreviousState(
      currentConfig.tokenSupport,
      paths.TOKENS_PATH,
      paths.LANES_PATH,
      lookbackDays
    )

    // Log the source of previous state for debugging
    logger.debug({ previousStateSource }, "Source of previous token state")

    // If we don't have previous state, save current state and exit
    if (!previousTokenSupport) {
      logger.info(
        {
          exitCode: 0,
          durationMs: Date.now() - startTime,
        },
        "Script completed without detecting tokens (first run)"
      )
      return
    }

    // Find support changes
    const changes = findTokenSupportChanges(previousTokenSupport, currentConfig.tokenSupport)

    // Process token support changes
    await processTokenChanges(changes, currentConfig)

    logger.info(
      {
        durationMs: Date.now() - startTime,
        newTokensFound:
          Object.keys(changes.newlySupported).filter((token) => changes.newlySupported[token].isNewToken).length > 0,
        expandedSupportFound:
          Object.keys(changes.newlySupported).filter((token) => !changes.newlySupported[token].isNewToken).length > 0,
        exitCode: 0,
      },
      "Script execution completed successfully"
    )
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        durationMs: Date.now() - startTime,
      },
      "Fatal error in token detection script"
    )
    process.exit(1)
  }
}

/**
 * Loads current configuration from reference data
 *
 * @param {Environment} environment - Environment to use
 * @param {Version} version - Version to use
 * @param {ScriptPaths} paths - Paths to the source files
 * @returns {Promise<{
 *   tokensReferenceData: TokensConfig,
 *   lanesReferenceData: LanesConfig,
 *   chainsReferenceData: ChainsConfig,
 *   tokenSupport: TokenSupportMap
 * }>} The loaded configuration data
 */
async function loadCurrentConfiguration(
  environment: Environment,
  version: Version,
  paths: ScriptPaths
): Promise<{
  tokensReferenceData: TokensConfig
  lanesReferenceData: LanesConfig
  chainsReferenceData: ChainsConfig
  tokenSupport: TokenSupportMap
}> {
  logger.info("Loading current JSON configuration files")

  // Log the source file paths
  logger.debug(
    {
      tokensPath: paths.TOKENS_PATH,
      lanesPath: paths.LANES_PATH,
      chainsPath: paths.CHAINS_PATH,
    },
    "Configuration file paths"
  )

  // Load current JSON files using the loadReferenceData function
  const { chainsReferenceData, lanesReferenceData, tokensReferenceData } = loadReferenceData({
    environment,
    version,
  })

  // Calculate the total number of lanes
  const totalLaneCount = countTotalLanes(lanesReferenceData)

  // Calculate memory footprint for monitoring using actual UTF-8 byte size
  const tokensJson = JSON.stringify(tokensReferenceData)
  const lanesJson = JSON.stringify(lanesReferenceData)
  const chainsJson = JSON.stringify(chainsReferenceData)
  const tokensSize = Buffer.byteLength(tokensJson, "utf8")
  const lanesSize = Buffer.byteLength(lanesJson, "utf8")
  const chainsSize = Buffer.byteLength(chainsJson, "utf8")
  const totalSize = tokensSize + lanesSize + chainsSize

  logger.info(
    {
      tokenCount: Object.keys(tokensReferenceData).length,
      sourceChainCount: Object.keys(lanesReferenceData).length,
      totalLaneCount,
      chainCount: Object.keys(chainsReferenceData).length,
      environment,
      version,
      // Add size metrics for memory monitoring
      sizesBytes: {
        tokens: tokensSize,
        lanes: lanesSize,
        chains: chainsSize,
        total: totalSize,
      },
    },
    "Files loaded successfully"
  )

  // Build a map of token support for current state
  const tokenMapStartTime = Date.now()
  logger.info("Building token support map for current state")
  const currentTokenSupport = buildTokenSupportMap(tokensReferenceData, lanesReferenceData)

  // Calculate memory footprint of token support map using UTF-8 byte size
  const tokenSupportJson = JSON.stringify(currentTokenSupport)
  const tokenSupportSize = Buffer.byteLength(tokenSupportJson, "utf8")

  logger.info(
    {
      tokenCount: Object.keys(currentTokenSupport).length,
      durationMs: Date.now() - tokenMapStartTime,
      sizeBytes: tokenSupportSize,
    },
    "Token support map built"
  )

  logger.debug(
    {
      sampleTokens: Object.keys(currentTokenSupport)
        .slice(0, 3)
        .map((token) => ({
          token,
          chainCount: currentTokenSupport[token].chains.length,
          laneCount: currentTokenSupport[token].lanes.length,
        })),
    },
    "Sample of current token support map"
  )

  return {
    tokensReferenceData,
    lanesReferenceData,
    chainsReferenceData,
    tokenSupport: currentTokenSupport,
  }
}

/**
 * Retrieves previous token support state from git history or saved file
 *
 * @param {TokenSupportMap} currentTokenSupport - Current token support map for fallback
 * @param {string} tokensPath - Path to tokens configuration file
 * @param {string} lanesPath - Path to lanes configuration file
 * @param {number} lookbackDays - Number of days to look back in git history
 * @returns {Promise<{
 *   previousTokenSupport: TokenSupportMap | null,
 *   previousStateSource: string
 * }>} Previous token support and its source
 */
async function retrievePreviousState(
  currentTokenSupport: TokenSupportMap,
  tokensPath: string,
  lanesPath: string,
  lookbackDays: number
): Promise<{
  previousTokenSupport: TokenSupportMap | null
  previousStateSource: string
}> {
  let previousTokenSupport: TokenSupportMap | null = null
  let previousStateSource = "none"

  try {
    // Try to get previous state from git history
    const gitResult = await retrieveStateFromGit(tokensPath, lanesPath, lookbackDays)
    if (gitResult.success) {
      previousTokenSupport = gitResult.tokenSupport
      previousStateSource = "git"
      return { previousTokenSupport, previousStateSource }
    }
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "Error retrieving git history"
    )
  }

  // If git history retrieval failed, try local file
  try {
    const fileResult = await retrieveStateFromFile()
    if (fileResult.success) {
      previousTokenSupport = fileResult.tokenSupport
      previousStateSource = "file"
      return { previousTokenSupport, previousStateSource }
    }
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        file: FILE_PATHS.PREVIOUS_STATE,
      },
      "Failed to load previous state from file"
    )
  }

  // If we still don't have a previous state, save current state and return null
  logger.warn("No previous state found. Cannot detect new tokens without a baseline for comparison.")

  // Save current state for documentation
  const tokenSupportJson = JSON.stringify(currentTokenSupport, null, 2)
  fs.writeFileSync(FILE_PATHS.PREVIOUS_STATE, tokenSupportJson)
  const savedFileSize = fs.statSync(FILE_PATHS.PREVIOUS_STATE).size

  logger.debug(
    {
      file: FILE_PATHS.PREVIOUS_STATE,
      sizeBytes: savedFileSize,
    },
    "Current state saved to file"
  )

  return { previousTokenSupport: null, previousStateSource }
}

/**
 * Retrieves state from git history
 *
 * @param {string} tokensPath - Path to tokens configuration file
 * @param {string} lanesPath - Path to lanes configuration file
 * @param {number} lookbackDays - Number of days to look back in git history
 * @returns {Promise<{
 *   success: boolean,
 *   tokenSupport: TokenSupportMap | null
 * }>} Git history retrieval result
 */
async function retrieveStateFromGit(
  tokensPath: string,
  lanesPath: string,
  lookbackDays: number
): Promise<{
  success: boolean
  tokenSupport: TokenSupportMap | null
}> {
  logger.info("Attempting to retrieve previous state from git history")
  const historicalDate = new Date()
  historicalDate.setDate(historicalDate.getDate() - lookbackDays)
  const dateString = historicalDate.toISOString().split("T")[0]

  logger.debug({ dateString }, "Using reference date for git history")

  // Try to get the files from the specified date
  const gitStartTime = Date.now()
  const oldTokensContent = getFileFromGitHistory(tokensPath, dateString)
  const oldLanesContent = getFileFromGitHistory(lanesPath, dateString)

  if (!oldTokensContent || !oldLanesContent) {
    logger.warn(
      {
        hasTokens: !!oldTokensContent,
        hasLanes: !!oldLanesContent,
      },
      "Failed to retrieve complete git history for comparison"
    )
    return { success: false, tokenSupport: null }
  }

  logger.info(
    {
      dateString,
      tokensContentLength: oldTokensContent.length,
      lanesContentLength: oldLanesContent.length,
      retrievalDurationMs: Date.now() - gitStartTime,
      // Use consistent size measurement format with UTF-8 byte count
      sizesBytes: {
        tokens: Buffer.byteLength(oldTokensContent, "utf8"),
        lanes: Buffer.byteLength(oldLanesContent, "utf8"),
        total: Buffer.byteLength(oldTokensContent, "utf8") + Buffer.byteLength(oldLanesContent, "utf8"),
      },
    },
    "Found historical data in git"
  )

  try {
    const parseStartTime = Date.now()
    const oldTokensData = JSON.parse(oldTokensContent) as TokensConfig
    const oldLanesData = JSON.parse(oldLanesContent) as LanesConfig
    const tokenSupport = buildTokenSupportMap(oldTokensData, oldLanesData)

    // Calculate the total number of lanes in historical data
    const totalHistoricalLaneCount = countTotalLanes(oldLanesData)

    // Calculate memory footprint for historical token support using UTF-8 byte size
    const historicalTokenSupportJson = tokenSupport ? JSON.stringify(tokenSupport) : ""
    const historicalTokenSupportSize = Buffer.byteLength(historicalTokenSupportJson, "utf8")

    logger.info(
      {
        tokenCount: tokenSupport ? Object.keys(tokenSupport).length : 0,
        sourceChainCount: Object.keys(oldLanesData).length,
        totalLaneCount: totalHistoricalLaneCount,
        parseDurationMs: Date.now() - parseStartTime,
        sizeBytes: historicalTokenSupportSize,
      },
      "Successfully built token support map from git history"
    )

    return { success: true, tokenSupport }
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "Error parsing historical data from git"
    )
    return { success: false, tokenSupport: null }
  }
}

/**
 * Retrieves previous state from saved file
 *
 * @returns {Promise<{
 *   success: boolean,
 *   tokenSupport: TokenSupportMap | null
 * }>} File retrieval result
 */
async function retrieveStateFromFile(): Promise<{
  success: boolean
  tokenSupport: TokenSupportMap | null
}> {
  if (!fs.existsSync(FILE_PATHS.PREVIOUS_STATE)) {
    logger.info("No saved state file found")
    return { success: false, tokenSupport: null }
  }

  logger.info("No git history found, using saved state file as fallback")

  try {
    const fileStartTime = Date.now()
    const fileContent = fs.readFileSync(FILE_PATHS.PREVIOUS_STATE, "utf8")
    const tokenSupport = JSON.parse(fileContent) as TokenSupportMap

    logger.info(
      {
        tokenCount: tokenSupport ? Object.keys(tokenSupport).length : 0,
        loadDurationMs: Date.now() - fileStartTime,
      },
      "Successfully loaded previous state from file"
    )

    return { success: true, tokenSupport }
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        file: FILE_PATHS.PREVIOUS_STATE,
      },
      "Failed to parse previous state from file"
    )
    return { success: false, tokenSupport: null }
  }
}

/**
 * Finds both newly supported tokens and tokens with reduced support
 *
 * @param {TokenSupportMap} previous - Previous token support map
 * @param {TokenSupportMap} current - Current token support map
 * @returns {{
 *   newlySupported: NewlySupportedTokens,
 *   reducedSupport: ReducedSupportTokens
 * }} Token support changes
 */
function findTokenSupportChanges(
  previous: TokenSupportMap,
  current: TokenSupportMap
): {
  newlySupported: NewlySupportedTokens
  reducedSupport: ReducedSupportTokens
} {
  logger.info(
    {
      currentTokenCount: Object.keys(current).length,
      previousTokenCount: Object.keys(previous).length,
    },
    "Comparing current state with previous state"
  )

  const compareStartTime = Date.now()
  const newlySupported = findNewlySupportedTokens(previous, current)
  const reducedSupport = findReducedSupportTokens(previous, current)

  logger.info(
    {
      newTokensFound: Object.keys(newlySupported).length,
      tokenChangesFound: Object.keys(reducedSupport).length,
      comparisonDurationMs: Date.now() - compareStartTime,
    },
    "Comparison complete"
  )

  return { newlySupported, reducedSupport }
}

/**
 * Processes token changes by logging, saving state, and generating changelog
 *
 * @param {{
 *   newlySupported: NewlySupportedTokens,
 *   reducedSupport: ReducedSupportTokens
 * }} changes - Token support changes
 * @param {{
 *   tokenSupport: TokenSupportMap,
 *   tokensReferenceData: TokensConfig
 * }} currentConfig - Current configuration
 * @returns {Promise<void>}
 */
async function processTokenChanges(
  changes: {
    newlySupported: NewlySupportedTokens
    reducedSupport: ReducedSupportTokens
  },
  currentConfig: {
    tokenSupport: TokenSupportMap
    tokensReferenceData: TokensConfig
  }
): Promise<void> {
  const { newlySupported, reducedSupport } = changes
  const { tokenSupport, tokensReferenceData } = currentConfig

  // Log tokens with reduced support
  logReducedSupportTokens(reducedSupport)

  // Save current state for documentation and as fallback
  const tokenSupportJson = JSON.stringify(tokenSupport, null, 2)
  fs.writeFileSync(FILE_PATHS.PREVIOUS_STATE, tokenSupportJson)
  const savedFileSize = fs.statSync(FILE_PATHS.PREVIOUS_STATE).size

  logger.debug(
    {
      file: FILE_PATHS.PREVIOUS_STATE,
      sizeBytes: savedFileSize,
    },
    "Current state saved to file"
  )

  // Process newly supported tokens
  if (Object.keys(newlySupported).length > 0) {
    await processNewlySupportedTokens(newlySupported, tokensReferenceData)
  } else {
    logger.info("No new tokens found")
    // Clean up the flag file if it exists
    if (fs.existsSync(FILE_PATHS.NEW_TOKENS_FLAG)) {
      fs.unlinkSync(FILE_PATHS.NEW_TOKENS_FLAG)
      logger.debug("Removed new tokens flag file")
    }
  }
}

/**
 * Build a map of token support across chains and lanes
 *
 * @param {TokensConfig} tokensData - Token configuration data
 * @param {LanesConfig} lanesData - Lane configuration data
 * @returns {TokenSupportMap} Map of tokens to their chain and lane support
 */
function buildTokenSupportMap(tokensData: TokensConfig, lanesData: LanesConfig): TokenSupportMap {
  const tokenSupport: TokenSupportMap = {}

  // First, collect all tokens and their supported chains
  Object.keys(tokensData).forEach((tokenSymbol) => {
    tokenSupport[tokenSymbol] = {
      chains: Object.keys(tokensData[tokenSymbol]),
      lanes: [],
    }
  })

  // Then, collect all lanes where tokens are supported
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
 * Find tokens that are newly supported
 *
 * @param {TokenSupportMap} previous - Previous token support map
 * @param {TokenSupportMap} current - Current token support map
 * @returns {NewlySupportedTokens} Map of newly supported tokens
 */
function findNewlySupportedTokens(previous: TokenSupportMap, current: TokenSupportMap): NewlySupportedTokens {
  const newlySupported: NewlySupportedTokens = {}

  // Helper function to check if a token is actually supported (has at least one lane)
  const isActuallySupported = (tokenSymbol: string): boolean => (current[tokenSymbol]?.lanes?.length || 0) > 0

  // Helper to get new chains and lanes for a token
  const getNewSupport = (tokenSymbol: string) => ({
    newChains: current[tokenSymbol].chains.filter((chain) => !previous[tokenSymbol]?.chains?.includes(chain)),
    newLanes: current[tokenSymbol].lanes.filter((lane) => !previous[tokenSymbol]?.lanes?.includes(lane)),
  })

  // Process each token in current state
  Object.keys(current).forEach((tokenSymbol) => {
    // Skip tokens without lane support
    if (!isActuallySupported(tokenSymbol)) return

    // Completely new token
    if (!previous[tokenSymbol]) {
      newlySupported[tokenSymbol] = {
        isNewToken: true,
        newChains: current[tokenSymbol].chains,
        newLanes: current[tokenSymbol].lanes,
      }
      return
    }

    // Check for expanded support
    const { newChains, newLanes } = getNewSupport(tokenSymbol)
    if (newChains.length > 0 || newLanes.length > 0) {
      newlySupported[tokenSymbol] = {
        isNewToken: false,
        newChains,
        newLanes,
      }
    }
  })

  return newlySupported
}

/**
 * Find tokens that have been delisted or have reduced support
 *
 * @param {TokenSupportMap} previous - Previous token support map
 * @param {TokenSupportMap} current - Current token support map
 * @returns {ReducedSupportTokens} Map of tokens with reduced support
 */
function findReducedSupportTokens(previous: TokenSupportMap, current: TokenSupportMap): ReducedSupportTokens {
  const reducedSupport: ReducedSupportTokens = {}

  // Helper function to check if a token was actually supported (had at least one lane)
  const wasActuallySupported = (tokenSymbol: string): boolean => (previous[tokenSymbol]?.lanes?.length || 0) > 0

  // Helper to get removed chains and lanes for a token
  const getRemovedSupport = (tokenSymbol: string) => ({
    removedChains: previous[tokenSymbol].chains.filter((chain) => !current[tokenSymbol]?.chains?.includes(chain)),
    removedLanes: previous[tokenSymbol].lanes.filter((lane) => !current[tokenSymbol]?.lanes?.includes(lane)),
  })

  // Process each token in previous state
  Object.keys(previous).forEach((tokenSymbol) => {
    // Skip tokens that weren't actually supported with lanes
    if (!wasActuallySupported(tokenSymbol)) return

    // Completely delisted token
    if (!current[tokenSymbol]) {
      reducedSupport[tokenSymbol] = {
        isCompletelyDelisted: true,
        removedChains: previous[tokenSymbol].chains,
        removedLanes: previous[tokenSymbol].lanes,
      }
      return
    }

    // Check for reduced support
    const { removedChains, removedLanes } = getRemovedSupport(tokenSymbol)
    if (removedChains.length > 0 || removedLanes.length > 0) {
      reducedSupport[tokenSymbol] = {
        isCompletelyDelisted: false,
        removedChains,
        removedLanes,
      }
    }
  })

  return reducedSupport
}

/**
 * Logs tokens with reduced support
 *
 * @param {ReducedSupportTokens} reducedSupport - Map of tokens with reduced support
 */
function logReducedSupportTokens(reducedSupport: ReducedSupportTokens): void {
  if (Object.keys(reducedSupport).length === 0) {
    return
  }

  const completelyDelistedTokens = Object.entries(reducedSupport).filter((entry) => entry[1].isCompletelyDelisted)
  const reducedSupportTokens = Object.entries(reducedSupport).filter((entry) => !entry[1].isCompletelyDelisted)

  logger.info(
    {
      totalTokenChanges: Object.keys(reducedSupport).length,
      completelyDelistedCount: completelyDelistedTokens.length,
      reducedSupportCount: reducedSupportTokens.length,
    },
    "Tokens with reduced support found"
  )

  // Log completely delisted tokens
  if (completelyDelistedTokens.length > 0) {
    completelyDelistedTokens.forEach(([token, info]) => {
      logger.info(
        {
          token,
          removedChains: info.removedChains,
          removedLanes: info.removedLanes,
        },
        "Token completely delisted"
      )
    })
  }

  // Log tokens with reduced support
  if (reducedSupportTokens.length > 0) {
    reducedSupportTokens.forEach(([token, info]) => {
      logger.info(
        {
          token,
          removedChains: info.removedChains,
          removedLanes: info.removedLanes,
        },
        "Token with reduced support"
      )
    })
  }
}

/**
 * Processes newly supported tokens by logging details and generating changelog
 *
 * @param {NewlySupportedTokens} newlySupported - Map of newly supported tokens
 * @param {TokensConfig} tokensReferenceData - Token reference data
 * @returns {Promise<void>}
 */
async function processNewlySupportedTokens(
  newlySupported: NewlySupportedTokens,
  tokensReferenceData: TokensConfig
): Promise<void> {
  // Count completely new tokens
  const completelyNewTokens = Object.entries(newlySupported)
    .filter((entry) => entry[1].isNewToken)
    .map((entry) => entry[0])
    .sort() // Sort alphabetically

  const completelyNewTokensCount = completelyNewTokens.length
  const expandedSupportTokens = Object.entries(newlySupported).filter((entry) => !entry[1].isNewToken)

  // Log expanded support tokens details
  if (expandedSupportTokens.length > 0) {
    expandedSupportTokens.forEach(([token, info]) => {
      logger.info(
        {
          token,
          newChains: info.newChains,
          newLanes: info.newLanes,
        },
        "Token with expanded support"
      )
    })
  }

  logger.info(
    {
      newTokenCount: Object.keys(newlySupported).length,
      completelyNewTokens: completelyNewTokensCount,
      expandedSupportTokensCount: expandedSupportTokens.length,
    },
    completelyNewTokensCount > 0
      ? "New tokens found, generating changelog entry"
      : "Only expanded token support, no changelog entry needed"
  )

  // Create token info objects once, to be reused throughout the process
  const completelyNewTokensInfo: TokenInfo[] = completelyNewTokens.map((tokenSymbol) => ({
    symbol: tokenSymbol,
    name: getTokenName(tokenSymbol, tokensReferenceData),
    documentationUrl: `${URL_CONSTANTS.DOC_URL_TEMPLATE}${tokenSymbol}`,
    iconUrl: getTokenIconUrl(tokenSymbol),
  }))

  const expandedSupportTokensInfo: ExpandedTokenInfo[] = expandedSupportTokens.map(([tokenSymbol, info]) => ({
    symbol: tokenSymbol,
    name: getTokenName(tokenSymbol, tokensReferenceData),
    newChains: info.newChains,
    newLanes: info.newLanes,
    documentationUrl: `${URL_CONSTANTS.DOC_URL_TEMPLATE}${tokenSymbol}`,
    iconUrl: getTokenIconUrl(tokenSymbol),
  }))

  // Create rich token information structure
  const tokenDetails: TokenDetails = {
    newTokensFound: completelyNewTokensCount > 0,
    timestamp: new Date().toISOString(),
    completelyNewTokens: completelyNewTokensInfo,
    expandedSupportTokens: expandedSupportTokensInfo,
  }

  // Only generate changelog entry if there are completely new tokens
  if (completelyNewTokensCount > 0) {
    const changelogStartTime = Date.now()

    // Validate token URLs before generating changelog
    logger.info("Validating token URLs before generating changelog")

    // Use the token info objects with pre-calculated URLs for validation
    const urlValidation = await validateTokenUrls(completelyNewTokensInfo)

    // Add URL validation results to the token details
    tokenDetails.urlValidation = urlValidation

    // Generate the changelog entry using the validated token info
    const changelogResult = await generateChangelogEntry(newlySupported, tokensReferenceData, completelyNewTokensInfo)

    // Create the flag file with enhanced token information
    fs.writeFileSync(FILE_PATHS.NEW_TOKENS_FLAG, JSON.stringify(tokenDetails, null, 2))

    logger.info(
      {
        changelogPath: changelogResult.changelogPath,
        entriesCount: changelogResult.entriesCount,
        flagFile: FILE_PATHS.NEW_TOKENS_FLAG,
        urlValidationSuccess: urlValidation.allValid,
        urlFailures: urlValidation.failures.length,
        generationDurationMs: Date.now() - changelogStartTime,
      },
      "Changelog entry generated successfully"
    )
  } else if (Object.keys(newlySupported).length > 0) {
    // If we only have expanded support tokens, still create the flag file
    fs.writeFileSync(FILE_PATHS.NEW_TOKENS_FLAG, JSON.stringify(tokenDetails, null, 2))
    logger.info(
      {
        flagFile: FILE_PATHS.NEW_TOKENS_FLAG,
      },
      "Token information saved to flag file (expanded support only)"
    )
  }

  logger.debug(
    {
      tokens: Object.keys(newlySupported).map((token) => ({
        token,
        isNew: newlySupported[token].isNewToken,
        newChainCount: newlySupported[token].newChains.length,
        newLaneCount: newlySupported[token].newLanes.length,
      })),
    },
    "New token details"
  )
}

/**
 * Get file content from git history
 *
 * @param {string} filePath - Path to the file to retrieve
 * @param {string} date - Date to retrieve file from (YYYY-MM-DD format)
 * @returns {string | null} File content or null if retrieval failed
 */
function getFileFromGitHistory(filePath: string, date: string): string | null {
  try {
    if (!filePath || !date) {
      logger.error({ filePath, date }, "Invalid parameters for getFileFromGitHistory: filePath and date are required")
      return null
    }

    logger.debug({ filePath, date }, "Retrieving historical version of file from git")

    // Find the closest commit before or on the given date
    const findCommitStartTime = Date.now()
    const commitHash = execFileSync("git", ["log", `--before=${date}`, "-n", "1", "--format=%H", "--", filePath], {
      encoding: "utf8",
    }).trim()

    logger.debug(
      {
        filePath,
        date,
        commitHash: commitHash || "none",
        durationMs: Date.now() - findCommitStartTime,
      },
      "Found commit for historical file"
    )

    if (!commitHash) {
      logger.warn({ filePath, date }, "No commit found for file before specified date")
      return null
    }

    // Get the file content at that commit
    const getContentStartTime = Date.now()
    const content = execFileSync("git", ["show", `${commitHash}:${filePath}`], { encoding: "utf8" })

    logger.debug(
      {
        filePath,
        commitHash,
        contentLength: content.length,
        durationMs: Date.now() - getContentStartTime,
      },
      "Retrieved file content from git"
    )

    return content
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        filePath,
        date,
      },
      `Error getting file ${filePath} from git history`
    )
    return null
  }
}

/**
 * Get a robust prettier configuration with fallbacks
 *
 * @param {string} filePath - File path to resolve config for
 * @returns {Promise<prettier.Config>} Prettier configuration object
 */
async function getPrettierConfig(filePath: string): Promise<prettier.Config> {
  try {
    // Try resolving config for the specific file path first
    let config = await prettier.resolveConfig(filePath)

    if (!config) {
      // Fallback: try resolving with the config file directly
      config = await prettier.resolveConfig(".prettierrc")
    }

    if (!config) {
      // Final fallback: use project defaults from .prettierrc
      logger.warn("Could not resolve prettier config, using fallback defaults")
      config = {
        semi: false,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "es5" as const,
        printWidth: 120,
      }
    }

    logger.debug({ config }, "Resolved prettier configuration")
    return config
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        filePath,
      },
      "Error resolving prettier config, using fallback"
    )

    // Return safe fallback configuration
    return {
      semi: false,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5" as const,
      printWidth: 120,
    }
  }
}

/**
 * Generate a changelog entry for newly supported tokens
 *
 * @param {NewlySupportedTokens} newlySupported - Map of newly supported tokens
 * @param {TokensConfig} tokensData - Token configuration data
 * @param {TokenInfo[]} validatedTokens - Array of tokens with validated URLs
 * @returns {Promise<ChangelogResult>} The result of generating the changelog entry
 */
async function generateChangelogEntry(
  newlySupported: NewlySupportedTokens,
  tokensData: TokensConfig,
  validatedTokens: Array<{
    symbol: string
    name: string
    documentationUrl: string
    iconUrl: string | undefined
  }>
): Promise<ChangelogResult> {
  logger.debug(
    {
      tokenCount: Object.keys(newlySupported).length,
      changelogPath: FILE_PATHS.CHANGELOG,
    },
    "Generating changelog entry"
  )

  // Get the tokens that are completely new (not just expanded support)
  const completelyNewTokens = Object.entries(newlySupported)
    .filter((entry) => entry[1].isNewToken)
    .map((entry) => entry[0])
    .sort() // Sort alphabetically

  // Create the changelog entry
  const today = new Date().toISOString().split("T")[0]

  // Create related tokens list - only include completely new tokens using validated URLs
  const relatedTokens = validatedTokens.map((tokenInfo) => {
    return {
      assetName: tokenInfo.name,
      baseAsset: tokenInfo.symbol,
      url: tokenInfo.documentationUrl,
      iconUrl: tokenInfo.iconUrl,
    }
  })

  // Create the changelog entry
  const changelogEntry: ChangelogEntry = {
    category: "integration",
    date: today,
    description: `Newly supported tokens: ${completelyNewTokens.join(", ")}`,
    relatedTokens,
    title: "Cross-chain token (CCT) standard: Added support for new tokens",
    topic: "CCIP",
  }

  // Initialize changelog structure with expected format
  let changelog: Changelog = { networks: {}, data: [] }

  // Read existing changelog
  try {
    if (fs.existsSync(FILE_PATHS.CHANGELOG)) {
      const changelogContent = fs.readFileSync(FILE_PATHS.CHANGELOG, "utf8")
      changelog = JSON.parse(changelogContent)

      // Ensure the structure has a data array
      if (!changelog.data) {
        changelog.data = []
      }

      logger.debug({ entriesCount: changelog.data.length }, "Loaded existing changelog entries")
    } else {
      logger.info(`Creating new changelog file at ${FILE_PATHS.CHANGELOG}`)
    }
  } catch (error) {
    logger.warn(
      {
        error: error instanceof Error ? error.message : String(error),
        path: FILE_PATHS.CHANGELOG,
      },
      "Could not load existing changelog, creating new one"
    )
  }

  // Add the new entry to the beginning of the data array
  changelog.data.unshift(changelogEntry)

  try {
    // Ensure directory exists
    const changelogDir = FILE_PATHS.CHANGELOG.substring(0, FILE_PATHS.CHANGELOG.lastIndexOf("/"))
    if (!fs.existsSync(changelogDir)) {
      fs.mkdirSync(changelogDir, { recursive: true })
      logger.debug(`Created directory: ${changelogDir}`)
    }

    // Get robust prettier configuration
    const prettierConfig = await getPrettierConfig(FILE_PATHS.CHANGELOG)

    // Format the JSON content with proper initial formatting
    const jsonString = JSON.stringify(changelog, null, 2)
    const formattedJson = await prettier.format(jsonString, {
      ...prettierConfig,
      parser: "json",
    })

    // Write the formatted content
    fs.writeFileSync(FILE_PATHS.CHANGELOG, formattedJson, "utf8")

    const changelogSize = fs.statSync(FILE_PATHS.CHANGELOG).size

    logger.debug(
      {
        entriesCount: changelog.data.length,
        sizeBytes: changelogSize,
      },
      "Changelog file updated and formatted successfully"
    )
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        path: FILE_PATHS.CHANGELOG,
      },
      "Error writing changelog file"
    )
    throw error // Re-throw to handle upstream
  }

  return {
    changelogPath: FILE_PATHS.CHANGELOG,
    entriesCount: changelog.data.length,
    newEntry: changelogEntry,
  }
}

// Start the script
run().catch((error) => {
  logger.error(
    {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
    "Unhandled error in script entry point"
  )
  process.exit(1)
})
