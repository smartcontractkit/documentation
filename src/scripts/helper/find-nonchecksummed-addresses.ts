import { statSync, promises as fs } from "fs"
import { ethers } from "ethers"
import glob from "glob"
import path from "path"

const directoryPaths = [path.resolve(__dirname, "../../../src"), path.resolve(__dirname, "../../../public")]
// List of files to ignore
const ignoreFiles = [path.resolve(__dirname, "../../../public/search-index.json")]

// helper function to check if a string is a valid Ethereum address
const getCorrectAddress = (value: string) => {
  try {
    return ethers.utils.getAddress(value)
  } catch (error) {
    if (error.reason && (error.reason as string).includes("bad address checksum")) {
      console.error(error.reason)
      console.error(`Search manually for ${error.value} and replace its occurences with a valid checksum`)
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

directoryPaths.forEach((directoryPath) => {
  // use glob to read all files in the directory (and subdirectories)
  glob.glob(directoryPath + "/**/*", (err, paths) => {
    if (err) {
      console.error("An error occurred while trying to read the files:", err)
      return
    }

    // iterate over each path
    paths.forEach((filepath) => {
      // use fs.statSync() to check if the path is a file
      if (statSync(filepath).isFile()) {
        if (!ignoreFiles.includes(filepath)) {
          checkFile(filepath)
        }
      }
    })
  })
})
