/**
 * Utility to extract comprehensive version information from API reference paths
 * Eliminates code duplication between HeadSEO and VersionSelectorHead
 *
 * @example
 * // Standard API reference path
 * extractVersionInfo("ccip", "/ccip/api-reference/v1.6.0/client")
 *
 * @example
 * // VM-specific API reference path
 * extractVersionInfo("ccip", "/ccip/api-reference/evm/v1.6.0/client")
 * extractVersionInfo("ccip", "/ccip/api-reference/svm/v1.0.0/client")
 * extractVersionInfo("ccip", "/ccip/api-reference/aptos/v1.0.0/client")
 *
 * @example
 * // Adding new VM types (just add to SUPPORTED_VM_TYPES)
 * // No code changes needed in HeadSEO or VersionSelectorHead
 */

import type { Collection } from "~/content.config.ts"
import {
  validateVersion,
  sortVersions,
  buildVersionUrl,
  getProductVersionConfig,
  getVersionReleaseDate,
} from "./versions.ts"
import type { VersionInfo } from "~/utils/structuredData.ts"

/**
 * Supported VM types for API reference paths
 * Add new VMs here as they become available
 */
export const SUPPORTED_VM_TYPES = [
  "evm", // Ethereum Virtual Machine
  "svm", // Solana Virtual Machine
  "solana", // Alternative name for Solana
  "aptos", // Aptos blockchain
  "sui", // Sui blockchain
  "ton", // TON blockchain
] as const

export type VMType = (typeof SUPPORTED_VM_TYPES)[number]

/**
 * VM type aliases for backward compatibility and alternative naming
 */
export const VM_TYPE_ALIASES: Record<string, VMType> = {
  solana: "svm", // Map solana to svm for consistency
} as const

/**
 * Utility functions for VM type management
 */
export const VMTypeUtils = {
  /**
   * Check if a string is a valid VM type
   */
  isValidVMType(vmType: string): vmType is VMType {
    return SUPPORTED_VM_TYPES.includes(vmType as VMType) || vmType in VM_TYPE_ALIASES
  },

  /**
   * Normalize VM type (apply aliases)
   */
  normalizeVMType(vmType: string): VMType | null {
    if (SUPPORTED_VM_TYPES.includes(vmType as VMType)) {
      return vmType as VMType
    }
    return VM_TYPE_ALIASES[vmType] || null
  },

  /**
   * Get display name for VM type
   */
  getDisplayName(vmType: VMType): string {
    const displayNames: Record<VMType, string> = {
      evm: "Ethereum Virtual Machine",
      svm: "Solana Virtual Machine",
      solana: "Solana Virtual Machine",
      aptos: "Aptos Move",
      sui: "Sui Move",
      ton: "TON Virtual Machine",
    }
    return displayNames[vmType] || vmType.toUpperCase()
  },
} as const

export interface ExtractedVersionInfo {
  // Basic version data
  validatedVersion: string
  isNotLatest: boolean
  isDeprecated: boolean
  releaseDate: string | undefined
  vmType: string | undefined

  // Version configuration
  versionConfig: {
    LATEST: string
    ALL: readonly string[]
    DEPRECATED?: readonly string[]
  }
  sortedVersions: string[]

  // URL building
  basePath: string
  productConfig: {
    name: Collection
    basePath: string
  }
  canonicalUrl: string

  // For structuredData.ts integration
  toVersionInfo(): VersionInfo
}

/**
 * Extract all version information from a current path and product
 *
 * @param product - The product collection (ccip, data-feeds, etc.)
 * @param currentPath - Current page path
 * @returns Complete version information or null if not a versioned API reference
 */
export function extractVersionInfo(product: Collection, currentPath: string): ExtractedVersionInfo | null {
  // Create dynamic regex pattern for all supported VM types
  const vmTypesPattern = SUPPORTED_VM_TYPES.join("|")

  // Pattern matching for version detection
  const standardPathMatch = currentPath.match(new RegExp(`/${product}/api-reference/(v[^/]+)`))
  const extendedPathMatch = currentPath.match(new RegExp(`/${product}/api-reference/(?:${vmTypesPattern})/(v[^/]+)`))
  let pathVersion = extendedPathMatch?.[1] || standardPathMatch?.[1]

  // Extract VM type from the path (scalable for all supported VMs)
  let vmType: string | undefined
  if (extendedPathMatch) {
    const vmTypeMatch = currentPath.match(new RegExp(`/${product}/api-reference/(${vmTypesPattern})/`))
    const rawVmType = vmTypeMatch?.[1]

    // Apply aliases if needed (e.g., "solana" -> "svm")
    vmType = rawVmType && VM_TYPE_ALIASES[rawVmType] ? VM_TYPE_ALIASES[rawVmType] : rawVmType
  }

  // Get version configuration
  const versionConfig = getProductVersionConfig(product, vmType)
  if (!versionConfig) return null

  // Use latest version as fallback
  if (!pathVersion) {
    pathVersion = versionConfig.LATEST
  }

  // Version computations
  const validatedVersion = validateVersion(pathVersion, versionConfig.ALL)
  const sortedVersions = sortVersions(versionConfig.ALL)
  const isNotLatest = validatedVersion !== versionConfig.LATEST
  const isDeprecated = versionConfig.DEPRECATED?.includes(validatedVersion) ?? false
  const releaseDate = getVersionReleaseDate(product, validatedVersion, vmType)

  // URL building configuration
  let basePath = `/${product}/api-reference`
  if (extendedPathMatch && vmType) {
    basePath = `/${product}/api-reference/${vmType}`
  }

  const productConfig = { name: product, basePath }
  const canonicalUrl = isNotLatest
    ? buildVersionUrl(productConfig, currentPath, validatedVersion, versionConfig.LATEST).replace(/\/+$/, "")
    : currentPath

  return {
    validatedVersion,
    isNotLatest,
    isDeprecated,
    releaseDate,
    vmType,
    versionConfig,
    sortedVersions,
    basePath,
    productConfig,
    canonicalUrl,

    // Convert to VersionInfo for structuredData.ts
    toVersionInfo(): VersionInfo {
      return {
        version: validatedVersion,
        releaseDate,
        isLatest: !isNotLatest,
        isDeprecated,
        availableVersions: sortedVersions,
        vmType,
        canonicalUrl,
      }
    },
  }
}
