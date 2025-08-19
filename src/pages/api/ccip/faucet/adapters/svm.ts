import { FamilyAdapter, VerifySignatureArgs } from "../../types/faucet.ts"
import { ensureSolAddress } from "../../../../../features/ccip/solana/address.ts"
import { base64url, createTimingSafeHmac, verifyTimingSafeHmac, parsePayload, createPayload } from "../codec/index.ts"
import { LogLevel, structuredLog } from "../../utils.ts"
import { randomBytes } from "node:crypto"
import tweetnacl from "tweetnacl"
import bs58 from "bs58"

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
   * Builds an HMAC-sealed challenge for Solana
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
    const jti = randomBytes(16).toString("hex")

    // Create payload string
    const payloadStr = createPayload({
      issuer: args.host,
      family: "svm",
      faucet: args.chainConfig.faucetAddress || "",
      selector: args.chainConfig.selector,
      token: args.token,
      receiver: args.receiver,
      issuedAt: now,
      expiresAt: exp,
      jti,
      kid: args.kid,
    })

    // Create HMAC-sealed challenge
    const payload = Buffer.from(payloadStr, "utf-8")
    const secret = process.env.FAUCET_CHALLENGE_SECRET || "dev-secret-key"
    const hmac = createTimingSafeHmac(secret, payload)

    // Return opaque challenge: payload.hmac.kid
    const challenge = [base64url.fromBuffer(payload), base64url.fromBuffer(hmac), args.kid].join(".")

    return { challenge, exp }
  }

  /**
   * Verifies Ed25519 signature for Solana
   */
  verifySignature(args: VerifySignatureArgs): "ok" | { code: string; message: string } {
    const startTime = Date.now()

    try {
      // 1. Parse opaque challenge: payload.hmac.kid
      const parts = args.challenge.split(".")
      if (parts.length !== 3) {
        return { code: "bad_challenge", message: "Invalid challenge format" }
      }

      const [payloadB64, hmacB64] = parts
      const payload = base64url.toBuffer(payloadB64)

      // 2. Timing-safe HMAC verification
      const secret = process.env.FAUCET_CHALLENGE_SECRET || "dev-secret-key"
      const expectedHmac = createTimingSafeHmac(secret, payload)

      if (!verifyTimingSafeHmac(hmacB64, expectedHmac)) {
        structuredLog(LogLevel.WARN, {
          message: "Timing-safe HMAC verification failed",
          requestId: args.requestId,
          family: "svm",
          receiverPrefix: args.receiver.slice(0, 8),
          step: "hmac_verification",
        })
        return { code: "challenge_tampered", message: "Invalid HMAC" }
      }

      // 3. Parse and validate payload fields
      const payloadStr = new TextDecoder().decode(payload)
      const fields = parsePayload(payloadStr)

      structuredLog(LogLevel.DEBUG, {
        message: "Challenge payload parsed",
        requestId: args.requestId,
        family: "svm",
        expiresAt: fields.expiresAt,
        issuedAt: fields.issuedAt,
        jti: fields.jti,
        step: "payload_parsing",
      })

      // 4. Origin binding check
      if (fields.issuer !== args.host) {
        return { code: "origin_mismatch", message: "Challenge origin mismatch" }
      }

      // 5. Field validation
      if (fields.receiver !== args.receiver || fields.token !== args.token) {
        return { code: "invalid_signature", message: "Challenge field mismatch" }
      }

      // 6. Clock skew and expiry check
      const now = Math.floor(Date.now() / 1000)
      const maxClockSkew = parseInt(process.env.FAUCET_MAX_CLOCK_SKEW || "60", 10)
      const clockSkew = Math.abs(now - fields.issuedAt)

      if (clockSkew > maxClockSkew) {
        structuredLog(LogLevel.WARN, {
          message: "Clock skew too large",
          requestId: args.requestId,
          family: "svm",
          clockSkew,
          maxClockSkew,
          step: "clock_skew_check",
        })
        return { code: "challenge_expired", message: "Clock skew too large" }
      }

      if (now > fields.expiresAt) {
        structuredLog(LogLevel.WARN, {
          message: "Challenge expired",
          requestId: args.requestId,
          family: "svm",
          expiresAt: fields.expiresAt,
          currentTime: now,
          step: "expiry_check",
        })
        return { code: "challenge_expired", message: "Challenge expired" }
      }

      // 7. Ed25519 signature verification using tweetnacl
      try {
        // Decode receiver address to bytes for verification using bs58 library
        const receiverBytes = bs58.decode(args.receiver)
        const signature = base64url.toBuffer(args.signature)

        const isValid = tweetnacl.sign.detached.verify(
          payload, // Raw payload bytes (what wallet signed)
          signature, // Ed25519 signature
          receiverBytes // Public key bytes
        )

        const verificationTime = Date.now() - startTime

        if (isValid) {
          structuredLog(LogLevel.INFO, {
            message: "Ed25519 signature verification successful",
            requestId: args.requestId,
            family: "svm",
            receiverPrefix: args.receiver.slice(0, 8),
            verificationTimeMs: verificationTime,
            step: "signature_verification",
          })
          return "ok"
        } else {
          structuredLog(LogLevel.WARN, {
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
      structuredLog(LogLevel.ERROR, {
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
