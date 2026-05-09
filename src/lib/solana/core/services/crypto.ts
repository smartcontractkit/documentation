/**
 * Core cryptographic utilities for Solana operations
 * Pure utilities without business logic dependencies
 */

import { timingSafeEqual, createHmac } from "node:crypto"

/**
 * Base64URL encoding/decoding utilities
 */
export const base64url = {
  /**
   * Encode buffer to base64url string
   */
  fromBuffer: (b: Buffer): string => b.toString("base64url"),

  /**
   * Decode base64url string to buffer
   */
  toBuffer: (s: string): Buffer => Buffer.from(s, "base64url"),
}

/**
 * Base64URL utilities class (alternative API)
 */
export class Base64UrlUtils {
  /**
   * Encode buffer to base64url string
   */
  static fromBuffer(b: Buffer): string {
    return b.toString("base64url")
  }

  /**
   * Decode base64url string to buffer
   */
  static toBuffer(s: string): Buffer {
    return Buffer.from(s, "base64url")
  }
}

/**
 * HMAC utilities for secure message authentication
 */
export class HMACUtils {
  /**
   * Creates a timing-safe HMAC using SHA256
   * @param secret - Secret key for HMAC
   * @param payload - Data to create HMAC for
   * @returns HMAC buffer
   */
  static createTimingSafeHmac(secret: string, payload: Buffer): Buffer {
    return createHmac("sha256", secret).update(payload).digest()
  }

  /**
   * Verifies HMAC in a timing-safe manner
   * @param hmacB64 - Base64URL encoded HMAC to verify
   * @param expectedHmac - Expected HMAC buffer
   * @returns true if HMAC is valid
   */
  static verifyTimingSafeHmac(hmacB64: string, expectedHmac: Buffer): boolean {
    try {
      const providedHmac = base64url.toBuffer(hmacB64)
      const expectedHmacB64 = base64url.fromBuffer(expectedHmac)

      return hmacB64.length === expectedHmacB64.length && timingSafeEqual(providedHmac, expectedHmac)
    } catch {
      return false
    }
  }
}

/**
 * Address format conversion utilities
 */
export class AddressUtils {
  /**
   * Convert base58 address to bytes
   * Uses dynamic import to avoid adding bs58 as a core dependency
   */
  static async base58ToBytes(address: string): Promise<Uint8Array> {
    const bs58 = await import("bs58")
    return bs58.default.decode(address)
  }

  /**
   * Convert bytes to base58 address
   */
  static async bytesToBase58(bytes: Uint8Array): Promise<string> {
    const bs58 = await import("bs58")
    return bs58.default.encode(bytes)
  }
}
