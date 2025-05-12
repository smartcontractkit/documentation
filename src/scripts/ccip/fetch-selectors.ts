/**
 * This script fetches and processes the CCIP chain selectors from the official chain-selectors repository.
 * It downloads selector files for all supported chain types (EVM, Solana, Aptos) and ensures all selector
 * values are stored as strings to maintain consistency and prevent potential number precision issues.
 *
 * @module CCIPSelectorsFetcher
 */

import fs from "fs/promises"
import fetch from "node-fetch"
import prettier from "prettier"
import {
  SELECTORS_SOURCE_BASE_URL,
  SELECTOR_FILES,
  SELECTOR_CONFIG_PATHS,
  SELECTOR_BACKUP_PATHS,
} from "~/config/data/ccip/paths.js"

/**
 * Downloads content from a URL with timeout handling.
 *
 * @param url - The URL to download from
 * @param timeout - Timeout in milliseconds (defaults to 10000)
 * @throws {Error} If the download fails or times out
 * @returns Promise resolving to the downloaded content as string
 */
async function downloadFile(url: string, timeout = 10000): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
    }

    return await response.text()
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Creates a backup of the existing file before modification.
 * The backup will have the same name as the original file with '.backup' appended.
 *
 * @param filePath - Path to the file to backup
 * @param backupPath - Path where the backup should be saved
 * @returns Promise that resolves when backup is complete
 */
async function backupExistingFile(filePath: string, backupPath: string): Promise<void> {
  try {
    const exists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false)
    if (exists) {
      await fs.copyFile(filePath, backupPath)
      console.log(`Created backup at ${backupPath}`)
    }
  } catch (error) {
    console.warn(`Failed to create backup: ${error.message}`)
  }
}

/**
 * Processes and saves selector content for a specific chain type.
 * Ensures all selectors are stored as strings to prevent precision loss.
 *
 * @param chainType - The chain type (e.g., "evm", "solana")
 * @param sourceContent - The downloaded YAML content
 * @param configPath - Where to save the processed file
 * @param backupPath - Where to save the backup
 */
async function processAndSaveSelectors(
  chainType: string,
  sourceContent: string,
  configPath: string,
  backupPath: string
): Promise<void> {
  // Create backup of existing file
  await backupExistingFile(configPath, backupPath)

  // Process the content using regex to convert selectors to strings
  // CRITICAL: This ensures large numbers maintain precision and are consistently handled as strings
  console.log(`Processing ${chainType} selectors...`)
  const processedContent = sourceContent.replace(/selector:\s*([0-9]+)/g, 'selector: "$1"')

  // Format using project's Prettier config
  const prettierConfig = await prettier.resolveConfig(process.cwd())
  const formattedContent = await prettier.format(processedContent, {
    ...prettierConfig,
    parser: "yaml",
  })

  // Write the processed content
  console.log(`Writing to ${configPath}...`)
  await fs.writeFile(configPath, formattedContent, "utf8")
  console.log(`Successfully updated ${chainType} selectors`)
}

/**
 * Verifies that all selectors in the file are stored as strings.
 * This helps catch any parsing issues or new selector formats.
 */
async function verifySelectorStrings(configPath: string, chainType: string): Promise<void> {
  try {
    // Define interface for selector values
    interface SelectorValue {
      selector?: unknown
      name?: string
      [key: string]: unknown
    }

    const fileContent = await fs.readFile(configPath, "utf8")
    // We need to dynamically import js-yaml for parsing
    const jsYaml = await import("js-yaml").catch(() => ({
      load: (content: string) => JSON.parse(content), // Fallback if js-yaml not available
    }))

    const parsed = jsYaml.load(fileContent) as { selectors?: Record<string, SelectorValue> }

    let nonStringFound = false

    // Check each selector
    if (parsed?.selectors) {
      Object.entries(parsed.selectors).forEach(([key, value]: [string, SelectorValue]) => {
        if (value?.selector && typeof value.selector !== "string") {
          console.error(`Warning: Non-string selector found in ${chainType} config for key ${key}: ${value.selector}`)
          nonStringFound = true
        }
      })
    }

    if (!nonStringFound) {
      console.log(`✓ Verified all ${chainType} selectors are strings`)
    } else {
      console.error(`⚠ Some ${chainType} selectors are not strings - fixing may be required`)
    }
  } catch (error) {
    console.error(`Error verifying selectors in ${configPath}:`, error.message)
  }
}

/**
 * Main execution function that orchestrates the selector update process:
 * 1. Downloads the latest selectors for all chain types
 * 2. Processes the selectors (converts numbers to strings)
 * 3. Saves the updated content
 * 4. Verifies all selectors are stored as strings
 *
 * @throws {Error} If any step in the process fails
 */
async function main() {
  try {
    console.log("Starting multi-chain selectors update process...")

    // Get the list of chain types from the SELECTOR_FILES object
    const chainTypes = Object.keys(SELECTOR_FILES) as Array<keyof typeof SELECTOR_FILES>

    // Process each chain type
    for (const chainType of chainTypes) {
      const fileName = SELECTOR_FILES[chainType]
      const configPath = SELECTOR_CONFIG_PATHS[chainType]
      const backupPath = SELECTOR_BACKUP_PATHS[chainType]
      const sourceUrl = `${SELECTORS_SOURCE_BASE_URL}/${fileName}`

      try {
        console.log(`\n--- Processing ${chainType} selectors ---`)
        console.log(`Downloading ${fileName} from ${sourceUrl}...`)

        const content = await downloadFile(sourceUrl)
        await processAndSaveSelectors(chainType, content, configPath, backupPath)
        await verifySelectorStrings(configPath, chainType)

        console.log(`✓ ${chainType} selectors updated successfully`)
      } catch (error) {
        console.error(`❌ Failed to process ${chainType} selectors:`, error.message)
        // Continue with other chain types
      }
    }

    console.log("\n✓ Successfully completed selectors update process")
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Failed to update selectors:", error.message)
    process.exit(1)
  }
}

// Execute the script
main()
