import fs from "fs"
import { glob } from "glob"
import crypto from "crypto"
import path from "path"

/**
 * Type definitions for version override configuration.
 * Config file: version-overrides.json in project root
 *
 * Example:
 * {
 *   "description": "Optional description",
 *   "overrides": [
 *     {
 *       "file": "samples/CCIP/example.sol",
 *       "reason": "Why this override is needed",
 *       "versions": {
 *         "@chainlink/contracts": "1.5.0",
 *         "@chainlink/contracts-ccip": "1.6.3"
 *       }
 *     }
 *   ]
 * }
 */

interface Dependencies {
  [key: string]: string
}

interface PinningStats {
  totalFiles: number
  packagesUpdated: { [key: string]: number }
  filesProcessed: string[]
  overridesApplied: { [file: string]: string[] }
}

interface FileOverride {
  file: string
  reason?: string
  versions: Dependencies
}

interface VersionOverridesConfig {
  description?: string
  overrides: FileOverride[]
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
 * Loads version override configuration from file.
 * @returns The version overrides configuration, or null if file doesn't exist.
 */
const loadVersionOverrides = (): Map<string, Dependencies> => {
  const overridesPath = path.join(process.cwd(), "version-overrides.json")

  if (!fs.existsSync(overridesPath)) {
    console.log("ℹ️  No version-overrides.json found. Using default versions for all files.")
    return new Map()
  }

  try {
    const config: VersionOverridesConfig = JSON.parse(fs.readFileSync(overridesPath, "utf8"))
    const overridesMap = new Map<string, Dependencies>()

    config.overrides.forEach((override) => {
      // Normalize path separators for cross-platform compatibility
      const normalizedPath = override.file.replace(/\\/g, "/")
      overridesMap.set(normalizedPath, override.versions)

      console.log(`📌 Loaded override for ${override.file}:`)
      if (override.reason) {
        console.log(`   Reason: ${override.reason}`)
      }
      Object.entries(override.versions).forEach(([pkg, version]) => {
        console.log(`   - ${pkg}@${version}`)
      })
    })

    return overridesMap
  } catch (error) {
    console.error("⚠️  Failed to load version-overrides.json:", error)
    return new Map()
  }
}

/**
 * Determines which versions to use for a given file.
 * @param filePath - The path to the file being processed.
 * @param defaultVersions - The default versions from package.json.
 * @param overridesMap - Map of file paths to their version overrides.
 * @returns The versions to use for this file.
 */
const getVersionsForFile = (
  filePath: string,
  defaultVersions: Dependencies,
  overridesMap: Map<string, Dependencies>
): Dependencies => {
  // Normalize the file path to match config format (relative to dist, remove dist prefix)
  const normalizedPath = filePath.replace(/\\/g, "/").replace(/^.*?\/(samples\/.+\.sol)$/, "$1")

  const override = overridesMap.get(normalizedPath)

  if (override) {
    // Merge override versions with defaults (override takes precedence)
    return { ...defaultVersions, ...override }
  }

  return defaultVersions
}

/**
 * Pins the versions of dependencies in Solidity files based on the provided glob patterns.
 * @param globPatterns - Array of glob patterns used to find Solidity files.
 * @param defaultVersions - The default object containing the dependencies and their corresponding versions.
 * @throws {Error} - If there are errors during the version pinning process.
 */
const pinVersionsInSolidityFiles = async (globPatterns: string[], defaultVersions: Dependencies) => {
  try {
    const fileArrays = await Promise.all(globPatterns.map((pattern) => glob(pattern)))
    const allFiles = fileArrays.flat()
    const errorMap: { [file: string]: Error } = {}
    const stats: PinningStats = {
      totalFiles: allFiles.length,
      packagesUpdated: {},
      filesProcessed: [],
      overridesApplied: {},
    }

    // Load version overrides configuration
    const overridesMap = loadVersionOverrides()

    allFiles.forEach((file) => {
      try {
        const originalContent = fs.readFileSync(file, "utf8")
        let content = originalContent

        // Get the appropriate versions for this file (either default or overridden)
        const versionsToUse = getVersionsForFile(file, defaultVersions, overridesMap)

        // Track if this file uses overrides
        const usesOverrides = overridesMap.has(file.replace(/\\/g, "/").replace(/^.*?\/(samples\/.+\.sol)$/, "$1"))

        Object.entries(versionsToUse).forEach(([packageName, version]) => {
          const regex = new RegExp(
            `(import[\\s\\S]*?${packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(/)(?!@${version.replace(/\./g, "\\.")})(.*?\\.sol)`,
            "g"
          )
          const newContent = content.replace(regex, `$1@${version}/$3`)

          if (newContent !== content) {
            if (!stats.packagesUpdated[packageName]) {
              stats.packagesUpdated[packageName] = 0
            }
            stats.packagesUpdated[packageName]++

            // Track which packages were overridden for this file
            if (usesOverrides && versionsToUse[packageName] !== defaultVersions[packageName]) {
              if (!stats.overridesApplied[file]) {
                stats.overridesApplied[file] = []
              }
              stats.overridesApplied[file].push(`${packageName}@${version}`)
            }
          }
          content = newContent
        })

        if (getFileHash(originalContent) !== getFileHash(content)) {
          fs.writeFileSync(file, content, "utf8")
          stats.filesProcessed.push(file)
        }
      } catch (fileError) {
        errorMap[file] = fileError as Error
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

    // Show files with overrides applied
    if (Object.keys(stats.overridesApplied).length > 0) {
      console.log("\n🎯 Files with custom version overrides:")
      Object.entries(stats.overridesApplied).forEach(([file, packages]) => {
        console.log(`- ${file}`)
        packages.forEach((pkg) => console.log(`  └─ ${pkg}`))
      })
    }

    if (stats.filesProcessed.length > 0) {
      console.log("\nUpdated files:")
      stats.filesProcessed.forEach((file) => {
        console.log(`- ${file}`)
      })
    }
    console.log("\nVersion pinning complete! ✨")
  } catch (err) {
    console.error("Error processing files:", err)
    throw err
  }
}

const packages = ["@chainlink/contracts", "@chainlink/contracts-ccip", "@chainlink/local"]
const versions = getPackageVersions("package.json", packages)

// Run the script
pinVersionsInSolidityFiles(["dist/client/samples/**/*.sol", ".vercel/output/static/samples/**/*.sol"], versions).catch(
  (error) => {
    console.error("Failed to pin versions:", error)
    process.exit(1)
  }
)
