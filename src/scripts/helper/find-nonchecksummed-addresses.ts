import { statSync, promises as fs } from "fs"
import { ethers } from "ethers"
import glob from "glob"
import path from "path"

const directoryPath = path.resolve(__dirname, "../../../src")

// helper function to check if a string is a valid Ethereum address
const isAddress = (value: string) => {
  try {
    return ethers.utils.getAddress(value)
  } catch {
    return undefined
  }
}

// helper function to check and print improperly checksummed addresses
const checkFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, "utf-8")
  const lines = fileContent.split("\n")

  lines.forEach((line, index) => {
    const words = line.split(" ")

    words.forEach((word) => {
      if (isAddress(word) && ethers.utils.getAddress(word) !== word) {
        console.log(`Improperly checksummed address found in file ${filePath} on line ${index + 1}: ${word}`)
      }
    })
  })
}

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
      checkFile(filepath)
    }
  })
})
