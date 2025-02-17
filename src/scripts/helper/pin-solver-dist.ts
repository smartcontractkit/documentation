import fs from "fs"
import glob from "glob"
import crypto from "crypto"

interface Dependencies {
  [key: string]: string
}

interface PinningStats {
  totalFiles: number
  packagesUpdated: { [key: string]: number }
  filesProcessed: string[]
}

/**
 * Retrieves the versions of specified packages from a package.json file.
 * @param filePath - The path to the package.json file.
 * @param packages - An array of package names.
 * @returns An object containing the package names as keys and their corresponding versions as values.
 */
const getPackageVersions = (filePath: string, packages: string[]): Dependencies => {
  const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"))
  const versions: Dependencies = {}

  packages.forEach((packageName) => {
    const version = packageJson.dependencies[packageName]
    if (version) {
      versions[packageName] = version.replace(/[\^~]/, "")
    }
  })

  return versions
}

/**
 * Calculates the SHA256 hash of the given content.
 *
 * @param content - The content to calculate the hash for.
 * @returns The SHA256 hash of the content.
 */
const getFileHash = (content: string): string => {
  return crypto.createHash("sha256").update(content).digest("hex")
}

/**
 * Pins the versions of dependencies in Solidity files based on the provided glob patterns.
 * @param globPatterns - Array of glob patterns used to find Solidity files.
 * @param versions - The object containing the dependencies and their corresponding versions.
 * @throws {Error} - If there are errors during the version pinning process.
 */
const pinVersionsInSolidityFiles = (globPatterns: string[], versions: Dependencies) => {
  const processFiles = (pattern: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) reject(err)
        else resolve(files)
      })
    })
  }

  Promise.all(globPatterns.map(processFiles))
    .then((fileArrays) => {
      const allFiles = fileArrays.flat()
      const errorMap: { [file: string]: Error } = {}
      const stats: PinningStats = {
        totalFiles: allFiles.length,
        packagesUpdated: {},
        filesProcessed: [],
      }

      allFiles.forEach((file) => {
        try {
          const originalContent = fs.readFileSync(file, "utf8")
          let content = originalContent

          Object.entries(versions).forEach(([packageName, version]) => {
            const regex = new RegExp(`(import.*${packageName})(/)(?!@${version.replace(".", "\\.")})(.*?\\.sol)`, "g")
            const newContent = content.replace(regex, `$1@${version}/$3`)

            if (newContent !== content) {
              if (!stats.packagesUpdated[packageName]) {
                stats.packagesUpdated[packageName] = 0
              }
              stats.packagesUpdated[packageName]++
            }
            content = newContent
          })

          if (getFileHash(originalContent) !== getFileHash(content)) {
            fs.writeFileSync(file, content, "utf8")
            stats.filesProcessed.push(file)
          }
        } catch (fileError) {
          errorMap[file] = fileError
        }
      })

      if (Object.keys(errorMap).length > 0) {
        console.error("There were errors during the processing of files:")
        Object.entries(errorMap).forEach(([file, error]) => {
          console.error(`${file}: ${error.message}`)
        })
        throw new Error("Errors occurred during the version pinning process.")
      }

      // Print summary
      console.log("\n=== Version Pinning Summary ===")
      console.log(`Total files scanned: ${stats.totalFiles}`)
      console.log(`Files updated: ${stats.filesProcessed.length}`)
      console.log("\nUpdates by package:")
      Object.entries(stats.packagesUpdated).forEach(([pkg, count]) => {
        console.log(`- ${pkg}: ${count} imports updated`)
      })
      if (stats.filesProcessed.length > 0) {
        console.log("\nUpdated files:")
        stats.filesProcessed.forEach((file) => {
          console.log(`- ${file}`)
        })
      }
      console.log("\nVersion pinning complete! ✨")
    })
    .catch((err) => {
      console.error("Error processing files:", err)
      throw err
    })
}

const packages = ["@chainlink/contracts", "@chainlink/contracts-ccip", "@chainlink/local"]
const versions = getPackageVersions("package.json", packages)
pinVersionsInSolidityFiles(["dist/samples/**/*.sol", ".vercel/output/static/samples/**/*.sol"], versions)
