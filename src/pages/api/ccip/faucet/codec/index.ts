import { timingSafeEqual, createHmac } from "node:crypto"

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

/**
 * Parses a challenge payload string into structured fields
 * @param payloadStr - UTF-8 decoded payload string
 * @returns Parsed challenge fields
 */
export function parsePayload(payloadStr: string): {
  issuer: string
  family: string
  faucet: string
  selector: string
  token: string
  receiver: string
  issuedAt: number
  expiresAt: number
  jti: string
  kid: string
} {
  const lines = payloadStr.trim().split("\n")
  const fields: Record<string, string> = {}

  for (const line of lines) {
    if (line.includes("=")) {
      const [key, value] = line.split("=", 2)
      fields[key] = value
    }
  }

  // Validate required fields
  const requiredFields = [
    "issuer",
    "family",
    "faucet",
    "selector",
    "token",
    "receiver",
    "issuedAt",
    "expiresAt",
    "jti",
    "kid",
  ]

  for (const field of requiredFields) {
    if (!fields[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  }

  return {
    issuer: fields.issuer,
    family: fields.family,
    faucet: fields.faucet,
    selector: fields.selector,
    token: fields.token,
    receiver: fields.receiver,
    issuedAt: parseInt(fields.issuedAt, 10),
    expiresAt: parseInt(fields.expiresAt, 10),
    jti: fields.jti,
    kid: fields.kid,
  }
}

/**
 * Creates a challenge payload string
 * @param fields - Challenge fields
 * @returns UTF-8 encoded payload string
 */
export function createPayload(fields: {
  issuer: string
  family: string
  faucet: string
  selector: string
  token: string
  receiver: string
  issuedAt: number
  expiresAt: number
  jti: string
  kid: string
}): string {
  return [
    "FaucetChallengeV1",
    `issuer=${fields.issuer}`,
    `family=${fields.family}`,
    `faucet=${fields.faucet}`,
    `selector=${fields.selector}`,
    `token=${fields.token}`,
    `receiver=${fields.receiver}`,
    `issuedAt=${fields.issuedAt}`,
    `expiresAt=${fields.expiresAt}`,
    `jti=${fields.jti}`,
    `kid=${fields.kid}`,
  ].join("\n")
}
