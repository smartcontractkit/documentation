/**
 * Faucet Codec Utilities
 *
 * @deprecated This file re-exports cryptographic utilities from the library.
 * New code should import directly from @lib/solana/core/services/crypto.ts
 * This file is maintained for backward compatibility only.
 */

import { base64url as libraryBase64url, HMACUtils } from "@lib/solana/core/services/crypto.ts"

export const prerender = false

/**
 * @deprecated Use Base64UrlUtils from @lib/solana/core/services/crypto.ts instead
 */
export const base64url = libraryBase64url

/**
 * @deprecated Use HMACUtils.createTimingSafeHmac from @lib/solana/core/services/crypto.ts instead
 */
export function createTimingSafeHmac(secret: string, payload: Buffer): Buffer {
  return HMACUtils.createTimingSafeHmac(secret, payload)
}

/**
 * @deprecated Use HMACUtils.verifyTimingSafeHmac from @lib/solana/core/services/crypto.ts instead
 */
export function verifyTimingSafeHmac(hmacB64: string, expectedHmac: Buffer): boolean {
  return HMACUtils.verifyTimingSafeHmac(hmacB64, expectedHmac)
}
