import semver from "semver"
import type { ProductConfig } from "../types"
import type { Collection } from "src/content/config"
import { VERSIONS } from "@config/versions"

/**
 * Sorts version strings in descending order (newest first).
 * Uses semver comparison if versions are valid semver, falls back to string comparison.
 *
 * @param versions - Array of version strings to sort
 * @returns Sorted array with newest versions first
 *
 * @example
 * sortVersions(["v1.5.1", "v1.5.0"]) // returns ["v1.5.1", "v1.5.0"]
 */
export const sortVersions = <T extends string>(versions: ReadonlyArray<T> | T[]): T[] => {
  return [...versions].sort((a, b) => {
    if (semver.valid(a) && semver.valid(b)) {
      return semver.rcompare(a, b)
    }
    return b.localeCompare(a)
  })
}

/**
 * Checks if a version is marked as deprecated.
 *
 * @param version - Version to check
 * @param deprecatedVersions - Optional array of deprecated versions
 * @returns True if version is in deprecated list, false otherwise
 */
export const isDeprecated = <T extends string>(version: T, deprecatedVersions?: ReadonlyArray<T> | T[]): boolean => {
  if (!deprecatedVersions) return false
  return deprecatedVersions.includes(version)
}

/**
 * Gets the display label for a version, appending "(Latest)" if it's the latest version.
 *
 * @param version - Version string
 * @param isLatest - Whether this is the latest version
 * @returns Formatted version label
 *
 * @example
 * getVersionLabel("v1.5.1", true) // returns "v1.5.1 (Latest)"
 */
export const getVersionLabel = <T extends string>(version: T, isLatest: boolean): string => {
  return isLatest ? `${version} (Latest)` : version
}

/**
 * Validates that a version exists in the available versions list.
 * Falls back to first available version if invalid.
 *
 * @param version - Version to validate
 * @param availableVersions - List of valid versions
 * @returns Valid version string
 */
export const validateVersion = <T extends string>(version: T, availableVersions: ReadonlyArray<T> | T[]): T => {
  if (!availableVersions.includes(version)) {
    console.warn(`Invalid version ${version}. Falling back to first available version.`)
    return availableVersions[0]
  }
  return version
}

/**
 * Builds a URL for a different version while maintaining the current path structure.
 *
 * @param product - Product configuration
 * @param currentPath - Current URL path
 * @param currentVersion - Current version string
 * @param newVersion - Target version to build URL for
 * @returns Complete URL path for the new version
 *
 * @example
 * // Current: /ccip/api-reference/v1.5.0/client
 * // Returns: /ccip/api-reference/v1.5.1/client
 */
export const buildVersionUrl = (
  product: ProductConfig,
  currentPath: string,
  currentVersion: string,
  newVersion: string
): string => {
  // Escape special characters in version numbers for regex safety
  const escapedVersion = currentVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  // Extract the path after version using regex
  // Example: /ccip/api-reference/v1.5.0/client -> /client
  const versionPattern = new RegExp(`${product.basePath}/${escapedVersion}(/.*)?$`)
  const match = currentPath.match(versionPattern)

  const pathAfterVersion = match?.[1] || ""

  // Build the new URL preserving the path structure
  return `${product.basePath}/${newVersion}${pathAfterVersion}`
}

/**
 * Detects if a path is an API reference page and extracts product information.
 * Also determines if the page is under a versioned directory.
 *
 * @param path - URL path to analyze
 * @returns Object containing:
 *  - isApiReference: Whether this is an API reference page
 *  - product: Product identifier if found and has version config
 *  - isVersioned: Whether this page is under a version directory
 *
 * @example
 * // Returns { isApiReference: true, product: "ccip", isVersioned: true }
 * detectApiReference("/ccip/api-reference/v1.5.1/client")
 *
 * // Returns { isApiReference: true, product: "ccip", isVersioned: false }
 * detectApiReference("/ccip/api-reference/index")
 */
export const detectApiReference = (
  path: string
): { isApiReference: boolean; product?: Collection; isVersioned: boolean } => {
  // First regex: Matches API reference paths and captures product name
  // Example: /ccip/api-reference/v1.5.1 -> matches, product = "ccip"
  const versionMatch = path.match(/^\/([^/]+)\/api-reference(?:\/v\d+\.\d+\.\d+)?/)
  if (!versionMatch) return { isApiReference: false, isVersioned: false }

  const product = versionMatch[1] as Collection
  const hasVersions = getProductVersionConfig(product)

  // Second regex: Strictly checks if page is under a version directory
  // Example: /ccip/api-reference/v1.5.1/client -> matches
  // Example: /ccip/api-reference/index -> doesn't match
  const isVersioned = path.match(/^\/[^/]+\/api-reference\/v\d+\.\d+\.\d+/) !== null

  return {
    isApiReference: true,
    product: hasVersions ? product : undefined,
    isVersioned,
  }
}

/**
 * Gets the version configuration for a specific product.
 *
 * @param product - The product identifier
 * @returns Version configuration if product has versioned docs, undefined otherwise
 *
 * @example
 * const config = getProductVersionConfig("ccip")
 * if (config) {
 *   console.log(config.LATEST) // "v1.5.1"
 * }
 */
export function getProductVersionConfig(product: Collection) {
  return VERSIONS[product]
}

/**
 * Gets the release date for a specific version of a product.
 *
 * @param product - The product identifier
 * @param version - The version string (e.g., "v1.5.1")
 * @returns ISO date string of the release date if found, undefined otherwise
 *
 * @example
 * const releaseDate = getVersionReleaseDate("ccip", "v1.5.1")
 * // Returns: "2023-12-04T00:00:00Z"
 */
export function getVersionReleaseDate(product: Collection, version: string): string | undefined {
  return VERSIONS[product]?.RELEASE_DATES[version]
}

/**
 * Checks if a product has versioned API documentation.
 *
 * @param product - The product identifier
 * @returns True if the product has versioned docs, false otherwise
 *
 * @example
 * if (hasVersionedDocs("ccip")) {
 *   // Handle versioned docs
 * }
 */
export function hasVersionedDocs(product: Collection): boolean {
  return !!VERSIONS[product]
}
