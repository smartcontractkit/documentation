/**
 * Solana signature verification domain service
 * Provides Ed25519 cryptographic signature validation and Sign-In-With-Solana (SIWS) message processing
 * for secure authentication workflows in blockchain applications
 */

import { randomBytes } from "node:crypto"
import { ensureSolAddress } from "../../core/address/validator.ts"
import { HMACUtils, Base64UrlUtils } from "../../core/services/crypto.ts"
import { logger } from "../../../logging/index.ts"
import bs58 from "bs58"
import tweetnacl from "tweetnacl"
import { SIWS_MESSAGES, SIWS_TEMPLATE } from "../../constants/siws-messages.ts"

/**
 * Extended SIWS challenge generation parameters
 */
export interface SIWSChallengeGenerationParams {
  domain: string
  receiver: string
  token: string
  host: string
  chainId: string
  ttlSec: number
  kid: string
  secret: string
  nonce?: string
  chainDisplayName?: string
  tokenSymbol?: string
}

/**
 * SIWS signature verification parameters
 */
export interface SIWSVerificationParams {
  challenge: string
  signature: string
  receiver: string
  token: string
  host: string
  secret: string
  requestId: string
}

/**
 * SIWS signature verification result
 */
export interface SIWSVerificationResult {
  valid: boolean
  error?: {
    code: string
    message: string
  }
}

/**
 * SIWS metadata structure
 */
export interface SIWSMetadata {
  domain: string
  receiver: string
  token: string
  host: string
  issuedAt: number
  expiresAt: number
  nonce: string
  chainId: string
  kid?: string
}

/**
 * SIWS challenge result
 */
export interface SIWSChallenge {
  message?: string
  metadata: SIWSMetadata // Always generated - no longer optional
  expiresAt: number
  challenge: string
}

/**
 * Signature verification parameters
 */
export interface SignatureVerificationParams {
  message: string
  signature: Uint8Array
  publicKey: Uint8Array
}

/**
 * Verification result
 */
export type VerificationResult = { success: true } | { success: false; error: string; code: string }

/**
 * Solana signature verification service
 * Provides domain-level signature verification and SIWS challenge handling
 */
export class SolanaSignatureService {
  /**
   * Generates cryptographically secure SIWS challenge message with embedded metadata
   * Challenge includes domain binding, token information, and expiration controls
   *
   * @param params - Challenge generation parameters including domain, token, and timing constraints
   * @returns SIWS challenge structure with message text, metadata, and expiration timestamp
   */
  static generateSIWSChallenge(params: SIWSChallengeGenerationParams): SIWSChallenge {
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = now + params.ttlSec
    const nonce = params.nonce || randomBytes(16).toString("hex")

    const issuedAt = new Date(now * 1000).toISOString()
    const expirationTime = new Date(expiresAt * 1000).toISOString()

    // Construct human-readable challenge text with token and chain identification
    const tokenDisplay = params.tokenSymbol ?? params.token
    const chainDisplay = params.chainDisplayName ?? params.chainId

    const challengeText = SIWS_TEMPLATE.buildChallengeText({
      domain: params.domain,
      receiver: params.receiver,
      tokenSymbol: tokenDisplay,
      tokenAddress: params.token,
      chainDisplay,
      host: params.host,
      nonce,
      issuedAt,
      expirationTime,
    })

    // Store metadata for server-side verification
    const metadata: SIWSMetadata = {
      domain: params.domain,
      receiver: params.receiver,
      token: params.token,
      host: params.host,
      issuedAt: now,
      expiresAt,
      nonce,
      chainId: params.chainId,
      kid: params.kid,
    }

    const metadataStr = JSON.stringify(metadata)
    const metadataBuffer = Buffer.from(metadataStr, "utf-8")
    const hmac = HMACUtils.createTimingSafeHmac(params.secret, metadataBuffer)

    // Return SIWS text + metadata for verification
    const challenge = [
      challengeText,
      Base64UrlUtils.fromBuffer(metadataBuffer),
      Base64UrlUtils.fromBuffer(hmac),
      params.kid,
    ].join("|")

    return {
      challenge,
      metadata,
      expiresAt,
    }
  }

