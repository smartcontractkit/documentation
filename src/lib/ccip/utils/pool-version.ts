/**
 * Pool Version Utilities
 *
 * Centralized utilities for handling CCIP pool version logic.
 * CCV (Cross-Chain Verifiers), threshold amounts, and custom finality
 * are only available for v2.0+ pools.
 */

import { Environment } from "~/lib/ccip/types/index.ts"
import { fetchPoolVersion } from "~/lib/ccip/graphql/services/enrichment-data-service.ts"

/**
 * Minimum major version that supports CCV features
 */
const CCV_MIN_MAJOR_VERSION = 2

/**
 * Parses a semantic version string and returns the major version number.
 * Handles various formats: "2.0.0", "1.6.0", "v1.5.0", etc.
 *
 * @param version - Version string to parse
 * @returns Major version number, or 0 if parsing fails
 */
export function parseMajorVersion(version: string): number {
  if (!version) return 0

  // Remove leading 'v' if present
  const normalized = version.toLowerCase().replace(/^v/, "")

  // Extract major version from semver format
  const match = normalized.match(/^(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }

  return 0
}

/**
 * Checks if a pool version supports CCV features (v2.0+).
 *
 * @param version - Pool version string (e.g., "2.0.0", "1.6.0")
 * @returns true if version is 2.0 or higher
 */
export function isV2Pool(version: string): boolean {
  const majorVersion = parseMajorVersion(version)
  return majorVersion >= CCV_MIN_MAJOR_VERSION
}

/**
 * Gets the effective pool version for a token on a specific chain.
 * Fetches from GraphQL, falls back to actualVersion if GraphQL has no data.
 *
 * @param environment - Network environment
 * @param tokenSymbol - Token canonical symbol (e.g., "LBTC", "LINK")
 * @param directoryKey - Chain directory key (e.g., "mainnet", "arbitrum-mainnet")
 * @param actualVersion - Actual pool version from reference data (fallback)
 * @returns Effective pool version
 */
export async function getEffectivePoolVersion(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string,
  actualVersion: string
): Promise<string> {
  const graphqlVersion = await fetchPoolVersion(environment, tokenSymbol, directoryKey)
  return graphqlVersion || actualVersion
}

/**
 * Checks if CCV features should be enabled for a token on a specific chain.
 * This is the primary function services should use to determine if CCV data
 * should be included in API responses.
 *
 * @param environment - Network environment
 * @param tokenSymbol - Token canonical symbol
 * @param directoryKey - Chain directory key
 * @param actualPoolVersion - Actual pool version from reference data
 * @returns true if CCV features should be enabled
 */
export async function shouldEnableCCVFeatures(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string,
  actualPoolVersion: string
): Promise<boolean> {
  const effectiveVersion = await getEffectivePoolVersion(environment, tokenSymbol, directoryKey, actualPoolVersion)
  return isV2Pool(effectiveVersion)
}
