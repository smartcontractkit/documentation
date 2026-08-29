import { statSync, promises as fs } from "fs"
import { getAddress } from "ethers"
import { glob } from "glob"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const directoryPaths = [path.resolve(__dirname, "../../../src"), path.resolve(__dirname, "../../../public")]
// List of files to ignore
const ignoreFiles = [path.resolve(__dirname, "../../../public/search-index.json")]

// helper function to check if a string is a valid Ethereum address
const getCorrectAddress = (value: string) => {
  try {
    return getAddress(value)
  } catch (error) {
    if (error.reason && (error.reason as string).includes("bad address checksum")) {
      console.error(error.reason)
      console.error(`Search manually for ${error.value} and replace its occurrences with a valid checksum`)
    }

    return undefined
  }
}

// helper function to check and print improperly checksummed addresses
const checkFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, "utf-8")
  const lines = fileContent.split("\n")

  const ethAddressRegex = /\b0x[a-fA-F0-9]{40}\b/gi

  lines.forEach((line, index) => {
    const matches = line.match(ethAddressRegex)

    if (matches) {
      matches.forEach((match) => {
        const correctAddress = getCorrectAddress(match)
        if (correctAddress && correctAddress !== match) {
          console.log(
            `Improperly checksummed address found in file ${filePath} on line ${
              index + 1
            }: ${match} - correct checkSummed address is ${correctAddress}`
          )
        }
      })
    }
  })
}

// Main function to process all directories
const processDirectories = async () => {
  try {
    for (const directoryPath of directoryPaths) {
      const paths = await glob(path.join(directoryPath, "**/*"))

      // Process each file
      for (const filepath of paths) {
        if (statSync(filepath).isFile() && !ignoreFiles.includes(filepath)) {
          await checkFile(filepath)
        }
      }
    }
  } catch (error) {
    console.error("An error occurred while processing files:", error)
    process.exit(1)
  }
}

// Run the script
processDirectories().catch((error) => {
  console.error("Failed to process directories:", error)
  process.exit(1)
})