  /**
   * Performs Ed25519 signature verification using Web Crypto API
   * Validates cryptographic signatures against public keys without external dependencies
   *
   * @param params - Signature verification parameters including message, signature, and public key
   * @returns Verification result indicating success or failure with error details
   */
  static async verifyEd25519Signature(params: SignatureVerificationParams): Promise<VerificationResult> {
    try {
      // Leverage Web Crypto API for Ed25519 signature validation (Node.js 16+ compatibility)
      // Ensure proper buffer type for Web Crypto API
      const keyBuffer = params.publicKey.buffer.slice(
        params.publicKey.byteOffset,
        params.publicKey.byteOffset + params.publicKey.byteLength
      ) as ArrayBuffer
      const key = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        {
          name: "Ed25519",
          namedCurve: "Ed25519",
        },
        false,
        ["verify"]
      )

      const messageBytes = new TextEncoder().encode(params.message)
      // Ensure proper buffer type for Web Crypto API
      const signatureBuffer = params.signature.buffer.slice(
        params.signature.byteOffset,
        params.signature.byteOffset + params.signature.byteLength
      ) as ArrayBuffer
      const isValid = await crypto.subtle.verify("Ed25519", key, signatureBuffer, messageBytes)

      return isValid
        ? { success: true }
        : { success: false, error: "Signature verification failed", code: "invalid_signature" }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown verification error",
        code: "verification_error",
      }
    }
  }

  /**
   * Validates SIWS challenge structure and extracts authentication parameters
   * Ensures challenge integrity and parameter consistency for security validation
   *
   * @param challenge - SIWS challenge message to validate
   * @param expectedReceiver - Expected receiver address for validation
   * @param expectedToken - Expected token address for validation
   * @param expectedHost - Expected host for domain validation
   * @returns Validation result with metadata if successful
   */
  static validateSIWSChallenge(
    challenge: string,
    expectedReceiver: string,
    expectedToken: string,
    expectedHost: string
  ): VerificationResult & { metadata?: SIWSMetadata } {
    try {
      // Parse challenge message format for authentication parameter extraction
      // Challenge format validation ensures security parameter consistency
      const lines = challenge.split("\n")

      // Validate SIWS message structure conformance
      if (!lines[0].includes(SIWS_MESSAGES.CHALLENGE_PREFIX)) {
        return { success: false, error: "Invalid SIWS format", code: "invalid_format" }
      }

      const receiver = lines[1]
      if (receiver !== expectedReceiver) {
        return { success: false, error: "Receiver mismatch", code: "receiver_mismatch" }
      }

      // Extract token from message
      const tokenLine = lines.find((line) => line.startsWith(SIWS_MESSAGES.TOKEN_LINE_PREFIX))
      if (!tokenLine) {
        return { success: false, error: "Token not found in challenge", code: "token_missing" }
      }

      const tokenInChallenge = tokenLine.split(": ")[1]
      if (tokenInChallenge !== expectedToken) {
        return { success: false, error: "Token mismatch", code: "token_mismatch" }
      }

      // Extract and validate host
      const uriLine = lines.find((line) => line.startsWith(SIWS_MESSAGES.URI_LABEL))
      if (uriLine) {
        const hostInChallenge = uriLine.split(": ")[1]
        if (hostInChallenge !== expectedHost) {
          return { success: false, error: "Host mismatch", code: "host_mismatch" }
        }
      }

      // Extract and validate expiration
      const expLine = lines.find((line) => line.startsWith(SIWS_MESSAGES.EXPIRATION_TIME_LABEL))
      if (!expLine) {
        return { success: false, error: "Expiration time not found", code: "expiration_missing" }
      }

      const expTime = new Date(expLine.split(": ")[1]).getTime() / 1000
      const now = Math.floor(Date.now() / 1000)

      if (now > expTime) {
        return { success: false, error: "Challenge expired", code: "challenge_expired" }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Challenge validation failed",
        code: "validation_error",
      }
    }
  }

  /**
   * Comprehensive SIWS signature verification with timing-safe validation
   * Performs complete authentication workflow including HMAC verification,
   * metadata validation, expiration checks, and Ed25519 signature validation
   *
   * @param params - Complete verification parameters including challenge, signature, and context
   * @returns Verification result indicating authentication success or specific failure reason
   */
  static async verifySIWSSignature(params: SIWSVerificationParams): Promise<SIWSVerificationResult> {
    const startTime = Date.now()

    try {
      // Parse structured SIWS challenge format: challengeText|metadata|hmac|kid
      const parts = params.challenge.split("|")
      if (parts.length !== 4) {
        return { valid: false, error: { code: "bad_challenge", message: "Invalid SIWS challenge format" } }
      }

      const [challengeText, metadataB64, hmacB64] = parts
      const metadataBuffer = Base64UrlUtils.toBuffer(metadataB64)

      // Execute timing-safe HMAC validation to prevent timing attacks
      const expectedHmac = HMACUtils.createTimingSafeHmac(params.secret, metadataBuffer)

      if (!HMACUtils.verifyTimingSafeHmac(hmacB64, expectedHmac)) {
        logger.warn({
          message: "Timing-safe HMAC verification failed for SIWS challenge",
          requestId: params.requestId,
          family: "solana",
          receiverAddress: params.receiver,
          step: "hmac_verification",
        })
        return { valid: false, error: { code: "challenge_tampered", message: "Invalid HMAC" } }
      }

      // Extract and validate embedded challenge metadata
      let metadata: SIWSMetadata
      try {
        const metadataStr = new TextDecoder().decode(metadataBuffer)
        metadata = JSON.parse(metadataStr) as SIWSMetadata
      } catch (error) {
        return { valid: false, error: { code: "bad_challenge", message: "Invalid metadata format" } }
      }

      logger.debug({
        message: "SIWS challenge metadata parsed",
        requestId: params.requestId,
        family: "solana",
        expiresAt: metadata.expiresAt,
        issuedAt: metadata.issuedAt,
        nonce: metadata.nonce,
        step: "metadata_parsing",
      })

      // Verify origin binding for cross-site request forgery protection
      if (metadata.host !== params.host) {
        return { valid: false, error: { code: "origin_mismatch", message: "Challenge origin mismatch" } }
      }

      // Validate authentication parameters against expected values
      if (metadata.receiver !== params.receiver || metadata.token !== params.token) {
        return { valid: false, error: { code: "invalid_signature", message: "Challenge field mismatch" } }
      }

      // Enforce challenge expiration for replay attack prevention
      const now = Math.floor(Date.now() / 1000)

      if (now > metadata.expiresAt) {
        logger.warn({
          message: "SIWS challenge expired",
          requestId: params.requestId,
          family: "solana",
          expiresAt: metadata.expiresAt,
          currentTime: now,
          timeRemaining: metadata.expiresAt - now,
          step: "expiry_check",
        })
        return { valid: false, error: { code: "challenge_expired", message: "Challenge expired" } }
      }

      // Validate challenge timestamp to prevent future-dated challenges
      const issuedSkew = now - metadata.issuedAt
      if (issuedSkew < -30) {
        logger.warn({
          message: "SIWS challenge issued in the future",
          requestId: params.requestId,
          family: "solana",
          issuedAt: metadata.issuedAt,
          currentTime: now,
          step: "future_check",
        })
        return { valid: false, error: { code: "invalid_signature", message: "Challenge issued in the future" } }
      }

      // Execute cryptographic signature verification using Ed25519 algorithm
      try {
        const receiverBytes = bs58.decode(params.receiver)
        const signature = Base64UrlUtils.toBuffer(params.signature)
        const challengeBytes = new TextEncoder().encode(challengeText)

        const isValid = tweetnacl.sign.detached.verify(challengeBytes, signature, receiverBytes)

        const verificationTime = Date.now() - startTime

        if (isValid) {
          logger.info({
            message: "Ed25519 signature verification successful",
            requestId: params.requestId,
            family: "solana",
            receiverAddress: params.receiver,
            verificationTimeMs: verificationTime,
            step: "signature_verification",
          })
          return { valid: true }
        } else {
          logger.warn({
            message: "Ed25519 signature verification failed",
            requestId: params.requestId,
            family: "solana",
            receiverAddress: params.receiver,
            verificationTimeMs: verificationTime,
            step: "signature_verification",
          })
          return { valid: false, error: { code: "invalid_signature", message: "Signature verification failed" } }
        }
      } catch (error) {
        return {
          valid: false,
          error: {
            code: "invalid_address",
            message: `Address validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        }
      }
    } catch (error) {
      logger.error({
        message: "Error during SIWS signature verification",
        requestId: params.requestId,
        family: "solana",
        error: error instanceof Error ? error.message : "Unknown error",
        step: "verification_error",
      })
      return { valid: false, error: { code: "server_error", message: "Verification failed" } }
    }
  }

  /**
   * Validates Solana address format compliance using address validation utilities
   * Ensures address conforms to base58 encoding and length requirements
   *
   * @param address - Solana address string to validate
   * @returns Validation result indicating format compliance
   */
  static validateSolanaAddress(address: string): VerificationResult {
    try {
      ensureSolAddress(address)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid address format",
        code: "invalid_address",
      }
    }
  }
}
