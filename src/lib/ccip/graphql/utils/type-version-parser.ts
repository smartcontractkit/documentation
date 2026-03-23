/**
 * Utilities for parsing the `typeAndVersion` field from Atlas GraphQL responses.
 *
 * Atlas stores pool metadata as a combined string, e.g.:
 * - "BurnMintTokenPool 1.5.1"
 * - "LockReleaseTokenPool 1.6.0"
 * - "USDCTokenPool 1.6.2"
 * - "ManagedTokenPool 1.6.0" (Aptos)
 *
 * These utilities extract the raw type name, semantic version, and
 * normalized pool type from this field.
 */

const VERSION_REGEX = /(\d+\.\d+\.\d+)/

/**
 * Extracts the semantic version from a typeAndVersion string.
 * @example extractVersion("BurnMintTokenPool 1.5.1") → "1.5.1"
 * @example extractVersion(null) → null
 */
export function extractVersion(typeAndVersion: string | null | undefined): string | null {
  if (!typeAndVersion) return null
  const match = typeAndVersion.match(VERSION_REGEX)
  return match ? match[1] : null
}

/**
 * Extracts the raw pool type name from a typeAndVersion string.
 * @example extractRawType("BurnMintTokenPool 1.5.1") → "BurnMintTokenPool"
 * @example extractRawType(null) → ""
 */
export function extractRawType(typeAndVersion: string | null | undefined): string {
  if (!typeAndVersion) return ""
  return typeAndVersion.replace(/\s+\d+\.\d+\.\d+.*$/, "").trim()
}

/**
 * Normalizes a raw pool type to a canonical pool type identifier.
 *
 * Known mappings:
 * - "USDCTokenPool" → "usdc"
 * - "LockReleaseTokenPool" → "lockRelease"
 * - "BurnMintTokenPool", "BurnMintTokenPoolAndProxy" → "burnMint"
 * - Unrecognized types are returned as-is (signals new/unknown pool type)
 *
 * @example normalizePoolType("BurnMintTokenPool") → "burnMint"
 * @example normalizePoolType("ManagedTokenPool") → "ManagedTokenPool"
 */
export function normalizePoolType(rawType: string): string {
  const lower = rawType.toLowerCase()
  if (lower.includes("usdc")) return "usdc"
  if (lower.includes("lockrelease")) return "lockRelease"
  if (lower.includes("burnmint") || lower.includes("burn")) return "burnMint"
  return rawType
}
