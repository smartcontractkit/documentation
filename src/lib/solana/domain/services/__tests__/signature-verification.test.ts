/**
 * Tests for Solana signature verification domain service with real cryptographic infrastructure
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals"
import { SolanaSignatureService } from "../signature-verification.ts"
import type { SIWSChallengeGenerationParams, SIWSVerificationParams } from "../signature-verification.ts"
import {
  generateTestKeyPair,
  createValidSIWSFixture,
  createInvalidSignature,
  createTamperedHMAC,
  type SIWSTestFixture,
} from "../crypto-test-utils.ts"

// Mock the logger
jest.mock("../../../../logging/index.ts", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

// No mocking of crypto libraries - we use real cryptography for proper testing

describe("SolanaSignatureService", () => {
  let validFixture: SIWSTestFixture

  const mockParams: SIWSChallengeGenerationParams = {
    domain: "docs.chain.link",
    receiver: "GjHyouYUmxeMYdYfHqPp9okaJpNL5chD7k5t2X8QSF7k",
    token: "BnMTokenAddress12345678901234567890123456789",
    host: "https://docs.chain.link",
    chainId: "solana:devnet",
    ttlSec: 300,
    kid: "test-kid-123",
    secret: "test-secret-key",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Generate fresh cryptographic test fixtures for each test
    validFixture = createValidSIWSFixture(mockParams)
  })

  describe("generateSIWSChallenge", () => {
    it("should generate valid SIWS challenge", () => {
      const result = SolanaSignatureService.generateSIWSChallenge(mockParams)

      expect(result).toHaveProperty("challenge")
      expect(result).toHaveProperty("metadata")
      expect(result).toHaveProperty("expiresAt")

      // Challenge should be pipe-delimited format: challengeText|metadata|hmac|kid
      const parts = result.challenge.split("|")
      expect(parts).toHaveLength(4)

      // Verify challenge text format
      const challengeText = parts[0]
      expect(challengeText).toContain(mockParams.domain)
      expect(challengeText).toContain(mockParams.receiver)
      expect(challengeText).toContain(mockParams.token)
      expect(challengeText).toContain(mockParams.host)
      expect(challengeText).toContain(mockParams.chainId)
    })

    it("should include proper SIWS format elements", () => {
      const result = SolanaSignatureService.generateSIWSChallenge(mockParams)
      const challengeText = result.challenge.split("|")[0]

      // Check SIWS standard format
      expect(challengeText).toContain("wants you to sign a faucet request with your Solana account:")
      expect(challengeText).toContain("URI:")
      expect(challengeText).toContain("Version: 1")
      expect(challengeText).toContain("Nonce:")
      expect(challengeText).toContain("Issued At:")
      expect(challengeText).toContain("Expiration Time:")
      expect(challengeText).toContain("⛽ You are requesting test tokens from the")
      expect(challengeText).toContain("🪙 Token:")
    })

    it("should set proper expiration time", () => {
      const beforeGeneration = Math.floor(Date.now() / 1000)
      const result = SolanaSignatureService.generateSIWSChallenge(mockParams)
      const afterGeneration = Math.floor(Date.now() / 1000)

      expect(result.expiresAt).toBeGreaterThan(beforeGeneration + mockParams.ttlSec - 1)
      expect(result.expiresAt).toBeLessThan(afterGeneration + mockParams.ttlSec + 1)
    })

    it("should include metadata with all required fields", () => {
      const result = SolanaSignatureService.generateSIWSChallenge(mockParams)

      expect(result.metadata).toHaveProperty("domain", mockParams.domain)
      expect(result.metadata).toHaveProperty("receiver", mockParams.receiver)
      expect(result.metadata).toHaveProperty("token", mockParams.token)
      expect(result.metadata).toHaveProperty("host", mockParams.host)
      expect(result.metadata).toHaveProperty("chainId", mockParams.chainId)
      expect(result.metadata).toHaveProperty("kid", mockParams.kid)
      expect(result.metadata).toHaveProperty("issuedAt")
      expect(result.metadata).toHaveProperty("expiresAt")
      expect(result.metadata).toHaveProperty("nonce")

      expect(typeof result.metadata.issuedAt).toBe("number")
      expect(typeof result.metadata.expiresAt).toBe("number")
      expect(typeof result.metadata.nonce).toBe("string")
      expect(result.metadata.nonce.length).toBe(32) // 16 bytes hex = 32 chars
    })

    it("should use provided nonce when given", () => {
      const customNonce = "custom-nonce-1234567890abcdef"
      const paramsWithNonce = { ...mockParams, nonce: customNonce }

      const result = SolanaSignatureService.generateSIWSChallenge(paramsWithNonce)

      expect(result.metadata.nonce).toBe(customNonce)
    })

    it("should generate different nonces for different calls", () => {
      const result1 = SolanaSignatureService.generateSIWSChallenge(mockParams)
      const result2 = SolanaSignatureService.generateSIWSChallenge(mockParams)

      expect(result1.metadata.nonce).not.toBe(result2.metadata.nonce)
    })
  })

  describe("verifySIWSSignature", () => {
    let validVerificationParams: SIWSVerificationParams

    beforeEach(() => {
      // Use real cryptographic fixture with valid challenge and signature
      validVerificationParams = {
        challenge: validFixture.challenge,
        signature: validFixture.signature,
        receiver: validFixture.keyPair.publicKeyBase58,
        token: mockParams.token,
        host: mockParams.host,
        secret: mockParams.secret,
        requestId: "test-request-123",
      }
    })

    it("should verify valid signature", async () => {
      const result = await SolanaSignatureService.verifySIWSSignature(validVerificationParams)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should reject malformed challenge", async () => {
      const invalidParams = {
        ...validVerificationParams,
        challenge: "invalid-challenge-format",
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("bad_challenge")
      expect(result.error?.message).toBe("Invalid SIWS challenge format")
    })

    it("should reject challenge with tampered HMAC", async () => {
      const parts = validFixture.challenge.split("|")
      // Tamper with the HMAC using our test utility
      parts[2] = createTamperedHMAC()
      const tamperedChallenge = parts.join("|")

      const invalidParams = {
        ...validVerificationParams,
        challenge: tamperedChallenge,
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("challenge_tampered")
      expect(result.error?.message).toBe("Invalid HMAC")
    })

    it("should reject challenge with origin mismatch", async () => {
      const invalidParams = {
        ...validVerificationParams,
        host: "https://malicious-site.com",
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("origin_mismatch")
      expect(result.error?.message).toBe("Challenge origin mismatch")
    })

    it("should reject challenge with receiver mismatch", async () => {
      const differentKeyPair = generateTestKeyPair()
      const invalidParams = {
        ...validVerificationParams,
        receiver: differentKeyPair.publicKeyBase58, // Different receiver
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("invalid_signature")
      expect(result.error?.message).toBe("Challenge field mismatch")
    })

    it("should reject challenge with token mismatch", async () => {
      const invalidParams = {
        ...validVerificationParams,
        token: "DifferentTokenAddress123456789012345678901",
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("invalid_signature")
      expect(result.error?.message).toBe("Challenge field mismatch")
    })

    it("should reject expired challenge", async () => {
      // Create an expired challenge fixture
      const expiredParams = { ...mockParams, ttlSec: -100 } // Already expired
      const expiredFixture = createValidSIWSFixture(expiredParams)

      const invalidParams = {
        ...validVerificationParams,
        challenge: expiredFixture.challenge,
        receiver: expiredFixture.keyPair.publicKeyBase58,
        signature: expiredFixture.signature,
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("challenge_expired")
      expect(result.error?.message).toBe("Challenge expired")
    })

    it("should reject challenge from future", async () => {
      // Mock Date.now to simulate a challenge issued in the future
      const originalNow = Date.now
      Date.now = jest.fn(() => 1000000000000) // Fixed timestamp

      try {
        // Generate challenge with future timestamp
        const futureParams = { ...mockParams }
        const futureFixture = createValidSIWSFixture(futureParams)

        // Reset Date.now to earlier time
        Date.now = jest.fn(() => 999999900000) // 100 seconds earlier

        const invalidParams = {
          ...validVerificationParams,
          challenge: futureFixture.challenge,
          receiver: futureFixture.keyPair.publicKeyBase58,
          signature: futureFixture.signature,
        }

        const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

        expect(result.valid).toBe(false)
        expect(result.error?.code).toBe("invalid_signature")
        expect(result.error?.message).toBe("Challenge issued in the future")
      } finally {
        Date.now = originalNow
      }
    })

    it("should handle signature verification errors gracefully", async () => {
      // Create invalid signature to trigger verification failure
      const invalidParams = {
        ...validVerificationParams,
        signature: createInvalidSignature(),
      }

      const result = await SolanaSignatureService.verifySIWSSignature(invalidParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("invalid_signature")
      expect(result.error?.message).toBe("Signature verification failed")
    })
  })

  describe("validateSolanaAddress", () => {
    it("should validate correct Solana address", () => {
      const validAddress = "GjHyouYUmxeMYdYfHqPp9okaJpNL5chD7k5t2X8QSF7k"

      const result = SolanaSignatureService.validateSolanaAddress(validAddress)

      expect(result.success).toBe(true)
    })

    it("should reject invalid address format", () => {
      const invalidAddress = "invalid-address"

      const result = SolanaSignatureService.validateSolanaAddress(invalidAddress)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe("invalid_address")
        expect(result.error).toContain("Invalid")
      }
    })
  })

  describe("Integration Tests", () => {
    it("should complete full SIWS challenge and verification workflow", async () => {
      // 1. Create complete valid fixture with real cryptography
      const integrationFixture = createValidSIWSFixture(mockParams)

      // 2. Prepare verification params with the fixture data
      const verificationParams: SIWSVerificationParams = {
        challenge: integrationFixture.challenge,
        signature: integrationFixture.signature,
        receiver: integrationFixture.keyPair.publicKeyBase58,
        token: mockParams.token,
        host: mockParams.host,
        secret: mockParams.secret,
        requestId: "integration-test-123",
      }

      // 3. Verify signature - should pass with real cryptography
      const verificationResult = await SolanaSignatureService.verifySIWSSignature(verificationParams)

      expect(verificationResult.valid).toBe(true)
      expect(verificationResult.error).toBeUndefined()
    })

    it("should ensure challenge cannot be replayed with different parameters", async () => {
      // 1. Use valid fixture challenge
      const originalFixture = createValidSIWSFixture(mockParams)
      const differentKeyPair = generateTestKeyPair()

      // 2. Try to verify with different receiver but same challenge
      const tamperedParams: SIWSVerificationParams = {
        challenge: originalFixture.challenge,
        signature: originalFixture.signature,
        receiver: differentKeyPair.publicKeyBase58, // Different receiver
        token: mockParams.token,
        host: mockParams.host,
        secret: mockParams.secret,
        requestId: "replay-test-123",
      }

      // 3. Verification should fail due to receiver mismatch
      const result = await SolanaSignatureService.verifySIWSSignature(tamperedParams)

      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe("invalid_signature")
    })
  })
})
