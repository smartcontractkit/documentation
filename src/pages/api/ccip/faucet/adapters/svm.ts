import { FamilyAdapter, VerifySignatureArgs } from "@api/ccip/types/faucet.ts"
import { ensureSolAddress } from "@lib/solana/address.ts"
import { base64url, createTimingSafeHmac, verifyTimingSafeHmac } from "@api/ccip/faucet/codec/index.ts"
import { logger } from "@api/ccip/logger.ts"
import { randomBytes } from "node:crypto"
import tweetnacl from "tweetnacl"
import bs58 from "bs58"

export const prerender = false

/**
 * Solana (SVM) Family Adapter
 * Implements Kit-native address validation and Ed25519 signature verification
 */
export class SvmAdapter implements FamilyAdapter {
  /**
   * Validates Solana addresses using @solana/kit
   */
  validateAddresses(input: { token: string; receiver: string }): void {
    try {
      ensureSolAddress(input.token)
      ensureSolAddress(input.receiver)
    } catch (error) {
      throw new Error(`Invalid Solana address: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Validates token is in the allowlist
   */
  validateTokenAllowed(token: string, allowedTokens: string[]): void {
    if (!allowedTokens.includes(token)) {
      throw new Error(`Token ${token} is not in the allowlist`)
    }
  }

  /**
   * Builds a SIWS challenge for message signing
   */
  buildChallenge(args: {
    chainConfig: { faucetAddress?: string; selector: string }
    token: string
    receiver: string
    host: string
    ttlSec: number
    kid: string
  }): { challenge: string; exp: number } {
    const now = Math.floor(Date.now() / 1000)
    const exp = now + args.ttlSec
    const nonce = randomBytes(16).toString("hex")

    const domain = new URL(args.host).host
    const issuedAt = new Date(now * 1000).toISOString()
    const expirationTime = new Date(exp * 1000).toISOString()
    const chainId = args.chainConfig.selector.includes("devnet") ? "solana:devnet" : "solana:mainnet"

    // Create SIWS challenge text
    const challengeText = `${domain} wants you to sign in with your Solana account:
${args.receiver}

Requesting faucet drip for token: ${args.token}

URI: ${args.host}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}`

    // Store metadata for server-side verification
    const metadata = {
      domain,
      receiver: args.receiver,
      token: args.token,
      host: args.host,
      issuedAt: now,
      expiresAt: exp,
      nonce,
      chainId,
      kid: args.kid,
    }

    const metadataStr = JSON.stringify(metadata)
    const metadataBuffer = Buffer.from(metadataStr, "utf-8")
    const secret = process.env.FAUCET_CHALLENGE_SECRET || "dev-secret-key"
    const hmac = createTimingSafeHmac(secret, metadataBuffer)

    // Return SIWS text + metadata for verification
    const challenge = [challengeText, base64url.fromBuffer(metadataBuffer), base64url.fromBuffer(hmac), args.kid].join(
      "|"
    )

    return { challenge, exp }
  }

  /**
   * Verifies Ed25519 signature for SIWS text challenge
   */
  verifySignature(args: VerifySignatureArgs): "ok" | { code: string; message: string } {
    const startTime = Date.now()

    try {
      // 1. Parse SIWS challenge: challengeText|metadata|hmac|kid
      const parts = args.challenge.split("|")
      if (parts.length !== 4) {
        return { code: "bad_challenge", message: "Invalid SIWS challenge format" }
      }

      const [challengeText, metadataB64, hmacB64] = parts
      const metadataBuffer = base64url.toBuffer(metadataB64)

      // 2. Timing-safe HMAC verification
      const secret = process.env.FAUCET_CHALLENGE_SECRET || "dev-secret-key"
      const expectedHmac = createTimingSafeHmac(secret, metadataBuffer)

      if (!verifyTimingSafeHmac(hmacB64, expectedHmac)) {
        logger.warn({
          message: "Timing-safe HMAC verification failed for SIWS challenge",
          requestId: args.requestId,
          family: "svm",
          receiverPrefix: args.receiver.slice(0, 8),
          step: "hmac_verification",
        })
        return { code: "challenge_tampered", message: "Invalid HMAC" }
      }

      // 3. Parse and validate metadata
      interface SIWSMetadata {
        domain: string
        receiver: string
        token: string
        host: string
        issuedAt: number
        expiresAt: number
        nonce: string
        chainId: string
        kid: string
      }

      let metadata: SIWSMetadata
      try {
        const metadataStr = new TextDecoder().decode(metadataBuffer)
        metadata = JSON.parse(metadataStr) as SIWSMetadata
      } catch (error) {
        return { code: "bad_challenge", message: "Invalid metadata format" }
      }

      logger.debug({
        message: "SIWS challenge metadata parsed",
        requestId: args.requestId,
        family: "svm",
        expiresAt: metadata.expiresAt,
        issuedAt: metadata.issuedAt,
        nonce: metadata.nonce,
        step: "metadata_parsing",
      })

      // 4. Origin binding check
      if (metadata.host !== args.host) {
        return { code: "origin_mismatch", message: "Challenge origin mismatch" }
      }

      // 5. Field validation
      if (metadata.receiver !== args.receiver || metadata.token !== args.token) {
        return { code: "invalid_signature", message: "Challenge field mismatch" }
      }

      // 6. SIWS expiry check (no clock skew check needed for SIWS)
      const now = Math.floor(Date.now() / 1000)

      if (now > metadata.expiresAt) {
        logger.warn({
          message: "SIWS challenge expired",
          requestId: args.requestId,
          family: "svm",
          expiresAt: metadata.expiresAt,
          currentTime: now,
          timeRemaining: metadata.expiresAt - now,
          step: "expiry_check",
        })
        return { code: "challenge_expired", message: "Challenge expired" }
      }

      // Optional: Check if challenge is from the future (prevent replay attacks)
      const issuedSkew = now - metadata.issuedAt
      if (issuedSkew < -30) {
        // Allow 30 seconds for clock differences
        logger.warn({
          message: "SIWS challenge issued in the future",
          requestId: args.requestId,
          family: "svm",
          issuedAt: metadata.issuedAt,
          currentTime: now,
          step: "future_check",
        })
        return { code: "invalid_signature", message: "Challenge issued in the future" }
      }

      // 7. Ed25519 signature verification using tweetnacl over SIWS text
      try {
        // Decode receiver address to bytes for verification using bs58 library
        const receiverBytes = bs58.decode(args.receiver)
        const signature = base64url.toBuffer(args.signature)

        // Sign the SIWS challenge text as UTF-8 bytes
        const challengeBytes = new TextEncoder().encode(challengeText)

        const isValid = tweetnacl.sign.detached.verify(challengeBytes, signature, receiverBytes)

        const verificationTime = Date.now() - startTime

        if (isValid) {
          logger.info({
            message: "Ed25519 signature verification successful",
            requestId: args.requestId,
            family: "svm",
            receiverPrefix: args.receiver.slice(0, 8),
            verificationTimeMs: verificationTime,
            step: "signature_verification",
          })
          return "ok"
        } else {
          logger.warn({
            message: "Ed25519 signature verification failed",
            requestId: args.requestId,
            family: "svm",
            receiverPrefix: args.receiver.slice(0, 8),
            verificationTimeMs: verificationTime,
            step: "signature_verification",
          })
          return { code: "invalid_signature", message: "Signature verification failed" }
        }
      } catch (error) {
        return {
          code: "invalid_address",
          message: `Address validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
    } catch (error) {
      logger.error({
        message: "Error during signature verification",
        requestId: args.requestId,
        family: "svm",
        error: error instanceof Error ? error.message : "Unknown error",
        step: "verification_error",
      })
      return { code: "server_error", message: "Verification failed" }
    }
  }
}
