import fs from "fs"
import glob from "glob"
import crypto from "crypto"

interface Dependencies {
  [key: string]: string
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
 * Pins the versions of dependencies in Solidity files based on the provided glob pattern.
 * @param globPattern - The glob pattern used to find Solidity files.
 * @param versions - The object containing the dependencies and their corresponding versions.
 * @throws {Error} - If there are errors during the version pinning process.
 */
const pinVersionsInSolidityFiles = (globPattern: string, versions: Dependencies) => {
  glob(globPattern, (err, files) => {
    if (err) {
      console.error("Error finding Solidity files:", err)
      throw err
    }

    const errorMap: { [file: string]: Error } = {}

    files.forEach((file) => {
      try {
        const originalContent = fs.readFileSync(file, "utf8")
        let content = originalContent

        Object.entries(versions).forEach(([packageName, version]) => {
          const regex = new RegExp(`(import.*${packageName})(/)(?!@${version.replace(".", "\\.")})(.*?\\.sol)`, "g")
          content = content.replace(regex, `$1@${version}/$3`)
        })

        if (getFileHash(originalContent) !== getFileHash(content)) {
          fs.writeFileSync(file, content, "utf8")
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

    console.log(`Version pinning complete for ${files.length} files.`)
  })
}

const packages = ["@chainlink/contracts", "@chainlink/contracts-ccip"]
const versions = getPackageVersions("package.json", packages)
pinVersionsInSolidityFiles("dist/samples/**/*.sol", versions)
