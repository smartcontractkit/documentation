/**
 * Cryptographic test utilities for signature verification testing
 * Provides real Ed25519 keypair generation and SIWS message signing for robust test scenarios
 */

import { randomBytes } from "node:crypto"
import tweetnacl from "tweetnacl"
import bs58 from "bs58"
import { HMACUtils, Base64UrlUtils } from "../../core/services/crypto.ts"
import { SIWS_TEMPLATE } from "../../constants/siws-messages.ts"
import type { SIWSMetadata } from "./signature-verification.ts"

/**
 * Test keypair with public and private key components
 */
export interface TestKeyPair {
  publicKey: Uint8Array
  secretKey: Uint8Array
  publicKeyBase58: string
}

/**
 * Complete SIWS test fixture with valid cryptographic components
 */
export interface SIWSTestFixture {
  keyPair: TestKeyPair
  challenge: string
  challengeText: string
  signature: string
  metadata: SIWSMetadata
}

/**
 * Generate a real Ed25519 keypair for testing
 */
export function generateTestKeyPair(): TestKeyPair {
  const keyPair = tweetnacl.sign.keyPair()

  return {
    publicKey: keyPair.publicKey,
    secretKey: keyPair.secretKey,
    publicKeyBase58: bs58.encode(keyPair.publicKey),
  }
}

/**
 * Sign a SIWS message with a test keypair
 * Creates a real Ed25519 signature that will pass cryptographic verification
 */
export function signSIWSMessage(message: string, keyPair: TestKeyPair): string {
  const messageBytes = new TextEncoder().encode(message)
  const signature = tweetnacl.sign.detached(messageBytes, keyPair.secretKey)
  return Base64UrlUtils.fromBuffer(Buffer.from(signature))
}

/**
 * Create a valid HMAC exactly as the service does
 * The service creates HMAC from metadata buffer only, not challengeText + metadata
 */
export function createTestHMAC(metadataBuffer: Buffer, secret: string): string {
  const hmacBuffer = HMACUtils.createTimingSafeHmac(secret, metadataBuffer)
  return Base64UrlUtils.fromBuffer(hmacBuffer)
}

/**
 * Generate a complete SIWS test fixture with valid cryptography
 * All components are mathematically correct and will pass verification
 */
export function createValidSIWSFixture(params: {
  domain: string
  receiver?: string
  token: string
  host: string
  chainId: string
  ttlSec: number
  kid: string
  secret: string
  nonce?: string
}): SIWSTestFixture {
  // Always generate a new keypair and use its public key as the receiver
  // This ensures the keypair and receiver are always consistent
  const keyPair = generateTestKeyPair()
  const receiver = keyPair.publicKeyBase58

  // Generate challenge components
  const nonce = params.nonce || randomBytes(16).toString("hex")
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + params.ttlSec

  // Create SIWS challenge text using centralized template
  const challengeText = SIWS_TEMPLATE.buildChallengeText({
    domain: params.domain,
    receiver,
    tokenSymbol: params.token,
    tokenAddress: params.token,
    chainDisplay: params.chainId,
    host: params.host,
    nonce,
    issuedAt: new Date(issuedAt * 1000).toISOString(),
    expirationTime: new Date(expiresAt * 1000).toISOString(),
  })

  // Create metadata
  const metadata = {
    domain: params.domain,
    receiver,
    token: params.token,
    host: params.host,
    chainId: params.chainId,
    kid: params.kid,
    issuedAt,
    expiresAt,
    nonce,
  }

  // Create HMAC exactly as the service does
  const metadataBuffer = Buffer.from(JSON.stringify(metadata), "utf-8")
  const metadataString = Base64UrlUtils.fromBuffer(metadataBuffer)
  const hmac = createTestHMAC(metadataBuffer, params.secret)

  // Complete challenge
  const challenge = `${challengeText}|${metadataString}|${hmac}|${params.kid}`

  // Sign the challenge text with the keypair
  const signature = signSIWSMessage(challengeText, keyPair)

  return {
    keyPair,
    challenge,
    challengeText,
    signature,
    metadata,
  }
}

/**
 * Create an invalid signature for negative test cases
 */
export function createInvalidSignature(): string {
  const invalidBytes = randomBytes(64) // Wrong signature
  return Base64UrlUtils.fromBuffer(invalidBytes)
}

/**
 * Create a tampered HMAC for negative test cases
 */
export function createTamperedHMAC(): string {
  const tamperedBytes = randomBytes(32)
  return Base64UrlUtils.fromBuffer(tamperedBytes)
}
