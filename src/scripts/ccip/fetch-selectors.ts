/**
 * This script fetches and processes the CCIP chain selectors from the official chain-selectors repository.
 * It ensures all selector values are stored as strings to maintain consistency and prevent potential
 * number precision issues with large values.
 *
 * @module CCIPSelectorsFetcher
 */

import fs from "fs/promises"
import fetch from "node-fetch"
import prettier from "prettier"
import { SELECTOR_CONFIG_PATH, SELECTOR_BACKUP_PATH, SELECTORS_SOURCE_URL } from "~/config/data/ccip/paths.js"

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
 * Main execution function that orchestrates the selector update process:
 * 1. Creates a backup of the existing file
 * 2. Downloads the latest selectors
 * 3. Processes the selectors (converts numbers to strings)
 * 4. Saves the updated content
 *
 * @throws {Error} If any step in the process fails
 */
async function main() {
  try {
    console.log("Starting selectors update process...")

    // Create backup of existing file
    await backupExistingFile(SELECTOR_CONFIG_PATH, SELECTOR_BACKUP_PATH)

    // Download the file
    console.log("Downloading selectors.yml...")
    const content = await downloadFile(SELECTORS_SOURCE_URL)

    // Process the content using regex to convert selectors to strings
    console.log("Processing selectors...")
    const processedContent = content.replace(/selector:\s*([0-9]+)/g, 'selector: "$1"')

    // Format using project's Prettier config
    const prettierConfig = await prettier.resolveConfig(process.cwd())
    const formattedContent = prettier.format(processedContent, {
      ...prettierConfig,
      parser: "yaml",
    })

    // Write the processed content
    console.log(`Writing to ${SELECTOR_CONFIG_PATH}...`)
    await fs.writeFile(SELECTOR_CONFIG_PATH, formattedContent, "utf8")

    console.log("Successfully updated selectors.yml")
    process.exit(0)
  } catch (error) {
    console.error("Failed to update selectors:", error.message)
    process.exit(1)
  }
}

// Execute the script
main()
