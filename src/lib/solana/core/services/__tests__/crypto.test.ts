/**
 * Tests for core cryptographic utilities
 */

import { describe, it, expect } from "@jest/globals"
import { HMACUtils, Base64UrlUtils, AddressUtils, base64url } from "../crypto.ts"
import { timingSafeEqual } from "node:crypto"

describe("Base64UrlUtils", () => {
  it("should encode buffer to base64url string", () => {
    const buffer = Buffer.from("hello world", "utf-8")
    const encoded = Base64UrlUtils.fromBuffer(buffer)

    expect(encoded).toBe("aGVsbG8gd29ybGQ")
    expect(encoded).not.toContain("+")
    expect(encoded).not.toContain("/")
    expect(encoded).not.toContain("=")
  })

  it("should decode base64url string to buffer", () => {
    const base64urlString = "aGVsbG8gd29ybGQ"
    const buffer = Base64UrlUtils.toBuffer(base64urlString)

    expect(buffer.toString("utf-8")).toBe("hello world")
  })

  it("should handle round trip encoding/decoding", () => {
    const originalData = "Test data with special characters: @#$%^&*()"
    const buffer = Buffer.from(originalData, "utf-8")
    const encoded = Base64UrlUtils.fromBuffer(buffer)
    const decoded = Base64UrlUtils.toBuffer(encoded)

    expect(decoded.toString("utf-8")).toBe(originalData)
  })

  it("should be compatible with legacy base64url export", () => {
    const buffer = Buffer.from("compatibility test", "utf-8")
    const newApiResult = Base64UrlUtils.fromBuffer(buffer)
    const legacyApiResult = base64url.fromBuffer(buffer)

    expect(newApiResult).toBe(legacyApiResult)
  })
})

describe("HMACUtils", () => {
  const testSecret = "test-secret-key"
  const testData = Buffer.from("test message", "utf-8")

  it("should create timing-safe HMAC", () => {
    const hmac = HMACUtils.createTimingSafeHmac(testSecret, testData)

    expect(Buffer.isBuffer(hmac)).toBe(true)
    expect(hmac.length).toBe(32) // SHA256 output is 32 bytes
  })

  it("should create consistent HMAC for same input", () => {
    const hmac1 = HMACUtils.createTimingSafeHmac(testSecret, testData)
    const hmac2 = HMACUtils.createTimingSafeHmac(testSecret, testData)

    expect(timingSafeEqual(hmac1, hmac2)).toBe(true)
  })

  it("should create different HMAC for different secrets", () => {
    const hmac1 = HMACUtils.createTimingSafeHmac("secret1", testData)
    const hmac2 = HMACUtils.createTimingSafeHmac("secret2", testData)

    expect(timingSafeEqual(hmac1, hmac2)).toBe(false)
  })

  it("should verify valid HMAC", () => {
    const hmac = HMACUtils.createTimingSafeHmac(testSecret, testData)
    const hmacB64 = Base64UrlUtils.fromBuffer(hmac)

    const isValid = HMACUtils.verifyTimingSafeHmac(hmacB64, hmac)
    expect(isValid).toBe(true)
  })

  it("should reject invalid HMAC", () => {
    const hmac = HMACUtils.createTimingSafeHmac(testSecret, testData)
    const wrongSecret = HMACUtils.createTimingSafeHmac("wrong-secret", testData)
    const wrongHmacB64 = Base64UrlUtils.fromBuffer(wrongSecret)

    const isValid = HMACUtils.verifyTimingSafeHmac(wrongHmacB64, hmac)
    expect(isValid).toBe(false)
  })

  it("should handle invalid base64url in verification", () => {
    const hmac = HMACUtils.createTimingSafeHmac(testSecret, testData)

    const isValid = HMACUtils.verifyTimingSafeHmac("invalid-base64url!!!", hmac)
    expect(isValid).toBe(false)
  })
})

describe("AddressUtils", () => {
  // Mock base58 address (32 bytes encoded)
  const validSolanaAddress = "11111111111111111111111111111111"

  it("should convert base58 to bytes", async () => {
    const bytes = await AddressUtils.base58ToBytes(validSolanaAddress)

    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.length).toBeGreaterThan(0)
  })

  it("should convert bytes back to base58", async () => {
    const originalBytes = await AddressUtils.base58ToBytes(validSolanaAddress)
    const address = await AddressUtils.bytesToBase58(originalBytes)

    expect(address).toBe(validSolanaAddress)
  })

  it("should handle round trip conversion", async () => {
    const originalAddress = validSolanaAddress
    const bytes = await AddressUtils.base58ToBytes(originalAddress)
    const roundTripAddress = await AddressUtils.bytesToBase58(bytes)

    expect(roundTripAddress).toBe(originalAddress)
  })
})

// Integration test for HMAC workflow
describe("HMAC Integration Workflow", () => {
  it("should complete full HMAC challenge workflow", () => {
    const secret = "challenge-secret"
    const metadata = {
      domain: "docs.chain.link",
      receiver: "GjHyouYUmxeMYdYfHqPp9okaJpNL5chD7k5t2X8QSF7k",
      token: "BnMTokenAddress12345678",
      host: "https://docs.chain.link",
      issuedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 300,
      nonce: "test-nonce-123456789abcdef0",
      chainId: "solana:devnet",
    }

    // 1. Create metadata buffer and HMAC (simulating challenge creation)
    const metadataStr = JSON.stringify(metadata)
    const metadataBuffer = Buffer.from(metadataStr, "utf-8")
    const hmac = HMACUtils.createTimingSafeHmac(secret, metadataBuffer)

    // 2. Encode for transport
    const metadataB64 = Base64UrlUtils.fromBuffer(metadataBuffer)
    const hmacB64 = Base64UrlUtils.fromBuffer(hmac)

    // 3. Simulate verification (what would happen on server)
    const receivedMetadataBuffer = Base64UrlUtils.toBuffer(metadataB64)
    const expectedHmac = HMACUtils.createTimingSafeHmac(secret, receivedMetadataBuffer)
    const isValidHmac = HMACUtils.verifyTimingSafeHmac(hmacB64, expectedHmac)

    // 4. Verify metadata integrity
    const reconstructedMetadata = JSON.parse(receivedMetadataBuffer.toString("utf-8"))

    expect(isValidHmac).toBe(true)
    expect(reconstructedMetadata).toEqual(metadata)
    expect(reconstructedMetadata.receiver).toBe(metadata.receiver)
    expect(reconstructedMetadata.token).toBe(metadata.token)
  })
})
