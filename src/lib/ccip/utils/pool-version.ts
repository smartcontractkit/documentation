/**
 * Pool Version Utilities
 *
 * Centralized utilities for handling CCIP pool version logic.
 * CCV (Cross-Chain Verifiers), threshold amounts, and custom finality
 * are only available for v2.0+ pools.
 */

import { Environment } from "~/lib/ccip/types/index.ts"

// Import pool version overrides for testing/mocking v2.0 behavior
import poolVersionOverridesMainnet from "~/__mocks__/pool-version-overrides-mainnet.json" with { type: "json" }
import poolVersionOverridesTestnet from "~/__mocks__/pool-version-overrides-testnet.json" with { type: "json" }

/**
 * Minimum major version that supports CCV features
 */
const CCV_MIN_MAJOR_VERSION = 2

/**
 * Pool version overrides type
 * Token -> Chain (directory key) -> version override
 */
type PoolVersionOverrides = Record<string, Record<string, string>>

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
 * Loads pool version overrides for the specified environment.
 * Overrides allow testing v2.0 behavior without modifying real token data.
 *
 * @param environment - Network environment (mainnet/testnet)
 * @returns Pool version overrides map
 */
export function loadPoolVersionOverrides(environment: Environment): PoolVersionOverrides {
  if (environment === Environment.Mainnet) {
    return poolVersionOverridesMainnet as PoolVersionOverrides
  }
  return poolVersionOverridesTestnet as PoolVersionOverrides
}

/**
 * Gets the effective pool version for a token on a specific chain.
 * Checks for mock overrides first, then falls back to the actual pool version.
 *
 * @param environment - Network environment
 * @param tokenSymbol - Token canonical symbol (e.g., "LBTC", "LINK")
 * @param directoryKey - Chain directory key (e.g., "mainnet", "arbitrum-mainnet")
 * @param actualVersion - Actual pool version from token data
 * @returns Effective pool version (override or actual)
 */
export function getEffectivePoolVersion(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string,
  actualVersion: string
): string {
  const overrides = loadPoolVersionOverrides(environment)

  // Check for override
  const tokenOverrides = overrides[tokenSymbol]
  if (tokenOverrides && tokenOverrides[directoryKey]) {
    return tokenOverrides[directoryKey]
  }

  return actualVersion
}

/**
 * Checks if CCV features should be enabled for a token on a specific chain.
 * This is the primary function services should use to determine if CCV data
 * should be included in API responses.
 *
 * @param environment - Network environment
 * @param tokenSymbol - Token canonical symbol
 * @param directoryKey - Chain directory key
 * @param actualPoolVersion - Actual pool version from token data
 * @returns true if CCV features should be enabled
 */
export function shouldEnableCCVFeatures(
  environment: Environment,
  tokenSymbol: string,
  directoryKey: string,
  actualPoolVersion: string
): boolean {
  const effectiveVersion = getEffectivePoolVersion(environment, tokenSymbol, directoryKey, actualPoolVersion)
  return isV2Pool(effectiveVersion)
}
