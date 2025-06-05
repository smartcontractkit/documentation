import { execSync } from "child_process"
import fs from "fs"

/**
 * Get the last modified date for a given page path
 * Uses two strategies in order of preference:
 * 1. Git commit date of the source file
 * 2. Current date as fallback (for new/untracked/dynamic files)
 */
export function getLastModifiedDate(urlPath: string): Date | null {
  try {
    const filePath = convertUrlToFilePath(urlPath)

    if (!filePath) {
      return null
    }

    // Strategy 1: Git commit date
    const gitDate = getGitLastModified(filePath)
    if (gitDate) {
      return gitDate
    }

    // Strategy 2: Fallback to current date for new/untracked files
    return new Date()
  } catch (error) {
    console.warn(`Failed to get last modified date for ${urlPath}:`, error)
    return null
  }
}

function convertUrlToFilePath(urlPath: string): string | null {
  // Handle index pages
  if (urlPath === "/" || urlPath === "") {
    return "src/pages/index.astro"
  }

  // Remove leading slash
  const cleanPath = urlPath.replace(/^\//, "")

  // Handle API reference pages - map URL paths to content file versions
  const apiReferenceMatch = cleanPath.match(/^([^/]+)\/api-reference\/(.+)$/)
  if (apiReferenceMatch) {
    const [, product, apiPath] = apiReferenceMatch

    // Convert version shorthand to full version directory names
    const versionMap: Record<string, string> = {
      v150: "v1.5.0",
      v151: "v1.5.1",
      v160: "v1.6.0",
      v023: "v0.2.3",
      // Add more version mappings as needed
    }

    // Split the path and check if it's a version or has subpaths
    const pathParts = apiPath.split("/")

    if (pathParts.length === 1) {
      // Simple version page like "evm/v150" -> "evm/v1.5.0/index.mdx"
      const versionKey = pathParts[0]
      const fullVersion = versionMap[versionKey] || versionKey
      const contentPath = `src/content/${product}/api-reference/${fullVersion}/index.mdx`
      if (fs.existsSync(contentPath)) {
        return contentPath
      }
    } else if (pathParts.length >= 2) {
      // Versioned subpath like "evm/v150/client" -> "evm/v1.5.0/client.mdx"
      const versionKey = pathParts[0]
      const fullVersion = versionMap[versionKey] || versionKey
      const subPath = pathParts.slice(1).join("/")

      // Try with the subpath
      const contentPath = `src/content/${product}/api-reference/${fullVersion}/${subPath}.mdx`
      if (fs.existsSync(contentPath)) {
        return contentPath
      }

      // Try with index in subdirectory
      const indexPath = `src/content/${product}/api-reference/${fullVersion}/${subPath}/index.mdx`
      if (fs.existsSync(indexPath)) {
        return indexPath
      }
    }
  }

  // Handle CCIP directory pages - map URLs to configuration files
  const ccipDirectoryChainMatch = cleanPath.match(/^ccip\/directory\/(mainnet|testnet)\/chain\/(.+)$/)
  if (ccipDirectoryChainMatch) {
    const [, environment] = ccipDirectoryChainMatch

    // Map CCIP directory chain URLs to their source configuration files
    // These pages are generated from the chains.json configuration files
    const configPath = `src/config/data/ccip/v1_2_0/${environment}/chains.json`
    if (fs.existsSync(configPath)) {
      return configPath
    }
  }

  // Handle CCIP directory token pages - map URLs to token configuration files
  const ccipDirectoryTokenMatch = cleanPath.match(/^ccip\/directory\/(mainnet|testnet)\/token\/(.+)$/)
  if (ccipDirectoryTokenMatch) {
    const [, environment] = ccipDirectoryTokenMatch

    // Map CCIP directory token URLs to their source configuration files
    // These pages are generated from the tokens.json configuration files
    const configPath = `src/config/data/ccip/v1_2_0/${environment}/tokens.json`
    if (fs.existsSync(configPath)) {
      return configPath
    }
  }

  // Try different file extensions and locations
  const possiblePaths = [
    `src/content/${cleanPath}.md`,
    `src/content/${cleanPath}.mdx`,
    `src/content/${cleanPath}/index.md`,
    `src/content/${cleanPath}/index.mdx`,
    `src/pages/${cleanPath}.astro`,
    `src/pages/${cleanPath}.md`,
    `src/pages/${cleanPath}.mdx`,
    `src/pages/${cleanPath}/index.astro`,
    `src/pages/${cleanPath}/index.md`,
    `src/pages/${cleanPath}/index.mdx`,
  ]

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath
    }
  }

  return null
}

function getGitLastModified(filePath: string): Date | null {
  try {
    // Get the last commit date for this file
    const gitCommand = `git log -1 --format="%ci" --follow "${filePath}"`
    const result = execSync(gitCommand, {
      encoding: "utf8",
      stdio: "pipe",
      cwd: process.cwd(),
      timeout: 5000, // 5 second timeout to prevent hanging
    })

    if (result.trim()) {
      return new Date(result.trim())
    }
  } catch (error) {
    // Git command failed - file might not be tracked or git not available
    console.debug(`Git command failed for ${filePath}:`, error)
  }

  return null
}
