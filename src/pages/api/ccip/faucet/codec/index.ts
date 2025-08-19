import { timingSafeEqual, createHmac } from "node:crypto"

export const prerender = false

/**
 * Faucet Codec Utilities
 *
 * Provides cryptographic primitives for SIWS-based faucet challenges:
 * - Base64URL encoding/decoding for safe transport
 * - Timing-safe HMAC creation and verification for metadata protection
 */

/**
 * Base64URL encoding/decoding utilities
 */
export const base64url = {
  fromBuffer: (b: Buffer) => b.toString("base64url"),
  toBuffer: (s: string) => Buffer.from(s, "base64url"),
}

/**
 * Creates a timing-safe HMAC using SHA256
 * @param secret - Secret key for HMAC
 * @param payload - Data to create HMAC for
 * @returns HMAC buffer
 */
export function createTimingSafeHmac(secret: string, payload: Buffer): Buffer {
  return createHmac("sha256", secret).update(payload).digest()
}

/**
 * Verifies HMAC in a timing-safe manner
 * @param hmacB64 - Base64URL encoded HMAC to verify
 * @param expectedHmac - Expected HMAC buffer
 * @returns true if HMAC is valid
 */
export function verifyTimingSafeHmac(hmacB64: string, expectedHmac: Buffer): boolean {
  try {
    const providedHmac = base64url.toBuffer(hmacB64)
    const expectedHmacB64 = base64url.fromBuffer(expectedHmac)

    return hmacB64.length === expectedHmacB64.length && timingSafeEqual(providedHmac, expectedHmac)
  } catch {
    return false
  }
}

// JWT-style payload functions removed - now using SIWS text challenges
