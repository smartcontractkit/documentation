/**
 * Solana backend signer resolver service
 * Provides cached, optimized access to backend signers for transaction execution
 */

import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit"
import type { TransactionSigner } from "@solana/kit"
import { getSolanaDevnetConfig } from "@lib/core/config/index.ts"
import { ValidationError } from "../errors/base.ts"
import { AddressUtils } from "./crypto.ts"

/**
 * Cached backend signer instance
 * Pre-computed at module load for optimal performance
 */
let CACHED_BACKEND_SIGNER: TransactionSigner | null = null

/**
 * Validates a private key format (basic validation)
 */
function validatePrivateKey(privateKey: string): void {
  if (!privateKey || typeof privateKey !== "string") {
    throw new ValidationError("Private key must be a non-empty string", {
      operation: "validatePrivateKey",
    })
  }

  // Basic format validation - should be base58 encoded
  if (privateKey.length < 32) {
    throw new ValidationError("Private key appears to be too short", {
      operation: "validatePrivateKey",
      keyLength: privateKey.length,
    })
  }
}

/**
 * Creates a backend signer from private key string
 * Converts environment variable to proper Kit KeyPairSigner interface
 */
async function createBackendSigner(privateKey: string): Promise<TransactionSigner> {
  validatePrivateKey(privateKey)

  try {
    // Convert base58 private key to 32-byte Uint8Array for Kit integration
    const privateKeyBytes = await AddressUtils.base58ToBytes(privateKey)

    // Validate we have exactly 64 bytes (32 private + 32 public) or 32 bytes (just private)
    if (privateKeyBytes.length === 64) {
      // If we have 64 bytes, extract just the first 32 (private key portion)
      const privateKeyOnly = privateKeyBytes.slice(0, 32)
      return await createKeyPairSignerFromPrivateKeyBytes(privateKeyOnly)
    } else if (privateKeyBytes.length === 32) {
      // If we have 32 bytes, use directly as private key
      return await createKeyPairSignerFromPrivateKeyBytes(privateKeyBytes)
    } else {
      throw new Error(`Invalid private key length: ${privateKeyBytes.length} bytes. Expected 32 or 64 bytes.`)
    }
  } catch (error) {
    throw new ValidationError("Failed to create signer from private key", {
      operation: "createBackendSigner",
      originalError: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

/**
 * Get the backend signer for transaction execution
 * Cached for optimal performance, initialized once at startup
 *
 * @param chainName - Chain name (currently only "solana-devnet" supported)
 * @returns Backend signer instance for transaction execution
 * @throws ValidationError if configuration is invalid or chain unsupported
 */
export async function getBackendSigner(chainName = "solana-devnet"): Promise<TransactionSigner> {
  if (chainName !== "solana-devnet") {
    throw new ValidationError(`Unsupported chain: ${chainName}`, {
      operation: "getBackendSigner",
      chainName,
    })
  }

  // Return cached instance if available
  if (CACHED_BACKEND_SIGNER) {
    return CACHED_BACKEND_SIGNER
  }

  try {
    // Get configuration using centralized config system
    const chainConfig = getSolanaDevnetConfig()

    // Create and cache the signer
    CACHED_BACKEND_SIGNER = await createBackendSigner(chainConfig.payerKey)

    return CACHED_BACKEND_SIGNER
  } catch (error) {
    throw new ValidationError(`Failed to create backend signer for chain: ${chainName}`, {
      operation: "getBackendSigner",
      chainName,
      originalError: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
