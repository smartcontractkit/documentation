/**
 * This script fetches and processes the CCIP chain selectors from the official chain-selectors repository.
 * It ensures all selector values are stored as strings to maintain consistency and prevent potential
 * number precision issues with large values.
 *
 * @module CCIPSelectorsFetcher
 */

import fs from "fs/promises"
import path from "path"
import fetch, { RequestInit } from "node-fetch"
import yaml from "js-yaml"
import prettier from "prettier"

/** The source URL for the official chain selectors YAML file */
const SELECTORS_URL = "https://raw.githubusercontent.com/smartcontractkit/chain-selectors/refs/heads/main/selectors.yml"

/** The local destination path where the processed selectors file will be saved */
const destinationPath = path.join(__dirname, "../../config/data/ccip/selector.yml")

/**
 * Interface representing the structure of the selectors YAML file.
 * Each chain has a numeric ID as key and contains a selector and name.
 */
interface SelectorsYaml {
  selectors: {
    [key: number]: {
      /** The chain's selector value, can be number or string */
      selector: number | string
      /** Human-readable name of the chain */
      name: string
    }
  }
}

/**
 * Downloads content from a URL with timeout handling.
 *
 * @param url - The URL to download from
 * @param timeout - Timeout in milliseconds (defaults to 10000)
 * @throws {Error} If the download fails or times out
 * @returns Promise resolving to the downloaded content as string
 */
async function downloadFile(url: string, timeout = 10000): Promise<string> {
  const options: RequestInit = {
    timeout,
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

/**
 * Processes the YAML content by converting all numeric selectors to strings.
 * This prevents potential precision issues with large numbers in different environments.
 * Preserves all comments and original structure of the YAML file.
 *
 * @param content - The raw YAML content to process
 * @throws {Error} If YAML parsing or processing fails
 * @returns Promise resolving to the processed YAML content as string
 */
async function processSelectorsYaml(content: string): Promise<string> {
  try {
    // First, parse the YAML to process the selectors
    const data = yaml.load(content) as SelectorsYaml

    // Create a map of chainId to string selector for replacements
    const replacements = new Map<number, string>()
    for (const [chainId, chainData] of Object.entries(data.selectors)) {
      if (typeof chainData.selector === "number") {
        replacements.set(Number(chainId), chainData.selector.toString())
      }
    }

    // Process the content line by line to preserve comments and structure
    const lines = content.split("\n")
    const processedLines = lines.map((line) => {
      // Skip comment lines and non-selector lines
      if (line.trim().startsWith("#") || !line.includes("selector:")) {
        return line
      }

      // Extract chainId from the line above (if it exists)
      const match = line.match(/\s+selector:\s*(\d+)/)
      if (match) {
        const selectorValue = match[1]
        // Find the corresponding chainId and replacement
        for (const [chainId, replacement] of replacements) {
          if (data.selectors[chainId]?.selector.toString() === selectorValue) {
            return line.replace(selectorValue, `"${replacement}"`)
          }
        }
      }
      return line
    })

    const processedContent = processedLines.join("\n")

    // Format using project's Prettier config
    const prettierConfig = await prettier.resolveConfig(process.cwd())
    return prettier.format(processedContent, {
      ...prettierConfig,
      parser: "yaml",
    })
  } catch (error) {
    throw new Error(`Failed to process YAML: ${error.message}`)
  }
}

/**
 * Creates a backup of the existing file before modification.
 * The backup will have the same name as the original file with '.backup' appended.
 *
 * @param filePath - Path to the file to backup
 * @returns Promise that resolves when backup is complete
 */
async function backupExistingFile(filePath: string): Promise<void> {
  try {
    const exists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false)
    if (exists) {
      const backupPath = `${filePath}.backup`
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
    await backupExistingFile(destinationPath)

    // Download the file
    console.log("Downloading selectors.yml...")
    const content = await downloadFile(SELECTORS_URL)

    // Process the content
    console.log("Processing selectors...")
    const processedContent = await processSelectorsYaml(content)

    // Write the processed content
    console.log(`Writing to ${destinationPath}...`)
    await fs.writeFile(destinationPath, processedContent, "utf8")

    console.log("Successfully updated selectors.yml")
    process.exit(0)
  } catch (error) {
    console.error("Failed to update selectors:", error.message)
    process.exit(1)
  }
}

// Execute the script
main()
